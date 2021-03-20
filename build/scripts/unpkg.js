const path = require('path');
const gulp = require('gulp');
const webpack = require('webpack');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const WebpackBar = require('webpackbar');
const sass = require('gulp-sass');
const pkg = require('../../package.json');

const { runTask,deleteFolder } = require("./util");
sass.compiler = require('node-sass');

function webpackCompile(minimize,name,callback){
    const plugins=[
        new BundleAnalyzerPlugin({
            analyzerMode: minimize?'server':'disabled',
        }),
        new webpack.BannerPlugin(`
${pkg.name} v${pkg.version}
Copyright 2019-present.
All rights reserved.
      `),
        new WebpackBar({
            name: pkg.name+":"+name,
            color: '#2f54eb',
        })
    ];
    const compiler = webpack({
        entry: '../../src/EnableTransition.tsx',
        output: {
            path: path.join(__dirname, '../../dist'),
            filename: name,
            library: 'EnableTransition',
            libraryTarget: 'umd'
        },
        resolve: {
            extensions: ['.ts', '.tsx', '.js']
        },
        module: {
            rules: [
                {
                    test: /\.tsx?$/,
                    loader: 'babel-loader',
                    options: {
                        presets: [

                            [
                                '@babel/preset-env',
                                {
                                    'targets': {
                                        'browsers': ['ie >= 9', 'chrome >= 62'],
                                    }
                                }
                            ],
                            ['@babel/preset-react'],
                            [
                                "@babel/preset-typescript",
                                {
                                    "isTSX": true,
                                    "allExtensions": true
                                }
                            ],
                        ],
                        plugins: [
                            ["transform-remove-console", { "exclude": [ "error", "warn"] }],
                            [
                                "@babel/plugin-proposal-decorators",
                                {
                                    "legacy": true
                                }
                            ],
                            [
                                "@babel/plugin-proposal-class-properties",
                                {
                                    "loose": true
                                }
                            ],
                            [
                                "@babel/plugin-transform-runtime"
                            ]
                        ]
                    },
                    include: [
                        path.join(__dirname, '../../src'),
                    ]
                }
            ]
        },
        mode: 'production',
        optimization: {
            minimize: minimize
        },
        externals: {
            'react': "React",
            'react-dom': "ReactDOM",
        },
        plugins
    });
    compiler.run((err, stats) => {
        if (err || stats.hasErrors()) {
            // 在这里处理错误
            console.log(err, stats)
        }else{
            callback()
        }
        // 处理完成
    });
}

module.exports =function(){
    gulp.task('clean', async (done) => {
        await deleteFolder('../../dist');
        done()
    });
    gulp.task('webpack', (done) => {
        webpackCompile(false,`${pkg.name}.js`,done)
    });
    gulp.task('minimize', (done) => {
        webpackCompile(true,`${pkg.name}.min.js`,done)
    });
    gulp.task(
        'unpkg',
        gulp.series('clean',gulp.parallel( 'webpack','minimize'))
    );
    runTask('unpkg')

};
