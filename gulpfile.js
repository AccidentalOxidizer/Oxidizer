// REQUIRE GULP TASK RUNNER
var gulp = require('gulp');

// GULP PLUGINS
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var notify = require("gulp-notify");
var plumber = require('gulp-plumber');
var stylish = require('jshint-stylish');
var tape = require('gulp-tape');
var uglify = require('gulp-uglify');
var webpack = require('webpack');
var webpackConfig = require('./webpack.config.js');

/** 
 *  NOTES:
 *
 *  We'll be doing mor with Gulp concatination and uglifying things once
 *  we start building out our front-end files for the website / dashboard
 *  and the Chrome extension. Once that happens, we can add those specific 
 *  tasks in below.
 *
 *  NOTIFICATIONS / ERRORS:
 *
 *  I've installed a notification script that is supposed to pop up errors
 *  on Mac OS X, but I'm not able to get it to work just use.
 *
 *  TO USE:
 *  1. Install dependencies:
 *    npm install
 *
 *  2. Run gulp want check for any linting errors or failed tests.
 *    gulp default
 *
 *  3. Alternatively, use the "watch" task to have Gulp continuously run when you change a file.
 *    gulp watch
 */

// TEST TASKS
gulp.task('test', function() {
  return gulp.src('test/**/*.js')
    .pipe(tape());
});

// CHECK THAT OUR CODE IS VALID
gulp.task('linter', function() {
  // place code for your default task here
  return gulp.src(['server/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
});

// Use webpack to build the client side bundle
gulp.task('webpack', function(done) {
  webpack(webpackConfig, function(err, stats) {
    if (err) {
      console.log('Webpack Error: ', err);
    } else {
      // console.log(stats.toString());
    }
    done();
  });
});

gulp.task('build-client', function() {
  gulp.watch(['client/**/*',  "!client/dist/*.js"], ['webpack']);
});

// DEFAULT TASKS
gulp.task('default', ['webpack', 'test', 'linter']);

// WATCH TASK
gulp.task('watch', function() {
  gulp.watch(['server/**/*.js', 'client/**/*.js', 'test/*.js'], ['default']);
});