/**************************************************\
  require EOL, USE_CASE, config, options, rules
\**************************************************/

const { EOL } = require('os');
const {
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
} = require('./webpack.config.js');

/**************************************************\
  config logs
\**************************************************/

/** Boilerplate setup for logs - EOL, bgBlue, fgBlack, string, reset */
const preLog = `${EOL} \x1b[44m \x1b[30m %s \x1b[0m`;

// Shows whole config
console.log(`${preLog} %O`, 'config = ' , config);

// Shows config.plugin options
console.log(
  `${preLog} %o`,
  'plugins options = ',
  {
    htmlWebpackPluginOptions,
    miniCssExtractPluginOptions,
    webpackAssetsManifestOptions,
    removePluginOptions
  }
);

// Shows removePluginOptions before test method
// Only set for USE_CASE=prod and USE_CASE=dev
// Not set for USE_CASE=serve
if (USE_CASE !== 'serve') console.log(
  `${preLog} %s`,
  'removePluginOptions before test method = ',
  removePluginOptions.before.test[0].method
);

// Shows config.module.rules
console.log(
  `${preLog} %o`,
  'module rules = ',
  {
    jsRule,
    scssRule,
    imageRule,
    fontRule
  }
);

// Shows css-loader modules
console.log(
  `${preLog} %O`,
  'css-loader modules = ',
  scssRule.use[1].options.modules
);

// Shows postcss-loader plugins
console.log(
  `${preLog} %O`,
  'postcss-loader plugins = ',
  scssRule.use[2].options.plugins
);