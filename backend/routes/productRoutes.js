import express from 'express';
import { getProducts, saveProduct, deleteProduct } from '../controllers/productController.js';
import { authenticateToken, adminOnly } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getProducts);
router.post('/', authenticateToken, adminOnly, saveProduct);
router.delete('/:id', authenticateToken, adminOnly, deleteProduct);

export default router;
