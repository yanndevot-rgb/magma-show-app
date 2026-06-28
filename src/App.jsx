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



  useEffect(() => {
    fetchData();
    
  }, []);

  async function openPrestation(folderId) {

  console.log("FOLDER =", folderId);

  try {
    const url =
      `${FILES_API}?action=getFiles&show=${folderId}`;

    console.log("URL =", url);

    const res = await fetch(url);

    console.log("STATUS =", res.status);

    const json = await res.json();

    console.log("FICHIERS =", json);

    setFiles(Array.isArray(json) ? json : []);
    // setSelectedShow(folderId);
setSelectedPrestation(folderId);

  } catch (err) {
    console.error("ERREUR =", err);
  }
}

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
  console.log("PRESTATIONS =", presJson);
  setPrestations(presJson);
}
  } catch (err) {
    setError("Erreur de chargement : " + err.message);
  } finally {
    setLoading(false);
  }
}
  

  

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logoBlock">
          <div className="logoCircle">MS</div>
          <div>
            <h1>Magma Show</h1>
            <p>Paris</p>
          </div>
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
        {loading && <div className="stateBox">Chargement...</div>}
        {error && !loading && <div className="stateBox error">{error}</div>}

        {!loading && !error && (
           
  <>
    {selectedPrestation ? (

      <section className="panel fullPanel">

        <button
          onClick={() => {
            setSelectedPrestation(null);
            setFiles([]);
          }}
          style={{ marginBottom: "20px" }}
        >
          ← Retour à la liste
        </button>

        <h2>{selectedPrestation}</h2>

        <h3>Documents et fichiers</h3>

        {files.length === 0 ? (
          <p>Aucun fichier trouvé</p>
        ) : (
          files.map((file, i) => (
            <div
              key={i}
              className="songCard"
              onClick={() => window.open(file.url, "_blank")}
              style={{
                cursor: "pointer",
                marginBottom: "10px"
              }}
            >
              <div className="songTitle">
                {file.name}
              </div>
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
          <div className="cardsColumn">
            {prestations.map((item, i) => (
              <div
                key={i}
                className="songCard"
                onClick={() => openPrestation(item.name)}
                style={{
                  cursor: "pointer",
                  marginBottom: "12px"
                }}
              >
                <div className="songBody">
                  <div className="songTitle">
                    🎭 {item.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
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