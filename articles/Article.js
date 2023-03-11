const Sequelize = require("sequelize");
const connection = require("../database/database")

const Category = require("../categories/Category")

const Article = connection.define('articles', {
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    body:{
        type:Sequelize.TEXT,
        allowNull: false
    },
    capa_artigo:{
        type:Sequelize.BLOB,
        allowNull: true
    }
})



Category.hasMany(Article);
Article.belongsTo(Category);

//Article.sync({force:true})
module.exports = Article;