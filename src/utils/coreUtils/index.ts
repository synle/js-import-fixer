import path from 'path';
import configs from 'src/utils/configs';
import fileUtils from 'src/utils/fileUtils';
import gitiginorePatterns from 'src/utils/gitiginorePatterns';
import 'src/utils/color';

type ImportType = 'module' | 'default';

type ImportEntry = {
  name: string;
  type: ImportType;
  lib: string;
  libFullPath: string;
  alias: string;
};

/**
 * @type {Map} in the shape of LibraryName => ImportEntry[]
 *             aka "react" => ImportEntry[]
 */
type LibraryName = string;

type ModuleUsageMap = Record<LibraryName, ImportEntry[]>;

/**
 * @type {string} the methods / modules imported inside of a library
 *                aka useState, useEffect, etc... (module name)
 */
type ModuleName = string;

/**
 * @type {Map} in the shape of ModuleName => ImportEntry
 *             aka "useState" => ImportEntry
 */
type LibraryImportMap = Record<ModuleName, ImportEntry>;

/**
 * @type {Set<string>} a set of imported modules used by a code base
 */
type ImportedModules = Set<string>;


type LibUsageStatMap = Record<LibraryName, number>;

/**
 * @type {ImportProcessOutput} output generated when we parse all the import lines
 */
type ImportProcessOutput = {
  moduleUsageMap: ModuleUsageMap;
  libraryImportMap: LibraryImportMap;
  importedModules: ImportedModules;
};

type MainProcessOutput = {
  error: true;
  message: string;
} | {
  error: false;
  output: string;
  libUsageStats: LibUsageStatMap;
}

/**
 * @type {RegExp} used to extract the full line of import using ES6 style
 *                will `match import abc from 'lib';`
 */
const REGEX_IMPORT_ES6_FULL_LINE =
  /^import[ ]+[\*{a-zA-Z0-9_ ,}\n]+['"][.@/a-zA-Z0-9-_]+['"][;]*/gm;

/**
 * @type {RegExp} used to extract the partials for the library name
 *                will `match from 'lib'`
 */
const REGEX_IMPORT_ES6_PARTIAL_LIBRARY_NAME = /from[ ]+['"][.@/a-zA-Z0-9-_]+['"][;]*/;
/**
 * @type {RegExp} used to extract the full line of import using legacy style
 *                will `const fs = require('fs');`
 */
const REGEX_IMPORT_LEGACY_FULL_LINE =
  /^^(var|let|const)[ ][\*{a-zA-Z0-9_ ,}\n]+[ ]*=[ ]*require[ ]*\([ ]*['"][.@/a-zA-Z0-9-_]+['"][ ]*\)[ ]*[;]*/gm;

/**
 * @type {[type]}
 */
const REGEX_IMPORT_LEGACY_PARTIAL_LIBRARY_NAME =
  /[ ]*require[ ]*\([ ]*['"][.@/a-zA-Z0-9-_]+['"][ ]*\)[ ]*[;]*/;

const coreUtils = {
  getFilesToProcess: (startPath: string) => {
    let files = fileUtils.listDirNested(startPath);

    // filter out all the files in gitignore
    if (gitiginorePatterns.length > 0) {
      files = files.filter((file) =>
        gitiginorePatterns.every(
          (gitiginorePattern) => !file.replace(process.cwd(), '').includes(gitiginorePattern),
        ),
      );
    }

    // filter out the file if there is a filter
    if (configs.filteredFiles.length > 0) {
      files = files.filter((file) =>
        configs.filteredFiles.some((filteredFile) => file.includes(filteredFile)),
      );
    }

    if (configs.ignoredFiles.length > 0) {
      files = files.filter(
        (file) => !configs.ignoredFiles.some((ignoredFile) => file.includes(ignoredFile)),
      );
    }

    // doing a quick sort to make file easier to follow
    files = files.sort();

    return files;
  },
  getAliasName: (moduleName: string) => {
    if (moduleName.includes(' as ')) {
      return moduleName.substr(moduleName.indexOf(' as ') + 4).trim();
    } else {
      return moduleName;
    }
  },
  getModuleName: (moduleName: string) => {
    if (moduleName.includes(' as ')) {
      return moduleName.substr(0, moduleName.indexOf(' as ')).trim();
    } else {
      return moduleName;
    }
  },
  getLibrarySortOrder: (a: string, externalPackages: string[]) => {
    let ca = a.substr(a.indexOf(' from ') + 7);
    ca = ca.replace(/[ '";]+/g, '');

    for (let i = 0; i < externalPackages.length; i++) {
      if (ca.indexOf(externalPackages[i]) === 0) {
        return i;
      }
    }

    return 99999;
  },
  getSortedImports: (unsortedImports: string[], externalPackages: string[] = []) => {
    return unsortedImports.sort((a, b) => {
      // first compare by the order in packages.json
      let ca = coreUtils.getLibrarySortOrder(a, externalPackages);
      let cb = coreUtils.getLibrarySortOrder(b, externalPackages);

      let res = ca - cb;

      if (res === 0) {
        // then compare by the order of the library
        const sa = a.substr(a.indexOf(' from '));
        const sb = b.substr(b.indexOf(' from '));

        res = sa.localeCompare(sb);

        // if from the same library, then compare against the order of the
        // imported modules
        if (res === 0) {
          return a.localeCompare(b);
        }
      }

      return res;
    });
  },
  /**
   * here we figured out what imports are being imported
    and if it has an alias and if it's a module / default imported
    this method parses ES6 style import
   */
  parseEs6ImportLines: (
    file: string,
    importCodeLines: string[],
    moduleUsageMap: ModuleUsageMap = {},
    libraryImportMap: LibraryImportMap = {},
    importedModules: ImportedModules = new Set(),
  ): ImportProcessOutput => {
    for (const s of importCodeLines) {
      try {
        //@ts-ignore
        const lib = s
          .match(REGEX_IMPORT_ES6_PARTIAL_LIBRARY_NAME)[0]
          .replace(/from[ ]+['"]/, '')
          .replace(/['"]/, '')
          .replace(/;/, '');
        moduleUsageMap[lib] = moduleUsageMap[lib] || [];
        let parsedImprotedModule = s
          .replace(REGEX_IMPORT_ES6_PARTIAL_LIBRARY_NAME, '')
          .replace('import ', '')
          .replace(/[ \n]+/g, ' ');

        const moduleSplits = parsedImprotedModule.split('{');

        let libFullPath = lib;
        if (libFullPath.indexOf('./') === 0 || libFullPath.indexOf('../') === 0) {
          // this is a relative imports, then resolve the path if needed
          if (configs.transformRelativeImport !== undefined) {
            libFullPath = path.resolve(path.dirname(file), lib).replace(process.cwd() + '/', '');

            // adding the prefix
            if (configs.transformRelativeImport) {
              libFullPath = configs.transformRelativeImport + libFullPath;
            }
          }
        }

        // process each of the module splits
        coreUtils.processParseSplits(
          lib,
          libFullPath,
          parsedImprotedModule,
          moduleUsageMap,
          libraryImportMap,
          importedModules,
        );
      } catch (err) {}
    }

    return {
      moduleUsageMap,
      libraryImportMap,
      importedModules,
    };
  },
  /**
   * here we figured out what imports are being imported
    and if it has an alias and if it's a module / default imported
    this method parses ES6 style import
   */
  parseLegacyImportsLines: (
    file: string,
    importCodeLines: string[],
    moduleUsageMap: ModuleUsageMap = {},
    libraryImportMap: LibraryImportMap = {},
    importedModules: ImportedModules = new Set(),
  ): any => {
    for (const s of importCodeLines) {
      try {
        let lib = s;
        //@ts-ignore
        lib = lib.match(REGEX_IMPORT_LEGACY_PARTIAL_LIBRARY_NAME)[0];
        lib = lib.substr(lib.indexOf('(') + 1);
        lib = lib.substr(0, lib.lastIndexOf(')'));
        lib = lib.trim().replace(/['"]/g, '').trim();

        let parsedImprotedModule = s;
        parsedImprotedModule = parsedImprotedModule.replace(/(var|let|const)/, '');
        parsedImprotedModule = parsedImprotedModule.substr(0, parsedImprotedModule.indexOf('='));
        parsedImprotedModule = parsedImprotedModule.trim();

        moduleUsageMap[lib] = moduleUsageMap[lib] || [];

        // we don't override the import path for legacy import
        const libFullPath = lib;

        // process each of the module splits
        coreUtils.processParseSplits(
          lib,
          libFullPath,
          parsedImprotedModule,
          moduleUsageMap,
          libraryImportMap,
          importedModules,
        );
      } catch (err) {}
    }

    return {
      moduleUsageMap,
      libraryImportMap,
      importedModules,
    };
  },
  processParseSplits: (
    lib: string,
    libFullPath: string,
    parsedImprotedModule: string,
    moduleUsageMap: ModuleUsageMap = {},
    libraryImportMap: LibraryImportMap = {},
    importedModules: ImportedModules = new Set(),
  ) => {
    const moduleSplits = parsedImprotedModule.split('{');

    for (let moduleSplit of moduleSplits) {
      let importEntry: ImportEntry;
      if (moduleSplit.includes('}')) {
        // will be parsed as module
        moduleSplit = moduleSplit.replace('}', '');
        const childModuleSplits = moduleSplit
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s);
        for (let moduleName of childModuleSplits) {
          // is a child module import
          const aliasName = coreUtils.getAliasName(moduleName);
          moduleName = coreUtils.getModuleName(moduleName);
          importedModules.add(aliasName);

          importEntry = {
            name: moduleName,
            alias: aliasName,
            type: 'module',
            lib,
            libFullPath,
          };

          moduleUsageMap[lib].push(importEntry);
          libraryImportMap[aliasName] = importEntry;
        }
      } else {
        // will be parsed as default
        const defaultModuleSplits = moduleSplit
          .split(',')
          .map((s) => s.trim())
          .filter((s) => s);
        for (let moduleName of defaultModuleSplits) {
          // is default import
          const aliasName = coreUtils.getAliasName(moduleName);
          moduleName = coreUtils.getModuleName(moduleName);
          importedModules.add(aliasName);

          importEntry = {
            name: moduleName,
            alias: aliasName,
            type: 'default',
            lib,
            libFullPath,
          };

          moduleUsageMap[lib].push(importEntry);
          libraryImportMap[aliasName] = importEntry;
        }
      }
    }
  },
  generateImportsOutput: (
    usedModules: Set<string>,
    moduleUsageMap: ModuleUsageMap,
    libraryImportMap: LibraryImportMap,
    libUsageStats: LibUsageStatMap,
  ) => {
    // generate the new import
    let newImportedContent: string[] = [];

    const librariesUsedByThisFile = new Set<string>(); // note here, we don't count duplicate lib imports in the same file...

    if (configs.groupImport === false) {
      // here we don't group, each import is treated as a separate line
      for (const aModule of usedModules) {
        const { type, lib, libFullPath, alias, name } = libraryImportMap[aModule];
        librariesUsedByThisFile.add(lib);

        if (type === 'module') {
          if (alias !== name) {
            newImportedContent.push(`import { ${name} as ${alias} } from '${libFullPath}';`);
          } else {
            newImportedContent.push(`import { ${name} } from '${libFullPath}';`);
          }
        } else {
          // default
          if (alias === name) {
            newImportedContent.push(`import ${name} from '${libFullPath}';`);
          } else {
            newImportedContent.push(`import ${name} as ${alias} from '${libFullPath}';`);
          }
        }
      }
    } else {
      let importGroups: Record<string, Record<string, string[]>> = {}; // libName => default , module

      for (const aModule of usedModules) {
        const { type, lib, libFullPath, alias, name } = libraryImportMap[aModule];
        librariesUsedByThisFile.add(lib);

        importGroups[lib] = importGroups[lib] || {};

        if (type === 'module') {
          importGroups[lib]['module'] = importGroups[lib]['module'] || [];

          if (alias !== name) {
            importGroups[lib]['module'].push(`${name} as ${alias}`);
          } else {
            importGroups[lib]['module'].push(`${name}`);
          }
        } else {
          // default
          if (alias === name) {
            importGroups[lib]['default'] = [aModule];
          } else {
            // import * as ... , then treat it as a separate import line
            newImportedContent.push(`import ${name} as ${alias} from '${lib}';`);
          }
        }
      }

      for (const lib of Object.keys(importGroups)) {
        const libImportedModules: string[] = [];
        if (importGroups[lib]['default'] && importGroups[lib]['default'].length === 1) {
          libImportedModules.push(importGroups[lib]['default'][0]);
        }

        if (importGroups[lib]['module'] && importGroups[lib]['module'].length > 0) {
          //@ts-ignore
          libImportedModules.push(
            `{ ${importGroups[lib]['module']
              .sort((a: string, b: string) => a.toLowerCase().localeCompare(b.toLowerCase()))
              .join(', ')} }`,
          );
        }

        if (libImportedModules.length > 0) {
          const libFullPath = moduleUsageMap[lib][0].libFullPath;
          newImportedContent.push(`import ${libImportedModules.join(', ')} from '${libFullPath}';`);
        }
      }
    }

    for (const lib of librariesUsedByThisFile) {
      libUsageStats[lib] = libUsageStats[lib] || 0;
      libUsageStats[lib]++;
    }

    return newImportedContent;
  },
  process: (file: string, externalPackagesFromJson: string[], dontWriteToOutputFile = false, libUsageStats : LibUsageStatMap = {}) : MainProcessOutput => {
    try {
      const content = fileUtils.read(file).trim();

      if (!content) {
        console.log('> Skipped File (Empty Content):'.padStart(17, ' ').yellow(), file);
        return {
          error: true,
          message: 'File Content is empty'
        };
      }

      let moduleUsageMap: ModuleUsageMap = {};
      let libraryImportMap: LibraryImportMap = {};
      let importedModules: ImportedModules = new Set();

      // set of used modules
      let notUsedModules = new Set<string>();
      let usedModules = new Set<string>();

      let rawContentWithoutImport = content.replace(REGEX_IMPORT_ES6_FULL_LINE, '');
      let es6ImportCodeLines = content.match(REGEX_IMPORT_ES6_FULL_LINE) || [];

      // here we parse raw imports
      coreUtils.parseEs6ImportLines(
        file,
        es6ImportCodeLines,
        moduleUsageMap,
        libraryImportMap,
        importedModules,
      );

      if (configs.parseLegacyImports) {
        rawContentWithoutImport = rawContentWithoutImport.replace(
          REGEX_IMPORT_LEGACY_FULL_LINE,
          '',
        );
        let legacyImportCodeLines = content.match(REGEX_IMPORT_LEGACY_FULL_LINE) || [];

        coreUtils.parseLegacyImportsLines(
          file,
          legacyImportCodeLines,
          moduleUsageMap,
          libraryImportMap,
          importedModules,
        );
      }

      if (!importedModules || importedModules.size === 0) {
        console.log('> Skipped File (No Import):'.padStart(17, ' ').yellow(), file);
        return {
          error: true,
          message: 'No Import of any kind was found'
        };
      }

      // here we figure out if an import is actually used in the code
      for (const aModule of importedModules) {
        let isModuleUsed = false;

        if (configs.aggressiveCheck === true) {
          if (rawContentWithoutImport.match(`<${aModule}`)) {
            // used as a react component
            isModuleUsed = true;
          }
          if (
            rawContentWithoutImport.match(new RegExp('[ ]+' + aModule + '[ ]*')) ||
            rawContentWithoutImport.match(new RegExp('[ ]*' + aModule + '[ ]+')) ||
            rawContentWithoutImport.match(new RegExp(aModule + '[.}(-+]+'))
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
      let newImportedContent = coreUtils.generateImportsOutput(
        usedModules,
        moduleUsageMap,
        libraryImportMap,
        libUsageStats
      );

      newImportedContent = coreUtils.getSortedImports(
        newImportedContent.map((importedLine) => importedLine.replace(/'/g, configs.importQuote)),
        externalPackagesFromJson,
      );

      console.log(
        '> Repaired File:'.padStart(17, ' ').green(),
        file,
        notUsedModules.size + ' Removed',
      );

      let finalContent =
        newImportedContent.join('\n').trim() +
        '\n' +
        rawContentWithoutImport.replace(/[\n][\n][\n]+/g, '\n').trim();

      if (content.match(/^\/\/[ ]+@ts-nocheck+/)) {
        finalContent = '// @ts-nocheck\n' + finalContent.replace(/\/\/[ ]+@ts-nocheck/, '');
      }

      finalContent = finalContent
        .replace(';\n\nimport', ';\nimport')
        .replace(';\ninterface', ';\n\ninterface')
        .replace(';\nconst', ';\n\nconst')
        .replace(';\ntype', ';\n\ntype')
        .replace(';\ndescribe', ';\n\ndescribe')
        .replace(';\ntest', ';\n\ntest')
        .replace(';\nexport', ';\n\nexport');

      if (dontWriteToOutputFile !== true) {
        fileUtils.write(file, finalContent);
      }

      return {
        error: false,
        output: finalContent,
        libUsageStats,
      };
    } catch (err) {
      console.log('[Error] process failed for file: '.red(), file, err);

      return {
        error: true,
        message: 'Uncaught Error: ' + JSON.stringify(err),
      };
    }
  },
};

export default coreUtils;
