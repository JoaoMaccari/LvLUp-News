const express = require("express");
const app = express;

app.length("/", (req, res) =>{
    res.send("bem vindo ao site")
})


app.listen(8080, ()=>{
    console.log("Server rodando!")
})