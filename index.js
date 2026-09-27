const express = require('express');
const path = require('path');

const app = express();

// Serve static files from public folder
app.use(express.static(path.join(__dirname, 'public')));

// CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// API routes
app.post('/api/calculer-imc', (req, res) => {
  const { poids, taille } = req.body;

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

  res.status(200).json({
    succes: true,
    donnees: {
      poids,
      taille,
      imc,
      categorie,
      couleur,
      date: new Date().toLocaleString('fr-FR')
    }
  });
});

app.get('/api/historique', (req, res) => {
  res.status(200).json({
    succes: true,
    message: 'Historique géré par localStorage'
  });
});

// Catch all - serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});