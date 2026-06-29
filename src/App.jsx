import { useEffect, useState } from "react";
import "./App.css";

const API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

export default function App() {
  const [prestations, setPrestations] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [currentShow, setCurrentShow] = useState(null);

  useEffect(() => {
    loadShows();
  }, []);

  async function loadShows() {
    const res = await fetch(`${API}?action=getPrestations`);
    const json = await res.json();
    setPrestations(Array.isArray(json) ? json : []);
  }

  async function openShow(name) {
    const res = await fetch(
      `${API}?action=getFiles&show=${encodeURIComponent(name)}`
    );

    const json = await res.json();

    setFiles(Array.isArray(json) ? json : []);
    setCurrentShow(name);
    setCurrentFile(null);
  }

  function getMp3Url(url) {
    try {
      const id = url.split("/d/")[1].split("/")[0];
      return `https://drive.google.com/uc?export=download&id=${id}`;
    } catch {
      return url;
    }
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b0716", color: "white" }}>

      {/* LEFT MENU */}
      <div style={{ width: 220, padding: 20, borderRight: "1px solid #333" }}>
        <h3>MAGMA SHOW</h3>

        <button onClick={() => {
          setCurrentShow(null);
          setFiles([]);
        }}>
          Spectacles
        </button>

        <button onClick={loadShows}>
          Rafraîchir
        </button>
      </div>

      {/* RIGHT CONTENT */}
      <div style={{ flex: 1, padding: 20 }}>

        {/* LISTE SHOWS */}
        {!currentShow && (
          <>
            {prestations.map((p, i) => (
              <div
                key={i}
                onClick={() => openShow(p.name)}
                style={{
                  padding: 10,
                  cursor: "pointer",
                  background: "#1a1430",
                  marginBottom: 8,
                  borderRadius: 6
                }}
              >
                🎭 {p.name}
              </div>
            ))}
          </>
        )}

        {/* SHOW CONTENT */}
        {currentShow && (
          <>
            <button onClick={() => setCurrentShow(null)}>
              ← Retour
            </button>

            <h2>{currentShow}</h2>

            {/* PLAYER */}
            {currentFile && (
              <div style={{
                background: "#1a1430",
                padding: 15,
                borderRadius: 10,
                marginBottom: 20
              }}>
                <h3>{currentFile.name}</h3>

                <audio controls autoPlay style={{ width: "100%" }}>
                  <source src={getMp3Url(currentFile.url)} />
                </audio>

                <button onClick={() => setCurrentFile(null)}>
                  Fermer
                </button>
              </div>
            )}

            {/* FILE LIST */}
            {files
              .filter(f => f.name?.toLowerCase().includes(".mp3"))
              .map((f, i) => (
                <div
                  key={i}
                  onClick={() => setCurrentFile(f)}
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