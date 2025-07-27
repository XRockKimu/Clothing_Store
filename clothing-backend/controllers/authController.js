import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import db from '../models/index.js';

const authController = {
  async login(req) {
    const { email, password } = req.body;

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
      throw new Error('Invalid email');
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      throw new Error('Incorrect password');
    }

    const token = jwt.sign(
      { id: user[idField], email, role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return {
      token,
      user: {
        id: user[idField],
        email: user.email,
        role,
        full_name: user[fullNameField],
      },
    };
  },

  async register(req) {
    const { full_name, email, password, gender, phone, address } = req.body;

    const existing = await db.Customer.findOne({ where: { email } });
    if (existing) {
      throw new Error('Email already in use');
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

    return {
      token,
      user: {
        id: newUser.customer_id,
        email: newUser.email,
        role: 'user',
        full_name: newUser.full_name,
      },
    };
  },
};

export default authController;