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