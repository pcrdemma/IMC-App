-- Créer la base de données
CREATE DATABASE IF NOT EXISTS imc_db;
USE imc_db;

-- Créer la table des calculs IMC
CREATE TABLE IF NOT EXISTS calculs_imc (
    id INT PRIMARY KEY AUTO_INCREMENT,
    poids DECIMAL(5,2) NOT NULL,
    taille DECIMAL(5,2) NOT NULL,
    imc DECIMAL(5,2) NOT NULL,
    categorie VARCHAR(50) NOT NULL,
    couleur VARCHAR(20),
    date_calcul TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Créer un index sur la date pour plus de rapidité
CREATE INDEX idx_date ON calculs_imc(date_calcul DESC);