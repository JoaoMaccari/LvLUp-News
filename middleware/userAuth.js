const jwt = require('jsonwebtoken')

const jwtSecret = 'segredo'

function userAuth(req, res, next){

    
    const authToken = req.headers['authorization'];

    if(authToken != undefined){

        const  bear = authToken.split(' ');
        var token = bear[1];

        jwt.verify(token, jwtSecret, (err, data) =>{
            if(err){
                res.status(401);
                res.json({err: 'token invalido'})
            }else{
                req.token = token
                req.loggedUser = {id: data.id, email: data.email}
                console.log(data)
                console.log('token capturado')
                next();
            }
        })

    }else{
        res.status(401);
        res.json({err: 'token invalido'})
    }
    console.log(authToken);
    
}

module.exports = userAuth;