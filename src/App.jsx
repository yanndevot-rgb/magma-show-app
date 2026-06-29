import { useEffect, useState } from "react";

const API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

export default function App() {
  const [prestations, setPrestations] = useState([]);
  const [files, setFiles] = useState([]);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    loadPrestations();
  }, []);

  async function loadPrestations() {
    const res = await fetch(`${API}?action=getPrestations`);
    const json = await res.json();
    setPrestations(Array.isArray(json) ? json : []);
  }

  async function openPrestation(name) {
    const res = await fetch(
      `${API}?action=getFiles&show=${encodeURIComponent(name)}`
    );

    const json = await res.json();

    setFiles(Array.isArray(json) ? json : []);
    setCurrent(null);
  }

  function getMp3Url(url) {
    try {
      const id = url.split("/d/")[1].split("/")[0];
      return `https://drive.google.com/uc?export=download&id=${id}`;
    } catch {
      return url;
    }
  }

  return (
    <div style={{ padding: 20, background: "#0b0716", minHeight: "100vh", color: "white" }}>

      <h2>MAGMA SHOW</h2>

      {/* LISTE SPECTACLES */}
      {!files.length && (
        <>
          {prestations.map((p, i) => (
            <div
              key={i}
              onClick={() => openPrestation(p.name)}
              style={{ padding: 10, cursor: "pointer" }}
            >
              🎭 {p.name}
            </div>
          ))}
        </>
      )}

      {/* LISTE MP3 */}
      {files.length > 0 && (
        <>
          <button onClick={() => setFiles([])}>← Retour</button>

          {files
            .filter(f => f.name?.toLowerCase().includes(".mp3"))
            .map((f, i) => (
              <div key={i} style={{ marginBottom: 15 }}>
                <div>{f.name}</div>

                <audio controls style={{ width: "100%" }}>
                  <source src={getMp3Url(f.url)} />
                </audio>
              </div>
            ))}
        </>
      )}
    </div>
  );
}