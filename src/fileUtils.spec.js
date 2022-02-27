const path = require("path");
const fileUtils = require("./fileUtils");

describe("fileUtils.js", () => {
  test("read", async () => {
    const actual = fileUtils.read(path.join(process.cwd(), "package.json"));
    expect(actual).toBeDefined();
    expect(actual).toContain(`"version"`);
  });

  test("readJson", async () => {
    const actual = fileUtils.readJson(path.join(process.cwd(), "package.json"));
    expect(actual.name).toBeDefined();
    expect(actual.description).toBeDefined();
    expect(actual.version).toBeDefined();
  });

  test("listDirNested", async () => {
    const actual = fileUtils.listDirNested(process.cwd());
    expect(actual.length > 0).toBe(true);
    expect(actual.some((f) => f.includes("/src/index.js"))).toBe(true);
    expect(actual.some((f) => f.includes("/src/coreUtils.js"))).toBe(true);
  });
});
