const fs = require("fs");
const path = require("path");

const fileUtils = {
  read: (file) => fs.readFileSync(file, { encoding: "utf-8" }),
  readJson: (file) => {
    try {
      return JSON.parse(fileUtils.read(file));
    } catch (err) {
      console.log("[Warning] readJson failed".yellow, err);
      return undefined;
    }
  },
  write: (file, content) => fs.writeFileSync(file, content),
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
          !item.includes(".eslint") &&
          !item.includes("/typings/") &&
          !item.includes("typings.ts") &&
          !item.includes(".d.ts") &&
          true
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

module.exports = fileUtils;
