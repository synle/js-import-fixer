#  sh pathfix.js

find src | grep -E "\.ts|\.js" | grep -v "d\.ts" | node -e """
  let data = '';
  const fs = require('fs');
  const package = require('./package.json');

  let externalPackages = new Set([...Object.keys(package.devDependencies || {}), ...Object.keys(package.dependencies || {})]);
  externalPackages = [...externalPackages].sort();

  process.openStdin().addListener('data', (d) => {
    data += d.toString();
  });

  process.openStdin().addListener('end', (d) => {
    let files = data
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s);

    const fileMap = {}
    const libraryMap = {};

    function getAliasName(moduleName){
      if(moduleName.includes(' as ')){
        return moduleName.substr(moduleName.indexOf(' as ') + 4).trim();
      }else{
        return moduleName;
      }
    }

    function getModuleName(moduleName){
      if(moduleName.includes(' as ')){
        return moduleName.substr(0, moduleName.indexOf(' as ')).trim();
      }else{
        return moduleName;
      }
    }

    function getLibrarySortOrder(a){
      var ca = a.substr(a.indexOf(' from ') + 7);
      ca = ca.replace(/[ '\";]+/, '');

      for(let i =0; i < externalPackages.length; i++){
        if(ca.includes(externalPackages[i])){
          return i
        }
      }

      return 99999;
    }

    for (const file of files) {
      const content = fs.readFileSync(file, {
        encoding: 'utf8',
        flag: 'r',
      });

      // lib_name => [array of modules]
      // '@mui/material/CircularProgress': [ { name: 'CircularProgress', type: 'default' } ]
      var libToModules = {};
      var moduleToLibs = {};

      // set of used modules
      var allImportedModules = new Set()
      var notUsedModules = new Set()
      var usedModules = new Set()

      var rawContentWithoutImport;
      try{
        rawContentWithoutImport = content.replace(/import[ ]+[{a-zA-Z0-9 ,}\n]+'[@/a-zA-Z0-9-]+'[;]*/g,'')

        const importCodeLines = content.match(/import[ ]+[{a-zA-Z0-9 ,}\n]+'[@/a-zA-Z0-9-]+'[;]*/g);
        if(!importCodeLines || importCodeLines.length === 0){
         console.log('> Skipped File:', file)
         continue;
        }

        // here we figured out what imports are being imported
        // and if it has an alias and if it's a module / default imported
        importCodeLines.forEach(s => {
          const foundImportedModules = s.match(/from[ ]+'[@/a-zA-Z0-9-]+'[;]*/, '')[0].replace(/from[ ]+'/, '').replace(/'/, '').replace(/;/, '');
          libToModules[foundImportedModules] = libToModules[foundImportedModules] || []
          let parsed = s.replace(/from[ ]+'[@/a-zA-Z0-9-]+'[;]*/, '').replace('import ','').replace(/[ \n]+/g,' ')

          const moduleSplits = parsed.split('{');

          for(let moduleSplit of moduleSplits){
            if(moduleSplit.includes('}')){
              // will be parsed as module
              moduleSplit= moduleSplit.replace('}', '');
              const childModuleSplits = moduleSplit.split(',').map(s => s.trim()).filter(s => s);
              for(let moduleName of childModuleSplits){
                // is a child module import
                const aliasName = getAliasName(moduleName)
                moduleName = getModuleName(moduleName);
                allImportedModules.add(aliasName);
                libToModules[foundImportedModules].push({
                  name: moduleName,
                  alias: aliasName,
                  type: 'module'
                })

                moduleToLibs[aliasName] = {
                  lib: foundImportedModules,
                  name: moduleName,
                  alias: aliasName,
                  type: 'module'
                };
              }
            } else {
              // will be parsed as default
              const defaultModuleSplits = moduleSplit.split(',').map(s => s.trim()).filter(s => s);
              for(let moduleName of defaultModuleSplits){
                // is default import
                const aliasName = getAliasName(moduleName)
                moduleName = getModuleName(moduleName);
                allImportedModules.add(aliasName);
                libToModules[foundImportedModules].push({
                  name: moduleName,
                  alias: aliasName,
                  type: 'default'
                })

                moduleToLibs[aliasName] = {
                  lib: foundImportedModules,
                  name: moduleName,
                  alias: aliasName,
                  type: 'default'
                };
              }
            }
          }
        })


        // here we figure out if an import is actually used in the code
        for(const aModule of allImportedModules){
          if(rawContentWithoutImport.includes(aModule) === false){
            notUsedModules.add(aModule);
          } else {
            usedModules.add(aModule);
          }
        }

        // generate the new import
        var newImportedContent = [];
        for(const aModule of [...usedModules]){
           const {type, lib, alias, name} = moduleToLibs[aModule]
          if(type === 'module'){
            if(alias !== name){
              newImportedContent.push(
                  'import {'+name+' as '+ alias+'} from \'' + lib + '\';'
                )
            } else {
                newImportedContent.push(
                'import {'+name+'} from \'' + lib + '\';'
              )
            }

          } else {
            // default
            newImportedContent.push(
              'import '+aModule+' from \'' + lib + '\';'
            )
          }
        }

        newImportedContent = newImportedContent.sort(
          (a,b) => {
            var ca = getLibrarySortOrder(a);

            var cb = getLibrarySortOrder(b);

            let res = ca - cb;

            if(res === 0){
              return a.localeCompare(b);
            }


            return res;
          })

        console.log('> Repaired File:', notUsedModules.size + ' Removed', file)


        let finalContent =  newImportedContent.join('\n').trim()  + '\n' + rawContentWithoutImport.replace(/[\n][\n][\n]+/g, '\n').trim();

        if(content.includes('// @ts-nocheck')){
          finalContent = '// @ts-nocheck\n' + finalContent.replace(/\/\/[ ]+@ts-nocheck/, '');
        }

        finalContent = finalContent.replace(';\ninterface', ';\n\ninterface').replace(';\nconst', ';\n\nconst').replace(';\nexport', ';\n\nexport');;

        fs.writeFileSync(file, finalContent);
      } catch(err){
        console.log(file, err)
      }
    }

    process.exit();
  });
"""
