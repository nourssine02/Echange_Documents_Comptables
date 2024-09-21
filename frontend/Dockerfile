# Étape 1: Utiliser l'image Node.js officielle pour construire l'application
FROM node:16 AS build

# Créer un répertoire de travail dans l'image
WORKDIR /app

# Copier le fichier package.json et package-lock.json (ou yarn.lock) dans le répertoire de travail
COPY package*.json ./

# Nettoyer le cache npm et installer les dépendances avec options
RUN npm cache clean --force && npm install --legacy-peer-deps

# Copier le reste des fichiers de l'application dans le répertoire de travail
COPY . .

# Construire l'application pour la production
RUN npm run build

# Étape 2: Utiliser une image Nginx pour servir les fichiers construits
FROM nginx:alpine

# Copier les fichiers construits dans le répertoire de Nginx
COPY --from=build /app/build /usr/share/nginx/html

# Exposer le port 80 pour que Nginx puisse servir l'application
EXPOSE 80

# Démarrer Nginx en mode avant
CMD ["nginx", "-g", "daemon off;"]

# Pour tester :
# http://192.168.1.21:8080/