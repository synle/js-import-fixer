import coreUtils from 'src/utils/coreUtils';

const fixImport = (
  file: string,
  content: string,
  externalPackages: string[] = [],
  dontWriteToOutputFile = false,
  libUsageStats = {},
) => {
  return coreUtils.process(file, content, externalPackages, dontWriteToOutputFile, (libUsageStats = {}));
};

module.exports = {
  fixImport,
  default: fixImport,
};
