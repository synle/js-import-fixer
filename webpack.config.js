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
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        use: [
          {
            loader: 'ts-loader',
            options: {
              configFile: 'tsconfig.json',
            },
          },
        ],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      src: path.resolve(__dirname, 'src'),
    },
  },
};
