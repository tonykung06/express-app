var express = require('express');

var getRouter = function(nav) {
	var authorRouter = express.Router();

	authorRouter.use('/', express.static('public', {
		redirect: false
	}));

	authorRouter.route('/').get(function(req, res, next) {
		// var request = new sql.Request();

		// request.query('select * from tony_books', function(err, recordSet) {
		// 	if (err) {
		// 		return next(err);
		// 	} else {
		// 		res.render('bookListView', {
		// 	    	title: 'Books',
		// 	    	nav: nav,
		// 		    books: recordSet
		// 	    });
		// 	}
		// });
	});

	authorRouter.route('/:id').all(function(req, res, next) {
		// var ps = new sql.PreparedStatement();

		// ps.input('id', sql.Int);
		// ps.prepare('select * from tony_books where id = @id', function(err) {
		// 	if (err) {
		// 		console.log('preparing statement ERROR');
		// 		return next(err);
		// 	}

		// 	ps.execute({
		// 		id: req.params.id
		// 	}, function(err, recordSet) {
		// 		if (err || recordSet.length < 1) {
		// 			console.log('record set error......');
		// 			return next(new Error('no this book'));
		// 		}

		// 		//used in view rendering
		// 		res.locals.book = recordSet[0];
		// 		return next();
		// 	});
		// });
	}).get(function(req, res, next) {
		// res.render('bookView', {
	 //    	title: 'Book',
	 //    	nav: nav
	 //    });
	});
	
	return authorRouter;
};


module.exports = getRouter;