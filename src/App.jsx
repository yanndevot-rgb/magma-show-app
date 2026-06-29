import { useEffect, useRef, useState } from "react";
import "./App.css";

const API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

/* =========================
   MP3 URL FIX (Drive bypass)
========================= */
function getStreamUrl(url) {
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

  const audioRef = useRef(null);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [playing, setPlaying] = useState(false);

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
  }

  function playTrack(file) {
    const url = getStreamUrl(file.url);

    setCurrentTrack({
      name: file.name,
      url
    });

    setTimeout(() => {
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.play();
        setPlaying(true);
      }
    }, 100);
  }

  function toggle() {
    if (!audioRef.current) return;

    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play();
      setPlaying(true);
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
        }}>
          Spectacles
        </button>

        <button onClick={loadShows} style={{ marginTop: 10 }}>
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
                  background: "#1a1430",
                  cursor: "pointer"
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

            {/* MINI PLAYER FIXE (Spotify style) */}
            {currentTrack && (
              <div style={{
                position: "fixed",
                bottom: 20,
                left: 240,
                right: 20,
                background: "#1a1430",
                padding: 15,
                borderRadius: 10
              }}>
                <div>{currentTrack.name}</div>

                <audio ref={audioRef} />

                <button onClick={toggle}>
                  {playing ? "⏸ Pause" : "▶ Play"}
                </button>
              </div>
            )}

            {/* LIST FILES */}
            {files.map((f, i) => (
              <div
                key={i}
                onClick={() => playTrack(f)}
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