// @ts-nocheck
import coreUtils from 'src/utils/coreUtils';
import fileUtils from 'src/utils/fileUtils';

describe('coreUtils.getAliasName', () => {
  test('complex moduleName with as', async () => {
    const actual = coreUtils.getAliasName('MySimpleLibrary as MyAliasName');
    expect(actual).toBe('MyAliasName');
  });

  test('simple moduleName', async () => {
    const actual = coreUtils.getAliasName('MySimpleLibrary');
    expect(actual).toBe('MySimpleLibrary');
  });
});

describe('coreUtils.getModuleName', () => {
  test('complex moduleName with as', async () => {
    const actual = coreUtils.getModuleName('MySimpleLibrary as MyAliasName');
    expect(actual).toBe('MySimpleLibrary');
  });

  test('simple moduleName', async () => {
    const actual = coreUtils.getModuleName('MySimpleLibrary');
    expect(actual).toBe('MySimpleLibrary');
  });
});

describe('coreUtils.getSortedImports', () => {
  test('example 1 - a basic example', async () => {
    const actual = coreUtils.getSortedImports([
      `import useToaster, { ToasterHandler } from 'src/hooks/useToaster';`,
      `import Box from '@mui/material/Box';`,
      `import Alert from '@mui/material/Alert';`,
      `import ActionDialogs from 'src/components/ActionDialogs';`,
      `import CircularProgress from '@mui/material/CircularProgress';`,
      `import AppHeader from 'src/components/AppHeader';`,
      `import ElectronEventListener from 'src/components/ElectronEventListener';`,
      `import MissionControl, { useCommands } from 'src/components/MissionControl';`,
      `import { ThemeProvider, createTheme } from '@mui/material/styles';`,
      `import { HashRouter, Route, Routes } from 'react-router-dom';`,
      `import { useEffect, useRef, useState } from 'react';`,
      `import Toasters from 'src/components/Toasters';`,
      `import { getDefaultSessionId, setCurrentSessionId } from 'src/data/session';`,
      `import { useGetCurrentSession, useGetSessions, useUpsertSession } from 'src/hooks/useSession';`,
      `import { useDarkModeSetting } from 'src/hooks/useSetting';`,
      `import dataApi from 'src/data/api';`,
      `import MainPage from 'src/views/MainPage';`,
      `import EditConnectionPage from 'src/views/EditConnectionPage';`,
      `import NewConnectionPage from 'src/views/NewConnectionPage';`,
    ]);

    expect(actual).toMatchInlineSnapshot(`
      Array [
        "import Alert from '@mui/material/Alert';",
        "import Box from '@mui/material/Box';",
        "import CircularProgress from '@mui/material/CircularProgress';",
        "import { ThemeProvider, createTheme } from '@mui/material/styles';",
        "import { HashRouter, Route, Routes } from 'react-router-dom';",
        "import { useEffect, useRef, useState } from 'react';",
        "import ActionDialogs from 'src/components/ActionDialogs';",
        "import AppHeader from 'src/components/AppHeader';",
        "import ElectronEventListener from 'src/components/ElectronEventListener';",
        "import MissionControl, { useCommands } from 'src/components/MissionControl';",
        "import Toasters from 'src/components/Toasters';",
        "import dataApi from 'src/data/api';",
        "import { getDefaultSessionId, setCurrentSessionId } from 'src/data/session';",
        "import { useGetCurrentSession, useGetSessions, useUpsertSession } from 'src/hooks/useSession';",
        "import { useDarkModeSetting } from 'src/hooks/useSetting';",
        "import useToaster, { ToasterHandler } from 'src/hooks/useToaster';",
        "import EditConnectionPage from 'src/views/EditConnectionPage';",
        "import MainPage from 'src/views/MainPage';",
        "import NewConnectionPage from 'src/views/NewConnectionPage';",
      ]
    `);
  });

  test('example 2 - a complex example', async () => {
    const mockedExternalPackage = fileUtils.getExternalDependencies([]);

    const actual = coreUtils.getSortedImports(
      [
        `import externalLib1 from 'externalLib1';`,
        `import {methodLib1, constant1, aliasMethodLib1 as myAliasMethod1, unUsedAliasMethod1 as unusedMethod1} from 'externalLib1';`,
        `import path from 'path';`,
        `import externalLib2 from 'externalLib2';`,
        `import {methodLib2, constant2} from 'externalLib2';`,
        `import childProcess from 'child_process';`,
      ],
      mockedExternalPackage,
    );

    expect(actual).toMatchInlineSnapshot(`
      Array [
        "import childProcess from 'child_process';",
        "import path from 'path';",
        "import {methodLib1, constant1, aliasMethodLib1 as myAliasMethod1, unUsedAliasMethod1 as unusedMethod1} from 'externalLib1';",
        "import externalLib1 from 'externalLib1';",
        "import {methodLib2, constant2} from 'externalLib2';",
        "import externalLib2 from 'externalLib2';",
      ]
    `);
  });

  test('example 3', async () => {
    const mockedExternalPackage = fileUtils.getExternalDependencies([]);

    const actual = coreUtils.getSortedImports(
      [
        `import configs from 'src/utils/configs';`,
        `import packageJson from 'src/utils/packageJson';`,
        `import coreUtils from 'src/utils/coreUtils';`,
        `import fileUtils from 'src/utils/fileUtils';`,
        `import libraryJson from 'package.json';`,
      ],
      mockedExternalPackage,
    );

    expect(actual).toMatchInlineSnapshot();
  });


});
