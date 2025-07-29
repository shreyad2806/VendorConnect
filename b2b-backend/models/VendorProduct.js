const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VendorProduct = sequelize.define('products', {
  product_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'product_id'
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'name'
  },
  unit: {
    type: DataTypes.STRING(20),
    allowNull: true,
    field: 'unit'
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: true,
    field: 'category'
  }
}, {
  tableName: 'products',
  timestamps: false
});

module.exports = VendorProduct; 