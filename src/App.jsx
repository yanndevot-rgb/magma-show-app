import { useEffect, useState } from "react";
import "./App.css";

const API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

export default function App() {
  const [shows, setShows] = useState([]);
  const [show, setShow] = useState(null);
  const [files, setFiles] = useState([]);
  const [currentAudio, setCurrentAudio] = useState(null);

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
  }

  // 👉 transforme Drive link en lien lisible
  function getUrl(url) {
    const match = url?.match(/\/d\/([^/]+)/);
    const id = match ? match[1] : null;

    if (!id) return url;

    return `https://drive.google.com/uc?export=download&id=${id}`;
  }

  // 👉 détecte MP3
  function isMp3(name) {
    return name?.toLowerCase().endsWith(".mp3");
  }

  return (
    <div className="app">

      <aside className="sidebar">
        <button onClick={() => setShow(null)}>
          Spectacles
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

            {/* 🔥 AUDIO PLAYER GLOBAL */}
            {currentAudio && (
              <div style={{ marginBottom: 20 }}>
                <audio controls autoPlay src={currentAudio} />
              </div>
            )}

            {files.map((f, i) => {
              const url = getUrl(f.url);

              return (
                <div
                  key={i}
                  style={{
                    padding: 10,
                    borderBottom: "1px solid #444",
                    cursor: "pointer"
                  }}
                >
                  <div>{f.name}</div>

                  {/* 🔥 UNIQUEMENT MP3 LECTURE */}
                  {isMp3(f.name) && (
                    <button
                      onClick={() => setCurrentAudio(url)}
                      style={{ marginTop: 5 }}
                    >
                      ▶ Lire MP3
                    </button>
                  )}

                  {/* DOWNLOAD SIMPLE */}
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    style={{ marginLeft: 10 }}
                  >
                    Télécharger
                  </a>
                </div>
              );
            })}

          </div>
        )}

      </main>
    </div>
  );
}