# Koristimo službenu i laganu Node.js LTS sliku kao bazu
FROM node:18-alpine

# Postavljamo radni direktorij unutar kontejnera
WORKDIR /usr/src/app

# Kopiramo package.json i package-lock.json radi instalacije ovisnosti
COPY package*.json ./

# Instaliramo samo produkcijske ovisnosti radi manje veličine kontejnera
RUN npm install --only=production

# Kopiramo ostatak koda aplikacije
COPY . .

# Cloud Run dinamički dodjeljuje PORT okruženje, Express ga mora slušati (default je 8080)
EXPOSE 8080

# Pokretanje aplikacije (naš index.js)
CMD [ "npm", "start" ]
