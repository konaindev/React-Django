"use strict";

const path = require("path");
const webpackMerge = require("webpack-merge");
const webpackUglify = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const commonConfig = require("./webpack.common.js");

module.exports = webpackMerge(commonConfig, {
  mode: "production",
  optimization: {
    minimizer: [
      new webpackUglify({
        uglifyOptions: {
          compress: {
            reduce_vars: false
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({})
    ]
  }
});
