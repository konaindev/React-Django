"use strict";
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");
const commonConfig = require("./webpack.common.js");

module.exports = webpackMerge(commonConfig, {
  devServer: {
    writeToDisk: true,
    contentBase: "staticfiles",
    hot: true,
    historyApiFallback: true
  },
  devtool: "inline-source-map",
  mode: "development",
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
  ]
});
