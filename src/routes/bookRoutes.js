var express = require('express');
var BookController = require('../controllers/BookController');

var getRouter = function(nav) {
	var bookController = BookController(nav);
	var bookRouter = express.Router();

	bookRouter.use('/', express.static('public', {
		redirect: false
	}));

	bookRouter.use(bookController.authenticate);
	bookRouter.route('/').get(bookController.getIndex);
	bookRouter.route('/:id').all(bookController.getById).get(bookController.renderBook);
	
	return bookRouter;
};


module.exports = getRouter;