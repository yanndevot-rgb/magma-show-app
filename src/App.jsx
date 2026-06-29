import { useEffect, useState } from "react";
import "./App.css";

const API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

function getDriveId(url) {
  try {
    return url.split("/d/")[1].split("/")[0];
  } catch {
    return null;
  }
}

function getStreamUrl(url) {
  const id = getDriveId(url);
  if (!id) return null;

  return `https://TON-PROJET.vercel.app/api/stream?id=${id}`;
}

export default function App() {
  const [shows, setShows] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentShow, setCurrentShow] = useState(null);
  const [currentAudio, setCurrentAudio] = useState(null);

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
    stopAudio();
  }

  function stopAudio() {
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }
  }

  function playMp3(file) {
    stopAudio();

    const url = getStreamUrl(file.url);
    if (!url) return;

    const audio = new Audio(url);
    audio.play();

    setCurrentAudio(audio);
  }

  function isMp3(name) {
    return name?.toLowerCase().includes(".mp3");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b0716", color: "white" }}>

      {/* LEFT */}
      <div style={{ width: 220, padding: 20, borderRight: "1px solid #333" }}>
        <h3>MAGMA SHOW</h3>

        <button onClick={() => setCurrentShow(null)}>
          Spectacles
        </button>

        <button onClick={loadShows}>
          Rafraîchir
        </button>
      </div>

      {/* RIGHT */}
      <div style={{ flex: 1, padding: 20 }}>

        {!currentShow && (
          <>
            {shows.map((s, i) => (
              <div
                key={i}
                onClick={() => openShow(s.name)}
                style={{
                  padding: 10,
                  cursor: "pointer",
                  background: "#1a1430",
                  marginBottom: 8,
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

            {/* STOP BUTTON */}
            {currentAudio && (
              <button onClick={stopAudio} style={{ marginBottom: 10 }}>
                ⏹ Stop
              </button>
            )}

            {/* FILE LIST */}
            {files.map((f, i) => (
              <div
                key={i}
                onClick={() => {
                  if (isMp3(f.name)) {
                    playMp3(f);
                  }
                }}
                style={{
                  padding: 10,
                  borderBottom: "1px solid #333",
                  cursor: isMp3(f.name) ? "pointer" : "default",
                  color: isMp3(f.name) ? "#d6b35a" : "#aaa"
                }}
              >
                🎵 {f.name}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}