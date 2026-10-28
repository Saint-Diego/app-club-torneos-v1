# Levantar con Docker

Requisitos: Docker Desktop con Docker Compose habilitado.

Desde la raíz del proyecto, ejecuta:

```bash
docker compose up --build
```

La aplicación queda disponible en `http://localhost:8080`. Caddy sirve el frontend y
redirige las solicitudes `/api` al backend; MongoDB y la API no publican puertos
directamente al host.

Para acceder desde otros dispositivos de la misma red, abre
`http://<IP-LAN-del-equipo>:8080` en el navegador. Si no carga, permite el
puerto TCP 8080 en el firewall del equipo. En Windows puedes obtener la IP con
`ipconfig`.

Para publicar el sitio en Internet con HTTPS, apunta un dominio público a la IP
del servidor, configura el router/firewall para reenviar los puertos TCP 443
(y UDP 443) al equipo Docker y arranca Compose con el dominio:

```powershell
$env:SITE_ADDRESS = "torneos.ejemplo.com"
$env:JWT_SECRET = "reemplaza-por-un-secreto-aleatorio"
docker compose up --build -d
```

Caddy solicitará y renovará automáticamente el certificado HTTPS cuando el
dominio resuelva a este servidor y los puertos sean accesibles. Sin dominio,
usa la dirección LAN por HTTP.

Para detener los contenedores, usa `docker compose down`. Para borrar también
los datos de MongoDB, usa `docker compose down -v`.

La clave JWT predeterminada es solo para desarrollo. Antes de publicar el stack,
define `JWT_SECRET` con un valor aleatorio y privado.

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
