var express = require('express');
var router = express.Router();


var db
const MongoClient = require('mongodb').MongoClient


router.get('/', function(req, res, next) {
	MongoClient.connect('mongodb://localhost/'+global.current_database+rr, (err, database) => {
  if (err) return console.log(err)
  db = database
  
})
  db.collection('quotes').find().toArray((err, result) => {
    if (err) return console.log(err)
    // renders index.ejs
    res.render('index.ejs', {quotes: result})
  })
});
module.exports = router;