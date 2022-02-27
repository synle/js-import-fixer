const file = require("./file");
const path = require("path");

// figuring out what files in gitignore to skip
let gitiginorePatterns = [];

try {
  const gitignoreContent = file.read(path.join(process.cwd(), ".gitignore"));
  gitiginorePatterns = gitignoreContent
    .split("\n")
    .filter((s) => !s.includes("#") && !s.includes("*") && s);
} catch (err) {
  console.log("failed to read git ignore", err);
}

module.exports = gitiginorePatterns;
