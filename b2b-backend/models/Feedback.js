const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Feedback = sequelize.define('feedback', {
  feedback_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: 'feedback_id'
  },
  from_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'from_user_id',
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  to_user_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'to_user_id',
    references: {
      model: 'users',
      key: 'user_id'
    }
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: true,
    field: 'rating',
    validate: {
      min: 1,
      max: 5
    }
  },
  comment: {
    type: DataTypes.TEXT,
    allowNull: true,
    field: 'comment'
  }
}, {
  tableName: 'feedback',
  timestamps: false
});

module.exports = Feedback; 