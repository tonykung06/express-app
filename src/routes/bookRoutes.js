var express = require('express');
var sql = require('mssql');

var books = [{
	title: 'Book 1',
	genre: 'genre 1',
	author: 'author 1',
	read: false
}, {
	title: 'Book 2',
	genre: 'genre 2',
	author: 'author 2',
	read: false
}, {
	title: 'Book 3',
	genre: 'genre 3',
	author: 'author 3',
	read: false
}, {
	title: 'Book 4',
	genre: 'genre 4',
	author: 'author 4',
	read: true
}, {
	title: 'Book 5',
	genre: 'genre 5',
	author: 'author 5',
	read: true
}, {
	title: 'Book 6',
	genre: 'genre 6',
	author: 'author 6',
	read: false
}];

var getRouter = function(nav) {
	var bookRouter = express.Router();

	bookRouter.use('/', express.static('public', {
		redirect: false
	}));

	bookRouter.route('/').get(function(req, res, next) {
		var request = new sql.Request();

		request.query('select * from tony_books', function(err, recordSet) {
			if (err) {
				return next(err);
			} else {
				res.render('bookListView', {
			    	title: 'Books',
			    	nav: nav,
				    books: recordSet
			    });
			}
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