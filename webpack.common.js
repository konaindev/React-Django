const path = require("path");
const miniCSS = require("mini-css-extract-plugin");
const StyleLintPlugin = require("stylelint-webpack-plugin");

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
        test: /\.(otf|eot|ttf|woff|woff2)$/,
        type: "javascript/auto",
        loader: "file-loader",
        options: {
          name: "[name].[ext]?[hash]",
          outputPath: "fonts/",
          publicPath: "/static/fonts"
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: "javascript/auto",
        loader: "file-loader",
        options: {
          name: "[name].[ext]?[hash]",
          outputPath: "images/",
          publicPath: "/static/images"
        }
      }
    ]
  },
  output: {
    filename: "[name].[hash].js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "/"
  },
  plugins: [
    new miniCSS({ filename: "index.css", chunkFilename: "[id].css" }),
    new StyleLintPlugin()
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
