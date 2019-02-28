const path = require("path");

module.exports = {
  module: {
    rules: [
      {
        test: /\.(css|scss)$/,
        use: [
          {
            loader: "style-loader"
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
        loader: "file-loader",
        options: {
          name: "[name].[ext]",
          outputPath: "fonts/"
        }
      }
    ]
  }
}
