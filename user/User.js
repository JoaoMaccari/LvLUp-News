const Sequelize = require("sequelize");
const connection = require("../database/database")

const User = connection.define('users', {
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },password: {
        type: Sequelize.STRING,
        allowNull: false
    }
})


//força a criação da tabela mesmo que exista
//se estiver false ele não cria caso a tabela já exista
//User.sync({force:true});

module.exports = User;