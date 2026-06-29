import { useEffect, useState, useRef } from "react";
import "./App.css";

const API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

function getUrl(file) {
  try {
    const id = file.url.split("/d/")[1].split("/")[0];
    return `https://drive.google.com/uc?export=download&id=${id}`;
  } catch {
    return file.url;
  }
}

function getType(name = "") {
  const n = name.toLowerCase();
  if (n.endsWith(".mp3")) return "audio";
  if (n.endsWith(".mp4") || n.endsWith(".mkv")) return "video";
  if (n.includes(".jpg") || n.includes(".png")) return "image";
  return "doc";
}

export default function App() {
  const [shows, setShows] = useState([]);
  const [files, setFiles] = useState([]);
  const [currentShow, setCurrentShow] = useState(null);

  const [currentSrc, setCurrentSrc] = useState(null);
  const [currentType, setCurrentType] = useState(null);
  const [currentName, setCurrentName] = useState("");

  const videoRef = useRef(null);
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

    stopAll();
  }

  function stopAll() {
    if (audioRef.current) audioRef.current.pause();
    if (videoRef.current) videoRef.current.pause();
    setCurrentSrc(null);
    setCurrentType(null);
    setCurrentName("");
  }

  function playFile(file) {
    const type = getType(file.name);
    const url = getUrl(file);

    setCurrentType(type);
    setCurrentSrc(url);
    setCurrentName(file.name);

    setTimeout(() => {
      if (type === "audio" && audioRef.current) {
        audioRef.current.play().catch(() => {});
      }
      if (type === "video" && videoRef.current) {
        videoRef.current.play().catch(() => {});
      }
    }, 200);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#0b0716", color: "white" }}>

      {/* LEFT */}
      <div style={{ width: 220, padding: 20, borderRight: "1px solid #333" }}>
        <h3>MAGMA SHOW</h3>

        <button onClick={() => {
          setCurrentShow(null);
          setFiles([]);
          stopAll();
        }}>
          Spectacles
        </button>

        <button onClick={loadShows}>
          Rafraîchir
        </button>
      </div>

      {/* RIGHT */}
      <div style={{ flex: 1, padding: 20 }}>

        {/* PLAYER GLOBAL UNIQUE */}
        {currentSrc && (
          <div style={{
            background: "#1a1430",
            padding: 15,
            marginBottom: 20,
            borderRadius: 10
          }}>
            <h3>{currentName}</h3>

            {currentType === "audio" && (
              <audio ref={audioRef} controls style={{ width: "100%" }}>
                <source src={currentSrc} />
              </audio>
            )}

            {currentType === "video" && (
              <video ref={videoRef} controls style={{ width: "100%" }}>
                <source src={currentSrc} />
              </video>
            )}

            <button onClick={stopAll}>Fermer</button>
          </div>
        )}

        {/* SHOW LIST */}
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

        {/* FILE LIST */}
        {currentShow && (
          <>
            <button onClick={() => setCurrentShow(null)}>
              ← Retour
            </button>

            <h2>{currentShow}</h2>

            {files.map((f, i) => (
              <div
                key={i}
                onClick={() => playFile(f)}
                style={{
                  padding: 10,
                  borderBottom: "1px solid #333",
                  cursor: "pointer"
                }}
              >
                {getType(f.name) === "audio" && "🎵 "}
                {getType(f.name) === "video" && "🎬 "}
                {getType(f.name) === "doc" && "📄 "}
                {f.name}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}