var theme = '../themes/MetroMumbleLight'
var path = require('path');
var webpack = require('webpack');

module.exports = {
  mode: 'development',
  entry: {
    index: [
      './app/index.js',
      './app/index.html'
    ],
    config: './app/config.js',
    theme: './app/theme.js',
    matrix: './app/matrix.js',
    knockout: [
     // Inside file below there is 'require("knockout")'
     // invocation which webpack cannot resolve.
     // We need to tell webpack to not to resolve that
     // and leave 'require("knockout")' whithout any changes.
     // By that this code will be resolved on runtime
     // which means that we need to attach script to
     // knockout somewhere in project.
     "./knockout.mapping-latest.js",
    ]
  },
  devtool: "cheap-source-map",
  output: {
    path: path.join(__dirname, 'dist'),
    chunkFilename: '[chunkhash].js',
    filename: '[name].js'
  },
  plugins: [
      // This tells to webpack: if you'll find
      // somewhere in code 'require("knockout")'
      // don't try to resolve that. Leave it as is.
      new webpack.IgnorePlugin(/^knockout$/),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-transform-runtime']
          }
        }
      },
      {
        test: /\.html$/,
        use: [
          {
            loader: 'file-loader',
            options: { 'name': '[name].[ext]' }
          },
          {
            loader: "extract-loader"
          },
          {
            loader: 'html-loader',
            options: {
              attrs: ['img:src', 'link:href'],
              root: theme
            }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          'file-loader',
          'extract-loader',
          'css-loader'
        ]
      },
      {
        test: /\.scss$/,
        use: [
          'file-loader?name=[hash].css',
          'extract-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        type: 'javascript/auto',
        test: /manifest\.json$|\.xml$/,
        use: [
          'file-loader',
          'extract-loader',
          {
            loader: 'regexp-replace-loader',
            options: {
              match: {
                pattern: "#require\\('([^']*)'\\)",
                flags: 'g'
              },
              replaceWith: '"+require("$1")+"'
            }
          },
          'raw-loader'
        ]
      },
      {
        test: /\.(svg|png|ico)$/,
        use: [
          'file-loader'
        ]
      },
      {
        test: /worker\.js$/,
        use: { loader: 'worker-loader' }
      },
      {
        enforce: 'post',
        test: /mumble-streams\/lib\/data.js/,
        use: [
          'transform-loader?brfs'
        ]
      }
    ]
  },
  target: 'web'
}
