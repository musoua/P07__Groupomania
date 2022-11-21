DROP DATABASE IF EXISTS groupomania; 

CREATE DATABASE IF NOT EXISTS `groupomania` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `groupomania` ;

CREATE TABLE IF NOT EXISTS `groupomania`.`role` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `role` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

INSERT INTO `role` (`role`)
VALUES
('admin'),
('modérateur'),
('utilisateur');

CREATE TABLE IF NOT EXISTS `groupomania`.`user` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `imageUrl` VARCHAR(255) DEFAULT NULL,
  `bio` LONGTEXT NULL DEFAULT NULL,
  `role_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `username_UNIQUE` (`username` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `fk_user_role1_idx` (`role_id` ASC) VISIBLE,
  CONSTRAINT `fk_user_role1`
    FOREIGN KEY (`role_id`)
    REFERENCES `groupomania`.`role` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;

CREATE TABLE IF NOT EXISTS `groupomania`.`post` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(77) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `imageUrl` VARCHAR(255) NULL,
  `likes` INT DEFAULT NULL,
  `date` DATETIME NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_post_user1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_post_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `groupomania`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `groupomania`.`comment` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `content` LONGTEXT NOT NULL,
  `likes` INT DEFAULT NULL,
  `date` DATETIME NOT NULL,
  `post_id` INT NOT NULL,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_comment_post1_idx` (`post_id` ASC) VISIBLE,
  INDEX `fk_comment_user1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_comment_post1`
    FOREIGN KEY (`post_id`)
    REFERENCES `groupomania`.`post` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_comment_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `groupomania`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS `groupomania`.`like` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `post_id` INT,
  `comment_id` INT,
  `user_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_like_post1_idx` (`post_id` ASC) VISIBLE,
  INDEX `fk_like_comment1_idx` (`comment_id` ASC) VISIBLE,
  INDEX `fk_like_user1_idx` (`user_id` ASC) VISIBLE,
  CONSTRAINT `fk_like_post1`
    FOREIGN KEY (`post_id`)
    REFERENCES `groupomania`.`post` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_like_comment1`
    FOREIGN KEY (`comment_id`)
    REFERENCES `groupomania`.`comment` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_like_user1`
    FOREIGN KEY (`user_id`)
    REFERENCES `groupomania`.`user` (`id`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;