import { useEffect, useState } from "react";
import "./App.css";

const API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

function getType(file) {
  if (!file?.mime) return "unknown";

  if (file.mime.includes("audio")) return "audio";
  if (file.mime.includes("video")) return "video";
  if (file.mime.includes("document") || file.mime.includes("text")) return "text";

  return "unknown";
}

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
  const [currentFile, setCurrentFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadShows();
  }, []);

  async function loadShows() {
    setLoading(true);
    const res = await fetch(`${API}?action=getPrestations`);
    const json = await res.json();
    setShows(Array.isArray(json) ? json : []);
    setLoading(false);
  }

  async function openShow(name) {
    setLoading(true);

    const res = await fetch(
      `${API}?action=getFiles&show=${encodeURIComponent(name)}`
    );

    const json = await res.json();

    setFiles(Array.isArray(json) ? json : []);
    setCurrentShow(name);
    setCurrentFile(null);

    setLoading(false);
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

        {loading && <p>Chargement...</p>}

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
                  cursor: "pointer",
                  background: "#1a1430",
                  borderRadius: 6
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

            {/* PLAYER */}
            {currentFile && (
              <div style={{
                background: "#1a1430",
                padding: 15,
                borderRadius: 10,
                marginBottom: 20
              }}>
                <h3>{currentFile.name}</h3>

                {/* AUDIO */}
                {getType(currentFile) === "audio" && (
                  <audio controls autoPlay style={{ width: "100%" }}>
                    <source src={getStreamUrl(currentFile.url)} />
                  </audio>
                )}

                {/* VIDEO */}
                {getType(currentFile) === "video" && (
                  <video controls style={{ width: "100%" }}>
                    <source src={getStreamUrl(currentFile.url)} />
                  </video>
                )}

                {/* TEXT */}
                {getType(currentFile) === "text" && (
                  <iframe
                    src={currentFile.url}
                    style={{ width: "100%", height: "500px", border: "none" }}
                  />
                )}

                <button onClick={() => setCurrentFile(null)}>
                  Fermer
                </button>
              </div>
            )}

            {/* FILE LIST */}
            {files.map((f, i) => {
              const type = getType(f);

              return (
                <div
                  key={i}
                  onClick={() => setCurrentFile(f)}
                  style={{
                    padding: 10,
                    borderBottom: "1px solid #333",
                    cursor: "pointer"
                  }}
                >
                  {type === "audio" && "🎵 "}
                  {type === "video" && "🎬 "}
                  {type === "text" && "📄 "}
                  {f.name}
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}