const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');

describe('Auth API Tests', () => {
  const user = {
    email: "test@test.com",
    password: "123456",
    role: "user"
  };
  let token;
  // Registro
  test('Registro exitoso', async () => {
    const res = await request(app)
      .post('/api/register')
      .send(user);
    expect(res.statusCode).toBe(200);
  });
  // Login 
  test('Login exitoso', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: user.email,
        password: user.password
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    token = res.body.token;
  });
  // Login fallido
  test('Login fallo', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: user.email,
        password: "incorrecta"
      });
    expect(res.statusCode).toBe(401);
  });
  // Validación
  test('Validación de datos', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({});
    expect(res.statusCode).toBe(400);
  });
  // Token válido
  test('Acceso a sesión con token', async () => {
    const res = await request(app)
      .get('/api/session')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(200);
  });
  // Token inválido
  test('Acceso sin token', async () => {
    const res = await request(app)
      .get('/api/session');
    expect(res.statusCode).toBe(401);
  });

  // Token expirado
  test('Token expirado', async () => {
    const expiredToken = jwt.sign(
      { id: 1, role: "user" },
      process.env.JWT_SECRET || "secret_key",
      { expiresIn: "-1s" }
    );
    const res = await request(app)
      .get('/api/session')
      .set('Authorization', `Bearer ${expiredToken}`);
    expect(res.statusCode).toBe(401);
  });
  // Asignación de rol
  test('Acceso restringido por rol', async () => {
    const res = await request(app)
      .get('/api/admin')
      .set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(403);
  });
});