import coreUtils from 'src/utils/coreUtils';

const fixImport = (
  file: string,
  content: string,
  externalPackages: string[] = [],
  libUsageStats = {},
) => {
  return coreUtils.process(file, content, externalPackages, false, (libUsageStats = {}));
};

module.exports = {
  fixImport,
  default: fixImport,
};
