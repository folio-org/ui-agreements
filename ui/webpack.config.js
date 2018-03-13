const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
var DashboardPlugin = require('webpack-dashboard/plugin');
var webpack = require('webpack');

// Load in defaults and extend.
const babelConf = {
  cacheDirectory: true,
  plugins: [
    require("react-hot-loader/babel"),
    require('babel-plugin-syntax-async-functions'),
    require("babel-plugin-transform-decorators-legacy").default,
  ],
  presets: [
    [require.resolve('babel-preset-env'), {
      modules: false,
      targets: {
        browsers: 'last 2 versions'
      }
    }],
    [require.resolve('babel-preset-stage-2')],
    [require.resolve('babel-preset-react')],
  ],
};


module.exports = [{
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist/@olf/erm-stripes'),
    filename: 'erm.min.js',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/package.json' }
    ]),
    new webpack.NamedModulesPlugin(),
  ],
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules(?!\/\@folio)/,
      use: {
        loader: 'babel-loader',
        options: babelConf
      },
    },{
      test: /\.css$/,
      use: [
        {
          loader: 'style-loader'
        },
        {
          loader: 'css-loader'
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: function () {
              return [
                require('postcss-import'),
                require('postcss-url'),
                require("autoprefixer"),
                require("postcss-custom-properties"),
                require("postcss-calc"),
                require("postcss-nesting"),
                require("postcss-custom-media"),
                require("postcss-media-minmax"),
                require("postcss-color-function"),
//                require('postcss-prefixwrap')('.kint')
              ];
            }
          }
        }
      ]
    }]
  },
  externals: {
    'react': {
      commonjs: 'react',
      commonjs2: 'react',
      amd: 'react',
      root: 'React'
    }
  }
}];