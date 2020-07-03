/**************************************************\
  Setting environment variables
\**************************************************/

/** Current environment mode, can be (production | development) */
const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`NODE_ENV: ${NODE_ENV}`);

/** Current run use case, can be (prod | dev | serve) */
const USE_CASE = process.env.USE_CASE || 'serve';
console.log(`USE_CASE: ${USE_CASE}`);

/** Port where webpack-dev-server runs */
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
const WebpackAssetsManifest = require('webpack-assets-manifest');
const RemovePlugin = require('remove-files-webpack-plugin');

/**************************************************\
  Common configs for all use cases
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
\**************************************************/

if (USE_CASE === 'prod') {
  config.performance = {
    hints: 'error'
  };

  config.optimization = {
    // When adding minimizers for other file types TerserPlugin needs to be set again because it is overriden
    minimizer: [
      new TerserPlugin(),
      new OptimizeCssAssetsPlugin()
    ]
  };
}

/**************************************************\
  USE_CASE=dev only configs
\**************************************************/

if (USE_CASE === 'dev') {
  config.devtool = 'source-map';
}

/**************************************************\
  USE_CASE=serve only configs
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
      // Reloads the server when changes are made to the ejs template
      // This is the easiest way I found how to do it
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
      path: path.resolve(__dirname, './build-prod'),
      filename: '[contenthash:5].js'  
    };
    break;
    
  case 'dev':
    config.output = {
      path: path.resolve(__dirname, './build-dev'),
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

/** Options passed to HtmlWebpackPlugin */
const htmlWebpackPluginOptions = {
  inject: false,
  template: './src/ejs-template/index.ejs'
};

/** Options passed to MiniCssExtractPlugin */
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

/** Options passed to WebpackAssetsManifest */
const webpackAssetsManifestOptions = {};

if (USE_CASE === 'prod') webpackAssetsManifestOptions.output = '../build-manifests/prod-manifest.json';
if (USE_CASE === 'dev') webpackAssetsManifestOptions.output = '../build-manifests/dev-manifest.json';

/** Options passed to RemovePlugin */
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
          return /\.(html|css|js|json|map)$/im.test(absoluteItemPath);
      }
    }
  ]
};

if (USE_CASE === 'prod') removePluginOptions.before.root = './build-prod';
if (USE_CASE === 'dev') removePluginOptions.before.root = './build-dev';

// Putting config.plugins together
config.plugins = [
  new HtmlWebpackPlugin(htmlWebpackPluginOptions),
  new MiniCssExtractPlugin(miniCssExtractPluginOptions)
];

(USE_CASE === 'serve') ?
  config.plugins.push(
    new webpack.HotModuleReplacementPlugin()
  ):
  config.plugins.push(
    new WebpackAssetsManifest(webpackAssetsManifestOptions),
    new RemovePlugin(removePluginOptions)
  );

/**************************************************\
  config.module.rules
\**************************************************/

/** config.module.rules[0] - processes (.js) files */
const jsRule = {
  test: /\.js$/i,
  include: path.resolve(__dirname, './src'),
  exclude: /node_modules/,
  loader: 'babel-loader',
  options: {
    presets: [
      '@babel/preset-env'
    ],
    plugins: [
      '@babel/plugin-transform-runtime'
    ]
  }
};

/** config.module.rules[1] - processes (.scss) files */
const scssRule = {
  test: /\.scss$/i,
  include: path.resolve(__dirname, './src'),
};

// Specifies during production builds that anything processed by scssRule has side effects
// This is to avoid global styles being tree shaken
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
      require('postcss-preset-env')({
        stage: 0
      }),
      require('autoprefixer')()
    ]
  }
};

/** sass-loader */
const sassLoader = {
  loader: 'sass-loader',
};

// Turns off sass-loader minification during production builds
// This is because I want OptimizeCssAssetsPlugin to be the main/only minifier for CSS
if (USE_CASE === 'prod') sassLoader.options = {
  sassOptions: {
    minimize: false,
    outputStyle: 'expanded'
  }
};

// Putting scssRule.use together
scssRule.use = [
  miniCssExtractPluginLoader,
  cssLoader,
  postCssLoader,
  sassLoader
];

/** config.module.rules[2] - processes (.png | .jpg) files */
const imageRule = {
  test: /\.(png|jpg)$/i,
  include: path.resolve(__dirname, './src'),
  loader: 'file-loader',
  options: {
    outputPath: 'images',
    // file-loader using ES Modules interferes with HtmlWebpackPlugin templates using CommonJS
    // This is beacuse HtmlWebpackPlugin cannot use ES Modules right now
    esModule: false
  }
};

/** config.module.rules[3] - processes (.woff | .woff2) files */
const fontRule = {
  test: /\.(woff|woff2)$/i,
  include: path.resolve(__dirname, './src'),
  loader: 'file-loader',
  options: {
    outputPath: 'fonts',
    // file-loader using ES Modules interferes with HtmlWebpackPlugin templates using CommonJS
    // This is beacuse HtmlWebpackPlugin cannot use ES Modules right now
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

// Putting config.module.rules together
config.module = {
  rules: [
    jsRule,
    scssRule,
    imageRule,
    fontRule
  ]
};

// export webpack configs
// exports additional data if used by ./webpack-log-config.js to show configs in the terminal
// exports just the config if used by webpack for compilation
(process.env.SEE_RUN === 'true') ?
  module.exports = {
    USE_CASE,
    config,
    htmlWebpackPluginOptions,
    miniCssExtractPluginOptions,
    webpackAssetsManifestOptions,
    removePluginOptions,
    jsRule,
    scssRule,
    imageRule,
    fontRule
  }:
  module.exports = config;