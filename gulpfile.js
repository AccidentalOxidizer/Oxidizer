var concat = require('gulp-concat');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var notify = require("gulp-notify");
var plumber = require('gulp-plumber');
var stylish = require('jshint-stylish');
var tape = require('gulp-tape');
var uglify = require('gulp-uglify');

// TEST TASKS
gulp.task('test', function() {
  return gulp.src('test/*.js')
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(tape())
});

// CHECK CODE
gulp.task('linter', function() {
  // place code for your default task here
  return gulp.src(['server/**/*.js'])
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>")
    }))
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
});

// DEFAULT
gulp.task('default', ['test', 'linter']);

// WATCH TASK
gulp.task('watch', function() {
  gulp.watch(['server/**/*.js', 'test/*.js'], ['test', 'default']);
});