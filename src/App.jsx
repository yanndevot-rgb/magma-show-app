import { useEffect, useState } from "react";
import "./App.css";

const FILES_API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

export default function App() {
  const [shows, setShows] = useState([]);
  const [show, setShow] = useState(null);
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    loadShows();
  }, []);

  async function loadShows() {
    const res = await fetch(FILES_API + "?action=getPrestations");
    const json = await res.json();
    setShows(json || []);
  }

  async function openShow(name) {
    const res = await fetch(FILES_API + "?action=getFiles&show=" + name);
    const json = await res.json();
    setFiles(json || []);
    setShow(name);
    setSelected(null);
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

    // MP3
    if (name.endsWith(".mp3")) {
      return (
        <div>
          <audio controls src={url} style={{ width: "100%" }} />
        </div>
      );
    }

    // VIDEO
    if (name.endsWith(".mp4") || name.endsWith(".mkv")) {
      return (
        <video controls src={url} style={{ width: "100%" }} />
      );
    }

    // TEXT / CONDUITE / PDF
    if (
      name.endsWith(".txt") ||
      name.includes("conduite") ||
      name.includes("fiche") ||
      name.endsWith(".pdf")
    ) {
      return (
        <iframe
          src={url}
          style={{ width: "100%", height: "500px" }}
        />
      );
    }

    // IMAGE
    if (name.endsWith(".jpg") || name.endsWith(".png")) {
      return <img src={url} style={{ maxWidth: "100%" }} />;
    }

    return <p>Format non supporté</p>;
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
                style={{ cursor: "pointer", margin: 10 }}
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

            {selected && (
              <div className="preview">
                <h3>{selected.name}</h3>

                {renderFile(selected)}

                <a href={getUrl(selected.url)} target="_blank">
                  Télécharger
                </a>

                <button onClick={() => setSelected(null)}>
                  Fermer
                </button>
              </div>
            )}

            {files.map((f, i) => (
              <div
                key={i}
                style={{
                  borderBottom: "1px solid #444",
                  padding: 10,
                  cursor: "pointer"
                }}
                onClick={() => setSelected(f)}
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