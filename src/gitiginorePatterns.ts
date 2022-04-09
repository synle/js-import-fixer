import path from 'path';
import fileUtils from 'src/fileUtils';
// figuring out what files in gitignore to skip
let gitiginorePatterns: string[] = [];

try {
  const gitignoreContent = fileUtils.read(path.join(process.cwd(), '.gitignore'));
  gitiginorePatterns = gitignoreContent
    .split('\n')
    .filter((s) => !s.includes('#') && !s.includes('*') && s);
} catch (err) {
  console.warn('Failed to read .gitignore');
}

export default gitiginorePatterns;