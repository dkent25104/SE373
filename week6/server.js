const express = require('express');
require('./db/mongoose/mongoose');
const hbs = require('hbs');
const app = express();

let User = require('./db/models/User');

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:false}));

app.get('/', (req,res)=>{
    res.render('index')
});

app.post('/users', (req,res)=>{
    var user = new User(req.body);

    user.save().then(()=>{
        res.render('results', {name:req.body.name, email:req.body.email})
    }).catch((e)=>{
        res.status(400).send(e)
    })
});

app.post('/results', (req,res)=>{
    res.render('results', {name:req.body.name, email:req.body.email})
});

app.listen(3000, ()=>{console.log("Running on port 3000")});