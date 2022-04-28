// @ts-nocheck
import coreUtils from 'src/utils/coreUtils';

/**
var http = require('http');
let fs = require('fs');

const { host, port } = require('./config');
var path = require("path");
let child_process = require("child_process");

const apiClient = require("./utils/api/apiClient");
const database=require('database')
const network = require(     'network'     )
var moment = require(    "moment")
var faker = require("faker"       )
 */
describe('coreUtils.parseLegacyImportsLines', () => {
  const fileNameSample1 = '/git/api-server/Server.ts';
  const importSample1 = [
    `var http = require('http');`,
    `let fs = require('fs');`,
    `const { host, port } = require('./config');`,
    `var path = require("path");`,
    `let child_process = require("child_process");`,
    `const apiClient = require("./utils/api/apiClient");`,
    `const database=require('database')`,
    `const network = require(     'network'     )`,
    `var moment = require(    "moment")`,
    `    var faker = require("faker"       )   `,
  ];
  test('importSample1 example', async () => {
    const actual = coreUtils.parseLegacyImportsLines(fileNameSample1, importSample1);

    expect(actual.libraryImportMap).toMatchSnapshot();
    expect(actual.moduleUsageMap).toMatchSnapshot();
    expect(actual.importedModules).toMatchSnapshot();
  });
});
