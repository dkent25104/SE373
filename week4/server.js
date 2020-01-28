const express = require('express');
const hbs = require('hbs');
const app = express();

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:false}));

hbs.registerHelper('ptag', (num, words)=>{
    var str = '';
    for(let i = 0; i < num; i++) {
        str += '<p>';
        str += words
        str += '</p>';
    }
    return new hbs.handlebars.SafeString(str);
});

function rando(req, res, next) {
    req.num = Math.round(Math.random() * 25);
    next();     //will get hung up if not included
}
app.use(rando);

app.get('/',/* rando,*/ (req,res)=>{   //add function in middle to use only in that get
    res.render('index', {name:"Dan", numbo:req.num});
});

app.get('/animals/:type/:color', (req,res)=>{   //use : for variables
    res.render('index', {name:req.params.type, color:req.params.color});    //use req.params. to get variables from url
});

app.use((req,res,next)=>{
    req.error = new Error('Page not found');
    req.error.status = 404;
    next();
});

app.use((req,res,next)=>{
    res.status(req.error.status || 500);
    next();
});

app.get('/*', (req,res)=>{  //any other request goes to this
    res.render('error');
});

app.listen(3000, ()=>{console.log("Server running on localhost:3000")});