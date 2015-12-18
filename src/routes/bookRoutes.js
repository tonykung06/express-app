var express = require('express');
var sql = require('mssql');
var mongodbClient = require('mongodb').MongoClient;

var getRouter = function(nav) {
	var bookRouter = express.Router();

	bookRouter.use('/', express.static('public', {
		redirect: false
	}));

	bookRouter.route('/').get(function(req, res, next) {
		var request = new sql.Request();
		var mongoDbUrl = 'mongodb://localhost:55555/libraryApp';
		var results = [];
		var count = 2;
		var doneFetchAllDataCb = function(data) {
			--count;
			results = results.concat(data);

			if (count === 0) {
				res.render('bookListView', {
			    	title: 'Books',
			    	nav: nav,
				    books: results
			    });
			}
		};

		mongodbClient.connect(mongoDbUrl, function(err, db) {
			if (err) {
				return next(err);
			}

			var bookCollection = db.collection('books');

			bookCollection.find({}).toArray(function(err, results) {
				if (err) {
					return next(err);
				}

				doneFetchAllDataCb(results);
			});
		});

		request.query('select * from tony_books', function(err, recordSet) {
			if (err) {
				return next(err);
			}

			doneFetchAllDataCb(recordSet);
		});
	});

	bookRouter.route('/:id').all(function(req, res, next) {
		var ps = new sql.PreparedStatement();

		ps.input('id', sql.Int);
		ps.prepare('select * from tony_books where id = @id', function(err) {
			if (err) {
				console.log('preparing statement ERROR');
				return next(err);
			}

			ps.execute({
				id: req.params.id
			}, function(err, recordSet) {
				if (err || recordSet.length < 1) {
					console.log('record set error......');
					return next(new Error('no this book'));
				}

				//used in view rendering
				res.locals.book = recordSet[0];
				return next();
			});
		});
	}).get(function(req, res, next) {
		res.render('bookView', {
	    	title: 'Book',
	    	nav: nav
	    });
	});
	
	return bookRouter;
};


module.exports = getRouter;