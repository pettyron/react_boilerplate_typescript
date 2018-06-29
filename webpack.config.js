const path = require('path')
const webpack = require('webpack')
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const autoprefixer = require('autoprefixer')
const cssnano = require('cssnano')

const postcss = {
    loader: 'postcss-loader',
    options: {
        plugins() {
            return [
                autoprefixer({browsers: 'last 3 versions'}),
                cssnano({autoprefixer: false, zindex: false})
            ]
        }
    }
}

module.exports = {
  entry: './src/index.tsx',
  module: {
    rules: [{
      test: /\.tsx?$/,
      use: [
        { loader: 'ts-loader' },
        { loader: 'tslint-loader' }
      ],
      exclude: /node_modules/
    }, {
      test: /\.scss?$/,
      use: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: ['css-loader', postcss, 'sass-loader?includePaths[]=' + path.resolve(__dirname, 'node_modules')]
      })
    }]
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx']
  },
  devtool: 'cheap-source-map',
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].bundle.css'
    })
  ],
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  }
}

if (process.env.NODE_ENV === 'development') {
  module.exports.plugins = (module.exports.plugins || []).concat([
    new BrowserSyncPlugin({
        server: './',
        browser: 'chrome.exe',
        open: true,
        notify: false,
        files: ['*.html', './src/**/*.tsx', './src/scss/*'],
        injectChanges: true,
        reloadDelay: 500,
        watch: true
    }),
    new webpack.optimize.UglifyJsPlugin({
      output: { comments: false, beautify: true },
      mangle: false,
      compress: false,
      sourceMap: true
    })
  ])
}
