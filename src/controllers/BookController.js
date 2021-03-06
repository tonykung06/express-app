var sql = require('mssql');
var mongodbClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var appConfigs = require('../configs/app');
var bookService = require('../services/booksApi');

var bookController = function(nav) {
	var authenticate = function(req, res, next) {
		if (!req.user) {
			res.redirect('../');
			return;
		}

		next();
	};

	var getIndex = function(req, res, next) {
		var request = new sql.Request();
		var mongoDbUrl = 'mongodb://localhost:' + (appConfigs.MONGODB_PORT) + '/libraryApp';
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

				results = results.map(function(item) {
					item.id = item._id;

					return item;
				});

				doneFetchAllDataCb(results);
			});
		});

		request.query('select * from tony_books', function(err, recordSet) {
			if (err) {
				return next(err);
			}

			doneFetchAllDataCb(recordSet);
		});
	};

	var getById = function(req, res, next) {
		var mongoDbUrl = 'mongodb://localhost:' + (appConfigs.MONGODB_PORT) + '/libraryApp';
		var ps = new sql.PreparedStatement();
		var doneFetchAllDataCb = function(data) {
			var book = data[0];

			if (book.apiBookId) {
				bookService.getBookById(book.apiBookId, function(err, bookDetails) {
					book = Object.assign({}, bookDetails, book);

					//used in view rendering
					res.locals.book = book;
					return next();
				});
			} else {
				//used in view rendering
				res.locals.book = book;
				return next();
			}
		};

		if (isNaN(Number(req.params.id))) {
			mongodbClient.connect(mongoDbUrl, function(err, db) {
				var id = new ObjectID(req.params.id);
				var collection = db.collection('books');

				collection.findOne({
					_id: id
				}, function(err, result) {
					doneFetchAllDataCb([result]);
				});
			});
		} else {
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

					doneFetchAllDataCb(recordSet);
				});
			});
		}
	};

	var renderBook = function(req, res) {
		res.render('bookView', {
	    	title: 'Book',
	    	nav: nav
	    });
	};

	return {
		getIndex: getIndex,
		getById: getById,
		renderBook: renderBook,
		authenticate: authenticate
	};
};

module.exports = bookController;
