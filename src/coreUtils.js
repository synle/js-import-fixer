const fs = require("fs");
const fileUtils = require("./fileUtils");
const path = require("path");
const configs = require("./configs");
const gitiginorePatterns = require("./gitiginorePatterns");
const packageJson = require("./packageJson");

let externalPackages = new Set([
  ...Object.keys(packageJson.devDependencies || {}),
  ...Object.keys(packageJson.dependencies || {}),
]);
externalPackages = [...externalPackages].sort();

const coreUtils = {
  getFilesToProcess: (startPath) => {
    let files = fileUtils.listDirNested(startPath);

    // filter out all the files in gitignore
    if (gitiginorePatterns.length > 0) {
      files = files.filter((file) =>
        gitiginorePatterns.every(
          (gitiginorePattern) => !file.includes(gitiginorePattern)
        )
      );
    }

    // filter out the file if there is a filter
    if (configs.filteredFiles.length > 0) {
      files = files.filter((file) =>
        configs.filteredFiles.some((filteredFile) =>
          file.includes(filteredFile)
        )
      );
    }

    // doing a quick sort to make file easier to follow
    files = files.sort();

    return files;
  },
  getAliasName: (moduleName) => {
    if (moduleName.includes(" as ")) {
      return moduleName.substr(moduleName.indexOf(" as ") + 4).trim();
    } else {
      return moduleName;
    }
  },
  getModuleName: (moduleName) => {
    if (moduleName.includes(" as ")) {
      return moduleName.substr(0, moduleName.indexOf(" as ")).trim();
    } else {
      return moduleName;
    }
  },
  getLibrarySortOrder: (a) => {
    var ca = a.substr(a.indexOf(" from ") + 7);
    ca = ca.replace(/[ '\";]+/, "");

    for (let i = 0; i < externalPackages.length; i++) {
      if (ca.includes(externalPackages[i])) {
        return i;
      }
    }

    return 99999;
  },
};

module.exports = coreUtils;
