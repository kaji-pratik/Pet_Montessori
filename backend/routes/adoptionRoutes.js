import express from 'express';
import { getAdoptionRequests, saveAdoptionRequest } from '../controllers/adoptionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getAdoptionRequests);
router.post('/', authenticateToken, saveAdoptionRequest);

export default router;
