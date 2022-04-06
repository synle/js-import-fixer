const fs = require("fs");
const fileUtils = require("./fileUtils");
const path = require("path");
const configs = require("./configs");
const gitiginorePatterns = require("./gitiginorePatterns");
require("./color");

const coreUtils = {
  getFilesToProcess: (startPath) => {
    let files = fileUtils.listDirNested(startPath);

    // filter out all the files in gitignore
    if (gitiginorePatterns.length > 0) {
      files = files.filter((file) =>
        gitiginorePatterns.every(
          (gitiginorePattern) => !file.replace(process.cwd(), '').includes(gitiginorePattern)
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
  getLibrarySortOrder: (a, externalPackages) => {
    let ca = a.substr(a.indexOf(" from ") + 7);
    ca = ca.replace(/[ '";]+/g, "");

    for (let i = 0; i < externalPackages.length; i++) {
      if (ca.includes(externalPackages[i])) {
        return i;
      }
    }

    return 99999;
  },
  getSortedImports: (unsortedImports, externalPackages = []) => {
    return unsortedImports.sort((a, b) => {
      // first compare by the order in packages.json
      let ca = coreUtils.getLibrarySortOrder(a, externalPackages);
      let cb = coreUtils.getLibrarySortOrder(b, externalPackages);

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
  },
  process: (file, externalPackagesFromJson, dontWriteToOutputFile = false) => {
    try {
      const content = fileUtils.read(file).trim();

      if (!content) {
        console.log(
          "> Skipped File (Empty Content):".padStart(17, " ").yellow(),
          file
        );
        countSkipped++;
        return;
      }

      // lib_name => [array of modules]
      // '@mui/material/CircularProgress': [ { name: 'CircularProgress', type: 'default' } ]
      let libToModules = {};
      let moduleToLibs = {};

      // set of used modules
      let allImportedModules = new Set();
      let notUsedModules = new Set();
      let usedModules = new Set();

      let rawContentWithoutImport;
      rawContentWithoutImport = content.replace(
        /import[ ]+[\*{a-zA-Z0-9 ,}\n]+['"][@/a-zA-Z0-9-]+['"][;]*/g,
        ""
      );

      const importCodeLines = content.match(
        /import[ ]+[\*{a-zA-Z0-9 ,}\n]+['"][@/a-zA-Z0-9-]+['"][;]*/g
      );
      if (!importCodeLines || importCodeLines.length === 0) {
        console.log(
          "> Skipped File (No Import):".padStart(17, " ").yellow(),
          file,
          importCodeLines
        );
        countSkipped++;
        return;
      }

      // here we figured out what imports are being imported
      // and if it has an alias and if it's a module / default imported
      importCodeLines.forEach((s) => {
        const foundImportedModules = s
          .match(/from[ ]+['"][@/a-zA-Z0-9-]+['"][;]*/, "")[0]
          .replace(/from[ ]+['"]/, "")
          .replace(/['"]/, "")
          .replace(/;/, "");
        libToModules[foundImportedModules] =
          libToModules[foundImportedModules] || [];
        let parsed = s
          .replace(/from[ ]+['"][@/a-zA-Z0-9-]+['"][;]*/, "")
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
      let newImportedContent = [];

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
              newImportedContent.push(
                "import " + name + " from '" + lib + "';"
              );
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

      newImportedContent = coreUtils.getSortedImports(
        newImportedContent,
        externalPackagesFromJson
      );

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

      if (dontWriteToOutputFile !== true) {
        fileUtils.write(file, finalContent);
      }

      return finalContent;
    } catch (err) {
      console.log("[Error] process failed for file: ".red(), file, err);
    }
  },
};

module.exports = coreUtils;
