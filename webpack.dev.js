"use strict";
const webpack = require("webpack");
const webpackMerge = require("webpack-merge");

const commonConfig = require("./webpack.common.js");

module.exports = webpackMerge(commonConfig, {
  devServer: {
    contentBase: "./dist",
    hot: true
  },
  devtool: "inline-source-map",
  mode: "development",
  module: {
    rules: [
      {
        test: /\.(less|css)$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "less-loader" }
        ]
      }
    ]
  },
  plugins: [new webpack.NamedModulesPlugin()]
});
