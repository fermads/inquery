var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var package = require('./package.json');

gulp.task('default', function() {
  gulp.src('src/**/*.js')
    .pipe(uglify())
    .pipe(rename(package.name +'-'+ package.version +'.min.js'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('test', function() {
  console.log('Open test/test.html on a browser');
});
