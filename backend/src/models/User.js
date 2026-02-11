const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: { msg: 'El nombre es obligatorio' },
      len: { args: [2, 100], msg: 'El nombre debe tener entre 2 y 100 caracteres' },
    },
  },
  email: {
    type: DataTypes.STRING(150),
    allowNull: false,
    unique: { msg: 'Este email ya está registrado' },
    validate: {
      isEmail: { msg: 'Debe ser un email válido' },
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: { args: [6], msg: 'La contraseña debe tener al menos 6 caracteres' },
    },
  },
  role: {
    type: DataTypes.ENUM('guest', 'host', 'admin'),
    defaultValue: 'guest',
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: null,
  },
  phone: {
    type: DataTypes.STRING(20),
    defaultValue: null,
  },
  bio: {
    type: DataTypes.TEXT,
    defaultValue: null,
  },
}, {
  timestamps: true,
  tableName: 'users',
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
      }
    },
  },
});

// Método para comparar contraseñas
User.prototype.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// No devolver password en JSON
User.prototype.toJSON = function () {
  const values = Object.assign({}, this.get());
  delete values.password;
  return values;
};

module.exports = User;
