const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const SocialAnalysis = sequelize.define(
  'SocialAnalysis',
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    platform: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    message_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    sender: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    sentiment: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    keywords: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'social_analyses',
    createdAt: 'analyzed_at',
    updatedAt: false,
  }
);

module.exports = SocialAnalysis;