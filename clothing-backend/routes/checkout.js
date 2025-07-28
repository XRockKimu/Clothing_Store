import express from 'express';
import checkoutController from '../controllers/checkoutController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, checkoutController.processCheckout);

export default router;
