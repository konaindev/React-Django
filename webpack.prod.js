"use strict";

const webpackMerge = require("webpack-merge");
const webpackUglify = require("uglifyjs-webpack-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const commonConfig = require("./webpack.common.js");
const htmlPlugin = require("./webpack.html-plugin.js");

htmlPlugin.options["segmentKey"] = process.env.SEGMENT_KEY || "NO-SEGMENT-KEY";

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
  },
  plugins: [htmlPlugin]
});
