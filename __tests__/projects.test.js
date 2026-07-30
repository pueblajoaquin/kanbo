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

describe('POST /projects/:id/members', () => {
  it('allows the owner to invite a member and lists the owner first', async () => {
    const uniqueSuffix = Date.now()
    const ownerEmail = `project-owner-${uniqueSuffix}@example.com`
    const memberEmail = `project-member-${uniqueSuffix}@example.com`

    await request(app).post('/auth/register').send({ name: 'Owner', email: ownerEmail, password: '12345678' })
    await request(app).post('/auth/register').send({ name: 'Member', email: memberEmail, password: '12345678' })

    const ownerLogin = await request(app).post('/auth/login').send({ email: ownerEmail, password: '12345678' })
    const projectResponse = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${ownerLogin.body.token}`)
      .send({ name: 'Shared Project' })

    const inviteResponse = await request(app)
      .post(`/projects/${projectResponse.body.id}/members`)
      .set('Authorization', `Bearer ${ownerLogin.body.token}`)
      .send({ email: memberEmail })

    expect(inviteResponse.status).toBe(201)
    expect(inviteResponse.body.role).toBe('collaborator')

    const membersResponse = await request(app)
      .get(`/projects/${projectResponse.body.id}/members`)
      .set('Authorization', `Bearer ${ownerLogin.body.token}`)

    expect(membersResponse.status).toBe(200)
    expect(membersResponse.body).toHaveLength(2)
    expect(membersResponse.body[0].isOwner).toBe(true)
    expect(membersResponse.body[0].role).toBe('owner')

    const invitedMember = membersResponse.body.find((member) => member.email === memberEmail)
    expect(invitedMember).toBeDefined()
    expect(invitedMember.role).toBe('collaborator')
    expect(invitedMember.isOwner).toBe(false)
  })

  it('rejects invites from users who are not project owners', async () => {
    const uniqueSuffix = Date.now()
    const ownerEmail = `owner-only-${uniqueSuffix}@example.com`
    const outsiderEmail = `outsider-only-${uniqueSuffix}@example.com`
    const targetEmail = `target-only-${uniqueSuffix}@example.com`

    await request(app).post('/auth/register').send({ name: 'Owner', email: ownerEmail, password: '12345678' })
    await request(app).post('/auth/register').send({ name: 'Outsider', email: outsiderEmail, password: '12345678' })
    await request(app).post('/auth/register').send({ name: 'Target', email: targetEmail, password: '12345678' })

    const ownerLogin = await request(app).post('/auth/login').send({ email: ownerEmail, password: '12345678' })
    const outsiderLogin = await request(app).post('/auth/login').send({ email: outsiderEmail, password: '12345678' })

    const projectResponse = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${ownerLogin.body.token}`)
      .send({ name: 'Private Project' })

    const inviteResponse = await request(app)
      .post(`/projects/${projectResponse.body.id}/members`)
      .set('Authorization', `Bearer ${outsiderLogin.body.token}`)
      .send({ email: targetEmail })

    expect(inviteResponse.status).toBe(404)
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
