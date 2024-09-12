const request = require('supertest');
const express = require('express');
const apiRoutes = require('./routes/api');

const app = express();
app.use('/api', apiRoutes);

describe('GET /api/calculate', () => {
    it('should return a list of companies with intrinsic values', async () => {
        const response = await request(app).get('/api/calculate?discountRate=0.1&marginOfSafety=0.2');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeInstanceOf(Array);
        expect(response.body[0]).toHaveProperty('company');
        expect(response.body[0]).toHaveProperty('intrinsicValue');
        expect(response.body[0]).toHaveProperty('isUndervalued');
    });
});
