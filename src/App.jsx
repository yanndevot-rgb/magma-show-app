import { useEffect, useState } from "react";
import "./App.css";

const API_URL =
  "https://script.google.com/macros/s/AKfycbwbz7GTq3ar7E_74SWoqZX2X12AfdnDII1wtkNsnLhxkMfRDCcuDxfagJK9kvSoIAGMNA/exec?action=getAll";

const FILES_API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [prestations, setPrestations] = useState([]);
  const [selectedPrestation, setSelectedPrestation] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fullScreen, setFullScreen] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(API_URL);
      const json = await res.json();

      setData(json);

      const presRes = await fetch(
        `${FILES_API}?action=getPrestations`
      );

      if (presRes.ok) {
        const presJson = await presRes.json();
        setPrestations(presJson);
      }
    } catch (err) {
      setError("Erreur de chargement : " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function openPrestation(folderId) {
    try {
      const url = `${FILES_API}?action=getFiles&show=${folderId}`;
      const res = await fetch(url);
      const json = await res.json();

      setFiles(Array.isArray(json) ? json : []);
      setSelectedPrestation(folderId);

    } catch (err) {
      console.error(err);
    }
  }

  // =========================
  // NOUVEAU : DOWNLOAD MP3
  // =========================
  const downloadMP3 = (file) => {
    try {
      if (!file || !file.url) return;

      const fileId = file.url.split("/file/d/")[1].split("/")[0];

      const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

      const a = document.createElement("a");
      a.href = downloadUrl;
      a.target = "_blank";
      a.download = file.name || "audio.mp3";
      document.body.appendChild(a);
      a.click();
      a.remove();

    } catch (err) {
      console.error("MP3 download error", err);
    }
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logoBlock">
          <img
            src="/logo-magma.png"
            alt="Magma Show"
            className="logoImage"
          />
        </div>

        <nav className="nav">
          <button
            className="navBtn active"
            onClick={() => {
              setSelectedPrestation(null);
              setFiles([]);
            }}
          >
            Spectacles
          </button>
        </nav>

        <button className="refreshBtn" onClick={fetchData}>
          Rafraîchir
        </button>
      </aside>

      <main className="content">
        {loading && <div>Chargement...</div>}
        {error && <div>{error}</div>}

        {!loading && !error && (
          <>
            {selectedPrestation ? (
              <section className="panel fullPanel">

                <button
                  className="backBtn"
                  onClick={() => {
                    setSelectedPrestation(null);
                    setFiles([]);
                  }}
                >
                  ← Retour
                </button>

                <h2>{selectedPrestation}</h2>

                {selectedFile && (
                  <div className="panel">
                    <h3>{selectedFile.name}</h3>
                  </div>
                )}

                {files.length === 0 ? (
                  <p>Aucun fichier trouvé</p>
                ) : (
                  files.map((file, i) => (
                    <div
                      key={i}
                      className="songCard"
                      onClick={() => setSelectedFile(file)}
                      style={{
                        cursor: "pointer",
                        marginBottom: "10px"
                      }}
                    >
                      <div className="songTitle">
                        {file.name}
                      </div>

                      {/* ===================== */}
                      {/* BOUTON MP3 AJOUTÉ */}
                      {/* ===================== */}
                      {file.mime && file.mime.includes("audio") && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            downloadMP3(file);
                          }}
                          style={{
                            marginTop: "8px",
                            padding: "6px 12px",
                            background: "#d4af37",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer"
                          }}
                        >
                          🎧 MP3
                        </button>
                      )}
                    </div>
                  ))
                )}

              </section>
            ) : (
              <section className="panel fullPanel">
                <h2>Liste des spectacles</h2>

                {prestations.length === 0 ? (
                  <p>Aucun spectacle trouvé</p>
                ) : (
                  prestations.map((item, i) => (
                    <div
                      key={i}
                      className="songCard"
                      onClick={() => openPrestation(item.name)}
                      style={{ cursor: "pointer", marginBottom: "12px" }}
                    >
                      🎭 {item.name}
                    </div>
                  ))
                )}
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;