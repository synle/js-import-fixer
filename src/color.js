String.prototype.blue = function () {
  return `\x1b[36m${this}\x1b[0m`;
};

String.prototype.yellow = function () {
  return `\x1b[33m${this}\x1b[0m`;
};

String.prototype.green = function () {
  return `\x1b[32m${this}\x1b[0m`;
};

String.prototype.red = function () {
  return `\x1b[31m${this}\x1b[0m`;
};
