import { useEffect, useState } from "react";
import "./App.css";

const FILES_API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

function App() {
  const [prestations, setPrestations] = useState([]);
  const [selected, setSelected] = useState(null);
  const [files, setFiles] = useState([]);
  const [activeFile, setActiveFile] = useState(null);

  useEffect(() => {
    loadPrestations();
  }, []);

  async function loadPrestations() {
    const res = await fetch(`${FILES_API}?action=getPrestations`);
    const json = await res.json();
    setPrestations(Array.isArray(json) ? json : []);
  }

  async function openFolder(name) {
    const res = await fetch(
      `${FILES_API}?action=getFiles&show=${encodeURIComponent(name)}`
    );

    const json = await res.json();

    setFiles(Array.isArray(json) ? json : []);
    setSelected(name);
    setActiveFile(null);
  }

  function getDriveId(url = "") {
    try {
      return url.split("/d/")[1].split("/")[0];
    } catch {
      return null;
    }
  }

  function getDirectUrl(file) {
    if (!file?.url) return "";

    const id = getDriveId(file.url);

    if (id && file.name?.toLowerCase().includes(".mp3")) {
      return `https://drive.google.com/uc?export=download&id=${id}`;
    }

    return file.url;
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b0716", color: "white" }}>
      
      {/* SIDEBAR */}
      <div style={{ width: 220, padding: 20, borderRight: "1px solid #333" }}>
        <h3>MAGMA SHOW</h3>

        <button onClick={() => setSelected(null)}>
          Spectacles
        </button>

        <button onClick={loadPrestations}>
          Rafraîchir
        </button>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: 20 }}>

        {!selected && (
          <>
            <h2>Liste spectacles</h2>

            {prestations.map((p, i) => (
              <div
                key={i}
                onClick={() => openFolder(p.name)}
                style={{
                  padding: 10,
                  marginBottom: 10,
                  background: "#1a1430",
                  cursor: "pointer",
                  borderRadius: 8
                }}
              >
                🎭 {p.name}
              </div>
            ))}
          </>
        )}

        {selected && (
          <>
            <button onClick={() => setSelected(null)}>
              ← Retour
            </button>

            <h2>{selected}</h2>

            {/* LECTEUR SIMPLE (petit, stable) */}
            {activeFile && (
              <div style={{
                padding: 15,
                background: "#1a1430",
                borderRadius: 10,
                marginBottom: 20
              }}>
                <div>{activeFile.name}</div>

                {/* MP3 */}
                {activeFile.name?.toLowerCase().includes(".mp3") && (
                  <audio controls style={{ width: "100%" }}>
                    <source src={getDirectUrl(activeFile)} />
                  </audio>
                )}

                {/* VIDEO */}
                {(activeFile.name?.includes(".mp4") ||
                  activeFile.name?.includes(".mkv")) && (
                  <video controls style={{ width: "100%" }}>
                    <source src={activeFile.url} />
                  </video>
                )}

                <button onClick={() => setActiveFile(null)}>
                  Fermer
                </button>
              </div>
            )}

            {/* LISTE FILES */}
            {files.map((f, i) => (
              <div
                key={i}
                onClick={() => setActiveFile(f)}
                style={{
                  padding: 10,
                  borderBottom: "1px solid #333",
                  cursor: "pointer"
                }}
              >
                {f.name}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

export default App;