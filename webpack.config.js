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
  Require node modules
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
  /** Tells webpack to use its built-in optimizations accordingly */
  mode: NODE_ENV,

  /** Where webpack looks to start building the bundle */
  entry: './src/main.js',

  /** Configures how modules are resolved */
  resolve: {
    /** Resolves symlinks to their symlinked location */
    symlinks: false
  }
};

/**************************************************\
  USE_CASE=prod only configs
\**************************************************/

if (USE_CASE === 'prod') {
  /** Controls how webpack notifies you of assets and entry points that exceed a specific file limit */
  config.performance = {
    /** Tells webpack whether to throw an error, a warning, or nothing when large assets are created */
    hints: 'error'
  };

  /** Configures bundle optimizations */
  config.optimization = {
    /** Overrides the default minimizer TerserPlugin */
    // When adding minimizers for other file types TerserPlugin needs to be set again because it is overriden
    minimizer: [
      /** Mangles and minimizes JS files */
      new TerserPlugin(),

      /** Minifies CSS files */
      new OptimizeCssAssetsPlugin()
    ]
  };
}

/**************************************************\
  USE_CASE=dev only configs
\**************************************************/

if (USE_CASE === 'dev') {
  /** Controls if and how source maps are generated */
  config.devtool = 'source-map';
}

/**************************************************\
  USE_CASE=serve only configs
\**************************************************/

if (USE_CASE === 'serve') {
  /** Options picked up by webpack-dev-server to change its behavior */
  config.devServer = {
    /** Tells the server where to serve content from */
    // This only necessary when serving static files
    contentBase: false,

    /** Enables Hot Module Replacement (HMR) */
    hot: true,

    /** Specifies a port number to listen to for requests */
    port: PORT,

    /** Enables gzip compression for everything served */
    compress: true,

    /** Lets you control what bundle information gets displayed */
    stats: 'errors-warnings',

    /** Shows a full-screen overlay in the browser when there are compiler errors or warnings */
    overlay: {
      warnings: true,
      errors: true
    },

    /** Executes custom middleware prior to all other middleware internally within the server */
    before: (app, server, compiler) => {
      // Reloads the server when changes are made to the html template
      server._watch('./src/ejs-template/index.ejs');
    }
  };

  // Sets whether webpack-dev-server will use http or https
  if ('SSL_KEY' in process.env && 'SSL_CRT' in process.env && 'SSL_PEM' in process.env) {
    console.log('HTTPS: true');

    /** Uses provided certs to enable https */
    config.devServer.https = {
      key: fs.readFileSync(process.env.SSL_KEY),
      cert: fs.readFileSync(process.env.SSL_CRT),
      ca: fs.readFileSync(process.env.SSL_PEM)
    };
  } else if (process.env.SSL === 'true') {
    console.log('HTTPS: true');

    /** Tells webpack-dev-server to create and use self-signed certs */
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
    /** Contains options instructing webpack on how and where it should output bundles and assets */
    config.output = {
      /** Absolute path of the output directory */
      path: path.resolve(__dirname, './build-prod'),

      /** Determines the name of each output bundle */
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

/** HtmlWebpackPlugin options */
const htmlWebpackPluginOptions = {
  /** Whether or not HtmlWebpackPlugin automatically injects assets in the template and where */
  inject: false,

  /** Relative or absolute path to the template used to generate the HTML document */
  template: './src/ejs-template/index.ejs'
};

/** MiniCssExtractPlugin options */
const miniCssExtractPluginOptions = {};

switch (USE_CASE) {
  case 'prod':
    /** The title to use for the generated HTML document */
    htmlWebpackPluginOptions.title = 'Meme Party';

    /** File name of the emitted CSS file */
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

/** WebpackAssetsManifest options */
const webpackAssetsManifestOptions = {};

// Sets the relative location and file name of the emitted JSON file
if (USE_CASE === 'prod') webpackAssetsManifestOptions.output = '../build-manifests/prod-manifest.json';
if (USE_CASE === 'dev') webpackAssetsManifestOptions.output = '../build-manifests/dev-manifest.json';

/** RemovePlugin options */
const removePluginOptions = {}

// Sets what should be removed before full compilation
if (USE_CASE === 'prod' || USE_CASE === 'dev') removePluginOptions.before = {
  /** Sets what directories within root should be removed */
  include: [
    './fonts',
    './images'
  ],

  /** Sets a directory within root whose contents will be tested for possible removal */
  test: [
    {
      /** Directory to test */
      folder: '.',

      /** Method used to test, tests for (.html | .css | .js | .json | .map) files */
      method: (absoluteItemPath) => {
          return new RegExp(/\.(html|css|js|json|map)$/i, 'm').test(absoluteItemPath);
      }
    }
  ]
};

// Sets where the root directory of the removal process will be
if (USE_CASE === 'prod') removePluginOptions.before.root = './build-prod';
if (USE_CASE === 'dev') removePluginOptions.before.root = './build-dev';

/** Sets what plugins should be used for compilation */
config.plugins = [];

// Common plugins between all use cases
config.plugins.push(
  /** Creates index.html in the build folder based on the template */
  new HtmlWebpackPlugin(htmlWebpackPluginOptions),

  /** Extracts styles into a CSS file */
  new MiniCssExtractPlugin(miniCssExtractPluginOptions)
);

(USE_CASE === 'serve') ?
  // Plugins for USE_CASE=serve
  config.plugins.push(
    /** For HMR */
    new webpack.HotModuleReplacementPlugin()
  ):
  // Plugins for USE_CASE=prod or USE_CASE=dev
  config.plugins.push(
    /** Generates a JSON file that matches original filenames with their hashed versions */
    new WebpackAssetsManifest(webpackAssetsManifestOptions),

    /** Removes files before compilation */
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
    /** The loader to be used */
    loader: 'babel-loader',

    /** Options passed to the loader */
    options: {
      // TODO: add comments here
      presets: [
        '@babel/preset-env'
      ],
      plugins: [
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