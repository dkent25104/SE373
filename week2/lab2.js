var express = require("express");
var path = require("path");
var hbs = require("hbs");
var app = express();

hbs.registerPartials(__dirname + '/views/partials');

app.use(express.urlencoded());
app.use(express.static(__dirname));
app.set('view engine', 'hbs');

app.get("/index", (req,res)=>{
    res.render("L2index.hbs", {});
});

app.get("/about", (req,res)=>{
    res.render("about.hbs", {});
});

app.get("/form", (req,res)=>{
    res.render("form.hbs", {});
});

app.all("/L2results", (req,res)=>{
    res.render("L2results.hbs", {name:req.body.name, email:req.body.email, comments:req.body.comments});
});

app.listen(3000, ()=>{console.log("server running on port 3000")});