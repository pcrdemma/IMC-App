export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ succes: false, erreur: 'Méthode non autorisée' });
  }

  try {
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

    return res.status(200).json({
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

  } catch (error) {
    console.error('Erreur:', error);
    return res.status(500).json({
      succes: false,
      erreur: 'Erreur serveur: ' + error.message
    });
  }
}