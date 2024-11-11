import request from 'supertest';
import { app } from '../index';
import { PrismaClient } from '@prisma/client';

describe('GET /', () => {
  it('responds with Hola LTI!', async () => {
    const response = await request(app).get('/');
    expect(response.statusCode).toBe(200);
    expect(response.text).toBe('Hola LTI!');
  });
});

const prisma = new PrismaClient();

describe('Candidate Tests', () => {
 
describe('POST /api/candidates', () => {
  beforeEach(async () => {
    // Limpiar la base de datos para evitar duplicados
    await prisma.education.deleteMany({
      where: { candidate: { email: 'jane.doe@example.com' } },
    });
    await prisma.experience.deleteMany({
      where: { candidate: { email: 'jane.doe@example.com' } },
    });
    await prisma.candidate.deleteMany({
      where: { email: 'jane.doe@example.com' },
    });
  });
  
  it('debería crear un nuevo candidato', async () => {
    const response = await request(app)
      .post('/api/candidates')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        phone: '0987654321',
        address: '456 Another St',
        education: [
          {
            institution: 'University B',
            degree: 'MSc',
            startDate: new Date('2016-09-01'),
            endDate: new Date('2020-06-01'),
          },
        ],
        experience: [
          {
            company: 'Company B',
            position: 'Manager',
            startDate: new Date('2020-07-01'),
            endDate: new Date('2022-08-01'),
            responsibilities: 'Managing projects',
          },
        ],
      });

    expect(response.statusCode).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.firstName).toBe('Jane');
  });
});

describe('GET /api/candidates/:email', () => {
  it('debería encontrar un candidato por correo electrónico', async () => {
    const response = await request(app).get('/api/candidates/jane.doe@example.com');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('email', 'jane.doe@example.com');
  });

  it('debería devolver 404 si el candidato no existe', async () => {
    const response = await request(app).get('/api/candidates/nonexistent@example.com');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Candidato no encontrado');
  });
});

describe('PUT /api/candidates/:email', () => {
  it('debería actualizar un candidato existente', async () => {
    const response = await request(app)
      .put('/api/candidates/jane.doe@example.com')
      .send({
        firstName: 'Jane Updated',
        lastName: 'Doe Updated',
        phone: '1234567890',
        address: '789 Updated St',
        education: [
          {
            institution: 'University B',
            degree: 'PhD',
            startDate: new Date('2020-09-01'),
            endDate: new Date('2023-06-01'),
          },
        ],
        experience: [
          {
            company: 'Company B Updated',
            position: 'Senior Manager',
            startDate: new Date('2022-09-01'),
            endDate: new Date('2023-08-01'),
            responsibilities: 'Managing larger projects',
          },
        ],
      });

    expect(response.statusCode).toBe(200);
    expect(response.body.firstName).toBe('Jane Updated');
  });

  it('debería devolver 404 si el candidato no existe', async () => {
    const response = await request(app)
      .put('/api/candidates/nonexistent@example.com')
      .send({
        firstName: 'Nonexistent',
        lastName: 'User',
      });

    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Candidato no encontrado');
  });
});

describe('DELETE /api/candidates/:email', () => {
  it('debería borrar un candidato existente', async () => {
    const response = await request(app).delete('/api/candidates/jane.doe@example.com');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveProperty('email', 'jane.doe@example.com');
  });

  it('debería devolver 404 si el candidato no existe', async () => {
    const response = await request(app).delete('/api/candidates/nonexistent@example.com');
    expect(response.statusCode).toBe(404);
    expect(response.body).toHaveProperty('error', 'Candidato no encontrado');
  });
});

});
