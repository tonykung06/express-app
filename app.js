var express = require('express');

var app = express();

app.disable('x-powered-by');

var port = 5000;

app.use(express.static('public'));
app.use(express.static('src/views'));

app.get('/', function(req, res, next) {
	res.send('Hello World');
});

app.get('/books', function(req, res, next) {
	res.send('Hello Books');
});

app.listen(port, function(err) {
	if (!err) {
		console.log('running express server on port ' + port);
	}
});
