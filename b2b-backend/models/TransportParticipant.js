const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const TransportParticipant = sequelize.define('TransportParticipant', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  transportId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Transports',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  },
  orderId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'Orders',
      key: 'id'
    },
    comment: 'Associated order if applicable'
  },
  pickupLocation: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  pickupLatitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  pickupLongitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  dropLocation: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  dropLatitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  dropLongitude: {
    type: DataTypes.FLOAT,
    allowNull: false
  },
  cargoWeight: {
    type: DataTypes.FLOAT,
    allowNull: false,
    comment: 'Weight of cargo in kg'
  },
  cargoVolume: {
    type: DataTypes.FLOAT,
    allowNull: true,
    comment: 'Volume of cargo in cubic meters'
  },
  costShare: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    comment: 'Share of the transport cost'
  },
  status: {
    type: DataTypes.ENUM('pending', 'confirmed', 'cancelled'),
    defaultValue: 'pending'
  },
  joinedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

module.exports = TransportParticipant; 