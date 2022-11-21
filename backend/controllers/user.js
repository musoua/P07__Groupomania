/* CONTROLLER DE USER */

/* importation de la configuration DataBase  */
const mysql = require('../dbConnection').connection;

/* IMPORTATION DE jsonwebtoken */
const jwt = require('jsonwebtoken');

/* importation  de "file system" de nodejs  */
const fs = require('fs');

/* IMPORTATION DE MODEL DE CHARGEMENT DES VARIABLES "DOTENV" */

require('dotenv').config();
const EMAIL_ENCRYPTION_KEY = process.env.EMAIL_ENCRYPTION_KEY;
const JWT_SECRET_TOKEN = process.env.JWT_SECRET_TOKEN;

/* SECURITY */

/* IMPORTATION DE bcrypt */
const bcrypt = require('bcrypt');

/* IMPORTATION DE email-validator */
const emailValidator = require('email-validator');

/* IMPORTATION DE PASSWORD-VALIDATOR ET CREATION D'UN SCHEMA  */
const passwordValidator = require('password-validator');
const { json } = require('express');
const schema = new passwordValidator();
schema
.is().min(8)
.is().max(20)
.has().uppercase()
.has().lowercase()
.has().digits()
.has().not().spaces()
.has().symbols();

/* SIGNUP */
exports.signup = (req, res, next) => {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    const imageUrl = 'http://localhost:3000/images/avatar.jpg';
    const bio = '';
 
    if(!emailValidator.validate(email)){
        return res.status(401).json({message: `L'adresse email "${email}" est NON valide !`});
    } else if (!schema.validate(password)){
        return res.status(401).json({message: "Le mot de passe est NON valide."});
    } else if (passwordConfirm !== password){
        return res.status(401).json({message: "Les mots de passe ne sont pas identiques !"});
    }
    if(email === 'ouarnoughi.m@live.fr'){
        role_id = 1;
    } else {
        role_id = '2';
    }
    bcrypt.hash(password, 10)
    .then(hash => {
        mysql.query(`INSERT INTO user (username, email, password, role_id, imageUrl, bio) VALUES (?,?,?,?,?,?)`, [username, email, hash, role_id, imageUrl, bio], (err, result, fields) => {
            if(err){
                return res.status(401).json({message: `L'adresse "${email}" est déjà utilisée`});
            }
            res.status(200).json({message: 'Bienvenue !'});
        });
    });
};

/* LOGIN */
exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    mysql.query(`SELECT user.email, user.password, user.id, role.role FROM user JOIN role ON user.role_id = role.id WHERE email = '${email}'`, (err, result, fields) => {
        if(err){
            return res.status(500).json({err});
        }
        if(result.length === 0){
            return res.status(404).json({message: "Utilisateur introuvable !"});
        }
        bcrypt.compare(password, result[0].password)
        .then(valid => {
            if(!valid){
                return res.status(401).json({message: "Mot de passe incorrect !"});
            }
            res.status(200).json({
                userId: result[0].id,
                role: result[0].role,
                token: jwt.sign(
                    {userId: result[0].id, role: result[0].role},
                    JWT_SECRET_TOKEN,
                    {expiresIn: '24h'}
                )
            });
        })
        .catch(error => res.status(500).json({error}));
    });
};
/* GET ONE USER */
exports.getOneUser = (req, res, next) => {
    let userId = req.params.id;
    mysql.query(`SELECT user.id, user.username, user.email, user.imageUrl, user.bio, role.role FROM user JOIN role ON user.role_id = role.id WHERE user.id = ${userId}`, (err, result, fields) => {
        if(err){
            return res.status(500).json({err});
        }
        if(result.length === 0){
            return res.status(404).json({message: "Utilisateur introuvable !"});
        }
        return res.status(200).json(result[0]);
    });
};

/* GET ALL USERS */
exports.getAllUsers = (req, res, next) => {
    mysql.query(`SELECT user.id, user.username, user.email, user.imageUrl, user.bio, role.role FROM user JOIN role on user.role_id = role.id ORDER BY user.username ASC` , (err, result, fields) => {
        if(err){
            return res.status(500).json({err});
        }
        if(result.length === 0){
            return res.status(404).json({message: "Aucuns utilisateurs !"});
        }
        res.status(200).json(result);
    });
};

/* MODIFY ONE USER */
exports.modifyUser = (req, res, next) => {
    const userId = req.params.id;
    const id = req.auth.userId;
    if(userId != id){
        return res.status(403).json({message: "Requête non autorisée !"});
    }
    if(req.file){
        const user = JSON.parse(req.body.user);
        const newUsername = user.username;
        const newBio = user.bio;
        const newImageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
        if(newUsername === '' || newBio === ''){
            return res.status(403).json({message: "Veuillez renseigner un nom d'utilisateur et une bio !"});
        } else {
            mysql.query(`SELECT * FROM user WHERE id = ${userId}`, (err, result, fields) => {
                if(err){
                    return res.status(404).json({err});
                }
                if(result.length === 0){
                    return res.status(404).json({message: "Utilisateur introuvable !"});
                }
                if(id != userId){
                    return res.status(403).json({message: "Requête non autorisée !"});
                }
                const filename = result[0].imageUrl.split('/images/')[1];
                if(filename != "avatar.jpg"){
                    fs.unlink(`images/${filename}`, () => {
                        mysql.query(`UPDATE user SET username = ?, bio = ?, imageUrl = ? WHERE id = ${userId}`, [newUsername, newBio, newImageUrl], (err, result, fields) => {
                            if(err){
                                return res.status(403).json({message: "Ce nom d'utilisateur est déjà utilisé !"});
                            }
                            return res.status(201).json({message: "Profil mis à jour !"});
                        });
                    });
                } else {
                    mysql.query(`UPDATE user SET username = ?, bio = ?, imageUrl = ? WHERE id = ${userId}`, [newUsername, newBio, newImageUrl],(err, result, fields) => {
                        if(err){
                            return res.status(500).json({err});
                        }
                        return res.status(201).json({message: "Profil mis à jour !"});
                    });
                }
            });
        }
    } else {
        const newUsername = req.body.username;
        const newBio = req.body.bio;
        if(newUsername === '' || newBio === '' ){
            return res.status(403).json({message: "Veuillez renseigner un nom d'utilisateur et une bio !"});
        } else {
            mysql.query(`SELECT * FROM user WHERE id = ${userId}`, (err, result, fields) => {
                if(err){
                    return res.status(404).json({err});
                }
                if(result.length === 0){
                    return res.status(404).json({message: "Utilisateur introuvable !"});
                }
                if(id != userId){
                    return res.status(403).json({message: "Requête non autorisée !"});
                }
                mysql.query(`UPDATE user SET username = ?, bio = ? WHERE id = ${userId}`, [newUsername, newBio], (err, result, fields) => {
                    if(err){
                        return res.status(403).json({message: "Ce nom d'utilisateur est déjà utilisé !"});
                    }
                    return res.status(201).json({message: "Profil mis à jour !"});
                });
      
            });
        }
    }
 };
 
/* DELETE ONE USER */
exports.deleteOneUser = (req, res, next) => {
    const id = req.params.id;
    const userId = req.auth.userId;
    const role = req.auth.role;
    const password = req.body.password;
    let hash;
    mysql.query(`SELECT * FROM user WHERE id = ${id}`, (err, result, fields) => {
        if(err){
            return res.status(500).json({err});
        }
        if(result.length === 0){
            return res.status(404).json({message: "Utilisateur introuvable !"});
        }
        const filename = result[0].imageUrl.split('/images/')[1];

        if(role === "admin"){
            if (filename != "avatar.jpg"){
                fs.unlink(`images/${filename}`, () => {
                    mysql.query(`DELETE FROM user WHERE id = ${id}`, (err, result, fields) => {
                        return res.status(200).json({message: "Utilisateur supprimé !"});
                    });
                });
            } else {
                mysql.query(`DELETE FROM user WHERE id = ${id}`, (err, result, fields) => {
                    return res.status(200).json({message: "Utilisateur supprimé !"});
                });
            }
        } else if (role !== "admin" && id == userId) {
            if (filename != "avatar.jpg"){
                fs.unlink(`images/${filename}`, () => {
                    mysql.query(`DELETE FROM user WHERE id = ${id}`, (err, result, fields) => {
                        return res.status(200).json({message: "Utilisateur supprimé !"});
                    });
                });
                } else {
                    mysql.query(`DELETE FROM user WHERE id = ${id}`, (err, result, fields) => {
                        return res.status(200).json({message: "Utilisateur supprimé !"});
                    });
                }
        } else if (role !== "admin" && id !== userId){
            return res.status(403).json({message: "Requête non autorisée !"});
        }
    });
};

/* CHANGE ROLE */
exports.changeRole = (req, res, next) => {
    const id = req.params.id;
    const role = req.auth.role;
    mysql.query(`SELECT role.role FROM user JOIN role on user.role_id = role.id WHERE user.id = ${id}`, (err, result, fields) => {
        if(err){
            return res.status(500).json({err});
        }
        if(result.length === 0){
            return res.status(404).json({message: "Utilisateur introuvable !"});
        }
        if (role === "admin" & result[0].role === "utilisateur"){
            mysql.query(`UPDATE user SET role_id = 2 WHERE id = ${id}`, (err, result, fields) => {
                if(err){
                    return res.status(500).json({err});
                }
                return res.status(201).json({message: "Role de modérateur attribué à l'utilisateur !"});
            });
        } else if (role === "admin" & result[0].role === "modérateur"){
            mysql.query(`UPDATE user SET role_id = 3 WHERE id = ${id}`, (err, result, fields) => {
                if(err){
                    return res.status(500).json({err});
                }
                return res.status(201).json({message: "Role de modérateur retiré à l'utilisateur !"});
            });
        }
        else {
            return res.status(403).json({message: "Requête non autorisée !"});
        }
    });
};

/* CHANGE PASSWORD */
exports.changePassword = (req, res, nex) => {
    const id = req.params.id;
    const role = req.auth.role;
    const userId = req.auth.userId;
    const password = req.body.password;
    const passwordConfirm = req.body.passwordConfirm;
    if(role === "admin" || id == userId){
        mysql.query(`SELECT * FROM user WHERE id = ${id}`, (err, result, fields) => {
            if(err){
                return res.status(500).json({err});
            }
            if(result.length === 0){
                return res.status(404).json({message: "Utilisateur introuvable !"});
            }
            if(password != passwordConfirm){
                return res.status(403).json({message: "Les mots ne passent ne sont pas identiques !"});
            }
            if(!schema.validate(password)){
                return res.status(401).json({message: "Le mot de passe est NON valide. Utilisez des majuscules, minuscules, chiffres et symboles, aucun espace, pour 8(min) à 16(max) caractères"});
            } else {
                bcrypt.hash(password, 10)
                .then(hash => {
                    mysql.query(`UPDATE user set password = '${hash}' WHERE id = ${id}`, (err, result, fields) => {
                        if(err){
                            return res.status(500).json({err});
                        }
                        return res.status(201).json({message: "Mot de passe mis à jour !"});
                    });
                });
            }
        });
    } else {
        return res.status(403).json({message: "Requête non autorisée !"});
    }
};

