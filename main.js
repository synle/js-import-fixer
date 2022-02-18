#! /usr/bin/env node
let data = "";
const fs = require("fs");
const path = require("path");
const package = require(path.join(process.cwd(), "package.json"));

const configs = {
  groupImport: false,
  filteredFiles: [],
  aggressiveCheck: false,
};

for (const argv of process.argv) {
  if (argv.includes("--groupImport")) {
    configs.groupImport = true;
  }
  if (argv.includes("--filter=")) {
    configs.filteredFiles = argv.substr(argv.indexOf("=") + 1).split(",");
  }
  if (argv.includes("--aggressive")) {
    configs.aggressiveCheck = true;
  }
}

console.log("===========================");
console.log(JSON.stringify(configs, null, 2));
console.log("===========================");

// get all relevant files
let files = [];
let startPath = process.cwd();

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
        !newItem.includes("/node_modules/") && !newItem.includes("/coverage/")
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

// filter out the file
if (configs.filteredFiles.length > 0) {
  files = files.filter((file) =>
    configs.filteredFiles.some((filteredFile) => file.includes(filteredFile))
  );
}

const fileMap = {};
const libraryMap = {};

let externalPackages = new Set([
  ...Object.keys(package.devDependencies || {}),
  ...Object.keys(package.dependencies || {}),
]);
externalPackages = [...externalPackages].sort();

function getAliasName(moduleName) {
  if (moduleName.includes(" as ")) {
    return moduleName.substr(moduleName.indexOf(" as ") + 4).trim();
  } else {
    return moduleName;
  }
}

function getModuleName(moduleName) {
  if (moduleName.includes(" as ")) {
    return moduleName.substr(0, moduleName.indexOf(" as ")).trim();
  } else {
    return moduleName;
  }
}

function getLibrarySortOrder(a) {
  var ca = a.substr(a.indexOf(" from ") + 7);
  ca = ca.replace(/[ '\";]+/, "");

  for (let i = 0; i < externalPackages.length; i++) {
    if (ca.includes(externalPackages[i])) {
      return i;
    }
  }

  return 99999;
}

for (const file of files) {
  const content = fs.readFileSync(file, {
    encoding: "utf8",
    flag: "r",
  });

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
      console.log("> Skipped File:", file);
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
            const aliasName = getAliasName(moduleName);
            moduleName = getModuleName(moduleName);
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
            const aliasName = getAliasName(moduleName);
            moduleName = getModuleName(moduleName);
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

    if (configs.groupImport === false) {
      // here we don't group, each import is treated as a separate line
      for (const aModule of usedModules) {
        const { type, lib, alias, name } = moduleToLibs[aModule];
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

    newImportedContent = newImportedContent.sort((a, b) => {
      // first compare by the order in packages.json
      var ca = getLibrarySortOrder(a);
      var cb = getLibrarySortOrder(b);

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

    console.log("> Repaired File:", notUsedModules.size + " Removed", file);

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

    fs.writeFileSync(file, finalContent);
  } catch (err) {
    console.log(file, err);
  }
}

process.exit();
