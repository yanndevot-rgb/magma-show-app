import { useEffect, useState } from "react";
import "./App.css";

const FILES_API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

export default function App() {
  const [prestations, setPrestations] = useState([]);
  const [selectedPrestation, setSelectedPrestation] = useState(null);

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

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
    setSelectedFile(null);
  }

  // =========================
  // DOWNLOAD SIMPLE FILE
  // =========================
  function downloadFile(file) {
    if (!file?.url) return;

    const match = file.url.match(/\/d\/([^/]+)/);
    const id = match ? match[1] : null;

    if (!id) return alert("Lien invalide");

    const url =
      "https://drive.google.com/uc?export=download&id=" + id;

    window.open(url, "_blank");
  }

  // =========================
  // OPEN FILE (TEXT / VIDEO)
  // =========================
  function openFile(file) {
    if (!file?.url) return;
    window.open(file.url, "_blank");
  }

  // =========================
  // DOWNLOAD ALL (ZIP BACKEND)
  // =========================
  function downloadAll() {
    window.open(
      FILES_API +
        "?action=downloadZip&show=" +
        selectedPrestation,
      "_blank"
    );
  }

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">
        <button onClick={() => setSelectedPrestation(null)}>
          Spectacles
        </button>

        <button onClick={loadPrestations}>
          Rafraîchir
        </button>
      </aside>

      {/* MAIN */}
      <main className="content">

        {/* LISTE SPECTACLES */}
        {!selectedPrestation && (
          <div>
            <h2>Spectacles</h2>

            {prestations.map((p, i) => (
              <div
                key={i}
                onClick={() => openPrestation(p.name)}
                style={{ cursor: "pointer", padding: 10 }}
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

            {/* ZIP DOWNLOAD */}
            <button
              onClick={downloadAll}
              style={{
                margin: 10,
                padding: 10,
                background: "black",
                color: "gold"
              }}
            >
              ⬇ Télécharger TOUT (ZIP)
            </button>

            {/* PLAYER */}
            {selectedFile && (
              <div style={{ marginBottom: 20 }}>

                <h3>{selectedFile.name}</h3>

                {/* AUDIO */}
                {selectedFile.name?.endsWith(".mp3") && (
                  <>
                    <audio controls src={selectedFile.url} />

                    <button
                      onClick={() => downloadFile(selectedFile)}
                    >
                      ⬇ Télécharger MP3
                    </button>
                  </>
                )}

                {/* VIDEO */}
                {(selectedFile.name?.endsWith(".mp4") ||
                  selectedFile.name?.endsWith(".mkv")) && (
                  <>
                    <video
                      controls
                      src={selectedFile.url}
                      width="100%"
                    />

                    <button
                      onClick={() => downloadFile(selectedFile)}
                    >
                      ⬇ Télécharger vidéo
                    </button>
                  </>
                )}

                {/* TEXTE / PDF */}
                {(selectedFile.name?.endsWith(".txt") ||
                  selectedFile.name?.endsWith(".pdf")) && (
                  <>
                    <button onClick={() => openFile(selectedFile)}>
                      📄 Ouvrir
                    </button>

                    <button
                      onClick={() => downloadFile(selectedFile)}
                    >
                      ⬇ Télécharger texte
                    </button>
                  </>
                )}

                {/* IMAGE */}
                {(selectedFile.name?.endsWith(".jpg") ||
                  selectedFile.name?.endsWith(".png")) && (
                  <>
                    <img
                      src={selectedFile.url}
                      style={{ maxWidth: "100%" }}
                    />

                    <button
                      onClick={() => downloadFile(selectedFile)}
                    >
                      ⬇ Télécharger image
                    </button>
                  </>
                )}

              </div>
            )}

            {/* LIST FILES */}
            <div>
              {files.map((f, i) => (
                <div
                  key={i}
                  style={{
                    padding: 10,
                    borderBottom: "1px solid #333",
                    cursor: "pointer"
                  }}
                  onClick={() => setSelectedFile(f)}
                >
                  {f.name}
                </div>
              ))}
            </div>

          </div>
        )}

      </main>
    </div>
  );
}