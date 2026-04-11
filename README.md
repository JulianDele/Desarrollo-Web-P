# Nombre del Proyecto

## DescripciÃ³n
Este proyecto estÃ¡ en desarrollo.

## ConfiguraciÃ³n Docker
- Imagen base: Node.js 22 (alpine).
- Archivos incluidos:
  - `Dockerfile`
  - `docker-compose.yml`

## Despliegue en Render (Frontend + Backend)
Este repo incluye un `render.yaml` para desplegar:
- Un servicio **web (backend)** (Docker).
- Un servicio **static (frontend)** (Vite + React).

### Variables necesarias (Render)
**Backend**
- `JWT_SECRET`
- `RESET_TOKEN_SECRET`
- `MONGO_URI` (o `DB_URI`)
- `CORS_ORIGIN` (URL del frontend, por ejemplo `https://tu-frontend.onrender.com`)

**Frontend (Static Site)**
- `VITE_API_URL` (URL del backend, por ejemplo `https://tu-backend.onrender.com`)

### URLs
- Abre la URL del **frontend** para ver la aplicaciÃ³n.
- La URL del **backend** sirve la API (por ejemplo `GET /api/health`).

## CI/CD
El repositorio estÃ¡ preparado para integrar un flujo de CI/CD bÃ¡sico.

## CÃ³mo usar
1. Clonar el repositorio:
   ```bash
   git clone <URL>
   ```
