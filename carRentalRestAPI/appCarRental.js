const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const util = require('util');
var bodyParser = require('body-parser');
const routes = require('./carsRoute.js')

var url = 'mongodb://localhost:27017/';
var connection = util.promisify(MongoClient.connect)(url);
var app = express();

//=======app configuration
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use(express.urlencoded({extended:true}));
app.enable('etag');


app.use('*',(req,resp,next)=>{
    req.conn = connection;
    return next();
});


app.use('/cars',routes);

//==========error handling middleware=======
app.use((err,req,resp,next)=>{
    var status = err.status || 500;
    resp.status(status).json({'error':'system error occured'});
});

app.listen(8090,()=>console.log('server running on port 8090'));