var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var users = require('./routes/users');
var createdb = require('./routes/createdb');
var index = require('./routes/index');
var quotes = require('./routes/quotes');
var showdb = require('./routes/showdb');
var updateDB =  require('./routes/updateDB');
var showupdateDB =  require('./routes/showupdateDB');

global.rr=0;
global.current_database="paras";	
global.num_shard=3;		
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('public'));
app.use(bodyParser.json());

app.use('/', index);
app.use('/users', users);
app.use('/showdb', showdb);
app.use('/quotes', quotes);
app.use('/createDB', createdb);
app.use('/updateDB', updateDB);
app.use('/showupdateDB', showupdateDB);

module.exports = app;



