# js-import-fixer

A shell command tool that cleaned up unused imports in a Typescript / Javascript codebase.

## Why / Background Information?

- There are times where you worked on an existing Typescript / Javascript code base with a lot of unused imports. It causes eslint error to show a lot of warning. Removing the unused imports by hands is just not feasible. That's why I came up with this tool to clean up unused imports.

## Features

- Will look at the Javascript / Typescript code for import usages. And remove unused imports.
- Will also fix duplicate imports issue. Say if you have multiple lines of `import react from 'react';`. So it will consolidate that into a single import and will allow your script to compile and run.
- There is an option `--groupImport` that will consolidate multiple lines of imports from the same library into a single one.

## Requirement

- Node 12+ (tested with Node 14.18.3)

## How to use?

Run this script in your project root.

### Run it directly

```
curl https://raw.githubusercontent.com/synle/js-import-fixer/main/removed-unused-imports.js | node -
```

### Run it as part of preformat in package.json

It's best to use this script as part of your preformat script in node / frontend project

Say you if you have a format script like this

```
...
"format": "npx prettier --config ./.prettierrc --write **/*.{ts,tsx,js,jsx,scss,yml,html} *.{json,MD}",
...
```

Then it will become

```
...
"preformat": "curl https://raw.githubusercontent.com/synle/js-import-fixer/main/removed-unused-imports.js | node - --groupImport",
"format": "npx prettier --config ./.prettierrc --write **/*.{ts,tsx,js,jsx,scss,yml,html} *.{json,MD}",
...
```

### Flags

#### --groupImport

- `--groupImport` : to group imports from the same library into a single line.

When this flag is turned on, the following import lines

```
import { databaseActionScripts as RmdbDatabaseActionScripts } from 'src/scripts/rmdb';
import { tableActionScripts as RmdbTableActionScripts } from 'src/scripts/rmdb';
```

Will become

```
import {
  databaseActionScripts as RmdbDatabaseActionScripts,
  tableActionScripts as RmdbTableActionScripts,
} from 'src/scripts/rmdb';
```

When this flag is turned off (by default), imports will be separated into each individual line. So the following imports

```
import {
  databaseActionScripts as RmdbDatabaseActionScripts,
  tableActionScripts as RmdbTableActionScripts,
} from 'src/scripts/rmdb';
```

will become

```
import { databaseActionScripts as RmdbDatabaseActionScripts } from 'src/scripts/rmdb';
import { tableActionScripts as RmdbTableActionScripts } from 'src/scripts/rmdb';
```

#### --filter

- `--filter` : to perform the import changes on a set of files with matching filter (aka `--filter=App.tsx`). This param is a CSV, so if you have multiple files, you can add `,` in between them, for example something like this `--filter=App.tsx,Header.tsx`

The full command will look something like this

```
curl https://raw.githubusercontent.com/synle/js-import-fixer/main/removed-unused-imports.js | node - --filter=App.tsx,Header.tsx
```

## Limitations

- At the moment the script will treat individual imports from the same library as a separate import line. In the future, we can have an optional parameter that will group these imports.
- The script currently only supports `import` syntax, so if you have `require` syntax in your code base, it will skip those. In the future, I plan to combine the two and give users an option to consolidate the import as `import` or require syntax.
- The code that checks for usage of library uses contains, if your module contains a common name like Box / Button, there might be a false negative, so you might need to remove those manually.

## Future TODO's

- [x] Potentially provides option to group imports (Using [`--groupImport`](https://github.com/synle/js-import-fixer#--groupimport))
- [x] Run the script on a files with matching patterns (Using `--filter`).
- [] Maybe create a VS Code addon or a separate Electron standalone app that visualize the import transformation and allows user to fine tune the translation one by one.

## Examples Run

I used this on my other project `sqlui-native`. You can refer to this pull request to see the detailed changes in action (https://github.com/synle/sqlui-native/pull/103/files)

![image](https://user-images.githubusercontent.com/3792401/153304896-1793b072-05f5-439a-930e-d6c7ec9a7161.png)
