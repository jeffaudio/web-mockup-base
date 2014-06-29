var gulp = require('gulp');
var pkg = require("./package.json");
var plug = require('gulp-load-plugins')();
var gutil = plug.loadUtils(['colors', 'env', 'log', 'date']);

var type = gutil.env.production ? 'production' : 'development';
gutil.log('Building for', gutil.colors.magenta(type));
gutil.beep();

gulp.task('clean', function() {
	return gulp.src(pkg.paths.dest.base, {read: false})
		.pipe(plug.rimraf());
});

gulp.task('minify-css', ['compile-sass'], function() {
	return gulp.src(pkg.paths.dest.css + "/*.css")
		.pipe(plug.minifyCss({ 
			keepSpecialComments: "*"
		}))
		.pipe(gulp.dest(pkg.paths.dest.css));
})

gulp.task('compile-sass', ['clean'], function() {
	return gulp.src(pkg.paths.src.scss)
		.pipe(plug.sass({
			includePaths: pkg.paths.lib.scss
		}))
		.pipe(gulp.dest(pkg.paths.dest.css));
});

gulp.task('images', ['clean'], function() {
	return gulp.src(pkg.paths.src.web)
		.pipe(gulp.dest(pkg.paths.dest.images));
});

gulp.task('copy-fonts', ['clean'], function() {
	return gulp.src(pkg.paths.src.fonts)
		.pipe(gulp.dest(pkg.paths.dest.fonts));
});

gulp.task('copy-html', ['clean'], function() {
	return gulp.src(pkg.paths.src.web)
		.pipe(gulp.dest(pkg.paths.dest.base));
});

gulp.task('copy-js', ['clean'], function() {
	return gulp.src(pkg.paths.src.js)
		.pipe(gulp.dest(pkg.paths.dest.js));
});



gulp.task('copy-base-files', ['copy-js', 'copy-html', 'copy-fonts'], function() {
	return;
});


gulp.task('default', ['compile-sass', 'images', 'copy-base-files'], function() {
	return plug.notify({
			onLast: true,
			message: "Compiled and copied to production directory!"
      });
});


gulp.task('watch-src', function() {
	var watcher = gulp.watch(pkg.paths.src.base + "**/*", ['default']);

	watcher.on('change', function(evt) {
		plug.notify({message: "Gulp updated files."});
	});
});