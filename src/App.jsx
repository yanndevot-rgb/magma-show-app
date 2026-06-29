import { useEffect, useState } from "react";
import "./App.css";

const API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

export default function App() {
  const [shows, setShows] = useState([]);
  const [show, setShow] = useState(null);
  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    loadShows();
  }, []);

  async function loadShows() {
    const res = await fetch(API + "?action=getPrestations");
    const json = await res.json();
    setShows(json || []);
  }

  async function openShow(name) {
    const res = await fetch(API + "?action=getFiles&show=" + name);
    const json = await res.json();
    setFiles(json || []);
    setShow(name);
    setPreview(null);
  }

  function getUrl(url) {
    const match = url?.match(/\/d\/([^/]+)/);
    const id = match ? match[1] : null;
    if (!id) return url;
    return `https://drive.google.com/uc?export=download&id=${id}`;
  }

  function renderFile(file) {
    const name = file.name.toLowerCase();
    const url = getUrl(file.url);

    // 🎧 AUDIO
    if (name.endsWith(".mp3")) {
      return <audio controls src={url} style={{ width: "100%" }} />;
    }

    // 🎬 VIDEO
    if (name.endsWith(".mp4") || name.endsWith(".mkv")) {
      return <video controls src={url} style={{ width: "100%" }} />;
    }

    // 📄 TEXTE / PDF / CONDUITE
    if (
      name.endsWith(".txt") ||
      name.endsWith(".pdf") ||
      name.includes("conduite") ||
      name.includes("fiche")
    ) {
      return (
        <iframe
          src={url}
          style={{ width: "100%", height: "600px" }}
        />
      );
    }

    // 🖼 IMAGE
    if (name.endsWith(".jpg") || name.endsWith(".png")) {
      return <img src={url} style={{ maxWidth: "100%" }} />;
    }

    return <div>Format non supporté</div>;
  }

  return (
    <div className="app">

      <aside className="sidebar">
        <button onClick={() => setShow(null)}>
          Spectacles
        </button>

        <button onClick={loadShows}>
          Rafraîchir
        </button>
      </aside>

      <main className="content">

        {/* LISTE SPECTACLES */}
        {!show && (
          <div>
            <h2>Spectacles</h2>

            {shows.map((s, i) => (
              <div
                key={i}
                onClick={() => openShow(s.name)}
                style={{ cursor: "pointer", margin: 10 }}
              >
                🎭 {s.name}
              </div>
            ))}
          </div>
        )}

        {/* LISTE FICHIERS */}
        {show && (
          <div>

            <button onClick={() => setShow(null)}>
              ← Retour
            </button>

            <h2>{show}</h2>

            {/* PREVIEW SIMPLE */}
            {preview && (
              <div className="preview">
                <h3>{preview.name}</h3>
                {renderFile(preview)}

                <button onClick={() => setPreview(null)}>
                  Fermer
                </button>
              </div>
            )}

            {/* LISTE */}
            {files.map((f, i) => (
              <div
                key={i}
                style={{
                  padding: 10,
                  borderBottom: "1px solid #444",
                  cursor: "pointer"
                }}
                onClick={() => setPreview(f)}
              >
                {f.name}
              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}