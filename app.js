var express = require('express');

var app = express();

app.disable('x-powered-by');

var port = process.env.PORT || 5000;

app.use(express.static('public'));
app.set('views', './src/views');

var handlebars = require('express-handlebars');
app.engine('hbs', handlebars({
	extname: 'hbs'
}));

app.set('view engine', 'ejs');

app.get('/', function(req, res, next) {
    res.render('index', {
    	title: 'hello',
    	nav: [{
    		link: 'books',
    		text: 'Books'
    	}, {
    		link: 'authors',
    		text: 'Authors'
	    }]
    });
});

app.get('/books', function(req, res, next) {
    res.send('Hello Books');
});

app.listen(port, function(err) {
    if (!err) {
        console.log('running express server on port ' + port);
    }
});
