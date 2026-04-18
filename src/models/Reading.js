const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Reading = sequelize.define('Reading', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    meterId: { type: DataTypes.UUID, allowNull: false },
    readingType: { type: DataTypes.ENUM('instantaneous', 'interval', 'daily', 'monthly') },
    activeEnergy: { type: DataTypes.DECIMAL(12, 4), allowNull: false },
    reactiveEnergy: { type: DataTypes.DECIMAL(12, 4) },
    apparentEnergy: { type: DataTypes.DECIMAL(12, 4) },
    voltage: { type: DataTypes.FLOAT },
    current: { type: DataTypes.FLOAT },
    powerFactor: { type: DataTypes.FLOAT },
    frequency: { type: DataTypes.FLOAT },
    power: { type: DataTypes.FLOAT },
    timestamp: { type: DataTypes.DATE, allowNull: false, index: true },
    receivedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    metadata: { type: DataTypes.JSONB },
  }, { tableName: 'readings', timestamps: false });

  return Reading;
};