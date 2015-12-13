var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var jscsStylish = require('gulp-jscs-stylish');
var nodemon = require('gulp-nodemon');

var jsFiles = ['*.js', 'src/**/*.js'];

gulp.task('style', function() {
    return gulp.src(jsFiles)
        .pipe(jshint())
        .pipe(jshint.reporter('jshint-stylish', {
            verbose: true
        }))
        .pipe(jscs())
        .pipe(jscsStylish());
});

gulp.task('inject', function() {
    var wiredep = require('wiredep').stream;
    var inject = require('gulp-inject');
    var wiredepOpts = {
        bowerJson: require('./bower.json'),
        directory: './public/lib',
        ignorePath: '../../public/'
    };
    var injectSrc = gulp.src(['./public/css/*.css', './public/js/*.js'], {
        read: false
    });

    var injectOpts = {
        ignorePath: '../../public/',
        relative: true
    };

    return gulp.src('src/views/*.html')
        .pipe(wiredep(wiredepOpts))
        .pipe(inject(injectSrc, injectOpts))
        .pipe(gulp.dest('./src/views'));
});

//both style and inject will be run async
gulp.task('serve', ['style', 'inject'], function() {
    var opts = {
        script: 'app.js',
        delayTime: 1,
        env: {
            'PORT': 3000
        },
        watch: jsFiles
    };

    return nodemon(opts).on('restart', function(e) {
        console.log('nodemon is restarting nodejs app...');
    });
});
