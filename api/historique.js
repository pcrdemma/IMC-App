export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Récupère depuis localStorage (on fait juste un dummy)
  if (req.method === 'GET') {
    return res.status(200).json({
      succes: true,
      message: 'Récupère l\'historique depuis le localStorage'
    });
  }

  if (req.method === 'DELETE') {
    return res.status(200).json({
      succes: true,
      message: 'Suppression depuis le localStorage'
    });
  }

  return res.status(405).json({ succes: false, erreur: 'Méthode non autorisée' });
}