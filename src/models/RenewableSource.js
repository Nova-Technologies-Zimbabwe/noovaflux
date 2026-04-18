const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const RenewableSource = sequelize.define('RenewableSource', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    sourceType: { type: DataTypes.ENUM('solar', 'wind', 'hydro', 'biomass', 'battery'), allowNull: false },
    regionId: { type: DataTypes.UUID },
    capacity: { type: DataTypes.FLOAT, allowNull: false },
    installedCapacity: { type: DataTypes.FLOAT },
    currentOutput: { type: DataTypes.FLOAT },
    latitude: { type: DataTypes.FLOAT },
    longitude: { type: DataTypes.FLOAT },
    gridConnection: { type: DataTypes.STRING(50) },
    status: { type: DataTypes.ENUM('active', 'inactive', 'maintenance', 'fault'), defaultValue: 'active' },
    metadata: { type: DataTypes.JSONB },
  }, { tableName: 'renewable_sources', timestamps: true });

  return RenewableSource;
};