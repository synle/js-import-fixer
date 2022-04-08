import path from 'path';
import fileUtils from 'src/fileUtils';

const packageJson = fileUtils.readJson(path.join(process.cwd(), 'package.json')) || {};

module.exports = packageJson;

export default packageJson;