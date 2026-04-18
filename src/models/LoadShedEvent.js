const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const LoadShedEvent = sequelize.define('LoadShedEvent', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    stage: { type: DataTypes.INTEGER, allowNull: false },
    regionId: { type: DataTypes.UUID },
    startTime: { type: DataTypes.DATE, allowNull: false },
    endTime: { type: DataTypes.DATE },
    targetLoadReduction: { type: DataTypes.FLOAT },
    actualLoadReduction: { type: DataTypes.FLOAT },
    status: { type: DataTypes.ENUM('scheduled', 'active', 'completed', 'cancelled'), defaultValue: 'scheduled' },
    priority: { type: DataTypes.ENUM('critical', 'high', 'medium', 'low'), defaultValue: 'medium' },
    reason: { type: DataTypes.TEXT },
    initiatedBy: { type: DataTypes.UUID },
    metadata: { type: DataTypes.JSONB },
  }, { tableName: 'load_shed_events', timestamps: true });

  return LoadShedEvent;
};