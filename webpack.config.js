const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin'); //사용하려는 플러그인 import
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// __filename : 현재 실행중인 파일 경로
// __dirname : 현재 실행중인 폴더 경로


const importPlugins = (isProduct) => {

    const plugins = []

    if (isProduct) {
        plugins.push(
            new MiniCssExtractPlugin({
                filename: 'css/[name].[contenthash:8].css',
            }))
    } else {

        const handler = (percentage, message, ...args) => {
            console.info(percentage, message, ...args);
        };

        plugins.push(new webpack.ProgressPlugin(handler))
        plugins.push(new webpack.HotModuleReplacementPlugin())
        plugins.push(new ReactRefreshWebpackPlugin({overlay: false}))
    }

    return plugins
}


module.exports = (env, argv) => {
    const isProduct = argv.mode === "production"
    return {
        mode: isProduct ? "production" : "development",
        // devtool : "eval-source-map",
        devtool: isProduct ? 'source-map' : 'eval-cheap-source-map',
        entry: ["./src/index.tsx"],       //의존 그래프의 시작점 / 엔트리를 통해서 필요한 모듈을 로딩하고, 하나의 파일로 묵는다.
        target: 'web',                  //엡이 실행될 위치(환경) 지정
        output: {//언트리에 설정한 자바스크립트 파일을 시작으로 하나로 묶어주고, 번들 결과를 처리할 위치 정보를 설정한다.
            path: path.join(__dirname, "/dist"),
            filename: isProduct ? 'js/[name].[contenthash:8].js' : 'js/[name].bundle.js',
            assetModuleFilename: 'media/[name][ext]',//asset file 의 명칭을 그대로 사용한다.
            clean: true
        },
        devServer: {
            port: '5100',
            compress: true,
            static: {
                directory: path.join(__dirname, 'public')   //정적 파일 사용 디렉토리 위치 지정
            },
            open: 'Google Chrome',                 //브라우저가 우리의 파일을 번들한 후 자동으로 열기
            hot: true,                  //AP 구동중 module 교체 , 추가, 제거에 대해서 전체 리로드없이 가능하게 하는옵션
            liveReload: true,           //자동으로 화면에서 reload하는 설정
        },
        resolve: {
            modules: ['node_modules'],
            extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
        },
        module: {       //Loader 웹팩은 오직 javascript와 json 만을 이해한다,
            //로더는 다른 type의 파일 jpg, svg, css, font 등을 웹팩이 이해하고 처리 가능한 모듈로 변환시키는 작업을 한다.
            rules: [
                {                       //이 설정은 webpack이 .js 파일과 .jsx 파일을에 도달했을때 , babel-loader를 사용한다는 의미
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,// js, jsx 파일을 제외하는 디렉토리
                    use: {//어떠한 것을 사용항지 명시
                        loader: 'babel-loader',
                        options: {
                            presets: [//아래의 runtime 옵션을 automatic으로 안하면 , react import 가 안됨
                                //classic 과 automatic이 있는데 , default classic ,
                                //automatic은 jsx를 변환하는 함수를 가져온다고한다, classic은 아무것도 안가져옴
                                "@babel/preset-env", ["@babel/preset-react", {"runtime": "automatic"}]
                            ]
                        }
                    },
                },
                {
                    test: /\.css$/,
                    use: [
                        !isProduct && {loader: 'style-loader'},
                        isProduct &&
                            {loader: MiniCssExtractPlugin.loader , options : { publicPath: '' }},
                        {loader: 'css-loader'},
                        {loader: require.resolve('postcss-loader'),}
                    ].filter(Boolean)   //webpack은 배열의 마지막 부터 번들링에 반영한다.
                },
                {
                    test: /\.s[ac]ss$/i,
                    use: [
                        "style-loader",
                        "css-loader",
                        "sass-loader"
                    ]
                },
                // {
                //     test: /\.(ico|png|svg|jpg|jpeg|gif|woff|woff2|eot|ttf|otf)$/,
                //     type: 'asset/resource'
                // },
                {
                    test: /\.(eot|woff|woff2|ttf)$/,
                    use : {
                        loader : 'url-loader',
                        options : {
                            limit : 30000,
                            name : '[name]-[hash].[ext]'
                        }
                    }
                },
                {
                    test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                    type: 'asset'
                    // use: {
                    //     loader: 'url-loader',
                    //     options: {
                    //         publicPath: '/dist/media',
                    //         name: '/media/[name][ext]',
                    //         limit: 50000
                    //     }
                    // },
                },
                {
                    test: /\.(ts|tsx)$/,
                    // use: ["babel-loader", "ts-loader"],
                    exclude: /node_modules/,
                    loader: require.resolve("babel-loader"),
                    // options: {
                    //     plugins: [
                    //         !isProduct && require.resolve("react-refresh/babel"),
                    //     ].filter(Boolean),
                    // }
                },
                {
                    test: /\.(jpeg|png|ico)$/,
                    loader: "file-loader",
                    options: {
                        publicPath: "./",
                        name: "[name].[ext]"
                    }
                }

            ],
        },
        plugins: [  //webpack과 함께 사용할 플러그인을지정
            //로더가 파일 단위로 처리하는 반면 플러그인은 번들된 결과물을 처리한다.
            //로더가 변환하는 동안, 플러그인은 bundle optimaization ,
            // asset management and injection of environment 과 같은 일을 진행할 수 있다.
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'public', 'index.html'),
                favicon: path.resolve(__dirname, 'public', 'favicon.ico')
            }),
            new webpack.DefinePlugin({//자바스크립트 코드에서 접근이 가능한 전역변수를 선언하기 위해 사용된다
                mode: process.env.mode,
                port: process.env.port,
                NODE_ENV: process.env.mode,
            }),
            new BundleAnalyzerPlugin(),
            // new CleanWebpackPlugin(),
            ...importPlugins(isProduct)
        ].filter(Boolean),
        optimization: {
            minimize: isProduct,
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    terserOptions: {
                        // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
                    },
                }),
            ],
            //모듈 id 를 선택할때의 알고리즘 선택,
            moduleIds: 'deterministic',//모듈 이름을 작은 숫자 값으로 해시한다.
            runtimeChunk: 'single',//단일 HTML 페이지에 하나이상의 엔트리 포인트가 있기 때문
            splitChunks: { //vendor 청크를 따로 분류
                cacheGroups: {
                    vendor: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                        chunks: 'all'
                    }
                }
            },
            removeEmptyChunks: true,
        }
    }
};