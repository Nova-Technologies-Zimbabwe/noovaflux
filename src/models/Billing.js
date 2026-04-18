const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Billing = sequelize.define('Billing', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    meterId: { type: DataTypes.UUID, allowNull: false },
    billingPeriod: { type: DataTypes.STRING(20), allowNull: false },
    startDate: { type: DataTypes.DATE, allowNull: false },
    endDate: { type: DataTypes.DATE, allowNull: false },
    previousReading: { type: DataTypes.DECIMAL(12, 4) },
    currentReading: { type: DataTypes.DECIMAL(12, 4) },
    consumption: { type: DataTypes.DECIMAL(12, 4), allowNull: false },
    tariff: { type: DataTypes.DECIMAL(8, 4) },
    amount: { type: DataTypes.DECIMAL(12, 2), allowNull: false },
    peakConsumption: { type: DataTypes.DECIMAL(12, 4) },
    offPeakConsumption: { type: DataTypes.DECIMAL(12, 4) },
    status: { type: DataTypes.ENUM('pending', 'paid', 'overdue', 'disputed'), defaultValue: 'pending' },
    paidAt: { type: DataTypes.DATE },
    dueDate: { type: DataTypes.DATE },
    metadata: { type: DataTypes.JSONB },
  }, { tableName: 'billings', timestamps: true });

  return Billing;
};