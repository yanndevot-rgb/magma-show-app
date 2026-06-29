import { useEffect, useState } from "react";
import "./App.css";

const API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

export default function App() {
  const [shows, setShows] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentShow, setCurrentShow] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    loadShows();
  }, []);

  async function loadShows() {
    const res = await fetch(`${API}?action=getPrestations`);
    const json = await res.json();
    setShows(Array.isArray(json) ? json : []);
  }

  async function openShow(name) {
    const res = await fetch(
      `${API}?action=getFiles&show=${encodeURIComponent(name)}`
    );

    const json = await res.json();

    setFiles(Array.isArray(json) ? json : []);
    setCurrentShow(name);
    setSelectedFile(null);
  }

  function isMp3(name) {
    return name?.toLowerCase().includes(".mp3");
  }

  function isMp4(name) {
    return name?.toLowerCase().includes(".mp4");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b0716", color: "white" }}>

      {/* MENU */}
      <div style={{ width: 220, padding: 20, borderRight: "1px solid #333" }}>
        <h3>MAGMA SHOW</h3>

        <button onClick={() => setCurrentShow(null)}>
          Spectacles
        </button>

        <button onClick={loadShows}>
          Rafraîchir
        </button>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: 20 }}>

        {!currentShow && (
          <>
            {shows.map((s, i) => (
              <div
                key={i}
                onClick={() => openShow(s.name)}
                style={{
                  padding: 10,
                  marginBottom: 8,
                  background: "#1a1430",
                  cursor: "pointer",
                  borderRadius: 6
                }}
              >
                🎭 {s.name}
              </div>
            ))}
          </>
        )}

        {currentShow && (
          <>
            <button onClick={() => setCurrentShow(null)}>
              ← Retour
            </button>

            <h2>{currentShow}</h2>

            {/* PLAYER SIMPLE NATIF */}
            {selectedFile && (
              <div style={{ background: "#1a1430", padding: 10, marginBottom: 20 }}>
                <h3>{selectedFile.name}</h3>

                {isMp3(selectedFile.name) && (
                  <audio controls autoPlay style={{ width: "100%" }}>
                    <source src={selectedFile.url} />
                  </audio>
                )}

                {isMp4(selectedFile.name) && (
                  <video controls style={{ width: "100%" }} src={selectedFile.url} />
                )}

                <button onClick={() => setSelectedFile(null)}>
                  Fermer
                </button>
              </div>
            )}

            {/* LISTE */}
            {files.map((f, i) => (
              <div
                key={i}
                onClick={() => setSelectedFile(f)}
                style={{
                  padding: 10,
                  borderBottom: "1px solid #333",
                  cursor: "pointer"
                }}
              >
                {isMp3(f.name) ? "🎵" : isMp4(f.name) ? "🎬" : "📄"} {f.name}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}