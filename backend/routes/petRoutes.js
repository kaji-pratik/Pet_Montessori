import express from 'express';
import { getPets, savePet, deletePet } from '../controllers/petController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getPets);
router.post('/', authenticateToken, savePet);
router.delete('/:id', authenticateToken, deletePet);

export default router;
