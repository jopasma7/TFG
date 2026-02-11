const jwt = require('jsonwebtoken');
const { User } = require('../models');

// Generar token JWT
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    // Verificar si el email ya existe
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(400);
      throw new Error('Este email ya está registrado.');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: role || 'guest',
    });

    const token = generateToken(user.id);

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401);
      throw new Error('Credenciales incorrectas.');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Credenciales incorrectas.');
    }

    const token = generateToken(user.id);

    res.json({
      message: 'Inicio de sesión exitoso',
      user,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/auth/profile
const getProfile = async (req, res, next) => {
  try {
    res.json({ data: req.user });
  } catch (error) {
    next(error);
  }
};

// PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, bio, avatar } = req.body;

    const user = req.user;
    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (bio) user.bio = bio;
    if (avatar) user.avatar = avatar;

    await user.save();

    res.json({
      message: 'Perfil actualizado correctamente',
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, getProfile, updateProfile };
