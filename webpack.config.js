const path = require('path')

module.exports = {
    mode: process.env.NODE_ENV.trim(),
    entry: './libs/dov.js',
    output: {
        filename: process.env.NODE_ENV === 'development' ? 'dov.js' : 'dov.min.js',
        path: path.resolve(__dirname, 'dist'),
        library: "dov",
        libraryTarget: "umd"
    },
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                include: [path.resolve(__dirname, "./libs")]
            }
        ]
    }
}
