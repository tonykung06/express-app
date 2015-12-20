var express = require('express');
var mongodbClient = require('mongodb').MongoClient;
var passport = require('passport');
var appConfigs = require('../configs/app');

var getRouter = function() {
	var authRouter = express.Router();

	authRouter.route('/signIn').post(passport.authenticate('local', {
		failureRedirect: '../'
	}), function(req, res) {
		res.redirect('./profile');
	});
	
	authRouter.route('/signUp').post(function(req, res, next) {
		var url = 'mongodb://localhost:' + (appConfigs.MONGODB_PORT) + '/libraryApp';

		mongodbClient.connect(url, function(err, db) {
			var userCollection = db.collection('users');
			var user = {
				userName: req.body.userName,
				password: req.body.password
			};

			userCollection.findOne({
				userName: user.userName
			}, function(err, result) {
				if (err || result) {
					return next(new Error('cannot create the user'));
				}

				userCollection.insert(user, function(err, results) {
					req.login(results.ops[0], function() {
						res.redirect('./profile');
					});
				});
			});
		});
	});

	authRouter.route('/profile').all(function(req, res, next) {
		if (!req.user) {
			res.redirect('../');
			return;
		}

		next();
	}).get(function(req, res) {
		res.json(req.user);
	});

	return authRouter;
};

module.exports = getRouter;