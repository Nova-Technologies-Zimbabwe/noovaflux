const { Sequelize } = require('sequelize');
const config = require('../config');

const sequelize = new Sequelize(
  config.database.name,
  config.database.user,
  config.database.password,
  {
    host: config.database.host,
    port: config.database.port,
    dialect: 'postgres',
    logging: config.nodeEnv === 'development' ? console.log : false,
    pool: { max: 20, min: 5, acquire: 30000, idle: 10000 },
  }
);

const db = { sequelize, Sequelize };

db.Region = require('./Region')(sequelize);
db.Substation = require('./Substation')(sequelize);
db.Transformer = require('./Transformer')(sequelize);
db.Meter = require('./Meter')(sequelize);
db.User = require('./User')(sequelize);
db.Reading = require('./Reading')(sequelize);
db.Billing = require('./Billing')(sequelize);
db.Alert = require('./Alert')(sequelize);
db.Outage = require('./Outage')(sequelize);
db.LoadShedEvent = require('./LoadShedEvent')(sequelize);
db.RenewableSource = require('./RenewableSource')(sequelize);

db.Region.hasMany(db.Substation, { foreignKey: 'regionId', as: 'substations' });
db.Substation.belongsTo(db.Region, { foreignKey: 'regionId', as: 'region' });

db.Region.hasMany(db.Transformer, { foreignKey: 'regionId', as: 'transformers' });
db.Transformer.belongsTo(db.Region, { foreignKey: 'regionId', as: 'region' });

db.Substation.hasMany(db.Transformer, { foreignKey: 'substationId', as: 'transformers' });
db.Transformer.belongsTo(db.Substation, { foreignKey: 'substationId', as: 'substation' });

db.Region.hasMany(db.Meter, { foreignKey: 'regionId', as: 'meters' });
db.Meter.belongsTo(db.Region, { foreignKey: 'regionId', as: 'region' });

db.Transformer.hasMany(db.Meter, { foreignKey: 'transformerId', as: 'meters' });
db.Meter.belongsTo(db.Transformer, { foreignKey: 'transformerId', as: 'transformer' });

db.User.hasMany(db.Meter, { foreignKey: 'userId', as: 'meters' });
db.Meter.belongsTo(db.User, { foreignKey: 'userId', as: 'user' });

db.Meter.hasMany(db.Reading, { foreignKey: 'meterId', as: 'readings' });
db.Reading.belongsTo(db.Meter, { foreignKey: 'meterId', as: 'meter' });

db.Meter.hasMany(db.Billing, { foreignKey: 'meterId', as: 'billings' });
db.Billing.belongsTo(db.Meter, { foreignKey: 'meterId', as: 'meter' });

db.Region.hasMany(db.Outage, { foreignKey: 'regionId', as: 'outages' });
db.Outage.belongsTo(db.Region, { foreignKey: 'regionId', as: 'region' });

db.Region.hasMany(db.LoadShedEvent, { foreignKey: 'regionId', as: 'loadShedEvents' });
db.LoadShedEvent.belongsTo(db.Region, { foreignKey: 'regionId', as: 'region' });

db.Region.hasMany(db.RenewableSource, { foreignKey: 'regionId', as: 'renewableSources' });
db.RenewableSource.belongsTo(db.Region, { foreignKey: 'regionId', as: 'region' });

module.exports = db;