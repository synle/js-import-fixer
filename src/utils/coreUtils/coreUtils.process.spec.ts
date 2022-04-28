// @ts-nocheck
import path from 'path';
import configs from 'src/utils/configs';
import coreUtils from 'src/utils/coreUtils';
import fileUtils from 'src/utils/fileUtils';

const clonedConfigs = { ...configs };

describe('coreUtils.process', () => {
  const mockedExternalPackage = fileUtils.getExternalDependencies(['externalLib1', 'externalLib2']);

  const fileSample0 = path.join('__mocks__/', 'sample_0.js');
  const fileSample1 = path.join('__mocks__/', 'sample_1.js');
  const fileSample2 = path.join('__mocks__/', 'sample_2.js');
  const fileSample3 = path.join('__mocks__/', 'sample_3.js');
  const fileSample4 = path.join('__mocks__/nested_dir_a/nested_dir_b', 'sample_4.js');
  const fileSample5 = path.join('__mocks__/', 'sample_5.js');
  const fileSample6 = path.join('__mocks__/', 'sample_6.js');

  afterEach(() => {
    for (const key of Object.keys(clonedConfigs)) {
      configs[key] = clonedConfigs[key];
    }
  });

  test('sample_0.js simple', async () => {
    const actual = coreUtils.process(fileSample0, mockedExternalPackage, true);

    expect(actual.error).toBe(true);
    expect(actual.message).toMatchInlineSnapshot(`"No Import of any kind was found"`);
  });

  test('sample_1.js simple', async () => {
    // configs.groupImport = false; (implied)

    const actual = coreUtils.process(fileSample1, mockedExternalPackage, true);

    expect(actual.error).toBe(false);

    expect(actual.libUsageStats).toMatchInlineSnapshot(`
        Object {
          "externalLib1": 1,
          "externalLib2": 1,
        }
      `);

    expect(actual.output).toMatchInlineSnapshot(`
      "import { aliasMethodLib1 as myAliasMethod1 } from 'externalLib1';
      import { constant1 } from 'externalLib1';
      import { methodLib1 } from 'externalLib1';
      import externalLib1 from 'externalLib1';
      import { constant2 } from 'externalLib2';
      import externalLib2 from 'externalLib2';
      var a1 = constant1;
      methodLib1();
      externalLib1();
      myAliasMethod1();

      var a2 = constant2;
      var temp2 = externalLib2();"
    `);
  });

  test('sample_1.js withGroupImport', async () => {
    configs.groupImport = true;

    const actual = coreUtils.process(fileSample1, mockedExternalPackage, true);

    expect(actual.error).toBe(false);

    expect(actual.libUsageStats).toMatchInlineSnapshot(`
        Object {
          "externalLib1": 1,
          "externalLib2": 1,
        }
      `);

    expect(actual.output).toMatchInlineSnapshot(`
      "import externalLib1, { aliasMethodLib1 as myAliasMethod1, constant1, methodLib1 } from 'externalLib1';
      import externalLib2, { constant2 } from 'externalLib2';
      var a1 = constant1;
      methodLib1();
      externalLib1();
      myAliasMethod1();

      var a2 = constant2;
      var temp2 = externalLib2();"
    `);
  });

  test('sample_2.js simple', async () => {
    // configs.groupImport = false; (implied)

    const actual = coreUtils.process(fileSample2, mockedExternalPackage, true);

    expect(actual.error).toBe(false);

    expect(actual.libUsageStats).toMatchInlineSnapshot(`
        Object {
          "externalLib1": 1,
          "externalLib2": 1,
        }
      `);

    expect(actual.output).toMatchInlineSnapshot(`
      "import { aliasMethodLib1 as myAliasMethod1 } from 'externalLib1';
      import { constant1 } from 'externalLib1';
      import { methodLib1 } from 'externalLib1';
      import externalLib1 from 'externalLib1';
      import { constant2 } from 'externalLib2';
      import externalLib2 from 'externalLib2';
      var a1 = constant1;
      methodLib1();
      externalLib1();
      myAliasMethod1();

      var a2 = constant2;
      var temp2 = externalLib2();"
    `);
  });

  test('sample_2.js withGroupImport', async () => {
    configs.groupImport = true;

    const actual = coreUtils.process(fileSample2, mockedExternalPackage, true);

    expect(actual.error).toBe(false);

    expect(actual.libUsageStats).toMatchInlineSnapshot(`
        Object {
          "externalLib1": 1,
          "externalLib2": 1,
        }
      `);

    expect(actual.output).toMatchInlineSnapshot(`
      "import externalLib1, { aliasMethodLib1 as myAliasMethod1, constant1, methodLib1 } from 'externalLib1';
      import externalLib2, { constant2 } from 'externalLib2';
      var a1 = constant1;
      methodLib1();
      externalLib1();
      myAliasMethod1();

      var a2 = constant2;
      var temp2 = externalLib2();"
    `);
  });

  test('sample_3.js withGroupImport', async () => {
    configs.groupImport = true;

    const actual = coreUtils.process(fileSample3, mockedExternalPackage, true);

    expect(actual.error).toBe(false);

    expect(actual.libUsageStats).toMatchInlineSnapshot(`
        Object {
          "externalLib1": 1,
          "externalLib2": 1,
        }
      `);

    expect(actual.output).toMatchInlineSnapshot(`
      "import externalLib1, { aliasMethodLib1 as myAliasMethod1, constant1, methodLib1 } from 'externalLib1';
      import externalLib2, { constant2 } from 'externalLib2';
      var a1 = constant1;
      methodLib1();
      externalLib1();
      myAliasMethod1();

      var a2 = constant2;
      var temp2 = externalLib2();"
    `);
  });

  test('sample_4.js with transformRelativeImport', async () => {
    configs.groupImport = true;
    configs.transformRelativeImport = '';

    const actual = coreUtils.process(fileSample4, mockedExternalPackage, true);

    expect(actual.error).toBe(false);

    expect(actual.libUsageStats).toMatchInlineSnapshot(`
        Object {
          "../Calculator": 1,
          "externalLib1": 1,
        }
      `);

    expect(actual.output).toMatchInlineSnapshot(`
      "import externalLib1 from 'externalLib1';
      import { sum } from '__mocks__/nested_dir_a/Calculator';

      const res1 = sum(1,2);
      externalLib1();"
    `);
  });

  test('sample_4.js with transformRelativeImport=somePathPrefix/', async () => {
    configs.groupImport = true;
    configs.transformRelativeImport = 'somePathPrefix/';

    const actual = coreUtils.process(fileSample4, mockedExternalPackage, true);

    expect(actual.error).toBe(false);

    expect(actual.libUsageStats).toMatchInlineSnapshot(`
        Object {
          "../Calculator": 1,
          "externalLib1": 1,
        }
      `);

    expect(actual.output).toMatchInlineSnapshot(`
      "import externalLib1 from 'externalLib1';
      import { sum } from 'somePathPrefix/__mocks__/nested_dir_a/Calculator';

      const res1 = sum(1,2);
      externalLib1();"
    `);
  });

  test('sample_5.js simple', async () => {
    const actual = coreUtils.process(fileSample5, mockedExternalPackage, true);

    expect(actual.error).toBe(false);

    expect(actual.libUsageStats).toMatchInlineSnapshot(`
      Object {
        "child_process": 1,
        "externalLib1": 1,
        "path": 1,
        "src/internalLib3": 1,
      }
    `);

    expect(actual.output).toMatchInlineSnapshot(`
      "import { default as my_child_process } from 'child_process';
      import { aliasMethodLib1 as myAliasMethod1 } from 'externalLib1';
      import { constant1 } from 'externalLib1';
      import { methodLib1 } from 'externalLib1';
      import externalLib1 from 'externalLib1';
      import path from 'path';
      import { constant2 } from 'src/internalLib3';

      const a = path.join('a1', 'a2')
      const b = externalLib1(a);
      const c = methodLib1() + constant1;
      const d = myAliasMethod1(constant2);
      const e = my_child_process();"
    `);
  });

  test('sample_5.js withGroupImport', async () => {
    configs.groupImport = true;

    const actual = coreUtils.process(fileSample5, mockedExternalPackage, true);

    expect(actual.error).toBe(false);

    expect(actual.libUsageStats).toMatchInlineSnapshot(`
      Object {
        "child_process": 1,
        "externalLib1": 1,
        "path": 1,
        "src/internalLib3": 1,
      }
    `);

    expect(actual.output).toMatchInlineSnapshot(`
      "import { default as my_child_process } from 'child_process';
      import externalLib1, { aliasMethodLib1 as myAliasMethod1, constant1, methodLib1 } from 'externalLib1';
      import path from 'path';
      import { constant2 } from 'src/internalLib3';

      const a = path.join('a1', 'a2')
      const b = externalLib1(a);
      const c = methodLib1() + constant1;
      const d = myAliasMethod1(constant2);
      const e = my_child_process();"
    `);
  });

  test('sample_6.js mixed imports simple', async () => {
    // configs.groupImport = false; (implied)
    configs.parseLegacyImports = true;

    const actual = coreUtils.process(fileSample6, mockedExternalPackage, true);

    expect(actual.error).toBe(false);

    expect(actual.libUsageStats).toMatchInlineSnapshot(`
      Object {
        "child_process": 1,
        "externalLib1": 1,
        "path": 1,
        "src/internalLib3": 1,
        "stats": 1,
      }
    `);

    expect(actual.output).toMatchInlineSnapshot(`
      "import { default as my_child_process } from 'child_process';
      import { aliasMethodLib1 as myAliasMethod1 } from 'externalLib1';
      import { constant1 } from 'externalLib1';
      import { methodLib1 } from 'externalLib1';
      import externalLib1 from 'externalLib1';
      import path from 'path';
      import { constant2 } from 'src/internalLib3';
      import { methodLib2 } from 'src/internalLib3';
      import { sum } from 'stats';
      import { total } from 'stats';

      const a = path.join('a1', 'a2')
      const b = externalLib1(a);
      const c = methodLib1() + constant1;
      const d = myAliasMethod1(constant2);
      const e = my_child_process();

      const avg = total / sum;

      methodLib2(a,b,c,d,e, avg)"
    `);
  });

  test('sample_6.js mixed imports withGroupImport', async () => {
    configs.groupImport = true;
    configs.parseLegacyImports = true;

    const actual = coreUtils.process(fileSample6, mockedExternalPackage, true);

    expect(actual.error).toBe(false);

    expect(actual.libUsageStats).toMatchInlineSnapshot(`
      Object {
        "child_process": 1,
        "externalLib1": 1,
        "path": 1,
        "src/internalLib3": 1,
        "stats": 1,
      }
    `);

    expect(actual.output).toMatchInlineSnapshot(`
      "import { default as my_child_process } from 'child_process';
      import externalLib1, { aliasMethodLib1 as myAliasMethod1, constant1, methodLib1 } from 'externalLib1';
      import path from 'path';
      import { constant2, methodLib2 } from 'src/internalLib3';
      import { sum, total } from 'stats';

      const a = path.join('a1', 'a2')
      const b = externalLib1(a);
      const c = methodLib1() + constant1;
      const d = myAliasMethod1(constant2);
      const e = my_child_process();

      const avg = total / sum;

      methodLib2(a,b,c,d,e, avg)"
    `);
  });

  test('sample_6.js mixed imports do not parse legacy imports', async () => {
    configs.groupImport = true;
    // configs.parseLegacyImports = false; (implied)

    const actual = coreUtils.process(fileSample6, mockedExternalPackage, true);

    expect(actual.error).toBe(false);

    expect(actual.libUsageStats).toMatchInlineSnapshot(`
      Object {
        "child_process": 1,
        "externalLib1": 1,
        "path": 1,
      }
    `);

    expect(actual.output).toMatchInlineSnapshot(`
      "import { default as my_child_process } from 'child_process';
      import { aliasMethodLib1 as myAliasMethod1, constant1, methodLib1 } from 'externalLib1';
      import path from 'path';

      const externalLib1 = require('externalLib1');
      var { methodLib2, constant2 } = require( \\"src/internalLib3\\" );
      var {
        total,
        sum
      } = require('stats')

      const a = path.join('a1', 'a2')
      const b = externalLib1(a);
      const c = methodLib1() + constant1;
      const d = myAliasMethod1(constant2);
      const e = my_child_process();

      const avg = total / sum;

      methodLib2(a,b,c,d,e, avg)"
    `);
  });
});
