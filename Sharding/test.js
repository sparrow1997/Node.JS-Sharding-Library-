var express = require('express');
var bodyParser = require('body-parser');
var app=express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/qw',(req,res)=>{
	console.log(req.body);

	console.log(req.body.hi);
	console.log("heyy ");
});

app.listen(3001);