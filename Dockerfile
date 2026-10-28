# --- Etapa 1: Construcción (Build) ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Etapa 2: Servidor web con Nginx ---
FROM nginx:alpine
# Copia los archivos compilados de React al directorio de Nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# (Si usas Create React App en lugar de Vite, cambia /app/dist por /app/build)

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
