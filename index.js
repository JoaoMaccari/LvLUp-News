const express = require("express");
const app = express();
const connection = require('./database/database');
const session = require('express-session');
const flash = require('express-flash');
const cookieParser = require('cookie-parser')


//routers
const categoriesController = require("./categories/categoriesControlers");
const articleController = require("./articles/articlesController");
const userController = require('./user/usersControler');

const Article = require ("./articles/Article");
const Category = require("./categories/Category");
const User = require('./user/User')

app.use(flash())
app.use(cookieParser('......'))
//session
//permite que eu crie uma sessão em qualquer parte do código
app.use(session({
    secret: "qualquercoisaaleatoria", 
    cookie: {maxAge: 30000},
    resave: false,
    saveUninitialized:true
}));

//static
app.use(express.static('public'));
app.set('view engine', 'ejs');


app.use(express.urlencoded({ limit: '50mb', extended: false, parameterLimit: 50000 }));
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
app.use('/', userController);

//rota que salva os dados da sessão
app.get('/session', (req, res)=>{
    req.session.treinamento = "formação node.js "
    res.send('sessão gerada')
})

//rota que lê os dados da sessão
app.get('/leitura', (req,res) =>{
    res.json({
        treinamento: req.session.treinamento
    })
})


app.get("/", (req, res) =>{


    var message =  req.flash('Success')
    message = (message == undefined || message.length == 0) ? undefined : message;

    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        //limit: 4
    }).then(articles => {

        Category.findAll().then(categories =>{

            res.render('index', {articles: articles, categories: categories, latestArticle: articles[1], message:message});
        });

    });
    
})

app.get('/:slug', (req, res) =>{
    var slug = req.params.slug;
    Article.findOne({
        where:{
            slug: slug
        }
    }).then(article =>{
        if(article != undefined){   
            Category.findAll().then( categories =>{
                res.render('article', {article: article, categories: categories, })
            })
            
        }else{
            res.redirect('/')
        }
    }).catch(err =>{
        res.redirect('/')
    })
});

app.get('/category/:slug', (req, res) =>{
    var slug = req.params.slug;
    Category.findOne({
        where:{
            slug: slug
        },
        include:[{model: Article}] 
    }).then(category =>{
        if(category != undefined){
            Category.findAll().then(categories =>{
                res.render('index', {articles: category.articles, categories: categories, });
            });
        }else{
            res.redirect('/')
        }
    }).catch(err =>{
        res.redirect('/')
    })
})


app.listen(8080, ()=>{
    console.log("Server rodando!");
})