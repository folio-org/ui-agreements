/**
 * This webpack file is for the build process only. As it produces a stand alone module without
 * that can be plugged into the stripes build process.
 * 
 */
const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');
var webpack = require('webpack');

const postCssImport = require('postcss-import')
const autoprefixer = require('autoprefixer')
const postCssCustomProperties = require('postcss-custom-properties')
const postCssCalc = require('postcss-calc')
const postCssNesting = require('postcss-nesting')
const postCssCustomMedia = require('postcss-custom-media')
const postCssMediaMinMax = require('postcss-media-minmax')
const postCssColorFunction = require('postcss-color-function')

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
      test: /\.(scss)$/,
      use: [
        {
          loader: 'style-loader',
          options: {
            sourceMap: true,
          }
        },
        {
          loader: 'css-loader',
          options: {
            sourceMap: true,
          }
        },
        {
          loader: 'postcss-loader',
          options: {
            plugins: function () {
              return [
                postCssImport(),
                autoprefixer(),
                postCssCustomProperties(),
                postCssCalc(),
                postCssNesting(),
                postCssCustomMedia(),
                postCssMediaMinMax(),
                postCssColorFunction()
              ];
            },
            sourceMap: true,
          }
        },
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          }
        }
      ]
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
                postCssImport(),
                autoprefixer(),
                postCssCustomProperties(),
                postCssCalc(),
                postCssNesting(),
                postCssCustomMedia(),
                postCssMediaMinMax(),
                postCssColorFunction()
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