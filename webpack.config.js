/** process.env.NODE_ENV alias (production | development) */
const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`NODE_ENV: ${NODE_ENV}`);

/** process.env.USE_CASE alias (prod | dev | serve) */
const USE_CASE = process.env.USE_CASE || 'serve';
console.log(`USE_CASE: ${USE_CASE}`);

/** process.env.PORT alias */
const PORT = process.env.PORT || 5000;
if (USE_CASE === 'serve') {
  console.log(`PORT: ${PORT}`);
}

/* node modules */
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

/** webpack configs */
const config = {
  mode: NODE_ENV,
  entry: './src/main.js',
  resolve: {
    symlinks: false
  }
};

/* prod only settings */
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

/* dev only settings */
if (USE_CASE === 'dev') {
  config.devtool = 'source-map';
}

/* serve only settings */
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

  (() => {
    if ('SSL_KEY' in process.env && 'SSL_CRT' in process.env && 'SSL_PEM' in process.env) {
      console.log('HTTPS: true');
      config.devServer.https = {
        key: fs.readFileSync(process.env.SSL_KEY),
        cert: fs.readFileSync(process.env.SSL_CRT),
        ca: fs.readFileSync(process.env.SSL_PEM)
      };
      return;
    }
    if (process.env.SSL === 'true') {
      console.log('HTTPS: true');
      config.devServer.https = true;
      return;
    }
    console.log('HTTPS: false');
  })();
}

/** config.output alias */
let output = {};

switch (USE_CASE) {
  case 'prod':
    output = {
      path: path.resolve(__dirname, '../build-prod'),
      filename: '[contenthash:5].js'  
    };
    break;
    
    case 'dev':
    output = {
      path: path.resolve(__dirname, '../build-dev'),
      filename: '[name].[contenthash:5].js'  
    };
    break;

  case 'serve':
    output = {
      filename: '[name].js'
    };
    break;
}

config.output = output;

/** config.plugins alias */
let plugins = [];

const htmlWebpackPluginOptions = {
  inject: false,
  template: './src/ejs-template/index.ejs'
};

switch (USE_CASE) {
  case 'prod':
    htmlWebpackPluginOptions.title = 'Meme Party';
    break;

  case 'dev':
    htmlWebpackPluginOptions.title = 'Development - Meme Party';
    break;
  
  case 'serve':
    htmlWebpackPluginOptions.title = 'Server - Meme Party';
    break;
}

const miniCssExtractPluginOptions = {};

switch (USE_CASE) {
  case 'prod':
    miniCssExtractPluginOptions.filename = '[contenthash:5].css';
    break;

  case 'dev':
    miniCssExtractPluginOptions.filename = '[name].[contenthash:5].css';
    break;
  
  case 'serve':
    miniCssExtractPluginOptions.filename = '[name].css';
    break;
}

const webpackManifestPluginOptions = {};

(NODE_ENV === 'production') ?
  webpackManifestPluginOptions.filename = '../build-manifests/prod-all.json' :
  webpackManifestPluginOptions.filename = '../build-manifests/dev-all.json';

const webpackAssetsManifestOptions = {};

(NODE_ENV === 'production') ?
  webpackAssetsManifestOptions.output = '../build-manifests/prod-hashed.json' :
  webpackAssetsManifestOptions.output = '../build-manifests/dev-hashed.json';

const removePluginOptions = {
  before: {
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
};

(NODE_ENV === 'production') ?
  removePluginOptions.before.root = './build-prod' :
  removePluginOptions.before.root = './build-dev';

if (USE_CASE === 'serve') {
  plugins.push([
    new HtmlWebpackPlugin(htmlWebpackPluginOptions),
    new MiniCssExtractPlugin(miniCssExtractPluginOptions),
    new webpack.HotModuleReplacementPlugin()
  ]);
} else {
  plugins.push([
    new HtmlWebpackPlugin(htmlWebpackPluginOptions),
    new MiniCssExtractPlugin(miniCssExtractPluginOptions),
    new WebpackManifestPlugin(webpackManifestPluginOptions),
    new WebpackAssetsManifest(webpackAssetsManifestOptions),
    new RemovePlugin(removePluginOptions)
  ]);
}

config.plugins = plugins;

/** config.module.rules alias */
const rules = [];

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

const scssRule = {
  test: /\.scss$/i,
  include: path.resolve(__dirname, '../src'),
  use: []
};

if (NODE_ENV === 'production') scssRule.sideEffects = true;

const miniCssExtractPluginLoader = {
  loader: MiniCssExtractPlugin.loader
};
if (USE_CASE === 'serve') miniCssExtractPluginLoader.options = {
  hmr: true
}
const cssLoader = {
  loader: 'css-loader', 
  options: { 
    importLoaders: 2
  }
};
(NODE_ENV === 'production') ?
  cssLoader.options.modules = {
    localIdentName: '[sha1:hash:base64:5]'
  } :
  cssLoader.options.modules = {
    localIdentName: '[local]-[sha1:hash:base64:5]'
  };

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

const scssLoader = {
  loader: 'sass-loader',
};
if (NODE_ENV === 'production') scssLoader.options = {
  sassOptions: {
    minimize: false,
    outputStyle: 'expanded'
  }
};

scssRule.use.push(
  miniCssExtractPluginLoader,
  cssLoader,
  postCssLoader,
  scssLoader
);

const imageRule = {
  test: /\.(png|jpg)$/i,
  include: path.resolve(__dirname, '../src'),
  loader: 'file-loader',
  options: {
    outputPath: 'images',
    esModule: false
  }
};

switch (USE_CASE) {
  case 'prod':
    imageRule.options.name = '[sha1:contenthash:base64:5].[ext]';
    break;

  case 'dev':
    imageRule.options.name = '[name].[sha1:contenthash:base64:5].[ext]';
    break;

  case 'serve':
    imageRule.options.name = '[name].[ext]';
    break;
}

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
    fontRule.options.name = '[sha1:contenthash:base64:5].[ext]';
    break;

  case 'dev':
    fontRule.options.name = '[name].[sha1:contenthash:base64:5].[ext]';
    break;

  case 'serve':
    fontRule.options.name = '[name].[ext]';
    break;
}

rules.push(
  jsRule,
  scssRule,
  imageRule,
  fontRule
);

config.module = {
  rules: rules
};

/** export webpack configs */
// module.exports = config;

/**************************************************\
  testing logs beyond
\**************************************************/
const { EOL } = require('os');

// just to break up from top
console.log(EOL);

// see whole config
console.log(
  // bgcyan, fgblack, string, reset, regular object
  '\x1b[44m \x1b[30m %s \x1b[0m %O',
  'config = ',
  config,
  EOL
);

// see plugin options
console.log(
  // bgcyan, fgblack, string, reset, full object
  '\x1b[44m \x1b[30m %s \x1b[0m %o',
  'plugins = ', 
  {
    htmlWebpackPluginOptions,
    miniCssExtractPluginOptions,
    webpackManifestPluginOptions,
    webpackAssetsManifestOptions,
    removePluginOptions
  },
  EOL
);

// see removePluginOptions method
console.log(
  // bgcyan, fgblack, string, reset, string
  '\x1b[44m \x1b[30m %s \x1b[0m %s',
  'removePluginOptions.before.test[0].method = ',
  removePluginOptions.before.test[0].method,
  EOL
);