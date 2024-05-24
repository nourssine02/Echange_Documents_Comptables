const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { v4: uuidv4, validate } = require("uuid");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const app = express();


app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

const db = mysql.createConnection({
  database: "cloud",
  host: "localhost",
  user: "root",
  password: "",
  dateStrings: "date",
});

// Connect to MySQL
db.connect((err) => {
  if (err) throw err;
  console.log("Connected to the MySQL database");
});

// Définition de routes
app.get("/", (req, res) => {
  res.json("Bonjour depuis le serveur Node.js !");
});

/*************************************************************** */ 

const secretKey = 'MY_SECRET_KEY_WAS_ABCD1234';

// Middleware de vérification du token JWT
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  //const token = req.headers["x-access-token"];

  if (!token) return res.status(401).json({ message: "Token manquant" });

  jwt.verify(token.split(' ')[1], secretKey, (err, decoded) => {
    if (err) return res.status(403).json({ message: 'Token invalide' });
    req.user = {
      identite: decoded.identite,
      role: decoded.role,
    };
    next();
  });
}


// Authenticated route
app.get('/home', verifyToken, (req, res) => {
  res.json({ message: 'Bienvenue sur la page d\'accueil', user: req.user });
});


const roles = {
  SUPER_ADMIN: 'super_admin',
  COMPTABLE: 'comptable',
  CLIENT: 'client'
};

// Middleware pour vérifier les rôles
const checkRole = (rolesAllowed) => {
  return (req, res, next) => {
    const userRole = req.user.role; // Supposons que le rôle de l'utilisateur soit stocké dans req.user.role
    if (rolesAllowed.includes(userRole)) {
      next();
    } else {
      res.status(403).send('Accès refusé.');
    }
  };
};

// Routes avec gestion des accès
app.use((req, res, next) => {
  // Middleware pour simuler l'authentification et ajouter un utilisateur à req.user
  req.user = { role: roles.SUPER_ADMIN }; // Exemple d'utilisateur super admin
  next();
});




/*************************************************************************** */

/***************************Register /login ******************************* */

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


// Login GET route
app.get('/login', (req ,res ) =>{
  if(req.session.user){
    res.send({loggedIn : true , user: req.session.user});
  } else {
    res.send({loggedIn : false});
  }
})


// Login route
app.post('/login', (req, res) => {
  const { identite, mot_de_passe } = req.body;

  // Requête à la base de données pour vérifier les identifiants
  const sql = 'SELECT * FROM utilisateurs WHERE identite = ?';
  db.query(sql, [identite], (err, results) => {
    if (err) {
      console.error('Erreur lors de la connexion :', err);
      return res.status(500).json({ message: 'Erreur du serveur' });
    }

    if (results.length === 0) {
      return res.status(401).json({ message: 'Identifiants invalides' });
    }

    bcrypt.compare(mot_de_passe, results[0].mot_de_passe, (err, isMatch) => {
      if (err) {
        console.error('Erreur lors de la comparaison des mots de passe :', err);
        return res.status(500).json({ message: 'Erreur du serveur' });
      }

      if (isMatch) {
        const token = jwt.sign({  identite, role: results[0].role }, secretKey, { expiresIn: '1d' });
        res.json({ auth: true , token : token });

      } else {
        res.status(401).json({ message: 'Identifiants invalides' });
      }
    });
  });
});



// Logout route
app.post("/logout", (req, res) => {
  try{
      // Supprimer le token JWT du stockage local
  localStorage.removeItem('token');

  // Envoyer une réponse de succès
  res.status(200).json({ message: "Déconnexion réussie" });

  } catch (error) {
    // En cas d'erreur, répondre avec un statut 500 et un message d'erreur
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la déconnexion' });
  }
});




/**************************************************************************** */

app.get("/code_entreprises", (req, res) => {
  const q = "SELECT code_entreprise FROM entreprises";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

/************************* Entreprises ******************************* */

// affichier all Entreprises
app.get("/entreprises", (req, res) => {
  const q = "SELECT * FROM entreprises";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Add entreprise
app.post("/entreprises", (req, res) => {
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

/************************************************************/
/**********************Utilisateurs**************************/

// affichier all Users
app.get("/utilisateurs", (req, res) => {
  const q = "SELECT * FROM  utilisateurs";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Add utilisateur
app.post("/users", (req, res) => {
  const q =
    "INSERT INTO utilisateurs ( `code_entreprise`, `code_user`, `identite`, `position`, `tel`, `email`, `mot_de_passe` ) VALUES (?)";
  const values = [
    req.body.code_entreprise,
    req.body.code_user,
    req.body.identite,
    req.body.position,
    req.body.tel,
    req.body.email,
    req.body.mot_de_passe,
  ];
  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Utilisateur ajouté avec succès");
  });
});

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
app.put("/users/:id", (req, res) => {
  const userID = req.params.id;
  const q =
    "UPDATE utilisateurs SET `code_entreprise` = ?, `code_user` = ?, `identite` = ?, `position` = ?, `tel` = ?, `email` = ?, `mot_de_passe` = ? WHERE id = ?";

  const values = [
    req.body.code_entreprise,
    req.body.code_user,
    req.body.identite,
    req.body.position,
    req.body.tel,
    req.body.email,
    req.body.mot_de_passe,
  ];

  db.query(q, [...values, userID], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//get utilisateur by id
app.get("/users/:id", (req, res) => {
  const userID = req.params.id;
  const q = "SELECT * FROM utilisateurs WHERE id = ? ";

  db.query(q, [userID], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
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
app.post("/tiers", (req, res) => {
  const q =
    "INSERT INTO tiers (code_tiers, date_creation, type, identite, `MF/CIN`, tel, email, adresse, observations) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
  const values = [
    req.body.code_tiers,
    req.body.date_creation,
    req.body.type,
    req.body.identite,
    req.body.MF_CIN,
    req.body.tel,
    req.body.email,
    req.body.adresse,
    req.body.observations,
  ];

  db.query(q, values, (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Erreur lors de l'ajout du tier." });
    }
    return res
      .status(200)
      .json({ message: "Le tier a été ajouté avec succès." });
  });
});

//Update tier
app.put("/tiers/:id", (req, res) => {
  const tierID = req.params.id;
  const q =
    "UPDATE  tiers  SET  `code_tiers`=?, `date_creation`=?, `type`=?, `identite`=?, `MF/CIN`=?, `tel`=?,`email`=?, `adresse`=?, `observations`=?  WHERE id =? ";

  const values = [
    req.body.code_tiers,
    req.body.date_creation,
    req.body.type,
    req.body.identite,
    req.body.MF_CIN,
    req.body.tel,
    req.body.email,
    req.body.adresse,
    req.body.observations,
  ];

  db.query(q, [...values, tierID], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//get tiers by id

app.get("/tiers/:id", (req, res) => {
  const tierID = req.params.id;
  const q = "SELECT * FROM tiers WHERE id = ? ";
  db.query(q, [tierID], (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

//Delete tier
app.delete("/tiers/:id", (req, res) => {
  const tierID = req.params.id;
  const q = "DELETE FROM tiers WHERE id = ?";

  db.query(q, [tierID], (err, data) => {
    if (err) return res.json(err);
    return res.json("Tier supprimé avec succès");
  });
});

/************************************************************/
/**********************Achats**************************/

// affichier all achats
app.get("/achats", (req, res) => {
  const q = "SELECT * FROM  achats";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
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

// Add Achat
app.post("/achats", (req, res) => {
  const q =
    "INSERT INTO achats (`date_saisie`, `code_tiers`, `tiers_saisie`, `type_piece`, `num_piece`, `date_piece`, `statut`, `montant_HT_piece`, `FODEC_piece`, `TVA_piece`, `timbre_piece`, `autre_montant_piece`, `montant_total_piece`, `observations`, `document_fichier`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";

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
    req.body.document_fichier || null,
  ];

  // Check for empty values and replace them with null
  const sanitizedValues = values.map((value) => (value === "" ? null : value));

  db.query(q, sanitizedValues, (err, data) => {
    if (err) {
      console.error(err);
      return res
        .status(500)
        .json({ error: "Erreur lors de l'ajout d'un Achat." });
    }
    return res
      .status(200)
      .json({ message: "L'Achat a été ajouté avec succès." });
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
  const query = "SELECT `identite`, code_tiers FROM tiers";

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
app.get("/reglements_emis", (req, res) => {
  const q = "SELECT * FROM  reglements_emis";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

// Route pour ajouter un règlement émis
app.post("/reglements_emis", (req, res) => {
  const { reglement, payements, pieces } = req.body;

  // Commencez une transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error("Erreur lors de la création de la transaction:", err);
      return res
        .status(500)
        .json({ message: "Erreur lors de la création de la transaction." });
    }

    // Insérer le règlement émis
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
          return db.rollback(() => {
            return res.status(500).json({
              message: "Erreur lors de l'insertion du règlement émis.",
            });
          });
        }

        const reglementId = result.insertId;

        // Gérer l'insertion des payements et des pièces de manière asynchrone
        const payementPromises = payements.map((payement) => {
          return new Promise((resolve, reject) => {
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
              (err) => {
                if (err) {
                  return reject(err);
                }
                resolve();
              }
            );
          });
        });

        const piecePromises = pieces.map((piece) => {
          return new Promise((resolve, reject) => {
            const insertPieceQuery =
              "INSERT INTO pieces_a_regler (num_piece_a_regler, date_piece_a_regler, montant_piece_a_regler, document_fichier, reglement_emis_id) VALUES (?, ?, ?, ?, ?)";
            db.query(
              insertPieceQuery,
              [
                piece.num_piece_a_regler,
                piece.date_piece_a_regler,
                piece.montant_piece_a_regler,
                piece.document_fichier,
                reglementId,
              ],
              (err) => {
                if (err) {
                  return reject(err);
                }
                resolve();
              }
            );
          });
        });

        // Attendre que toutes les promesses soient résolues
        Promise.all([...payementPromises, ...piecePromises])
          .then(() => {
            // Confirmez la transaction
            db.commit((err) => {
              if (err) {
                console.error(
                  "Erreur lors de la validation de la transaction:",
                  err
                );
                db.rollback(() => {
                  return res.status(500).json({
                    message: "Erreur lors de la validation de la transaction.",
                  });
                });
              } else {
                // Réponse de succès
                res.json({ message: "Règlement émis ajouté avec succès." });
              }
            });
          })
          .catch((err) => {
            console.error(
              "Erreur lors de l'insertion des payements ou pièces:",
              err
            );
            db.rollback(() => {
              res.status(500).json({
                message: "Erreur lors de l'insertion des payements ou pièces.",
              });
            });
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
app.post("/commande", (req, res) => {
  const { commande, familles } = req.body;

  // Commencer une transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error("Erreur lors de la création de la transaction:", err);
      return res
        .status(500)
        .json({ message: "Erreur lors de la création de la transaction." });
    }

    // Insérer la commande
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
          return db.rollback(() => {
            return res.status(500).json({
              message: "Erreur lors de l'insertion de la commande.",
            });
          });
        }

        const commandeId = result.insertId;

        // Gérer l'insertion des familles de manière asynchrone
        const famillePromises = familles.map((famille) => {
          return new Promise((resolve, reject) => {
            const insertFamilleQuery =
              "INSERT INTO `familles`(`famille`, `sous_famille`, `article`, `quantite`, `commande_id`) VALUES (?,?,?,?,?)";
            db.query(
              insertFamilleQuery,
              [
                famille.famille,
                famille.sous_famille,
                famille.article,
                famille.quantite,
                commandeId,
              ],
              (err) => {
                if (err) {
                  return reject(err);
                }
                resolve();
              }
            );
          });
        });

        // Attendre que toutes les promesses soient résolues
        Promise.all([...famillePromises])
          .then(() => {
            // Confirmer la transaction
            db.commit((err) => {
              if (err) {
                console.error(
                  "Erreur lors de la validation de la transaction :",
                  err
                );
                db.rollback(() => {
                  return res.status(500).json({
                    message: "Erreur lors de la validation de la transaction.",
                  });
                });
              } else {
                // Réponse de succès
                res.json({ message: "Commande ajoutée avec succès." });
              }
            });
          })
          .catch((err) => {
            console.error("Erreur lors de l'insertion des familles :", err);
            db.rollback(() => {
              res.status(500).json({
                message: "Erreur lors de l'insertion des familles.",
              });
            });
          });
      }
    );
  });
});

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
app.post("/livraison", (req, res) => {
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
    return res.json("Livraison ajouté avec succès");
  });
});

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
    "SELECT famille, sous_famille, article, quantite FROM familles WHERE famille = ?";

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
  const { facture, familles } = req.body;

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
      "INSERT INTO `factures`(`date_facture`, `num_facture`, `code_tiers`, `tiers_saisie`, `reference_livraison`, `montant_HT_facture`, `FODEC_sur_facture`, `TVA_facture`, `timbre_facture`, `autre_montant_facture`, `montant_total_facture`, `observations`, `document_fichier`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)";
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

        const factureId = result.insertId;

        // Gérer l'insertion des familles de manière asynchrone
        const famillePromises = familles.map((famille) => {
          return new Promise((resolve, reject) => {
            const insertFamilleQuery =
              "INSERT INTO `familles`(`famille`, `sous_famille`, `article`, `quantite`, `facture_id`) VALUES (?,?,?,?,?)";
            db.query(
              insertFamilleQuery,
              [
                famille.famille,
                famille.sous_famille,
                famille.article,
                famille.quantite,
                factureId,
              ],
              (err) => {
                if (err) {
                  return reject(err);
                }
                resolve();
              }
            );
          });
        });

        // Attendre que toutes les promesses soient résolues
        Promise.all([...famillePromises])
          .then(() => {
            // Confirmer la transaction
            db.commit((err) => {
              if (err) {
                console.error(
                  "Erreur lors de la validation de la transaction :",
                  err
                );
                db.rollback(() => {
                  return res.status(500).json({
                    message: "Erreur lors de la validation de la transaction.",
                  });
                });
              } else {
                // Réponse de succès
                res.json({ message: "Facture ajoutée avec succès." });
              }
            });
          })
          .catch((err) => {
            console.error("Erreur lors de l'insertion des familles :", err);
            db.rollback(() => {
              res
                .status(500)
                .json({ message: "Erreur lors de l'insertion des familles." });
            });
          });
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

// Route pour récupérer une facture par son ID avec ses familles
app.get("/facture/:id", (req, res) => {
  const FactureID = req.params.id;

  // Initialisation des objets de données vides
  let facture = null;
  let familles = [];

  // Fonction pour répondre au client
  const respondToClient = () => {
    res.json({ facture, familles });
  };

  // Requête pour obtenir le règlement émis
  const factureQuery = "SELECT * FROM facturations WHERE id = ?";
  db.query(factureQuery, [FactureID], (err, factureRows) => {
    if (err) {
      console.error("Erreur lors de la récupération du facture:", err);
      return res
        .status(500)
        .json({ message: "Erreur lors de la récupération du facture." });
    }

    if (factureRows.length === 0) {
      // Aucun règlement trouvé
      return res.status(404).json({ message: "facture non trouvé." });
    }

    facture = factureRows[0];

    // Requête pour obtenir les payements
    const familleQuery = "SELECT * FROM familles WHERE facture_id = ?";
    db.query(familleQuery, [FactureID], (err, familleRows) => {
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

// Route pour mettre à jour une facture et ses familles
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
    familles, // Array of famille objects
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

  const updateFamillesQuery = `
    UPDATE familles 
    SET 
      famille = ?,
      sous_famille = ?,
      article = ?,
      quantite = ?
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

    await Promise.all(
      familles.map(async (famille) => {
        const {
          id: familleId,
          famille: familleName,
          sous_famille,
          article,
          quantite,
        } = famille;
        await db.query(updateFamillesQuery, [
          familleName,
          sous_famille,
          article,
          quantite,
          familleId,
        ]);
      })
    );

    res
      .status(200)
      .json({ message: "Facture et ses familles mises à jour avec succès" });
  } catch (error) {
    console.error(
      "Erreur lors de la mise à jour de la facture et de ses familles :",
      error
    );
    res.status(500).json({
      message: "Erreur lors de la mise à jour de la facture et de ses familles",
    });
  }
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
    res
      .status(500)
      .json({
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
    res
      .status(500)
      .json({
        error: "Une erreur s'est produite lors de la mise à jour du Versement.",
      });
  }
});




/****************************************************************** */
/************************** Document pour Comptabilite ****************************/

// Route pour obtenir la liste des documents
app.get('/documents_comptabilite', (req, res) => {
  db.query('SELECT * FROM documents_comptabilite', (err, results) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(results);
    }
  });
});



// Route pour créer un nouveau document
app.post('/documents_comptabilite', (req, res) => {
  const { date, nature, designation, destinataire, document_fichier, priorite, observations } = req.body;
  db.query(
    'INSERT INTO documents_comptabilite (date, nature, designation, destinataire, document_fichier, priorite, observations) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [date, nature, designation, destinataire, document_fichier, priorite, observations],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.status(201).send('Document créé');

      }
    }
  );
});

// Route pour modifier un document
app.put('/documents_comptabilite/:id', (req, res) => {
  const { id } = req.params;
  const { date, nature, designation, destinataire, document_fichier, priorite, observations } = req.body;
  db.query(
    'UPDATE documents_comptabilite SET date = ?, nature = ?, designation = ?, destinataire = ?, document_fichier = ?, priorite = ?, observations = ? WHERE id = ?',
    [date, nature, designation, destinataire, document_fichier, priorite, observations, id],
    (err, results) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.send('Document modifié');

      }
    }
  );
});


// Route GET pour récupérer un document spécifique
app.get('/documents_comptabilite/:id', (req, res) => {
  const documentId = req.params.id;
  const query = 'SELECT * FROM documents_comptabilite WHERE id = ?';

  db.query(query, [documentId], (err, results) => {
    if (err) {
      console.error('Erreur lors de la récupération du document:', err);
      res.status(500).send('Erreur serveur');
      return;
    }

    if (results.length === 0) {
      res.status(404).send('Document non trouvé');
      return;
    }

    res.json(results[0]);
  });
});


/***************************************************************** */

// Démarrage du serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Le serveur est en écoute sur le port ${PORT}`);
});
