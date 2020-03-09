const express = require('express');
const hbs = require('hbs');
const app = express();
const Database = require('arangojs').Database;
const db = new Database('http://127.0.0.1:8529');
const moment = require('moment');

//console.log(db);

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:false}));

db.useDatabase('final');
db.useBasicAuth('DanKent', 'DKentFinal');
var collection = db.collection('projects');

hbs.registerAsyncHelper('displayProjects', (id,cb)=>{
    collection.all().then(
        doc => {
            var str = '';

            for(let i = 0; i < doc._result.length; i++) {
                str += '<tr><td class="long">';
                str += doc._result[i].name;
                str += '</td><td><a href="edit/?id=';
                str += doc._result[i]._key;
                str += '"><input type="submit" class="btn btn-warning" value="Edit" name="edit"></a></td><td><a href="delete/?id=';
                str += doc._result[i]._key;
                str += '"><input type="submit" class="btn btn-danger" value="Delete" name="delete"></a></td></tr>';
            }
            cb(new hbs.handlebars.SafeString(str));
        },
        err => {
            console.error('Failed to fetch document:', err);
        }
    );
    
});
hbs.registerAsyncHelper('displayClock', (id,cb)=>{
    collection.all().then(
        doc => {
            var str = '';

            for(let i = 0; i < doc._result.length; i++) {
                str += '<tr><td class="long">';
                str += doc._result[i].name;
                str += '</td><td>';
                str += doc._result[i].totalTime;
                str += ' Minutes</td><td>';
                str += doc._result[i].working;
                str += '</td><td><a href="';
                if (doc._result[i].working == true) {
                    str += 'clockout';
                } else {
                    str += 'clockin';
                }
                str += '/?id=';
                str += doc._result[i]._key;
                str += '"><input type="submit" class="btn btn-primary" value="';
                if (doc._result[i].working == true) {
                    str += 'Clock Out';
                } else {
                    str += 'Clock In';
                }
                str += '" name="';
                if (doc._result[i].working == true) {
                    str += 'clockOut';
                } else {
                    str += 'clockIn';
                }
                str += '" /></a></td></tr>';
            }
            cb(new hbs.handlebars.SafeString(str));
        },
        err => {
            console.error('Failed to fetch document:', err);
        }
    );
    
});

//Index actions
app.get('/', (req,res)=>{
    res.redirect('/index');
});
app.get('/index', (req,res)=>{
    res.render('index', {type: "Add"});
});

app.get('/edit/*', (req,res)=>{
    var id = req.query.id;
    //console.log(id);

    //find project, put name in textbox
    collection.document(id).then(
        doc => {
            console.log('Document:', JSON.stringify(doc, null, 2));
            var name = doc.name;

            res.render('index', {type: "Edit", name: name, cancel: new hbs.handlebars.SafeString('<a href="/index"><input type="button" class="btn btn-danger" value="Cancel"></a>')});
        },
        err => console.error('Failed to fetch document:', err)
    );
});

app.post('/edit/*', (req,res)=>{
    var id = req.query.id;

    //update project with id
    collection.update(id, {name: req.body.add}).then(
        meta => {
            console.log('Document updated:', meta._rev);
            res.redirect('/index');
        },
        err => console.error('Failed to update document:', err)
    );
});

app.get('/delete/*', (req,res)=>{
    var id = req.query.id;
    //console.log(id);

    collection.remove(id).then(
        () => {
            console.log('Document removed');
            res.redirect('/index');
        },
        err => console.error('Failed to remove document', err)
    );
});

app.post('/index', (req,res)=>{
    var doc = {
        name: req.body.add,
        totalTime: 0,
        working: false,
        clockInTime: ""
    }
    collection.save(doc).then(
        meta => {
            console.log('Document saved:', meta._rev);
            res.render('index');
        },
        err => console.error('Failed to save document:', err)
    );
});

//Timecard actions
app.get('/clock', (req,res)=>{
    res.render('clock');
});

app.get('/clockin/*', (req,res)=>{
    var id = req.query.id;

    collection.update(id, {working: true, clockInTime: moment().format()}).then(
        meta => {
            console.log('Document updated:', meta._rev);
            res.redirect('/clock');
        },
        err => console.error('Failed to update document:', err)
    );
});

app.get('/clockout/*', (req,res)=>{
    var id = req.query.id;

    collection.document(id).then(
        doc => {
            console.log('Document:', JSON.stringify(doc, null, 2));
            var start = moment().format(doc.clockInTime);
            var end = moment().format();
            //console.log(start);
            //console.log(end);
            var differ = moment(end).diff(start, 'minutes');
            console.log(differ);
            var total = parseInt(doc.totalTime);
            console.log(doc.totalTime);
            total += parseInt(differ);

            collection.update(id, {working: false, totalTime: total, clockInTime: ""}).then(
                meta => {
                    console.log('Document updated:', meta._rev);
                    res.redirect('/clock');
                },
                err => console.error('Failed to update document:', err)
            );
        },
        err => console.error('Failed to fetch document:', err)
    );
});

app.listen(3000, ()=>{console.log("Running on port 3000")});