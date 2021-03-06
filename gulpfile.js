"use strict";

var gulp = require('gulp');
var less = require('gulp-less');
var plumber = require('gulp-plumber');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var server = require('browser-sync');
var mqpacker = require('css-mqpacker');
var minify = require('gulp-csso');
var rename = require('gulp-rename');
var imagemin = require('gulp-imagemin');
var svgmin = require('gulp-svgmin');
var svgstore = require('gulp-svgstore');
var del = require('del');
var run = require('run-sequence');
var ghPages = require('gulp-gh-pages');

gulp.task('style', function() {
  gulp.src('less/style.less')
  .pipe(plumber())
  .pipe(less())
  .pipe(postcss([
    autoprefixer({browsers: [
      'last 5 version',
      '> 1%'
    ]}),
    mqpacker({
      sort: true
    })
  ]))
  .pipe(gulp.dest('css'))
  .pipe(gulp.dest('build/css'))
  .pipe(minify())
  .pipe(rename('style.min.css'))
  .pipe(gulp.dest('css'))
  .pipe(gulp.dest('build/css'))
  .pipe(server.reload({stream: true}));
});

gulp.task('images', function() {
  return gulp.src('build/img/**/*.{png,jpg,gif}')
  .pipe(imagemin({
    optimizationLever: 3,
    progressive: true
  }))
  .pipe(gulp.dest('build/img'));
});

gulp.task('symbols', function() {
  return gulp.src('build/img/icons/*.svg')
  .pipe(svgmin())
  .pipe(svgstore({
    inlineSvg: true
  }))
  .pipe(rename('symbols.svg'))
  .pipe(gulp.dest('build/img'));
})

gulp.task('serve', ['style'], function() {
  server.init({
    server: '.',
    watchTask: true,
    notify: false,
    open: true,
    ui: false
  });

  gulp.watch('less/**/*.less', ['style']);
  gulp.watch('*.html').on('change', server.reload);
  gulp.watch('js/**/*.js').on('change', server.reload);
});

gulp.task('copy', function() {
  return gulp.src([
    "fonts/**/*.{woff,woff2}",
    "img/**",
    "js/**",
    "*.html"
  ], {
    base: '.'
  })
  .pipe(gulp.dest('build'));
});

gulp.task('clean', function() {
  return del('build');
});

gulp.task('build', function(fn) {
  run('clean', 'copy', 'style', 'images', 'symbols', fn);
});

gulp.task('deploy', function() {
  return gulp.src('./build/**/*')
    .pipe(ghPages());
});











