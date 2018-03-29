var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient
var db
router.get('/', function(req, res, next) {

	
    res.render('updateDB.ejs')
  
})
  

module.exports = router;