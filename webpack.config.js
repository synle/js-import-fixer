const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  target: ["node"],
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    libraryTarget: "this",
    path: path.resolve(__dirname, "./"),
  },
  plugins: [
    new webpack.BannerPlugin({ banner: "#! /usr/bin/env node", raw: true }),
  ],
};
