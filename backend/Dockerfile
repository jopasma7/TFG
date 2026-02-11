FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Crear carpeta de uploads
RUN mkdir -p uploads/listings

# Puerto que usa el servidor
EXPOSE 3000

# Comando de inicio
CMD ["node", "src/server.js"]
