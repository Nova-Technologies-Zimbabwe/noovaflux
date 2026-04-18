const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transformer = sequelize.define('Transformer', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    serialNumber: { type: DataTypes.STRING(50), unique: true, allowNull: false },
    substationId: { type: DataTypes.UUID },
    regionId: { type: DataTypes.UUID, allowNull: false },
    type: { type: DataTypes.ENUM('distribution', 'step-up', 'step-down') },
    capacity: { type: DataTypes.FLOAT },
    ratedPower: { type: DataTypes.FLOAT },
    latitude: { type: DataTypes.FLOAT },
    longitude: { type: DataTypes.FLOAT },
    installationDate: { type: DataTypes.DATE },
    status: { type: DataTypes.ENUM('active', 'inactive', 'maintenance', 'fault', 'stolen'), defaultValue: 'active' },
    metadata: { type: DataTypes.JSONB },
  }, { tableName: 'transformers', timestamps: true });

  return Transformer;
};