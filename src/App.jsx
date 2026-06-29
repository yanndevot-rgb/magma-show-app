import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  "https://script.google.com/macros/s/AKfycbwbz7GTq3ar7E_74SWoqZX2X12AfdnDII1wtkNsnLhxkMfRDCcuDxfagJK9kvSoIAGMNA/exec?action=getAll";

const FILES_API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

function App() {
  const [prestations, setPrestations] = useState([]);
  const [selectedPrestation, setSelectedPrestation] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchPrestations();
  }, []);

  async function fetchPrestations() {
    setLoading(true);

    const res = await fetch(`${FILES_API}?action=getPrestations`);
    const json = await res.json();

    setPrestations(Array.isArray(json) ? json : []);
    setLoading(false);
  }

  async function openPrestation(name) {
    setLoading(true);

    const res = await fetch(
      `${FILES_API}?action=getFiles&show=${encodeURIComponent(name)}`
    );

    const json = await res.json();

    setFiles(Array.isArray(json) ? json : []);
    setSelectedPrestation(name);
    setSelectedFile(null);

    setLoading(false);
  }

  function renderFile(file) {
    if (!file?.url) return <p>URL manquante</p>;

    const url = file.url;
    const name = (file.name || "").toLowerCase();

    // 🎵 MP3
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

    // 📄 TEXTE / DOC / DRIVE
    return (
      <iframe
        src={url}
        style={{ width: "100%", height: "600px", border: "none" }}
      />
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <h3>MAGMA SHOW</h3>

        <button onClick={() => setSelectedPrestation(null)}>
          Spectacles
        </button>

        <button onClick={fetchPrestations}>Rafraîchir</button>
      </div>

      <div className="content">
        {loading && <p>Chargement...</p>}

        {/* LISTE SPECTACLES */}
        {!selectedPrestation && (
          <div>
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

        {/* LISTE FICHIERS */}
        {selectedPrestation && (
          <div>
            <button onClick={() => setSelectedPrestation(null)}>
              ← Retour
            </button>

            <h2>{selectedPrestation}</h2>

            {/* 🔥 LECTURE */}
            {selectedFile && (
              <div style={{ marginBottom: 20 }}>
                <h3>{selectedFile.name}</h3>
                {renderFile(selectedFile)}

                <button onClick={() => setSelectedFile(null)}>
                  Fermer
                </button>
              </div>
            )}

            {/* FILES */}
            {files.map((f, i) => (
              <div
                key={i}
                onClick={() => setSelectedFile(f)}
                style={{
                  padding: 10,
                  cursor: "pointer",
                  borderBottom: "1px solid #333",
                }}
              >
                {f.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;