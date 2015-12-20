var LocalStrategy = require('passport-local').Strategy;
var mongodbClient = require('mongodb').MongoClient;
var appConfigs = require('../app');

module.exports = function(passport) {
	passport.use(new LocalStrategy({
		usernameField: 'userName',
		passwordField: 'password'
	}, function(userName, password, done) {
		var url = 'mongodb://localhost:' + (appConfigs.MONGODB_PORT) + '/libraryApp';

		mongodbClient.connect(url, function(err, db) {
			var userCollection = db.collection('users');

			userCollection.findOne({
				userName: userName
			}, function(err, result) {
				if (result.password !== password) {
					done(null, false, {
						message: 'bad username or password'
					});
				} else {
					var user = result;
					done(null, user);
				}
			});
		});
	}));
};
