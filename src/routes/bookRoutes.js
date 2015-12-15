var express = require('express');
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

	bookRouter.route('/').get(function(req, res) {
		res.render('bookListView', {
	    	title: 'Books',
	    	nav: nav,
		    books: books
	    });
	});

	bookRouter.route('/:id').get(function(req, res) {
		var id = req.params.id;
		
		res.render('bookView', {
	    	title: 'Book',
	    	nav: nav,
		    book: books[id]
	    });
	});
	
	return bookRouter;
};


module.exports = getRouter;