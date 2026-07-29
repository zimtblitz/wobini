import GpxViewer from "./components/GpxViewer";

function App() {
  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <GpxViewer file="/src/assets/route.gpx" />
    </div>
  );
}

export default App;
