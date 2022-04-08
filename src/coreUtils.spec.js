const path = require("path");
const coreUtils = require("./coreUtils");
const configs = require("./configs");

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

  describe("getSortedImports", () => {
    test("should work", async () => {
      const actual = coreUtils.getSortedImports([
        "import useToaster, { ToasterHandler } from 'src/hooks/useToaster';",
        "import Box from '@mui/material/Box';",
        "import Alert from '@mui/material/Alert';",
        "import ActionDialogs from 'src/components/ActionDialogs';",
        "import CircularProgress from '@mui/material/CircularProgress';",
        "import AppHeader from 'src/components/AppHeader';",
        "import ElectronEventListener from 'src/components/ElectronEventListener';",
        "import MissionControl, { useCommands } from 'src/components/MissionControl';",
        "import { ThemeProvider, createTheme } from '@mui/material/styles';",
        "import { HashRouter, Route, Routes } from 'react-router-dom';",
        "import { useEffect, useRef, useState } from 'react';",
        "import Toasters from 'src/components/Toasters';",
        "import { getDefaultSessionId, setCurrentSessionId } from 'src/data/session';",
        "import { useGetCurrentSession, useGetSessions, useUpsertSession } from 'src/hooks/useSession';",
        "import { useDarkModeSetting } from 'src/hooks/useSetting';",
        "import dataApi from 'src/data/api';",
        "import MainPage from 'src/views/MainPage';",
        "import EditConnectionPage from 'src/views/EditConnectionPage';",
        "import NewConnectionPage from 'src/views/NewConnectionPage';",
      ]);

      expect(actual).toEqual([
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
      ]);
    });
  });

  describe("process", () => {
    const mockedExternalPackage = ["externalLib1", "externalLib2"];

    const fileSample1 = path.join("__mocks__/", "sample_1.js");
    const fileSample2 = path.join("__mocks__/", "sample_2.js");
    const fileSample3 = path.join("__mocks__/", "sample_3.js");
    const fileSample4 = path.join(
      "__mocks__/nested_dir_a/nested_dir_b",
      "sample_4.js"
    );

    test("sample_1.js simple", async () => {
      global.countSkipped = 0;
      global.countProcessed = 0;
      global.countLibUsedByFile = {};

      const actual = coreUtils.process(
        fileSample1,
        mockedExternalPackage,
        true
      );

      expect(actual).toMatchInlineSnapshot(`
        "import {aliasMethodLib1 as myAliasMethod1} from 'externalLib1';
        import {constant1} from 'externalLib1';
        import {methodLib1} from 'externalLib1';
        import externalLib1 from 'externalLib1';
        import {constant2} from 'externalLib2';
        import externalLib2 from 'externalLib2';
        var a1 = constant1;
        methodLib1();
        externalLib1();
        myAliasMethod1();

        var a2 = constant2;
        var temp2 = externalLib2();"
      `);
    });

    test("sample_1.js withGroupImport", async () => {
      global.countSkipped = 0;
      global.countProcessed = 0;
      global.countLibUsedByFile = {};

      configs.groupImport = true;

      const actual = coreUtils.process(
        fileSample1,
        mockedExternalPackage,
        true
      );

      expect(actual).toMatchInlineSnapshot(`
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

    test("sample_2.js simple", async () => {
      global.countSkipped = 0;
      global.countProcessed = 0;
      global.countLibUsedByFile = {};

      const actual = coreUtils.process(
        fileSample2,
        mockedExternalPackage,
        true
      );

      expect(actual).toMatchInlineSnapshot(`
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

    test("sample_2.js withGroupImport", async () => {
      global.countSkipped = 0;
      global.countProcessed = 0;
      global.countLibUsedByFile = {};

      configs.groupImport = true;

      const actual = coreUtils.process(
        fileSample2,
        mockedExternalPackage,
        true
      );

      expect(actual).toMatchInlineSnapshot(`
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

    test("sample_3.js withGroupImport", async () => {
      global.countSkipped = 0;
      global.countProcessed = 0;
      global.countLibUsedByFile = {};

      configs.groupImport = true;

      const actual = coreUtils.process(
        fileSample3,
        mockedExternalPackage,
        true
      );

      expect(actual).toMatchInlineSnapshot(`
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

    test("sample_4.js with transformRelativeImport", async () => {
      global.countSkipped = 0;
      global.countProcessed = 0;
      global.countLibUsedByFile = {};

      configs.groupImport = true;
      configs.transformRelativeImport = "";

      const actual = coreUtils.process(
        fileSample4,
        mockedExternalPackage,
        true
      );

      expect(actual).toMatchInlineSnapshot(`
        "import externalLib1 from 'externalLib1';
        import { sum } from '__mocks__/nested_dir_a/Calculator';

        const res1 = sum(1,2);
        externalLib1();"
      `);
    });

    test("sample_4.js with transformRelativeImport=somePathPrefix/", async () => {
      global.countSkipped = 0;
      global.countProcessed = 0;
      global.countLibUsedByFile = {};

      configs.groupImport = true;
      configs.transformRelativeImport = "somePathPrefix/";

      const actual = coreUtils.process(
        fileSample4,
        mockedExternalPackage,
        true
      );

      expect(actual).toMatchInlineSnapshot(`
        "import externalLib1 from 'externalLib1';
        import { sum } from 'somePathPrefix/__mocks__/nested_dir_a/Calculator';

        const res1 = sum(1,2);
        externalLib1();"
      `);
    });
  });
});
