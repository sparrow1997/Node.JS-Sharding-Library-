var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;

vai=0;

router.post('/', (req, res) => {
console.log("1");
console.log(req.body.update_email);
console.log(req.body.email);
	for(i=0;i<global.num_shard; i++)
	{

console.log("3");
		MongoClient.connect('mongodb://localhost/'+global.current_database+i, (err, database) => {
  if (err) return console.log(err)
  database.collection('quotes')
  .findOneAndUpdate({email: req.body.update_email}, {
    $set: {
      fname: req.body.fname,
      lname: req.body.lname,
      number: req.body.number,
      email: req.body.email
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
  })	
	}
	
});
  
module.exports = router;