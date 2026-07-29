const request = require('supertest')
const app = require('../src/app')

describe('POST /auth/register', () => {
  it('creates a new user and returns 201 with their data (NO PASSWORD)', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: `test-${Date.now()}@test.com`,
        password: '12345678'
      })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty('id')
    expect(response.body).not.toHaveProperty('passwordHash')
  })

  it('rejects registration when password is missing (input invalidation)', async () => {
    const response = await request(app)
      .post('/auth/register')
      .send({
        name: 'User Name',
        email: 'nopasswordtest@test.com'
      })

    expect(response.status).toBe(400)
  })

  it('rejects registration with an email already in use', async () => {
    const email = 'emailTest@test.com'

    await request(app)
      .post('/auth/register')
      .send({ name: 'first', email, password: '12345678' })

    const response = await request(app)
      .post('/auth/register')
      .send({ name: 'second', email, password: '87654321' })

    expect(response.status).toBe(400)
    expect(response.body.error).toBe('Email already in use')
  })
})

describe('POST /auth/login', () => {
  const email = `logintest-${Date.now()}@example.com`
  const password = '12345678'

  beforeAll(async () => {
    await request(app).post('/auth/register').send({ name: 'Login Test', email, password })
  })

  it('logs in with correct credentials and returns a token', async () => {
    const response = await request(app).post('/auth/login').send({ email, password })

    expect(response.status).toBe(200)
    expect(response.body).toHaveProperty('token')
    expect(response.body.user.email).toBe(email)
  })

  it('rejects login with wrong password', async () => {
    const response = await request(app).post('/auth/login').send({ email, password: 'wrongpassword' })

    expect(response.status).toBe(401)
  })

  it('rejects login with an email that does not exist', async () => {
    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'doesnotexist@example.com', password: '12345678' })

    expect(response.status).toBe(401)
  })
})
