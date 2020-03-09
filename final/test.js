const express = require('express');
const hbs = require('hbs');
const app = express();
const Database = require('arangojs').Database;
const db = new Database('http://127.0.0.1:8529');

//console.log(db);

app.set('view engine', 'hbs');
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:false}));

app.get('/', (req,res)=>{
    res.render('index');

    //create database
    // db.createDatabase('test').then(
    //     () => console.log('Database created'),
    //     err => console.error('Failed to create database:', err)
    // );

    //switch database
    db.useDatabase('final');
    //console.log(db);

    db.useBasicAuth('DanKent', 'DKentFinal');

    //create collection variable
    collection = db.collection('testCollection');

    //document
    doc = {
    _key: 'firstDocument',
    a: 'foo',
    b: 'bar',
    c: Date()
    };

    //create collection
    // collection.create().then(() => {
    //     console.log('Collection created')

        //save document
        collection.save(doc).then(
            meta => console.log('Document saved:', meta._rev),
            err => console.error('Failed to save document:', err)
        );

        //update document
        // collection.update('firstDocument', {d: 'qux'}).then(
        //     meta => console.log('Document updated:', meta._rev),
        //     err => console.error('Failed to update document:', err)
        // );

        //fetch document
        collection.document('firstDocument').then(
            doc => console.log('Document:', JSON.stringify(doc, null, 2)),
            err => console.error('Failed to fetch document:', err)
        );

        //remove document
        // collection.remove('firstDocument').then(
        //     () => console.log('Document removed'),
        //     err => console.error('Failed to remove document', err)
        // );

    // }, err => console.error('Failed to create collection:', err)
    // );
});

app.listen(3000, ()=>{console.log("Running on port 3000")});