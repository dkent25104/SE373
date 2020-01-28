const express = require('express');
const hbs = require('hbs');
const app = express();

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:false}));

hbs.registerHelper('selectNum', (selected)=>{
    var nums = [3,4,5,10,20];
    var str = '';
    for(let i = 0; i < nums.length; i++) {
        str += '<option';
        if (nums[i] == selected) {
            str += ' selected>';
        } else {
            str += '>';
        }
        str += nums[i];
        str += '</option>';
    }
    return new hbs.handlebars.SafeString(str);
});

hbs.registerHelper('generateGrid', (num)=>{
    var str = '<table>';
    for(let x = 0; x < num; x++) {
        str += '<tr>';
        for (let y = 0; y < num; y++) {
            var color = ('00000'+(Math.random()*(1<<24)|0).toString(16)).slice(-6).toUpperCase();
            str += '<td style="background-color:#' + color + ';">';
            str += color + '<br/><span style="color:#ffffff;">' + color;
            str += '</span></td>';
        }
        str += '</tr>';
    }
    str += '</table>';
    return new hbs.handlebars.SafeString(str);
});

app.all('/',(req,res)=>{
    res.render('L3index', {number:req.body.num});
});

app.listen(3000, ()=>{console.log("Server running on localhost:3000")});