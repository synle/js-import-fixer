// @ts-nocheck
import { getConfigs } from 'src/utils/configs';

describe('configs.getConfigs', () => {
  test('example 1 with custom values', async () => {
    const argvs =
      `--groupImport --aggressive --transformRelativeImport --importQuote=" --filter=aa,bb,cc --ignored=x,y,z`.split(
        ' ',
      );
    const actual = getConfigs(argvs);
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "aggressiveCheck": true,
        "filteredFiles": Array [
          "aa",
          "bb",
          "cc",
        ],
        "groupImport": true,
        "ignoredFiles": Array [
          "x",
          "y",
          "z",
        ],
        "importQuote": "\\"",
        "isTest": true,
        "parseLegacyImports": false,
        "transformRelativeImport": "",
      }
    `);
  });

  test('example 2 with custom values', async () => {
    const argvs =
      `--groupImport --importQuote --filter=aa,bb,cc --ignored=x,y,z --parseLegacyImports`.split(
        ' ',
      );
    const actual = getConfigs(argvs);
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "aggressiveCheck": false,
        "filteredFiles": Array [
          "aa",
          "bb",
          "cc",
        ],
        "groupImport": true,
        "ignoredFiles": Array [
          "x",
          "y",
          "z",
        ],
        "importQuote": "'",
        "isTest": true,
        "parseLegacyImports": true,
        "transformRelativeImport": undefined,
      }
    `);
  });

  test('example 3 with no values', async () => {
    const argvs = [];
    const actual = getConfigs(argvs);
    expect(actual).toMatchInlineSnapshot(`
      Object {
        "aggressiveCheck": false,
        "filteredFiles": Array [],
        "groupImport": false,
        "ignoredFiles": Array [],
        "importQuote": "'",
        "isTest": true,
        "parseLegacyImports": false,
        "transformRelativeImport": undefined,
      }
    `);
  });
});
