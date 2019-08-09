const path = require("path");
const miniCSS = require("mini-css-extract-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");

if (process.env.BASE_URL.length < 1) {
  throw new Error("MISSING BASE_URL IN ENV VAR");
}

module.exports = {
  entry: {
    app: ["./src/js/index.js"]
  },
  stats: { children: false },
  module: {
    rules: [
      {
        test: /\.(js|jsx|mjs)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: { babelrc: true }
          },
          {
            loader: "eslint-loader"
          }
        ]
      },
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: miniCSS.loader
          },
          {
            loader: "css-loader"
          },
          {
            loader: "resolve-url-loader"
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true,
              sourceMapContents: false,
              includePaths: [path.resolve(__dirname, "./src")]
            }
          }
        ],
        include: path.resolve(__dirname, ".")
      },
      {
        test: /\.(zip|png|jpg|jpeg|gif|otf|eot|svg|ttf|woff|woff2|wav)$/,
        type: "javascript/auto",
        loader: "file-loader"
      }
    ]
  },
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  plugins: [
    new CleanWebpackPlugin(),
    new miniCSS({ filename: "index.css", chunkFilename: "[id].css" }),
    new StyleLintPlugin(),
    new Dotenv(),
    new webpack.DefinePlugin({
      "process.env": { BASE_URL: JSON.stringify(process.env.BASE_URL) }
    })
  ],
  profile: true,
  resolve: {
    extensions: [".js", ".jsx"],
    modules: [path.resolve("./src"), path.resolve("./node_modules")],
    alias: {
      "core-js": path.resolve("./node_modules/core-js"),
      react: path.resolve("./node_modules/react"),
      "react-dom": path.resolve("./node_modules/react-dom")
    }
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist")
  },
  performance: { hints: false }
};
