const express = require("express")
const app = express();
const router = express.Router();
const Category = require("../categories/Category")
const Article = require("./Article")
const slugify = require("slugify")

const path = require("path")
const multer = require('multer')


const userAuth = require('../middleware/userAuth')
const adminAuth = require('../middleware/adminAuth');

const session = require('express-session');
const flash = require('express-flash');
const cookieParser = require('cookie-parser')


app.use(flash)
app.use(cookieParser('......'))
//session
//permite que eu crie uma sessão em qualquer parte do código
app.use(session({
    secret: "qualquercoisaaleatoria", 
    cookie: {maxAge: 30000},
    resave: false,
    saveUninitialized:true
}));




const storage = multer.memoryStorage({
    destination: function(req, file, cb){
        cb(null, "uploads/")
    },
    filename: function(req, file,cb){
        cb(null, file.originalname + Date.now() + path.extname(file.originalname))
    }
})



const upload = multer({storage})

//const uploadMultiple = upload.fields([{name: "file"}, {name: "file2"}])

router.get("/admin/articles", (req, res) =>{
    Article.findAll({
        include: [{model: Category}]
    }).then(articles  =>{
        res.render("admin/articles/index", {articles, articles})
    })
   
});

router.get("/admin/articles/new",(req, res) =>{
    Category.findAll().then(categories =>{

        var titleError = req.flash('titleError');
        var bodyError = req.flash('bodyError');
        var categoryError = req.flash('categoryError');
        var fileError = req.flash('fileError');

        var titulo = req.flash('titulo');
        var corpo = req.flash('corpo');
        var categoria = req.flash('categoria');
        var arquivo = req.flash('arquivo');

        titleError = (titleError == undefined || titleError.length == 0) ? undefined : titleError
        bodyError = (bodyError == undefined || bodyError.length == 0) ? undefined : bodyError
        categoryError = (categoryError == undefined || categoryError.length == 0) ? undefined : categoryError
        fileError = (fileError == undefined || fileError.length == 0) ? undefined : fileError

        // titulo = (titulo == undefined || titulo.length == 0)

        res.render("admin/articles/new", {categories: categories, bodyError, titleError, categoryError, fileError,  titulo, corpo, categoria, arquivo})
    })
    
});

router.post("/article/save", upload.single("file") ,(req,res ) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    var file = req.file.buffer.toString('base64')

    var titleError;
    var bodyError;
    var categoryError;
    var fileError;

    if(title == undefined || title == ""){
        titleError = "O titulo não pode ser vazio"
    }

    if(body == undefined || body == ""){
        bodyError = "O corpo não pode ser vazio"
    }

    if(category == undefined || category == ""){
        categoryError = "A categoria não pode ser vazia"
    }

    if(file == undefined || file == ""){
        fileError = "Upload de arquivos não pode ficar vazio"
    }

    
    if(titleError != undefined || bodyError != undefined || categoryError != undefined || fileError != undefined ){
       req.flash('titleError', titleError);
       req.flash('bodyError', bodyError);
       req.flash('categoryError', categoryError);
       req.flash('fileError', fileError);

       req.flash('titulo', title);
       req.flash('corpo', body);
       req.flash('categoria', category);
       req.flash('arquivo', file)

       res.redirect('/admin/articles/new')
    }else{
        

        
        Article.create({
            title:title,
            slug:slugify(title),
            body: body,
            capa_artigo:file,
            categoryId: category


        }).then(() =>{
            res.redirect("/admin/articles");
        }).catch(erro =>{
            console.log(erro)
    }) 
    }   
    

})

router.post("/articles/delete", (req, res) =>{
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){

            Article.destroy({
                where:{
                    id: id
                }
            }).then(()=>{
                res.redirect("/admin/articles")
            })
        }else{
            res.redirect("/admin/articles");
        }
    }else{  
        res.redirect("/admin/articles");
    }
});




router.get('/admin/articles/edit/:id', (req, res) =>{
    var id = req.params.id;
    Article.findByPk(id).then(article =>{
        if(article != undefined){

            Category.findAll().then(categories =>{
                
                res.render('admin/articles/edit', {categories: categories, article:article})
            })
            
        }else{
            res.redirect('/')
        }
    }).catch(err =>{
        res.redirect('/')
    });
});


router.post('/articles/update', upload.single('file'), (req, res) =>{
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    var file = req.file.buffer.toString('base64')

    Article.update({title:title, body:body, categoryId:category, slug:slugify(title), capa_artigo:file},{
        where: {
            id:id
        }
    }).then(() =>{
        res.redirect('/admin/articles');
    }).catch(err =>{
        res.redirect('/');
    })
});

router.get('/articles/page/:num', (req, res) =>{
    var page = req.params.num;
    var offset = 0;

    if(isNaN(page) || page ==1 ){
        offset = 0;
    }else{
        offset = (parseInt(page) - 1) *4;
    }
    
    Article.findAndCountAll({
        limit:4,
        offset: 8

    }).then(articles =>{

        var next;
        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next = true;
        }

        var result ={
            next: next,
            articles : articles
        }

        Category.findAll().then(categories =>{
            res.render('admin/articles/page', {result: result, categories: categories})
        })

        
    })
})

module.exports = router;

