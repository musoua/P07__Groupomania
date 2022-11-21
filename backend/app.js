/******************** configuration de l'application express ********************/

/* importer express */
const express = require('express');

/* importer helmet */
const helmet = require('helmet');

/* importer node path package */
const path = require('path');

/* importer environment variables */
require('dotenv').config();
const dbName = process.env.dbName;

/* importer la conecction de DB cd */
const mysql = require('./dbConnection').connection;

/* Logging connection info */
mysql.connect(function(err){
    if(err){
        throw err;
    }
    console.log(`Connected successfully to ${dbName} database`);
});

/* création express app en utilusant la methode express */
const app = express();

/* Création d'un middleware à l'aide de la méthode .json pour accéder au corps de la requête */
app.use(express.json());

/* autorisation des demandes origines croisées (d'éviter les erreurs CORS) */
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

/* parametres de helmet avec "cross Origin Resource Policy" */
app.use(helmet({ 
    crossOriginResourcePolicy: { 
        policy: "same-site" 
    } 
}));

/* importer les routes pour user */
const userRoutes = require('./routes/user');
app.use('/api/user', userRoutes);

/* importer les routes pour post */
const postRoutes = require('./routes/post');
app.use('/api/post', postRoutes);

/* Création d'un middleware pour gérer les requêtes qui ajoutent des images au dossier images */
app.use('/images', express.static(path.join(__dirname, 'images')));

/* exporter express app pour l'utilisation sur d'autres fichiers */
module.exports = app;