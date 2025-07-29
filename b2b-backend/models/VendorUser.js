const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

const VendorUser = sequelize.define('users', {
  user_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'user_id'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'name'
  },
  phone: {
    type: DataTypes.STRING(15),
    allowNull: true,
    field: 'phone'
  },
  role: {
    type: DataTypes.ENUM('vendor', 'supplier', 'admin'),
    allowNull: true,
    field: 'role'
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'location'
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: true,
    field: 'password_hash'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'users',
  timestamps: false
});

// Method to verify password
VendorUser.prototype.isValidPassword = async function(password) {
  // In a real application, you would use bcrypt.compare here
  // For now, we'll just compare the hashes directly since the sample data
  // doesn't have real bcrypt hashes
  return this.password_hash === password;
};

module.exports = VendorUser; 