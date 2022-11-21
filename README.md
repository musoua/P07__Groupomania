FORMATION DEVELOPPEUR WEB - OPEN CLASSROOMS - PROJET 7

Création d'un réseau social d'entreprise -GROUPOMANIA


*CONTEXTE


Le projet consiste à construire un réseau social interne pour les employés de Groupomania. Le
but de cet outil est de faciliter les interactions entre collègues

*PERIMETRE DU PROJET

    la présentation des fonctionnalités doit être simple
    la création d'un compte doit être simple et possible depuis un téléphone mobile
    le profil doit contenir très peu d'informations pour que sa complétion soit rapide
    la suppression du compte doit être possible
    l'accès à un forum où les salariés publient des contenus multimédias doit être présent
    l'accès à un forum où les salariés publient des textes doit être présent
    les utilisateurs doivent pouvoir facilement repérer les dernières participations des employés
    le ou la chargé-e de communication Groupomania doit pouvoir modérer les interactions entre salariés

*Fonctionnalités

De manière à fournir dans un délais raisonnable, une première version de l'application (MVP), il a été décidé de se concentrer dans un premier temps sur la fonctionnalité permettant à un utilisateur de publier du contenu multimédia, accompagné de texte. Une fonctionnalité connexe permet par ailleurs aux autres utilisateurs de commenter et liker les publications.


*Technologies utilisées :

MySQL -NodeJs - VueJs -  Sass

*Clonage du projet

Avec le terminal, depuis le dossier dans lequel vous souhaitez enregistrer le projet, clonez le projet avec la commande :

git clone https://github.com/musoua/P07__Groupomania.git

Le dossier ainsi créé sur votre machine doit contenir les éléments suivants :

    un dossier backend contenant le code de l'API
    un dossier frontend contenant le code de l'application frontend
    un fichier database.sql avec lequel vous allez créer la base de données sur votre machine
    le fichier README.md pour la déscription du rojet

*Création de la base de données MySQL

Il est nécessaire d'avoir MySQL d'installé sur votre machine.

Exécutez MySQL avec votre Termial :

mysql -u root -p

Dans le fichier groupomania/backend/.env ,mettre le mot de passe d'accès à votre base de donnée et votre nom d'utilisateur si besoin (root par défaut)

dbUser = "root"

dbPassword = " "


*BACKEND

cd backend

npm install 

    "bcrypt",
    "cors",
    "dotenv",
    "email-validator",
    "express",
    "helmet",
    "jsonwebtoken",
    "multer",
    "mysql",
    "mysql2",
    "nodemon",
    "password-validator",
    "path",
		
créer un dossier images/

nodemon server 


*FRONTEND

cd frontend

npm install

    "axios",
    "core-js",
    "vue",
    "vue-router",
    "vuex",
    "vuex-persistedstate",

npm run serve
