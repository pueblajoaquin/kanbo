const request = require('supertest');
const app = require('../src/app');

describe('POST /projects', ()=>{
    let token;

    beforeAll(async() =>{
        const email = `projecttest-${Date.now()}@example.com`;
        await request(app).post('/auth/register').send({name:'Test', email, password: '12345678'});
        const loginResponse = await request(app).post('/auth/login').send({email,password:'12345678'});
        token = loginResponse.body.token;
    })

    it('creates a project when the user is authenticate',async ()=>{
        const response = await request(app)
        .post('/projects')
        .set('Authorization',`Bearer ${token}`)
        .send({name: "Test Project"});

        expect(response.status).toBe(201);
    });

    it('rejects creation without a token (401)', async ()=>{
        const response = await request(app)
        .post('/projects')
        .send({ name: 'No token' });

        expect(response.status).toBe(401);
    })
});

describe('PATCH /tasks/:id', () => {
  let token;
  let taskId;

  beforeAll(async () => {
    const email = `updatetask-${Date.now()}@example.com`;
    await request(app).post('/auth/register').send({ name: 'Test', email, password: '12345678' });
    const loginRes = await request(app).post('/auth/login').send({ email, password: '12345678' });
    token = loginRes.body.token;
    const projectRes = await request(app).post('/projects').set('Authorization', `Bearer ${token}`).send({ name: 'Project' });
    const taskRes = await request(app)
      .post(`/projects/${projectRes.body.id}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task to update' });
    taskId = taskRes.body.id;
  });

  it('updates the task status', async () => {
    const response = await request(app)
      .patch(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'in_progress' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('in_progress');
  });
});

describe('DELETE /tasks/:id', () => {
  let token;
  let taskId;

  beforeAll(async () => {
    const email = `deletetask-${Date.now()}@example.com`;
    await request(app).post('/auth/register').send({ name: 'Test', email, password: '12345678' });
    const loginRes = await request(app).post('/auth/login').send({ email, password: '12345678' });
    token = loginRes.body.token;
    const projectRes = await request(app).post('/projects').set('Authorization', `Bearer ${token}`).send({ name: 'Project' });
    const taskRes = await request(app)
      .post(`/projects/${projectRes.body.id}/tasks`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task to delete' });
    taskId = taskRes.body.id;
  });

  it('deletes a task when the user is its creator', async () => {
    const response = await request(app)
      .delete(`/tasks/${taskId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(204);
  });
});