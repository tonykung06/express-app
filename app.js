var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var filter = require('content-filter');

var app = express();
var sql = require('mssql');
var config = {
    user: process.env.EXPRESS_APP_MSSQL_USER || 'fake-user',
    password: process.env.EXPRESS_APP_MSSQL_PWD || 'fake-pwd',
    server: 'db.tonykung.info',
    database: 'Books',
    options: {
        encrypt: true
    }
};

sql.connect(config, function(err) {
    if (err) {
        console.log('sql server connection error...');
        console.dir(err);
    }
});

var port = process.env.EXPRESS_APP_PORT || 3000;
var nav = [{
	link: 'books',
	text: 'Books'
}, {
	link: 'authors',
	text: 'Authors'
}];
var bookRouter = require('./src/routes/bookRoutes')(nav);
var authorRouter = require('./src/routes/authorRoutes')(nav);
var adminRouter = require('./src/routes/adminRoutes')(nav);
var authRouter = require('./src/routes/authRoutes')();
var handlebars = require('express-handlebars');

app.disable('x-powered-by');
app.engine('hbs', handlebars({
	extname: 'hbs'
}));
app.set('views', './src/views');
app.set('view engine', 'ejs');

app.use('/', express.static('public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(filter({
    typeList: ['string', 'object', 'function']
}));
app.use(cookieParser());
app.use(session({
    secret: process.env.EXPRESS_APP_SESSION_SECRET || 'library'
}));
require('./src/configs/passport')(app);

app.get('/', function(req, res) {
    res.render('index', {
    	title: 'Main',
    	nav: nav
    });
});
app.use('/books', bookRouter);
app.use('/authors', authorRouter);
// app.use('/admin', adminRouter);
app.use('/auth', authRouter);

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
