const fs = require('fs');
const oldPackageJson = JSON.parse(fs.readFileSync('./package.json'));
const oldVersion = oldPackageJson.version;

// get the number from package version
const versionSplits = oldPackageJson.version.split(/[\.-]/);
const [major, minor, patch, postfix] = versionSplits;

// get the number from now timestamps
const year = new Date().getFullYear().toString().substr(2);
const month = (new Date().getMonth() + 1).toString().padStart(2, '0');
const day = new Date().getDate().toString().padStart(2, '0');
const hour = new Date().getHours().toString().padStart(2, '0');
const minute = new Date().getMinutes().toString().padStart(2, '0');
const fullVersionName = `${year}${month}${day}${hour}${minute}`;

// construct the new temp build
let newTempVersion = `${major}.${minor}.${fullVersionName}`;
if (process.env.TAG_MODE === 'beta') {
  newTempVersion += `-beta`;
}

// set the new temp version
oldPackageJson.version = newTempVersion;
fs.writeFileSync('./package.json', JSON.stringify(oldPackageJson, null, 2));
console.log('New Version:', process.env.TAG_MODE, newTempVersion);
