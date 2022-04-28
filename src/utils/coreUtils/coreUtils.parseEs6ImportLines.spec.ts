// @ts-nocheck
import configs from 'src/utils/configs';
import coreUtils from 'src/utils/coreUtils';

describe('coreUtils.parseEs6ImportLines', () => {
  const fileNameSample1 = '/git/sqlui-native/commons/adapters/RedisDataAdapter.ts';
  const importSample1 = [
    "import { createClient, RedisClientType } from 'redis';",
    "import { SqluiCore } from '../../typings';",
    "import IDataAdapter from './IDataAdapter';",
    "import BaseDataAdapter from './BaseDataAdapter';",
    "import { Express } from 'express';",
  ];

  const fileNameSample2 = '/git/sqlui-native/src/App.tsx';
  const importSample2 = [
    `import { createTheme } from '@mui/material/styles';`,
    `import { ThemeProvider } from '@mui/material/styles';`,
    `import Alert from '@mui/material/Alert';`,
    `import Box from '@mui/material/Box';`,
    `import CircularProgress from '@mui/material/CircularProgress';`,
    `import { HashRouter } from 'react-router-dom';`,
    `import { Route } from 'react-router-dom';`,
    `import { Routes } from 'react-router-dom';`,
    `import { useEffect } from 'react';`,
    `import { useState } from 'react';`,
    `import { getDefaultSessionId } from 'src/data/session';`,
    `import { setCurrentSessionId } from 'src/data/session';`,
    `import { useDarkModeSetting } from 'src/hooks';`,
    `import { useGetCurrentSession } from 'src/hooks';`,
    `import { useGetSessions } from 'src/hooks';`,
    `import { useUpsertSession } from 'src/hooks';`,
    `import ActionDialogs from 'src/components/ActionDialogs';`,
    `import AppHeader from 'src/components/AppHeader';`,
    `import EditConnectionPage from 'src/views/EditConnectionPage';`,
    `import ElectronEventListener from 'src/components/ElectronEventListener';`,
    `import MainPage from 'src/views/MainPage';`,
    `import MissionControl from 'src/components/MissionControl';`,
    `import NewConnectionPage from 'src/views/NewConnectionPage';`,
    `import Toasters from 'src/components/Toasters';`,
  ];

  test('importSample1 example with transform relative', async () => {
    configs.transformRelativeImport = '';

    const actual = coreUtils.parseEs6ImportLines(fileNameSample1, importSample1);

    expect(actual.libraryImportMap).toMatchSnapshot();
    expect(actual.moduleUsageMap).toMatchSnapshot();
    expect(actual.importedModules).toMatchSnapshot();
  });

  test("importSample1 example with transform relative 'src'", async () => {
    configs.transformRelativeImport = 'src/';

    const actual = coreUtils.parseEs6ImportLines(fileNameSample1, importSample1);

    expect(actual.libraryImportMap).toMatchSnapshot();
    expect(actual.moduleUsageMap).toMatchSnapshot();
    expect(actual.importedModules).toMatchSnapshot();
  });

  test('importSample1 example with no transformation', async () => {
    configs.transformRelativeImport = undefined;

    const actual = coreUtils.parseEs6ImportLines(fileNameSample1, importSample1);

    expect(actual.libraryImportMap).toMatchSnapshot();
    expect(actual.moduleUsageMap).toMatchSnapshot();
    expect(actual.importedModules).toMatchSnapshot();
  });

  test('importSample2 example with transform relative', async () => {
    configs.transformRelativeImport = '';

    const actual = coreUtils.parseEs6ImportLines(fileNameSample2, importSample2);

    expect(actual.libraryImportMap).toMatchSnapshot();
    expect(actual.moduleUsageMap).toMatchSnapshot();
    expect(actual.importedModules).toMatchSnapshot();
  });

  test('importSample2 example with no transformation', async () => {
    configs.transformRelativeImport = undefined;

    const actual = coreUtils.parseEs6ImportLines(fileNameSample2, importSample2);

    expect(actual.libraryImportMap).toMatchSnapshot();
    expect(actual.moduleUsageMap).toMatchSnapshot();
    expect(actual.importedModules).toMatchSnapshot();
  });
});
