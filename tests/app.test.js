const request = require('supertest');
const app = require('../app');

describe('GET /', () => {
  it('should return a welcome message', async () => {
    const response = await request(app).get('/');
    expect(response.text).toBe('Welcome to the API');
  });
});