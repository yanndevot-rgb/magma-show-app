import { useEffect, useState } from "react";

const API =
  "https://script.google.com/macros/s/AKfycby13kgMgiryaUlTI9gyMJB54TIw36s-VjWyPauhDw7x0hmPKZHlUdIvYFCvNvpwWNru/exec";

export default function App() {
  const [shows, setShows] = useState([]);
  const [files, setFiles] = useState([]);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    loadShows();
  }, []);

  async function loadShows() {
    const res = await fetch(API + "?action=getPrestations");
    const json = await res.json();
    setShows(json || []);
  }

  async function openShow(id) {
    const res = await fetch(API + "?action=getFiles&show=" + id);
    const json = await res.json();
    setFiles(json || []);
    setCurrent(id);
  }

  function getAudio(url) {
    const id = url.match(/\/d\/([^/]+)/)?.[1];
    return id
      ? `https://drive.google.com/uc?export=download&id=${id}`
      : url;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>MAGMA SHOW</h2>

      {current ? (
        <div>
          <button onClick={() => { setCurrent(null); setFiles([]); }}>
            ← Retour
          </button>

          {files.map((f, i) => (
            <div key={i} style={{ marginBottom: 15 }}>
              <div>{f.name}</div>

              {f.mime?.includes("audio") && (
                <audio controls src={getAudio(f.url)} />
              )}

              {f.mime?.includes("video") && (
                <video controls src={f.url} width="300" />
              )}

              {(f.mime?.includes("document") ||
                f.mime?.includes("google-apps")) && (
                <iframe src={f.url} width="100%" height="400" />
              )}
            </div>
          ))}
        </div>
      ) : (
        shows.map((s, i) => (
          <div
            key={i}
            onClick={() => openShow(s.id)}
            style={{ padding: 10, cursor: "pointer" }}
          >
            🎭 {s.name}
          </div>
        ))
      )}
    </div>
  );
}