// check mode
console.log(`ENV: ${process.env.NODE_ENV}`);

// load node modules
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const webpackManifestPlugin = require('webpack-manifest-plugin');
const webpackAssetsManifest = require('webpack-assets-manifest');
const removePlugin = require('remove-files-webpack-plugin');

// dev settings
const developmentSettings = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '../build-dev'),
    filename: '[name].[contenthash:5].js'
  },
  devtool: 'source-map',
  resolve: {
    symlinks: false
  },
  plugins: [
    new htmlWebpackPlugin({
      title: 'Development - Meme Party',
      inject: false,
      template: './src/ejs-template/index.ejs'
    }),
    new miniCssExtractPlugin({
      filename: '[name].[contenthash:5].css'
    }),
    new webpackManifestPlugin({ 
      fileName: '../build-manifests/dev-all.json'
    }),
    new webpackAssetsManifest({ 
      output: '../build-manifests/dev-hashed.json'
    }),
    new removePlugin({ 
      before: { 
        root: './build-dev',
        include: [
          './fonts',
          './images'
        ],
        test: [
          {
            folder: '.',
            method: (absoluteItemPath) => {
                return new RegExp(/\.(html|css|js|json|map)$/i, 'm').test(absoluteItemPath);
            }
          }
        ]
      } 
    })
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
          miniCssExtractPlugin.loader,
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
          name: '[name].[sha1:contenthash:base64:5].[ext]',
          outputPath: 'images',
          esModule: false
        }
      },
      {
        test: /\.(woff|woff2)$/i,
        include: path.resolve(__dirname, '../src'),
        loader: 'file-loader',
        options: {
          name: '[name].[sha1:contenthash:base64:5].[ext]',
          outputPath: 'fonts',
          esModule: false
        }
      }
    ]
  }
};

// export dev settings
module.exports = developmentSettings;