# --- Fase de Construcción ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# --- Fase de Servidor Web (Nginx) ---
FROM nginx:stable-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
# Copiar configuración personalizada para dar soporte al Router de React Router v8 (Single Page Application)
RUN echo 'server { listen 80; location / { root /usr/share/nginx/html; index index.html; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
