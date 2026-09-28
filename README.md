# 📊 IMC Calculator

Calculateur d'Indice de Masse Corporelle simple et rapide.

## 🚀 Accès en ligne

👉 **[imc-app-psi-five.vercel.app](https://imc-app-psi-five.vercel.app/)**

## ⚙️ Installation locale

```bash
# Cloner le projet
git clone <https://github.com/pcrdemma/IMC-App.git>
cd IMC-App

# Installer les dépendances
npm install

# Lancer le serveur
npm start

# Ouvrir 
http://localhost:3000
```

## 📝 Utilisation

1. Entrer votre **poids (kg)** et **taille (cm)**
2. Cliquer sur "Calculer l'IMC"
3. Consulter votre résultat et l'historique

## 🛠️ Stack technique

- **Frontend :** HTML5, CSS3, JavaScript
- **Backend :** Node.js + Express.js
- **Base de données :** SQL
- **Conteneurisation :** Docker & Docker Compose
- **Déploiement :** Vercel

## 📊 Formule

```
IMC = Poids (kg) / [Taille (m)]²
```

## ✅ Fonctionnalités

- ✅ Calcul instantané de l'IMC
- ✅ Classification automatique
- ✅ Historique sauvegardé en base de données
- ✅ Design responsive
- ✅ Validation des données
- ✅ API REST

## 📂 Structure du projet

```
IMC-App/
├── 📁 public/
│   ├── index.html          # Page principale
│   ├── script.js           # Logique frontend
│   └── style.css           # Styles
├── index.js                # Serveur Express
├── init.sql                # Initialisation base de données
├── .env                    # Variables d'environnement
├── .gitignore             # Fichiers ignorés
├── docker-compose.yml     # Configuration Docker Compose
├── Dockerfile             # Image Docker
├── package.json           # Dépendances Node.js
├── vercel.json            # Configuration Vercel
└── README.md              # Ce fichier
```

## 🐳 Docker

### Lancer avec Docker Compose

```bash
# Démarrer les services
docker-compose up

# Arrêter les services
docker-compose down
```

### Fichiers Docker

- **Dockerfile** : Image personnalisée de l'application
- **docker-compose.yml** : Orchestration des services (app + DB)

### Configuration .env

```
PORT=3000
DB_HOST=db
DB_USER=root
DB_PASSWORD=password
DB_NAME=imc_db
NODE_ENV=production
```

## 🎨 Classifications IMC

| Catégorie | IMC | Couleur |
|-----------|-----|--------|
| Maigreur | < 18.5 | 🔵 Bleu |
| Normal | 18.5 - 24.9 | 🟢 Vert |
| Surpoids | 25 - 29.9 | 🟡 Jaune |
| Obésité modérée | 30 - 39.9 | 🟠 Orange |
| Obésité sévère | ≥ 40 | 🔴 Rouge |

## 🔌 API REST

### Endpoint POST

```
POST /api/calculer-imc
Content-Type: application/json

Body:
{
  "poids": 70,
  "taille": 175
}

Response:
{
  "imc": 22.86,
  "classification": "Normal",
  "date": "2026-09-28"
}
```

## 💾 Base de données

La table `imc_historique` stocke :
- `id` : Identifiant unique
- `poids` : Poids en kg
- `taille` : Taille en cm
- `imc` : Valeur calculée
- `classification` : Catégorie IMC
- `date_calcul` : Timestamp du calcul

## 📄 Documentation complète

📖 Voir le document PDF de documentation pour plus de détails sur :
- Architecture détaillée de l'application
- Guide complet de l'utilisateur
- Tests et résultats
- Exécution du code

## 🧪 Tests

```bash
npm test
```

## 👥 Développeurs

- Léna FURIC
- Kaouthar ELATTARI
- Emma PICARD
---

**Version :** 1.0.0 | **Septembre 2026**
