import { Request, Response } from 'express';
import prisma from '../index'; // Importa el cliente de Prisma
import multer from 'multer';
import path from 'path';

// Configuración de multer para manejar la carga de archivos
const storage = multer.diskStorage({
  destination: (req: Request, file: Express.Multer.File, cb: (error: Error | null, destination: string) => void) => {
    cb(null, 'uploads/'); // Cambia la ruta según tus necesidades
},
filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`); // Renombrar el archivo
},
});

const upload = multer({ storage });

export const addCandidate = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, email, phone, address, education, experience } = req.body;
        // Validaciones básicas
        if (!firstName || !lastName || !email) {
          return res.status(400).json({ error: 'Faltan campos obligatorios' });
        }
        
        // Manejo del archivo cargado
        const resume = req.file ? req.file.path : null; // Obtén la ruta del archivo cargado
        

        // Crear candidato en la base de datos
        const candidate = await prisma.candidate.create({
            data: {
                firstName,
                lastName,
                email,
                phone,
                address,
                education: {
                    create: education,
                },
                experience: {
                    create: experience,
                },
            },
        });
        
        res.status(201).json(candidate);
    } catch (error) {
        res.status(500).json({ error: 'Error al crear el candidato' });
    }
};

export const getCandidateByEmail = async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
        const candidate = await prisma.candidate.findUnique({
            where: { email },
            include: { education: true, experience: true },
        });
        if (!candidate) {
            return res.status(404).json({ error: 'Candidato no encontrado' });
        }
        res.json(candidate);
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar el candidato' });
    }
};

export const updateCandidate = async (req: Request, res: Response) => {
    const { email } = req.params;
    const { firstName, lastName, phone, address, education, experience } = req.body;

    try {

        const candidate = await prisma.candidate.findUnique({
            where: { email },
            include: { education: true, experience: true },
        });
        if (!candidate) {
            return res.status(404).json({ error: 'Candidato no encontrado' });
        }

        const candidateUpdated = await prisma.candidate.update({
            where: { email },
            data: {
                firstName,
                lastName,
                phone,
                address,
                education: {
                    deleteMany: {}, // Elimina todas las educaciones existentes
                    create: education,
                },
                experience: {
                    deleteMany: {}, // Elimina todas las experiencias existentes
                    create: experience,
                },
            },
        });
        
        res.json(candidateUpdated);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el candidato' });
    }
};

export const deleteCandidate = async (req: Request, res: Response) => {
    const { email } = req.params;
    try {
        const candidate = await prisma.candidate.findUnique({
            where: { email },
            include: { education: true, experience: true },
        });
        if (!candidate) {
            return res.status(404).json({ error: 'Candidato no encontrado' });
        }

        // Primero, eliminar los registros de educación relacionados
        await prisma.education.deleteMany({
            where: { candidate: { email } },
        });

        // Luego, eliminar los registros de experiencia relacionados
        await prisma.experience.deleteMany({
            where: { candidate: { email } },
        });

        // Ahora, eliminar el candidato
        const candidateDeleted = await prisma.candidate.delete({
            where: { email },
        });

        res.json(candidateDeleted);
    } catch (error) {
        res.status(500).json({ error: 'Error al borrar el candidato' });
    }
};