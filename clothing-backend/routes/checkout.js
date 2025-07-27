import express from 'express';
import checkoutController from '../controllers/checkoutController.js';
import authMiddleware from '../authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const result = await checkoutController.processCheckout(req);
    res.status(200).json({ success: true, orderId: result.orderId });
  } catch (error) {
    console.error('Checkout error:', error);
    if (error.message === 'Cart is empty') {
      return res.status(400).json({ error: 'Cart is empty' });
    }
    if (error.name === 'SequelizeDatabaseError' && error.parent.code === 'WARN_DATA_TRUNCATED') {
      return res.status(400).json({ error: 'Invalid payment method' });
    }
    res.status(500).json({ error: error.message || 'Failed to process order' });
  }
});

export default router;