import { useEffect, useState } from "react";
import "./App.css";

/* =========================
   MP3 PLAYER CLEAN
========================= */
function Mp3Player({ file, onClose }) {
  const [audio] = useState(() => new Audio(file.url));
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    return () => {
      audio.pause();
    };
  }, []);

  function toggle() {
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play();
      setPlaying(true);
    }
  }

  return (
    <div
      style={{
        background: "#2a1f3d",
        padding: 20,
        borderRadius: 12,
        marginBottom: 20,
        color: "white"
      }}
    >
      <h3>{file.name}</h3>

      <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
        <button onClick={toggle}>
          {playing ? "⏸ Pause" : "▶ Play"}
        </button>

        <span style={{ fontSize: 12 }}>MP3 PLAYER</span>
      </div>

      <button onClick={onClose} style={{ marginTop: 10 }}>
        Fermer
      </button>
    </div>
  );
}

/* =========================
   API
========================= */
const API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

/* =========================
   APP
========================= */
export default function App() {
  const [prestations, setPrestations] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentShow, setCurrentShow] = useState(null);
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(false);

  /* LOAD SHOWS */
  useEffect(() => {
    loadShows();
  }, []);

  async function loadShows() {
    setLoading(true);

    try {
      const res = await fetch(`${API}?action=getPrestations`);
      const json = await res.json();

      setPrestations(Array.isArray(json) ? json : []);
    } catch (e) {
      console.error(e);
    }

    setLoading(false);
  }

  /* OPEN SHOW */
  async function openShow(name) {
    setLoading(true);

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

    setLoading(false);
  }

  /* UI */
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        background: "#0b0716",
        color: "white"
      }}
    >
      {/* LEFT MENU */}
      <div
        style={{
          width: 220,
          padding: 20,
          borderRight: "1px solid #333"
        }}
      >
        <h3>MAGMA SHOW</h3>

        <button
          onClick={() => {
            setCurrentShow(null);
            setFiles([]);
            setCurrentFile(null);
          }}
        >
          Spectacles
        </button>

        <button onClick={loadShows} style={{ marginTop: 10 }}>
          Rafraîchir
        </button>
      </div>

      {/* RIGHT CONTENT */}
      <div style={{ flex: 1, padding: 20 }}>
        {/* LIST SHOWS */}
        {!currentShow && (
          <>
            {loading && <p>Chargement...</p>}

            {prestations.map((p, i) => (
              <div
                key={i}
                onClick={() => openShow(p.name)}
                style={{
                  padding: 10,
                  marginBottom: 8,
                  cursor: "pointer",
                  background: "#1a1430",
                  borderRadius: 6
                }}
              >
                🎭 {p.name}
              </div>
            ))}
          </>
        )}

        {/* SHOW VIEW */}
        {currentShow && (
          <>
            <button
              onClick={() => {
                setCurrentShow(null);
                setFiles([]);
                setCurrentFile(null);
              }}
            >
              ← Retour
            </button>

            <h2>{currentShow}</h2>

            {/* MP3 PLAYER */}
            {currentFile && (
              <Mp3Player
                file={currentFile}
                onClose={() => setCurrentFile(null)}
              />
            )}

            {/* FILE LIST */}
            {files
              .filter((f) => f.name?.toLowerCase().includes(".mp3"))
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