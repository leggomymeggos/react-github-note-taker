var gulp = require('gulp');
var uglify = require('gulp-uglify');
var htmlreplace = require('gulp-html-replace');
var source = require('vinyl-source-stream');
var browserify = require('browserify');
var watchify = require('watchify');
var reactify = require('reactify');
var streamify = require('gulp-streamify');

var path = {
    html: 'src/index.html',
    minified_out: 'build.min.js',
    out: 'build.js',
    dest_src: 'dist/src',
    dest_build: 'dist/build',
    dest: 'dist',
    entry_point: './src/js/app.js'
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
        .pipe(gulp.dest(path.dest));
});

gulp.task('build', ['replaceHTML'], function () {
    browserify({
        entries: [path.entry_point],
        transform: [reactify]
    })
        .bundle()
        .pipe(source(path.minified_out))
        .pipe(streamify(uglify(path.minified_out)))
        .pipe(gulp.dest(path.dest_build));
});

gulp.task('watch', function () {
    gulp.watch(path.html, ['copy']);

    var watcher = watchify(browserify({
        entries: [path.entry_point],
        transform: [reactify],
        debug: true,
        cache: {},
        packageCache: {},
        fullPaths: true
    }));

    return watcher.on('update', function () {
            watcher.bundle()
                .pipe(source(path.out))
                .pipe(gulp.dest(path.dest_src));
        })
        .bundle()
        .pipe(source(path.out))
        .pipe(gulp.dest(path.dest_src));
});

gulp.task('default', ['watch']);