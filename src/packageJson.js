const path = require("path");
const file = require("./file");

const packageJson =
  file.readJson(path.join(process.cwd(), "package.json")) || {};

module.exports = packageJson;
