'use strict';
/**
 * Created by doug5solas on 7/30/17.
 */

const 
    gulp        = require('gulp'),
    rename      = require('gulp-rename'),
    del         = require('del'),
    pump        = require('pump'),
    concat      = require('gulp-concat'),
    sass        = require('gulp-sass'),
    maps        = require('gulp-sourcemaps'),
    uglify      = require('gulp-uglify'),
    plumber     = require('gulp-plumber'),
    gutil       = require('gulp-util'),
    imagemin    = require('gulp-imagemin'),
    cleanCSS    = require('gulp-clean-css'),
    browserSync = require('browser-sync').create();

//  establish paths and error handling
const options = {
    root : './',
    src  : 'src',
    dist : 'dist',
    //errorHandler: function(title) {
    //    return function(err) {
    //        gutil.log(gutil.colors.red('[' + title + ']'), err.toString());
    //        this.emit('end');
    //    };
    //}
};

gulp.task('clean', () => {
    return del.sync(options.dist);
});

//  gulp 'scripts' task: concatenates all js files to all.min.js, minifies and maps all.min.js,
//      pipes it to the distribution folder then performs browser syncing
gulp.task('scripts', () => {
    return gulp.src(`${options.src}/js/**/*`)
        .pipe(plumber())
        .pipe(maps.init())
        .pipe(concat('all.min.js'))
        .pipe(uglify())
        .pipe(maps.write('./'))
        .pipe(gulp.dest(`${options.dist}/js`))
        .pipe(browserSync.stream({ match: '**/*.js' }));
});

//  gulp 'styles' task: compresses all global.scss file to all.min.css, minifies and maps all.min.css, 
//      pipes it to the distribution folder then performs browser syncing
gulp.task('styles', () => {                 //  called compileSass in gulp-basics
    return gulp.src(`${options.src}/sass/global.scss`)
        .pipe(plumber())
        .pipe(maps.init())
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        //.pipe(sass({ outputStyle: 'compressed' }).on('error', errorHandler))
        .pipe(cleanCSS())
        .pipe(rename('all.min.css'))
        .pipe(maps.write('./'))
        .pipe(gulp.dest(`${options.dist}/styles`))
        .pipe(browserSync.stream({ match: '**/*.css' }));
});

//  gulp 'images' task: minifies images (jpeg, png) then pipes them to the distribution folder
gulp.task('images', () => {
    return gulp.src(`${options.src}/images/*`)
        .pipe(imagemin([
            imagemin.jpegtran({ progressive: true }),
            imagemin.optipng({ optimizationLevel: 5 })
        ]))
        .pipe(gulp.dest('./dist/images'));
});

//  gulp 'icons' task: minifies icons (svgs) then pipes them to the distribution folder
gulp.task('icons', () => {
    return gulp.src(`${options.src}/icons/**/*`)
        .pipe(imagemin([
            imagemin.svgo({ plugins: [{ removeViewBox: true }] })
        ]))
        .pipe(gulp.dest(`${options.dist}/icons`));
});

//  gulp 'build' task: executed as stand-alone or as first step in 'default'
//      it basically preps the distribution environment
//      by executing; clean, styles, scripts, images, icons
gulp.task('build', ['clean', 'scripts', 'styles', 'images', 'icons'], () => {
    gutil.log('Build Finished');
});

//  gulp 'watch' task: executed as stand-alone or as second step in 'default'
//      watches for changes to sass and js and recompiles them automatically to their executable files
gulp.task('watch', () => {
    gulp.watch(`${options.src}/sass/*`, ['styles']);
    gulp.watch(`${options.src}/js/**/*`, ['scripts']);
});

//  gulp 'index' task: executed as stand-alone or as second step in 'default'
//      pipes the index.html file "as is" to the dist folder
gulp.task('index', () => {
    return gulp.src(`${options.root}index.html`)
        .pipe(gulp.dest(`${options.dist}`));
});

//  gulp 'sync' task: executed as stand-alone or as last step in 'default'
//      injects an asynchronous script tag (<script async>...</script>) after the <body> tag during initial request
//      it make for a level playing field across browsers
gulp.task('sync', ['build'], () => {
    return browserSync.init({
        server: {
            baseDir: './dist'
        }
    });
});

//  gulp 'default' task:  executed by 'gulp' command
//      calls in turn: build, watch, sync
gulp.task('default', ['build', 'watch', 'index', 'sync'], () => {
    gutil.log('Wow, I can\'t believe I Gulped everything down!');       //  log the default task completion
});