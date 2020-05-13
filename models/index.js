const Sequelize = require('sequelize');
const sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: 'fsjstd-restapi.db',
});

const db = {};

// test connection to database
(async () => {
    try {
      await sequelize.authenticate();
      console.log('connection to the database was successful');
    }catch(err) {
      console.error('connection to the database failed', err);
    }
  }) ();

db.sequelize = sequelize;
db.Sequelize = Sequelize;
module.exports = db;

