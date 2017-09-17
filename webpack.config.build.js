const webpack = require("webpack")

const PurifyCSSPlugin = require('purifycss-webpack')
const MinifyPlugin = require("babel-minify-webpack-plugin")
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')

const path = require('path')
const glob = require('glob')

const PrerenderSpaPlugin = require('prerender-spa-plugin')

module.exports = {
	plugins: [
		new PurifyCSSPlugin({
			styleExtensions: [".css", ".sass", ".scss"],
			paths: glob.sync(path.join(__dirname, '/src/{*.html,components/*.vue,js/**/*.vue}')),
			verbose: true,
			purifyOptions: {
				whitelist: ["*:not*"] //
			}
		}),
		new OptimizeCssAssetsPlugin(),
		new MinifyPlugin(),
		/*
		new PrerenderSpaPlugin(
			// Absolute path to compiled SPA
			path.join(__dirname, '/build'),
			// List of routes to prerender
			['/'], {
				phantomPageSettings: {
					loadImages: false
				}
			}
		)
		*/
	]
}