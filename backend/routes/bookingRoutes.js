import express from 'express';
import { getBookings, saveBooking, deleteBooking } from '../controllers/bookingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getBookings);
router.post('/', authenticateToken, saveBooking);
router.delete('/:id', authenticateToken, deleteBooking);

export default router;
