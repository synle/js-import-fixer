import React, { useContext, useState } from "https://cdn.skypack.dev/react";
import ReactDOM from "https://cdn.skypack.dev/react-dom";

// create a context
const ProfileContext = React.createContext();

// hook up the context with .Provider value={}
function App() {
  const MyProfile = {
    name: "Sy",
    location: "Bay Area",
  };

  return (
    <div>
      <button onClick={getFolder}>Browse File</button>
    </div>
  );
}

ReactDOM.render(<App />, document.body);



// https://developer.mozilla.org/en-US/docs/Web/API/File_System_Access_API
// https://web.dev/file-system-access/

let fileHandle;

async function getFile() {
  // open file picker
  [fileHandle] = await window.showOpenFilePicker();

  const file = await fileHandle.getFile();
  const contents = await file.text();

  console.log(file, contents);
}


async function getFolder(dirHandle, res = []){
  dirHandle = await window.showDirectoryPicker();

  for await (const entry of dirHandle.values()) {
    console.log(entry)
    if (entry.kind === 'file') {
      // is a file, read its content
      const file = await entry.getFile();
      res.push([file.name, await file.text()]);
    } else {
      // is a dir, list its dir
      debugger
      const relativePaths = await entry.resolve(dirHandle);
      const newDirHandle = await entry.getDirectoryHandle();
      getFolder(newDirHandle, res);
    }
  }

  if(!dirHandle){
    console.log('>>',res);
  }
}
