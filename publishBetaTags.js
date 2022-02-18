const fs = require('fs');
const oldPackageJson = JSON.parse(fs.readFileSync('./package.json'));
const oldVersion = oldPackageJson.version;

// construct the new temp build
const versionSplits = oldPackageJson.version.split(/[\.-]/);
const [major, minor, patch, postfix] = versionSplits;
const newTempVersion = `${major}.${minor}.${patch}-${Date.now()}`;

// set the new temp version
oldPackageJson.version = newTempVersion;
fs.writeFileSync('./package.json', JSON.stringify(oldPackageJson, null, 2));
console.log('New Beta Tags:', newTempVersion);
