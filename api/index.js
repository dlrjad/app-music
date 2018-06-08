'use strict'

var mongoose = require('mongoose');
var app = require('./app');
var port = process.env.port || 3977;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/curso_mean2', (err, res) => {
    if(err){
        throw err;
    }else{
        console.log("Conexión establecida a la base de datos...");
        
        app.listen(port, function(){
            console.log("Servidor api rest escuchando http://localhost:"+port);
        });
    }
});
