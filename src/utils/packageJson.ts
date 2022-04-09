import path from 'path';
import fileUtils from 'src/utils/fileUtils';

const packageJson = fileUtils.readJson(path.join(process.cwd(), 'package.json')) || {};

export default packageJson;
