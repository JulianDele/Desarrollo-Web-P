# Seguridad: AutenticaciÃ³n, AutorizaciÃ³n y RecuperaciÃ³n de ContraseÃ±a

## ProtecciÃ³n por rol (Backend)
- Todas las rutas sensibles deben usar `requireAuth` y, cuando aplique, `requireRole`.
- `requireAuth` valida:
  - Firma y expiraciÃ³n del JWT.
  - Tipo de token (`access` vs `refresh`).
  - SesiÃ³n activa y no expirada (en Mongo si estÃ¡ conectado; si no, fallback en memoria para dev/tests).
  - El rol no se toma del payload del token: se obtiene del usuario en el servidor (evita escalaciÃ³n por manipulaciÃ³n local del cliente).
- Respuestas estandarizadas:
  - `401` para no autenticado (`{ error: "No autenticado" }`)
  - `403` para acceso denegado (`{ error: "Sin permisos" }`)

## RecuperaciÃ³n de contraseÃ±a (Backend)
Amenazas consideradas:
- EnumeraciÃ³n de cuentas (respuesta distinta si existe/no existe).
- Replay (reutilizaciÃ³n de token).
- Brute force (fuerza bruta de token / abuso de endpoints).
- Robo de token (filtraciÃ³n en logs, referers, historial, etc.).

Controles implementados:
- `POST /api/forgot-password` responde siempre con mensaje neutral.
- Token criptogrÃ¡fico aleatorio y de un solo uso.
- ExpiraciÃ³n corta configurable con `RESET_TOKEN_TTL_MINUTES` (default 15).
- Se guarda el token hasheado (SHA-256 con `RESET_TOKEN_SECRET`).
- `POST /api/reset-password/validate` valida sin revelar informaciÃ³n sensible.
- `POST /api/reset-password` cambia contraseÃ±a (bcrypt) y revoca sesiones activas.
- Rate limit aplicado en endpoints crÃ­ticos con `rateLimitPassword`.

## Frontend (guards + UX)
- `ProtectedRoute` consulta `GET /api/session` antes de renderizar vistas protegidas.
- Las llamadas a recursos privados deben pasar por `fetchWithAuth`.
- En despliegue con frontend separado (Render Static Site), el frontend usa `VITE_API_URL` para apuntar al backend.

## DevOps / despliegue
Variables crÃ­ticas (producciÃ³n):
- `JWT_SECRET`
- `RESET_TOKEN_SECRET`
- `MONGO_URI` (o `DB_URI`)
- `CORS_ORIGIN` (URL del frontend)

Logs:
- `Back-end/logs/app.log`: requests generales (con status y duraciÃ³n).
- `Back-end/logs/security.log`: eventos `401/403` (para monitoreo de abuso).

Nota:
- Se recomienda agregar `helmet` para headers de seguridad una vez que se actualicen dependencias y `package-lock.json` en el entorno de build.
