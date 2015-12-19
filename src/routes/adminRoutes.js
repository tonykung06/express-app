var express = require('express');
var mongodbClient = require('mongodb').MongoClient;

var getRouter = function(nav) {
	var adminRouter = express.Router();

	adminRouter.route('/addBooks').get(function(req, res) {
		var url = 'mongodb://localhost:' + (process.env.MONGODBPORT || 27017) + '/libraryApp';

		mongodbClient.connect(url, function(err, db) {
			var collection = db.collection('books');

			//creat a new array in memory to avoid mongodbClient generating duplicated ObjectID						
			var books = [{
				title: 'mongodb - Book 1 test',
				genre: 'genre 1 test',
				author: 'author 1 test',
				read: false
			}, {
				title: 'mongodb - Book 2 test',
				genre: 'genre 2 test',
				author: 'author 2 test',
				read: false
			}, {
				title: 'mongodb - Book 3 test',
				genre: 'genre 3 test',
				author: 'author 3 test',
				read: false
			}, {
				title: 'mongodb - Book 4 test',
				genre: 'genre 4 test',
				author: 'author 4 test',
				read: true
			}, {
				title: 'mongodb - Book 5 test',
				genre: 'genre 5 test',
				author: 'author 5 test',
				read: true
			}, {
				title: 'mongodb - Book 6 test',
				genre: 'genre 6 test',
				author: 'author 6 test',
				read: false
			}];

			collection.insertMany(books, function(err, results) {
				db.close();
				res.send(results);
			});
		});
	});
	
	return adminRouter;
};


module.exports = getRouter;