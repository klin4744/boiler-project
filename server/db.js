const Sequelize = require('sequelize');

const serverRoute =
   process.env.DATABASE_URL || 'postgres://localhost:5432/yourdbname';
const db = new Sequelize(serverRoute, {
   logging: false, // unless you like the logs
   // ...and there are many other options you may want to play with
});

// Make models

module.exports = db;
