/**************************************************\
  require node modules
\**************************************************/

const path = require('path');
const fs = require('fs');
const HtmlPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const AssetsManifestPlugin = require('webpack-assets-manifest');
const RemoveFilesPlugin = require('remove-files-webpack-plugin');

/**************************************************\
  Set environment variables
\**************************************************/

/** Current environment mode, can be (production | development) */
const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`NODE_ENV: ${NODE_ENV}`);

/** Current run use case, can be (prod | dev | serve) */
const USE_CASE = process.env.USE_CASE || 'serve';
console.log(`USE_CASE: ${USE_CASE}`);

/**************************************************\
  Common configs for all use cases
\**************************************************/

const config = {
  mode: NODE_ENV,
  entry: './src/main.js',
  output: {
    publicPath: 'auto',
  },
  resolve: {
    symlinks: false
  }
};

/**************************************************\
  prod use case only configs
\**************************************************/

if (USE_CASE === 'prod') {
  config.performance = {
    hints: 'error'
  };

  config.optimization = {
    minimizer: [
      '...',
      new CssMinimizerPlugin()
    ]
  };
}

/**************************************************\
  dev use case only configs
\**************************************************/

if (USE_CASE === 'dev') {
  config.devtool = 'source-map';
}

/**************************************************\
  serve use case only configs
\**************************************************/

if (USE_CASE === 'serve') {
  // Get port number and SSL credentials/preferences
  if (fs.existsSync('.env')) require('dotenv').config();
  const PORT = process.env.PORT || 5000;

  config.stats = 'errors-warnings';

  config.devServer = {
    // ?? Reload the server when changes are made to the EJS template
    // ??👉 https://github.com/webpack/webpack-dev-server/releases/tag/v4.0.0-beta.0
    static: path.resolve(__dirname, './src/ejs-template/index.ejs'),
    // ?? Use localhost as the preferred host name
    // ?? webpack-dev-server@4.0.0-beta.0 seems to use 127.0.0.1 as the default host name
    // ?? Changing the `host` or `client.host` options do not seem to affect this
    // ?? While changing the `public` option seems to work
    // ??👉 https://webpack.js.org/configuration/dev-server/#devserverpublic
    // ??👉 https://stackoverflow.com/a/60074675
    host: 'localhost',
    port: PORT,
    compress: true,
    client: {
      overlay: {
        warnings: true,
        errors: true
      }
    }
  };

  if ('SSL_KEY' in process.env && 'SSL_CRT' in process.env && 'SSL_PEM' in process.env) {
    console.log('HTTPS: true');
    config.devServer.server = {
      type: 'https',
      options: {
        key: fs.readFileSync(process.env.SSL_KEY),
        cert: fs.readFileSync(process.env.SSL_CRT),
        ca: fs.readFileSync(process.env.SSL_PEM)
      }
    };
  }
  else if (process.env.SSL === 'true') {
    console.log('HTTPS: true');
    config.devServer.server = 'https';
  }
  else {
    console.log('HTTPS: false');
  }

  console.log(`PORT: ${PORT}`);
}

/**************************************************\
  extend config.output
\**************************************************/

if (USE_CASE !== 'serve') config.output = {
  ...config.output,
  hashDigestLength: 5,
  hashFunction: 'sha1'
};

switch (USE_CASE) {
  case 'prod':
    config.output = {
      ...config.output,
      path: path.resolve(__dirname, './build-prod'),
      filename: '[contenthash].js'
    };
    break;

  case 'dev':
    config.output = {
      ...config.output,
      path: path.resolve(__dirname, './build-dev'),
      filename: '[name].[contenthash].js'
    };
    break;
}

/**************************************************\
  config.plugins
\**************************************************/

const htmlPluginOptions = {
  inject: false,
  template: './src/ejs-template/index.ejs',
  title: (USE_CASE === 'prod') ? 'Meme Party' : `${USE_CASE.toUpperCase()} - Meme Party`
};

const miniCssExtractPluginOptions = {};

if (USE_CASE !== 'serve') miniCssExtractPluginOptions.filename =
  (USE_CASE === 'prod') ? '[contenthash].css' : '[name].[contenthash].css';

const AssetsManifestPluginOptions = {};

if (USE_CASE !== 'serve') AssetsManifestPluginOptions.output = `../build-manifests/${USE_CASE}-manifest.json`;

const removeFilesPluginOptions = {}

if (USE_CASE !== 'serve') removeFilesPluginOptions.before = {
  root: `./build-${USE_CASE}`,
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

// Assemble config.plugins
config.plugins = [
  new HtmlPlugin(htmlPluginOptions),
  new MiniCssExtractPlugin(miniCssExtractPluginOptions)
];

USE_CASE !== 'serve' && config.plugins.push(
  new AssetsManifestPlugin(AssetsManifestPluginOptions),
  new RemoveFilesPlugin(removeFilesPluginOptions)
);

/**************************************************\
  config.module.rules
\**************************************************/

const includePath = path.resolve(__dirname, './src');

const jsRule = {
  test: /\.js$/i,
  include: includePath,
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

const scssRule = {
  test: /\.scss$/i,
  include: includePath,
  // ?? Prevent global styles from being tree shaken during production builds
  // ??👉 https://webpack.js.org/configuration/module/#rulesideeffects
  sideEffects: true,
  use: [
    MiniCssExtractPlugin.loader,
    {
      loader: 'css-loader',
      options: {
        importLoaders: 2,
        modules: {
          localIdentName: (USE_CASE === 'prod') ? '[sha1:contenthash:base64:5]' : '[local]-[sha1:contenthash:base64:5]'
        }
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        postcssOptions: {
          plugins: [
            'autoprefixer'
          ]
        }
      }
    },
    {
      loader: 'sass-loader',
      options: {
        sassOptions: {
          // ?? Keep output style consistent
          // ?? Turn off sass-loader minification for production builds
          // ?? Use CssMinimizerPlugin as the main/only minifier for CSS
          // ??👉 https://github.com/sass/node-sass#outputstyle
          outputStyle: 'expanded'
        }
      }
    }
  ]
};

const imageRule = {
  type: 'asset/resource',
  test: /\.(png|jpg)$/i,
  include: includePath,
  generator: {},
};

const fontRule = {
  type: 'asset/resource',
  test: /\.(woff|woff2)$/i,
  include: includePath,
  generator: {},
};

switch (USE_CASE) {
  case 'prod':
    imageRule.generator.filename = 'images/[contenthash][ext]';
    fontRule.generator.filename = 'fonts/[contenthash][ext]';
    break;

  case 'dev':
    imageRule.generator.filename = 'images/[name].[contenthash][ext]';
    fontRule.generator.filename = 'fonts/[name].[contenthash][ext]';
    break;

  case 'serve':
    imageRule.generator.filename = 'images/[name][ext]';
    fontRule.generator.filename = 'fonts/[name][ext]';
    break;
}

// Assemble config.module.rules
config.module = {
  rules: [
    jsRule,
    scssRule,
    imageRule,
    fontRule
  ]
};

(process.env.LOG_RUN === 'true') ?
  // Export additional data if used by ./webpack-log.config.js to show configs in the terminal
  module.exports = {
    USE_CASE,
    config,
    htmlPluginOptions,
    miniCssExtractPluginOptions,
    AssetsManifestPluginOptions,
    removeFilesPluginOptions,
    jsRule,
    scssRule,
    imageRule,
    fontRule
  } :
  module.exports = config;