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

module.exports = configs;
