var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient
/* GET home page. */
router.get('/', function(req, res, next) {
res.render('createDB.ejs');
});
router.post('/', function(req, res, next) {

	console.log(req.body.dbname+" "+req.body.shard)
	global.current_database = req.body.dbname;
	global.num_shard = req.body.shard
	global.rr=0
	MongoClient.connect('mongodb://localhost/DBindex', (err, database) => {
	  if (err) return console.log(err)
	  var db
	  db = database
	  db.collection('DBshard').save(req.body, (err, result) => {
	    if (err) return console.log(err)
		console.log('saved to database')
	    res.redirect('/')
	  })
	})
	// db.close()
	  
});

module.exports = router;


