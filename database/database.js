
const Sequelize = require("sequelize");

const Connection = new Sequelize('blog', 'root', 'meuservidor', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '-03:00'
});

module.exports = Connection;