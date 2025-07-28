import express from 'express';
import { loginUser, registerUser } from '../controllers/authController.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/login', loginUser);
router.post('/register', registerUser);

// Example protected route
router.get('/me', verifyToken, (req, res) => {
  res.json({ message: 'Protected route accessed', user: req.user });
});

export default router;
