const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Region = sequelize.define('Region', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING(10), unique: true, allowNull: false },
    country: { type: DataTypes.STRING(50), defaultValue: 'Zimbabwe' },
    timezone: { type: DataTypes.STRING(50), defaultValue: 'Africa/Harare' },
    population: { type: DataTypes.INTEGER },
    status: { type: DataTypes.ENUM('active', 'inactive', 'maintenance'), defaultValue: 'active' },
    metadata: { type: DataTypes.JSONB },
  }, { tableName: 'regions', timestamps: true });

  return Region;
};