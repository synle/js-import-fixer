import fs from 'fs';
import path from 'path';

const fileUtils = {
  read: (file: string) => fs.readFileSync(file, { encoding: 'utf-8' }),
  readJson: (file: string) => {
    try {
      return JSON.parse(fileUtils.read(file));
    } catch (err) {
      console.warn('readJson failed', err);
      return undefined;
    }
  },
  write: (file: string, content: string) => fs.writeFileSync(file, content),
  listDirNested: (startPath: string) => {
    let files : string[] = [];
    let stack : string[] = [startPath];

    while (stack.length > 0) {
      const file = stack.pop();

      if(!file){
        continue;
      }

      if (fs.lstatSync(file).isDirectory()) {
        // is a dir
        const files = fs.readdirSync(file).map((newFile) => path.join(file, newFile));
        stack = [...stack, ...files].filter(
          (newFile) => !newFile.includes('/node_modules/') && !newFile.includes('/coverage/'),
        );
      } else {
        // is a file
        if (fileUtils.shouldIncludeFile(file)) {
          files.push(file);
        }
      }
    }
    return files;
  },
  shouldIncludeFile: (file: string) => {
    if (
      !file.includes('.json') &&
      !file.includes('.snap') &&
      !file.includes('.eslint') &&
      !file.includes('/typings/') &&
      !file.includes('typings.ts') &&
      !file.includes('.d.ts') &&
      true
    ) {
      if (
        file.includes('.ts') ||
        file.includes('.tsx') ||
        file.includes('.js') ||
        file.includes('.tsx')
      ) {
        return true;
      }
    }

    return false;
  },
};

module.exports = fileUtils;

export default fileUtils;