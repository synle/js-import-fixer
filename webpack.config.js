const path = require("path");

module.exports = {
  mode: "production",
  target: ["node"],
  entry: "./src/index.js",
  output: {
    filename: "main.js",
    libraryTarget: "this",
    path: path.resolve(__dirname, "./"),
  },
};
