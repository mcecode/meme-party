// check mode
console.log(`ENV: ${process.env.NODE_ENV}`);

// load node modules
const path = require('path');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const optimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const terserPlugin = require('terser-webpack-plugin');
const webpackManifestPlugin = require('webpack-manifest-plugin');
const webpackAssetsManifest = require('webpack-assets-manifest');
const removePlugin = require('remove-files-webpack-plugin');

// prod settings
const productionSettings = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, '../build-prod'),
    filename: '[contenthash:5].js'
  },
  resolve: {
    symlinks: false
  },
  performance: {
    hints:'error'
  },
  optimization: {
    minimizer: [
      new terserPlugin(),
      new optimizeCssAssetsPlugin()
    ]
  },
  plugins: [
    new htmlWebpackPlugin({
      title: 'Meme Party',
      inject: false,
      template: './src/ejs-template/index.ejs'
    }),
    new miniCssExtractPlugin({
      filename: '[contenthash:5].css'
    }),
    new webpackManifestPlugin({ 
      fileName: '../build-manifests/prod-all.json'
    }),
    new webpackAssetsManifest({ 
      output: '../build-manifests/prod-hashed.json'
    }),
    new removePlugin({ 
      before: { 
        root: './build-prod',
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
        sideEffects: true,
        use: [
          miniCssExtractPlugin.loader,
          { 
            loader: 'css-loader', 
            options: { 
              importLoaders: 2, 
              modules: {
                localIdentName: '[sha1:hash:base64:5]'
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
          name: '[sha1:contenthash:base64:5].[ext]',
          outputPath: 'images',
          esModule: false
        }
      },
      {
        test: /\.(woff|woff2)$/i,
        include: path.resolve(__dirname, '../src'),
        loader: 'file-loader',
        options: {
          name: '[sha1:contenthash:base64:5].[ext]',
          outputPath: 'fonts',
          esModule: false
        }
      }
    ]
  }
};

// export prod settings
module.exports = productionSettings;