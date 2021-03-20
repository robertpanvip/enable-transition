const path = require('path');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CSSSplitWebpackPlugin = require('css-split-webpack-plugin').default;
const WebpackBar = require('webpackbar');
const pkg = require('../package.json');

const Config = {
    HOSTNAME: 'localhost',
    PORT: 9090
};


new WebpackDevServer(webpack({
    devtool: 'source-map',
    entry: [
        `webpack-dev-server/client?http://${Config.HOSTNAME}:${Config.PORT}`,
        'webpack/hot/only-dev-server',
        './index.tsx'
    ],
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'index.html',
            hash: true,
            thunks: ['bundle']
        }),
        new MiniCssExtractPlugin({
            filename: './static/css/[name].[chunkhash:8].min.css',
            chunkFilename: 'static/css/[name].[chunkhash:8].[id].min.css',
        }),
        new CSSSplitWebpackPlugin({
            size: 4000,
            filename: './static/css/[name]-[part].[ext]',
        }),
        new webpack.HotModuleReplacementPlugin(),
        new WebpackBar({
            name: pkg.name,
            color: '#2f54eb',
        })
    ],
    resolve: {
        extensions: ['.js', '.jsx', '.tsx', '.ts']
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                loader: 'babel-loader',
                include: [
                    path.join(__dirname, '../src'),
                    path.join(__dirname, '../demo'),
                ]
            },
            {
                test: /\.tsx?$/,
                loader: 'babel-loader',
                options: {
                    'presets': [

                        ['@babel/preset-env'],
                        ['@babel/preset-react'],
                        [
                            '@babel/preset-typescript',
                            {
                                'isTSX': true,
                                'allExtensions': true
                            }
                        ],
                    ],
                    'plugins': [
                        ['@babel/plugin-transform-runtime'],
                        ['@babel/plugin-proposal-decorators', { 'legacy': true }],
                        ['@babel/plugin-proposal-class-properties', { 'loose': true }],
                    ]
                },
                include: [
                    path.join(__dirname, '../demo'),
                    path.join(__dirname, '../src'),
                ]
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.scss$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?.+)?$/,
                loader: 'file-loader'
            },
            {
                test: /\.(jpe?g|png|gif)(\?.+)?$/,
                loader: 'url-loader'
            },
            {
                test: /\.md$/,
                loader: 'raw-loader'
            }
        ]
    },
    mode: 'development',
}), {
    publicPath: '/',
    hot: true,
    host: Config.HOSTNAME,
    open: true,
    historyApiFallback: true,
    stats: { colors: true }
}).listen(Config.PORT, Config.HOSTNAME, error => {
    if (error) {
        throw error;
    }
})
