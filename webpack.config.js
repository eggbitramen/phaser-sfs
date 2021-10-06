const CopyPlugin = require('copy-webpack-plugin');
const CopyWebpack = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                {
                    from: './index.html',
                    to: path.resolve(__dirname, 'dist')
                },
                {
                    from: 'src/assets',
                    to: path.resolve(__dirname, 'dist/assets')
                }
            ]
        })
    ],
    devServer: {
        port: 8080,
        static: path.resolve(__dirname, 'dist')
    },
    mode: 'development'
}