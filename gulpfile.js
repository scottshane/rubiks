var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var babelify = require('babelify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var connect = require('gulp-connect');
var less = require('gulp-less');
var path = require('path');


var bundlePaths = {
    mainJs: ['public/src/main.js'],
    srcJs: ['public/src/main.js', 'public/src/components/**/*.js', 'src/common/**/*.js'],
    srcLess: ['public/src/main.less'],
    componentsLess: 'public/src/components/**/*.less',
    commonLess: 'public/src/common/**/*.less',
    html: ['public/src/*.html'],
    dest: 'public/src/build/js'
}

function compile() {
    var bundler = watchify(browserify(bundlePaths.mainJs, {debug: true}).transform(babelify, {presets: ['es2015']}));

    function rebundle() {
        bundler.bundle()
            .on('error', function(err) { console.error(err); this.emit('end'); })
            .pipe(source('build.js'))
            .pipe(buffer())
            .pipe(sourcemaps.init({loadMaps: true}))
            .pipe(sourcemaps.write('./'))
            .pipe(gulp.dest('./public/build'));
    }

    rebundle();
}

function watch() {
    gulp.watch(bundlePaths.html, ['html']);
    gulp.watch(bundlePaths.componentsLess, ['style']);
    gulp.watch(bundlePaths.commonLess, ['style']);
    gulp.watch(bundlePaths.srcLess, ['style']);
    gulp.watch(bundlePaths.srcJs, ['build', 'html']);
}

gulp.task('connect', function() {
    connect.server({
        root: './public/src',
        livereload: true
    });
});

gulp.task('html', function() {
    gulp.src('./public/src/*.html')
        .pipe(connect.reload());
});

gulp.task('style', function() {
    return gulp.src(bundlePaths.srcLess)
    .pipe(sourcemaps.init())
    .pipe(less({
        paths: [path.join(__dirname, 'components', 'includes'), path.join(__dirname, 'common', 'includes')]
    }))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('./public/build/css'));
})

gulp.task('build', function() { return compile(); });
gulp.task('watch', function() { return watch(); });

gulp.task('default', ['style', 'watch']);