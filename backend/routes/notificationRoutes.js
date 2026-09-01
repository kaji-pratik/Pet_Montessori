import express from 'express';
import { getNotifications, createNotification, markNotificationsRead } from '../controllers/notificationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getNotifications);
router.post('/', authenticateToken, createNotification);
router.put('/read', authenticateToken, markNotificationsRead);

export default router;
