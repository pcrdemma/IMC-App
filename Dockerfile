# Image de base Node.js
FROM node:18-alpine

# Répertoire de travail
WORKDIR /app

# Copier les fichiers
COPY package*.json ./
COPY server.js ./
COPY public ./public

# Installer les dépendances
RUN npm install --production

# Exposer le port
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]