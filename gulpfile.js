var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var glob = require('glob');
var parallel = require('concurrent-transform');
var os = require('os');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');

var pictures = 'src/pictures/**/*';


function getHbContext () {
		var context = {
			albums: []
		};
		glob.sync(pictures).forEach(function (file) {
			var albumName;
			var albumPosition;

			file = path.parse(file);
			// add directories to the albums
			if(file.base === file.name) {
				context.albums.push({
					name: file.name,
					pictures: []
				});
			} else if (file.base === 'licence.txt') {
				var licence = fs.readFileSync(path.join(file.dir, file.base), 'utf-8').trim();
				albumName = file.dir.replace('src/pictures/', '');
				albumPosition = _.findIndex(context.albums, {name: albumName});
				if (albumPosition >= 0) {
					context.albums[albumPosition].licence = licence;
				}
			} else {
				albumName = file.dir.replace('src/pictures/', '');
				albumPosition = _.findIndex(context.albums, {name: albumName});
				if (albumPosition >= 0) {
					context.albums[albumPosition].pictures.push({
						fullsize: ['pictures', 'full', albumName, file.base].join('/'),
						thumb: ['pictures', 'thumbs', albumName, file.name+'.jpeg'].join('/')
					});
				}
			}
		});
		return context;
}


gulp.task('html', function () {
	gulp.src('src/index.hbs')
		.pipe(plugins.hb({
			partials: 'src/partials/*.hbs',
			data: getHbContext
		}))
		.pipe(plugins.rename('index.html'))
		.pipe(gulp.dest('dist'));
});

gulp.task('images', function () {
	gulp.src(pictures)
		.pipe(plugins.imagemin())
		.pipe(gulp.dest('dist/pictures/full'));

	gulp.src(pictures)
		.pipe(parallel(
			plugins.imageResize({
				width: 150,
				height: 150,
				crop: true,
				upscale: false,
				format: 'jpeg'
			}),
			os.cpus().length
		))
		.pipe(plugins.imagemin())
		.pipe(gulp.dest('dist/pictures/thumbs'));
});

gulp.task('css', function () {
	gulp.src('src/sass/style.scss')
		.pipe(plugins.sass().on('error', plugins.sass.logError))
		.pipe(gulp.dest('dist/css/'));
});
