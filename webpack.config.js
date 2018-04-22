const path = require('path');
const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/js/main.js',
  devtool: 'source-map',
  devServer: {
    contentBase: path.join(__dirname, 'build'),
    hot: false
  },
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.js?$/,
        exclude: /(node_modules)/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1
              }
            },
            {
              loader: 'postcss-loader',
              options: {
                plugins: () => [require('autoprefixer')],
                sourceMap: false
              }
            },
            'stylus-loader'
          ]
        })
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin(['build']),
    new ExtractTextPlugin('[name].min.css'),
    new HtmlWebpackPlugin({
      title: 'dropdown',
      template: './public/index.html'
    })
  ],

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name].min.js'
  }
};
