// 解决 Ubuntu on Windows 上使用 webpack 出错：ERROR in EINVAL: invalid argument, uv_interface_addresses
try {
  require('os').networkInterfaces();
} catch (e) {
  require('os').networkInterfaces = () => ({});
}

var path = require('path');
var webpack = require('webpack');
var CopyWebpackPlugin = require('copy-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {
  cache: true,
  devtool: 'source-map',
  entry: {
    index: './src/containers/index',
  },
  output: {
    path: path.join(__dirname, 'app'),
    filename: '[name].js',
    chunkFilename: '[chunkhash].js',
    sourceMapFilename: '[name].map'
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src'),
        ],
        test: /\.js|\.jsx?$/,
        query: {
          presets: ['es2015', 'react']
        }
      }, {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!sass-loader'),
        exclude: /node_modules/
      }, {
        test: /\.(png|jpg|jpeg|gif)$/,
        loader: 'url-loader?limit=10000'
      }, {
        test: /\.(ttf|eot|svg|woff)?$/,
        loader: "url-loader?limit=10000&name=fonts/[name]-[hash].[ext]&context=static",
      },
    ]
  },
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin("[name].css"),
    //new webpack.optimize.UglifyJsPlugin({comments: false}),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('development')
      }
    }),
    new CopyWebpackPlugin([
      {from: path.resolve(__dirname, 'src/index.html'), to: 'index.html'},
      {from: path.resolve(__dirname, 'src/main.js'), to: 'main.js'},
      {from: path.resolve(__dirname, 'package.json'), to: 'package.json'},
      {from: path.resolve(__dirname, 'src/assets'), to: 'assets'},
    ])
  ]
};
