# js-import-fixer

A shell command tool that cleaned up unused imports in a Typescript / Javascript codebase.

[JS Import Fixer - Official Home Page](https://synle.github.io/js-import-fixer/)

## Why / Background Information?

- There are times where you worked on an existing Typescript / Javascript code base with a lot of unused imports. It causes eslint error to show a lot of warning. Removing the unused imports by hands is just not feasible.
- Another area is that people tend to have no convention when it comes to importing library. Sometimes we imported external libraries first, then we imported local modules.

That's why I came up with this tool to clean up unused imports and organize imports in a way that are more deterministic.

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
npx import-fixer
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
"preformat": "npx import-fixer --groupImport",
"format": "npx prettier --config ./.prettierrc --write **/*.{ts,tsx,js,jsx,scss,yml,html} *.{json,MD}",
...
```

### Flags

#### `--groupImport`

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

#### `--filter`

- `--filter` : to perform the import changes on a set of files with matching filter (aka `--filter=App.tsx`). This param is a CSV, so if you have multiple files, you can add `,` in between them, for example something like this `--filter=App.tsx,Header.tsx`

The full command will look something like this

```
npx import-fixer --filter=App.tsx,Header.tsx
```

#### `--aggressive`

- `--aggressive` : when turned on, the script will be more aggressive when checking for usages of the imports. By default this flag is turned off.

The full command will look something like this

```
npx import-fixer --aggressive
```

## Limitations

- At the moment the script will treat individual imports from the same library as a separate import line. In the future, we can have an optional parameter that will group these imports.
- The script currently only supports `import` syntax, so if you have `require` syntax in your code base, it will skip those. In the future, I plan to combine the two and give users an option to consolidate the import as `import` or require syntax.
- The code that checks for usage of library uses contains, if your module contains a common name like Box / Button, there might be a false negative, so you might need to remove those manually.

## TODO's

- [x] Potentially provides option to group imports (Using [`--groupImport`](https://synle.github.io/js-import-fixer/#--groupimport))
- [x] Run the script on a files with matching patterns (Using [`--filter`](https://synle.github.io/js-import-fixer/#--filter)).
- [x] Added an option to do aggressive checks for import usages. This is an opt-in feature using [`--aggressive`](https://synle.github.io/js-import-fixer/#--aggressive)
- [X] Publish this package to npm registry
- [X] Make this package executable with `npx` (Using `npx import-fixer`)
- [ ] Maybe create a VS Code addon or a separate Electron standalone app that visualize the import transformation and allows user to fine tune the translation one by one.

## Examples Run

I used this on my other project `sqlui-native`. You can refer to this pull request to see the detailed changes in action (https://github.com/synle/sqlui-native/pull/103/files)

![demo-import](https://user-images.githubusercontent.com/3792401/153922650-2cd4b471-505f-418d-922f-9f5e421720d0.gif)
