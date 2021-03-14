const express=require('express');
const bodyParser=require('body-parser');
const path=require('path');
var engines = require('consolidate');
const fs = require('fs');

var myApp=express();

myApp.set('views',path.join(__dirname,'views'));

myApp.engine('html', engines.mustache);
myApp.set('view engine', 'ejs');

myApp.use(bodyParser.urlencoded({extended:true}));
myApp.use(express.static(__dirname+'/public'));


myApp.get('/',(req,res)=>{
     let rawdata = fs.readFileSync('data.json');
     let data = JSON.parse(rawdata);
     console.log(data);
     res.render('index',{data:data});
});

myApp.listen(process.env.PORT || 5000)
console.log('Click http://localhost:5000');