const express = require("express");
const app = express();
const connection = require('./database/database')

app.set('view engine', 'ejs');

app.use(express.static('public'))

app.use(express.urlencoded({extended: false}));
app.use(express.json());

connection
    .authenticate()
    .then(() =>{
        console.log('conexao com sucesso')
    }).catch((error) =>{
        console.log(error);
    })
    

app.get("/", (req, res) =>{
    res.render('index');
})

app.listen(8080, ()=>{
    console.log("Server rodando!");
})