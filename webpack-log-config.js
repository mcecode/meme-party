/**************************************************\
  require EOL and configs
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

/** Boilerplate setup for logs = EOL, bgBlue, fgBlack, string, reset  */
const preLog = `${EOL} \x1b[44m \x1b[30m %s \x1b[0m`;

/** See whole config */
console.log(`${preLog} %O`, 'config = ' , config);

/** See config.plugin options */
console.log(
  `${preLog} %o`,
  'pluginOptions = ',
  {
    htmlWebpackPluginOptions,
    miniCssExtractPluginOptions,
    webpackAssetsManifestOptions,
    removePluginOptions
  }
);

/** See removePluginOptions method */
if (USE_CASE !== 'serve') console.log(
  `${preLog} %s`,
  'removePluginOptions.before.test[0].method = ',
  removePluginOptions.before.test[0].method
);

/** See config.module.rules rules */
console.log(
  `${preLog} %o`,
  'rules = ',
  {
    jsRule,
    scssRule,
    imageRule,
    fontRule
  }
);