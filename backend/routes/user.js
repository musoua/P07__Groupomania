/* configuration les routes de "user" */

/* importer express */
const express = require('express');

/* créer router avec la fonction Router() */
const router = express.Router();

/* importer post controller */
const userControl = require('../controllers/user');

/* importer authentication middleware */
const auth = require('../middleware/auth');

/* Importation de la configuration multur pour gérer les fichiers */
const multer = require('../middleware/multer-config');

/* Création des routes pour user  */
router.post('/signup', userControl.signup);
router.post('/login', userControl.login);
router.put('/:id', auth, multer, userControl.modifyUser);
router.get('/', auth, userControl.getAllUsers);
router.get('/:id', auth, userControl.getOneUser);
router.delete('/:id', auth, userControl.deleteOneUser);
router.put('/:id/role', auth, userControl.changeRole);
router.put('/:id/password', auth, userControl.changePassword);

/* exporter router */
module.exports = router;
