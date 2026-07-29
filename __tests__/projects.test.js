const request = require('supertest')
const app = require('../src/app')

describe('POST /projects', () => {
  let token

  beforeAll(async () => {
    const email = `projecttest-${Date.now()}@example.com`
    await request(app).post('/auth/register').send({ name: 'Test', email, password: '12345678' })
    const loginResponse = await request(app).post('/auth/login').send({ email, password: '12345678' })
    token = loginResponse.body.token
  })

  it('creates a project when the user is authenticate', async () => {
    const response = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Project' })

    expect(response.status).toBe(201)
  })

  it('rejects creation without a token (401)', async () => {
    const response = await request(app)
      .post('/projects')
      .send({ name: 'No token' })

    expect(response.status).toBe(401)
  })
})

describe('GET /projects', () => {
  it('returns only the projects owned by the authenticated user', async () => {
    const uniqueSuffix = Date.now()
    const emailOne = `project-owner-1-${uniqueSuffix}@example.com`
    const emailTwo = `project-owner-2-${uniqueSuffix}@example.com`

    await request(app).post('/auth/register').send({ name: 'Owner One', email: emailOne, password: '12345678' })
    await request(app).post('/auth/register').send({ name: 'Owner Two', email: emailTwo, password: '12345678' })

    const loginOne = await request(app).post('/auth/login').send({ email: emailOne, password: '12345678' })
    const loginTwo = await request(app).post('/auth/login').send({ email: emailTwo, password: '12345678' })

    await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${loginOne.body.token}`)
      .send({ name: 'Project A' })

    await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${loginTwo.body.token}`)
      .send({ name: 'Project B' })

    const responseOne = await request(app)
      .get('/projects')
      .set('Authorization', `Bearer ${loginOne.body.token}`)

    const responseTwo = await request(app)
      .get('/projects')
      .set('Authorization', `Bearer ${loginTwo.body.token}`)

    expect(responseOne.status).toBe(200)
    expect(responseTwo.status).toBe(200)
    expect(responseOne.body).toHaveLength(1)
    expect(responseTwo.body).toHaveLength(1)
    expect(responseOne.body[0].name).toBe('Project A')
    expect(responseTwo.body[0].name).toBe('Project B')
  })
})

describe('PATCH /tasks/:id', () => {
  let token
  let taskId

  beforeAll(async () => {
    const email = `updatetask-${Date.now()}@example.com`
    await request(app).post('/auth/register').send({ name: 'Test', email, password: '12345678' })
    const loginRes = await request(app).post('/auth/login').send({ email, password: '12345678' })
    token = loginRes.body.token
    const projectRes = await request(app).post('/projects').set('Authorization', `Bearer ${token}`).send({ name: 'Project' })
    const taskRes = await request(app)
      .post(`/projects/${projectRes.body.id}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task to update' })
    taskId = taskRes.body.id
  })

  it('updates the task status', async () => {
    const response = await request(app)
      .patch(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'in_progress' })

    expect(response.status).toBe(200)
    expect(response.body.status).toBe('in_progress')
  })
})

describe('DELETE /tasks/:id', () => {
  let token
  let taskId

  beforeAll(async () => {
    const email = `deletetask-${Date.now()}@example.com`
    await request(app).post('/auth/register').send({ name: 'Test', email, password: '12345678' })
    const loginRes = await request(app).post('/auth/login').send({ email, password: '12345678' })
    token = loginRes.body.token
    const projectRes = await request(app).post('/projects').set('Authorization', `Bearer ${token}`).send({ name: 'Project' })
    const taskRes = await request(app)
      .post(`/projects/${projectRes.body.id}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task to delete' })
    taskId = taskRes.body.id
  })

  it('deletes a task when the user is its creator', async () => {
    const response = await request(app)
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)

    expect(response.status).toBe(204)
  })
})
