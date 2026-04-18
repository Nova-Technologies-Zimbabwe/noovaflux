const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Alert = sequelize.define('Alert', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    type: { type: DataTypes.ENUM('theft', 'tamper', 'overload', 'voltage', 'outage', 'fault', 'fraud', 'system'), allowNull: false },
    severity: { type: DataTypes.ENUM('critical', 'high', 'medium', 'low'), defaultValue: 'medium' },
    entityType: { type: DataTypes.ENUM('meter', 'transformer', 'substation', 'region', 'system') },
    entityId: { type: DataTypes.UUID },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    status: { type: DataTypes.ENUM('new', 'acknowledged', 'investigating', 'resolved', 'dismissed'), defaultValue: 'new' },
    acknowledgedBy: { type: DataTypes.UUID },
    resolvedAt: { type: DataTypes.DATE },
    metadata: { type: DataTypes.JSONB },
  }, { tableName: 'alerts', timestamps: true });

  return Alert;
};