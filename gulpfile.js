var gulp = require('gulp');
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var uglify = require('gulp-terser');
var imagemin = require('gulp-imagemin');
var debug = require('gulp-debug');
var filelist = require('gulp-filelist');



var cssFiles = 'home/css/**/*.*';
var cssDest = '../keyboard-kit-deploy/home/css';

gulp.task('css', function () {
    return gulp.src(cssFiles)
            .pipe(gulp.dest(cssDest));
});



var extFiles = 'home/ext/**/*.*';
var extDest = '../keyboard-kit-deploy/home/ext';

gulp.task('ext', function () {
    return gulp.src(extFiles)
            .pipe(gulp.dest(extDest));
});



var imgFiles = 'home/img/*';
var imgDest = '../keyboard-kit-deploy/home/img';

gulp.task('img', function () {
    return gulp.src(imgFiles)
            .pipe(imagemin())
            .pipe(gulp.dest(imgDest));
});



var jsFiles = 'home/js/*.js';
var jsDest = '../keyboard-kit-deploy/home/js';

gulp.task('js', function () {
    return gulp.src(jsFiles)
            .pipe(concat('scripts.js'))
            //.pipe(gulp.dest(jsDest))
            .pipe(rename('keyboardkit.min.js'))
            .pipe(uglify())
            .pipe(gulp.dest(jsDest));
});


var moduleFiles = 'home/page_modules/*';
var moduleDest = '../keyboard-kit-deploy/home/page_modules';

gulp.task('modules', function () {
    return gulp.src(moduleFiles)
            .pipe(gulp.dest(moduleDest));
});



var iconFiles = ['home/apple-touch-icon.png', 'home/favicon.gif', 'home/favicon.ico', 'home/favicon.png'];
var iconDest = '../keyboard-kit-deploy/home';

gulp.task('icons', function () {
    return gulp.src(iconFiles)
            .pipe(gulp.dest(iconDest));
});


gulp.task('textures', function() {
    return gulp.src('./textures/*.jpg')
        .pipe(filelist('textureList.json'))
        .pipe(gulp.dest('./textures'));
});


gulp.task('models', function() {
    return gulp.src('./models/**/*.dae')
        .pipe(filelist('modelList.json'))
        .pipe(gulp.dest('./models'));
});




gulp.task('default', gulp.series('css', 'ext', 'img', 'js', 'modules', 'icons'));
