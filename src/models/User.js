const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    username: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    phone: { type: DataTypes.STRING(20) },
    role: { type: DataTypes.ENUM('admin', 'operator', 'engineer', 'field_agent', 'consumer'), defaultValue: 'consumer' },
    regionId: { type: DataTypes.UUID },
    status: { type: DataTypes.ENUM('active', 'inactive', 'suspended'), defaultValue: 'active' },
    lastLogin: { type: DataTypes.DATE },
    metadata: { type: DataTypes.JSONB },
  }, { tableName: 'users', timestamps: true });

  return User;
};