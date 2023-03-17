const express = require('express');
const app = express();
const { json } = require('sequelize');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');

const userAuth = require('../middleware/userAuth')

const jwt = require('jsonwebtoken');
const jwtSecret = 'segredo'


const session = require('express-session');
const flash = require('express-flash');
const cookieParser = require('cookie-parser')


app.use(flash)
app.use(cookieParser('......'))
app.use(session({
    secret: "qualquercoisaaleatoria", 
    cookie: {maxAge: 30000},
    resave: false,
    saveUninitialized:true
}));


router.get('/admin/users', (req, res) =>{
   
    User.findAll().then(usuarios =>{
        res.render('admin/users/index', {usuarios:usuarios})
    })
    
});

router.get('/admin/users/create', (req, res) =>{

    var emailError = req.flash('emailError');
    var passwordError = req.flash('passwordError');
    var emailJaCadastrado = req.flash('emailJaCadastrado')
    
    var email = req.flash('email');
    var senha = req.flash('senha');

    emailError = (emailError == undefined || emailError.length == 0) ? undefined : emailError
    passwordError = (passwordError == undefined || passwordError.length == 0) ? undefined : passwordError
    emailJaCadastrado = (emailJaCadastrado == undefined || emailJaCadastrado.length == 0) ? undefined : emailJaCadastrado

    
   
    res.render('admin/users/create', {emailError: emailError, passwordError:passwordError, emailJaCadastrado:emailJaCadastrado, email, senha})
})


router.post('/admin/user/criar', (req, res) =>{

    var email= req.body.email;
    var password = req.body.password;

    

    var emailError;
    var passwordError;

    if( email == undefined || email == ""){
       emailError = "O email não pode ser vazio"
    }
    
    if( password == undefined || password == ""){
        passwordError = "A senha não pode ser vazia"
    }

    
    if(emailError != undefined || passwordError != undefined ){
        req.flash('emailError', emailError);
        req.flash('passwordError', passwordError);
       
 
        req.flash('email', email);
        req.flash('senha', password);
       
 
        res.redirect('/admin/users/create')
    }else{

        User.findOne({where:{email:email}}).then(user =>{
            if(user == undefined){
    
    
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(password, salt)
            
                User.create({
                    email: email,
                    password: hash
                }).then(() =>{
                    //req.flash('Success', 'Usuário criado com sucesso')
                    res.redirect('/');
                }).catch((err =>{
                    res.redirect('/')
                }))
    
            }else{

                //res.send(json({msg: 'ja existe um usuario cadastrado com este email'}))
                var emailJaCadastrado = "Já existe um usuário cadastrado com este e-mail"
                 req.flash('emailJaCadastrado', emailJaCadastrado)

                res.redirect('/admin/users/create')
            }
        })
    }

   
})


router.get('/login', (req, res) =>{

    var emailError = req.flash('emailError');
    var passwordError = req.flash('passwordError');
    var emailInvalido = req.flash('emailInvalido');
    var senhaIncorreta = req.flash('senhaIncorreta');
    console.log(senhaIncorreta)

    var email = req.flash('email');
    var senha = req.flash('senha');

    emailError = (emailError == undefined || emailError.length == 0) ? undefined : emailError;
    passwordError = (passwordError == undefined || passwordError.length == 0) ? undefined : passwordError;
    emailInvalido = (emailInvalido == undefined || emailInvalido.length == 0) ? undefined : emailInvalido;
    senhaIncorreta = (senhaIncorreta == undefined || senhaIncorreta.length == 0) ? undefined : senhaIncorreta;

    res.render('admin/users/login', {emailError:emailError, passwordError:passwordError, emailInvalido:emailInvalido, senhaIncorreta:senhaIncorreta, email, senha});
})

router.post('/authenticate', (req, res)=>{
    var email = req.body.email;
    var password = req.body.password

    var emailError;
    var passwordError;

    if( email == undefined || email == ""){
       emailError = "Insira um E-mail"
    }
    
    if( password == undefined || password == ""){
        passwordError = "Insira uma senha"
    }

    
    if(emailError != undefined || passwordError != undefined ){
        req.flash('emailError', emailError);
        req.flash('passwordError', passwordError);
       
 
        req.flash('email', email);
        req.flash('senha', password);
       
 
        res.redirect('/login')
    }else{

        User.findOne({where:{email:email}}).then(user =>{
            if(user != undefined){ // se existe um usuario com este email
    
                //valida senha
                var correct = bcrypt.compareSync(password , user.password);
    
                //se a senha for correta é criada uma sessão para o usuario com seu id e email
                if(correct){
                    let token = jwt.sign({user: user}, jwtSecret,{expiresIn: "48h"})
    
                    req.session.user ={
                        id: user.id,
                        email: user.email,
                        token: token
                    }
                    //res.json(req.session.user)
                    
                }else{
                    
                   
                    //res.status(401).json({msg: "senha incorreta"})
                    var senhaIncorreta = "Senha incorreta"
                    req.flash("senhaIncorreta",senhaIncorreta)
                    res.redirect('/login')
                }
    
            }else{
                //res.status(404).json({msg: "usuario não encontrado"});
                
                var emailInvalido = "Não foi encontrado nenhum usuário com este email"

                 req.flash('emailInvalido', emailInvalido)
                 res.redirect('/login')
            }
        })
    }


    

});


router.get('/logout', (req, res) =>{
    req.session.user = undefined;
    res.redirect('/')
})

module.exports = router