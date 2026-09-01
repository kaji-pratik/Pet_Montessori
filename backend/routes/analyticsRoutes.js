import express from 'express';
import { getAnalytics } from '../controllers/analyticsController.js';
import { authenticateToken, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, adminOnly, getAnalytics);

export default router;
