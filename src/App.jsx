import { useEffect, useState } from "react";
import "./App.css";

const API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

function getDirectUrl(url) {
  try {
    const id = url.split("/d/")[1].split("/")[0];
    return `https://drive.google.com/uc?export=download&id=${id}`;
  } catch {
    return url;
  }
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
    setCurrentAudio(null);
  }

  function play(file) {
    const url = getDirectUrl(file.url);
    const audio = new Audio(url);

    audio.play();

    setCurrentAudio({
      name: file.name,
      audio
    });
  }

  function stop() {
    if (currentAudio?.audio) {
      currentAudio.audio.pause();
    }
    setCurrentAudio(null);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b0716", color: "white" }}>

      {/* LEFT */}
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
                  marginBottom: 8,
                  cursor: "pointer",
                  background: "#1a1430"
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

            {currentAudio && (
              <div style={{
                padding: 15,
                background: "#1a1430",
                marginBottom: 20
              }}>
                <div>{currentAudio.name}</div>

                <button onClick={() => currentAudio.audio.play()}>
                  ▶ Play
                </button>

                <button onClick={() => currentAudio.audio.pause()}>
                  ⏸ Pause
                </button>

                <button onClick={stop}>
                  Fermer
                </button>
              </div>
            )}

            {files.map((f, i) => (
              <div
                key={i}
                onClick={() => play(f)}
                style={{
                  padding: 10,
                  borderBottom: "1px solid #333",
                  cursor: "pointer"
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