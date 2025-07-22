import db from "../models/index.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const Customer = db.Customer;
const Employee = db.Employee;

export async function login(req, res) {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    if (!Customer || !Employee) {
      console.error("Models not loaded: Customer or Employee missing");
      return res.status(500).json({ message: "Server configuration error: Models not loaded" });
    }
    const normalizedEmail = email.trim().toLowerCase();
    console.log("Looking up Customer with email:", normalizedEmail);
    let user = await Customer.findOne({ where: { email: normalizedEmail } });
    let role = "user";
    let idField = "customer_id";
    let fullNameField = "full_name";
    if (!user) {
      console.log("Looking up Employee with email:", normalizedEmail);
      user = await Employee.findOne({ where: { email: normalizedEmail } });
      role = "admin";
      idField = "employee_id";
      fullNameField = "full_name";
    }
    if (!user) {
      console.log("No user found for email:", normalizedEmail);
      return res.status(401).json({ message: "Invalid email or password" });
    }
    console.log("User found:", { id: user[idField], email: normalizedEmail, role });
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      console.log("Password mismatch for email:", normalizedEmail);
      return res.status(401).json({ message: "Invalid email or password" });
    }
    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET not defined");
      return res.status(500).json({ message: "Server configuration error: JWT_SECRET missing" });
    }
    const token = jwt.sign({ id: user[idField], email: normalizedEmail, role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.json({
      token,
      user: {
        id: user[idField],
        full_name: user[fullNameField],
        email: user.email,
        role,
      },
      message: "Login successful",
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
}

export async function register(req, res) {
  const { full_name, gender, email, phone, address, password } = req.body;
  try {
    if (!full_name || !email || !password) {
      return res.status(400).json({ message: "Full name, email, and password are required" });
    }
    if (!Customer) {
      console.error("Customer model not loaded");
      return res.status(500).json({ message: "Server configuration error: Customer model not loaded" });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const existing = await Customer.findOne({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await Customer.create({
      full_name,
      gender,
      email: normalizedEmail,
      phone,
      address,
      password_hash: hashedPassword,
    });
    const token = jwt.sign(
      { id: newUser.customer_id, email: normalizedEmail, role: "user" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.status(201).json({
      token,
      user: {
        id: newUser.customer_id,
        full_name: newUser.full_name,
        email: newUser.email,
        role: "user",
      },
      message: "Registration successful",
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: `Server error: ${err.message}` });
  }
}