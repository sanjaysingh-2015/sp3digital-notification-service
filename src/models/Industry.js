const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Industry = sequelize.define(
  'Industry',
  {
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true,
    },
    code: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING(20),
      defaultValue: 'ACTIVE',
    },
    created_by: {
      type: DataTypes.STRING(255),
      defaultValue: 'SYSTEM',
    },
    modified_by: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
  },
  {
    tableName: 'industries',
    createdAt: 'created_on',
    updatedAt: 'modified_on',
  }
);

module.exports = Industry;