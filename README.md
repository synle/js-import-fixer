[![build-main](https://github.com/synle/js-import-fixer/actions/workflows/build-main.yml/badge.svg)](https://github.com/synle/js-import-fixer/actions/workflows/build-main.yml)
[![npm version](https://badge.fury.io/js/import-fixer.svg)](https://badge.fury.io/js/import-fixer)

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

```bash
npx import-fixer
```

### Run it as part of preformat in package.json

It's best to use this script as part of your preformat script in node / frontend project

Say you if you have a format script like this

```js
...
"format": "npx prettier --config ./.prettierrc --write **/*.{ts,tsx,js,jsx,scss,yml,html} *.{json,MD}",
...
```

Then it will become

```js
...
"preformat": "npx import-fixer --groupImport",
"format": "npx prettier --config ./.prettierrc --write **/*.{ts,tsx,js,jsx,scss,yml,html} *.{json,MD}",
...
```

### Flags

#### `--groupImport`

- `--groupImport` : to group imports from the same library into a single line.

When this flag is turned on, the following import lines

```js
import { databaseActionScripts as RmdbDatabaseActionScripts } from "src/scripts/rmdb";
import { tableActionScripts as RmdbTableActionScripts } from "src/scripts/rmdb";
```

Will become

```js
import {
  databaseActionScripts as RmdbDatabaseActionScripts,
  tableActionScripts as RmdbTableActionScripts,
} from "src/scripts/rmdb";
```

When this flag is turned off (by default), imports will be separated into each individual line. So the following imports

```js
import {
  databaseActionScripts as RmdbDatabaseActionScripts,
  tableActionScripts as RmdbTableActionScripts,
} from "src/scripts/rmdb";
```

will become

```js
import { databaseActionScripts as RmdbDatabaseActionScripts } from "src/scripts/rmdb";
import { tableActionScripts as RmdbTableActionScripts } from "src/scripts/rmdb";
```

#### `--filter`

- `--filter` : to perform the import changes on a set of files with matching filter (aka `--filter=App.tsx`). This param is a CSV, so if you have multiple files, you can add `,` in between them, for example something like this `--filter=App.tsx,Header.tsx`

The full command will look something like this

```bash
npx import-fixer --filter=App.tsx,Header.tsx
```

#### `--aggressive`

- `--aggressive` : when turned on, the script will be more aggressive when checking for usages of the imports. By default this flag is turned off.

The full command will look something like this

```bash
npx import-fixer --aggressive
```

#### `--transformRelativeImport`

- `--transformRelativeImport` : when turned on, the script will transform relative imports such as `import IDataAdapter from './IDataAdapter';` in a file to an absolute import such as `import IDataAdapter from 'commons/adapters/IDataAdapter';`

- You can add your own path prefix, by default, we will resolve the full path and add this path prefix to the front of the file.

For these examples, we will consider the original import line as followed

- The minimal command will be like this.

```bash
npx import-fixer --transformRelativeImport
```

- You can also pass in the path prefix for the resolved absolute import paths using `--transformRelativeImport="<pathPrefix>"`.

```bash
npx import-fixer --transformRelativeImport="src/"
```

Refer to this table for more information:
| Option | Original | After Transformation |
|---------------------------------|--------------------------------------------|---------------------------------------------------------------|
| `--transformRelativeImport` | `import IDataAdapter from './IDataAdapter';` | `import IDataAdapter from 'commons/adapters/IDataAdapter';` |
| `--transformRelativeImport="src"` | `import IDataAdapter from './IDataAdapter';` | `import IDataAdapter from 'src/commons/adapters/IDataAdapter';` |

#### `--importQuote`

- `--importQuote`: can be used to set the import line quote. So it's either double quote or single quote. The default behavior is using single quote.

- The minimal command will look like this.

```bash
npx import-fixer --importQuote=single
```

Refer to this table for more information:
| Option                           | Output                                 |
|----------------------------------|----------------------------------------|
| `--importQuote=single` (Default) | `import { SqluiCore } from 'typings';` |
| `--importQuote=double`           | `import { SqluiCore } from "typings";` |

## Limitations

- The script currently only supports `import` syntax, so if you have `require` syntax in your code base, it will skip those. In the future, I plan to combine the two and give users an option to consolidate the import as `import` or require syntax.
- The code that checks for usage of library uses contains, if your module contains a common name like Box / Button, there might be a false negative, so you might need to remove those manually.

## TODO's

- [x] Potentially provides option to group imports (Using [`--groupImport`](https://synle.github.io/js-import-fixer/#--groupimport)).
- [x] Run the script on a files with matching patterns (Using [`--filter`](https://synle.github.io/js-import-fixer/#--filter)).
- [x] Added an option to do aggressive checks for import usages. This is an opt-in feature using [`--aggressive`](https://synle.github.io/js-import-fixer/#--aggressive).
- [x] Publish this package to npm registry.
- [x] Make this package executable with `npx` (Using `npx import-fixer`).
- [x] Respect the files in `.gitignore` and skip those files when running the script.
- [x] Added an option to transform relative imports into absolute imports (Using [`--transformRelativeImport`](https://synle.github.io/js-import-fixer/#--transformRelativeImport)).
- [x] Added an option to control what's the output quote is in the import line. Either single quote or double quote. [`--importQuote`](https://synle.github.io/js-import-fixer/#--importQuote)
- [ ] Maybe create a VS Code addon or a separate Electron standalone app that visualize the import transformation and allows user to fine tune the translation one by one.

## Examples Run

I used this on my other project `sqlui-native`. You can refer to [this Sample Pull Request with import-fix script run](https://github.com/synle/sqlui-native/pull/103/files) to see the detailed changes in action

![demo](https://user-images.githubusercontent.com/3792401/154776692-15db9288-5192-46aa-bef6-f7105349dd7d.gif)
![image](https://user-images.githubusercontent.com/3792401/154777798-0cdb9b5c-aa1c-455c-afbd-41a00e6c8166.png)

## Contributing?

If you are interested in contributing, you can refer to this doc to get started

- [CONTRIBUTING.md](https://github.com/synle/js-import-fixer/blob/main/CONTRIBUTING.md)
