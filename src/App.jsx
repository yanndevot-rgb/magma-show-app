import { useEffect, useState } from "react";
import "./App.css";

const API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

export default function App() {
  const [prestations, setPrestations] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentShow, setCurrentShow] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);

  useEffect(() => {
    loadShows();
  }, []);

  async function loadShows() {
    try {
      const res = await fetch(`${API}?action=getPrestations`);
      const json = await res.json();
      setPrestations(Array.isArray(json) ? json : []);
    } catch (e) {
      console.error(e);
    }
  }

  async function openShow(name) {
    try {
      const res = await fetch(
        `${API}?action=getFiles&show=${encodeURIComponent(name)}`
      );
      const json = await res.json();

      setFiles(Array.isArray(json) ? json : []);
      setCurrentShow(name);
      setCurrentFile(null);
    } catch (e) {
      console.error(e);
    }
  }

  function getUrl(url) {
    try {
      const id = url.split("/d/")[1].split("/")[0];
      return `https://drive.google.com/uc?export=preview&id=${id}`;
    } catch {
      return url;
    }
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#0b0716", color: "white" }}>

      {/* LEFT */}
      <div style={{ width: 220, padding: 20, borderRight: "1px solid #333" }}>
        <h3>MAGMA SHOW</h3>

        <button onClick={() => {
          setCurrentShow(null);
          setFiles([]);
          setCurrentFile(null);
        }}>
          Spectacles
        </button>

        <button onClick={loadShows} style={{ marginTop: 10 }}>
          Rafraîchir
        </button>
      </div>

      {/* RIGHT */}
      <div style={{ flex: 1, padding: 20 }}>

        {/* LIST SHOWS */}
        {!currentShow && (
          <>
            {prestations.map((p, i) => (
              <div
                key={i}
                onClick={() => openShow(p.name)}
                style={{
                  padding: 10,
                  marginBottom: 8,
                  cursor: "pointer",
                  background: "#1a1430"
                }}
              >
                🎭 {p.name}
              </div>
            ))}
          </>
        )}

        {/* SHOW */}
        {currentShow && (
          <>
            <button onClick={() => setCurrentShow(null)}>
              ← Retour
            </button>

            <h2>{currentShow}</h2>

            {/* PLAYER SIMPLE */}
            {currentFile && (
              <div style={{
                background: "#1a1430",
                padding: 15,
                marginBottom: 20
              }}>
                <h3>{currentFile.name}</h3>

                {/* 🔥 SIMPLE AUDIO NATIF (IMPORTANT) */}
                <audio controls autoPlay style={{ width: "100%" }}>
                  <source src={getUrl(currentFile.url)} type="audio/mpeg" />
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