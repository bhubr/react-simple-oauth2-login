const path = require('path');
const webpack = require('webpack');
const CopyWebpackplugin = require('copy-webpack-plugin');

module.exports = {
  devtool: 'cheap-module-source-map',
  entry: [
    './src/index.js',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'OAuth2Login.js',
    libraryTarget: 'umd',
    library: 'OAuth2Login',
  },
  module: {
    rules: [{
      use: 'babel-loader',
      test: /\.jsx?$/,
      exclude: /node_modules/,
    }],
  },
  externals: {
    react: 'react',
    'react-dom': 'ReactDOM',
  },
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production'),
      },
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true,
      debug: false,
    }),
    new CopyWebpackplugin({
      patterns: [
        { from: './src/index.d.ts', to: './OAuth2Login.d.ts' },
      ],
    }),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
};
