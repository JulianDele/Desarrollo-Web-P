process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'devsecret';
process.env.RESET_TOKEN_SECRET = process.env.RESET_TOKEN_SECRET || 'dev-reset-secret';
process.env.RESET_TOKEN_TTL_MINUTES = process.env.RESET_TOKEN_TTL_MINUTES || '15';

const request = require('supertest');
const app = require('../app');
const jwt = require('jsonwebtoken');

describe('Auth API Tests', () => {
  const user = {
    email: 'test@test.com',
    password: '123456',
    role: 'user',
  };

  let accessToken;

  test('Registro exitoso', async () => {
    const res = await request(app).post('/api/register').send(user);
    expect(res.statusCode).toBe(200);
  });

  test('Login exitoso', async () => {
    const res = await request(app).post('/api/login').send({
      email: user.email,
      password: user.password,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    accessToken = res.body.accessToken;
  });

  test('Login fallo', async () => {
    const res = await request(app).post('/api/login').send({
      email: user.email,
      password: 'incorrecta',
    });
    expect(res.statusCode).toBe(401);
  });

  test('Validación de datos', async () => {
    const res = await request(app).post('/api/login').send({});
    expect(res.statusCode).toBe(400);
  });

  test('Acceso a sesión con token', async () => {
    const res = await request(app).get('/api/session').set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(200);
  });

  test('Acceso sin token', async () => {
    const res = await request(app).get('/api/session');
    expect(res.statusCode).toBe(401);
  });

  test('Token expirado', async () => {
    const expiredToken = jwt.sign({ id: 1, role: 'user' }, process.env.JWT_SECRET, {
      expiresIn: '-1s',
    });

    const res = await request(app).get('/api/session').set('Authorization', `Bearer ${expiredToken}`);
    expect(res.statusCode).toBe(401);
  });

  test('Acceso restringido por rol', async () => {
    const res = await request(app).get('/api/admin').set('Authorization', `Bearer ${accessToken}`);
    expect(res.statusCode).toBe(403);
  });

  test('Dos logins crean dos sesiones', async () => {
    const res1 = await request(app).post('/api/login').send(user);
    const res2 = await request(app).post('/api/login').send(user);
    expect(res1.body.accessToken).toBeDefined();
    expect(res2.body.accessToken).toBeDefined();
  });

  test('Logout invalida la sesión', async () => {
    const login = await request(app).post('/api/login').send(user);
    const token = login.body.accessToken;

    await request(app).post('/api/logout').set('Authorization', `Bearer ${token}`);

    const res = await request(app).get('/api/session').set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toBe(401);
  });

  test('Forgot password responde neutral y no enumera', async () => {
    const resUnknown = await request(app).post('/api/forgot-password').send({ email: 'no@existe.com' });
    const resKnown = await request(app).post('/api/forgot-password').send({ email: user.email });

    expect(resUnknown.statusCode).toBe(200);
    expect(resKnown.statusCode).toBe(200);
    expect(resUnknown.body.message).toBe(resKnown.body.message);
  });

  test('Validate token inválido', async () => {
    const res = await request(app).post('/api/reset-password/validate').send({ token: 'fake_token' });
    expect(res.statusCode).toBe(200);
    expect(res.body.valid).toBe(false);
  });

  test('Reset password requiere token y contraseña', async () => {
    const res = await request(app).post('/api/reset-password').send({ newPassword: '12345678' });
    expect(res.statusCode).toBe(400);
  });

  test('Flujo completo de reset password (test token)', async () => {
    const forgot = await request(app).post('/api/forgot-password').send({ email: user.email });
    expect(forgot.statusCode).toBe(200);
    expect(forgot.body.testToken).toBeDefined();

    const token = forgot.body.testToken;

    const validate = await request(app).post('/api/reset-password/validate').send({ token });
    expect(validate.statusCode).toBe(200);
    expect(validate.body.valid).toBe(true);

    const reset = await request(app).post('/api/reset-password').send({ token, newPassword: 'nuevaPass123' });
    expect(reset.statusCode).toBe(200);

    const loginOld = await request(app).post('/api/login').send({ email: user.email, password: user.password });
    expect(loginOld.statusCode).toBe(401);

    const loginNew = await request(app).post('/api/login').send({ email: user.email, password: 'nuevaPass123' });
    expect(loginNew.statusCode).toBe(200);
  });
});
