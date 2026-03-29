const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');

describe('Auth API Tests', () => {

  const user = {
    email: "test@test.com",
    password: "123456",
    role: "user"
  };

  let accessToken;

  // Registro
  test('Registro exitoso', async () => {
    const res = await request(app)
      .post('/api/register')
      .send(user);

    expect(res.statusCode).toBe(200);
  });

  // Login exitoso
  test('Login exitoso', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: user.email,
        password: user.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();

    accessToken = res.body.accessToken;
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

  // Acceso con token válido
  test('Acceso a sesión con token', async () => {
    const res = await request(app)
      .get('/api/session')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(200);
  });

  // Acceso sin token
  test('Acceso sin token', async () => {
    const res = await request(app)
      .get('/api/session');

    expect(res.statusCode).toBe(401);
  });

  // Token expirado
  test('Token expirado', async () => {
    const expiredToken = jwt.sign(
      { id: 1, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "-1s" }
    );

    const res = await request(app)
      .get('/api/session')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.statusCode).toBe(401);
  });

  // Rol restringido
  test('Acceso restringido por rol', async () => {
    const res = await request(app)
      .get('/api/admin')
      .set('Authorization', `Bearer ${accessToken}`);

    expect(res.statusCode).toBe(403);
  });

  // Concurrencia 
  test('Dos logins crean dos sesiones', async () => {
    const res1 = await request(app)
      .post('/api/login')
      .send(user);

    const res2 = await request(app)
      .post('/api/login')
      .send(user);

    expect(res1.body.accessToken).toBeDefined();
    expect(res2.body.accessToken).toBeDefined();
  });

  // Revocación 
  test('Logout invalida la sesión', async () => {
    const login = await request(app)
      .post('/api/login')
      .send(user);

    const token = login.body.accessToken;

    await request(app)
      .post('/api/logout')
      .set('Authorization', `Bearer ${token}`);

    const res = await request(app)
      .get('/api/session')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(401);
  });

});

// Forgot password 
test('Forgot password responde neutral', async () => {
  const res = await request(app)
    .post('/api/forgot-password')
    .send({ email: user.email });

  expect(res.statusCode).toBe(200);
  expect(res.body.message).toBeDefined();
});

// Validate token inválido
test('Validate token inválido', async () => {
  const res = await request(app)
    .post('/api/reset-password/validate')
    .send({ token: "fake_token" });

  expect(res.body.valid).toBe(false);
});

// Reset password sin token
test('Reset password sin token', async () => {
  const res = await request(app)
    .post('/api/reset-password')
    .send({ newPassword: "12345678" });

  expect(res.statusCode).toBe(200);
});