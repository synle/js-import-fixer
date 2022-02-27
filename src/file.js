const fs = require("fs");
const path = require("path");

const file = {
  read: (dir) => fs.readFileSync(dir, { encoding: "utf-8" }),
  readJson: (dir) => {
    try {
      return JSON.parse(file.read(dir));
    } catch (err) {
      return undefined;
    }
  },
  listDirNested: (startPath) => {
    let files = [];
    let stack = [startPath];

    while (stack.length > 0) {
      const item = stack.pop();

      if (fs.lstatSync(item).isDirectory()) {
        // is a dir
        const items = fs
          .readdirSync(item)
          .map((newItem) => path.join(item, newItem));
        stack = [...stack, ...items].filter(
          (newItem) =>
            !newItem.includes("/node_modules/") &&
            !newItem.includes("/coverage/")
        );
      } else {
        // is a file
        if (
          !item.includes(".json") &&
          !item.includes(".snap") &&
          !item.includes(".eslint")
        ) {
          if (
            item.includes(".ts") ||
            item.includes(".tsx") ||
            item.includes(".js") ||
            item.includes(".tsx")
          ) {
            files.push(item);
          }
        }
      }
    }
    return files;
  },
};

module.exports = file;
