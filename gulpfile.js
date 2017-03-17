var gulp = require('gulp');
var pug = require('gulp-pug');
var uglifyjs = require('gulp-uglify');
var webpack = require('webpack-stream');
var rename = require('gulp-rename');
var argv = require('yargs').argv;
var newer = require('gulp-newer');
var named = require('vinyl-named-with-path');
var through = require('through');
var path = require('path');
var plumber = require('gulp-plumber');

/*
parameter
*/
// production mode will do minify and so on
var isProduction = (argv.p === undefined) ? false : true;
console.log('production mode detected');

/*
task
*/
// javascript bundling task
// let webpack do his 'watch' job
gulp.task('bundling', function() {
    var src = 'view/src/**/bundle.js';
    var dest = 'view';

    var stream = gulp.src(src)
            .pipe(plumber())
            .pipe(named())
            .pipe(webpack({
                watch: true,
                module: {
                    loaders: [
                        {test: /\.(scss|sass|css)$/, loader: 'style!css!sass'},
                        {test: /\.vue$/, loader: 'vue'},
                        {test: /\.(png|eot|woff2|woff|ttf|svg)$/, loader: 'url'}
                    ]
                }
            }))
            .pipe(rename(function(file) {
                file.basename = 'bundle';
            }));
    if( isProduction )
        stream.pipe(uglifyjs({mangle: {toplevel: true}}));
    return stream.pipe(gulp.dest(dest));
});

// convert pug to html
gulp.task('pug', function() {
    var src = 'view/src/**/*.pug';
    var dest = 'view';

	return gulp.src(src)
            .pipe(plumber())
            .pipe(named())
			.pipe(pug({locals: {LANTERN_TITLE: 'LANTERN'}}))
			.pipe(gulp.dest(dest));
});

gulp.task('watch', function() {
	gulp.watch('view/src/**/*.pug', ['pug']);
});

gulp.task('default', ['watch', 'bundling', 'pug']);