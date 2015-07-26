var gulp = require('gulp');
var plugins = require('gulp-load-plugins')();
var glob = require('glob');
var path = require('path');
var _ = require('lodash');

var pictures = 'src/pictures/**/*';


function getHbContext () {
		var context = {
			albums: []
		};
		glob.sync(pictures).forEach(function (file) {
			file = path.parse(file);
			// add directories to the albums
			if(file.base === file.name) {
				context.albums.push({
					name: file.name,
					pictures: []
				});
			} else {
				var albumName = file.dir.replace('src/pictures/', '');
				var albumPosition = _.findIndex(context.albums, {name: albumName});
				if (albumPosition >= 0) {
					context.albums[albumPosition].pictures.push({
						fullsize: ['pictures', 'full', albumName, file.base].join('/'),
						thumb: ['pictures', 'thumbs', albumName, file.base].join('/')
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

