import { useEffect, useState, useRef } from "react";

const API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

function toDirect(url) {
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
  const audioRef = useRef(null);

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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    setCurrentAudio(null);
  }

  function play(file) {
    const url = toDirect(file.url);

    stopAudio();

    const audio = new Audio(url);
    audioRef.current = audio;

    audio.play().catch(() => {
      console.log("Lecture bloquée");
    });

    setCurrentAudio(file.name);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b0716", color: "white" }}>

      {/* MENU */}
      <div style={{ width: 220, padding: 20, borderRight: "1px solid #333" }}>
        <h3>MAGMA SHOW</h3>

        <button onClick={() => {
          setCurrentShow(null);
          setFiles([]);
          stopAudio();
        }}>
          Spectacles
        </button>

        <button onClick={loadShows}>
          Rafraîchir
        </button>
      </div>

      {/* CONTENT */}
      <div style={{ flex: 1, padding: 20 }}>

        {/* LIST SHOWS */}
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
                  cursor: "pointer"
                }}
              >
                🎭 {s.name}
              </div>
            ))}
          </>
        )}

        {/* SHOW VIEW */}
        {currentShow && (
          <>
            <button onClick={() => setCurrentShow(null)}>
              ← Retour
            </button>

            <h2>{currentShow}</h2>

            {currentAudio && (
              <div style={{
                background: "#1a1430",
                padding: 15,
                marginBottom: 20
              }}>
                🎵 Lecture : {currentAudio}

                <div style={{ marginTop: 10 }}>
                  <button onClick={() => audioRef.current?.play()}>
                    Play
                  </button>

                  <button onClick={() => audioRef.current?.pause()}>
                    Pause
                  </button>

                  <button onClick={stopAudio}>
                    Stop
                  </button>
                </div>
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