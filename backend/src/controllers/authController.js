import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { getRandomImageSubset, IMAGE_POOL } from '../data/imagePool.js';

const signToken = (user) =>
  jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });

const safeUser = (u) => ({
  id: u._id, username: u.username, email: u.email,
  neighborhood: u.neighborhood, city: u.city,
  points: u.points, badges: u.badges, role: u.role,
});

// GET /api/auth/images/new  — fresh set for registration
export const getRegistrationImages = (_, res) =>
  res.json({ images: getRandomImageSubset(6) });

// GET /api/auth/images/:email  — user's image set for login (shuffled)
export const getLoginImages = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.toLowerCase() });
    if (!user) return res.status(404).json({ error: 'No account with that email' });

    const images = user.passphraseImageIds
      .map((id) => IMAGE_POOL.find((img) => img.id === id))
      .sort(() => Math.random() - 0.5); // shuffle before sending

    res.json({ images });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/register
export const register = async (req, res) => {
  try {
    const { username, email, neighborhood, city, passphraseOrder } = req.body;

    if (!Array.isArray(passphraseOrder) || passphraseOrder.length !== 6)
      return res.status(400).json({ error: 'Select exactly 6 images in sequence' });

    const passphraseHash = await bcrypt.hash(JSON.stringify(passphraseOrder), 12);

    const user = await User.create({
      username, email, neighborhood, city,
      passphraseImageIds: [...passphraseOrder].sort((a, b) => a - b), // store unordered
      passphraseHash,
    });

    res.status(201).json({ token: signToken(user), user: safeUser(user) });
  } catch (err) {
    if (err.code === 11000)
      return res.status(400).json({ error: 'Email or username already taken' });
    res.status(500).json({ error: err.message });
  }
};

// POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, passphraseOrder } = req.body;

    if (!Array.isArray(passphraseOrder) || passphraseOrder.length !== 6)
      return res.status(400).json({ error: 'Invalid passphrase format' });

    const user = await User.findOne({ email: email.toLowerCase() });
    // Constant-time-ish: always run bcrypt even on miss to avoid timing attacks
    const hash = user?.passphraseHash || '$2a$12$invalidhashpadding000000000000000000000000000000000000';
    const valid = await bcrypt.compare(JSON.stringify(passphraseOrder), hash);

    if (!user || !valid)
      return res.status(400).json({ error: 'Invalid credentials' });

    res.json({ token: signToken(user), user: safeUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET /api/auth/me
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-passphraseHash -passphraseImageIds');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};