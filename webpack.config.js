module.exports = {
	context: __dirname,
	entry: "./src/js/main.js",
	output: {
		path: __dirname + "/dist",
		filename: "js/bundle.js"
	},
	module: {
		loaders: [
			{ test: /\.css$/, loader: "style-loader!css-loader" },
			{test: /\.(png|jpg|gif)$/, loader: 'url-loader?limit=8192'} // inline base64 URLs for <=8k images, direct URLs for the rest
		]
	}
};
