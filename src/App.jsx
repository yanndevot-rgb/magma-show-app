import { useEffect, useState } from "react";

const API =
  "https://script.google.com/macros/s/AKfycby13kgMgiryaUlTI9gyMJB54TIw36s-VjWyPauhDw7x0hmPKZHlUdIvYFCvNvpwWNru/exec";

function App() {
  const [shows, setShows] = useState([]);
  const [files, setFiles] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    fetch(API + "?action=getPrestations")
      .then(r => r.json())
      .then(setShows);
  }, []);

  function openShow(id) {
    fetch(API + "?action=getFiles&show=" + id)
      .then(r => r.json())
      .then(setFiles);
  }

  function getDirectAudio(url) {
    const match = url.match(/\/d\/([^/]+)/);
    const id = match?.[1];
    return id
      ? `https://drive.google.com/uc?export=download&id=${id}`
      : url;
  }

  function renderFile(f) {
    if (f.mime?.includes("audio")) {
      return (
        <audio controls src={getDirectAudio(f.url)} />
      );
    }

    if (f.mime?.includes("video")) {
      return (
        <video controls src={f.url} style={{ width: "100%" }} />
      );
    }

    if (f.mime?.includes("document") || f.mime?.includes("pdf")) {
      return (
        <iframe src={f.url} style={{ width: "100%", height: 500 }} />
      );
    }

    return <a href={f.url} target="_blank">Open</a>;
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>MAGMA SHOW</h2>

      {files.length === 0 ? (
        shows.map(s => (
          <div
            key={s.id}
            onClick={() => openShow(s.id)}
            style={{ padding: 10, cursor: "pointer" }}
          >
            {s.name}
          </div>
        ))
      ) : (
        <div>
          <button onClick={() => setFiles([])}>← Retour</button>

          {files.map((f, i) => (
            <div key={i} style={{ margin: 10 }}>
              <div>{f.name}</div>
              {renderFile(f)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;