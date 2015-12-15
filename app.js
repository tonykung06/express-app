var express = require('express');
var app = express();
var port = process.env.PORT || 5000;
var nav = [{
	link: 'books',
	text: 'Books'
}, {
	link: 'authors',
	text: 'Authors'
}];
var bookRouter = require('./src/routes/bookRoutes')(nav);
var handlebars = require('express-handlebars');

app.disable('x-powered-by');
app.engine('hbs', handlebars({
	extname: 'hbs'
}));
app.set('views', './src/views');
app.set('view engine', 'ejs');

// var staticConfig = { redirect: false, fallthrough: false };
// app.use('/books', express.static('public', staticConfig));
// app.use('/', express.static('public', staticConfig));
app.use('/', express.static('public'));
app.get('/', function(req, res, next) {
    res.render('index', {
    	title: 'Main',
    	nav: nav
    });
});
app.use('/books', bookRouter);

app.get('/books', function(req, res, next) {
    res.send('Hello Books');
});

app.listen(port, function(err) {
    if (!err) {
        console.log('running express server on port ' + port);
    }
});
