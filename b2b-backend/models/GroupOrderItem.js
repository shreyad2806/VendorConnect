const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const GroupOrderItem = sequelize.define('GroupOrderItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  groupOrderId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'GroupOrders',
      key: 'id'
    }
  },
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Products',
      key: 'id'
    }
  },
  supplierId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  totalQuantity: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  bulkDiscountPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Price after bulk discount is applied'
  },
  minQuantityForDiscount: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Minimum quantity required for bulk discount'
  }
});

module.exports = GroupOrderItem; 