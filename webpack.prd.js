const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const webpack = require('webpack');
module.exports = {
    mode: 'production',
    entry:'./src/assets/js/main.js',
    output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public/assets/js')
    },
    optimization: {
        minimizer: [
            new UglifyJSPlugin({
                uglifyOptions: {compress: {drop_console: true}},
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                  esModule: true
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/
            },
            {
                test: /\.scss$/,
                use: [
                  'vue-style-loader',
                  'css-loader',
                  'sass-loader'
                ]
            }
        ]
    },
    resolve: {
        extensions: ['*', '.ts', '.vue', '.json', 'scss', '.js'],
        alias: {
            'vue$': 'vue/dist/vue.common.js'
        }
    },
    plugins: [
        new VueLoaderPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery'
        })
    ],
}
