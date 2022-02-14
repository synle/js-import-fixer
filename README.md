# js-import-fixer
A shell command tool that cleaned up unused imports in a Typescript / Javascript codebase.

## Why / Background Information?
- There are times where you worked on an existing Typescript / Javascript code base with a lot of unused imports. It causes eslint error to show a lot of warning. Removing the unused imports by hands is just not feasible. That's why I came up with this tool to clean up unused imports.

## Requirement
- Node 12+

## How to use?
Run this script in your project root.

## Separate Import
Each import is treated as a separate line
```
curl https://raw.githubusercontent.com/synle/js-import-fixer/main/removed-unused-imports.js | node -
```

### Import grouping
With import grouping so the output will consolidate all imports from the same library as one import line
```
curl https://raw.githubusercontent.com/synle/js-import-fixer/main/removed-unused-imports.js | node - --groupImport
```

## Limitations
- At the moment the script will treat individual imports from the same library as a separate import line. In the future, we can have an optional parameter that will group these imports.
- The script currently only supports `import` syntax, so if you have `require` syntax in your code base, it will skip those. In the future, I plan to combine the two and give users an option to consolidate the import as `import` or require syntax.
- The code that checks for usage of library uses contains, if your module contains a common name like Box / Button, there might be a false negative, so you might need to remove those manually.

## Future TODO's
- [X] Potentially provides option to group imports (Using `--groupImport`)
- [] Run the script on a files with matching patterns.
- [] Maybe create a VS Code addon or a separate Electron standalone app that visualize the import transformation and allows user to fine tune the translation one by one.

## Examples Run
I used this on my other project `sqlui-native`. You can refer to this pull request to see the detailed changes in action (https://github.com/synle/sqlui-native/pull/103/files)

![image](https://user-images.githubusercontent.com/3792401/153304896-1793b072-05f5-439a-930e-d6c7ec9a7161.png)

