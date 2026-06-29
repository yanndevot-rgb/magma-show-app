import { useEffect, useState } from "react";
import "./App.css";

const FILES_API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

export default function App() {
  const [prestations, setPrestations] = useState([]);
  const [selectedPrestation, setSelectedPrestation] = useState(null);

  const [files, setFiles] = useState([]);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    loadPrestations();
  }, []);

  async function loadPrestations() {
    const res = await fetch(FILES_API + "?action=getPrestations");
    const json = await res.json();
    setPrestations(json || []);
  }

  async function openPrestation(name) {
    const res = await fetch(
      FILES_API + "?action=getFiles&show=" + name
    );
    const json = await res.json();

    setFiles(json || []);
    setSelectedPrestation(name);
    setPreview(null);
  }

  function downloadFile(file) {
    if (!file?.url) return;

    const match = file.url.match(/\/d\/([^/]+)/);
    const id = match ? match[1] : null;

    if (!id) return alert("Lien invalide Drive");

    const url =
      "https://drive.google.com/uc?export=download&id=" + id;

    window.open(url, "_blank");
  }

  function renderPreview(file) {
    if (!file) return null;

    const name = file.name?.toLowerCase();

    return (
      <div className="modal">
        <div className="modalContent">

          <h3>{file.name}</h3>

          {/* AUDIO */}
          {name.endsWith(".mp3") && (
            <audio controls src={file.url} style={{ width: "100%" }} />
          )}

          {/* VIDEO */}
          {(name.endsWith(".mp4") || name.endsWith(".mkv")) && (
            <video controls src={file.url} width="100%" />
          )}

          {/* PDF / TEXTE / CONDUITE / FICHE */}
          {(name.includes("conduite") ||
            name.includes("fiche") ||
            name.endsWith(".pdf") ||
            name.endsWith(".txt")) && (
            <iframe
              src={file.url}
              width="100%"
              height="500px"
              title="document"
            />
          )}

          {/* IMAGE */}
          {(name.endsWith(".jpg") || name.endsWith(".png")) && (
            <img src={file.url} style={{ maxWidth: "100%" }} />
          )}

          <div style={{ marginTop: 10 }}>
            <button onClick={() => downloadFile(file)}>
              ⬇ Télécharger
            </button>

            <button onClick={() => setPreview(null)}>
              Fermer
            </button>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <div style={{ color: "white", padding: 10 }}>
          MAGMA SHOW
        </div>

        <button onClick={() => setSelectedPrestation(null)}>
          Spectacles
        </button>

        <button onClick={loadPrestations}>
          Rafraîchir
        </button>
      </aside>

      {/* MAIN */}
      <main className="content">

        {/* HOME */}
        {!selectedPrestation && (
          <div>
            <h2>Spectacles</h2>

            {prestations.map((p, i) => (
              <div
                key={i}
                onClick={() => openPrestation(p.name)}
                style={{
                  cursor: "pointer",
                  padding: 12,
                  borderBottom: "1px solid #333"
                }}
              >
                🎭 {p.name}
              </div>
            ))}
          </div>
        )}

        {/* FILE VIEW */}
        {selectedPrestation && (
          <div>

            <button onClick={() => setSelectedPrestation(null)}>
              ← Retour
            </button>

            <h2>{selectedPrestation}</h2>

            {/* PREVIEW */}
            {preview && renderPreview(preview)}

            {/* FILE LIST */}
            {files.map((f, i) => (
              <div
                key={i}
                style={{
                  padding: 10,
                  borderBottom: "1px solid #333",
                  cursor: "pointer"
                }}
              >
                <div onClick={() => setPreview(f)}>
                  {f.name}
                </div>

                <button onClick={() => downloadFile(f)}>
                  ⬇ Download
                </button>
              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}