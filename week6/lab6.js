const express = require('express');
require('./db/mongoose/mongoose');
const hbs = require('hbs');
const app = express();
const mongoose = require('mongoose');

let Employee = require('./db/models/Employee');

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:false}));
mongoose.set('useFindAndModify', false);

const Empl = mongoose.model('Employee', exports.Employee);

hbs.registerAsyncHelper('loadDocuments', (id, cb)=>{
    var str = '';
    
    Empl.find({}, (err,employees)=>{
        for (let i = 0; i < employees.length; i++) {
            var fDate = new Date(employees[i].startDate).toISOString().slice(0,10);
            str += '<tr>';
            str += '<td>' + employees[i].firstName + '</td>';
            str += '<td>' + employees[i].lastName + '</td>';
            str += '<td>' + employees[i].department + '</td>';
            str += '<td>' + fDate + '</td>';
            str += '<td>' + employees[i].jobTitle + '</td>';
            str += '<td>$' + employees[i].salary + '</td>';
            str += '<td><a href="/update/?id=' + employees[i].id + '">Update</a></td>';
            str += '<td><a href="/delete/?id=' + employees[i].id + '">Delete</a></td>';
            str += '</tr>';
        }
        cb(new hbs.handlebars.SafeString(str));
    });
});

hbs.registerHelper('selectOptions', (selected)=>{
    var departments = ['Accounting', 'Sales', 'Marketing', 'IT'];
    var str = '';
    for(let i = 0; i < departments.length; i++) {
        str += '<option';
        if (departments[i] == selected) {
            str += ' selected>';
        } else {
            str += '>';
        }
        str += departments[i];
        str += '</option>';
    }
    return new hbs.handlebars.SafeString(str);
});

app.get('/', (req,res)=>{
    res.render('l6index');
});

app.get('/index', (req,res)=>{
    res.render('l6index');
});

app.post('/index', (req,res)=>{
    var employee = new Employee(req.body);

    employee.save().then(()=>{
        res.render('view');
    }).catch((e)=>{
        res.status(400).send(e);
    });
});

app.get('/view', (req,res)=>{
    res.render('view');
});

app.get('/update/*', (req,res)=>{
    var id = req.query.id;
    Empl.find({_id: id}, (err, docs)=>{
        var fDate = docs[0].startDate.toISOString().slice(0,10);
        res.render('update', {employee: docs[0], date: fDate});
    });
});

app.post('/update', (req,res)=>{
    Empl.findByIdAndUpdate(
        { _id: req.body.id }, { firstName: req.body.firstName, lastName: req.body.lastName,
            department: req.body.department, startDate: req.body.startDate,
            jobTitle: req.body.jobTitle, salary: req.body.salary}, (err, result)=>{
            if (err) {
                res.send(err);
            } else {
                res.render('view');
            }
        }
    );
});

app.get('/delete/*', (req,res)=>{
    var id = req.query.id;

    Empl.findOneAndRemove({_id: id}).exec();

    res.render('delete');
});

app.listen(3000, ()=>{console.log("Running on port 3000")});