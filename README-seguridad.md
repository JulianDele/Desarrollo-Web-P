# Seguridad: autenticación, autorización y recuperación de contraseña

## Protección por rol (Backend)
- Todas las rutas sensibles deben usar `requireAuth` y, cuando aplique, `requireRole`.
- `requireAuth` debe validar:
  - Firma y expiración del JWT.
  - Tipo de token (`access` vs `refresh`) para evitar usar refresh donde no corresponde.
  - Sesión activa y no expirada (si hay persistencia de sesiones).
- Respuestas estandarizadas:
  - `401` para no autenticado (`{ error: "No autenticado" }`)
  - `403` para acceso denegado (`{ error: "Sin permisos" }`)

## Recuperación de contraseña (Backend)
Amenazas consideradas:
- Enumeración de cuentas (respuesta distinta si existe/no existe).
- Replay (reutilización de token).
- Brute force (fuerza bruta de token / abuso de endpoints).
- Robo de token (filtración en logs, referers, historial, etc.).

Controles esperados:
- `POST /api/forgot-password` con respuesta neutral (siempre el mismo mensaje).
- Token criptográfico aleatorio, de un solo uso, con expiración corta (`RESET_TOKEN_TTL_MINUTES`, default 15).
- Guardar el token **hasheado** (nunca en texto plano).
- `POST /api/reset-password/validate` valida token sin filtrar datos sensibles.
- `POST /api/reset-password` cambia contraseña (bcrypt seguro) e invalida token usado/expirado.
- Revocar sesiones activas al cambiar contraseña.
- Rate limit en endpoints críticos.

## Variables de entorno
Copia `.env.example` y crea tu `.env` (local). En producción (Render) configura variables en el panel.

| Variable | Descripción | Ejemplo |
|---|---|---|
| `JWT_SECRET` | Clave secreta para access tokens | cadena larga y aleatoria |
| `REFRESH_SECRET` | Clave para refresh tokens (alias) | cadena larga y aleatoria |
| `JWT_REFRESH_SECRET` | Refresh secret (preferido) | cadena larga y aleatoria |
| `TOKEN_EXPIRATION` | Expiración access token | `15m` |
| `RESET_TOKEN_SECRET` | Clave para hashear tokens de reset | cadena larga y aleatoria |
| `RESET_TOKEN_TTL_MINUTES` | Expiración de reset token | `15` |
| `MONGO_URI` | URI Mongo (principal) | `mongodb://mongo:27017/gymdb` |
| `DB_URI` | Alias de `MONGO_URI` | `mongodb://mongo:27017/gymdb` |
| `CORS_ORIGIN` | Orígenes permitidos (coma-separado) | `http://localhost:5173,https://tu-frontend.onrender.com` |
| `REDIS_URI` | Redis (opcional) | `redis://redis:6379` |
| `MAIL_HOST` | SMTP host (opcional) | `smtp.gmail.com` |
| `MAIL_PORT` | SMTP port (opcional) | `587` |
| `MAIL_USER` | SMTP user (opcional) | `correo@gmail.com` |
| `MAIL_PASS` | SMTP pass (opcional) | `app-password` |
| `MAIL_FROM` | Remitente (opcional) | `correo@gmail.com` |
| `APP_URL` | URL pública del backend (opcional) | `https://tu-backend.onrender.com` |
| `FRONTEND_URL` | URL pública del frontend (opcional) | `https://tu-frontend.onrender.com` |

## Logs y monitoreo
- `Back-end/logs/app.log`: requests generales (status + duración + ip).
- `Back-end/logs/security.log`: eventos `401/403` en JSON (útil para monitoreo de abuso).

## Healthcheck
- Endpoint: `GET /api/health`
- `Dockerfile` incluye `HEALTHCHECK` que consulta ese endpoint.

## Levantar entorno local
```bash
docker-compose up --build
```

Verificar salud:
```bash
curl http://localhost:3000/api/health
```

