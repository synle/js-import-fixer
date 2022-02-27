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
});
