const path = require('path');

module.exports = {
    entry: './src/app.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
    },
    devServer: {
        port: 8080,
        static: path.resolve(__dirname, 'dist')
    },
    mode: 'development'
}