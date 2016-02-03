var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');
var browserSync = require('browser-sync');
var notify = require('gulp-notify');
var babelify = require('babelify');

var path = {
    html: 'app/src/index.html',
    minified_out: 'build.min.js',
    out: 'build.js',
    dest_src: 'dist/src',
    dest_build: 'dist/build',
    dest: 'dist',
    entry_point: 'app/src/index.js'
};

gulp.task('transform', function () {
    gulp.src(path.js)
        .pipe(react())
        .pipe(gulp.dest(path.dest_src))
});

gulp.task('copy', function () {
    gulp.src(path.html)
        .pipe(gulp.dest(path.dest));
});

gulp.task('replaceHTML', function () {
    gulp.src(path.html)
        .pipe(htmlreplace({
            'js': 'build/' + path.minified_out
        }))
        .pipe(gulp.dest(path.dest))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('build', ['replaceHTML'], function () {
    browserify({
        entries: [path.entry_point],
        transform: 'babelify',
        presets: ['es2015', 'react']
    })
        .bundle()
        .pipe(source(path.minified_out))
        .pipe(streamify(uglify(path.minified_out)))
        .pipe(gulp.dest(path.dest_build));
});

gulp.task('watchify', ['watch'], function () {
    var watcher = watchify(browserify({
        entries: [path.entry_point],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    }));

    function rebundle() {
        return watcher.bundle()
            .pipe(source(path.out))
            .pipe(gulp.dest(path.dest_src))
            .pipe(browserSync.reload({stream: true}));
    }

    watcher.transform(babelify).on('update', rebundle);
    return rebundle();
});

gulp.task('watch', function () {
    gulp.watch(path.html, ['copy']);
    gulp.watch(path.entry_point, ['transform']);

});

gulp.task('serve', ['watchify'], function () {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });
});

gulp.task('default', ['serve']);