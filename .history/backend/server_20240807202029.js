const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const multer = require('multer');
const Tesseract = require('tesseract.js');
const axios = require('axios');
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { v4: uuidv4, validate } = require("uuid");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const crypto = require("crypto");

const xlsx = require("xlsx");

const app = express();

const upload = multer({ dest: 'uploads/' });

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(cookieParser());

let db;

function handleDisconnect() {
  db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "cloud",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  db.connect(function (err) {
    if (err) {
      console.error("Error connecting to MySQL:", err);
      setTimeout(handleDisconnect, 2000); // Reconnexion après 2 secondes
    } else {
      console.log("Connected to the MySQL database");
    }
  });

  db.on("error", function (err) {
    console.error("MySQL error:", err);
    if (err.code === "PROTOCOL_CONNECTION_LOST") {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();

// Define routes
app.get("/", (req, res) => {
  res.json("Bonjour depuis le serveur Node.js !");
});

/************************************************************** */


// Configurez votre clé API OpenAI
const openaiApiKey = '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';

app.post('/upload', upload.single('file'), async (req, res) => {
    const file = req.file;

    try {
        // Utilisez Tesseract.js pour l'OCR
        const { data: { text } } = await Tesseract.recognize(
            file.path,
            'eng',
            { logger: m => console.log(m) }
        );

        // Utilisez ChatGPT pour structurer les données
        const gptResponse = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "GPT-4o mini",
                messages: [{ role: "user", content: `Extract the date, invoice number, and amount from the following text: ${text}` }],
            },
            {
                headers: {
                    'Authorization': `Bearer ${openaiApiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        const extractedData = gptResponse.data.choices[0].message.content;
        res.json(JSON.parse(extractedData));
    } catch (error) {
        res.status(500).send(error.message);
    }
});

/*************************************************************** */

const secretKey = "MY_SECRET_KEY_WAS_ABCD1234";
const refreshTokenKey = "my-refresh-token-secret-key";

// Middleware pour vérifier le token et ajouter l'utilisateur dans la requête

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) return res.status(401).json({ message: "Token manquant" });

  jwt.verify(token.split(" ")[1], secretKey, (err, decoded) => {
    if (err) {
      console.error("Erreur lors de la vérification du token:", err);
      if (err.name === "TokenExpiredError") {
        return res
          .status(401)
          .json({ message: "Token expiré", expiredAt: err.expiredAt });
      } else {
        return res.status(403).json({ message: "Token invalide" });
      }
    }

    req.user = {
      id: decoded.id,
      identite: decoded.identite,
      role: decoded.role,
      code_entreprise: decoded.code_entreprise,
      email: decoded.email,
      code_user: decoded.code_user,
      position: decoded.position,
      tel: decoded.tel,
      mot_de_passe: decoded.mot_de_passe,
    };
    next();
  });
};

app.post("/refresh-token", (req, res) => {
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) {
    return res.status(403).send({ message: "No refresh token provided." });
  }

  jwt.verify(refreshToken, refreshTokenKey, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" });
    }

    const newToken = jwt.sign(
      { id: decoded.id, identite: decoded.identite, role: decoded.role },
      secretKey,
      {
        expiresIn: 86400, // 24 hours
      }
    );

    res.send({ token: newToken });
  });
});

// Route protégée nécessitant une authentification
app.get("/home", verifyToken, (req, res) => {
  res.json({ message: "Bienvenue sur la page d'accueil", user: req.user });
});

/*************************** notifications ********************************* */

// Route pour récupérer les notifications d'un utilisateur
app.get("/notifications/:userId", (req, res) => {
  const userId = req.params.userId;
  const q = "SELECT * FROM notifications WHERE user_id = ?";

  db.query(q, [userId], (err, data) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Erreur lors de la récupération des notifications." });
    }
    return res.status(200).json(data);
  });
});

// Add Notification
app.post("/notifications", verifyToken, (req, res) => {
  const { userId, message } = req.body;

  // Validate input
  if (!userId || !message) {
    console.error("Validation Error:", { userId, message }); // Debugging line
    return res.status(400).json({ error: "userId and message are required" });
  }

  // Add notification to the database
  const notificationQuery =
    "INSERT INTO notifications (user_id, message) VALUES (?, ?)";
  db.query(notificationQuery, [userId, message], (err, result) => {
    if (err) {
      console.error("Error adding notification:", err);
      return res.status(500).json({ error: "Failed to add notification" });
    }
    return res.status(200).json({ message: "Notification added successfully" });
  });
});

// Route pour supprimer une notification par son ID
app.delete("/notifications/:id", (req, res) => {
  const notificationId = req.params.id;
  const q = "DELETE FROM notifications WHERE id = ?";

  db.query(q, [notificationId], (err, data) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Erreur lors de la suppression de la notification." });
    }
    return res
      .status(200)
      .json({ message: "Notification supprimée avec succès" });
  });
});

// Marquer toutes les notifications comme lues pour un utilisateur
app.post("/notifications/markAsRead", (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  const q = "UPDATE notifications SET `read` = 1 WHERE user_id = ?";
  db.query(q, [userId], (err, data) => {
    if (err) {
      console.error("Error marking notifications as read:", err);
      return res
        .status(500)
        .json({ error: "Failed to mark notifications as read" });
    }
    return res.status(200).json({ message: "Notifications marked as read" });
  });
});

/************************************************************************** */
/***************************Register /login ******************************* */

// POST - Forget Password
app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(20).toString("hex");
  const expiration = Date.now() + 3600000; // 1 hour from now

  db.query(
    "UPDATE utilisateurs SET resetPasswordToken = ?, resetPasswordExpires = ? WHERE email = ?",
    [token, expiration, email],
    (err, result) => {
      if (err) return res.status(500).send("Error updating the user.");

      const transporter = nodemailer.createTransport({
        service: "Gmail",
        auth: {
          user: "your_email@gmail.com",
          pass: "your_password",
        },
      });

      const mailOptions = {
        to: email,
        from: "your_email@gmail.com",
        subject: "Password Reset",
        text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n
          Please click on the following link, or paste this into your browser to complete the process:\n\n
          http://localhost:3000/reset-password/${token}\n\n
          If you did not request this, please ignore this email and your password will remain unchanged.\n`,
      };

      transporter.sendMail(mailOptions, (err, response) => {
        if (err) return res.status(500).send("Error sending email.");
        res.status(200).send("Password reset link sent.");
      });
    }
  );
});

// POST - Reset Password
app.post("/reset-password", (req, res) => {
  const { token, password } = req.body;

  db.query(
    "SELECT * FROM utilisateurs WHERE resetPasswordToken = ? AND resetPasswordExpires > ?",
    [token, Date.now()],
    (err, results) => {
      if (err || results.length === 0)
        return res
          .status(400)
          .send("Password reset token is invalid or has expired.");

      const hashedPassword = crypto
        .createHash("sha256")
        .update(password)
        .digest("hex");

      db.query(
        "UPDATE utilisateurs SET mot_de_passe = ?, resetPasswordToken = NULL, resetPasswordExpires = NULL WHERE resetPasswordToken = ?",
        [hashedPassword, token],
        (err, result) => {
          if (err) return res.status(500).send("Error resetting the password.");
          res.status(200).send("Password has been reset.");
        }
      );
    }
  );
});

// Verification Email
const generateVerificationCode = () => {
  return uuidv4();
};

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "nourssinenef@gmail.com",
    pass: "tjxj umay qdaw ueil",
  },
});

const sendVerificationEmail = async (email, verificationCode) => {
  let info = await transporter.sendMail({
    from: {
      name: "Compta",
      address: "nourssinenef@gmail.com",
    },
    to: email,
    subject: "Verify Your Email Address",
    text: `Please click on the following link to verify your email address: http://localhost:5000/verify-email/${verificationCode}`,
    html: `<p>Please click on the following link to verify your email address: <a href="http://localhost:5000/verify-email/${verificationCode}">Verify Email Address</a></p>`,
  });

  console.log("Email sent: %s", info.messageId);
};

//Route to handle email verification
app.get("/verify-email/:verificationCode", (req, res) => {
  const verificationCode = req.params.verificationCode;

  res.send("Email address verified successfully.");
});

// Register Route
app.post("/register", async (req, res) => {
  const {
    code_entreprise,
    code_user,
    identite,
    position,
    tel,
    email,
    mot_de_passe,
    role,
  } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
    const sql =
      "INSERT INTO utilisateurs (code_entreprise, code_user, identite, position, tel, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      code_entreprise,
      code_user,
      identite,
      position,
      tel,
      email,
      hashedPassword,
      role,
    ];

    db.query(sql, values, async (err, result) => {
      if (err) {
        console.error("Erreur lors de l'inscription :", err);
        return res.status(500).json({ error: "Erreur du serveur" });
      }

      // Si aucune erreur ne s'est produite lors de l'insertion, renvoyer une réponse réussie
      return res.status(200).json({
        message: "User registered successfully.",
      });
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Login route
app.post("/login", (req, res) => {
  const { identite, mot_de_passe } = req.body;

  const sql = "SELECT * FROM utilisateurs WHERE identite = ?";
  db.query(sql, [identite], (err, results) => {
    if (err) {
      console.error("Erreur lors de la connexion :", err);
      return res.status(500).json({ message: "Erreur du serveur" });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    bcrypt.compare(mot_de_passe, results[0].mot_de_passe, (err, isMatch) => {
      if (err) {
        console.error("Erreur lors de la comparaison des mots de passe :", err);
        return res.status(500).json({ message: "Erreur du serveur" });
      }

      if (isMatch) {
        const token = jwt.sign(
          {
            identite,
            role: results[0].role,
            id: results[0].id,
            code_entreprise: results[0].code_entreprise,
            email: results[0].email,
            tel: results[0].tel,
            code_user: results[0].code_user,
            position: results[0].position,
          },
          secretKey,
          { expiresIn: "7d" }
        );
        const user = {
          id: results[0].id,
          identite: results[0].identite,
          role: results[0].role,
          email: results[0].email,
          tel: results[0].tel,
          code_entreprise: results[0].code_entreprise,
          code_user: results[0].code_user,
          position: results[0].position,
        };
        res.json({ token, user });
      } else {
        res.status(401).json({ message: "Identifiants invalides" });
      }
    });
  });
});

// Logout route
app.post("/logout", (req, res) => {
  try {
    // Supprimer le token JWT du stockage local
    localStorage.removeItem("token");

    // Envoyer une réponse de succès
    res.status(200).json({ message: "Déconnexion réussie" });
  } catch (error) {
    // En cas d'erreur, répondre avec un statut 500 et un message d'erreur
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la déconnexion" });
  }
});

/******************************************************************************** */
/*****************************Taux retenue a la Source*************************** */

// Route pour obtenir tous les taux
app.get("/taux_retenue_source", (req, res) => {
  db.query("SELECT * FROM taux_retenue_source", (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.send(results);
    }
  });
});

// Route pour ajouter un nouveau taux
app.post("/taux_retenue_source", (req, res) => {
  const { taux } = req.body;
  db.query(
    "INSERT INTO taux_retenue_source (taux, active) VALUES (?, true)",
    [taux],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(results);
      }
    }
  );
});

// Route pour mettre à jour l'état actif d'un taux
app.put("/taux_retenue_source/:id", (req, res) => {
  const { id } = req.params;
  const { active } = req.body;
  db.query(
    "UPDATE taux_retenue_source SET active = ? WHERE id = ?",
    [active, id],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(results);
      }
    }
  );
});

// Route pour modifier le taux de retenue à la source
app.put("/taux_retenue_source/modif/:id", (req, res) => {
  const { id } = req.params;
  const { taux } = req.body;
  db.query(
    "UPDATE taux_retenue_source SET taux = ? WHERE id = ?",
    [taux, id],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(results);
      }
    }
  );
});

// Route pour obtenir tous les taux where active = 1
app.get("/taux_retenue_source/active", (req, res) => {
  db.query(
    "SELECT `taux` FROM `taux_retenue_source` WHERE `active` = 1",
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send(results);
      }
    }
  );
});

/*************************************************************************** */
/****************************** Entreprises ******************************* */

// affichier all Entreprises
app.get("/entreprises", verifyToken, (req, res) => {
  const q = "SELECT * FROM entreprises";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/entreprises/user", verifyToken, (req, res) => {
  const q = `SELECT * FROM entreprises WHERE code_entreprise = '${req.user.code_entreprise}'`;
  db.query(q, (err, data) => {
    if (err) return res.status(500).json({ message: "Internal Server Error" });
    // Assurez-vous que le résultat est toujours un tableau
    const entreprises = Array.isArray(data) ? data : [data];
    return res.json(entreprises);
  });
});

// Add entreprise
app.post("/entreprises", verifyToken, (req, res) => {
  const q =
    "INSERT INTO entreprises (`code_entreprise`, `date_creation`, `identite`, `MF/CIN`, `responsable`, `cnss`, `tel`, `email`, `adresse`) VALUES (?)";
  const values = [
    req.body.code_entreprise,
    req.body.date_creation,
    req.body.identite,
    req.body.MF_CIN,
    req.body.responsable,
    req.body.cnss,
    req.body.tel,
    req.body.email,
    req.body.adresse,
  ];
  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Entreprise ajouté avec succès");
  });
});

//Delete entreprise
app.delete("/entreprises/:id", (req, res) => {
  const entrepriseID = req.params.id;
  const q = "DELETE FROM entreprises WHERE id = ?";

  db.query(q, [entrepriseID], (err, data) => {
    if (err) return res.json(err);
    return res.json("Entreprise supprimé avec succès");
  });
});

//Update entreprise
app.put("/entreprises/:id", (req, res) => {
  const entrepriseID = req.params.id;
  const q =
    "UPDATE entreprises SET `code_entreprise` = ?, `date_creation` = ?, `identite` = ?, `MF/CIN` = ?, `responsable` = ?, `cnss` = ?, `tel` = ?, `email` = ?, `adresse` = ? WHERE id = ? ";

  const values = [
    req.body.code_entreprise,
    req.body.date_creation,
    req.body.identite,
    req.body.MF_CIN,
    req.body.responsable,
    req.body.cnss,
    req.body.tel,
    req.body.email,
    req.body.adresse,
  ];

  db.query(q, [...values, entrepriseID], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//get entreprise by id

app.get("/entreprises/:id", (req, res) => {
  const entrepriseID = req.params.id;
  const q = "SELECT * FROM entreprises WHERE id = ? ";
  db.query(q, [entrepriseID], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Code Entreprise
app.get("/code_entreprises", (req, res) => {
  const q = "SELECT code_entreprise FROM entreprises";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Identite
app.get("/identite", (req, res) => {
  const q = "SELECT identite FROM utilisateurs";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

/************************************************************/
/**********************Utilisateurs**************************/

// affichier all Users
app.get("/utilisateurs", verifyToken, (req, res) => {
  if (req.user.role === "super_admin") {
    const q = "SELECT * FROM  utilisateurs";
    db.query(q, (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    });
  } else {
    const q = `SELECT * FROM utilisateurs WHERE identite = '${req.user.identite}'`;
    db.query(q, (err, data) => {
      if (err)
        return res.status(500).json({ message: "Internal Server Error" });
      const users = Array.isArray(data) ? data : [data];
      return res.json(users);
    });
  }
});

// Add utilisateur
app.post("/users", async (req, res) => {
  const {
    code_entreprise,
    code_user,
    identite,
    position,
    tel,
    email,
    mot_de_passe,
    role,
  } = req.body;

  try {
    const encryptedPassword = await bcrypt.hash(mot_de_passe, 10);

    const q = `INSERT INTO utilisateurs (code_entreprise, code_user, identite, position, tel, email, mot_de_passe, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [
      code_entreprise,
      code_user,
      identite,
      position,
      tel,
      email,
      encryptedPassword,
      role,
    ];

    db.query(q, values, (err, result) => {
      if (err) return res.status(500).json(err);
      return res.status(201).json({ message: "Utilisateur créé avec succès." });
    });
  } catch (error) {
    return res.status(500).json({ error: "Error encrypting password" });
  }
});

// app.post("/users", async (req, res) => {
//   const { code_entreprise, code_user, identite, position, tel, email, mot_de_passe } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(mot_de_passe, 10);
//     const sql = "INSERT INTO utilisateurs (code_entreprise, code_user, identite, position, tel, email, mot_de_passe, plain_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
//     const values = [code_entreprise, code_user, identite, position, tel, email, hashedPassword, mot_de_passe];

//     db.query(sql, values, (err, data) => {
//       if (err) {
//         console.error("Erreur lors de l'ajout de l'utilisateur :", err);
//         return res.status(500).json({ error: "Erreur du serveur" });
//       }

//       return res.status(200).json("Utilisateur ajouté avec succès");
//     });
//   } catch (error) {
//     console.error("Error:", error);
//     return res.status(500).json({ error: "Internal Server Error" });
//   }
// });

//Delete utilisateur

app.delete("/users/:id", (req, res) => {
  const userID = req.params.id;
  const q = "DELETE FROM utilisateurs WHERE id = ?";

  db.query(q, [userID], (err, data) => {
    if (err) return res.json(err);
    return res.json("Utilisateur supprimé avec succès");
  });
});

//Update utilisateur
app.put("/users/:id", async (req, res) => {
  const { id } = req.params;
  const {
    code_entreprise,
    code_user,
    identite,
    position,
    tel,
    email,
    mot_de_passe,
    role,
  } = req.body;

  const sqlSelect = "SELECT * FROM utilisateurs WHERE id = ?";
  db.query(sqlSelect, [id], async (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération de l'utilisateur :", err);
      return res.status(500).json({ error: "Erreur du serveur" });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: "Utilisateur non trouvé" });
    }

    let updatedPassword = results[0].mot_de_passe;

    if (mot_de_passe) {
      try {
        updatedPassword = await bcrypt.hash(mot_de_passe, 10);
      } catch (err) {
        console.error("Erreur lors du hachage du mot de passe :", err);
        return res
          .status(500)
          .json({ error: "Erreur lors du hachage du mot de passe" });
      }
    }

    const sqlUpdate =
      "UPDATE utilisateurs SET code_entreprise = ?, code_user = ?, identite = ?, position = ?, tel = ?, email = ?, mot_de_passe = ?, role = ? WHERE id = ?";
    const values = [
      code_entreprise,
      code_user,
      identite,
      position,
      tel,
      email,
      updatedPassword,
      role,
      id,
    ];

    db.query(sqlUpdate, values, (err, result) => {
      if (err) {
        console.error("Erreur lors de la mise à jour de l'utilisateur :", err);
        return res.status(500).json({ error: "Erreur du serveur" });
      }

      return res
        .status(200)
        .json({ message: "Utilisateur mis à jour avec succès" });
    });
  });
});

// app.put("/users/:id", (req, res) => {
//   const userID = req.params.id;
//   const q =
//     "UPDATE utilisateurs SET `code_entreprise` = ?, `code_user` = ?, `identite` = ?, `position` = ?, `tel` = ?, `email` = ?, `mot_de_passe` = ? WHERE id = ?";

//   const values = [
//     req.body.code_entreprise,
//     req.body.code_user,
//     req.body.identite,
//     req.body.position,
//     req.body.tel,
//     req.body.email,
//     req.body.mot_de_passe,
//   ];

//   db.query(q, [...values, userID], (err, data) => {
//     if (err) return res.json(err);
//     return res.json(data);
//   });
// });

//get utilisateur by id
app.get("/users/:id", (req, res) => {
  const userID = req.params.id;
  const q = "SELECT * FROM utilisateurs WHERE id = ?";

  db.query(q, [userID], (err, data) => {
    if (err) return res.status(500).json({ message: "Internal Server Error" });

    if (data.length > 0) {
      let user = data[0];
      // Do not attempt to decrypt the password. Return it as is.
      user.plain_password = user.mot_de_passe;
      return res.json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  });
});

// app.get("/users/:id", (req, res) => {
//   const userID = req.params.id;
//   const q = "SELECT * FROM utilisateurs WHERE id = ? ";

//   db.query(q, [userID], (err, data) => {
//     if (err) return res.json(err);
//     return res.json(data);
//   });
// });

/************************************************************/
/********************** banques *****************************/


app.get("/banques", (req, res) => {
  const query = "SELECT id, name FROM banques";
  
  db.query(query, (err, results) => {
    if (err) {
      console.error("Database query error:", err);
      return res.status(500).json({ error: "An error occurred while fetching banques." });
    }
    res.json(results);
  });
});

/************************************************************/
/**********************Tiers********************************/

// affichier all Tiers
app.get("/tiers", (req, res) => {
  const q = "SELECT * FROM  tiers";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Add tier
app.post("/tiers", verifyToken, (req, res) => {
  const {
    code_tiers,
    date_creation,
    type,
    identite,
    MF_CIN,
    tel,
    email,
    adresse,
    ville,
    pays,
    observations,
    autreType,
    banques,
  } = req.body;

  const q = `
    INSERT INTO tiers (
      code_tiers, date_creation, type, identite, \`MF/CIN\`, tel, email, adresse, ville, pays, observations, autreType
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    code_tiers,
    date_creation,
    type,
    identite,
    MF_CIN,
    tel,
    email,
    adresse,
    ville || null, // Assurez-vous de traiter les valeurs null
    pays || null,
    observations || null,
    autreType || null,
  ];

  db.query(q, values, (err, result) => {
    if (err) {
      console.error("Erreur lors de l'ajout du tier :", err);
      return res.status(500).json({ error: "Erreur lors de l'ajout du tier." });
    }

    const tierID = result.insertId;

    const addBanques =
      banques && banques.length > 0
        ? Promise.all(
            banques.map((banque) => {
              return new Promise((resolve, reject) => {
                const banqueQuery =
                  "INSERT INTO tiers_banques (tier_id, banque_id) VALUES (?, ?)";
                db.query(banqueQuery, [tierID, banque.value], (err, result) => {
                  if (err) {
                    console.error("Erreur lors de l'ajout de la banque :", err);
                    reject(err);
                  } else {
                    resolve(result);
                  }
                });
              });
            })
          )
        : Promise.resolve();

    addBanques
      .then(() => {
        const notificationMessage =
          req.user.role === "client"
            ? `${req.user.identite} a ajouté un Tier`
            : "Le comptable a ajouté un Tier";

        const recipientRole =
          req.user.role === "comptable" ? "client" : "comptable";

        const getUserQuery = "SELECT id FROM utilisateurs WHERE role = ?";
        db.query(getUserQuery, [recipientRole], (userErr, userData) => {
          if (userErr) {
            console.error(
              `Erreur lors de la récupération de l'utilisateur avec le rôle ${recipientRole} :`,
              userErr
            );
            return res
              .status(500)
              .json({
                error: `Erreur lors de la récupération de l'utilisateur avec le rôle ${recipientRole}.`,
              });
          }
          if (userData.length === 0) {
            console.error(
              `Aucun utilisateur trouvé avec le rôle ${recipientRole}`
            );
            return res
              .status(404)
              .json({
                error: `Aucun utilisateur trouvé avec le rôle ${recipientRole}.`,
              });
          }

          const recipientId = userData[0].id;

          const notificationQuery =
            "INSERT INTO notifications (user_id, message) VALUES (?, ?)";
          db.query(
            notificationQuery,
            [recipientId, notificationMessage],
            (notifErr, notifData) => {
              if (notifErr) {
                console.error(
                  "Erreur lors de l'ajout de la notification :",
                  notifErr
                );
                return res
                  .status(500)
                  .json({
                    error: "Erreur lors de l'ajout de la notification.",
                  });
              }

              return res
                .status(200)
                .json({
                  message:
                    "Le tier, les banques et les notifications ont été ajoutés avec succès.",
                  tier: {
                    id: tierID,
                    code_tiers,
                    date_creation,
                    type,
                    identite,
                    MF_CIN,
                    tel,
                    email,
                    adresse,
                    ville,
                    pays,
                    observations,
                    autreType,
                  },
                });
            }
          );
        });
      })

      .catch((err) => {
        console.error("Erreur lors de l'ajout des banques du tier :", err);
        return res
          .status(500)
          .json({ error: "Erreur lors de l'ajout des banques du tier." });
      });
  });
});

// mettre à jour un tier par ID
app.put("/tiers/:id", (req, res) => {
  const tierId = req.params.id;
  const {
    code_tiers,
    date_creation,
    type,
    identite,
    MF_CIN,
    tel,
    email,
    adresse,
    ville,
    pays,
    observations,
    autreType,
    banques,
  } = req.body;

  // Démarrer la transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error("Erreur lors du démarrage de la transaction:", err);
      return res
        .status(500)
        .json({ error: "Erreur lors du démarrage de la transaction" });
    }

    // Mise à jour des informations du tier
    db.query(
      "UPDATE tiers SET code_tiers = ?, date_creation = ?, type = ?, identite = ?, `MF/CIN` = ?, tel = ?, email = ?, adresse = ?, ville = ?, pays = ?, observations = ?, autreType = ? WHERE id = ?",
      [
        code_tiers,
        date_creation,
        type,
        identite,
        MF_CIN,
        tel,
        email,
        adresse,
        ville,
        pays,
        observations,
        autreType,
        tierId,
      ],
      (err, result) => {
        if (err) {
          return db.rollback(() => {
            console.error("Erreur lors de la mise à jour du tier:", err);
            res
              .status(500)
              .json({ error: "Erreur lors de la mise à jour du tier" });
          });
        }

        // Supprimer les anciennes banques associées
        db.query(
          "DELETE FROM tiers_banques WHERE tier_id = ?",
          [tierId],
          (err, result) => {
            if (err) {
              return db.rollback(() => {
                console.error(
                  "Erreur lors de la suppression des banques associées:",
                  err
                );
                res
                  .status(500)
                  .json({
                    error:
                      "Erreur lors de la suppression des banques associées",
                  });
              });
            }

            if (Array.isArray(banques) && banques.length > 0) {
              // Vérifier que les banques existent réellement
              db.query(
                "SELECT id FROM banques WHERE id IN (?)",
                [banques],
                (err, validBanks) => {
                  if (err) {
                    return db.rollback(() => {
                      console.error(
                        "Erreur lors de la vérification des banques:",
                        err
                      );
                      res
                        .status(500)
                        .json({
                          error: "Erreur lors de la vérification des banques",
                        });
                    });
                  }

                  // Extraire les IDs des banques valides
                  const validBankIds = validBanks.map((bank) => bank.id);

                  // Filtrer les IDs des banques valides
                  const filteredBanks = banques.filter((banqueId) =>
                    validBankIds.includes(banqueId)
                  );

                  if (filteredBanks.length > 0) {
                    // Insérer les nouvelles banques associées
                    const values = filteredBanks.map((banqueId) => [
                      tierId,
                      banqueId,
                    ]);
                    db.query(
                      "INSERT INTO tiers_banques (tier_id, banque_id) VALUES ?",
                      [values],
                      (err, result) => {
                        if (err) {
                          return db.rollback(() => {
                            console.error(
                              "Erreur lors de l'insertion des banques associées:",
                              err
                            );
                            res
                              .status(500)
                              .json({
                                error:
                                  "Erreur lors de l'insertion des banques associées",
                              });
                          });
                        }

                        // Commit de la transaction
                        db.commit((err) => {
                          if (err) {
                            return db.rollback(() => {
                              console.error(
                                "Erreur lors du commit de la transaction:",
                                err
                              );
                              res
                                .status(500)
                                .json({
                                  error:
                                    "Erreur lors du commit de la transaction",
                                });
                            });
                          }

                          res
                            .status(200)
                            .json({
                              message: "Tier et banques mis à jour avec succès",
                            });
                        });
                      }
                    );
                  } else {
                    // Commit de la transaction même s'il n'y a pas de banques à ajouter
                    db.commit((err) => {
                      if (err) {
                        return db.rollback(() => {
                          console.error(
                            "Erreur lors du commit de la transaction:",
                            err
                          );
                          res
                            .status(500)
                            .json({
                              error: "Erreur lors du commit de la transaction",
                            });
                        });
                      }

                      res
                        .status(200)
                        .json({
                          message:
                            "Tier mis à jour avec succès, sans banques à ajouter",
                        });
                    });
                  }
                }
              );
            } else {
              // Commit de la transaction même s'il n'y a pas de banques à ajouter
              db.commit((err) => {
                if (err) {
                  return db.rollback(() => {
                    console.error(
                      "Erreur lors du commit de la transaction:",
                      err
                    );
                    res
                      .status(500)
                      .json({
                        error: "Erreur lors du commit de la transaction",
                      });
                  });
                }

                res
                  .status(200)
                  .json({
                    message:
                      "Tier mis à jour avec succès, sans banques à ajouter",
                  });
              });
            }
          }
        );
      }
    );
  });
});

//get tiers by id
app.get("/tiers/:id", (req, res) => {
  const tierID = req.params.id;
  const q = `
    SELECT tiers.*, GROUP_CONCAT(banques.name SEPARATOR ', ') AS banques
    FROM tiers
    LEFT JOIN tiers_banques ON tiers.id = tiers_banques.tier_id
    LEFT JOIN banques ON tiers_banques.banque_id = banques.id
    WHERE tiers.id = ?
    GROUP BY tiers.id
  `;

  db.query(q, [tierID], (err, data) => {
    if (err) {
      console.error("Error fetching tier and related banks:", err);
      return res
        .status(500)
        .json({
          error:
            "Erreur lors de la récupération du tier et des banques associées.",
        });
    }
    if (data.length === 0) {
      return res.status(404).json({ error: "Tier non trouvé." });
    }

    // Vérifiez si data[0].banques n'est pas null avant de l'utiliser
    const banquesList = data[0].banques ? data[0].banques.split(", ") : [];

    const tierData = {
      id: data[0].id,
      code_tiers: data[0].code_tiers,
      date_creation: data[0].date_creation,
      type: data[0].type,
      identite: data[0].identite,
      ["MF/CIN"]: data[0]["MF/CIN"],
      tel: data[0].tel,
      email: data[0].email,
      adresse: data[0].adresse,
      ville: data[0].ville,
      pays: data[0].pays,
      observations: data[0].observations,
      banques: banquesList,
    };
    res.json(tierData);
  });
});

// Delete tier
app.delete("/tiers/:id", (req, res) => {
  const tierID = req.params.id;

  // Vérifier les dépendances dans les autres tables
  const checkDependenciesQuery = `
    SELECT COUNT(*) AS count FROM (
      SELECT id FROM achats WHERE code_tiers = ?
      UNION
      SELECT id FROM commandes WHERE code_tiers = ?
      UNION
      SELECT id FROM livraisons WHERE code_tiers = ?
      UNION
      SELECT id FROM facturations WHERE code_tiers = ?
      UNION
      SELECT id FROM reglements_emis WHERE code_tiers = ?
      UNION
      SELECT id FROM reglements_recus WHERE code_tiers = ?
      UNION
      SELECT id FROM pointage_personnel WHERE code_tiers = ?
    ) AS dependencies
  `;

  db.query(
    checkDependenciesQuery,
    [tierID, tierID, tierID, tierID, tierID, tierID, tierID],
    (err, results) => {
      if (err) {
        console.error("Erreur lors de la vérification des dépendances :", err);
        return res
          .status(500)
          .json({ error: "Erreur lors de la vérification des dépendances." });
      }

      const dependenciesCount = results[0].count;

      if (dependenciesCount > 0) {
        // Obtenir les noms des tables avec des dépendances
        const tablesWithDependencies = [
          { table: "achats", label: "Achats" },
          { table: "commandes", label: "Commandes" },
          { table: "livraisons", label: "Livraisons" },
          { table: "facturations", label: "Facturations" },
          { table: "reglements_emis", label: "Règlements émis" },
          { table: "reglements_recus", label: "Règlements reçus" },
          { table: "pointage_personnel", label: "Pointage personnel" },
        ];

        // Filtrer les tables avec des dépendances
        const dependentTables = tablesWithDependencies.filter(
          (table) => results[0][table.table] > 0
        );

        // Construire un message détaillé pour l'utilisateur
        const dependentTablesMessage = dependentTables
          .map((table) => table.label)
          .join(", ");

        return res.status(400).json({
          error: `Le tier ne peut pas être supprimé car il est associé à des enregistrements dans les tables suivantes : ${dependentTablesMessage}.`,
        });
      }

      // Si pas de dépendances, supprimer le tier
      const deleteQuery = "DELETE FROM tiers WHERE id = ?";
      db.query(deleteQuery, [tierID], (err, data) => {
        if (err) {
          console.error("Erreur lors de la suppression du tier :", err);
          return res
            .status(500)
            .json({ error: "Erreur lors de la suppression du tier." });
        }
        return res.json({ message: "Tier supprimé avec succès" });
      });
    }
  );
});

/************************************************************/
/**********************Achats**************************/

// Route pour afficher tous les achats avec gestion des rôles
app.get("/achats", verifyToken, (req, res) => {
  let q = `
    SELECT a.*, u.role AS ajoute_par, u.identite, u.code_entreprise
    FROM achats a
    LEFT JOIN utilisateurs u ON a.ajoute_par = u.id
  `;

  const { clientId } = req.query;

  if (req.user.role === "client") {
    q += " WHERE u.identite = ?";
    db.query(q, [req.user.identite], (err, data) => {
      if (err) {
        return res
          .status(500)
          .json({
            error: "Erreur lors de la récupération des achats du client",
          });
      }
      return res.json(data);
    });
  } else if (req.user.role === "comptable") {
    if (clientId) {
      q += " AND a.ajoute_par = ?";
      db.query(q, [clientId], (err, data) => {
        if (err) {
          return res
            .status(500)
            .json({
              error:
                "Erreur lors de la récupération des achats du client spécifié",
            });
        }
        return res.json(data);
      });
    } else {
      db.query(q, [], (err, data) => {
        if (err) {
          return res
            .status(500)
            .json({
              error:
                "Erreur lors de la récupération de tous les achats pour les comptables",
            });
        }
        return res.json(data);
      });
    }
  } else {
    res.status(403).send("Accès refusé");
  }
});

// Details Achat
app.get("/achats/:id", (req, res) => {
  const achatD = req.params.id;
  const q = "SELECT * FROM achats WHERE id = ? ";

  db.query(q, [achatD], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

const extractCodeTiers = (tiersSaisie) => {
  const parts = tiersSaisie.split(' - ');
  return parts[0]; // Assuming the code_tiers is the first part
};

// Route pour ajouter un achat
app.post("/achats", verifyToken, (req, res) => {
  const userId = req.user.id;
  if (!userId) {
    console.error("User ID is undefined. Cannot proceed with adding achat.");
    return res.status(400).json({ error: "User ID is required to add achat" });
  }

  const {
    date_saisie,
    tiers_saisie,
    type_piece,
    num_piece,
    date_piece,
    statut,
    montant_HT_piece,
    FODEC_piece,
    TVA_piece,
    timbre_piece,
    autre_montant_piece,
    montant_total_piece,
    observations,
    document_fichier,
  } = req.body;

  // Extraction du code_tiers à partir de tiers_saisie
  const code_tiers = extractCodeTiers(tiers_saisie);

  // Ajout de l'achat à la base de données
  const q = `
    INSERT INTO achats (
      date_saisie, code_tiers, tiers_saisie, type_piece, num_piece, date_piece, 
      statut, montant_HT_piece, FODEC_piece, TVA_piece, timbre_piece, 
      autre_montant_piece, montant_total_piece, observations, document_fichier, 
      ajoute_par
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    date_saisie,
    code_tiers,
    tiers_saisie,
    type_piece,
    num_piece,
    date_piece,
    statut,
    montant_HT_piece,
    FODEC_piece,
    TVA_piece,
    timbre_piece,
    autre_montant_piece,
    montant_total_piece,
    observations,
    document_fichier || null,
    userId,
  ];

  db.query(q, values, (err, data) => {
    if (err) {
      console.error("Error adding achat:", err);
      return res.status(500).json({
        error: "Failed to add achat to database",
        details: err.message,
      });
    }

    // Ajout de la notification pour le comptable
    const notificationMessage = `${req.user.identite} a ajouté un achat`;

    // Récupérer le comptable
    const getComptableQuery =
      "SELECT id FROM utilisateurs WHERE role = 'comptable'";
    db.query(getComptableQuery, (comptableErr, comptableData) => {
      if (comptableErr) {
        console.error("Error fetching comptable:", comptableErr);
        return res.status(500).json({
          error: "Failed to fetch comptable",
          details: comptableErr.message,
        });
      }
      if (comptableData.length === 0) {
        console.error("No comptable found");
        return res.status(404).json({ error: "No comptable found" });
      }

      const comptableId = comptableData[0].id;

      // Ajouter la notification pour le comptable
      const notificationQuery =
        "INSERT INTO notifications (user_id, message) VALUES (?, ?)";
      db.query(
        notificationQuery,
        [comptableId, notificationMessage],
        (notifErr, notifData) => {
          if (notifErr) {
            console.error("Error adding notification:", notifErr);
            return res.status(500).json({
              error: "Failed to add notification",
              details: notifErr.message,
            });
          }
          return res
            .status(200)
            .json({ message: "Achat and notification added successfully" });
        }
      );
    });
  });
});

//Update Achat
app.put("/achats/:id", (req, res) => {
  const achatD = req.params.id;
  const q =
    "UPDATE  achats SET `date_saisie`=?,`code_tiers`=?,`tiers_saisie`=?,`type_piece`=?,`num_piece`=?,`date_piece`=?,`statut`=?,`montant_HT_piece`=?,`FODEC_piece`=?,`TVA_piece`=?,`timbre_piece`=?,`autre_montant_piece`=?,`montant_total_piece`=?,`observations`=?,`document_fichier`=? WHERE id = ?";

  const values = [
    req.body.date_saisie,
    req.body.code_tiers,
    req.body.tiers_saisie,
    req.body.type_piece,
    req.body.num_piece,
    req.body.date_piece,
    req.body.statut,
    req.body.montant_HT_piece,
    req.body.FODEC_piece,
    req.body.TVA_piece,
    req.body.timbre_piece,
    req.body.autre_montant_piece,
    req.body.montant_total_piece,
    req.body.observations,
    req.body.document_fichier,
  ];

  db.query(q, [...values, achatD], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//Delete achat
app.delete("/achats/:id", (req, res) => {
  const achatD = req.params.id;
  const q = "DELETE FROM achats WHERE id = ?";

  db.query(q, [achatD], (err, data) => {
    if (err) return res.json(err);
    return res.json("Achat supprimé avec succès");
  });
});

/************************ code_tiers **************************************** */

app.get("/code_tiers", (req, res) => {
  const query = 'SELECT id, code_tiers, identite FROM tiers';

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de l'exécution de la requête :", err);
      res.status(500).json({ error: "Erreur serveur" });
      return;
    }

    // Renvoyer les résultats de la requête
    res.json(results);
  });
});

/*************************liste des clients **************************************** */

app.get("/clients", (req, res) => {
  const query = "SELECT identite FROM utilisateurs WHERE role = 'client'";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de l'exécution de la requête :", err);
      res.status(500).json({ error: "Erreur serveur" });
      return;
    }

    // Renvoyer les résultats de la requête
    res.json(results);
  });
});

/****************************************************************** */
/**********************reglements emis **************************/

// Afficher tous les règlements émis
app.get("/reglements_emis", verifyToken, (req, res) => {
  let q = `
    SELECT r.*, u.role AS ajoute_par, u.identite, u.code_entreprise
    FROM reglements_emis r
    LEFT JOIN utilisateurs u ON r.ajoute_par = u.id
  `;

  const { clientId } = req.query;

  if (req.user.role === "client") {
    q += " WHERE u.identite = ?";
    db.query(q, [req.user.identite], (err, data) => {
      if (err) {
        return res.status(500).json({
          error: "Erreur lors de la récupération des règlements du client",
        });
      }
      return res.json(data);
    });
  } else if (req.user.role === "comptable") {
    if (clientId) {
      q += " AND r.ajoute_par = ?";
      db.query(q, [clientId], (err, data) => {
        if (err) {
          return res.status(500).json({
            error: "Erreur lors de la récupération des règlements du client spécifié",
          });
        }
        return res.json(data);
      });
    } else {
      db.query(q, [], (err, data) => {
        if (err) {
          return res.status(500).json({
            error: "Erreur lors de la récupération de tous les règlements pour les comptables",
          });
        }
        return res.json(data);
      });
    }
  } else {
    res.status(403).send("Accès refusé");
  }
});



// Route pour ajouter un règlement émis
app.post("/reglements_emis", verifyToken, (req, res) => {
  const { reglement, payements, pieces } = req.body;

  db.beginTransaction((err) => {
    if (err) {
      console.error("Erreur lors de la création de la transaction:", err);
      return res
        .status(500)
        .json({ message: "Erreur lors de la création de la transaction." });
    }

    const insertReglementQuery =
      "INSERT INTO reglements_emis (date_saisie, code_tiers, tiers_saisie, montant_brut, base_retenue_source , taux_retenue_source, montant_retenue_source ,montant_net , observations) VALUES (?,?,?,?,?,?,?,?,?)";
    db.query(
      insertReglementQuery,
      [
        reglement.date_saisie,
        reglement.code_tiers,
        reglement.tiers_saisie,
        reglement.montant_brut,
        reglement.base_retenue_source,
        reglement.taux_retenue_source,
        reglement.montant_retenue_source,
        reglement.montant_net,
        reglement.observations,
      ],
      (err, result) => {
        if (err) {
          console.error("Erreur lors de l'insertion du règlement émis:", err);
          return db.rollback(() =>
            res.status(500).json({
              message: "Erreur lors de l'insertion du règlement émis.",
            })
          );
        }

        const reglementId = result.insertId;

        const payementPromises = payements.map(
          (payement) =>
            new Promise((resolve, reject) => {
              const insertPayementQuery =
                "INSERT INTO payements (modalite, num, banque, date_echeance, montant, reglement_emis_id) VALUES (?, ?, ?, ?, ?, ?)";
              db.query(
                insertPayementQuery,
                [
                  payement.modalite,
                  payement.num,
                  payement.banque,
                  payement.date_echeance,
                  payement.montant,
                  reglementId,
                ],
                (err) => (err ? reject(err) : resolve())
              );
            })
        );

        const piecePromises = pieces.map(
          (piece) =>
            new Promise((resolve, reject) => {
              const insertPieceQuery =
                "INSERT INTO pieces_a_regler (num_piece_a_regler, date_piece_a_regler, montant_piece_a_regler, montant_restant, document_fichier, reglement_emis_id) VALUES (?, ?, ?, ?, ?)";
              db.query(
                insertPieceQuery,
                [
                  piece.num_piece_a_regler,
                  piece.date_piece_a_regler,
                  piece.montant_piece_a_regler,
                  piece.montant_restant,
                  piece.document_fichier,
                  reglementId,
                ],
                (err) => (err ? reject(err) : resolve())
              );
            })
        );

        Promise.all([...payementPromises, ...piecePromises])
          .then(() => {
            db.commit((err) => {
              if (err) {
                console.error(
                  "Erreur lors de la validation de la transaction:",
                  err
                );
                return db.rollback(() =>
                  res.status(500).json({
                    message: "Erreur lors de la validation de la transaction.",
                  })
                );
              }

              // Notification logic
              const notificationMessage = `Un nouveau règlement a été émis`;
              const getComptableQuery =
                "SELECT id FROM utilisateurs WHERE role = 'comptable'";
              db.query(getComptableQuery, (comptableErr, comptableData) => {
                if (comptableErr) {
                  console.error("Error fetching comptable:", comptableErr);
                  return res.status(500).json({
                    error: "Failed to fetch comptable",
                    details: comptableErr.message,
                  });
                }
                if (comptableData.length === 0) {
                  console.error("No comptable found");
                  return res.status(404).json({ error: "No comptable found" });
                }

                const comptableId = comptableData[0].id;
                const notificationQuery =
                  "INSERT INTO notifications (user_id, message) VALUES (?, ?)";
                db.query(
                  notificationQuery,
                  [comptableId, notificationMessage],
                  (notifErr, notifData) => {
                    if (notifErr) {
                      console.error("Error adding notification:", notifErr);
                      return res.status(500).json({
                        error: "Failed to add notification",
                        details: notifErr.message,
                      });
                    }
                    return res.status(200).json({
                      message:
                        "Règlement émis ajouté avec succès et notification envoyée",
                    });
                  }
                );
              });
            });
          })
          .catch((err) => {
            console.error(
              "Erreur lors de l'insertion des payements ou pièces:",
              err
            );
            db.rollback(() =>
              res.status(500).json({
                message: "Erreur lors de l'insertion des payements ou pièces.",
              })
            );
          });
      }
    );
  });
});


// Route pour récupérer un règlement émis et ses pieces et ses payements par ID
app.get("/reglements_emis/:id", (req, res) => {
  const reglementID = req.params.id;

  // Initialisation des objets de données vides
  let reglement = null;
  let payements = [];
  let pieces = [];

  // Fonction pour répondre au client
  const respondToClient = () => {
    res.json({ reglement, payements, pieces });
  };

  // Requête pour obtenir le règlement émis
  const reglementQuery = "SELECT * FROM reglements_emis WHERE id = ?";
  db.query(reglementQuery, [reglementID], (err, reglementRows) => {
    if (err) {
      console.error("Erreur lors de la récupération du règlement émis:", err);
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération du règlement émis." });
    }

    if (reglementRows.length === 0) {
      // Aucun règlement trouvé
      return res.status(404).json({ message: "Règlement émis non trouvé." });
    }

    reglement = reglementRows[0];

    // Requête pour obtenir les payements
    const payementQuery = "SELECT * FROM payements WHERE reglement_emis_id = ?";
    db.query(payementQuery, [reglementID], (err, payementRows) => {
      if (err) {
        console.error("Erreur lors de la récupération des payements:", err);
        return res
          .status(500)
          .json({ message: "Erreur lors de la récupération des payements." });
      }

      payements = payementRows;

      // Requête pour obtenir les pièces
      const pieceQuery =
        "SELECT * FROM pieces_a_regler WHERE reglement_emis_id = ?";
      db.query(pieceQuery, [reglementID], (err, pieceRows) => {
        if (err) {
          console.error("Erreur lors de la récupération des pièces:", err);
          return res
            .status(500)
            .json({ message: "Erreur lors de la récupération des pièces." });
        }

        pieces = pieceRows;

        // Toutes les données sont collectées, on peut répondre au client
        respondToClient();
      });
    });
  });
});

// Route PUT pour mettre à jour un règlement
app.put("/reglements_emis/:id", async (req, res) => {
  const reglementID = req.params.id;
  const { reglement, payements, pieces } = req.body;

  try {
    // Vérifier l'existence du règlement
    const existingReglement = await db.query(
      "SELECT * FROM `reglements_emis` WHERE id = ?",
      [reglementID]
    );
    if (existingReglement.length === 0) {
      return res
        .status(404)
        .json({ error: "Le règlement spécifié n'a pas été trouvé." });
    }

    // Mettre à jour le règlement existant
    await db.query("UPDATE `reglements_emis` SET ? WHERE id = ?", [
      reglement,
      reglementID,
    ]);

    // Supprimer les payements associés au règlement
    await db.query("DELETE FROM `payements` WHERE reglement_emis_id = ?", [
      reglementID,
    ]);

    // Supprimer les pièces associées au règlement
    await db.query(
      "DELETE FROM `pieces_a_regler` WHERE reglement_emis_id = ?",
      [reglementID]
    );

    // Ajouter ou mettre à jour les payements associés
    if (payements && payements.length > 0) {
      for (const payement of payements) {
        // Assigner le reglement_emis_id pour chaque payement
        payement.reglement_emis_id = reglementID;

        // Insérer un nouveau payement
        await db.query("INSERT INTO `payements` SET ?", [payement]);
      }
    }

    // Ajouter ou mettre à jour les pieces associés
    if (pieces && pieces.length > 0) {
      for (const piece of pieces) {
        // Assigner le reglement_emis_id pour chaque payement
        piece.reglement_emis_id = reglementID;

        // Insérer un nouveau piece
        await db.query("INSERT INTO `pieces_a_regler` SET ?", [piece]);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du règlement :", error);
    res.status(500).json({
      error: "Erreur lors de la mise à jour du règlement.",
    });
  }
});

//Delete règlement
app.delete("/reglements_emis/:id", (req, res) => {
  const reglementID = req.params.id;
  const q = "DELETE FROM reglements_emis WHERE id = ?";

  db.query(q, [reglementID], (err, data) => {
    if (err) return res.json(err);
    return res.json("Règlement supprimé avec succès");
  });
});


// Route pour ajouter un payement
app.post("/payements", async (req, res) => {
  try {
    const payementData = req.body;

    // Assurez-vous que le reglement_emis_id est inclus dans les données du payement
    if (!payementData.reglement_emis_id) {
      throw new Error(
        "Le reglement_emis_id est requis pour ajouter un payement."
      );
    }

    const result = await db.query("INSERT INTO payements SET ?", payementData);
    const insertedId = result.insertId;

    res.json({ id: insertedId, ...payementData });
  } catch (error) {
    console.error("Erreur lors de l'insertion du payement :", error);
    res.status(500).json({ error: "Erreur lors de l'insertion du payement." });
  }
});

// Route pour supprimer un payement
app.delete("/payements/:id", async (req, res) => {
  const payementId = req.params.id;

  try {
    // Avant de supprimer le payement, vérifiez si le payement existe et récupérez le reglement_emis_id associé
    const payementResult = await db.query(
      "SELECT reglement_emis_id FROM payements WHERE id = ?",
      [payementId]
    );
    if (payementResult.length === 0) {
      return res.status(404).json({ error: "payement not found." });
    }

    const payement = payementResult[0];
    const reglementId = payement.reglement_emis_id;

    // Supprimer le payement
    await db.query("DELETE FROM payements WHERE id = ?", payementId);

    res.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression du payement :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression du payement." });
  }
});

// Route pour ajouter un piece
app.post("/pieces_a_regler", async (req, res) => {
  try {
    const pieceData = req.body;

    // Assurez-vous que le reglement_emis_id est inclus dans les données du piece
    if (!pieceData.reglement_emis_id) {
      throw new Error("Le reglement_emis_id est requis pour ajouter un piece.");
    }

    const result = await db.query(
      "INSERT INTO pieces_a_regler SET ?",
      pieceData
    );
    const insertedId = result.insertId;

    res.json({ id: insertedId, ...pieceData });
  } catch (error) {
    console.error("Erreur lors de l'insertion du piece :", error);
    res.status(500).json({ error: "Erreur lors de l'insertion du piece." });
  }
});

// Route pour supprimer un piece
app.delete("/pieces_a_regler/:id", async (req, res) => {
  const pieceId = req.params.id;

  try {
    // Avant de supprimer le piece, vérifiez si le piece existe et récupérez le reglement_emis_id associé
    const pieceResult = await db.query(
      "SELECT reglement_emis_id FROM pieces_a_regler WHERE id = ?",
      [pieceId]
    );
    if (pieceResult.length === 0) {
      return res.status(404).json({ error: "Piece not found." });
    }

    const piece = pieceResult[0];
    const reglementId = piece.reglement_emis_id;

    // Supprimer le piece
    await db.query("DELETE FROM pieces_a_regler WHERE id = ?", pieceId);

    res.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression du piece :", error);
    res.status(500).json({ error: "Erreur lors de la suppression du piece." });
  }
});


// Route pour obtenir les numéros de pièce
app.get("/pieces", verifyToken, (req, res) => {
  const query = `
    SELECT num_piece, date_piece, montant_total_piece, document_fichier 
    FROM achats 
    WHERE statut IN ('partiellement réglée', 'non réglée')
    AND ajoute_par = ?
  `;

  db.query(query, [req.user.id], (err, data) => {
    if (err) {
      return res.status(500).json({
        error: "Erreur lors de la récupération des pièces pour le client",
      });
    }
    return res.json(data);
  });
});


app.get("/tiers/:id/banques", (req, res) => {
  const tierId = req.params.id;
  const query = `
    SELECT b.id, b.name
    FROM banques b
    JOIN tiers_banques tb ON b.id = tb.banque_id
    WHERE tb.tier_id = ?
  `;

  db.query(query, [tierId], (err, data) => {
    if (err) {
      return res.status(500).json({
        error: "Erreur lors de la récupération des banques pour le tiers",
      });
    }
    return res.json(data);
  });
});


/****************************************************************** */
/**********************Commandes ***********************************/

// affichier all Commandes
app.get("/commandes", (req, res) => {
  const q = "SELECT * FROM  commandes";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Route pour ajouter une commande
app.post("/commande", verifyToken, (req, res) => {
  const { commande, familles } = req.body;

  db.beginTransaction((err) => {
    if (err) {
      console.error("Erreur lors de la création de la transaction:", err);
      return res
        .status(500)
        .json({ message: "Erreur lors de la création de la transaction." });
    }

    const insertCommandeQuery =
      "INSERT INTO `commandes`(`date_commande`, `num_commande`, `code_tiers`, `tiers_saisie`, `montant_commande`, `date_livraison_prevue`, `observations`, `document_fichier`) VALUES (?,?,?,?,?,?,?,?)";
    db.query(
      insertCommandeQuery,
      [
        commande.date_commande,
        commande.num_commande,
        commande.code_tiers,
        commande.tiers_saisie,
        commande.montant_commande,
        commande.date_livraison_prevue,
        commande.observations,
        commande.document_fichier,
      ],
      (err, result) => {
        if (err) {
          console.error("Erreur lors de l'insertion de la commande :", err);
          return db.rollback(() =>
            res
              .status(500)
              .json({ message: "Erreur lors de l'insertion de la commande." })
          );
        }

        const commandeId = result.insertId;

        const famillePromises = familles.map(
          (famille) =>
            new Promise((resolve, reject) => {
              const insertFamilleQuery =
                "INSERT INTO `familles`(`famille`, `sous_famille`, `article`, `commande_id`) VALUES (?,?,?,?)";
              db.query(
                insertFamilleQuery,
                [
                  famille.famille,
                  famille.sous_famille,
                  famille.article,
                  commandeId,
                ],
                (err) => (err ? reject(err) : resolve())
              );
            })
        );

        Promise.all([...famillePromises])
          .then(() => {
            db.commit((err) => {
              if (err) {
                console.error(
                  "Erreur lors de la validation de la transaction :",
                  err
                );
                return db.rollback(() =>
                  res.status(500).json({
                    message: "Erreur lors de la validation de la transaction.",
                  })
                );
              }

              // Notification logic
              const notificationMessage = `Une nouvelle commande a été ajoutée`;
              const getComptableQuery =
                "SELECT id FROM utilisateurs WHERE role = 'comptable'";
              db.query(getComptableQuery, (comptableErr, comptableData) => {
                if (comptableErr) {
                  console.error("Error fetching comptable:", comptableErr);
                  return res.status(500).json({
                    error: "Failed to fetch comptable",
                    details: comptableErr.message,
                  });
                }
                if (comptableData.length === 0) {
                  console.error("No comptable found");
                  return res.status(404).json({ error: "No comptable found" });
                }

                const comptableId = comptableData[0].id;
                const notificationQuery =
                  "INSERT INTO notifications (user_id, message) VALUES (?, ?)";
                db.query(
                  notificationQuery,
                  [comptableId, notificationMessage],
                  (notifErr, notifData) => {
                    if (notifErr) {
                      console.error("Error adding notification:", notifErr);
                      return res.status(500).json({
                        error: "Failed to add notification",
                        details: notifErr.message,
                      });
                    }
                    return res.status(200).json({
                      message:
                        "Commande ajoutée avec succès et notification envoyée",
                    });
                  }
                );
              });
            });
          })
          .catch((err) => {
            console.error("Erreur lors de l'insertion des familles :", err);
            db.rollback(() =>
              res
                .status(500)
                .json({ message: "Erreur lors de l'insertion des familles." })
            );
          });
      }
    );
  });
});

// Route pour mettre a jour une commande
app.put("/commande/:id", async (req, res) => {
  const commandeID = req.params.id;
  const { commande, familles } = req.body;

  try {
    // Vérifier l'existence de la commande
    const existingCommande = await db.query(
      "SELECT * FROM `commandes` WHERE id = ?",
      [commandeID]
    );
    if (existingCommande.length === 0) {
      return res
        .status(404)
        .json({ error: "La commande spécifiée n'a pas été trouvée." });
    }

    // Mettre à jour la commande
    await db.query("UPDATE `commandes` SET ? WHERE id = ?", [
      commande,
      commandeID,
    ]);

    // Supprimer les familles associées à la commande
    await db.query("DELETE FROM `familles` WHERE commande_id = ?", [
      commandeID,
    ]);

    // Ajouter ou mettre à jour les familles associées à la commande
    if (familles && familles.length > 0) {
      for (const famille of familles) {
        // Assigner l'ID de la commande pour chaque famille
        famille.commande_id = commandeID;

        // Insérer une nouvelle famille
        await db.query("INSERT INTO `familles` SET ?", [famille]);
      }
    }

    res.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande :", error);
    res.status(500).json({
      error: "Erreur lors de la mise à jour de la commande.",
    });
  }
});

// Route pour récupérer une commande par son ID avec ses familles
app.get("/commande/:id", (req, res) => {
  const commandeID = req.params.id;

  // Initialisation des objets de données vides
  let commande = null;
  let familles = [];

  // Fonction pour répondre au client
  const respondToClient = () => {
    res.json({ commande, familles });
  };

  // Requête pour obtenir le règlement émis
  const commandeQuery = "SELECT * FROM commandes WHERE id = ?";
  db.query(commandeQuery, [commandeID], (err, commandeRows) => {
    if (err) {
      console.error("Erreur lors de la récupération du commande:", err);
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération du commande." });
    }

    if (commandeRows.length === 0) {
      // Aucun règlement trouvé
      return res.status(404).json({ message: "Commande non trouvé." });
    }

    commande = commandeRows[0];

    // Requête pour obtenir les payements
    const familleQuery = "SELECT * FROM familles WHERE commande_id = ?";
    db.query(familleQuery, [commandeID], (err, familleRows) => {
      if (err) {
        console.error("Erreur lors de la récupération des familles:", err);
        return res
          .status(500)
          .json({ message: "Erreur lors de la récupération des familles." });
      }

      familles = familleRows;
      // Toutes les données sont collectées, on peut répondre au client
      respondToClient();
    });
  });
});

/****************************************************************** */
/**********************Livraisons ***********************************/

// affichier all Livraisons
app.get("/livraisons", (req, res) => {
  const q = "SELECT * FROM  livraisons";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Add livraisons
app.post("/livraison", verifyToken, (req, res) => {
  const q =
    "INSERT INTO `livraisons`( `date_BL`, `num_BL`, `code_tiers`, `tiers_saisie`, `reference_commande`, `montant_HT_BL`, `TVA_BL`, `montant_total_BL`, `observations`, `document_fichier`) VALUES (?)";
  const values = [
    req.body.date_BL,
    req.body.num_BL,
    req.body.code_tiers,
    req.body.tiers_saisie,
    req.body.reference_commande,
    req.body.montant_HT_BL,
    req.body.TVA_BL,
    req.body.montant_total_BL,
    req.body.observations,
    req.body.document_fichier,
  ];
  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);

    // Notification logic
    const notificationMessage = `Une nouvelle livraison a été ajoutée`;
    const getComptableQuery =
      "SELECT id FROM utilisateurs WHERE role = 'comptable'";
    db.query(getComptableQuery, (comptableErr, comptableData) => {
      if (comptableErr) {
        console.error("Error fetching comptable:", comptableErr);
        return res.status(500).json({
          error: "Failed to fetch comptable",
          details: comptableErr.message,
        });
      }
      if (comptableData.length === 0) {
        console.error("No comptable found");
        return res.status(404).json({ error: "No comptable found" });
      }

      const comptableId = comptableData[0].id;
      const notificationQuery =
        "INSERT INTO notifications (user_id, message) VALUES (?, ?)";
      db.query(
        notificationQuery,
        [comptableId, notificationMessage],
        (notifErr, notifData) => {
          if (notifErr) {
            console.error("Error adding notification:", notifErr);
            return res.status(500).json({
              error: "Failed to add notification",
              details: notifErr.message,
            });
          }
          return res.status(200).json({
            message: "Livraison ajoutée avec succès et notification envoyée",
          });
        }
      );
    });
  });
});

// app.post("/livraison", (req, res) => {
//   const q =
//     "INSERT INTO `livraisons`( `date_BL`, `num_BL`, `code_tiers`, `tiers_saisie`, `reference_commande`, `montant_HT_BL`, `TVA_BL`, `montant_total_BL`, `observations`, `document_fichier`) VALUES (?)";
//   const values = [
//     req.body.date_BL,
//     req.body.num_BL,
//     req.body.code_tiers,
//     req.body.tiers_saisie,
//     req.body.reference_commande,
//     req.body.montant_HT_BL,
//     req.body.TVA_BL,
//     req.body.montant_total_BL,
//     req.body.observations,
//     req.body.document_fichier,
//   ];
//   db.query(q, [values], (err, data) => {
//     if (err) return res.json(err);
//     return res.json("Livraison ajouté avec succès");
//   });
// });

// Get livraison by ID
app.get("/livraison/:id", (req, res) => {
  const livraisonID = req.params.id;
  const q = "SELECT * FROM `livraisons` WHERE id = ? ";

  db.query(q, [livraisonID], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Modifier livraison
app.put("/livraison/:id", async (req, res) => {
  const livraisonID = req.params.id;
  const newLivraison = req.body;

  try {
    await db.query("UPDATE `livraisons` SET ? WHERE id = ?", [
      newLivraison,
      livraisonID,
    ]);
    res.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la livraison :", error);
    res.status(500).json({
      error: "Erreur lors de la mise à jour de la livraison.",
    });
  }
});

/********************************************************************************** */
/************************ Reference Commande **************************************** */

app.get("/reference_commande", (req, res) => {
  const q = "SELECT `num_commande` FROM commandes";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

/************************ Reference Livraison **************************************** */

app.get("/reference_livraison", (req, res) => {
  const q = "SELECT `num_BL` FROM livraisons";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

/******************************** Familles **************************************** */

// Route pour gérer les suggestions de familles
app.get("/familles", (req, res) => {
  const query = "SELECT DISTINCT famille FROM familles";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de l'exécution de la requête SQL:", err);
      res.status(500).json({
        error: "Erreur lors de la récupération des suggestions de familles",
      });
    } else {
      const familles = results.map((row) => row.famille);
      res.json(familles);
    }
  });
});

// Route pour récupérer les données des familles en fonction de la valeur dans l'URL
app.get("/familles/:famille", (req, res) => {
  const famille = req.params.famille;

  // Requête SQL pour récupérer les données de famille en fonction de la valeur donnée
  const sql =
    "SELECT famille, sous_famille, article FROM familles WHERE famille = ?";

  // Exécution de la requête SQL avec la valeur donnée
  db.query(sql, [famille], (err, results) => {
    if (err) {
      console.error("Erreur lors de l'exécution de la requête SQL :", err);
      res.status(500).json({
        message: "Erreur lors de la récupération des données de famille",
      });
    } else {
      // Si des résultats sont trouvés, les renvoyer
      if (results.length > 0) {
        res.json(results[0]); // Nous renvoyons uniquement le premier résultat ici
      } else {
        // Sinon, renvoyer une réponse indiquant que la famille n'a pas été trouvée
        res.status(404).json({ message: "Famille non trouvée" });
      }
    }
  });
});

// Route pour supprimer un payement
app.delete("/familles/:id", async (req, res) => {
  const familleId = req.params.id;

  try {
    // Avant de supprimer la famille, vérifiez si la famille existe et récupérez le commande_id associé
    const familleResult = await db.query(
      "SELECT commande_id FROM familles WHERE id = ?",
      [familleId]
    );
    if (familleResult.length === 0) {
      return res.status(404).json({ error: "famille not found." });
    }

    const famille = familleResult[0];
    const commandeId = famille.commande_id;

    // Supprimer la famille
    await db.query("DELETE FROM familles WHERE id = ?", familleId);

    res.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression du famille :", error);
    res
      .status(500)
      .json({ error: "Erreur lors de la suppression du famille." });
  }
});

/*********************************** */
// Route pour récupérer les articles
app.get("/articles", (req, res) => {
  const query = "SELECT DISTINCT article FROM familles";

  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération des articles:", err);
      res
        .status(500)
        .json({ error: "Erreur lors de la récupération des articles" });
      return;
    }
    res.json(results);
  });
});

/****************************************************************************** */
/********************************Facturations ***********************************/

// affichier all Facturations
app.get("/facturations", (req, res) => {
  const q = "SELECT * FROM  facturations";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Route pour ajouter une facture
app.post("/facture", (req, res) => {
  const { facture } = req.body;

  // Commencer une transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error("Erreur lors de la création de la transaction :", err);
      return res
        .status(500)
        .json({ message: "Erreur lors de la création de la transaction." });
    }

    // Insérer la facture
    const insertFactureQuery =
      "INSERT INTO `facturations`(`date_facture`, `num_facture`, `code_tiers`, `tiers_saisie`, `reference_livraison`, `montant_HT_facture`, `FODEC_sur_facture`, `TVA_facture`, `timbre_facture`, `autre_montant_facture`, `montant_total_facture`, `observations`, `document_fichier`, `etat_payement`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    db.query(
      insertFactureQuery,
      [
        facture.date_facture,
        facture.num_facture,
        facture.code_tiers,
        facture.tiers_saisie,
        facture.reference_livraison,
        facture.montant_HT_facture,
        facture.FODEC_sur_facture,
        facture.TVA_facture,
        facture.timbre_facture,
        facture.autre_montant_facture,
        facture.montant_total_facture,
        facture.observations,
        facture.document_fichier,
        facture.etat_payement,
      ],
      (err, result) => {
        if (err) {
          console.error("Erreur lors de l'insertion de la facture :", err);
          return db.rollback(() => {
            return res
              .status(500)
              .json({ message: "Erreur lors de l'insertion de la facture." });
          });
        }

      }
    );
  });
});

// Route pour récupérer les données des factures
app.get("/factures/:num_facture", (req, res) => {
  const num_facture = req.params.num_facture;

  const sql =
    "SELECT `id`,`date_facture`, `montant_total_facture`, `document_fichier` FROM `facturations` WHERE num_facture = ?";

  // Exécution de la requête SQL avec la valeur donnée
  db.query(sql, [num_facture], (err, results) => {
    if (err) {
      console.error("Erreur lors de l'exécution de la requête SQL :", err);
      res.status(500).json({
        message: "Erreur lors de la récupération des données de facture",
      });
    } else {
      // Si des résultats sont trouvés, les renvoyer
      if (results.length > 0) {
        res.json(results[0]); // Nous renvoyons uniquement le premier résultat ici
      } else {
        // Sinon, renvoyer une réponse indiquant que la facture n'a pas été trouvée
        res.status(404).json({ message: "facture non trouvée" });
      }
    }
  });
});

// Route pour gérer les suggestions de factures
app.get("/num_facture", (req, res) => {
  const query = "SELECT DISTINCT id , num_facture FROM facturations";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Erreur lors de l'exécution de la requête SQL:", err);
      res.status(500).json({
        error: "Erreur lors de la récupération des suggestions de num_facture",
      });
    } else {
      const num_facture = results.map((row) => row.num_facture);
      res.json(num_facture);
    }
  });
});

// Route pour récupérer une facture par son ID
app.get("/facture/:id", (req, res) => {
  const FactureID = req.params.id;

  // Initialisation de l'objet de données vide
  let facture = null;

  // Fonction pour répondre au client
  const respondToClient = () => {
    res.json({ facture });
  };

  // Requête pour obtenir le règlement émis
  const factureQuery = "SELECT * FROM facturations WHERE id = ?";
  db.query(factureQuery, [FactureID], (err, factureRows) => {
    if (err) {
      console.error("Erreur lors de la récupération du facture:", err);
      return res.status(500).json({ message: "Erreur lors de la récupération du facture." });
    }

    if (factureRows.length === 0) {
      // Aucun règlement trouvé
      return res.status(404).json({ message: "Facture non trouvée." });
    }

    facture = factureRows[0];
    
    // Toutes les données sont collectées, on peut répondre au client
    respondToClient();
  });
});


// Route pour mettre à jour une facture
app.put("/facture/:id", async (req, res) => {
  const { id } = req.params;
  const {
    date_facture,
    num_facture,
    code_tiers,
    tiers_saisie,
    reference_livraison,
    montant_HT_facture,
    FODEC_sur_facture,
    TVA_facture,
    timbre_facture,
    autre_montant_facture,
    montant_total_facture,
    observations,
    document_fichier,
  } = req.body;

  const updateFactureQuery = `
    UPDATE facturations 
    SET 
      date_facture = ?,
      num_facture = ?,
      code_tiers = ?,
      tiers_saisie = ?,
      reference_livraison = ?,
      montant_HT_facture = ?,
      FODEC_sur_facture = ?,
      TVA_facture = ?,
      timbre_facture = ?,
      autre_montant_facture = ?,
      montant_total_facture = ?,
      observations = ?,
      document_fichier = ? 
    WHERE id = ?
  `;


  try {
    await db.query(updateFactureQuery, [
      date_facture,
      num_facture,
      code_tiers,
      tiers_saisie,
      reference_livraison,
      montant_HT_facture,
      FODEC_sur_facture,
      TVA_facture,
      timbre_facture,
      autre_montant_facture,
      montant_total_facture,
      observations,
      document_fichier,
      id,
    ]);

    res.status(200).json({ message: "Facture mise à jour avec succès" });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la facture :", error);
    res.status(500).json({ message: "Erreur lors de la mise à jour de la facture" });
  }
});

app.put("/facture/:id/etat_payement", (req, res) => {
  const { id } = req.params;
  const { etat_payement } = req.body;

  const query = "UPDATE facturations SET etat_payement = ? WHERE id = ?";
  db.query(query, [etat_payement, id], (err, result) => {
    if (err) {
      console.error("Error updating payment status:", err);
      res.status(500).send("Error updating payment status");
    } else {
      res.sendStatus(200);
    }
  });
});

/****************************************************************** */
/**********************reglements recus **************************/

// Afficher tous les règlements recus
app.get("/reglements_recus", (req, res) => {
  const query = `
      SELECT
          reglements_recus.id AS id,
          reglements_recus.code_tiers,
          reglements_recus.tiers_saisie,
          reglements_recus.montant_total_a_regler,
          facturations.num_facture,
          facturations.date_facture,
          facturations.montant_total_facture
      FROM reglements_recus
      LEFT JOIN reglements_recus_factures ON reglements_recus.id = reglements_recus_factures.reglement_recu_id
      LEFT JOIN facturations ON reglements_recus_factures.facture_id = facturations.id
  `;

  db.query(query, (err, rows) => {
    if (err) {
      console.error("Erreur lors de la récupération des données:", err);
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération des données." });
    }

    // Envoyer les données au client
    res.json(rows);
  });
});

// POST - Route pour ajouter un règlement reçu
app.post("/reglements_recus", (req, res) => {
  const { reglement, payements, factures } = req.body;

  // Insertion du règlement reçu
  db.query(
    "INSERT INTO reglements_recus (code_tiers, tiers_saisie, montant_total_a_regler, observations) VALUES (?, ?, ?, ?)",
    [
      reglement.code_tiers,
      reglement.tiers_saisie,
      reglement.montant_total_a_regler,
      reglement.observations,
    ],
    (err, result) => {
      if (err) {
        console.error("Erreur lors de l'ajout du règlement reçu :", err);
        return res
          .status(500)
          .json({ error: "Erreur lors de l'ajout du règlement reçu." });
      }

      // Récupération de l'ID du règlement reçu inséré
      const reglementRecuId = result.insertId;

      // Insertion des payements
      payements.forEach((payement) => {
        db.query(
          "INSERT INTO payements (modalite, num, banque, date_echeance, montant, reglement_recus_id) VALUES (?, ?, ?, ?, ?, ?)",
          [
            payement.modalite,
            payement.num,
            payement.banque,
            payement.date_echeance,
            payement.montant,
            reglementRecuId,
          ],
          (err) => {
            if (err) {
              console.error("Erreur lors de l'ajout du payement :", err);
              return res
                .status(500)
                .json({ error: "Erreur lors de l'ajout du payement." });
            }
          }
        );
      });

      // Insertion des factures
      factures.forEach((facture) => {
        db.query(
          "INSERT INTO reglements_recus_factures (reglement_recu_id, facture_id) VALUES (?, ?)",
          [reglementRecuId, facture.id],
          (err) => {
            if (err) {
              console.error("Erreur lors de l'ajout de la facture :", err);
              return res
                .status(500)
                .json({ error: "Erreur lors de l'ajout de la facture." });
            }
          }
        );
      });

      return res.status(200).json({ message: "Données ajoutées avec succès." });
    }
  );
});

//  GET - Récupérer les détails d'un règlement reçu par ID
app.get("/reglements_recus/:id", (req, res) => {
  const reglementID = req.params.id;

  // Initialisation des objets de données vides
  let reglement = null;
  let payements = [];
  let factures = [];

  // Fonction pour répondre au client
  const respondToClient = () => {
    res.json({ reglement, payements, factures });
  };

  // Requête pour obtenir le règlement émis
  const reglementQuery = "SELECT * FROM reglements_recus WHERE id = ?";
  db.query(reglementQuery, [reglementID], (err, reglementRows) => {
    if (err) {
      console.error("Erreur lors de la récupération du règlement recus:", err);
      return res.status(500).json({
        message: "Erreur lors de la récupération du règlement recus.",
      });
    }

    if (reglementRows.length === 0) {
      // Aucun règlement trouvé
      return res.status(404).json({ message: "Règlement recus non trouvé." });
    }

    reglement = reglementRows[0];

    // Requête pour obtenir les payements
    const payementQuery =
      "SELECT * FROM payements WHERE reglement_recus_id  = ?";
    db.query(payementQuery, [reglementID], (err, payementRows) => {
      if (err) {
        console.error("Erreur lors de la récupération des payements:", err);
        return res
          .status(500)
          .json({ message: "Erreur lors de la récupération des payements." });
      }

      payements = payementRows;

      // Requête pour obtenir les factures
      const factureQuery = `SELECT f.*
      FROM reglements_recus_factures rf
      JOIN facturations f ON rf.facture_id = f.id
      WHERE rf.reglement_recu_id = ?`;

      db.query(factureQuery, [reglementID], (err, factureRows) => {
        if (err) {
          console.error("Erreur lors de la récupération des factures:", err);
          return res
            .status(500)
            .json({ message: "Erreur lors de la récupération des factures." });
        }

        factures = factureRows;

        // Toutes les données sont collectées, on peut répondre au client
        respondToClient();
      });
    });
  });
});

// Route PUT pour mettre à jour un règlement reçu
app.put("/reglements_recus/:id", async (req, res) => {
  const id = req.params.id;

  const { reglement, payements, factures } = req.body;

  try {
    // Begin transaction
    await db.beginTransaction();

    // Update received payment data
    const updateReglementQuery = `
      UPDATE reglements_recus 
      SET code_tiers=?, tiers_saisie=?, montant_total_a_regler=?, observations=?
      WHERE id = ?
    `;
    await db.query(updateReglementQuery, [
      reglement.code_tiers,
      reglement.tiers_saisie,
      reglement.montant_total_a_regler,
      reglement.observations,
      id,
    ]);

    // Delete existing payments associated with this reglement_recus_id
    const deletePaymentQuery = `
      DELETE FROM payements
      WHERE reglement_recus_id=?
    `;
    await db.query(deletePaymentQuery, [id]);

    // Insert new payments
    for (const payment of payements) {
      const { modalite, num, banque, date_echeance, montant } = payment;
      const insertPaymentQuery = `
        INSERT INTO payements (modalite, num, banque, date_echeance, montant, reglement_recus_id)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      await db.query(insertPaymentQuery, [
        modalite,
        num,
        banque,
        date_echeance,
        montant,
        id,
      ]);
    }

    // Update associated invoices
    for (const facture of factures) {
      const updateFactureQuery = `
        UPDATE reglements_recus_factures 
        SET facture_id=? 
        WHERE reglement_recu_id=?
      `;
      await db.query(updateFactureQuery, [facture.id, id]);
    }

    // Commit transaction
    await db.commit();

    res
      .status(200)
      .json({ message: "Le règlement reçu a été mis à jour avec succès." });
  } catch (error) {
    // Rollback transaction in case of error
    await db.rollback();
    console.error("Erreur lors de la mise à jour du règlement reçu :", error);
    res.status(500).json({
      error:
        "Une erreur s'est produite lors de la mise à jour du règlement reçu.",
    });
  }
});

/****************************************************************** */
/************************** Versements ****************************/

// affichier all Versements
app.get("/versements", (req, res) => {
  const q = "SELECT * FROM  versements_en_banque";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Route POST pour ajouter un versement
app.post("/versement", (req, res) => {
  const { versement, payements } = req.body;

  // Insérer le versement dans la table versements_en_banque
  db.query(
    "INSERT INTO versements_en_banque SET ?",
    versement,
    (err, result) => {
      if (err) {
        console.error("Erreur lors de l'insertion du versement :", err);
        res.status(500).send("Erreur lors de l'insertion du versement");
        return;
      }

      const versementId = result.insertId;

      // Préparer les valeurs des payements pour l'insertion
      const payementsValues = payements.map((payement) => [
        payement.modalite,
        payement.num,
        payement.banque,
        payement.date_echeance,
        payement.montant,
        payement.code_tiers,
        payement.tiers_saisie,
        versementId,
      ]);

      // Insérer les payements dans la table payements
      db.query(
        "INSERT INTO payements (modalite, num, banque, date_echeance, montant, code_tiers, tiers_saisie, versement_id) VALUES ?",
        [payementsValues],
        (err, result) => {
          if (err) {
            console.error("Erreur lors de l'insertion des payements :", err);
            res.status(500).send("Erreur lors de l'insertion des payements");
            return;
          }

          console.log("Versement et payements ajoutés avec succès");
          res.status(200).send("Versement et payements ajoutés avec succès");
        }
      );
    }
  );
});

// Route pour récupérer un versement et ses payements par ID
app.get("/versement/:id", (req, res) => {
  const versementID = req.params.id;

  // Initialisation des objets de données vides
  let versement = null;
  let payements = [];

  // Fonction pour répondre au client
  const respondToClient = () => {
    res.json({ versement, payements });
  };

  // Requête pour obtenir versement
  const versementQuery = "SELECT * FROM versements_en_banque WHERE id = ?";
  db.query(versementQuery, [versementID], (err, versementRows) => {
    if (err) {
      console.error("Erreur lors de la récupération du versement:", err);
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération du versement." });
    }

    if (versementRows.length === 0) {
      // Aucun versement trouvé
      return res.status(404).json({ message: "versement non trouvé." });
    }

    versement = versementRows[0];

    // Requête pour obtenir les payements
    const payementQuery = "SELECT * FROM payements WHERE versement_id = ?";
    db.query(payementQuery, [versementID], (err, payementRows) => {
      if (err) {
        console.error("Erreur lors de la récupération des payements:", err);
        return res
          .status(500)
          .json({ message: "Erreur lors de la récupération des payements." });
      }

      payements = payementRows;

      // Toutes les données sont collectées, on peut répondre au client
      respondToClient();
    });
  });
});

// Route PUT pour mettre à jour un versement
app.put("/versement/:id", async (req, res) => {
  const id = req.params.id;

  const { versement, payements } = req.body;

  try {
    // Begin transaction
    await db.beginTransaction();

    // Update received payment data
    const updateVersementQuery =
      "UPDATE `versements_en_banque` SET `date_versement`=?,`reference_bordereau_bulletin`=?,`observations`=?,`document_fichier`=? WHERE id = ?";
    await db.query(updateVersementQuery, [
      versement.date_versement,
      versement.reference_bordereau_bulletin,
      versement.observations,
      versement.document_fichier,
      id,
    ]);

    // Delete existing payments associated with this Versement_id
    const deletePaymentQuery = `
      DELETE FROM payements
      WHERE Versement_id=?
    `;
    await db.query(deletePaymentQuery, [id]);

    // Insert new payments
    for (const payment of payements) {
      const { modalite, num, banque, montant, code_tiers, tiers_saisie } =
        payment;
      const insertPaymentQuery = `
        INSERT INTO payements (modalite, num, banque, montant, code_tiers, tiers_saisie, Versement_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      await db.query(insertPaymentQuery, [
        modalite,
        num,
        banque,
        montant,
        code_tiers,
        tiers_saisie,
        id,
      ]);
    }

    // Commit transaction
    await db.commit();

    res
      .status(200)
      .json({ message: "Le Versement a été mis à jour avec succès." });
  } catch (error) {
    // Rollback transaction in case of error
    await db.rollback();
    console.error("Erreur lors de la mise à jour du Versement :", error);
    res.status(500).json({
      error: "Une erreur s'est produite lors de la mise à jour du Versement.",
    });
  }
});

/****************************************************************** */
/************************** Pointage  ****************************/
app.get("/pointage", (req, res) => {
  db.query("SELECT * FROM  pointage_personnel", (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

app.post("/pointage", (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No files were uploaded.");
  }

  let excelFile = req.files.file;
  let workbook = xlsx.read(excelFile.data, { type: "buffer" });

  let sheetName = workbook.SheetNames[0];
  let sheet = workbook.Sheets[sheetName];
  let data = xlsx.utils.sheet_to_json(sheet);

  let sql =
    "INSERT INTO pointage_personnel (date_de_saisie, code_tiers, nbre_jours_travailles1, nbre_jours_travailles2, nbre_jours_absence1, nbre_jours_absence2, nbre_jours_conges1, nbre_jours_conges2, supplement_recus, sommes_rejetees, remboursement_divers, autre_deduction, observations) VALUES ?";

  let values = data.map((row) => [
    new Date(row.date_de_saisie),
    row.code_tiers,
    row.nbre_jours_travailles1,
    row.nbre_jours_travailles2,
    row.nbre_jours_absence1,
    row.nbre_jours_absence2,
    row.nbre_jours_conges1,
    row.nbre_jours_conges2,
    row.supplement_recus,
    row.sommes_rejetees,
    row.remboursement_divers,
    row.autre_deduction,
    row.observations,
  ]);

  db.query(sql, [values], (err, result) => {
    if (err) throw err;
    res.send("Data inserted");
  });
});

/****************************************************************** */
/************************** Document pour Comptabilite ****************************/

// Route pour obtenir la liste des documents
app.get("/documents_comptabilite", (req, res) => {
  db.query("SELECT * FROM documents_comptabilite", (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Route pour créer un nouveau document
app.post("/documents_comptabilite", (req, res) => {
  const {
    date,
    nature,
    designation,
    destinataire,
    document_fichier,
    priorite,
    observations,
  } = req.body;
  db.query(
    "INSERT INTO documents_comptabilite (date, nature, designation, destinataire, document_fichier, priorite, observations) VALUES (?, ?, ?, ?, ?, ?, ?)",
    [
      date,
      nature,
      designation,
      destinataire,
      document_fichier,
      priorite,
      observations,
    ],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send("Document créé");
      }
    }
  );
});

// Route pour modifier un document
app.put("/documents_comptabilite/:id", (req, res) => {
  const { id } = req.params;
  const {
    date,
    nature,
    designation,
    destinataire,
    document_fichier,
    priorite,
    observations,
  } = req.body;
  db.query(
    "UPDATE documents_comptabilite SET date = ?, nature = ?, designation = ?, destinataire = ?, document_fichier = ?, priorite = ?, observations = ? WHERE id = ?",
    [
      date,
      nature,
      designation,
      destinataire,
      document_fichier,
      priorite,
      observations,
      id,
    ],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send("Document modifié");
      }
    }
  );
});

// Route GET pour récupérer un document spécifique
app.get("/documents_comptabilite/:id", (req, res) => {
  const documentId = req.params.id;
  const query = "SELECT * FROM documents_comptabilite WHERE id = ?";

  db.query(query, [documentId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération du document:", err);
      res.status(500).send("Erreur serveur");
      return;
    }

    if (results.length === 0) {
      res.status(404).send("Document non trouvé");
      return;
    }

    res.json(results[0]);
  });
});

/****************************************************************** */
/************************** Document pour Direction ****************************/

// Route pour obtenir la liste des documents
app.get("/documents_direction", (req, res) => {
  db.query("SELECT * FROM documents_direction", (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});

// Route pour créer un nouveau document
app.post("/documents_direction", (req, res) => {
  const {
    date,
    nature,
    designation,
    destinataire,
    document_fichier,
    priorite,
    observations,
  } = req.body;
  const query =
    "INSERT INTO documents_direction (date, nature, designation, destinataire, document_fichier, priorite, observations) VALUES (?, ?, ?, ?, ?, ?, ?)";

  db.query(
    query,
    [
      date,
      nature,
      designation,
      destinataire,
      document_fichier,
      priorite,
      observations,
    ],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send("Document créé");
      }
    }
  );
});

// Route pour modifier un document
app.put("/documents_direction/:id", (req, res) => {
  const { id } = req.params;
  const {
    date,
    nature,
    designation,
    destinataire,
    document_fichier,
    priorite,
    observations,
  } = req.body;
  const query =
    "UPDATE documents_direction SET date = ?, nature = ?, designation = ?, destinataire = ?, document_fichier = ?, priorite = ?, observations = ? WHERE id = ?";

  db.query(
    query,
    [
      date,
      nature,
      designation,
      destinataire,
      document_fichier,
      priorite,
      observations,
      id,
    ],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send("Document modifié");
      }
    }
  );
});

// Route GET pour récupérer un document spécifique
app.get("/documents_direction/:id", (req, res) => {
  const documentId = req.params.id;
  const query = "SELECT * FROM documents_direction WHERE id = ?";

  db.query(query, [documentId], (err, results) => {
    if (err) {
      console.error("Erreur lors de la récupération du document:", err);
      res.status(500).send("Erreur serveur");
      return;
    }

    if (results.length === 0) {
      res.status(404).send("Document non trouvé");
      return;
    }

    res.json(results[0]);
  });
});

/******************************************************************* */
/************************Les Requetes****************************** */

app.get("/total-commandes-par-periode", (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .send({ error: "startDate and endDate are required" });
  }

  const sql =
    "SELECT COUNT(*) as total FROM commandes WHERE date_commande BETWEEN ? AND ?";
  db.query(sql, [startDate, endDate], (err, result) => {
    if (err) {
      console.error("Error fetching total commandes:", err);
      return res
        .status(500)
        .send({
          error: "An error occurred while fetching the total commandes",
        });
    }

    res.send(result);
  });
});

app.get("/liste-clients-par-periode-creation", (req, res) => {
  const { dateCreation } = req.query;

  if (!dateCreation) {
    return res.status(400).send({ error: "dateCreation is required" });
  }

  const sql = "SELECT * FROM entreprises WHERE date_creation = ?";
  db.query(sql, [dateCreation], (err, result) => {
    if (err) {
      console.error("Error fetching clients:", err);
      return res
        .status(500)
        .send({ error: "An error occurred while fetching the clients" });
    }

    res.send(result);
  });
});

app.get("/etat-de-facturation", (req, res) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return res
      .status(400)
      .send({ error: "startDate and endDate are required" });
  }

  const sql =
    "SELECT SUM(montant_total_facture) as totalCA FROM facturations WHERE date_facture BETWEEN ? AND ?";
  db.query(sql, [startDate, endDate], (err, result) => {
    if (err) {
      console.error("Error fetching total CA:", err);
      return res
        .status(500)
        .send({ error: "An error occurred while fetching the total CA" });
    }

    res.send(result);
  });
});

/***************************************************************** */

// Démarrage du serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Le serveur est en écoute sur le port ${PORT}`);
});
