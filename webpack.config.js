const path = require('path')
const webpack = require('webpack')
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const LiveReloadPlugin = require('webpack-livereload-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin');

const production = process.env.npm_lifecycle_event == 'build'

module.exports = {
    entry: {
        bundel: './dev/js/index.js'
    },
    output: {
        filename: 'js/[name].[hash].js',
        path: path.resolve(__dirname, './build/')
    },
    plugins: [
        new FriendlyErrorsWebpackPlugin(),
        new LiveReloadPlugin({}),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': production 
                ? '"production"' 
                : '"development"'
            }),
        new HtmlWebpackPlugin({
            production: production,
            template: 'dev/index.html',
            inject: false,
        }),
        new CopyWebpackPlugin([
            {from:'dev/assets',to:'assets'} 
        ]), 
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.scss$/,
                use: [
                    "style-loader", // creates style nodes from JS strings
                    "css-loader", // translates CSS into CommonJS
                    "sass-loader" // compiles Sass to CSS, using Node Sass by default
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
            chunks: 'all'
        }
    },
    stats: {
        colors: true
    },
    devtool: production ? 'none' : 'source-map',
    mode: production ? 'production' : 'development'
}