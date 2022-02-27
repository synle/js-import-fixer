const fileUtils = require("./fileUtils");
const path = require("path");

// figuring out what files in gitignore to skip
let gitiginorePatterns = [];

try {
  const gitignoreContent = fileUtils.read(path.join(process.cwd(), ".gitignore"));
  gitiginorePatterns = gitignoreContent
    .split("\n")
    .filter((s) => !s.includes("#") && !s.includes("*") && s);
} catch (err) {
  console.log("[Warning] Failed to read .gitignore".yellow);
}

module.exports = gitiginorePatterns;
