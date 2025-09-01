const request = require('supertest');
const app = require('../../src/app');
const mongoose = require('mongoose');

describe('User API Integration Tests', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a new user', async () => {
        const response = await request(app)
            .post('/users')
            .send({ name: 'John Doe', email: 'john@example.com' });
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('user');
        expect(response.body.user).toHaveProperty('_id');
    });

    it('should not create a user with duplicate email', async () => {
        await request(app)
            .post('/users')
            .send({ name: 'Jane Doe', email: 'john@example.com' });
        const response = await request(app)
            .post('/users')
            .send({ name: 'Jane Doe', email: 'john@example.com' });
        expect(response.status).toBe(409);
    });

    it('should list users with pagination', async () => {
        const response = await request(app)
            .get('/users?page=1&limit=5');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('users');
        expect(Array.isArray(response.body.users)).toBe(true);
    });

    it('should get a user by id', async () => {
        const user = await request(app)
            .post('/users')
            .send({ name: 'Alice', email: 'alice@example.com' });
        const response = await request(app)
            .get(`/users/${user.body.user._id}`);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', 'Alice');
    });

    it('should update a user', async () => {
        const user = await request(app)
            .post('/users')
            .send({ name: 'Bob', email: 'bob@example.com' });
        const response = await request(app)
            .put(`/users/${user.body.user._id}`)
            .send({ name: 'Robert' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('name', 'Robert');
    });

    it('should delete a user', async () => {
        const user = await request(app)
            .post('/users')
            .send({ name: 'Charlie', email: 'charlie@example.com' });
        const response = await request(app)
            .delete(`/users/${user.body.user._id}`);
        expect(response.status).toBe(204);
    });

    it('should get user stats', async () => {
        const response = await request(app)
            .get('/users/stats');
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('totalUsers');
        expect(response.body).toHaveProperty('lastWeekUsers');
        expect(response.body).toHaveProperty('byDomain');
    });
});