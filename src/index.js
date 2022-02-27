#! /usr/bin/env node
let data = "";
const path = require("path");
const fileUtils = require("./fileUtils");
const configs = require("./configs");
const coreUtils = require("./coreUtils");
require("./color");

console.log("Inputs / Configs ".padEnd(100, "=").blue());
console.log("PWD:", process.cwd());
console.log("".padEnd(100, "=").blue());
console.log(JSON.stringify(configs, null, 2));
console.log("".padEnd(100, "=").blue());

// get all relevant files
let startPath = process.cwd();
let countSkipped = 0;
let countProcessed = 0;
let countLibUsedByFile = {};
let files = coreUtils.getFilesToProcess(startPath);

const fileMap = {};
const libraryMap = {};

for (const file of files) {
  const content = fileUtils.read(file);

  // lib_name => [array of modules]
  // '@mui/material/CircularProgress': [ { name: 'CircularProgress', type: 'default' } ]
  var libToModules = {};
  var moduleToLibs = {};

  // set of used modules
  var allImportedModules = new Set();
  var notUsedModules = new Set();
  var usedModules = new Set();

  var rawContentWithoutImport;
  try {
    rawContentWithoutImport = content.replace(
      /import[ ]+[\*{a-zA-Z0-9 ,}\n]+'[@/a-zA-Z0-9-]+'[;]*/g,
      ""
    );

    const importCodeLines = content.match(
      /import[ ]+[\*{a-zA-Z0-9 ,}\n]+'[@/a-zA-Z0-9-]+'[;]*/g
    );
    if (!importCodeLines || importCodeLines.length === 0) {
      console.log("> Skipped File:".padStart(17, " ").yellow(), file);
      countSkipped++;
      continue;
    }

    // here we figured out what imports are being imported
    // and if it has an alias and if it's a module / default imported
    importCodeLines.forEach((s) => {
      const foundImportedModules = s
        .match(/from[ ]+'[@/a-zA-Z0-9-]+'[;]*/, "")[0]
        .replace(/from[ ]+'/, "")
        .replace(/'/, "")
        .replace(/;/, "");
      libToModules[foundImportedModules] =
        libToModules[foundImportedModules] || [];
      let parsed = s
        .replace(/from[ ]+'[@/a-zA-Z0-9-]+'[;]*/, "")
        .replace("import ", "")
        .replace(/[ \n]+/g, " ");

      const moduleSplits = parsed.split("{");

      for (let moduleSplit of moduleSplits) {
        if (moduleSplit.includes("}")) {
          // will be parsed as module
          moduleSplit = moduleSplit.replace("}", "");
          const childModuleSplits = moduleSplit
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s);
          for (let moduleName of childModuleSplits) {
            // is a child module import
            const aliasName = coreUtils.getAliasName(moduleName);
            moduleName = coreUtils.getModuleName(moduleName);
            allImportedModules.add(aliasName);
            libToModules[foundImportedModules].push({
              name: moduleName,
              alias: aliasName,
              type: "module",
            });

            moduleToLibs[aliasName] = {
              lib: foundImportedModules,
              name: moduleName,
              alias: aliasName,
              type: "module",
            };
          }
        } else {
          // will be parsed as default
          const defaultModuleSplits = moduleSplit
            .split(",")
            .map((s) => s.trim())
            .filter((s) => s);
          for (let moduleName of defaultModuleSplits) {
            // is default import
            const aliasName = coreUtils.getAliasName(moduleName);
            moduleName = coreUtils.getModuleName(moduleName);
            allImportedModules.add(aliasName);
            libToModules[foundImportedModules].push({
              name: moduleName,
              alias: aliasName,
              type: "default",
            });

            moduleToLibs[aliasName] = {
              lib: foundImportedModules,
              name: moduleName,
              alias: aliasName,
              type: "default",
            };
          }
        }
      }
    });

    // here we figure out if an import is actually used in the code
    for (const aModule of allImportedModules) {
      let isModuleUsed = false;

      if (configs.aggressiveCheck === true) {
        if (rawContentWithoutImport.match(`<${aModule}`)) {
          // used as a react component
          isModuleUsed = true;
        }
        if (
          rawContentWithoutImport.match(
            new RegExp("[ ]+" + aModule + "[ ]*")
          ) ||
          rawContentWithoutImport.match(
            new RegExp("[ ]*" + aModule + "[ ]+")
          ) ||
          rawContentWithoutImport.match(new RegExp(aModule + "[.}(-+]+"))
        ) {
          // used as a method or an expression
          isModuleUsed = true;
        }
      } else {
        if (rawContentWithoutImport.includes(aModule)) {
          isModuleUsed = true;
        }
      }

      if (isModuleUsed) {
        usedModules.add(aModule);
      } else {
        notUsedModules.add(aModule);
      }
    }

    // generate the new import
    var newImportedContent = [];

    const librariesUsedByThisFile = new Set(); // note here, we don't count duplicate lib imports in the same file...

    if (configs.groupImport === false) {
      // here we don't group, each import is treated as a separate line
      for (const aModule of usedModules) {
        const { type, lib, alias, name } = moduleToLibs[aModule];
        librariesUsedByThisFile.add(lib);

        if (type === "module") {
          if (alias !== name) {
            newImportedContent.push(
              "import {" + name + " as " + alias + "} from '" + lib + "';"
            );
          } else {
            newImportedContent.push(
              "import {" + name + "} from '" + lib + "';"
            );
          }
        } else {
          // default

          if (alias === name) {
            newImportedContent.push("import " + name + " from '" + lib + "';");
          } else {
            newImportedContent.push(
              "import " + name + " as " + alias + " from '" + lib + "';"
            );
          }
        }
      }
    } else {
      let importGroups = {}; // libName => default , module

      for (const aModule of usedModules) {
        const { type, lib, alias, name } = moduleToLibs[aModule];
        librariesUsedByThisFile.add(lib);

        importGroups[lib] = importGroups[lib] || {};

        if (type === "module") {
          importGroups[lib]["module"] = importGroups[lib]["module"] || [];

          if (alias !== name) {
            importGroups[lib]["module"].push(`${name} as ${alias}`);
          } else {
            importGroups[lib]["module"].push(`${name}`);
          }
        } else {
          // default
          if (alias === name) {
            importGroups[lib]["default"] = [aModule];
          } else {
            // import * as ... , then treat it as a separate import line
            newImportedContent.push(
              `import ${name} as ${alias} from '${lib}';`
            );
          }
        }
      }

      for (const lib of Object.keys(importGroups)) {
        const libImportedModules = [];
        if (
          importGroups[lib]["default"] &&
          importGroups[lib]["default"].length === 1
        ) {
          libImportedModules.push(importGroups[lib]["default"][0]);
        }

        if (
          importGroups[lib]["module"] &&
          importGroups[lib]["module"].length > 0
        ) {
          libImportedModules.push(
            `{ ${importGroups[lib]["module"].sort().join(", ")} }`
          );
        }

        if (libImportedModules.length > 0) {
          newImportedContent.push(
            `import ${libImportedModules.join(", ")} from '${lib}';`
          );
        }
      }
    }

    for (const lib of librariesUsedByThisFile) {
      countLibUsedByFile[lib] = countLibUsedByFile[lib] || 0;
      countLibUsedByFile[lib]++;
    }

    newImportedContent = newImportedContent.sort((a, b) => {
      // first compare by the order in packages.json
      var ca = coreUtils.getLibrarySortOrder(a);
      var cb = coreUtils.getLibrarySortOrder(b);

      let res = ca - cb;

      if (res === 0) {
        // then compare by the order of the library
        ca = a.substr(a.indexOf(" from "));
        cb = b.substr(b.indexOf(" from "));

        res = ca.localeCompare(cb);

        // if from the same library, then compare against the order of the
        // imported modules
        if (res === 0) {
          return a.localeCompare(b);
        }
      }

      return res;
    });

    console.log(
      "> Repaired File:".padStart(17, " ").green(),
      file,
      notUsedModules.size + " Removed"
    );
    countProcessed++;

    let finalContent =
      newImportedContent.join("\n").trim() +
      "\n" +
      rawContentWithoutImport.replace(/[\n][\n][\n]+/g, "\n").trim();

    if (content.includes("// @ts-nocheck")) {
      finalContent =
        "// @ts-nocheck\n" + finalContent.replace(/\/\/[ ]+@ts-nocheck/, "");
    }

    finalContent = finalContent
      .replace(";\n\nimport", ";\nimport")
      .replace(";\ninterface", ";\n\ninterface")
      .replace(";\nconst", ";\n\nconst")
      .replace(";\ntype", ";\n\ntype")
      .replace(";\ndescribe", ";\n\ndescribe")
      .replace(";\ntest", ";\n\ntest")
      .replace(";\nexport", ";\n\nexport");

    fileUtils.write(file, finalContent);
  } catch (err) {
    console.log("> Error".red(), file);
  }
}

let countLibUsedByFileList = [];
for (const lib of Object.keys(countLibUsedByFile)) {
  countLibUsedByFileList.push([lib, countLibUsedByFile[lib]]);
}
countLibUsedByFileList = countLibUsedByFileList.sort((a, b) => {
  let res = b[1] - a[1];
  if (res !== 0) {
    return res;
  }
  return a[0].localeCompare(b[0]);
});

console.log("Import Stats ".padEnd(100, "=").blue());
console.log(countLibUsedByFileList.map((list) => list.join(": ")).join("\n"));
console.log("".padEnd(100, "=").blue());

console.log("Total Skipped / Processed ".padEnd(100, "=").blue());
console.log("countSkipped:", countSkipped);
console.log("countProcessed:", countProcessed);
console.log("".padEnd(100, "=").blue());

process.exit();
