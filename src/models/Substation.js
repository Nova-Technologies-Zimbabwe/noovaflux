const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Substation = sequelize.define('Substation', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    code: { type: DataTypes.STRING(20), unique: true, allowNull: false },
    regionId: { type: DataTypes.UUID, allowNull: false },
    voltageLevel: { type: DataTypes.ENUM('33kV', '66kV', '110kV', '220kV', '400kV') },
    capacity: { type: DataTypes.FLOAT },
    latitude: { type: DataTypes.FLOAT },
    longitude: { type: DataTypes.FLOAT },
    status: { type: DataTypes.ENUM('active', 'inactive', 'maintenance', 'fault'), defaultValue: 'active' },
    lastMaintenance: { type: DataTypes.DATE },
    metadata: { type: DataTypes.JSONB },
  }, { tableName: 'substations', timestamps: true });

  return Substation;
};