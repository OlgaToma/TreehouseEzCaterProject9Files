const env = process.env.NODE_ENV || 'development';
const dbConf = require(__dirname + '/config/config.json')[env];
const { Sequelize } = require('sequelize');

console.log(dbConf);

// // Option 2: Passing parameters separately (sqlite)
// const sequelize = new Sequelize({
//   dialect: dbConf.dialect,
//   storage: dbConf.storage
// });

// sequelize.authenticate();