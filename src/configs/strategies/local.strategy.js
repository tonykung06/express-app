var LocalStrategy = require('passport-local').Strategy;
var mongodbClient = require('mongodb').MongoClient;

module.exports = function(passport) {
	passport.use(new LocalStrategy({
		usernameField: 'userName',
		passwordField: 'password'
	}, function(userName, password, done) {
		var url = 'mongodb://localhost:' + (process.env.EXPRESS_APP_MONGODB_PORT || 27017) + '/libraryApp';

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
