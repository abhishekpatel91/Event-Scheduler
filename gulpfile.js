/*Required Modeules*/
var gulp = require('gulp'),
	compass = require('gulp-compass'),
	plumber = require('gulp-plumber'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
    connect = require('gulp-connect-multi') ();

/*Gulp task to create server*/
gulp.task('connect', connect.server({
    root: ['app'],
    port: 8002,
    livereload: true,
    open: {}
}));

/*Gulp task for sass*/
gulp.task('compass', function() {
	gulp.src('app/scss/**/*.scss')
	.pipe(plumber())
	.pipe(compass({
		css: 'app/css',
		sass: 'app/scss'
	}))
	.pipe(connect.reload())
});

/*Gulp HTMl task*/
gulp.task('html', function() {
	gulp.src(['app/*.html', 'app/**/*.html'])
	.pipe(plumber())
	.pipe(connect.reload())
});

/*Gulp scripts task*/
gulp.task('scripts', function() {
	gulp.src(['app/js/global.js', 'app/js/navigation.js', 'app/js/createEvent.js', 'app/js/listEvent.js'])
	.pipe(plumber())
	.pipe(concat('main.js'))
	.pipe(gulp.dest('app/js'))
	.pipe(rename({suffix: '.min'}))
	.pipe(uglify())
	.pipe(gulp.dest('app/js'))
	.pipe(connect.reload())
});

/*Gulp task to watch html/scss/js*/
gulp.task('watch', function() {
	gulp.watch(['app/js/**/*.js', '!app/js/main.js', '!app/js/main.min.js'], ['scripts']);
	gulp.watch('app/scss/**/*.scss', ['compass']);
	gulp.watch(['app/*.html', 'app/**/*.html'], ['html']);
});

/*Gulp default task*/
gulp.task('default', ['connect', 'compass', 'scripts', 'watch']);
