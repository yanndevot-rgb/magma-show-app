import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  "https://script.google.com/macros/s/AKfycby13kgMgiryaUlTI9gyMJB54TIw36s-VjWyPauhDw7x0hmPKZHlUdIvYFCvNvpwWNru/exec?action=getFiles&show=1MolA_1ha5qS8yOx55_cIo-KHdAYj28h4";

function App() {
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(API_URL)
      .then(r => r.json())
      .then(setFiles)
      .catch(console.error);
  }, []);

  function renderFile(file) {
    if (!file) return null;

    const url = file.url;

    // AUDIO
    if (file.mime?.includes("audio")) {
      return (
        <div>
          <h3>{file.name}</h3>
          <audio controls src={url} style={{ width: "100%" }} />
        </div>
      );
    }

    // VIDEO
    if (file.mime?.includes("video")) {
      return (
        <div>
          <h3>{file.name}</h3>
          <video controls src={url} style={{ width: "100%" }} />
        </div>
      );
    }

    // GOOGLE DOC / PDF
    if (
      file.mime?.includes("document") ||
      file.mime?.includes("pdf") ||
      file.mime?.includes("google-apps")
    ) {
      return (
        <iframe
          src={url}
          style={{ width: "100%", height: "600px" }}
        />
      );
    }

    return (
      <div>
        <a href={url} target="_blank">
          Ouvrir
        </a>
      </div>
    );
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>MAGMA SHOW</h2>

      {selected ? (
        <div>
          <button onClick={() => setSelected(null)}>← Retour</button>
          {renderFile(selected)}
        </div>
      ) : (
        files.map((f, i) => (
          <div
            key={i}
            style={{
              padding: 10,
              borderBottom: "1px solid #ccc",
              cursor: "pointer"
            }}
            onClick={() => setSelected(f)}
          >
            {f.name}
          </div>
        ))
      )}
    </div>
  );
}

export default App;