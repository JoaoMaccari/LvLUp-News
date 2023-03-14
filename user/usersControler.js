const express = require('express');
const { json } = require('sequelize');
const router = express.Router();
const User = require('./User');
const bcrypt = require('bcryptjs');

const userAuth = require('../middleware/userAuth')

const jwt = require('jsonwebtoken');
const jwtSecret = 'segredo'

router.get('/admin/users', (req, res) =>{
   
    User.findAll().then(usuarios =>{
        res.render('admin/users/index', {usuarios:usuarios})
    })
    
});

router.get('/admin/users/create', (req, res) =>{
    res.render('admin/users/create')
})


router.post('/admin/user/criar', (req, res) =>{

    var email= req.body.email;
    var password = req.body.password;

    User.findOne({where:{email:email}}).then(user =>{
        if(user == undefined){


            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt)
        
            User.create({
                email: email,
                password: hash
            }).then(() =>{
                res.redirect('/');
            }).catch((err =>{
                res.redirect('/')
            }))

        }else{
            res.redirect('/admin/users/create')
        }
    })
   
})


router.get('/login', (req, res) =>{
    res.render('admin/users/login');
})

router.post('/authenticate', (req, res)=>{
    var email = req.body.email;
    var password = req.body.password

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
                res.status(401).json({msg: "senha incorreta"})
                //res.json({err: "O E-mail enviado é invalido"})
                //res.redirect('/login')
            }

        }else{
            res.status(404).json({msg: "usuario não encontrado"});
            
            //res.redirect('/login')
        }
    })
});


router.get('/logout', (req, res) =>{
    req.session.user = undefined;
    res.redirect('/')
})

module.exports = router