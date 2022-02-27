const path = require("path");
const fileUtils = require("./fileUtils");

const packageJson =
  fileUtils.readJson(path.join(process.cwd(), "package.json")) || {};

module.exports = packageJson;
