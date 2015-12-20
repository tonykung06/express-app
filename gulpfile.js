var gulp = require('gulp');
var jshint = require('gulp-jshint');
var jscs = require('gulp-jscs');
var jscsStylish = require('gulp-jscs-stylish');
var nodemon = require('gulp-nodemon');
var fs = require('fs');

var jsFiles = ['*.js', 'src/**/*.js'];

gulp.task('prepareConfigs', function() {
    var sampleConfigFile = './src/configs/app-sample.js';
    var configFile = './src/configs/app.js';

    fs.exists(configFile, function (exists) {
        if (!exists) {
            // fs.renameSync(sampleConfigFile, configFile);
            fs.readFile(sampleConfigFile, function (err, data) {
                if (err) throw err;

                fs.writeFile(configFile, data, function (err) {
                    if (err) throw err;
                });
            });
        }
    });
});

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
        ignorePath: '../../public/',
        jade: {
          block: /(([ \t]*)\/\/\s*bower:*(\S*))(\n|\r|.)*?(\/\/\s*endbower)/gi,
          detect: {
            js: /script\(.*src=['"]([^'"]+)/gi,
            css: /link\(.*href=['"]([^'"]+)/gi
          },
          replace: {
            js: 'script(src=\'{{filePath}}\')',
            css: 'link(rel=\'stylesheet\', href=\'{{filePath}}\')'
          }
        }
    };
    var injectSrc = gulp.src(['./public/css/*.css', './public/js/*.js'], {
        read: false
    });

    var injectOpts = {
        ignorePath: '../../public/',
        relative: true
    };

    return gulp.src('src/views/*.*')
        .pipe(wiredep(wiredepOpts))
        .pipe(inject(injectSrc, injectOpts))
        .pipe(gulp.dest('./src/views'));
});

//both style and inject will be run async
gulp.task('serve', ['prepareConfigs', 'style', 'inject'], function() {
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
