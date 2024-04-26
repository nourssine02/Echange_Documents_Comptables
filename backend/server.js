const mysql = require("mysql");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

const app = express();
app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));



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
      address: "vihoh74389@ebuthor.com",
    },
    to: email,
    subject: "Verify Your Email Address",
    text: `Please click on the following link to verify your email address: http://localhost:5000/verify-email/${verificationCode}`,
    html: `<p>Please click on the following link to verify your email address: <a href="http://localhost:5000/verify-email/${verificationCode}">Verify Email Address</a></p>`,
  });

  console.log("Email sent: %s", info.messageId);
};

app.post("/register", async (req, res) => {
  const {
    code_entreprise,
    code_user,
    identite,
    position,
    tel,
    email,
    mot_de_passe,
  } = req.body;

  try {
    const verificationCode = generateVerificationCode();

    const hashedPassword = await bcrypt.hash(mot_de_passe, 10);

    const sql =
      "INSERT INTO utilisateurs (code_entreprise, code_user, identite, position, tel, email, mot_de_passe, verification_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    const values = [
      code_entreprise,
      code_user,
      identite,
      position,
      tel,
      email,
      hashedPassword,
      verificationCode,
    ];

    // const sql = "INSERT INTO utilisateurs (code_entreprise, code_user, identite, position, tel, email, mot_de_passe ) VALUES (?)";
    // const values = [code_entreprise, code_user, identite, position, tel, email, mot_de_passe];

    db.query(sql, values, async (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Internal Server Error" });
      }

      // Send verification email
      await sendVerificationEmail(email, verificationCode);

      return res.status(200).json({
        message:
          "User registered successfully. Please verify your email address.",
      });
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

//Route to handle email verification
app.get("/verify-email/:verificationCode", (req, res) => {
  const verificationCode = req.params.verificationCode;

  res.send("Email address verified successfully.");
});

app.post("/login", (req, res) => {
  const sql =
    "SELECT  * FROM  utilisateurs  WHERE  identite = ? AND mot_de_passe = ?";
  const values = [req.body.identite, req.body.mot_de_passe];

  db.query(sql, [values], (err, data) => {
    if (err) return res.json("Login Failed");
    if (data.length > 0) {
      return res.json("Login Successfully");
    } else {
      return res.json("No Record");
    }
  });
});

/**************************************************************** */

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
  const q = "SELECT code_tiers FROM tiers";
  db.query(q, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

/****************************************************************** */
/**********************reglements emis **************************/

// Afficher tous les règlements émis
app.get("/reglements_emis", (req, res) => {
  const query = `
      SELECT
          reglements_emis.id AS id,
          reglements_emis.date_saisie,
          reglements_emis.code_tiers,
          reglements_emis.tiers_saisie,
          reglements_emis.montant_brut,
          GROUP_CONCAT(pieces_a_regler.num_piece_a_regler) AS num_pieces_a_regler,
          GROUP_CONCAT(pieces_a_regler.date_piece_a_regler) AS dates_pieces_a_regler,
          GROUP_CONCAT(pieces_a_regler.montant_piece_a_regler) AS montants_pieces_a_regler
      FROM reglements_emis
      LEFT JOIN pieces_a_regler ON reglements_emis.id = pieces_a_regler.reglement_emis_id
      GROUP BY reglements_emis.id
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
            return res
              .status(500)
              .json({
                message: "Erreur lors de l'insertion du règlement émis.",
              });
          });
        }

        const reglementId = result.insertId;

        // Gérer l'insertion des paiements et des pièces de manière asynchrone
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
                  return res
                    .status(500)
                    .json({
                      message:
                        "Erreur lors de la validation de la transaction.",
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
              "Erreur lors de l'insertion des paiements ou pièces:",
              err
            );
            db.rollback(() => {
              res
                .status(500)
                .json({
                  message:
                    "Erreur lors de l'insertion des paiements ou pièces.",
                });
            });
          });
      }
    );
  });
});

// Route pour récupérer un règlement émis et ses pieces et ses paiements par ID
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

    // Requête pour obtenir les paiements
    const payementQuery = "SELECT * FROM payements WHERE reglement_emis_id = ?";
    db.query(payementQuery, [reglementID], (err, payementRows) => {
      if (err) {
        console.error("Erreur lors de la récupération des paiements:", err);
        return res
          .status(500)
          .json({ message: "Erreur lors de la récupération des paiements." });
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

    // Supprimer les paiements associés au règlement
    await db.query("DELETE FROM `payements` WHERE reglement_emis_id = ?", [
      reglementID,
    ]);
    
    // Supprimer les pièces associées au règlement
    await db.query(
      "DELETE FROM `pieces_a_regler` WHERE reglement_emis_id = ?",
      [reglementID]
    );

    // Ajouter ou mettre à jour les paiements associés
    if (payements && payements.length > 0) {
      for (const payement of payements) {
        // Assigner le reglement_emis_id pour chaque paiement
        payement.reglement_emis_id = reglementID;

        // Insérer un nouveau paiement
        await db.query("INSERT INTO `payements` SET ?", [payement]);
      }
    }

    // Ajouter ou mettre à jour les pieces associés
    if (pieces && pieces.length > 0) {
      for (const piece of pieces) {
        // Assigner le reglement_emis_id pour chaque paiement
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
/**********************reglements recus **************************/

// Afficher tous les règlements recus
app.get("/reglements_recus", (req, res) => {
  const query = `
      SELECT
          reglements_recus.id AS id,
          reglements_recus.code_tiers,
          reglements_recus.tiers_saisie,
          reglements_recus.montant_total_a_regler,
          pieces_a_regler.num_piece_a_regler,
          pieces_a_regler.date_piece_a_regler,
          pieces_a_regler.montant_piece_a_regler
      FROM reglements_recus
      LEFT JOIN pieces_a_regler ON reglements_recus.id = pieces_a_regler.reglement_recus_id
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

// Route pour ajouter un règlement reçu
app.post("/reglements_recus", (req, res) => {
  const { reglement, payements, pieces } = req.body;

  // Commencer une transaction
  db.beginTransaction((err) => {
    if (err) {
      console.error("Erreur lors de la création de la transaction:", err);
      return res
        .status(500)
        .json({ message: "Erreur lors de la création de la transaction." });
    }

    // Insérer le règlement recu
    const insertReglementQuery =
      "INSERT INTO reglements_recus (code_tiers, tiers_saisie, montant_total_a_regler, observations) VALUES (?, ?, ?, ?)";
    db.query(
      insertReglementQuery,
      [
        reglement.code_tiers,
        reglement.tiers_saisie,
        reglement.montant_total_a_regler,
        reglement.observations,
      ],
      (err, result) => {
        if (err) {
          console.error("Erreur lors de l'insertion du règlement recu:", err);
          return db.rollback(() => {
            return res
              .status(500)
              .json({
                message: "Erreur lors de l'insertion du règlement recu.",
              });
          });
        }

        const reglementId = result.insertId;

        // Gérer l'insertion des paiements et des pièces de manière asynchrone
        const payementPromises = payements.map((payement) => {
          return new Promise((resolve, reject) => {
            const insertPayementQuery =
              "INSERT INTO payements (modalite, num, banque, date_echeance, montant, reglement_recus_id) VALUES (?, ?, ?, ?, ?, ?)";
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
              "INSERT INTO pieces_a_regler (num_piece_a_regler, date_piece_a_regler, montant_piece_a_regler, document_fichier, reglement_recus_id) VALUES (?, ?, ?, ?, ?)";
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
            // Confirmer la transaction
            db.commit((err) => {
              if (err) {
                console.error(
                  "Erreur lors de la validation de la transaction:",
                  err
                );
                db.rollback(() => {
                  return res
                    .status(500)
                    .json({
                      message:
                        "Erreur lors de la validation de la transaction.",
                    });
                });
              } else {
                // Réponse de succès
                res.json({ message: "Règlement recu ajouté avec succès." });
              }
            });
          })
          .catch((err) => {
            console.error(
              "Erreur lors de l'insertion des paiements ou pièces:",
              err
            );
            db.rollback(() => {
              res
                .status(500)
                .json({
                  message:
                    "Erreur lors de l'insertion des paiements ou pièces.",
                });
            });
          });
      }
    );
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
        commande.document_fichier
      ],
      (err, result) => {
        if (err) {
          console.error("Erreur lors de l'insertion de la commande :", err);
          return db.rollback(() => {
            return res
              .status(500)
              .json({
                message: "Erreur lors de l'insertion de la commande."
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
                commandeId
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
                  return res
                    .status(500)
                    .json({
                      message:
                        "Erreur lors de la validation de la transaction."
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
                message: "Erreur lors de l'insertion des familles."
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

    // Requête pour obtenir les paiements
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
    req.body.document_fichier
  ];
  db.query(q, [values], (err, data) => {
    if (err) return res.json(err);
    return res.json("Livraison ajouté avec succès");
  });
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
app.get('/familles', (req, res) => {
  const query = 'SELECT DISTINCT famille FROM familles';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête SQL:', err);
      res.status(500).json({ error: 'Erreur lors de la récupération des suggestions de familles' });
    } else {
      const familles = results.map(row => row.famille);
      res.json(familles);
    }
  });
});


// Route pour récupérer les données des familles en fonction de la valeur dans l'URL
app.get('/familles/:famille', (req, res) => {
  const famille = req.params.famille;

  // Requête SQL pour récupérer les données de famille en fonction de la valeur donnée
  const sql = 'SELECT famille, sous_famille, article, quantite FROM familles WHERE famille = ?';

  // Exécution de la requête SQL avec la valeur donnée
  db.query(sql, [famille], (err, results) => {
    if (err) {
      console.error('Erreur lors de l\'exécution de la requête SQL :', err);
      res.status(500).json({ message: 'Erreur lors de la récupération des données de famille' });
    } else {
      // Si des résultats sont trouvés, les renvoyer
      if (results.length > 0) {
        res.json(results[0]); // Nous renvoyons uniquement le premier résultat ici
      } else {
        // Sinon, renvoyer une réponse indiquant que la famille n'a pas été trouvée
        res.status(404).json({ message: 'Famille non trouvée' });
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
      return res.status(500).json({ message: "Erreur lors de la création de la transaction." });
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
        facture.document_fichier
      ],
      (err, result) => {
        if (err) {
          console.error("Erreur lors de l'insertion de la facture :", err);
          return db.rollback(() => {
            return res.status(500).json({ message: "Erreur lors de l'insertion de la facture." });
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
                factureId
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
                console.error("Erreur lors de la validation de la transaction :", err);
                db.rollback(() => {
                  return res.status(500).json({ message: "Erreur lors de la validation de la transaction." });
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
              res.status(500).json({ message: "Erreur lors de l'insertion des familles." });
            });
          });
      }
    );
  });
});

/***************************************************************** */

// Démarrage du serveur
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Le serveur est en écoute sur le port ${PORT}`);
});
