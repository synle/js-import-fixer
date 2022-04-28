import libraryJson from 'package.json';
import configs from 'src/utils/configs';
import coreUtils from 'src/utils/coreUtils';
import fileUtils from 'src/utils/fileUtils';
import packageJson from 'src/utils/packageJson';
console.log('Inputs / Configs '.padEnd(100, '=').blue());
console.log('PWD:', process.cwd());
console.log('Version:', libraryJson.version);
console.log(''.padEnd(100, '=').blue());
console.log(JSON.stringify(configs, null, 2));
console.log(''.padEnd(100, '=').blue());

// external packages from json
const externalPackagesFromJson = fileUtils.getExternalDependencies([
  ...Object.keys(packageJson.devDependencies || {}),
  ...Object.keys(packageJson.dependencies || {}),
  ...Object.keys(packageJson.peerDependencies || {}),
  ...Object.keys(packageJson.optionalDependencies || {}),
]);

// get all relevant files
let startPath = process.cwd();
let files = coreUtils.getFilesToProcess(startPath);
console.log('Total Files Count:', files.length);
console.log(''.padEnd(100, '=').blue());

let countSkipped = 0;
let countProcessed = 0;
let countLibUsedByFile : Record<string, number>= {};

for (const file of files) {
  const output = coreUtils.process(file, externalPackagesFromJson, false, countLibUsedByFile);

  if(output.error){
    console.log('> Error:'.padStart(17, ' ').yellow(), file, output.message);
    countSkipped++;
  } else {
    countProcessed++;
  }
}

let countLibUsedByFileList: [string, number][] = [];
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

console.log('Import Stats '.padEnd(100, '=').blue());
console.log(countLibUsedByFileList.map((list) => list.join(': ')).join('\n'));
console.log(''.padEnd(100, '=').blue());

console.log('Total Skipped / Processed '.padEnd(100, '=').blue());
console.log('countSkipped:', countSkipped);
console.log('countProcessed:', countProcessed);
console.log(''.padEnd(100, '=').blue());

process.exit();
