const configs = {
  groupImport: false,
  filteredFiles: [],
  aggressiveCheck: false,
  transformRelativeImport: undefined,
  isTest: !!process.env.JEST_WORKER_ID,
};

for (const argv of process.argv) {
  if (argv.includes(`--groupImport`)) {
    configs.groupImport = true;
  }
  if (argv.includes(`--filter=`)) {
    configs.filteredFiles = argv.substr(argv.indexOf(`=`) + 1).split(`,`);
  }
  if (argv.includes(`--aggressive`)) {
    configs.aggressiveCheck = true;
  }
  if (argv.includes(`--transformRelativeImport=`)) {
    configs.transformRelativeImport = argv
      .substr(argv.indexOf(`=`) + 1)
      .replace(/"/g, "");
  } else if (argv.includes(`--transformRelativeImport`)) {
    configs.transformRelativeImport = "";
  }
}

// hooking up logging
if (configs.isTest) {
  console.log = () => null;
}

module.exports = configs;
