// set and check node env (production | development)
const NODE_ENV = process.env.NODE_ENV || 'development';
console.log(`NODE_ENV: ${process.env.NODE_ENV}`);

// set and check use case (prod | dev | serve)
const USE_CASE = process.env.USE_CASE || 'serve';
console.log(`USE_CASE: ${process.env.USE_CASE}`);

// set and check port for webpack-dev-server
const PORT = process.env.PORT || 5000;
console.log(`PORT: ${PORT}`);

// load node modules
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const htmlWebpackPlugin = require('html-webpack-plugin');
const miniCssExtractPlugin = require('mini-css-extract-plugin');
const optimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const terserPlugin = require('terser-webpack-plugin');
const webpackManifestPlugin = require('webpack-manifest-plugin');
const webpackAssetsManifest = require('webpack-assets-manifest');
const removePlugin = require('remove-files-webpack-plugin');

/** webpack configs */
const config = {};

/** export webpack configs */
module.exports = config;