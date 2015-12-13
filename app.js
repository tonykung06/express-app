var express = require('express');

var app = express();

var port = 5000;

app.get('/*', function(req, res, next) {
	res.send('nodejs app here...');
});

app.listen(port, function(err) {
	if (!err) {
		console.log('running express server on port ' + port);
	}
});
