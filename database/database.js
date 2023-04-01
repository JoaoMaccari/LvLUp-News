
const Sequelize = require("sequelize");

const Connection = new Sequelize('heroku_e13a5cdaa299e39', 'b5a70b2aa7a4af', 'f6f1614c', {
    host: 'us-cdbr-east-06.cleardb.net',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = Connection;