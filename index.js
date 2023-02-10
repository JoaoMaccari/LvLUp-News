const express = require("express");
const app = express();
const connection = require('./database/database');

//routers
const categoriesController = require("./categories/categoriesControlers");
const articleController = require("./articles/articlesController");

const Article = require ("./articles/Article")
const Category = require("./categories/Category")

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.urlencoded({extended: false}));
app.use(express.json());

connection
    .authenticate()
    .then(() =>{
        console.log('conexao com sucesso');
    }).catch((error) =>{
        console.log(error);
    })

app.use("/", categoriesController);

app.use("/", articleController);

app.get("/", (req, res) =>{
    Article.findAll({
        order: [
            ['id', 'DESC']
        ]
    }).then(articles => {
        res.render('index', {articles: articles});
    })
    
})

app.get('/:slug', (req, res) =>{
    var slug = req.params.slug;
    Article.findOne({
        where:{
            slug: slug
        }
    }).then(article =>{
        if(article != undefined){
            res.render("article", {article:article});
        }else{
            res.redirect("/");
        }
    }).catch(err =>{
        res.redirect('/')
    })
});

app.listen(8080, ()=>{
    console.log("Server rodando!");
})