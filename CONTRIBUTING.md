# Contributing

## How to test locally?
Assuming the path to your js-import-fixer is `~/git/js-import-fixer`. Below is the command to compile and run it.

```
pushd ~/git/js-import-fixer && \
npm i && \
npm run build && \
popd && \
node ~/git/js-import-fixer/main.js --groupImport --aggressive
```
