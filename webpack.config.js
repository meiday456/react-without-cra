const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin'); //사용하려는 플러그인 import
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const path = require('path');

// __filename : 현재 실행중인 파일 경로
// __dirname : 현재 실행중인 폴더 경로


module.exports = (env, argv) => {
    const isProduct = argv.mode === "production"
    return {
        mode : isProduct ? "production":"development",
        // devtool : "eval-source-map",
        devtool: 'inline-source-map', //이것도 문제가 이님
        entry: "./src/index.tsx",
        target: 'web',                  //엡이 실행될 위치(환경) 지정
        output: {
            path: path.join(__dirname, "/dist"),
            filename: 'bundle.[hash].js',
        },
        devServer: {
            port: '5100',               //port 5000으로 open
            static: {
                directory: path.join(__dirname, 'public')   //정적 파일 사용 디렉토리 위치 지정
            },
            open: true,                 //브라우저가 우리의 파일을 번들한 후 자동으로 열기
            hot: true,                  //AP 구동중 module 교체 , 추가, 제거에 대해서 전체 리로드없이 가능하게 하는옵션
            liveReload: true,           //자동으로 화면에서 reload하는 설정
        },
        resolve: {
            extensions: ['.tsx', '.ts', '.js', '.jsx', '.json'],
        },
        module: {
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
                    use: [{loader: 'style-loader'}, {loader: 'css-loader'}]   //webpack은 배열의 마지막 부터 번들링에 반영한다.
                },
                {
                    test: /\.(ts|tsx)$/,
                    use: ["babel-loader", "ts-loader"],
                },
            ],
        },
        // plugins: [
        //     new webpack.ProvidePlugin({
        //         React: "react",
        //     }),
        //     new HtmlWebpackPlugin({
        //         template: './public/index.html',
        //         minify: process.env.NODE_ENV === 'production' ? {
        //             collapseWhitespace: true, // 빈칸 제거
        //             removeComments: true, // 주석 제거
        //         } : false,
        //     }),
        //     new CleanWebpackPlugin(),
        // ],
        plugins: [  //webpack과 함께 사용할 플러그인을지정
            new CleanWebpackPlugin(),
            new HtmlWebpackPlugin({
                template: path.join(__dirname, 'public', 'index.html')
            }),
            new webpack.DefinePlugin({
                mode: process.env.mode,
                port: process.env.port
            })
        ]
    }
};