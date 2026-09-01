import express from 'express';
import { getFAQs, saveFAQ, deleteFAQ } from '../controllers/faqController.js';
import { authenticateToken, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getFAQs);
router.post('/', authenticateToken, adminOnly, saveFAQ);
router.delete('/:id', authenticateToken, adminOnly, deleteFAQ);

export default router;
