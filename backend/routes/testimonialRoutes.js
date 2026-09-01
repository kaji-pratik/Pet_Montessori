import express from 'express';
import { getTestimonials, saveTestimonial, deleteTestimonial } from '../controllers/testimonialController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getTestimonials);
router.post('/', authenticateToken, saveTestimonial);
router.delete('/:id', authenticateToken, deleteTestimonial);

export default router;
