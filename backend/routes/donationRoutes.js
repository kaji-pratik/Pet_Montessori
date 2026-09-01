import express from 'express';
import { getDonations, saveDonation } from '../controllers/donationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticateToken, getDonations);
router.post('/', authenticateToken, saveDonation);

export default router;
