/* CONFIGURATION DE MULTER */

/* IMPORTER MULTER */
const multer = require('multer');

/* CREATION DE MIME_TYPES dictionary */
const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png' ,
    'image/gif': 'gif'
};

/* Creation multer configuration's object */
const storage = multer.diskStorage({
    /* définir le dossier "images" comme une distination */
    destination: (req, file, callback) => {
        callback(null, 'images');
    },
    filename: (req, file, callback) => {
        /* Définir le nom des fichiers en utilisant le nom d'origine, où les espaces sont remplacés par _ */
        const name = file.originalname.split(' ').join('_');
        /* Génération d'extension en choisissant dans le dictionnaire MIME_TYPE le type mime qui correspond au type mime du fichier image */
        const extension = MIME_TYPES[file.mimetype];
        /* Création du nom du fichier à l'aide d'un horodatage pour le rendre unique */
        callback(null, name + Date.now() + '.' + extension);
    }
});

/* exporter multer middleware */
module.exports = multer({storage}).single('image');



















