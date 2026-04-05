# Documentación de Seguridad y Entorno

## Variables de entorno requeridas

Copia `.env.example` y renómbralo `.env` en la raíz y en `Back-end/`:

| Variable | Descripción | Ejemplo |
|---|---|---|
| JWT_SECRET | Clave secreta para tokens JWT | cadena larga y aleatoria |
| REFRESH_SECRET | Clave para refresh tokens | cadena larga y aleatoria |
| RESET_TOKEN_SECRET | Clave para tokens de reset | cadena larga y aleatoria |
| RESET_TOKEN_TTL | Tiempo de expiración del reset token | 15m |
| DB_URI | URI de conexión a MongoDB | mongodb://mongo:27017/gymdb |
| REDIS_URI | URI de conexión a Redis | redis://redis:6379 |
| MAIL_HOST | Servidor SMTP | smtp.gmail.com |
| MAIL_PORT | Puerto SMTP | 587 |
| MAIL_USER | Correo Gmail del proyecto | correo@gmail.com |
| MAIL_PASS | Contraseña de aplicación Gmail | clave de 16 caracteres |
| MAIL_FROM | Correo remitente | correo@gmail.com |
| FRONTEND_URL | URL del frontend en producción | https://mi-frontend.com |
| APP_URL | URL base del backend | http://localhost:3000 |

## Levantar el entorno
```bash
docker-compose up --build
```

## Verificar que el servidor está sano
```bash
curl http://localhost:3000/api/health
```

## Ejecutar pruebas de seguridad manualmente

### Verificar headers de seguridad (helmet)
```bash
curl -I http://localhost:3000/api/health
```
Debes ver headers como `Strict-Transport-Security`, `X-Frame-Options`, `Content-Security-Policy`.

### Verificar monitoreo de eventos 401/403
Hacer 5+ peticiones no autorizadas activa la alerta de posible ataque:
```bash
curl http://localhost:3000/api/auth/login
```
Revisar logs:
```bash
docker logs backend_app
```

### Verificar logs de seguridad en archivo
```bash
docker exec backend_app cat logs/security.log
```

## Archivos de log generados

| Archivo | Contenido |
|---|---|
| `logs/app.log` | Todos los requests con método, URL, status y tiempo |
| `logs/security.log` | Solo eventos 401, 403 y alertas de ataques |

## Headers de seguridad activos (helmet)

- `Content-Security-Policy` — protege contra XSS
- `Strict-Transport-Security` — fuerza HTTPS
- `X-Frame-Options` — protege contra clickjacking
- `X-Content-Type-Options` — evita MIME sniffing
- `Referrer-Policy` — controla información de referrer

## Notas para el equipo

- El archivo `.env` nunca debe subirse a GitHub (está en `.gitignore`)
- En producción cambiar `NODE_ENV=production` activa HTTPS obligatorio y logs JSON estructurados
- El pipeline de CI hace smoke test automático a `/api/health` en cada push
- Cuando el billing de GitHub Actions se resuelva, el pipeline correrá completo