var gulp = require('gulp');
var sass = require('gulp-sass');
var sassFiles = ['./public/sass/materialize.scss'];
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');
var _cssDir = './public/css';

gulp.task('compile:sass',function(){
  gulp.src(sassFiles)
    .pipe(sass().on('error',sass.logError))
    .pipe(gulp.dest(_cssDir))
    .pipe(minifyCss({compatibility:'ie8'}))
    .pipe(rename('materialize.min.css'))
    .pipe(gulp.dest(_cssDir));
});

gulp.task('sass:watcher',function(){
  gulp.watch(sassFiles,['compile:sass']);
});

gulp.task('watchers', ['sass:watcher'])

gulp.task('default',['compile:sass']);
