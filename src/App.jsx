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
  // DOWNLOAD UNIVERSAL DRIVE
  // =========================
  function downloadFile(file) {
    if (!file?.url) return;

    const match = file.url.match(/\/d\/([^/]+)/);
    const id = match ? match[1] : null;

    if (!id) {
      alert("Lien invalide Drive");
      return;
    }

    const url =
      "https://drive.google.com/uc?export=download&id=" + id;

    window.open(url, "_blank");
  }

  // =========================
  // RENDER FILE LOGIC (IMPORTANT)
  // =========================
  function renderFile(file) {
    if (!file) return null;

    const name = file.name?.toLowerCase();

    // AUDIO
    if (name.endsWith(".mp3")) {
      return (
        <div style={{ marginTop: 20 }}>
          <audio controls src={file.url} style={{ width: "100%" }} />

          <button onClick={() => downloadFile(file)}>
            ⬇ Télécharger MP3
          </button>
        </div>
      );
    }

    // VIDEO
    if (name.endsWith(".mp4") || name.endsWith(".mkv")) {
      return (
        <div style={{ marginTop: 20 }}>
          <video controls src={file.url} width="100%" />

          <button onClick={() => downloadFile(file)}>
            ⬇ Télécharger vidéo
          </button>
        </div>
      );
    }

    // DOCUMENTS (conduite / fiche / pdf / txt)
    if (
      name.includes("conduite") ||
      name.includes("fiche") ||
      name.endsWith(".pdf") ||
      name.endsWith(".txt")
    ) {
      return (
        <div style={{ marginTop: 20 }}>
          <button onClick={() => window.open(file.url, "_blank")}>
            📄 Ouvrir document
          </button>

          <button onClick={() => downloadFile(file)}>
            ⬇ Télécharger document
          </button>
        </div>
      );
    }

    // IMAGE
    if (
      name.endsWith(".jpg") ||
      name.endsWith(".png")
    ) {
      return (
        <div style={{ marginTop: 20 }}>
          <img src={file.url} style={{ maxWidth: "100%" }} />

          <button onClick={() => downloadFile(file)}>
            ⬇ Télécharger image
          </button>
        </div>
      );
    }

    // FALLBACK
    return (
      <div>
        <a href={file.url} target="_blank">
          Ouvrir fichier
        </a>
      </div>
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

        {/* VIEW PRESTATION */}
        {selectedPrestation && (
          <div>

            <button onClick={() => setSelectedPrestation(null)}>
              ← Retour
            </button>

            <h2>{selectedPrestation}</h2>

            {/* FILE VIEWER */}
            {selectedFile && renderFile(selectedFile)}

            {/* LIST FILES */}
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
        )}

      </main>
    </div>
  );
}