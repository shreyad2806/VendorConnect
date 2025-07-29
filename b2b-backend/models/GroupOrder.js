const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const GroupOrder = sequelize.define('GroupOrder', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  initiatorId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    },
    comment: 'User who initiated the group order'
  },
  status: {
    type: DataTypes.ENUM('open', 'closed', 'processing', 'completed', 'cancelled'),
    defaultValue: 'open'
  },
  minParticipants: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2
  },
  maxParticipants: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  currentParticipants: {
    type: DataTypes.INTEGER,
    defaultValue: 1
  },
  targetAmount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    comment: 'Target amount to achieve bulk discount'
  },
  currentAmount: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  discountRate: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Discount rate if target is achieved'
  },
  deadline: {
    type: DataTypes.DATE,
    allowNull: false,
    comment: 'Deadline for joining the group order'
  },
  deliveryDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  locationRadius: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 5,
    comment: 'Radius in km for nearby vendors to join'
  },
  latitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = GroupOrder; 