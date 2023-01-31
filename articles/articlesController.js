const express = require("express")
const router = express.Router();

router.get("/articles", (req, res) =>{
    res.send("rota artigos");
});

router.get("/admin/articles/new", (req, res) =>{
    res.send("rota para criar um novo artigo");
});

module.exports = router;