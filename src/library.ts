import libraryJson from 'package.json';
import configs from 'src/utils/configs';
import coreUtils from 'src/utils/coreUtils';
import fileUtils from 'src/utils/fileUtils';
import packageJson from 'src/utils/packageJson';

const fixImport = (file: string, content: string, externalPackages: string[] = [], libUsageStats = {}) => {
  return coreUtils.process(
    file,
    content,
    externalPackages,
    false,
    libUsageStats = {}
  );
}

module.exports = {
  fixImport,
  default: fixImport,
}
