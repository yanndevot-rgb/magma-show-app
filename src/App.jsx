import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  "https://script.google.com/macros/s/AKfycbwbz7GTq3ar7E_74SWoqZX2X12AfdnDII1wtkNsnLhxkMfRDCcuDxfagJK9kvSoIAGMNA/exec?action=getAll";

const FILES_API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [prestations, setPrestations] = useState([]);
  const [selectedPrestation, setSelectedPrestation] = useState(null);

  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);

      const pres = await fetch(
        `${FILES_API}?action=getPrestations`
      );
      const presJson = await pres.json();

      setPrestations(presJson || []);
    } catch (e) {
      setError("Erreur chargement");
    } finally {
      setLoading(false);
    }
  }

  async function openPrestation(name) {
    try {
      const res = await fetch(
        `${FILES_API}?action=getFiles&show=${name}`
      );
      const json = await res.json();

      setFiles(json || []);
      setSelectedPrestation(name);
      setSelectedFile(null);
    } catch (e) {
      console.error(e);
    }
  }

  function downloadFile(file) {
    if (!file?.url) return;

    const match = file.url.match(/\/d\/([^/]+)/);
    const id = match ? match[1] : null;

    if (!id) {
      alert("Lien invalide");
      return;
    }

    const url = `https://drive.google.com/uc?export=download&id=${id}`;
    window.open(url, "_blank");
  }

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="app">

      <aside className="sidebar">
        <button onClick={() => {
          setSelectedPrestation(null);
          setFiles([]);
          setSelectedFile(null);
        }}>
          Spectacles
        </button>
      </aside>

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

        {/* FICHIERS */}
        {selectedPrestation && (
          <div>

            <button onClick={() => setSelectedPrestation(null)}>
              ← Retour
            </button>

            <h2>{selectedPrestation}</h2>

            {/* PLAYER + DOWNLOAD TOUJOURS VISIBLE */}
            {selectedFile && (
              <div style={{ marginBottom: 20 }}>

                <h3>{selectedFile.name}</h3>

                <audio
                  controls
                  src={selectedFile.url}
                  style={{ width: "100%" }}
                />

                <button
                  onClick={() => downloadFile(selectedFile)}
                  style={{
                    marginTop: 10,
                    padding: "10px 15px",
                    background: "#d4af37",
                    border: "none",
                    borderRadius: 8,
                    cursor: "pointer"
                  }}
                >
                  ⬇ Télécharger MP3
                </button>

              </div>
            )}

            {/* LISTE FILES */}
            {files.map((f, i) => (
              <div
                key={i}
                onClick={() => setSelectedFile(f)}
                style={{
                  padding: 10,
                  cursor: "pointer",
                  borderBottom: "1px solid #333"
                }}
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