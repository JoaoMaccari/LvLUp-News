
const Sequelize = require("sequelize");

const Connection = new Sequelize('blog', 'root', 'meuservidor', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = Connection;