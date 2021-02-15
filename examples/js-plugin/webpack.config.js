const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Development',
    })
  ],
  devServer: {
    port: 8083
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js-plugin.js',
    library: 'jsPlugin',
    libraryTarget: 'umd',
    publicPath: 'http://localhost:8083/'
  },
};