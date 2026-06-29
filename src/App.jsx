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
    try {
      const res = await fetch(API + "?action=getPrestations");
      const json = await res.json();
      setShows(json || []);
    } catch (e) {
      console.log("error shows", e);
    }
  }

  async function openShow(name) {
    try {
      const res = await fetch(API + "?action=getFiles&show=" + name);
      const json = await res.json();
      setFiles(json || []);
      setShow(name);
      setPreview(null);
    } catch (e) {
      console.log("error files", e);
    }
  }

  // 🔥 IMPORTANT : on ne transforme rien pour tester stabilité
  function getUrl(url) {
    return url;
  }

  function renderFile(file) {
    const name = file.name.toLowerCase();
    const url = getUrl(file.url);

    // 🎧 MP3
    if (name.endsWith(".mp3")) {
      return (
        <audio controls style={{ width: "100%" }}>
          <source src={url} type="audio/mpeg" />
        </audio>
      );
    }

    // 🎬 VIDEO
    if (name.endsWith(".mp4") || name.endsWith(".mkv")) {
      return (
        <video controls style={{ width: "100%" }}>
          <source src={url} />
        </video>
      );
    }

    // 📄 TEXTE / PDF / CONDUITE
    if (
      name.includes("conduite") ||
      name.includes("fiche") ||
      name.endsWith(".pdf") ||
      name.endsWith(".txt")
    ) {
      return (
        <iframe
          src={url}
          width="100%"
          height="600px"
          style={{ border: "none" }}
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

        {/* LISTE SHOWS */}
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

        {/* FILES */}
        {show && (
          <div>

            <button onClick={() => setShow(null)}>
              ← Retour
            </button>

            <h2>{show}</h2>

            {/* PREVIEW */}
            {preview && (
              <div style={{ marginBottom: 20 }}>
                <h3>{preview.name}</h3>
                {renderFile(preview)}
                <button onClick={() => setPreview(null)}>
                  Fermer
                </button>
              </div>
            )}

            {/* LIST */}
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