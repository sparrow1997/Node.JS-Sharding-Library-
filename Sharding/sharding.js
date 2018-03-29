/*
..............................................................................................................................

.......................................AUTHOR : PRABHAT SHUKLA , SHRITI ARORA, MAYUR AGGARWAL.................................
..............................................................................................................................
....................................................DESCRIPTION...............................................................
The present Library/functions perform sharding in a mongoDB database with all the CRUD operations. User/Developer interacts 
with the required functions and methods as if it's dealing with just the single database as usual, the library written by 
us takes care of all the redundancy, and the internal functioning of the MonggoDB database and the connectivity.

The Sharded DATABASE can be present on a single computer or multiple systems as required or desired by the user. Not 
limited to this, the SHARDED DATABASE can be present anywhere around the world and hence further helping the situation of localized 
database and also eliminating the bottle neck situation if exists in a network

To use the required library just immport the following into an file and use the required functions as just normal.
*/












/*............................................................................................................................
..............................................................................................................................
.......................Initialising required global variables and importing required files and librarys.......................
..............................................................................................................................
..............................................................................................................................
*/
const MongoClient = require('mongodb').MongoClient;
global.hostdb = "localhost";
global.presentShard=-1;













/*............................................................................................................................
..............................................................................................................................
insertDocument function four parameters as arguements :-
	db: MongoClient connection object.
	collection_name: Name of the collection to insert the document into.
	data: Data to insert into the requored collection and database.
	callback: Callback functionn returns the returned data by insertOne function.
..............................................................................................................................
..............................................................................................................................
*/
function insertDocument( db, collection_name, data, callback){
	console.log("collection_name"+collection_name);
	db.collection(collection_name).insertOne(data,
		function(err, result){
		console.log("Inserted a document into the "+collection_name+" collection.");
		callback(result);
		}); 
}






/*............................................................................................................................
..............................................................................................................................
findDocument function accepts four parameters as arguements in which everyone is compulsary :-
	db: MongoClinet connection object.
	collection_name: Name of the collection to insert the document into.
	query: Query to find the object from, should be in Javascript JSON object.
	cal: Callback function returns the result by the fins function and the required query.
..............................................................................................................................
..............................................................................................................................
*/
function findDocument( db, collection_name, query, cal){
	console.log("Inside findDocument");
	console.log(JSON.parse(query));
	db.collection(collection_name).find(JSON.parse(query)).toArray(function(err, result){
		if (err) throw err;
		// numRows = result.length;
		console.log("result is = ",result);
		db.close();
	    return cal(result);

	});
	
}









/*............................................................................................................................
..............................................................................................................................
ifExists function accepts three parameters as arguements :-
	dbName: Database name to check if the database is present in the index or not for further execution.
	bool: Can take two values 0 or 1 which defines the callback by the given function -
		1=> Callback returns 1 if the dbname entry is present in the Index else returns 0.
		0=> Callback returns the object returned by the find function, contains data of the found document.
	callack: Callback function returns boolean value 0 or 1 or and object as depends on the variable bool.

No prerequists to execute the folloeing function
..............................................................................................................................
..............................................................................................................................
*/
function ifExists( dbName, bool ,callback ){
	console.log("Inside ifExists");
	var MongoClient = require('mongodb').MongoClient;
	var assert = require('assert');
	var ObjectId = require('mongodb').ObjectID;
	var url = 'mongodb://'+global.hostdb+'/DBindex';

	var query = '{ "dbName":"'+dbName+'" }';
	console.log("query=", query);
	var res="";
	MongoClient.connect(url, function(err, db) {
	  assert.equal(null, err);
	  findDocument(db, "dbInfo", query , function(r) {
	  	  	
	  	  	if(bool == 1)
	  	  	{
	  	  		if(r.length > 0){
	  	  		   	callback(1);
	  	  		}
	  	  		else{
	  	  			callback(0);
	  	  		}
	  	  	}
	  	  	else
	  	  	{
	  	  		callback(r);
	  	  	}
    	db.close();
	  });
	  console.log("Query Executed");
	  db.close();
	});	



}






/*............................................................................................................................
..............................................................................................................................
selectDatabase function accepts two parmeters as arguements :-
	dbName: Name of the database to be selected
	callback: Callback function returns object

This function initializes the gloaal varibles with the required data.
..............................................................................................................................
..............................................................................................................................
*/
function selectDatabase( dbName , callback){

	ifExists( dbName,0, function(res){
		if(res == 0){
			global.currentDb = 'undefined';
			ret = {success:"False", message:"No database by the name exists, create one to proceed"};	
			callback(ret);
		}
		else{
			console.log(res);
			global.currentDb = dbName;
			global.host = res[0].host;
			global.numShards = res[0].numShards;
			console.log("host=", global.host, global.numShards);
			var len = global.host.length;
			  	  	if(len<numShards){
			  	  		for (var i = len; i < numShards; i++) {
				  	  		global.host.push(global.host[i%len]);			  	  			
			  	  		}
			  	  	}
			ret = {success:"True", message:"Databse present and successfully selected"};
			callback(ret);	
		}
	});
}








/*............................................................................................................................
..............................................................................................................................
createDatabse function accepts 5 parameterrs as arguements :-
	dbName: Name of the database to be created.
	host: Javascipt list with the IP addresses of the hosts.
	hostdb: IP address of the hostdb which will contain all the indexes etc.
	numShards: Number of shards to divide the databse into.
	callback: Callback function returns an object.
..............................................................................................................................
..............................................................................................................................
*/
function createDatabase( dbName, host, hostdb, numShards, callback) {


	console.log("Inside createDatabase");
	if(typeof dbName === 'undefined')
	{
		err="Lack of arguements. No database name passed.";
	}
	if(typeof numShards === 'undefined')
	{
		numShards = 1;
	}
	if(typeof host === 'undefined')
	{
		host = "localhost:27017";
	}
	if(typeof hostdb === 'undefined')
	{
		hostdb = "localhost:27017";
	}

	global.hostdb = hostdb;

	ifExists(dbName,1, function(res){
		if(res==1){
			console.log("Database already present");
		ret = {success:"False", message: "Database by the given name already present. Choose a new name to continue."};	
		callback(ret);
		}
		else{
			console.log("Database not present");

			var MongoClient = require('mongodb').MongoClient;
			var assert = require('assert');
			var ObjectId = require('mongodb').ObjectID;
			var url = 'mongodb://'+global.hostdb+':27017/DBindex';

			var obj = {dbName:dbName, host:host, numShards:numShards};
			console.log("Object to be inserted=",obj);

			MongoClient.connect(url, function(err, db) {
			  assert.equal(null, err);
			  insertDocument(db, "dbInfo", obj, function(res) {
			  	// console.log(res);
			      db.close();
			  });
			});
			ret = {success:"True", message:"Database created successfully with the required hosts."};
			callback(ret);
		}
	});
}









/*............................................................................................................................
..............................................................................................................................
insert function accepts 3 parameters as arguements :-
	query: Query to be executed to insert data, to be in javascript JSON object.
	collection_name: Name of the collection to insert the document into.
	callback: Callback function returns result object.
..............................................................................................................................
..............................................................................................................................
*/
function insert( query, collection_name, callback){
	
	global.presentShard = global.presentShard+1;
	global.presentShard = global.presentShard % global.numShards;

	var url = 'mongodb://'+global.host[global.presentShard]+'/'+global.currentDb+'_'+global.presentShard;
		
	
		MongoClient.connect(url, function(err, db) {

			insertDocument(db, collection_name, JSON.parse(query), function(res){
				console.log("Inserted successfully");
				callback(res);
			});
			
		});
	
}








/*............................................................................................................................
..............................................................................................................................
insertData function accepts 3 parameters as arguements :-
	query: Query to be executed to insert data, to be in javascript JSON object.
	collection_name: Name of the collection to insert the document into.
	callback: Callback function returns result object.
..............................................................................................................................
..............................................................................................................................
*/
function insertData( query, collection_name, callback){
	console.log("inside insertData");
	if( global.currentDb === 'undefined'){
		console.log("undefined currentDb");
		err = "No database selected, select a databse to insert data into.";
		callback(err);
	}
	else{
		console.log("currentDb set", global.host);
  	  	insert( query, collection_name, function(res2){
  	  		console.log("back to insertData")
  	  		callback(res2);
  	  	})

	}
}









/*............................................................................................................................
..............................................................................................................................
syncRecursivefind function accepts 4 parameters as arguements :-
	i: Iterator, signifies the sard number to start from.
	collection_name: Collection name to find the data into.
	query: Query to find data with the help of which.
	callback: Callback function returns result.

This function is the utility function for synchronous execution of the fund()
..............................................................................................................................
..............................................................................................................................
*/
function syncRecursiveFind(i,collection_name,query, callback){
	if(i==global.numShards){
		callback([]);
	}
	else{
		syncRecursiveFind(i+1,collection_name,query, function(res){
			var url = 'mongodb://'+global.host[i]+'/'+global.currentDb+'_'+i;
			MongoClient.connect(url, function(err,db){

			findDocument(db, collection_name, query, function(res2){
				console.log("first response=",res2[0]);
				res.push(res2);
				callback(res);
			});
		});
			// callback()
		});
	}
}









/*............................................................................................................................
..............................................................................................................................
find function accepts 3 parameters as arguements :-
	query: query with the help of which to search the database.
	collection_name: Name of the collection to insert data into.
	callback: Callback function returns result.
..............................................................................................................................
..............................................................................................................................
*/
function find( query, collection_name, callback){
	console.log("Inside find");
	// var result;
	// console.log(global.numShards);
	syncRecursiveFind(0,collection_name,query,function(res){
		console.log("Final response=", res);
	});
	

	// callback(result);

}

// function syncRecursiveFindOneHost( i, collection_name, query, host, callback){
// 	if(i==global.numShards){
// 		callback([]);
// 	}
// 	else{
// 		syncRecursiveFind(i+1,collection_name,query, function(res){
// 			var url = 'mongodb://'+global.host[i]+'/'+global.currentDb+'_'+i;
// 			MongoClient.connect(url, function(err,db){

// 			findDocument(db, collection_name, query, function(res2){
// 				console.log("first response=",res2[0]);
// 				res.push(res2);
// 				callback(res);
// 			});
// 		});
// 			// callback()
// 		});
// 	}

// }









/*............................................................................................................................
..............................................................................................................................
findOneHost function accepts 4 parameters as arguements :-
	query: query with the help of which to search the database.
	collection_name: Name of the collection to insert data into.
	host: IP address of the host to search data from.
	callback: Callback function returns result.
..............................................................................................................................
..............................................................................................................................
*/
function findOneHost( query, collection_name, host, callback){
	console.log("Inside findOne");
	var url = 'mongodb://'+host+'/'+global.currentDb+'_'+i;
			MongoClient.connect(url, function(err,db){

			findDocument(db, collection_name, query, function(res2){
				console.log("first response=",res2[0]);
				res.push(res2);
				callback(res);
			});
		});

}










/*............................................................................................................................
..............................................................................................................................
updateDocumentOne function accepts 5 parameters as arguements :-
	db: MongoClient connection object retured after connecting to database.
	myquery: query with the help of which to search the database, should be of JavaScript JSON object.
	newvalues: newvalues to insert into the databae, should be of JavaScript JSON object.
	collection_name: Name of the collection to insert data into.
	callback: Callback function returns result.
..............................................................................................................................
..............................................................................................................................
*/
function updateDocumentOne(db,myquery, newvalues,collection_name, callback){
	console.log("Inside updateDocumentOne");
	 db.collection(collection_name).updateOne(myquery, newvalues, function(err, res) {
	    if (err) throw err;
	    console.log("1 document updated");
	    callback(res);
	    db.close();
	  });
}













/*............................................................................................................................
..............................................................................................................................
syncRecursiveUpdate function accepts 5 parameters as arguements :-
	i: Iterator, signifies the sard number to start from.
	myquery: query with the help of which to search the database, should be of JavaScript JSON object.
	newvalues: newvalues to insert into the databae, should be of JavaScript JSON object.
	collection_name: Name of the collection to insert data into.
	callback: Callback function returns result.
..............................................................................................................................
..............................................................................................................................
*/
function syncRecursiveUpdate(i, myquery, newvalues, collection_name, callback){
	console.log("Inside syncRecursiveUpdate");
	if(i==global.numShards){
		callback([]);
	}
	else{
		syncRecursiveUpdate(i+1,myquery,newvalues,collection_name, function(res){
			var url = 'mongodb://'+global.host[i]+'/'+global.currentDb+'_'+i;
			MongoClient.connect(url, function(err,db){

			updateDocumentOne(db, myquery, newvalues, collection_name, function(res2){
				console.log("first response=",res2);
				res.push(res2);
				callback(res);
			});
		});
			// callback()
		});
	}
}
















/*............................................................................................................................
..............................................................................................................................
updateDocumentAll function accepts 5 parameters as arguements :-
	myquery: query with the help of which to search the database, should be of JavaScript JSON object.
	newvalues: newvalues to insert into the databae, should be of JavaScript JSON object.
	collection_name: Name of the collection to insert data into.
	callback: Callback function returns result.
..............................................................................................................................
..............................................................................................................................
*/
function updateDocumentAll( myquery, newvalues, collection_name, callback){
	console.log("inside updateDocumentAll");
	syncRecursiveUpdate(0, myquery, newvalues, collection_name, function(res){
		console.log(res);
	});
}










































// updateDocumentAll updates the document with the required query
// so here we're updating the document with name Shriti with neew data..
// selectDatabase("JIIT", function(res){
// 	query='{"name":"Shriti Arora"}';
// 	newvalues = '{"name":"Shruti Arora", "enrollment":"15803026", "branch":"CSE", "batch":"B-13"}';
// 	updateDocumentAll(JSON.parse(query), JSON.parse(newvalues), "student", function(res){
// 		console.log(res);
// 	});
// });




























//Find query finds and prints all the data with the following query
// so as we'ev updated the name shriti so we cannot find that in db
selectDatabase("JIIT", function(res){
	// but the new name was Shruti so searching for that..
find('{"name":"Shruti Arora"}', "student", function(res2){

	console.log("all documents=",res2);
});

});


// Hence  ALL THE CREATE, UPDATE, READ AND DELETE operations are working fine in our Sharding library fine

// Thanks..

// Group members..

// Prabhat Shukla
// Shriti Arora
// Mayur Agarwal

// ;)
















//Name of the DATABASE: JIIT Noida
//IP addresses of the Mongodb servers to save the mongo SHARDS: localhost, 192.168.43.142	
// Creating a data base for jiit with three shards..
// createDatabase( "JIIT", ['localhost'], "localhost", 3, function(res){
// 	console.log(res);
// });


































// Inserting data into JIIT database and student document..
// selectDatabase("JIIT", function(res){
// 	query = '{"name":"Prabhat Shukla", "enrollment":"15803012", "branch":"Ingt. CSE", "batch":"B-13"}';
// 	insertData( query, 'student', function(res2){
// 		console.log("back to main 1");
// 		return 1;
// 	});
// 	query = '{"name":"Shashank Thakur", "enrollment":"15803024", "branch":"Ingt. CSE", "batch":"B-13"}';
// 	insertData( query, 'student', function(res2){
// 		console.log("back to main 1");
// 		return 1;
// 	});
// 	query = '{"name":"Rohit Singhal", "enrollment":"15102125", "branch":"ECE", "batch":"A-5"}';
// 	insertData( query, 'student', function(res2){
// 		console.log("back to main 1");
// 		return 1;
// 	});
// 	query = '{"name":"Shriti Arora", "enrollment":"15803026", "branch":"CSE", "batch":"B-13"}';
// 	insertData( query, 'student', function(res2){
// 		console.log("back to main 1");
// 		return 1;
// 	});
// 	query = '{"name":"Vaibhav Thakur", "enrollment":"15102141", "branch":"ECE", "batch":"A4"}';
// 	insertData( query, 'student', function(res2){
// 		console.log("back to main 1");
// 		return 1;
// 	});
// 	console.log("Data inserted");
// });

console.log("ended");