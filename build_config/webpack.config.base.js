const webpack = require("webpack")

const path = require('path')
//const glob = require('glob')

const HtmlWebpackPlugin = require('html-webpack-plugin')
//const HtmlWebpackInlineSourcePlugin = require('html-webpack-inline-source-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CopyWebpackPlugin = require("copy-webpack-plugin")
const VueLoaderPlugin = require('vue-loader/lib/plugin')

const devMode = process.env.NODE_ENV !== 'production'

module.exports = {
	entry: {
		app: ['js/main.js']
	},
	output: {
		filename: '[name].js',
		path: path.resolve('dist')
	},
	module: {
		rules: [{
			test: /\.(sa|sc|c)ss$/,
			use: [
				devMode ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
				'css-loader',
				'postcss-loader',
				//'sass-loader',
				{
					loader: 'sass-loader',
					options: {
						// you can also read from a file, e.g. `variables.scss`
						data: `
							@import "~css/injected/variables.scss";
							@import "~css/injected/mixins.scss";
						`
					}
				}
			]
		},
		{
			test: /\.(ttf|eot|woff|woff2|svg)$/,
			loader: "url-loader?limit=1024&name=fonts/[name]_[hash:8].[ext]"
		},
		{
			test: /\.(png|jpg|jpeg|gif)$/,
			loader: "url-loader?limit=1024&name=img/[name]_[hash:8].[ext]"
		},
		/*
		{
			//test: /admin\/config.yml$/,
			test: /admin\/config\.yml$/,
			loader: 'netlify-cms-loader',
			options: {
				test: "test"
			}
		},
		*/
		{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader'
		},
		{
			test: /\.vue$/,
			loader: 'vue-loader'
		}]
	},
	resolve: {
		alias: {
			//"vue$": 'vue/dist/vue.esm.js',
			//"vue-router$": 'vue-router/dist/vue-router.esm.js'
			//"cms": "admin/config.yml"
			//"cms-loader": "netlify-cms-loader",
			//"cms-config": "admin/config.yml",
		},
		modules: [
			path.resolve('src'),
			path.resolve('node_modules')
		]
	},
	resolveLoader: {
		modules: [path.resolve('node_modules')],
		alias: {
			"cms": "netlify-cms-loader"
		}
	},
	plugins: [
		new VueLoaderPlugin(),
		new CleanWebpackPlugin(['../dist'], {
			root: __dirname,
			verbose: true,
			dry: false,
			watch: false,
			allowExternal: true
		}),

		new webpack.EnvironmentPlugin(['NODE_ENV']),
		/*
		new webpack.DefinePlugin({
			'process.env.NETLIFY_CMS_LOADER_CONFIG': 'admin/config.yml'
		}),
		*/
		new HtmlWebpackPlugin({
			//inlineSource: '\.(js|css)$',
			//inlineSource: '.css$',
			manifest: "manifest.json",
			template: 'src/index.html'
		}),
		//new HtmlWebpackInlineSourcePlugin(),
		new CopyWebpackPlugin([
			{ from: 'src/admin', to: 'admin' },
			{ from: 'src/uploads', to: 'uploads' }
		]),
		new MiniCssExtractPlugin({
			// Options similar to the same options in webpackOptions.output
			// both options are optional
			filename: "[name].css",
			chunkFilename: "[id].css"
		})
	],
	stats: {
		maxModules: Infinity,
		optimizationBailout: true
	}
}