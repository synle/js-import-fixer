// @ts-nocheck
import configs from 'src/utils/configs';
import coreUtils from 'src/utils/coreUtils';

const usedModules = new Set([
  'Alert',
  'Box',
  'CircularProgress',
  'createTheme',
  'ThemeProvider',
  'HashRouter',
  'Route',
  'Routes',
  'useEffect',
  'useRef',
  'useState',
  'ActionDialogs',
  'AppHeader',
  'ElectronEventListener',
  'MissionControl',
  'useCommands',
  'Toasters',
  'dataApi',
  'getDefaultSessionId',
  'setCurrentSessionId',
  'useGetCurrentSession',
  'useGetSessions',
  'useUpsertSession',
  'useDarkModeSetting',
  'useToaster',
  'ToasterHandler',
  'EditConnectionPage',
  'MainPage',
  'NewConnectionPage',
]);

const moduleUsageMap = {
  '@mui/material/Alert': [
    {
      name: 'Alert',
      alias: 'Alert',
      type: 'default',
      lib: '@mui/material/Alert',
      libFullPath: '@mui/material/Alert',
    },
  ],
  '@mui/material/Box': [
    {
      name: 'Box',
      alias: 'Box',
      type: 'default',
      lib: '@mui/material/Box',
      libFullPath: '@mui/material/Box',
    },
  ],
  '@mui/material/CircularProgress': [
    {
      name: 'CircularProgress',
      alias: 'CircularProgress',
      type: 'default',
      lib: '@mui/material/CircularProgress',
      libFullPath: '@mui/material/CircularProgress',
    },
  ],
  '@mui/material/styles': [
    {
      name: 'createTheme',
      alias: 'createTheme',
      type: 'module',
      lib: '@mui/material/styles',
      libFullPath: '@mui/material/styles',
    },
    {
      name: 'ThemeProvider',
      alias: 'ThemeProvider',
      type: 'module',
      lib: '@mui/material/styles',
      libFullPath: '@mui/material/styles',
    },
  ],
  'react-router-dom': [
    {
      name: 'HashRouter',
      alias: 'HashRouter',
      type: 'module',
      lib: 'react-router-dom',
      libFullPath: 'react-router-dom',
    },
    {
      name: 'Route',
      alias: 'Route',
      type: 'module',
      lib: 'react-router-dom',
      libFullPath: 'react-router-dom',
    },
    {
      name: 'Routes',
      alias: 'Routes',
      type: 'module',
      lib: 'react-router-dom',
      libFullPath: 'react-router-dom',
    },
  ],
  react: [
    {
      name: 'useEffect',
      alias: 'useEffect',
      type: 'module',
      lib: 'react',
      libFullPath: 'react',
    },
    {
      name: 'useRef',
      alias: 'useRef',
      type: 'module',
      lib: 'react',
      libFullPath: 'react',
    },
    {
      name: 'useState',
      alias: 'useState',
      type: 'module',
      lib: 'react',
      libFullPath: 'react',
    },
  ],
  'src/frontend/components/ActionDialogs': [
    {
      name: 'ActionDialogs',
      alias: 'ActionDialogs',
      type: 'default',
      lib: 'src/frontend/components/ActionDialogs',
      libFullPath: 'src/frontend/components/ActionDialogs',
    },
  ],
  'src/frontend/components/AppHeader': [
    {
      name: 'AppHeader',
      alias: 'AppHeader',
      type: 'default',
      lib: 'src/frontend/components/AppHeader',
      libFullPath: 'src/frontend/components/AppHeader',
    },
  ],
  'src/frontend/components/ElectronEventListener': [
    {
      name: 'ElectronEventListener',
      alias: 'ElectronEventListener',
      type: 'default',
      lib: 'src/frontend/components/ElectronEventListener',
      libFullPath: 'src/frontend/components/ElectronEventListener',
    },
  ],
  'src/frontend/components/MissionControl': [
    {
      name: 'MissionControl',
      alias: 'MissionControl',
      type: 'default',
      lib: 'src/frontend/components/MissionControl',
      libFullPath: 'src/frontend/components/MissionControl',
    },
    {
      name: 'useCommands',
      alias: 'useCommands',
      type: 'module',
      lib: 'src/frontend/components/MissionControl',
      libFullPath: 'src/frontend/components/MissionControl',
    },
  ],
  'src/frontend/components/Toasters': [
    {
      name: 'Toasters',
      alias: 'Toasters',
      type: 'default',
      lib: 'src/frontend/components/Toasters',
      libFullPath: 'src/frontend/components/Toasters',
    },
  ],
  'src/frontend/data/api': [
    {
      name: 'dataApi',
      alias: 'dataApi',
      type: 'default',
      lib: 'src/frontend/data/api',
      libFullPath: 'src/frontend/data/api',
    },
  ],
  'src/frontend/data/session': [
    {
      name: 'getDefaultSessionId',
      alias: 'getDefaultSessionId',
      type: 'module',
      lib: 'src/frontend/data/session',
      libFullPath: 'src/frontend/data/session',
    },
    {
      name: 'setCurrentSessionId',
      alias: 'setCurrentSessionId',
      type: 'module',
      lib: 'src/frontend/data/session',
      libFullPath: 'src/frontend/data/session',
    },
  ],
  'src/frontend/hooks/useSession': [
    {
      name: 'useGetCurrentSession',
      alias: 'useGetCurrentSession',
      type: 'module',
      lib: 'src/frontend/hooks/useSession',
      libFullPath: 'src/frontend/hooks/useSession',
    },
    {
      name: 'useGetSessions',
      alias: 'useGetSessions',
      type: 'module',
      lib: 'src/frontend/hooks/useSession',
      libFullPath: 'src/frontend/hooks/useSession',
    },
    {
      name: 'useUpsertSession',
      alias: 'useUpsertSession',
      type: 'module',
      lib: 'src/frontend/hooks/useSession',
      libFullPath: 'src/frontend/hooks/useSession',
    },
  ],
  'src/frontend/hooks/useSetting': [
    {
      name: 'useDarkModeSetting',
      alias: 'useDarkModeSetting',
      type: 'module',
      lib: 'src/frontend/hooks/useSetting',
      libFullPath: 'src/frontend/hooks/useSetting',
    },
  ],
  'src/frontend/hooks/useToaster': [
    {
      name: 'useToaster',
      alias: 'useToaster',
      type: 'default',
      lib: 'src/frontend/hooks/useToaster',
      libFullPath: 'src/frontend/hooks/useToaster',
    },
    {
      name: 'ToasterHandler',
      alias: 'ToasterHandler',
      type: 'module',
      lib: 'src/frontend/hooks/useToaster',
      libFullPath: 'src/frontend/hooks/useToaster',
    },
  ],
  'src/frontend/views/EditConnectionPage': [
    {
      name: 'EditConnectionPage',
      alias: 'EditConnectionPage',
      type: 'default',
      lib: 'src/frontend/views/EditConnectionPage',
      libFullPath: 'src/frontend/views/EditConnectionPage',
    },
  ],
  'src/frontend/views/MainPage': [
    {
      name: 'MainPage',
      alias: 'MainPage',
      type: 'default',
      lib: 'src/frontend/views/MainPage',
      libFullPath: 'src/frontend/views/MainPage',
    },
  ],
  'src/frontend/views/NewConnectionPage': [
    {
      name: 'NewConnectionPage',
      alias: 'NewConnectionPage',
      type: 'default',
      lib: 'src/frontend/views/NewConnectionPage',
      libFullPath: 'src/frontend/views/NewConnectionPage',
    },
  ],
};

const libraryImportMap = {
  Alert: {
    name: 'Alert',
    alias: 'Alert',
    type: 'default',
    lib: '@mui/material/Alert',
    libFullPath: '@mui/material/Alert',
  },
  Box: {
    name: 'Box',
    alias: 'Box',
    type: 'default',
    lib: '@mui/material/Box',
    libFullPath: '@mui/material/Box',
  },
  CircularProgress: {
    name: 'CircularProgress',
    alias: 'CircularProgress',
    type: 'default',
    lib: '@mui/material/CircularProgress',
    libFullPath: '@mui/material/CircularProgress',
  },
  createTheme: {
    name: 'createTheme',
    alias: 'createTheme',
    type: 'module',
    lib: '@mui/material/styles',
    libFullPath: '@mui/material/styles',
  },
  ThemeProvider: {
    name: 'ThemeProvider',
    alias: 'ThemeProvider',
    type: 'module',
    lib: '@mui/material/styles',
    libFullPath: '@mui/material/styles',
  },
  HashRouter: {
    name: 'HashRouter',
    alias: 'HashRouter',
    type: 'module',
    lib: 'react-router-dom',
    libFullPath: 'react-router-dom',
  },
  Route: {
    name: 'Route',
    alias: 'Route',
    type: 'module',
    lib: 'react-router-dom',
    libFullPath: 'react-router-dom',
  },
  Routes: {
    name: 'Routes',
    alias: 'Routes',
    type: 'module',
    lib: 'react-router-dom',
    libFullPath: 'react-router-dom',
  },
  useEffect: {
    name: 'useEffect',
    alias: 'useEffect',
    type: 'module',
    lib: 'react',
    libFullPath: 'react',
  },
  useRef: {
    name: 'useRef',
    alias: 'useRef',
    type: 'module',
    lib: 'react',
    libFullPath: 'react',
  },
  useState: {
    name: 'useState',
    alias: 'useState',
    type: 'module',
    lib: 'react',
    libFullPath: 'react',
  },
  ActionDialogs: {
    name: 'ActionDialogs',
    alias: 'ActionDialogs',
    type: 'default',
    lib: 'src/frontend/components/ActionDialogs',
    libFullPath: 'src/frontend/components/ActionDialogs',
  },
  AppHeader: {
    name: 'AppHeader',
    alias: 'AppHeader',
    type: 'default',
    lib: 'src/frontend/components/AppHeader',
    libFullPath: 'src/frontend/components/AppHeader',
  },
  ElectronEventListener: {
    name: 'ElectronEventListener',
    alias: 'ElectronEventListener',
    type: 'default',
    lib: 'src/frontend/components/ElectronEventListener',
    libFullPath: 'src/frontend/components/ElectronEventListener',
  },
  MissionControl: {
    name: 'MissionControl',
    alias: 'MissionControl',
    type: 'default',
    lib: 'src/frontend/components/MissionControl',
    libFullPath: 'src/frontend/components/MissionControl',
  },
  useCommands: {
    name: 'useCommands',
    alias: 'useCommands',
    type: 'module',
    lib: 'src/frontend/components/MissionControl',
    libFullPath: 'src/frontend/components/MissionControl',
  },
  Toasters: {
    name: 'Toasters',
    alias: 'Toasters',
    type: 'default',
    lib: 'src/frontend/components/Toasters',
    libFullPath: 'src/frontend/components/Toasters',
  },
  dataApi: {
    name: 'dataApi',
    alias: 'dataApi',
    type: 'default',
    lib: 'src/frontend/data/api',
    libFullPath: 'src/frontend/data/api',
  },
  getDefaultSessionId: {
    name: 'getDefaultSessionId',
    alias: 'getDefaultSessionId',
    type: 'module',
    lib: 'src/frontend/data/session',
    libFullPath: 'src/frontend/data/session',
  },
  setCurrentSessionId: {
    name: 'setCurrentSessionId',
    alias: 'setCurrentSessionId',
    type: 'module',
    lib: 'src/frontend/data/session',
    libFullPath: 'src/frontend/data/session',
  },
  useGetCurrentSession: {
    name: 'useGetCurrentSession',
    alias: 'useGetCurrentSession',
    type: 'module',
    lib: 'src/frontend/hooks/useSession',
    libFullPath: 'src/frontend/hooks/useSession',
  },
  useGetSessions: {
    name: 'useGetSessions',
    alias: 'useGetSessions',
    type: 'module',
    lib: 'src/frontend/hooks/useSession',
    libFullPath: 'src/frontend/hooks/useSession',
  },
  useUpsertSession: {
    name: 'useUpsertSession',
    alias: 'useUpsertSession',
    type: 'module',
    lib: 'src/frontend/hooks/useSession',
    libFullPath: 'src/frontend/hooks/useSession',
  },
  useDarkModeSetting: {
    name: 'useDarkModeSetting',
    alias: 'useDarkModeSetting',
    type: 'module',
    lib: 'src/frontend/hooks/useSetting',
    libFullPath: 'src/frontend/hooks/useSetting',
  },
  useToaster: {
    name: 'useToaster',
    alias: 'useToaster',
    type: 'default',
    lib: 'src/frontend/hooks/useToaster',
    libFullPath: 'src/frontend/hooks/useToaster',
  },
  ToasterHandler: {
    name: 'ToasterHandler',
    alias: 'ToasterHandler',
    type: 'module',
    lib: 'src/frontend/hooks/useToaster',
    libFullPath: 'src/frontend/hooks/useToaster',
  },
  EditConnectionPage: {
    name: 'EditConnectionPage',
    alias: 'EditConnectionPage',
    type: 'default',
    lib: 'src/frontend/views/EditConnectionPage',
    libFullPath: 'src/frontend/views/EditConnectionPage',
  },
  MainPage: {
    name: 'MainPage',
    alias: 'MainPage',
    type: 'default',
    lib: 'src/frontend/views/MainPage',
    libFullPath: 'src/frontend/views/MainPage',
  },
  NewConnectionPage: {
    name: 'NewConnectionPage',
    alias: 'NewConnectionPage',
    type: 'default',
    lib: 'src/frontend/views/NewConnectionPage',
    libFullPath: 'src/frontend/views/NewConnectionPage',
  },
};

describe('coreUtils.generateImportsOutput', () => {
  test('groupImport is ON', async () => {
    global.countSkipped = 0;
    global.countProcessed = 0;
    global.countLibUsedByFile = {};

    configs.groupImport = true;

    const actual = coreUtils.generateImportsOutput(usedModules, moduleUsageMap, libraryImportMap);
    expect(actual).toMatchInlineSnapshot(`
      Array [
        "import Alert from '@mui/material/Alert';",
        "import Box from '@mui/material/Box';",
        "import CircularProgress from '@mui/material/CircularProgress';",
        "import { createTheme, ThemeProvider } from '@mui/material/styles';",
        "import { HashRouter, Route, Routes } from 'react-router-dom';",
        "import { useEffect, useRef, useState } from 'react';",
        "import ActionDialogs from 'src/frontend/components/ActionDialogs';",
        "import AppHeader from 'src/frontend/components/AppHeader';",
        "import ElectronEventListener from 'src/frontend/components/ElectronEventListener';",
        "import MissionControl, { useCommands } from 'src/frontend/components/MissionControl';",
        "import Toasters from 'src/frontend/components/Toasters';",
        "import dataApi from 'src/frontend/data/api';",
        "import { getDefaultSessionId, setCurrentSessionId } from 'src/frontend/data/session';",
        "import { useGetCurrentSession, useGetSessions, useUpsertSession } from 'src/frontend/hooks/useSession';",
        "import { useDarkModeSetting } from 'src/frontend/hooks/useSetting';",
        "import useToaster, { ToasterHandler } from 'src/frontend/hooks/useToaster';",
        "import EditConnectionPage from 'src/frontend/views/EditConnectionPage';",
        "import MainPage from 'src/frontend/views/MainPage';",
        "import NewConnectionPage from 'src/frontend/views/NewConnectionPage';",
      ]
    `);
  });

  test('groupImport is OFF', async () => {
    global.countSkipped = 0;
    global.countProcessed = 0;
    global.countLibUsedByFile = {};

    configs.groupImport = false;

    const actual = coreUtils.generateImportsOutput(usedModules, moduleUsageMap, libraryImportMap);
    expect(actual).toMatchInlineSnapshot(`
      Array [
        "import Alert from '@mui/material/Alert';",
        "import Box from '@mui/material/Box';",
        "import CircularProgress from '@mui/material/CircularProgress';",
        "import { createTheme } from '@mui/material/styles';",
        "import { ThemeProvider } from '@mui/material/styles';",
        "import { HashRouter } from 'react-router-dom';",
        "import { Route } from 'react-router-dom';",
        "import { Routes } from 'react-router-dom';",
        "import { useEffect } from 'react';",
        "import { useRef } from 'react';",
        "import { useState } from 'react';",
        "import ActionDialogs from 'src/frontend/components/ActionDialogs';",
        "import AppHeader from 'src/frontend/components/AppHeader';",
        "import ElectronEventListener from 'src/frontend/components/ElectronEventListener';",
        "import MissionControl from 'src/frontend/components/MissionControl';",
        "import { useCommands } from 'src/frontend/components/MissionControl';",
        "import Toasters from 'src/frontend/components/Toasters';",
        "import dataApi from 'src/frontend/data/api';",
        "import { getDefaultSessionId } from 'src/frontend/data/session';",
        "import { setCurrentSessionId } from 'src/frontend/data/session';",
        "import { useGetCurrentSession } from 'src/frontend/hooks/useSession';",
        "import { useGetSessions } from 'src/frontend/hooks/useSession';",
        "import { useUpsertSession } from 'src/frontend/hooks/useSession';",
        "import { useDarkModeSetting } from 'src/frontend/hooks/useSetting';",
        "import useToaster from 'src/frontend/hooks/useToaster';",
        "import { ToasterHandler } from 'src/frontend/hooks/useToaster';",
        "import EditConnectionPage from 'src/frontend/views/EditConnectionPage';",
        "import MainPage from 'src/frontend/views/MainPage';",
        "import NewConnectionPage from 'src/frontend/views/NewConnectionPage';",
      ]
    `);
  });
});
