var gulp = require('gulp'),
    clean = require('gulp-clean'),
 	fileinclude = require('gulp-file-include'),
 	sass = require('gulp-sass'),
 	htmlhint  = require('gulp-htmlhint'),
    sassLint = require('gulp-sass-lint'),
    gutil = require('gulp-util'),
    sourcemaps = require('gulp-sourcemaps'),
    jslint = require('gulp-jslint'),
    concat = require('gulp-concat'),
    clone = require('gulp-clone');

const autoprefixer = require('gulp-autoprefixer');

gulp.task('clean', function () {
  return gulp.src('src/result/**/', {read: false})
        .pipe(clean());
});

gulp.task('htmlHint', function() {
  return gulp.src('src/html/**/')
    .pipe(htmlhint())
    .pipe(htmlhint.reporter());
});

gulp.task('jslint', function() {
  return gulp.src('src/js/**/')
    .pipe(jslint())
    .pipe(jslint.reporter());
});

gulp.task('clone', function (cb) {
 return gulp.src(['src/img/**/', 'src/js/**/'])
   .pipe(clone())
 .pipe(gulp.dest('src/result/**/'));
});

//변경 scss
gulp.task('sassLint', function() {
  return gulp.src('src/scss/**/')
    .pipe(sassLint())
    .pipe(sassLint.format())
    .pipe(sassLint.failOnError());
});

gulp.task('sass', function () {
  return gulp.src('src/scss/**/')
    .pipe(sourcemaps.init())
      .pipe(sass({outputStyle: 'expanded'}).on('error', sass.logError))
    .pipe(sourcemaps.write('src/scss/maps'))
    .pipe(gulp.dest('src/result/css'));
});

gulp.task('watch', function () {
    gulp.watch('src/html/**/*.html', ['htmlHint']);
    gulp.watch('src/scss/**/*.scss', ['sassLint']);
    gulp.watch('src/scss/**/*.scss', ['sass']);
	gulp.watch(['src/html/**/*.html','!src/html/include/**'] , ['fileinclude']);
    gulp.watch(['src/img/**/', 'src/js/**/'] , ['clone']);
});

gulp.task('fileinclude', function() {
  gulp.src(['src/html/**/*.html','!src/html/include/**'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('src/result/html'));
});

gulp.task('default', ['clean', 'sass', 'fileinclude', 'clone', 'watch']);
