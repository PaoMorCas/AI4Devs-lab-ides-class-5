import { Router } from 'express';
import { addCandidate, getCandidateByEmail, updateCandidate, deleteCandidate } from '../controllers/candidate.controller';

const router = Router();

router.post('/candidates', addCandidate);
router.get('/candidates/:email', getCandidateByEmail);
router.put('/candidates/:email', updateCandidate);
router.delete('/candidates/:email', deleteCandidate);

export default router;
