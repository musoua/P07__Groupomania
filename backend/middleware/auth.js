/* CONFIGURATION-AUTHENTIFICATION DE MIDDLEWARE */

/* IMPORTATION DE jsonwebtoken */
const jwt = require('jsonwebtoken');

/* IMPORTATION DE MODEL DE CHARGEMENT DES VARIABLES "DOTENV" */
require('dotenv').config();
const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN;

/* AUTHENTIFICATION DE MIDDLEWARE */
module.exports = (req, res, next) => {
    try {
    /* Récuperation de "token" de requete "headers" */
    const token = req.headers.authorization.split(' ')[1];

    /* Décodage de token avec la fonction verify() */
    const decodedToken = jwt.verify(token, JWT_SECRET_TOKEN);

    /* userdId de decodedToken */
    const userId = decodedToken.userId;

    /* role de decodedToken */
    const role = decodedToken.role;
    
    /* Ajout d'un objet auth contenant l'ID utilisateur à la requête */
    req.auth = {userId, role};

    /* Si l'ID utilisateur dans la requête est différent de l'ID utilisateur renvoyé par l'opération précédente, une erreur est générée */
    if (req.body.userId && req.body.userId !== userId) {
        throw 'User ID non valable';
    } else {
    /* Si l'userId dans la requête est identique à l'userId renvoyé par l'opération précédente, appeler la fonction next() pour exécuter le middleware suivant */
        next();
    }
    /* Handling errors */
    } catch (error) {
    res.status(401).json({error});
    }
};