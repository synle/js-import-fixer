const path = require("path");
const file = require("./file");

describe("file.js", () => {
  test("read", async () => {
    const actual = file.read(path.join(process.cwd(), "package.json"));
    expect(actual).toBeDefined();
    expect(actual).toContain(`"version"`);
  });

  test("readJson", async () => {
    const actual = file.readJson(path.join(process.cwd(), "package.json"));
    expect(actual.name).toBeDefined();
    expect(actual.description).toBeDefined();
    expect(actual.version).toBeDefined();
  });

  test("listDirNested", async () => {
    const actual = file.listDirNested(process.cwd());
    expect(actual.length > 0).toBe(true);
    expect(actual.some((f) => f.includes("/src/index.js"))).toBe(true);
    expect(actual.some((f) => f.includes("/src/coreUtils.js"))).toBe(true);
  });
});
