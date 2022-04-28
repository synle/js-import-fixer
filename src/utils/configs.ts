type Config = {
  isTest: boolean;
  groupImport: boolean;
  filteredFiles: string[];
  ignoredFiles: string[];
  aggressiveCheck: boolean;
  transformRelativeImport?: string;
  importQuote: string;
  parseLegacyImport: boolean;
};

export function getConfigs(argvs: string[]) {
  const configs: Config = {
    isTest: !!process.env.JEST_WORKER_ID,
    groupImport: false,
    filteredFiles: [],
    ignoredFiles: [],
    aggressiveCheck: false,
    transformRelativeImport: undefined,
    importQuote: `'`,
    parseLegacyImport: false,
  };

  for (const argv of argvs) {
    if (argv.includes(`--groupImport`)) {
      configs.groupImport = true;
    }
    if (argv.includes(`--filter=`)) {
      configs.filteredFiles = argv.substr(argv.indexOf(`=`) + 1).split(`,`);
    }
    if (argv.includes(`--ignored=`)) {
      configs.ignoredFiles = argv.substr(argv.indexOf(`=`) + 1).split(`,`);
    }
    if (argv.includes(`--aggressive`)) {
      configs.aggressiveCheck = true;
    }
    if (argv.includes(`--transformRelativeImport=`)) {
      configs.transformRelativeImport = argv.substr(argv.indexOf(`=`) + 1).replace(/"/g, '');
    } else if (argv.includes(`--transformRelativeImport`)) {
      configs.transformRelativeImport = '';
    }
    if (argv.includes(`--importQuote=`)) {
      configs.importQuote = argv.substr(argv.indexOf(`=`) + 1).trim() !== 'single' ? `"` : `'`;
    }
    if (argv.includes(`--parseLegacyImport`)) {
      configs.parseLegacyImport = true;
    }
  }
  return configs;
}

const configs = getConfigs(process.argv);

// hooking up logging
if (configs.isTest) {
  console.log = () => null;
}

export default configs;
