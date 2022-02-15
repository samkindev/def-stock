// // Module de session de l'utilisateur (assujetti)
// // Interaction avec la session PHP

// // Appel aux modules externes
// var Memcached = require("memcached");
// const path = require("path");
// const phpUnserialize = require("php-unserialize");
// const { getAssujetti, getUser } = require("./helpers");
// const getDatabase = require("../models/assujettiDb");

// class UserSession {
// 	/**
// 	 * Constructeur d'initialisation de l'objet de session utilisateur
// 	 */
// 	constructor() {
// 		this.session_prefix = "memc.sess.key.";
// 		this.readSession = this.readSession.bind(this);
// 		this.getUserData = this.getUserData.bind(this);
// 	}

// 	/**
// 	 * User database name getter
// 	 * @param {string} numDef Def number of the user
// 	 * @returns user db name
// 	 */
// 	static getBdName(numDef) {
// 		return (
// 			"def_" +
// 			numDef.replaceAll("/", "").replaceAll("-", "").toLowerCase()
// 		);
// 	}

// 	// Fonction de lecture de la session à partir du fichier tmp
// 	readSession(req, res, next) {
// 		const unauthMessage = "Aucune session utilisateur.";
// 		// Recuperation du cookie
// 		const sid = req.cookies;
// 		// Verification de l'existance du cookie PHPSESSID
// 		try {
// 			if (sid.PHPSESSID) {
// 				// Lecture de la session utilisateur dans la memoire cache Memcache
// 				//
// 				// * S'il n'y a pas erreur
// 				//  - Decoder la session avec phpUnserialize
// 				//  - Création de l'attribut session sur la variable globale de la requête
// 				//  - Et passer à la fonction suivante
// 				//
// 				// * Si eureur
// 				//  - Renvoyer une nouvelle erreur
// 				//  - Retourner la réponse de non authentification

// 				// Connextion Memcache
// 				var mem = new Memcached("127.0.0.1:11211");
// 				// La session avec le prefix de memcache session
// 				const memSID = this.session_prefix + sid.PHPSESSID;
// 				mem.get(memSID, (err, data) => {
// 					if (err) {
// 						console.error(err);
// 						return res.sendFile(
// 							path.join(__dirname, "../client/build/index.html")
// 						);
// 					} else if (data) {
// 						const sd = phpUnserialize.unserializeSession(data);
// 						req.session = sd;
// 						console.log(sd);
// 						next();
// 					} else {
// 						console.log(err);
// 						return res.sendFile(
// 							path.join(__dirname, "../client/build/index.html")
// 						);
// 					}
// 				});
// 			} else {
// 				return res.sendFile(
// 					path.join(__dirname, "../client/build/index.html")
// 				);
// 			}
// 		} catch (error) {
// 			// Redirection page d'accueil qui renvera l'utilisateur a la page login php
// 			return res.sendFile(
// 				path.join(__dirname, "../client/build/index.html")
// 			);
// 		}
// 	}

// 	/**
// 	 * Recupere le nom de la table de categorie
// 	 * @param {string} catAssujetti La categorie de l'assujetti
// 	 * @returns la chaine des caractere qui represente la table de categorie assujetti
// 	 */
// 	getTabName(catAssujetti) {
// 		let table = "";
// 		switch (catAssujetti) {
// 			case "pmc":
// 				table = "personne_morale_commercante";
// 				break;
// 			case "ppc":
// 				table = "personne_physique_commercante";
// 				break;
// 			case "pmnc":
// 				table = "personne_morale_non_commercante";
// 				break;
// 			case "ppnc":
// 				table = "personne_physique_non_commercante";
// 				break;
// 			default:
// 				break;
// 		}

// 		return table;
// 	}

// 	// Fonction de recuperation des données de l'assujetti
// 	async getUserData(req, res, next) {
// 		try {
// 			// Variable session
// 			const session = req.session;

// 			// Verification de la valeur de la variable session
// 			if (!session || !session.NUMERODEF) {
// 				return res.sendFile(
// 					path.join(__dirname, "../client/build/index.html")
// 				);
// 			}

// 			// Recuperation du nom de la table de l'assujetti
// 			const tabName = this.getTabName(session.CATEGORIEASSUJETTI);

// 			// Recherche de l'assujetti
// 			const assujetti = await getAssujetti(tabName, session.NUMERODEF);
// 			// Recuperation du nom de la base des données de l'assujetti
// 			const dbName = UserSession.getBdName(assujetti.numero_def); //"def_" + assujetti.numero_def.replaceAll("/", "").replaceAll("-", "").toLowerCase();
// 			const db = getDatabase(dbName);
// 			db.sequelize.sync({ force: false });
// 			const user = await getUser(db.agents, session.IDUSER);

// 			// Si assujetti trouvé
// 			//  - Création de l'attribut assujetti sur l'objet global de la requête
// 			//  - et passer à la fonction suivante
// 			if (assujetti) {
// 				req.assujetti = assujetti;
// 				req.user = user;
// 				req.table = tabName;
// 				req.dbName = dbName;
// 				req.assujettiDb = db;
// 				return next();
// 			}

// 			// Si aucun assujetti trouvé
// 			// réponse de non authentification
// 			return res.sendFile(
// 				path.join(__dirname, "../client/build/index.html")
// 			);
// 			// return next.status(403).json({
// 			// 	message: "Unauthenticated",
// 			// });
// 		} catch (err) {
// 			next(err);
// 		}
// 	}
// }

// module.exports = UserSession;


// Module de session de l'utilisateur (assujetti)
// Interaction avec la session PHP

// Appel aux modules externes
const fs = require("fs");
const path = require('path');
const phpUnserialize = require("php-unserialize");
const { getAssujetti, getUser } = require("./helpers");
const getDatabase = require('../models/assujettiDb');

class UserSession {
	/**
	 * Constructeur d'initialisation de l'objet de session utilisateur
	 * @param {string} path Chemin racine d'accès au ficher de session
	 */
	constructor(path) {
		if (!path || path === "") {
			throw new Error("Session file path is required");
		}
		this.path = path;
		this.readSession = this.readSession.bind(this);
		this.getUserData = this.getUserData.bind(this);
	}

	// Fonction de lecture de la session à partir du fichier tmp
	readSession(req, res, next) {
		// Recuperation du cookie
		const sid = req.cookies;
		// Verification de l'existance du cookie PHPSESSID
		if (sid.PHPSESSID) {
			// Lecture du fichier de session
			//
			// * S'il n'y a pas erreur
			//  - Decoder les données de la session
			//  - Création de l'attribut session sur la variable globale de la requête
			//  - Et passer à la fonction suivante
			//
			// * Si eureur
			//  - Afficher l'erreur
			//  - Retourner la réponse de non authentification
			fs.readFile(
				this.path + "sess_" + sid.PHPSESSID,
				"utf-8",
				function (err, data) {
					if (!err) {
						var sd = phpUnserialize.unserializeSession(data);
						req.session = sd;
						next();
					} else {
						console.log(err);
						return res.sendFile(path.join(__dirname, '../client/build/index.html'));
						// return res.status(403).json({
						// 	message: "Unauthenticated",
						// });
					}
				}
			);
		} else {
			return res.sendFile(path.join(__dirname, '../client/build/index.html'));
			// res.status(403).json({
			// 	message: "Unauthenticated (No session)",
			// });
		}
	}

    // Fonction de recuperation du nom de la table
	getTabName = (catAssujetti) => {
		let table = "";
		switch (catAssujetti) {
			case "pmc":
				table = "personne_morale_commercante";
				break;
			case "ppc":
				table = "personne_physique_commercante";
                break;
			case "pmnc":
				table = "personne_morale_non_commercante";
				break;
			case "ppnc":
				table = "personne_physique_non_commercante";
                break;
            default:
                break;
		}

        return table;
	};

	// Fonction de recuperation des données de l'assujetti
	async getUserData(req, res, next) {
		try {
			// Variable session
			const session = req.session;

			// Verification de la valeur de la variable session
			if (!session || !session.NUMERODEF) {
				return res.sendFile(path.join(__dirname, '../client/build/index.html'));
				// return res.status(403).json({
				// 	message: "Unauthenticated(No assujetti)",
				// });
			}

            // Recuperation du nom de la table de l'assujetti
			const tabName = this.getTabName(session.CATEGORIEASSUJETTI);

			// Recherche de l'assujetti
			const assujetti = await getAssujetti(tabName, session.NUMERODEF);
            // Recuperation du nom de la base des données de l'assujetti
            const dbName = "def_" + assujetti.numero_def.replaceAll("/", "").replaceAll("-", "").toLowerCase();
			const db = getDatabase(dbName);
			db.sequelize.sync({force: false});
			const user = await getUser(db.agents, session.IDUSER);

            // Si assujetti trouvé
			//  - Création de l'attribut assujetti sur l'objet global de la requête
			//  - et passer à la fonction suivante
			if (assujetti) {
				req.assujetti = assujetti;
				req.user = user;
                req.table = tabName;
                req.dbName = dbName;
                req.assujettiDb = db;
				return next();
			}

			// Si aucun assujetti trouvé
			// réponse de non authentification
			return res.sendFile(path.join(__dirname, '../client/build/index.html'));
			// return next.status(403).json({
			// 	message: "Unauthenticated",
			// });
		} catch (err) {
			next(err);
		}
	}
}

module.exports = UserSession;
