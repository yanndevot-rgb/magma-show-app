import { useEffect, useState } from "react";

const API =
  "https://script.google.com/macros/s/AKfycbwhoChGw1YqSJAubp1_XKUsGz_1Q4qKqlvfN3hLFoO1xMG8m4gJOeggyn3VOyHrTpBrYg/exec";

export default function App() {
  const [files, setFiles] = useState([]);
  const [current, setCurrent] = useState(null);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    const res = await fetch(`${API}?action=getFiles&show=ALL`);
    const json = await res.json();
    setFiles(Array.isArray(json) ? json : []);
  }

  function isMp3(name = "") {
    return name.toLowerCase().includes(".mp3");
  }

  function getDirectDrive(url = "") {
    try {
      const id = url.split("/d/")[1].split("/")[0];
      return `https://drive.google.com/uc?export=download&id=${id}`;
    } catch {
      return url;
    }
  }

  return (
    <div style={{ background: "#0b0716", minHeight: "100vh", color: "white", padding: 20 }}>

      <h2>MP3 LIST</h2>

      {/* PLAYER SIMPLE */}
      {current && (
        <div style={{
          background: "#1a1430",
          padding: 20,
          borderRadius: 10,
          marginBottom: 20
        }}>
          <h3>{current.name}</h3>

          <audio controls autoPlay style={{ width: "100%" }}>
            <source src={getDirectDrive(current.url)} />
          </audio>

          <button onClick={() => setCurrent(null)}>
            Fermer
          </button>
        </div>
      )}

      {/* LISTE MP3 */}
      {files
        .filter(f => isMp3(f.name))
        .map((f, i) => (
          <div
            key={i}
            onClick={() => setCurrent(f)}
            style={{
              padding: 10,
              marginBottom: 8,
              background: "#1a1430",
              cursor: "pointer",
              borderRadius: 8
            }}
          >
            🎵 {f.name}
          </div>
        ))}
    </div>
  );
}