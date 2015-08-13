// fancybox and plugins
var $ = require('jquery');
require('fancybox')($);
require('fancybox/dist/helpers/js/jquery.fancybox-thumbs.cjs.js')($);
require('fancybox/dist/helpers/css/jquery.fancybox-thumbs.css');
require('fancybox/dist/css/jquery.fancybox.css');

// bind fancybox
$(document).ready(function() {
	$(".picture").fancybox({
		prevEffect	: 'none',
		nextEffect	: 'none',
		helpers	: {
			thumbs	: {
				width	: 75,
				height	: 75
			}
		}
	});
});
