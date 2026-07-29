import { useState } from "react";
import GpxViewer from "./components/GpxViewer";
import GpxFilePicker from "./components/GpxFilePicker";

function App() {
  const [file, setFile] = useState<File | null>(null);

  return (
    <>
      {!file && (
        <GpxFilePicker
          onFileSelected={setFile}
        />
      )}

      {file && (
        <GpxViewer file={file} />
      )}
    </>
  );
}

export default App;
