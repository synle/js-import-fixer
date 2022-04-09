// @ts-nocheck
import path from 'path';
import fileUtils from 'src/utils/fileUtils';

describe('fileUtils.js', () => {
  test('read', async () => {
    const actual = fileUtils.read(path.join(process.cwd(), 'package.json'));
    expect(actual).toBeDefined();
    expect(actual).toContain(`"version"`);
  });

  test('readJson', async () => {
    const actual = fileUtils.readJson(path.join(process.cwd(), 'package.json'));
    expect(actual.name).toBeDefined();
    expect(actual.description).toBeDefined();
    expect(actual.version).toBeDefined();
  });

  test('listDirNested', async () => {
    const actual = fileUtils.listDirNested(process.cwd());
    expect(actual.length > 0).toBe(true);
    expect(actual.some((f) => f.includes('/src/'))).toBe(true);
    expect(actual.some((f) => f.includes('/__mocks__/nested_dir_a/nested_dir_b/sample_4.js'))).toBe(true);
  });

  test('shouldIncludeFile - False Use Cases', async () => {
    expect(fileUtils.shouldIncludeFile(`./commons/adapters/RedisDataAdapter.spec.ts`)).toBe(true);
    expect(fileUtils.shouldIncludeFile(`./commons/adapters/RedisDataAdapter.ts`)).toBe(true);
    expect(fileUtils.shouldIncludeFile(`./src/components/ConnectionDescription/index.tsx`)).toBe(
      true,
    );
    expect(fileUtils.shouldIncludeFile(`./src/index.tsx`)).toBe(true);
    expect(fileUtils.shouldIncludeFile(`./src/App.tsx`)).toBe(true);
  });

  test('shouldIncludeFile - False Use Cases', async () => {
    expect(fileUtils.shouldIncludeFile(`./public/manifest.json`)).toBe(false);
    expect(fileUtils.shouldIncludeFile(`./tsconfig-electron.json`)).toBe(false);
    expect(fileUtils.shouldIncludeFile(`./.eslint`)).toBe(false);
    expect(fileUtils.shouldIncludeFile(`./typings.ts`)).toBe(false);
    expect(fileUtils.shouldIncludeFile(`./typings/index.ts`)).toBe(false);
    expect(fileUtils.shouldIncludeFile(`./typings/global.d.ts`)).toBe(false);
    expect(fileUtils.shouldIncludeFile(`./global.d.ts`)).toBe(false);
    expect(fileUtils.shouldIncludeFile(`./src/components/ActionDialogs`)).toBe(false);
    expect(fileUtils.shouldIncludeFile(`./src/components/ActionDialogs/index.scss`)).toBe(false);
    expect(fileUtils.shouldIncludeFile(`./src/components/ActionDialogs/index.css`)).toBe(false);
  });
});