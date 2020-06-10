// check mode
console.log(`ENV: ${process.env.NODE_ENV}`);

// set port
const PORT = process.env.PORT || 5000;
console.log(`PORT: ${PORT}`);

// load node modules
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');

// set server settings
const serverSettings = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: '[name].js'
  },
  resolve: {
    symlinks: false
  },
  devServer: {
    contentBase: false,
    hot: true,
    port: PORT,
    compress: true,
    stats: 'errors-warnings',
    overlay: {
      warnings: true,
      errors: true
    },
    before: (app, server, compiler) => {
      server._watch('./src/ejs-template/index.ejs');
    }
  },
  plugins: [
    new htmlWebpackPlugin({
      title: 'Server - Meme Party',
      inject: false,
      template: './src/ejs-template/index.ejs'
    }),
    new miniCssExtractPlugin({
      filename: '[name].css'
    }),
    new webpack.HotModuleReplacementPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.js$/i,
        include: path.resolve(__dirname, '../src'),
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env'
            ],
            plugins: [
              '@babel/plugin-transform-runtime'
            ]
          }
        }
      },
      {
        test: /\.scss$/i,
        include: path.resolve(__dirname, '../src'),
        use: [
          {
            loader: miniCssExtractPlugin.loader,
            options: {
              hmr: true
            }
          },
          { 
            loader: 'css-loader', 
            options: { 
              importLoaders: 2, 
              modules: {
                localIdentName: 'from-[name]__class-[local]'
              }
            }
          }, 
          { 
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('postcss-import'),
                require('postcss-preset-env'),
                require('autoprefixer')
              ]
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.(png|jpg)$/i,
        include: path.resolve(__dirname, '../src'),
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'images',
          esModule: false
        }
      },
      {
        test: /\.(woff|woff2)$/i,
        include: path.resolve(__dirname, '../src'),
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
          outputPath: 'fonts',
          esModule: false
        }
      }
    ]
  }
};

// set ssl
(() => {
  if ('SSL_KEY' in process.env && 'SSL_CRT' in process.env && 'SSL_PEM' in process.env) {
    console.log('HTTPS: true');
    serverSettings.devServer.https = {
      key: fs.readFileSync(process.env.SSL_KEY),
      cert: fs.readFileSync(process.env.SSL_CRT),
      ca: fs.readFileSync(process.env.SSL_PEM)
    };
    return;
  }
  if (process.env.SSL === 'true') {
    console.log('HTTPS: true');
    serverSettings.devServer.https = true;
    return;
  }
  console.log('HTTPS: false');
})();

// export server settings
module.exports = serverSettings;