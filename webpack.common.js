const path = require("path");
const miniCSS = require("mini-css-extract-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const Dotenv = require("dotenv-webpack");
const webpack = require("webpack");
const HtmlWebPackPlugin = require("html-webpack-plugin");

const isProduction = process.env.NODE_ENV === "production";
if (isProduction && !process.env.BASE_URL) {
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
    }),
    new webpack.DefinePlugin({
      "process.env": {
        LOAD_SB_PROPS: JSON.stringify(process.env.LOAD_SB_PROPS)
      }
    }),
    new HtmlWebPackPlugin({
      template: "./src/index.html",
      filename: "./index.html"
    }),
    new HtmlWebPackPlugin({
      favicon: "./src/favicon.ico"
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
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  performance: { hints: false }
};
