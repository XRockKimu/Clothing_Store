import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await db.Customer.findOne({ where: { email } });
    let role = 'user';
    let idField = 'customer_id';
    let fullNameField = 'full_name';

    if (!user) {
      user = await db.Employee.findOne({ where: { email } });
      role = 'admin';
      idField = 'employee_id';
      fullNameField = 'full_name';
    }

    if (!user) {
      return res.status(400).json({ message: 'Invalid email' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(400).json({ message: 'Incorrect password' });
    }

    const token = jwt.sign(
      { id: user[idField], email, role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      token,
      user: {
        id: user[idField],
        email: user.email,
        role,
        full_name: user[fullNameField],
      },
      message: 'Login successful',
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Something went wrong' });
  }
});

router.post('/register', async (req, res) => {
  const { full_name, email, password, gender, phone, address } = req.body;

  try {
    const existing = await db.Customer.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ message: 'Email already in use' });
    }

    const hash = await bcrypt.hash(password, 10);

    const newUser = await db.Customer.create({
      full_name,
      email,
      password_hash: hash,
      gender,
      phone,
      address,
    });

    const token = jwt.sign(
      { id: newUser.customer_id, email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(201).json({
      token,
      user: {
        id: newUser.customer_id,
        email: newUser.email,
        role: 'user',
        full_name: newUser.full_name,
      },
      message: 'Registration successful',
    });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'Server error during registration' });
  }
});

export default router;