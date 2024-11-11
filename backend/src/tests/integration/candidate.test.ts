import { PrismaClient } from '@prisma/client';
import { expect } from '@jest/globals';

const prisma = new PrismaClient();

describe('Candidate Model', () => {
  beforeEach(async () => {
    // Clean up the database to ensure no duplicate emails
    await prisma.education.deleteMany({
      where: { candidate: { email: 'john.doe@example.com' } },
    });
    await prisma.experience.deleteMany({
      where: { candidate: { email: 'john.doe@example.com' } },
    });
    await prisma.candidate.deleteMany({
      where: { email: 'john.doe@example.com' },
    });
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new candidate', async () => {
    const candidate = await prisma.candidate.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        address: '123 Main St',
        education: {
          create: [
            {
              institution: 'University A',
              degree: 'BSc',
              startDate: new Date('2015-09-01'),
              endDate: new Date('2019-06-01'),
            },
          ],
        },
        experience: {
          create: [
            {
              company: 'Company A',
              position: 'Developer',
              startDate: new Date('2019-07-01'),
              endDate: new Date('2021-08-01'),
              responsibilities: 'Developing software',
            },
          ],
        },
      },
    });
    
    expect(candidate).toHaveProperty('id');
    expect(candidate.firstName).toBe('John');
    expect(candidate.email).toBe('john.doe@example.com');
  });

  it('should find a candidate by email', async () => {
    await prisma.candidate.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        address: '123 Main St',
        education: {
          create: [
            {
              institution: 'University A',
              degree: 'BSc',
              startDate: new Date('2015-09-01'),
              endDate: new Date('2019-06-01'),
            },
          ],
        },
        experience: {
          create: [
            {
              company: 'Company A',
              position: 'Developer',
              startDate: new Date('2019-07-01'),
              endDate: new Date('2021-08-01'),
              responsibilities: 'Developing software',
            },
          ],
        },
      },
    });

    const candidate = await prisma.candidate.findUnique({
      where: { email: 'john.doe@example.com' },
    });

    expect(candidate).not.toBeNull();
    expect(candidate?.firstName).toBe('John');
  });

  it('should delete a candidate', async () => {
    await prisma.candidate.create({
      data: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '1234567890',
        address: '123 Main St',
        education: {
          create: [
            {
              institution: 'University A',
              degree: 'BSc',
              startDate: new Date('2015-09-01'),
              endDate: new Date('2019-06-01'),
            },
          ],
        },
        experience: {
          create: [
            {
              company: 'Company A',
              position: 'Developer',
              startDate: new Date('2019-07-01'),
              endDate: new Date('2021-08-01'),
              responsibilities: 'Developing software',
            },
          ],
        },
      },
    });

    // First, delete related education records
    await prisma.education.deleteMany({
      where: { candidate: { email: 'john.doe@example.com' } },
    });

    // Then, delete related experience records
    await prisma.experience.deleteMany({
      where: { candidate: { email: 'john.doe@example.com' } },
    });

    // Now, delete the candidate
    const deleteCandidate = await prisma.candidate.delete({
      where: { email: 'john.doe@example.com' },
    });

    expect(deleteCandidate).toHaveProperty('id');
    expect(deleteCandidate.email).toBe('john.doe@example.com');
  });
});