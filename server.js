// server.js
const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));  // ← Chemin correct

// Pool MySQL avec gestion d'erreur
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'db',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'imc_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test de connexion DB au démarrage
pool.getConnection()
    .then(conn => {
        console.log('✅ MySQL connecté avec succès');
        conn.release();
    })
    .catch(err => {
        console.error('❌ Erreur MySQL:', err.message);
    });

// ============ ROUTES API ============

// Route de test
app.get('/api/test', (req, res) => {
    res.json({ 
        succes: true, 
        message: 'API fonctionne ✅'
    });
});

// POST - Calculer l'IMC
app.post('/api/calculer-imc', async (req, res) => {
    try {
        const { poids, taille } = req.body;
        console.log('📥 Reçu:', { poids, taille });

        if (!poids || !taille || poids <= 0 || taille <= 0) {
            return res.status(400).json({ 
                succes: false,
                erreur: 'Poids et taille doivent être positifs' 
            });
        }

        const taille_m = taille / 100;
        const imc = parseFloat((poids / (taille_m * taille_m)).toFixed(1));

        let categorie, couleur;
        if (imc < 18.5) {
            categorie = "Maigreur";
            couleur = "blue";
        } else if (imc < 25) {
            categorie = "Normal";
            couleur = "green";
        } else if (imc < 30) {
            categorie = "Surpoids";
            couleur = "yellow";
        } else if (imc < 40) {
            categorie = "Obésité modérée";
            couleur = "orange";
        } else {
            categorie = "Obésité sévère";
            couleur = "red";
        }

        const connection = await pool.getConnection();
        await connection.execute(
            'INSERT INTO calculs_imc (poids, taille, imc, categorie, couleur) VALUES (?, ?, ?, ?, ?)',
            [poids, taille, imc, categorie, couleur]
        );
        connection.release();

        console.log('✅ Calcul sauvegardé:', { imc, categorie });
        res.json({
            succes: true,
            imc,
            categorie,
            couleur
        });

    } catch (error) {
        console.error('❌ Erreur calcul:', error);
        res.status(500).json({ succes: false, erreur: 'Erreur serveur: ' + error.message });
    }
});

// GET - Récupérer l'historique
app.get('/api/historique', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.execute(
            'SELECT * FROM calculs_imc ORDER BY date_calcul DESC LIMIT 20'
        );
        connection.release();

        console.log('📊 Historique:', rows.length, 'calculs');
        res.json({
            succes: true,
            donnees: rows
        });

    } catch (error) {
        console.error('❌ Erreur historique:', error);
        res.status(500).json({ succes: false, erreur: 'Erreur serveur' });
    }
});

// DELETE - Supprimer un calcul
app.delete('/api/historique/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const connection = await pool.getConnection();
        await connection.execute('DELETE FROM calculs_imc WHERE id = ?', [id]);
        connection.release();

        console.log('🗑️ Calcul supprimé:', id);
        res.json({ succes: true, message: 'Calcul supprimé' });

    } catch (error) {
        console.error('❌ Erreur suppression:', error);
        res.status(500).json({ succes: false, erreur: 'Erreur serveur' });
    }
});

// Route fallback - Servir l'index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Démarrage du serveur
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur lancé sur http://localhost:${PORT}`);
    console.log(`📊 API disponible sur http://localhost:${PORT}/api`);
});