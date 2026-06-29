import { useEffect, useState } from "react";

const API_URL =
  "https://script.google.com/macros/s/AKfycby13kgMgiryaUlTI9gyMJB54TIw36s-VjWyPauhDw7x0hmPKZHlUdIvYFCvNvpwWNru/exec";

export default function Application() {
  const [shows, setShows] = useState([]);
  const [currentShow, setCurrentShow] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    loadShows();
  }, []);

  async function loadShows() {
    try {
      setError("");

      const res = await fetch(API_URL + "?action=getPrestations");
      const json = await res.json();

      console.log("API SHOWS:", json);

      setShows(Array.isArray(json) ? json : json?.prestations || []);
    } catch (e) {
      setError("Erreur chargement spectacles");
    }
  }

  async function openShow(name) {
    try {
      const res = await fetch(
        API_URL + "?action=getFiles&show=" + encodeURIComponent(name)
      );

      const json = await res.json();

      console.log("FILES:", json);

      setFiles(Array.isArray(json) ? json : json?.files || []);
      setCurrentShow(name);
      setSelectedFile(null);
    } catch (e) {
      setError("Erreur chargement fichiers");
    }
  }

  function renderFile(file) {
    if (!file?.url) return <div>URL manquante</div>;

    const url = file.url;
    const name = (file.name || "").toLowerCase();

    // 🎵 AUDIO
    if (name.endsWith(".mp3")) {
      return <audio controls src={url} style={{ width: "100%" }} />;
    }

    // 🎬 VIDEO
    if (name.endsWith(".mp4") || name.endsWith(".mkv")) {
      return <video controls src={url} style={{ width: "100%" }} />;
    }

    // 📄 TEXTE / DOC / CONDUITE
    return (
      <iframe
        src={url}
        style={{ width: "100%", height: "600px", border: "none" }}
      />
    );
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>MAGMA SHOW</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* LISTE SPECTACLES */}
      {!currentShow && (
        <div>
          {shows.length === 0 && <p>Aucun spectacle</p>}

          {shows.map((s, i) => (
            <div
              key={i}
              onClick={() => openShow(s.name)}
              style={{
                padding: 10,
                cursor: "pointer",
                borderBottom: "1px solid #ccc",
              }}
            >
              🎭 {s.name}
            </div>
          ))}
        </div>
      )}

      {/* LISTE FICHIERS */}
      {currentShow && (
        <div>
          <button onClick={() => setCurrentShow(null)}>← Retour</button>

          <h3>{currentShow}</h3>

          {/* PREVIEW */}
          {selectedFile && (
            <div style={{ marginBottom: 20 }}>
              <h4>{selectedFile.name}</h4>
              {renderFile(selectedFile)}

              <button onClick={() => setSelectedFile(null)}>
                Fermer
              </button>
            </div>
          )}

          {/* FILE LIST */}
          {files.length === 0 && <p>Aucun fichier</p>}

          {files.map((f, i) => (
            <div
              key={i}
              onClick={() => setSelectedFile(f)}
              style={{
                padding: 10,
                cursor: "pointer",
                borderBottom: "1px solid #444",
              }}
            >
              {f.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}