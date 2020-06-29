/**************************************************\
  setting environment variables
\**************************************************/

/** process.env.NODE_ENV (production | development) */
const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`NODE_ENV: ${NODE_ENV}`);

/** process.env.USE_CASE (prod | dev | serve) */
const USE_CASE = process.env.USE_CASE || 'serve';
console.log(`USE_CASE: ${USE_CASE}`);

/** process.env.PORT */
const PORT = process.env.PORT || 5000;
if (USE_CASE === 'serve') console.log(`PORT: ${PORT}`);

/**************************************************\
  require node modules
\**************************************************/

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const WebpackManifestPlugin = require('webpack-manifest-plugin');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const RemovePlugin = require('remove-files-webpack-plugin');

/**************************************************\
  common configs
  - config.mode
  - config.entry
  - config.resolve
\**************************************************/

/** webpack config */
const config = {
  mode: NODE_ENV,
  entry: './src/main.js',
  resolve: {
    symlinks: false
  }
};

/**************************************************\
  USE_CASE=prod only configs
  - config.performance.hints
  - config.optimization
\**************************************************/

if (USE_CASE === 'prod') {
  config.performance = {
    hints: 'error'
  };

  config.optimization = {
    minimizer: [
      new TerserPlugin(),
      new OptimizeCssAssetsPlugin()
    ]
  };
}

/**************************************************\
  USE_CASE=dev only configs
  - config.devtool
\**************************************************/

if (USE_CASE === 'dev') {
  config.devtool = 'source-map';
}

/**************************************************\
  USE_CASE=serve only configs
  - config.devServer
\**************************************************/

if (USE_CASE === 'serve') {
  config.devServer = {
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
  };

  if ('SSL_KEY' in process.env && 'SSL_CRT' in process.env && 'SSL_PEM' in process.env) {
    console.log('HTTPS: true');
    config.devServer.https = {
      key: fs.readFileSync(process.env.SSL_KEY),
      cert: fs.readFileSync(process.env.SSL_CRT),
      ca: fs.readFileSync(process.env.SSL_PEM)
    };
  } else if (process.env.SSL === 'true') {
    console.log('HTTPS: true');
    config.devServer.https = true;
  } else {
    console.log('HTTPS: false');
  }
}

/**************************************************\
  config.output
\**************************************************/

switch (USE_CASE) {
  case 'prod':
    config.output = {
      path: path.resolve(__dirname, '../build-prod'),
      filename: '[contenthash:5].js'  
    };
    break;
    
    case 'dev':
    config.output = {
      path: path.resolve(__dirname, '../build-dev'),
      filename: '[name].[contenthash:5].js'  
    };
    break;

  case 'serve':
    config.output = {
      filename: '[name].js'
    };
    break;
}

/**************************************************\
  config.plugins
\**************************************************/

/** HtmlWebpackPlugin options */
const htmlWebpackPluginOptions = {
  inject: false,
  template: './src/ejs-template/index.ejs'
};

/** MiniCssExtractPlugin options */
const miniCssExtractPluginOptions = {};

switch (USE_CASE) {
  case 'prod':
    htmlWebpackPluginOptions.title = 'Meme Party';
    miniCssExtractPluginOptions.filename = '[contenthash:5].css';
    break;

  case 'dev':
    htmlWebpackPluginOptions.title = 'Development - Meme Party';
    miniCssExtractPluginOptions.filename = '[name].[contenthash:5].css';
    break;
  
  case 'serve':
    htmlWebpackPluginOptions.title = 'Server - Meme Party';
    miniCssExtractPluginOptions.filename = '[name].css';
    break;
}

/** WebpackManifestPlugin options */
const webpackManifestPluginOptions = {};

if (USE_CASE === 'prod') webpackManifestPluginOptions.filename = '../build-manifests/prod-all.json';
if (USE_CASE === 'dev') webpackManifestPluginOptions.filename = '../build-manifests/dev-all.json';

/** WebpackAssetsManifest options */
const webpackAssetsManifestOptions = {};

if (USE_CASE === 'prod') webpackAssetsManifestOptions.output = '../build-manifests/prod-hashed.json';
if (USE_CASE === 'dev') webpackAssetsManifestOptions.output = '../build-manifests/dev-hashed.json';

/** RemovePlugin options */
const removePluginOptions = {}

if (USE_CASE === 'prod' || USE_CASE === 'dev') removePluginOptions.before = {
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
};

if (USE_CASE === 'prod') removePluginOptions.before.root = './build-prod';
if (USE_CASE === 'dev') removePluginOptions.before.root = './build-dev';

/** config.plugins */
config.plugins = [];

config.plugins.push(
  new HtmlWebpackPlugin(htmlWebpackPluginOptions),
  new MiniCssExtractPlugin(miniCssExtractPluginOptions)
);

(USE_CASE === 'serve') ?
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  ):
  config.plugins.push(
    new WebpackManifestPlugin(webpackManifestPluginOptions),
    new WebpackAssetsManifest(webpackAssetsManifestOptions),
    new RemovePlugin(removePluginOptions)
  );

/**************************************************\
  config.module.rules
\**************************************************/

/** config.module.rules[0] - process (.js) */
const jsRule = {
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
};

/** config.module.rules[1] - process (.scss) */
const scssRule = {
  test: /\.scss$/i,
  include: path.resolve(__dirname, '../src'),
  use: []
};

if (USE_CASE === 'prod') scssRule.sideEffects = true;

/** MiniCssExtractPlugin.loader */
const miniCssExtractPluginLoader = {
  loader: MiniCssExtractPlugin.loader
};

if (USE_CASE === 'serve') miniCssExtractPluginLoader.options = {
  hmr: true
}

/** css-loader */
const cssLoader = {
  loader: 'css-loader', 
  options: { 
    importLoaders: 2
  }
};

(USE_CASE === 'prod') ?
  cssLoader.options.modules = {
    localIdentName: '[sha1:hash:base64:5]'
  }:
  cssLoader.options.modules = {
    localIdentName: '[local]-[sha1:hash:base64:5]'
  };

/** postcss-loader */
const postCssLoader = {
  loader: 'postcss-loader',
  options: {
    ident: 'postcss',
    plugins: [
      require('postcss-import'),
      require('postcss-preset-env'),
      require('autoprefixer')
    ]
  }
};

/** sass-loader */
const sassLoader = {
  loader: 'sass-loader',
};

if (USE_CASE === 'prod') sassLoader.options = {
  sassOptions: {
    minimize: false,
    outputStyle: 'expanded'
  }
};

/** config.module.rules[1].use */
scssRule.use.push(
  miniCssExtractPluginLoader,
  cssLoader,
  postCssLoader,
  sassLoader
);

/** config.module.rules[2] - process (.png | .jpg) */
const imageRule = {
  test: /\.(png|jpg)$/i,
  include: path.resolve(__dirname, '../src'),
  loader: 'file-loader',
  options: {
    outputPath: 'images',
    esModule: false
  }
};

/** config.module.rules[3] - process (.woff | .woff2) */
const fontRule = {
  test: /\.(woff|woff2)$/i,
  include: path.resolve(__dirname, '../src'),
  loader: 'file-loader',
  options: {
    outputPath: 'fonts',
    esModule: false
  }
};

switch (USE_CASE) {
  case 'prod':
    imageRule.options.name = '[sha1:contenthash:base64:5].[ext]';
    fontRule.options.name = '[sha1:contenthash:base64:5].[ext]';
    break;

  case 'dev':
    imageRule.options.name = '[name].[sha1:contenthash:base64:5].[ext]';
    fontRule.options.name = '[name].[sha1:contenthash:base64:5].[ext]';
    break;

  case 'serve':
    imageRule.options.name = '[name].[ext]';
    fontRule.options.name = '[name].[ext]';
    break;
}

/** config.module.rules */
config.module = {
  rules: [
    jsRule,
    scssRule,
    imageRule,
    fontRule
  ]
};

/** export webpack configs */
(process.env.SEE_RUN === 'true') ?
  module.exports = {
    USE_CASE,
    config,
    htmlWebpackPluginOptions,
    miniCssExtractPluginOptions,
    webpackManifestPluginOptions,
    webpackAssetsManifestOptions,
    removePluginOptions,
    jsRule,
    scssRule,
    imageRule,
    fontRule
  }:
  module.exports = config;