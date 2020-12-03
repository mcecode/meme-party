/**************************************************\
  require node modules and webpack config
\**************************************************/

const { EOL } = require('os');
const {
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
} = require('./webpack.config.js');

/**************************************************\
  config logs
\**************************************************/

/** Boilerplate setup for logs - EOL, bgBlue, fgBlack, string, reset */
const preLog = `${EOL} \x1b[44m \x1b[30m %s \x1b[0m`;

// Show whole config
console.log(`${preLog} %O`, 'config = ', config);

// Show config.plugin options
console.log(
  `${preLog} %o`,
  'plugins options = ',
  {
    htmlPluginOptions,
    miniCssExtractPluginOptions,
    AssetsManifestPluginOptions,
    removeFilesPluginOptions
  }
);

// Show removeFilesPluginOptions before test method
if (USE_CASE !== 'serve') console.log(
  `${preLog} %s`,
  'removeFilesPluginOptions before test method = ',
  removeFilesPluginOptions.before.test[0].method
);

// Show config.module.rules
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

// Show css-loader modules
console.log(
  `${preLog} %o`,
  'css-loader modules = ',
  scssRule.use[1].options.modules
);

// Show postcss-loader postcssOptions
console.log(
  `${preLog} %o`,
  'postcss-loader postcssOptions = ',
  scssRule.use[2].options.postcssOptions
);

// Show sass-loader sassOptions
console.log(
  `${preLog} %o`,
  'sass-loader sassOptions = ',
  scssRule.use[3].options.sassOptions
);