process.env.JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

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
    const res = await request(app)
      .get('/api/session')
      .set('Authorization', `Bearer ${accessToken}`);

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

    const res = await request(app)
      .get('/api/session')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(res.statusCode).toBe(401);
  });

  test('Acceso restringido por rol', async () => {
    const res = await request(app)
      .get('/api/admin')
      .set('Authorization', `Bearer ${accessToken}`);

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
});
