var express = require('express');

var app = express();

var port = 5000;

app.listen(port, function(err) {
	if (!err) {
		console.log('running express server on port ' + port);
	}
});