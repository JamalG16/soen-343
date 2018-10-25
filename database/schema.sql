-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema library_db
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema library_db
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `library_db` DEFAULT CHARACTER SET utf8 ;
USE `library_db` ;

-- -----------------------------------------------------
-- Table `library_db`.`USER`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `library_db`.`USER` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `EMAIL` VARCHAR(45) NULL,
  `FIRST_NAME` VARCHAR(45) NULL,
  `LAST_NAME` VARCHAR(100) NULL,
  `ADDRESS` VARCHAR(45) NULL,
  `PHONE_NUMBER` CHAR(10) NULL,
  `HASH` CHAR(160) NULL,
  `ADMIN` TINYINT NULL DEFAULT 0,
  `LOGGED_IN` TINYINT NULL DEFAULT 0,
  PRIMARY KEY (`ID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `library_db`.`CATALOG_ITEM`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `library_db`.`CATALOG_ITEM` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `TITLE` VARCHAR(45) NULL,
  `DATE` DATETIME NULL,
  PRIMARY KEY (`ID`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `library_db`.`BOOK`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `library_db`.`BOOK` (
  `ISBN_10` CHAR(10) NULL,
  `ISBN_13` CHAR(13) NULL,
  `AUTHOR` VARCHAR(45) NULL,
  `PUBLISHER` VARCHAR(45) NULL,
  `FORMAT` VARCHAR(45) NULL,
  `PAGES` INT NULL,
  `CATALOG_ITEM_ID` INT NOT NULL,
  PRIMARY KEY (`CATALOG_ITEM_ID`),
  CONSTRAINT `fk_BOOK_CATALOG_ITEM1`
    FOREIGN KEY (`CATALOG_ITEM_ID`)
    REFERENCES `library_db`.`CATALOG_ITEM` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `library_db`.`MAGAZINE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `library_db`.`MAGAZINE` (
  `ISBN_10` CHAR(10) NULL,
  `ISBN_13` CHAR(13) NULL,
  `PUBLISHER` VARCHAR(45) NULL,
  `LANGUAGE` VARCHAR(45) NULL,
  `CATALOG_ITEM_ID` INT NOT NULL,
  PRIMARY KEY (`CATALOG_ITEM_ID`),
  CONSTRAINT `fk_MAGAZINE_CATALOG_ITEM1`
    FOREIGN KEY (`CATALOG_ITEM_ID`)
    REFERENCES `library_db`.`CATALOG_ITEM` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `library_db`.`MUSIC`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `library_db`.`MUSIC` (
  `TYPE` VARCHAR(45) NULL,
  `ARTIST` VARCHAR(45) NULL,
  `LABEL` VARCHAR(45) NULL,
  `ASIN` VARCHAR(45) NULL,
  `CATALOG_ITEM_ID` INT NOT NULL,
  PRIMARY KEY (`CATALOG_ITEM_ID`),
  CONSTRAINT `fk_MUSIC_CATALOG_ITEM1`
    FOREIGN KEY (`CATALOG_ITEM_ID`)
    REFERENCES `library_db`.`CATALOG_ITEM` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `library_db`.`MOVIE`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `library_db`.`MOVIE` (
  `DIRECTOR` VARCHAR(45) NULL,
  `PRODUCERS` VARCHAR(256) NULL,
  `ACTORS` VARCHAR(256) NULL,
  `LANGUAGE` VARCHAR(45) NULL,
  `SUBTITLES` VARCHAR(45) NULL,
  `DUBBED` VARCHAR(45) NULL,
  `RUNTIME` INT NULL,
  `CATALOG_ITEM_ID` INT NOT NULL,
  PRIMARY KEY (`CATALOG_ITEM_ID`),
  INDEX `fk_MOVIE_CATALOG_ITEM_idx` (`CATALOG_ITEM_ID` ASC),
  CONSTRAINT `fk_MOVIE_CATALOG_ITEM`
    FOREIGN KEY (`CATALOG_ITEM_ID`)
    REFERENCES `library_db`.`CATALOG_ITEM` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `library_db`.`INVENTORY_ITEM`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `library_db`.`INVENTORY_ITEM` (
  `ID` INT NOT NULL AUTO_INCREMENT,
  `AVAILABLE` TINYINT NULL DEFAULT 1,
  `CATALOG_ITEM_ID` INT NOT NULL,
  PRIMARY KEY (`ID`),
  INDEX `fk_INVENTORY_CATALOG_ITEM1_idx` (`CATALOG_ITEM_ID` ASC),
  CONSTRAINT `fk_INVENTORY_CATALOG_ITEM1`
    FOREIGN KEY (`CATALOG_ITEM_ID`)
    REFERENCES `library_db`.`CATALOG_ITEM` (`ID`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
