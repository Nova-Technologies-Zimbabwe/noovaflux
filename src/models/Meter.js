const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Meter = sequelize.define('Meter', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    serialNumber: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    meterNumber: { type: DataTypes.STRING(20), unique: true },
    transformerId: { type: DataTypes.UUID },
    regionId: { type: DataTypes.UUID, allowNull: false },
    userId: { type: DataTypes.UUID },
    meterType: { type: DataTypes.ENUM('prepaid', 'postpaid', 'smart', 'bulk') },
    manufacturer: { type: DataTypes.STRING(50) },
    model: { type: DataTypes.STRING(50) },
    firmwareVersion: { type: DataTypes.STRING(20) },
    status: { type: DataTypes.ENUM('active', 'inactive', 'disconnected', 'tampered', 'fault'), defaultValue: 'active' },
    balance: { type: DataTypes.DECIMAL(12, 2), defaultValue: 0 },
    tariff: { type: DataTypes.STRING(20), defaultValue: 'standard' },
    isRemoteDisconnect: { type: DataTypes.BOOLEAN, defaultValue: true },
    installationDate: { type: DataTypes.DATE },
    latitude: { type: DataTypes.FLOAT },
    longitude: { type: DataTypes.FLOAT },
    metadata: { type: DataTypes.JSONB },
  }, { tableName: 'meters', timestamps: true });

  return Meter;
};