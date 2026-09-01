import express from 'express';
import { getOrders, saveOrder, deleteOrder } from '../controllers/orderController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getOrders);
router.post('/', authenticateToken, saveOrder);
router.delete('/:id', authenticateToken, deleteOrder);

export default router;
