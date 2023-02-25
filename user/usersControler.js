const express = require('express');
const router = express.Router()
const User = require('./User')


router.get('/admin/users', (req, res) =>{
    res.send('listagem usuarios')
});

router.get('/admin/users/create', (req, res) =>{
    res.render('admin/user/create')
})


router.post('/admin/user/criar', (req, res) =>{

    var email= req.body.email;
    var password = req.body.password;

    res.joson({email, password})
})

module.exports = router