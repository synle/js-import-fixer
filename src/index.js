const path = require("path");
const fileUtils = require("./fileUtils");
const configs = require("./configs");
const coreUtils = require("./coreUtils");
const packageJson = require("./packageJson");

console.log("Inputs / Configs ".padEnd(100, "=").blue());
console.log("PWD:", process.cwd());
console.log("".padEnd(100, "=").blue());
console.log(JSON.stringify(configs, null, 2));
console.log("".padEnd(100, "=").blue());

// external packages from json
let externalPackagesFromJson = new Set([
  ...Object.keys(packageJson.devDependencies || {}),
  ...Object.keys(packageJson.dependencies || {}),
]);
externalPackagesFromJson = [...externalPackagesFromJson].sort();

// get all relevant files
let startPath = process.cwd();
let files = coreUtils.getFilesToProcess(startPath);

global.countSkipped = 0;
global.countProcessed = 0;
global.countLibUsedByFile = {};

for (const file of files) {
  const content = fileUtils.read(file).trim();

  if (!content) {
    console.log(
      "> Skipped File (Empty Content):".padStart(17, " ").yellow(),
      file
    );
    countSkipped++;
    continue;
  }

  const importCodeLines = content.match(
    /import[ ]+[\*{a-zA-Z0-9 ,}\n]+'[@/a-zA-Z0-9-]+'[;]*/g
  );

  if (!importCodeLines || importCodeLines.length === 0) {
    console.log(
      "> Skipped File (No Import Found):".padStart(17, " ").yellow(),
      file
    );
    countSkipped++;
    continue;
  }

  coreUtils.process(file, content, externalPackagesFromJson);
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
