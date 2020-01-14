var express = require("express");
//var path = require("path");
var hbs = require("hbs");
var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.use(express.urlencoded());
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'hbs');

app.get("/index", (req,res)=>{   //or function(){} instead of ()=>{}
    //res.sendFile(path.join(__dirname, "/public/index.html"));
    res.render("index.hbs", {junk:"My name is Bobert."});
});

app.all("/results", (req,res)=>{   //or function(){} instead of ()=>{}
    //res.sendFile(path.join(__dirname, "/public/index.html"));
    res.render("results.hbs", {first:req.body.first, last:req.body.last});
});

app.listen(3000, ()=>{console.log("server running on port 3000")});