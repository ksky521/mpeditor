const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = require('./config');
function resolve(dir) {
    return path.join(__dirname, './', dir);
}
const isProd = process.env.NODE_ENV === 'production';
const publicPath = isProd ? config.build.assetsPublicPath : config.dev.assetsPublicPath;
module.exports = {
    entry: {
        main: './src/main.js',
    },
    output: {
        path: config.build.assetsRoot,
        filename: '[name].js',
        publicPath,
    },
    externals: {
        jQuery: 'jQuery',
        PR: 'PR',
    },
    resolve: {
        modules: [resolve('src'), resolve('node_modules')],
    },
    module: {
        rules: [
            {
                test: /\.less$/,
                use: [
                    isProd ? MiniCssExtractPlugin.loader : 'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: !isProd,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: !isProd,
                        },
                    },
                    {
                        loader: 'less-loader',
                        options: {
                            sourceMap: !isProd,
                        },
                    },
                ],
            },
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'style-loader',
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: !isProd,
                        },
                    },
                    {
                        loader: 'postcss-loader',
                        options: {
                            sourceMap: !isProd,
                        },
                    },
                ],
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [resolve('src')],
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                },
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                query: {
                    limit: 10000,
                },
            },
        ],
    },
};
