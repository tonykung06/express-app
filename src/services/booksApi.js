var http = require('http');
var xml2jsParser = require('xml2js').Parser({
	explicitArray: false
});
var goodReadApiKey = require('../configs/app').GOOD_READS_API_KEY;

var retrieveBookDetails = function(data) {
	return data.GoodreadsResponse ? data.GoodreadsResponse.book : null;
};

module.exports = {
	getBookById: function(id, callback) {
		var data = {};

		http.request({
			host: 'www.goodreads.com',
			path: '/book/show/' + id + '?format=xml&key=' + goodReadApiKey
		}, function(response) {
			var data = '';

			response.on('data', function(chunk) {
				data += chunk;
			});

			response.on('end', function() {
				xml2jsParser.parseString(data, function(err, result) {
					if (!err) {
						callback(null, retrieveBookDetails(result));
					}
				});
			});
		}).end();
	}
};