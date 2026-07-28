const request = require('supertest');
const app = require('../src/app');

describe('POST /projects/:id/tasks', ()=>{
    let token;
    let projectId;

    beforeAll(async ()=>{
        const email = `tasktest-${Date.now()}@test.com`;
        await request(app).post('/auth/register').send({name:'Test', email, password:'12345678'});
        const loginResponse = await request(app).post('/auth/login').send({email, password:'12345678'});
        token = loginResponse.body.token;

        const projectResponse = await request(app).post('/projects').set('Authorization',`Bearer ${token}`).send({name:'Test'});
        projectId = projectResponse.body.id;
    })

    it('creates a task in the project', async ()=>{
        const response = await request(app)
        .post(`/projects/${projectId}/tasks`)
        .set('Authorization',`Bearer ${token}`)
        .send({title: 'Test Task'});

        expect(response.status).toBe(201);
    })

    it('rejects task creation without a token', async ()=>{
        const response = await request(app)
        .post(`/projects/${projectId}/tasks`)
        .send({title: 'Test Task'});

        expect(response.status).toBe(401)
    })
})
