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
      // Tests for and removes any HTML, CSS, JS, JSON, map files in the build folder
      method: (absoluteItemPath) => {
          return new RegExp(/\.(html|css|js|json|map)$/i, 'm').test(absoluteItemPath);
      }
    }
  ]
};

if (USE_CASE === 'prod') removePluginOptions.before.root = './build-prod';
if (USE_CASE === 'dev') removePluginOptions.before.root = './build-dev';

config.plugins = [];

// Common plugins between all use cases
config.plugins.push(
  new HtmlWebpackPlugin(htmlWebpackPluginOptions),
  new MiniCssExtractPlugin(miniCssExtractPluginOptions)
);

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
  /** Includes all modules that pass test assertion */
  test: /\.js$/i,

  /** Includes all modules matching any of these conditions */
  include: path.resolve(__dirname, './src'),

  /** Excludes all modules matching any of these conditions */
  exclude: /node_modules/,

  /** Specifies loader/s to be used */
  use: {
    /** Transpiles and polyfills newer ECMAScript into a backwards compatible version of JavaScript */
    loader: 'babel-loader',

    /** Options passed to the loader */
    options: {
      /** A preset set of plugins */
      presets: [
        /** Allows the use of the latest JavaScript without needing to micromanage which syntax to transform */
        '@babel/preset-env'
      ],
// ! WHAT DO I DO?
      plugins: [
        /** Enables the re-use of Babel's injected helper code to save on codesize */
        '@babel/plugin-transform-runtime'
      ]
    }
  }
};

/** config.module.rules[1] - processes (.scss) files */
const scssRule = {
  test: /\.scss$/i,
  include: path.resolve(__dirname, './src'),
  use: []
};

// Specifies that the CSS file emitted has side effects during production to avoid it being tree shaken
if (USE_CASE === 'prod') scssRule.sideEffects = true;

/** MiniCssExtractPlugin.loader - emits a CSS file from the processed SCSS files */
const miniCssExtractPluginLoader = {
  loader: MiniCssExtractPlugin.loader
};

// Turns on HMR for MiniCssExtractPlugin.loader when running webpack-dev-server
if (USE_CASE === 'serve') miniCssExtractPluginLoader.options = {
  hmr: true
}

/** css-loader - interprets @import and url() like import/require() and will resolve them */
const cssLoader = {
  loader: 'css-loader',
  options: {
    /** Configures how many loaders before css-loader should be applied to @import-ed resources */
    importLoaders: 2
  }
};

(USE_CASE === 'prod') ?
  /** Enables CSS Modules */
  cssLoader.options.modules = {
    /** Sets the naming scheme for classes and keyframes */
    localIdentName: '[sha1:hash:base64:5]'
  }:
  cssLoader.options.modules = {
    localIdentName: '[local]-[sha1:hash:base64:5]'
  };

/** postcss-loader - transforms CSS produced by sass-loader with JS plugins */
const postCssLoader = {
  loader: 'postcss-loader',
  options: {
    /** Required by webpack when {Function}/require() is used */
    ident: 'postcss',
    plugins: [
      /** Converts modern CSS into something most browsers can */
      require('postcss-preset-env')({
        /** Determines which CSS features to polyfill */
        stage: 0
      }),

      /** Adds vendor prefixes to CSS rules */
      require('autoprefixer')()
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

/** config.module.rules[2] - processes (.png | .jpg) files */
const imageRule = {
  test: /\.(png|jpg)$/i,
  include: path.resolve(__dirname, './src'),
  loader: 'file-loader',
  options: {
    outputPath: 'images',
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
    webpackAssetsManifestOptions,
    removePluginOptions,
    jsRule,
    scssRule,
    imageRule,
    fontRule
  }:
  module.exports = config;