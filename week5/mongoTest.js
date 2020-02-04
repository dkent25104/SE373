const mongodb = require('mongodb');
const MC = mongodb.MongoClient;

const connectionUrl = 'mongodb://127.0.0.1:27017';
const databaseName = 'SE373';

MC.connect(connectionUrl, {useUnifiedTopology: true, useNewUrlParser:true}, function(error, client)
{
    if(error)
    {
        return console.log('Unable to connect to database!');
    }

    const db = client.db(databaseName);

    db.collection('users').insertMany([{
        name:'Jay',
        age:40
    },{
        name:'Dan',
        age:21
    },{
        name:'Bartholomew McWilliamssonbergfieldO\'Sullivan',
        age:85
    }]);

    db.collection('states').insertMany([{
        name:'Rhode Island',
        capitol:'Providence',
        population:1060000
    },{
        name:'Wisconsin',
        capitol:'Madison',
        population:5814000
    },{
        name:'Colorado',
        capitol:'Denver',
        population:5696000
    }]);
    console.log('added');
});