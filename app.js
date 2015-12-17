var express = require('express');
var app = express();
var sql = require('mssql');
var config = {
    user: process.env.MSSQLUSER || 'fake-user',
    password: process.env.MSSQLPWD || 'fake-pwd',
    server: 'db.tonykung.info',
    database: 'Books',
    options: {
        encrypt: true
    }
};

console.dir(config);

sql.connect(config, function(err) {
    if (err) {
        console.log('sql server connection error...');
        console.dir(err);
    }
});

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

app.use('/', express.static('public'));
app.get('/', function(req, res, next) {
    res.render('index', {
    	title: 'Main',
    	nav: nav
    });
});
app.use('/books', bookRouter);

app.use(function(err, req, res, next) {
    console.log('final error handler...');
    console.error(err);
    res.sendStatus(500);
});

app.listen(port, function(err) {
    if (!err) {
        console.log('running express server on port ' + port);
    }
});
