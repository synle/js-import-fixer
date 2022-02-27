const coreUtils = require("./coreUtils");

describe("coreUtils.js", () => {
  describe("getAliasName", () => {
    test("complex moduleName with as", async () => {
      const actual = coreUtils.getAliasName("MySimpleLibrary as MyAliasName");
      expect(actual).toBe("MyAliasName");
    });

    test("simple moduleName", async () => {
      const actual = coreUtils.getAliasName("MySimpleLibrary");
      expect(actual).toBe("MySimpleLibrary");
    });
  });

  describe("getModuleName", () => {
    test("complex moduleName with as", async () => {
      const actual = coreUtils.getModuleName("MySimpleLibrary as MyAliasName");
      expect(actual).toBe("MySimpleLibrary");
    });

    test("simple moduleName", async () => {
      const actual = coreUtils.getModuleName("MySimpleLibrary");
      expect(actual).toBe("MySimpleLibrary");
    });
  });

  // test("getLibrarySortOrder", async () => {
  //   // TODO
  // });

  describe("getSortedImports", () => {
    test("should work", async () => {
      const actual = coreUtils.getSortedImports([
        "import Alert from '@mui/material/Alert';",
        "import Box from '@mui/material/Box';",
        "import CircularProgress from '@mui/material/CircularProgress';",
        "import { ThemeProvider, createTheme } from '@mui/material/styles';",
        "import { HashRouter, Route, Routes } from 'react-router-dom';",
        "import ActionDialogs from 'src/components/ActionDialogs';",
        "import AppHeader from 'src/components/AppHeader';",
        "import ElectronEventListener from 'src/components/ElectronEventListener';",
        "import Toasters from 'src/components/Toasters';",
        "import dataApi from 'src/data/api';",
        "import MissionControl, { useCommands } from 'src/components/MissionControl';",
        "import { getDefaultSessionId, setCurrentSessionId } from 'src/data/session';",
        "import { useGetCurrentSession, useGetSessions, useUpsertSession } from 'src/hooks/useSession';",
        "import { useDarkModeSetting } from 'src/hooks/useSetting';",
        "import { useEffect, useRef, useState, useCallback } from 'react';",
        "import useToaster, { ToasterHandler } from 'src/hooks/useToaster';",
        "import EditConnectionPage from 'src/views/EditConnectionPage';",
        "import MainPage from 'src/views/MainPage';",
        "import NewConnectionPage from 'src/views/NewConnectionPage';",
        "import react from 'react';",
      ]);

      expect(actual).toBe("MySimpleLibrary");
    });
  });
});
