"use strict";
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");

const HtmlWebPackPlugin = require("html-webpack-plugin");
const commonConfig = require("./webpack.common.js");

const path = require("path");

module.exports = webpackMerge(commonConfig, {
  devServer: {
    contentBase: "staticfiles",
    hot: true,
    historyApiFallback: true
  },
  devtool: "inline-source-map",
  mode: "development",
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    })
  ]
});
