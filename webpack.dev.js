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
  plugins: [
    new webpack.DefinePlugin({
      CONFIG: JSON.stringify({
        API_ORIGIN:
          process.env.AUTOLYRN_API_ORIGIN || "http://localhost:5000/api/0.1",
        AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID,
        AUTH0_DOMAIN: process.env.AUTH0_DOMAIN,
        AUTH0_REALM: process.env.AUTH0_REALM,
        SENTRY_DSN: process.env.SENTRY_DSN
      })
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin()
  ]
});
