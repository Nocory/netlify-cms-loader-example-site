const npmEvent = process.env.npm_lifecycle_event;
const merge = require('webpack-merge');
const path = require('path')

let mergeConfig = require(`./webpack.config.dev.js`)

module.exports = merge(mergeConfig, {
	devServer: {
		contentBase: path.join(__dirname, "dist"),
		compress: true,
		host: "0.0.0.0",
		port: 2000,
		overlay: true
	},
})