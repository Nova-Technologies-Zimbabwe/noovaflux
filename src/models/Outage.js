const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Outage = sequelize.define('Outage', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    type: { type: DataTypes.ENUM('scheduled', 'unscheduled', 'emergency') },
    entityType: { type: DataTypes.ENUM('meter', 'transformer', 'substation', 'feeder', 'region') },
    entityId: { type: DataTypes.UUID },
    regionId: { type: DataTypes.UUID },
    title: { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    startTime: { type: DataTypes.DATE, allowNull: false },
    expectedEndTime: { type: DataTypes.DATE },
    endTime: { type: DataTypes.DATE },
    affectedCustomers: { type: DataTypes.INTEGER, defaultValue: 0 },
    status: { type: DataTypes.ENUM('reported', 'confirmed', 'in_progress', 'resolved'), defaultValue: 'reported' },
    priority: { type: DataTypes.ENUM('critical', 'high', 'medium', 'low'), defaultValue: 'medium' },
    assignedTo: { type: DataTypes.UUID },
    metadata: { type: DataTypes.JSONB },
  }, { tableName: 'outages', timestamps: true });

  return Outage;
};