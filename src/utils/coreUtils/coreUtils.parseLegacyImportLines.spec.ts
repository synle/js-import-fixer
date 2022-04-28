// @ts-nocheck
import configs from 'src/utils/configs';
import coreUtils from 'src/utils/coreUtils';

describe('coreUtils.parseLegacyImportLines', () => {
  const fileNameSample1 = '/git/api-server/Server.ts';
  const importSample1 = [
    `var http = require('http');`,
    `let fs = require('fs');`,
    `const { host, port } = require('./config');`,
    `var path = require("path");`,
    `let child_process = require("child_process");`,
    `const apiClient = require("./utils/api/apiClient");`,
  ];
  test('importSample1 example', async () => {
    const actual = coreUtils.parseLegacyImportLines(fileNameSample1, importSample1);

    expect(actual).toMatchInlineSnapshot()

    // expect(actual.libraryImportMap).toMatchSnapshot();
    // expect(actual.moduleUsageMap).toMatchSnapshot();
    // expect(actual.importedModules).toMatchSnapshot();
  });
});
