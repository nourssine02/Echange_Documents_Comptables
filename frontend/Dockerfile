# Étape 1: Utiliser l'image Node.js officielle pour construire l'application
FROM node:16 AS build

# Créer un répertoire de travail dans l'image
WORKDIR /app

# Copier le fichier package.json et package-lock.json (ou yarn.lock) dans le répertoire de travail
COPY package*.json ./

# Nettoyer le cache npm et installer les dépendances avec options
RUN npm install

# Copier le reste des fichiers de l'application dans le répertoire de travail
COPY . .

# Construire l'application pour la production
RUN npm run build

# Utiliser Nginx pour servir les fichiers statiques
FROM nginx:alpine

# Copier les fichiers de build dans le répertoire Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80 pour le serveur Nginx
EXPOSE 80

# Démarrer Nginx
CMD ["nginx", "-g", "daemon off;"]