const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const VendorGroupOrder = sequelize.define('group_orders', {
  group_order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'group_order_id'
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'product_id',
    references: {
      model: 'products',
      key: 'product_id'
    }
  },
  total_quantity: {
    type: DataTypes.FLOAT,
    allowNull: true,
    field: 'total_quantity'
  },
  order_status: {
    type: DataTypes.ENUM('pending', 'matched', 'dispatched', 'complete'),
    allowNull: true,
    field: 'order_status'
  },
  delivery_area: {
    type: DataTypes.STRING(100),
    allowNull: true,
    field: 'delivery_area'
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
    field: 'created_at'
  }
}, {
  tableName: 'group_orders',
  timestamps: false
});

module.exports = VendorGroupOrder; 