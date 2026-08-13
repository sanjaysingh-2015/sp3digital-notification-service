const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const LeadMessage = sequelize.define(
  'LeadMessage',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    industry_id: {
      type: DataTypes.BIGINT,
      allowNull: true,
      references: {
        model: 'industries', // Use table name string to prevent circular dependency
        key: 'id',
      },
    },
    company: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    expected_timeline: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(256),
      allowNull: true,
    },
    phone_number: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    current_challenge: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    additional_info: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'NEW',
    },
    created_by: {
      type: DataTypes.STRING(255),
      defaultValue: 'NOTIFICATION_SERVICE',
    },
    modified_by: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'leads_messages',
    createdAt: 'created_on',
    updatedAt: 'modified_on',
  }
);

module.exports = LeadMessage;