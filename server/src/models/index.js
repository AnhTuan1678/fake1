const fs = require('fs');
const path = require('path');
const sequelize = require('../config/database');
const db = {};

fs.readdirSync(__dirname).forEach((file) => {
  if (file !== 'index.js' && file.endsWith('.js')) {
    const model = require(path.join(__dirname, file));
    db[model.name] = model;
  }
});

(async () => {
  await sequelize.sync({ alter: false });
  console.log('All tables are ready!');
})();

db.sequelize = sequelize;
db.Sequelize = require('sequelize');

module.exports = db;
