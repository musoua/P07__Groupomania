/* configurer la conection de la base des données */

/* importer mysql */
const mysql = require('mysql2');

/* importer dotenv */
require('dotenv').config();
const dbUser = process.env.dbUser;
const dbPassword = process.env.dbPassword;
const dbHost = process.env.dbHost;
const dbName = process.env.dbName;

/* connection au base des données DB */
exports.connection = mysql.createConnection({
    host: dbHost,
    user: dbUser,
    password: dbPassword,
    database: dbName
});