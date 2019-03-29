const path = require("path");
const StyleLintPlugin = require("stylelint-webpack-plugin");

module.exports = {
  plugins: [new StyleLintPlugin()],
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
        ],
        include: path.resolve(__dirname, "../")
      },
      {
        test: /\.(css|scss)$/,
        use: [
          {
            // just for storybook, inject our styles directly into the DOM
            loader: "style-loader",
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
              includePaths: [path.resolve(__dirname, "../src")]
            }
          }
        ],
        include: path.resolve(__dirname, "../")
      },
      {
        test: /\.(otf|eot|ttf|woff|woff2)$/,
        type: "javascript/auto",
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "fonts/"
        }
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        type: "javascript/auto",
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "images/"
        }
      }
    ]
  }
};
