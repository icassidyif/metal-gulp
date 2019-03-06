var gulp = require('gulp');
var pug = require('gulp-pug');
var sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
var server = require('gulp-server-livereload');
var cleancss = require('gulp-cleancss');
const changed = require('gulp-changed');
var debug = require('gulp-debug')
var plumberNotifier = require('gulp-plumber-notifier');
var browserify = require('gulp-browserify');
let uglify = require('gulp-uglify-es').default;
var sourcemaps = require('gulp-sourcemaps');

gulp.task('imgCopy', async function(){
  gulp.src('./app/img/*')
    .pipe(changed('./dist/img/'))
    .pipe(gulp.dest('./dist/img/'))  
});

gulp.task('jsBuild', async function(){
  gulp.src('./app/js/*.js')
    .pipe(plumberNotifier())
    .pipe(changed('./dist/js/'))
    .pipe(browserify())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./dist/js/'))
});

gulp.task('htmlBuild', async function(){
    gulp.src('./app/*.pug')
      .pipe(plumberNotifier())
      .pipe(pug({
        pretty: true
      }))
      .pipe(gulp.dest('./dist/'))
});

gulp.task('cssBuild', async function(){
  gulp.src('./app/scss/*.sass')
    .pipe(plumberNotifier())
    .pipe(sass())
    .pipe(autoprefixer({
        browsers: ['last 20 versions'],
        cascade: false
    }))
    .pipe(cleancss({keepBreaks: true}))
    .pipe(gulp.dest('./dist/css/'))
});

gulp.task('webserver', function() {
  gulp.src('./dist/')
    .pipe(server({
      livereload: true,
      directoryListing: false,
      open: false
    }));
});


gulp.task('watcher', function(){
  gulp.watch('./app/img/*', gulp.series('imgCopy'))
  gulp.watch('./app/js/*.js', gulp.series('jsBuild'))
  gulp.watch('./app/scss/*.sass', gulp.series('cssBuild'))
  gulp.watch('./app/*.pug', gulp.series('htmlBuild'))
  gulp.watch('./app/includes/*.pug', gulp.series('htmlBuild'))
});

gulp.task('default',gulp.parallel('webserver', 'watcher'), async function(){
    console.log("Привіт");
});