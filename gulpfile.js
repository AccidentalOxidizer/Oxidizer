var concat = require('gulp-concat');
var gulp = require('gulp');
var jshint = require('gulp-jshint');
var stylish = require('jshint-stylish');
var tape = require('gulp-tape');
var uglify = require('gulp-uglify');

// TEST TASKS
gulp.task('test', function() {
  return gulp.src('test/*.js')
    .pipe(tape());
});

// DEFAULT GULP TASKS
gulp.task('default', function() {
  // place code for your default task here
  return gulp.src(['server/**/*.js'])
    .pipe(jshint())
    .pipe(jshint.reporter(stylish))
});

// WATCH TASK
gulp.task('watch', function() {
  gulp.watch(['server/**/*.js', 'test/*.js'], ['test', 'default']);
})