const path = require('path');
const webpack = require('webpack');

module.exports = {
  mode: 'production',
  target: ['node'],
  entry: './src/library.ts',
  output: {
    filename: './dist/library.js',
    libraryTarget: 'this',
    path: path.resolve(__dirname, './'),
  },
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
      'package.json': path.resolve(__dirname, 'package.json'),
    },
  },
};
