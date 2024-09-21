# Utiliser une image Node.js officielle comme image de base
FROM node:18

# Définir le répertoire de travail dans le conteneur
WORKDIR /app

# Copier uniquement package.json et package-lock.json pour installer les dépendances dans le conteneur
COPY package*.json ./

# Installer les dépendances dans l'environnement Linux du conteneur
RUN npm install

# Copier le reste du code source dans le conteneur après installation des dépendances
COPY . .

# Exposer le port 5000 pour accéder à l'application
EXPOSE 5000

# Démarrer l'application avec la commande npm start
CMD ["npm", "start"]


# Pour tester :
# http://192.168.1.21:5000/