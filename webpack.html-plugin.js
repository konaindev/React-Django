const HtmlWebPackPlugin = require("html-webpack-plugin");

const plugin = new HtmlWebPackPlugin({
  template: "./src/index.html",
  filename: "./index.html",
  favicon: "./src/favicon.ico"
});

module.exports = plugin;
