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
    const r = await fetch(API + "?action=getPrestations");
    const j = await r.json();
    setShows(j || []);
  }

  async function openShow(name) {
    const r = await fetch(API + "?action=getFiles&show=" + name);
    const j = await r.json();
    setFiles(j || []);
    setShow(name);
    setPreview(null);
  }

  // 🔥 STREAM FIX MAGMA
  function streamUrl(url) {
    const match = url?.match(/\/d\/([^/]+)/);
    const id = match ? match[1] : null;

    if (!id) return url;

    return `https://drive.google.com/uc?export=download&id=${id}`;
  }

  function download(file) {
    window.open(streamUrl(file.url), "_blank");
  }

  function render(file) {
    if (!file) return null;

    const name = file.name.toLowerCase();
    const url = streamUrl(file.url);

    return (
      <div className="modal">
        <div className="modalContent">

          <h3>{file.name}</h3>

          {/* AUDIO */}
          {name.endsWith(".mp3") && (
            <audio controls src={url} />
          )}

          {/* VIDEO */}
          {(name.endsWith(".mp4") || name.endsWith(".mkv")) && (
            <video controls src={url} width="100%" />
          )}

          {/* DOC */}
          {(name.includes("conduite") ||
            name.includes("fiche") ||
            name.endsWith(".pdf") ||
            name.endsWith(".txt")) && (
            <iframe src={url} width="100%" height="500px" />
          )}

          {/* IMAGE */}
          {(name.endsWith(".jpg") || name.endsWith(".png")) && (
            <img src={url} style={{ maxWidth: "100%" }} />
          )}

          <button onClick={() => download(file)}>
            ⬇ Télécharger
          </button>

          <button onClick={() => setPreview(null)}>
            Fermer
          </button>

        </div>
      </div>
    );
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

        {!show && (
          <div>
            <h2>Spectacles</h2>

            {shows.map((s, i) => (
              <div
                key={i}
                onClick={() => openShow(s.name)}
              >
                🎭 {s.name}
              </div>
            ))}
          </div>
        )}

        {show && (
          <div>

            <button onClick={() => setShow(null)}>
              ← Retour
            </button>

            <h2>{show}</h2>

            {preview && render(preview)}

            {files.map((f, i) => (
              <div key={i} className="row">

                <div onClick={() => setPreview(f)}>
                  {f.name}
                </div>

                <button onClick={() => download(f)}>
                  Download
                </button>

              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}