/* CONTROLLER DE POST */

/* importation de la configuration DataBase  */
const mysql = require('../dbConnection').connection;

/*importation  de "file system" de nodejs */
const fs = require('fs');
const { isBuffer } = require('util');

/* POSTS*/

/* CREATE POST */
exports.createPost = (req, res, next) => {
    const userId = req.auth.userId;
    if(req.file){
        const post = JSON.parse(req.body.post);
        const title = post.title;
        const content = post.content;
        const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
        if(post.title === '' || post.content === ''){
            return res.status(403).json({message: "Veuillez renseigner un titre et un message !"});
        } else {
            mysql.query(`INSERT INTO post (title, content, imageUrl, date, user_Id) VALUES (?, ?, ?, NOW(), ?)`, [title, content, imageUrl, userId], (err, result, fields) => {
                if(err){
                    return res.status(500).json({err});
                }
                return res.status(201).json({message: "Post publié !"});
            });
        }
    } else {
        const title = req.body.title;
        const content = req.body.content;
        if(title === '' || content === ''){
            return res.status(403).json({message: "Veuillez renseigner un titre et un message !"});
        } else {
            mysql.query(`INSERT INTO post (title, content, date, user_Id) VALUES (?, ?, NOW(), ?)`, [title, content, userId], (err, result, fields) => {
                if(err){
                    return res.status(500).json({err});
                }
                return res.status(201).json({message: "Post publié !"});
            });
        }
    }
};

/* GET ONE POST */
exports.getOnePost = (req, res, next) => {
    const postId = req.params.id;
    mysql.query(`SELECT post.id, user.username, post.title, post.content, post.imageUrl, DATE_FORMAT(date, '%d/%m/%Y %T') as date, post.likes FROM post JOIN user on user.id = post.user_id WHERE post.id = ${postId}`, (err, result, fields) => {
        if(err){
            return res.status(500).json({err});
        }
        if(result.length === 0){
            return res.status(404).json({message: "Aucun posts !"});
        }
        return res.status(200).json(result[0]);
    });
};

/* GET ALL POSTS */
exports.getAllPosts = (req, res, next) => {
    mysql.query(`SELECT post.id, user.username, post.user_Id, post.title, post.content, post.imageUrl, DATE_FORMAT(date, '%d/%m/%Y %T') as date, post.likes FROM post JOIN user ON user.id = post.user_Id ORDER BY date DESC`, (err, result, fields) => {
        if(err){
            res.status(500).json({err});
        }
        if(result.length === 0){
            return res.status(200).json({message: "Aucun posts !"});
        } else if (result.length !== 0){
            return res.status(200).json(result);
        }
    });
};



/* GET ALL POSTS FROM ONE USER */
exports.getAllPostsFromOneUser = (req, res, next) => {
    const id = req.params.id;
    mysql.query(`SELECT post.id, user.username, post.title, post.content, post.imageUrl, DATE_FORMAT(date, '%d/%m/%Y %T') as date, post.likes FROM post JOIN user on user.id = post.user_id WHERE user.id = ${id} ORDER BY date DESC`, (err, result, fields) => {
        if(err){
            res.status(500).json({err});
        }
        if(result.length === 0){
            return res.status(200).json({message: "Aucun posts !"});
        } else if (result.length !== 0){
            return res.status(200).json(result);
        }
    });
};

/* MODIFY ONE POST */
exports.modifyPost = (req, res, next) => {
    const id = req.params.id;
    const userId = req.auth.userId;
    mysql.query(`SELECT * FROM post WHERE id = ${id}`, (err, result, fields) => {
        if(err){
            return res.status(500).json({err});
        }
        if(result.length === 0){
            return res.status(404).json({message: "Post introuvable !"});
        }
        if(result[0].user_id != userId){
            return res.status(403).json({message: "Requête non autorisée !"});
        }
        if(result[0].imageUrl === null){
            if(req.file){
                const post = JSON.parse(req.body.post);
                const newTitle = post.title;
                const newContent = post.content;
                const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
                if(newTitle === '' || newContent === ''){
                    return res.status(403).json({message: "Veuillez renseigner un titre et un message !"});
                } else {
                    mysql.query(`UPDATE post SET title = ?, content = ?, imageUrl = ? WHERE id = ${id}`, [newTitle, newContent, imageUrl], (err, result, fields) => {
                        if(err){
                            return res.status(500).json({err});
                        }
                        return res.status(201).json({message: "Post mis à jour !"});
                    });
                }
            } else {
                const newTitle = req.body.title;
                const newContent = req.body.content;
                if(newTitle === '' || newContent === ''){
                    return res.status(403).json({message: "Veuillez renseigner un titre et un message !"});
                } else {
                    mysql.query(`UPDATE post SET title = ?, content = ? WHERE id = ${id}`, [newTitle, newContent], (err, result, fields) => {
                        if(err){
                            return res.status(500).json({err});
                        }
                        return res.status(201).json({message: "Post mis à jour !"});
                    });
                }
            }
        } else {
            if(req.file){
                const post = JSON.parse(req.body.post);
                const newTitle = post.title;
                const newContent = post.content;
                const imageUrl = `${req.protocol}://${req.get("host")}/images/${req.file.filename}`;
                const filename = result[0].imageUrl.split('/images/')[1];
                if(newTitle === '' || newContent === ''){
                    return res.status(403).json({message: "Veuillez renseigner un titre et un message !"});
                } else {
                    fs.unlink(`images/${filename}`, () => {
                        mysql.query(`UPDATE post SET title = ?, content = ?, imageUrl = ? WHERE id = ${id}`, [newTitle, newContent, imageUrl], (err, result, fields) => {
                            if(err){
                                return res.status(500).json({err});
                            }
                            return res.status(201).json({message: "Post mis à jour !"});
                        });
                    });
                }
            } else {
                const newTitle = req.body.title;
                const newContent = req.body.content;
                if(newTitle === '' || newContent === ''){
                    return res.status(403).json({message: "Veuillez renseigner un titre et un message !"});
                } else {
                    mysql.query(`UPDATE post SET title = ?, content = ? WHERE id = ${id}`, [newTitle, newContent], (err, result, fields) => {
                        if(err){
                            return res.status(500).json({err});
                        }
                        return res.status(201).json({message: "Post mis à jour !"});
                    });
                }
            }
        }
    });
};

/* DELETE ONE POST */
exports.deleteOnePost = (req, res, next) => {
    const id = req.params.id;
    const userId = req.auth.userId;
    const role = req.auth.role;
    mysql.query(`SELECT * FROM post WHERE id = ${id}`, (err, result, fields) => {
        if(err){
            return res.status(500).json({err});
        }
        if(result.length === 0){
            return res.status(404).json({message: "Post introuvable !"});
        }
        if(result[0].user_id != userId && role == "utilisateur"){
            return res.status(403).json({message: "Requête non autorisée !"});
        }
        if(result[0].imageUrl != null){
            const filename = result[0].imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                mysql.query(`DELETE FROM post WHERE id = ${id}`, (err, result, fields) => {
                    if(err){
                        return res.status(500).json({err});
                    }
                    return res.status(200).json({message: "Post supprimé !"});
                });
            });
        } else {
            mysql.query(`DELETE FROM post WHERE id = ${id}`, (err, result, fields) => {
                if(err){
                    return res.status(500).json({err});
                }
                return res.status(200).json({message: "Post supprimé !"});
            });
        }
    });
};



/* COMMENTS */

/* CREATE COMMENT */
exports.createComment = (req, res, next) => {
    const userId = req.auth.userId;
    const postId = req.params.id;
    const content = req.body.content;
    if(content === ''){
        return res.status(403).json({message: "Veuillez renseigner un commentaire !"});
    } else {
        mysql.query(`INSERT INTO comment (content, date, post_id, user_id) VALUES (?, NOW(), ?, ?)`, [content, postId, userId] , (err, result, fields) => {
            if(err){
                return res.status(500).json({err});
            }
            return res.status(201).json({message: "Commentaire publié !"});
        });
    }
};

/* GET ONE COMMENT FROM ONE POST */ 
exports.getOneCommentFromOnePost = (req, res, next) => {
    const postId = req.params.id;
    const commentId = req.params.commentid;
    mysql.query(`SELECT comment.id, comment.post_id, user.username, comment.content, comment.likes FROM comment JOIN post on post.id = comment.post_id JOIN user on user.id = comment.user_id WHERE comment.post_id = ${postId} AND comment.id = ${commentId}`, (err, result, fields) => {
        if(err){
            return res.status(500).json({err});
        }
        if(result.length === 0){
            return res.status(404).json({message: "Commentaire introuvable !"});
        }
        return res.status(200).json(result[0]);
    });
};

/* GET ALL COMMENTS FROM ONE POST */
exports.getAllCommentsFromOnePost = (req, res, next) => {
    const postId = req.params.id;
    mysql.query(`SELECT comment.id, user.username, comment.user_id, comment.content, comment.post_id, DATE_FORMAT(date, '%d/%m/%Y %T') as date, comment.likes FROM comment JOIN user on user.id = comment.user_id WHERE comment.post_Id = ${postId} ORDER BY date ASC`, (err, result, fields) => {
        if(err){
            return res.status(500).json({err});
        }
        return res.status(200).json(result);
    });
};

/* MODIFY ONE COMMENT */
exports.modifyOneComment = (req, res, next) => {
    const postId = req.params.id;
    const commentId = req.params.commentid;
    const userId = req.auth.userId;
    const newContent = req.body.content;
    mysql.query(`SELECT * FROM comment WHERE id = ${commentId} AND post_id = ${postId}`, (err, result, fields) => {
        if(err){
            return res.status(500).json({err});
        }
        if(result.length === 0){
            return res.status(404).json({message: "Commentaire introuvable !"});
        }
        if(result[0].user_id != userId){
            return res.status(403).json({message: "Requête non autorisée !"});
        }
        mysql.query(`UPDATE comment SET content = '${newContent}' WHERE id = ${commentId}`, (err, result, fields) => {
            if(err){
                return res.status(500).json({err});
            }
            return res.status(201).json({message: "Commentaire modifié !"});
        });
    });
};

/* DELETE ONE COMMENT */
exports.deleteOneComment = (req, res, next) => {
    const postId = req.params.id;
    const commentId = req.params.commentid;
    const userId = req.auth.userId;
    const role = req.auth.role;
    mysql.query(`SELECT comment.id, comment.user_id, comment.post_id FROM comment JOIN post on post.id = comment.post_id WHERE comment.id = ${commentId} AND post.id = ${postId}`, (err, result, fields) => {
        if(err){
            return res.status(500).json({err});
        }
        if(result.length === 0){
            return res.status(404).json({message: "Commentaire introuvable !"});
        }
        if(role === "utilisateur" && result[0].user_id != userId){
            return res.status(403).json({message: "Requête non autorisée !"});
        } else {
            mysql.query(`DELETE FROM comment WHERE id = ${commentId}`, (err, result, fields) => {
                if(err){
                    return res.status(500).json({err});
                }
                return res.status(201).json({message: "Commentaire supprimé !"});
            });
        }
    });
};



/* LIKES  */

/* LIKE POST */
exports.likePost = (req, res, next) => {
    const userId = req.auth.userId;
    const postId = req.params.id;
    mysql.query(`SELECT * FROM post where id = ${postId}`, (err, result, fields) => {
        if(err){
            return res.status(500).json({err});
        }
        if(result.length === 0){
            return res.status(404).json({message: "Post introuvable !"});
        }
        mysql.query(`SELECT * FROM groupomania.like WHERE post_id = ${postId} and user_id = ${userId}`, (err, result, fields) => {
            if(err){
                return res.status(500).json({err});
            }
            if(result.length === 0){
                mysql.query(`INSERT INTO groupomania.like (post_id, user_id) VALUES (?,?)`, [postId, userId], (err, result, fields) => {
                    if(err){
                        return res.status(500).json({err});
                    }
                    mysql.query(`SELECT COUNT(*) as likes FROM groupomania.like WHERE post_id = ${postId}`, (err, result, fields) => {
                        if(err){
                            return res.status(500).json({err});
                        }
                        const numberOfLikes = result[0].likes;
                        mysql.query(`UPDATE post SET likes = ${numberOfLikes} WHERE id = ${postId}`, (err, result, fields) => {
                            if(err){
                                return res.status(500).json({err});
                            }
                            return res.status(201).json({message: "Post liké !", count: 1});
                        });
                    });
                });
            } else {
                mysql.query(`DELETE FROM groupomania.like WHERE post_id = ${postId} AND user_id = ${userId}`, (err, result, fields) => {
                    if(err){
                        return res.status(500).json({err});
                    }
                    mysql.query(`SELECT COUNT(*) as likes FROM groupomania.like WHERE post_id = ${postId}`, (err, result, fields) => {
                        if(err){
                            return res.status(500).json({err});
                        }
                        const numberOfLikes = result[0].likes;
                        mysql.query(`UPDATE post SET likes = ${numberOfLikes} WHERE id = ${postId}`, (err, result, fields) => {
                            if(err){
                                return res.status(500).json({err});
                            }
                            return res.status(201).json({message: "Like du post annulé !", count: -1});
                        });
                    });
                });
            }
        });
    });
};

/* CHECK POST LIKE */
exports.checkPostLike = (req, res, next) => {
    const userId = req.auth.userId;
    const postId = req.params.id;
    mysql.query(`SELECT * FROM groupomania.like WHERE post_id = ${postId} and user_id = ${userId}`, (err, result, fields) => {
        if(err){
            return res.status(500).json({err});
        }
        if(result.length !== 0){
            return res.status(200).json({message: 'YES'});
        } else if (result.length === 0){
            return res.status(200).json({message: 'NO'});
        } else {
            return res.status(404).json({message: "Information indisponible !"});
        }
    });
};

/* LIKE COMMENT */
exports.likeComment = (req, res, next) => {
    const userId = req.auth.userId;
    const commentId = req.params.id;
    mysql.query(`SELECT * FROM comment where id = ${commentId}`, (err, result, fields) => {
        if(err){
            return res.status(500).json({err});
        }
        if(result.length === 0){
            return res.status(404).json({message: "Commentaire introuvable !"});
        }
        mysql.query(`SELECT * FROM groupomania.like WHERE comment_id = ${commentId} and user_id = ${userId}`, (err, result, fields) => {
            if(err){
                return res.status(500).json({err});
            }
            if(result.length === 0){
                mysql.query(`INSERT INTO groupomania.like (comment_id, user_id) VALUES (?,?)`, [commentId, userId], (err, result, fields) => {
                    if(err){
                        return res.status(500).json({err});
                    }
                    mysql.query(`SELECT COUNT(*) as likes FROM groupomania.like WHERE comment_id = ${commentId}`, (err, result, fields) => {
                        if(err){
                            return res.status(500).json({err});
                        }
                        const numberOfLikes = result[0].likes;
                        mysql.query(`UPDATE comment SET likes = ${numberOfLikes} WHERE id = ${commentId}`, (err, result, fields) => {
                            if(err){
                                return res.status(500).json({err});
                            }
                            return res.status(201).json({message: "Commentaire liké !", count: 1});
                        });
                    });
                });
            } else {
                mysql.query(`DELETE FROM groupomania.like WHERE comment_id = ${commentId} AND user_id = ${userId}`, (err, result, fields) => {
                    if(err){
                        return res.status(500).json({err});
                    }
                    mysql.query(`SELECT COUNT(*) as likes FROM groupomania.like WHERE comment_id = ${commentId}`, (err, result, fields) => {
                        if(err){
                            return res.status(500).json({err});
                        }
                        const numberOfLikes = result[0].likes;
                        mysql.query(`UPDATE comment SET likes = ${numberOfLikes} WHERE id = ${commentId}`, (err, result, fields) => {
                            if(err){
                                return res.status(500).json({err});
                            }
                            return res.status(201).json({message: "Like du commentaire annulé !", count: -1});
                        });
                    });
                });
            }
        });
    });
};

/* CHECK COMMENT LIKE */
exports.checkCommentLike = (req, res, next) => {
    const userId = req.auth.userId;
    const postId = req.params.id;
    mysql.query(`SELECT * FROM groupomania.like WHERE comment_id = ${postId} and user_id = ${userId}`, (err, result, fields) => {
        if(err){
            return res.status(500).json({err});
        }
        if(result.length !== 0){
            return res.status(200).json({message: 'YES'});
        } else if (result.length === 0){
            return res.status(200).json({message: 'NO'});
        } else {
            return res.status(404).json({message: "Information indisponible !"});
        }
    });
};