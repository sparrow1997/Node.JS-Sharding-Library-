var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
var db

router.post('/', function(req, res, next) {
 console.log('Hellooooooooooooooooo!')
  console.log(req.body);
  global.rr+=1
  global.rr=rr%global.num_shard
  console.log(global.current_database +"/"+global.rr)
  url='mongodb://localhost/'+global.current_database+rr
  console.log(url)

  MongoClient.connect(url, (err, database) => {
  if (err) return console.log(err)
  // db = database
  
  database.collection('quotes').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database :P')
    res.redirect('/')
  })
  })

});
module.exports = router;