import { useEffect, useState } from "react";

const API =
  "https://script.google.com/macros/s/AKfycby13kgMgiryaUlTI9gyMJB54TIw36s-VjWyPauhDw7x0hmPKZHlUdIvYFCvNvpwWNru/exec";

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

  // 🔥 AUCUNE TRANSFORMATION (comme avant)
  function getUrl(url) {
    return url;
  }

  function render(file) {
    const name = file.name.toLowerCase();
    const url = getUrl(file.url);

    // AUDIO
    if (name.endsWith(".mp3")) {
      return (
        <audio controls src={url} style={{ width: "100%" }} />
      );
    }

    // VIDEO
    if (name.endsWith(".mp4") || name.endsWith(".mkv")) {
      return (
        <video controls src={url} style={{ width: "100%" }} />
      );
    }

    // DOC / TEXTE / CONDUITE
    if (
      name.includes("conduite") ||
      name.includes("fiche") ||
      name.endsWith(".pdf") ||
      name.endsWith(".txt")
    ) {
      return (
        <iframe
          src={url}
          style={{ width: "100%", height: "600px" }}
        />
      );
    }

    return <div>Format non supporté</div>;
  }

  return (
    <div style={{ padding: 20 }}>

      <h2>MAGMA SHOW</h2>

      {!show ? (
        shows.map((s, i) => (
          <div
            key={i}
            onClick={() => openShow(s.name)}
            style={{ cursor: "pointer", padding: 10 }}
          >
            🎭 {s.name}
          </div>
        ))
      ) : (
        <div>

          <button onClick={() => setShow(null)}>
            ← Retour
          </button>

          <h3>{show}</h3>

          {preview && (
            <div>
              <h4>{preview.name}</h4>
              {render(preview)}
              <button onClick={() => setPreview(null)}>
                Fermer
              </button>
            </div>
          )}

          {files.map((f, i) => (
            <div
              key={i}
              onClick={() => setPreview(f)}
              style={{
                padding: 10,
                borderBottom: "1px solid #444",
                cursor: "pointer"
              }}
            >
              {f.name}
            </div>
          ))}

        </div>
      )}

    </div>
  );
}