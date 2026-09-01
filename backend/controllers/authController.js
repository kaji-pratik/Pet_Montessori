import pool from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'pet_montessori_super_secret_jwt_key_2026';

export const register = async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  // Simple validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Name, email, and password are required.' });
  }

  try {
    // Check if user already exists
    const [existing] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'An account with this email address already exists.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = 'user-' + Date.now();
    const role = 'user';
    const avatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100';

    // Insert user
    await pool.query(
      'INSERT INTO users (id, name, email, password, role, phone, address, avatar) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [userId, name, email, hashedPassword, role, phone || '', address || '', avatar]
    );

    // Create session user (exclude password)
    const sessionUser = { id: userId, name, email, role, phone, address, avatar };

    // Generate JWT token
    const token = jwt.sign(
      { id: userId, email, role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(201).json({ user: sessionUser, token });
  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Server error during registration.', error: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required.' });
  }

  try {
    // Find user
    const [users] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    const user = users[0];

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password.' });
    }

    // Session user
    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      avatar: user.avatar
    };

    // JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.json({ user: sessionUser, token });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error during login.', error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  const { name, phone, address, avatar } = req.body;
  const userId = req.user.id; // From authenticateToken middleware

  try {
    // Verify user exists
    const [users] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Update details (role and email remain unchanged)
    await pool.query(
      'UPDATE users SET name = ?, phone = ?, address = ?, avatar = ? WHERE id = ?',
      [name || users[0].name, phone ?? users[0].phone, address ?? users[0].address, avatar ?? users[0].avatar, userId]
    );

    // Fetch updated user
    const [updatedUsers] = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);
    const updatedUser = updatedUsers[0];

    const sessionUser = {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      phone: updatedUser.phone,
      address: updatedUser.address,
      avatar: updatedUser.avatar
    };

    return res.json({ user: sessionUser });
  } catch (error) {
    console.error('Update profile error:', error);
    return res.status(500).json({ message: 'Server error updating profile.', error: error.message });
  }
};
