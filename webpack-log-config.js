const [ 
  config, 
  htmlWebpackPluginOptions,
  miniCssExtractPluginOptions,
  webpackManifestPluginOptions,
  webpackAssetsManifestOptions,
  removePluginOptions
] = require('./webpack.config.js');

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
// add if statement to remove for USE_CASE=serve
// console.log(
//   // bgcyan, fgblack, string, reset, string
//   '\x1b[44m \x1b[30m %s \x1b[0m %s',
//   'removePluginOptions.before.test[0].method = ',
//   removePluginOptions.before.test[0].method,
//   EOL
// );