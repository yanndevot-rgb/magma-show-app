
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
        {loading && <div className="stateBox">Chargement...</div>}
        {error && !loading && <div className="stateBox error">{error}</div>}

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
  ← Retour à la liste
</button>
        <h2
  style={{
    textAlign: "center",
    color: "#d4af37",
    fontSize: "70px",
    fontFamily: "Cinzel, serif",
    marginBottom: "10px"
  }}
>
  {selectedPrestation}
</h2>

<h3
  style={{
    textAlign: "center",
    color: "#d4af37",
    marginBottom: "30px"
  }}
  
>
  📂 Documents et fichiers
</h3>
{fullScreen && selectedFile && (

  <div
    style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      background: "#0b0517",
      zIndex: 99999,
      overflow: "auto",
      padding: "15px"
    }}
  >

    <button
      className="backBtn"
      style={{
  display: "block",
  marginBottom: "20px"
}}
      onClick={() => {
  setFullScreen(false);
  setSelectedFile(null);
}}
    >
      ✕ Fermer
    </button>
    <h2
  style={{
    color: "#d4af37",
    textAlign: "center"
  }}
>
  {selectedFile.name}
</h2>

{selectedFile.mime?.includes("audio") ? (

  <iframe
    src={`https://drive.google.com/file/d/${selectedFile.fileId}/preview`}
    width="100%"
    height="300"
    allow="autoplay"
    style={{
      border: "none",
      borderRadius: "15px"
    }}
  />

) : selectedFile.mime?.includes("video") ? (

  <iframe
    src={`https://drive.google.com/file/d/${selectedFile.fileId}/preview`}
    width="100%"
    height="900"
    allow="autoplay"
    style={{
      border: "none",
      borderRadius: "15px"
    }}
  />

) : selectedFile.mime?.includes("image") ? (

  <iframe
    src={`https://drive.google.com/file/d/${selectedFile.fileId}/preview`}
    width="100%"
    height="900"
    style={{
      border: "none",
      borderRadius: "15px"
    }}
  />

) : (

  <iframe
    src={`https://docs.google.com/document/d/${selectedFile.fileId}/preview`}
    width="100%"
    height="900"
    style={{
      border: "none",
      borderRadius: "15px"
    }}
  />

)}

  </div>

)}
{selectedFile && !fullScreen && (
  <div className="panel" style={{ marginBottom: "30px" }}>
   
    <h3>{selectedFile.name}</h3>

  {selectedFile.mime.includes("audio") ? (

  <>
    <div
      style={{
        position: "relative",
        background: "#191622",
        borderRadius: "20px",
        padding: "25px",
        overflow: "hidden",
        marginBottom: "20px"
      }}
    >
      <iframe
  src={`https://drive.google.com/file/d/${
    selectedFile.url.split("/file/d/")[1].split("/")[0]
  }/preview`}
  width="100%"
  height="220"
  allow="autoplay"
  style={{
    border: "none",
    display: "block"
  }}
/>

<div
  style={{
    position: "absolute",
    top: "20px",
    right: "20px",
    width: "120px",
    height: "120px",
    background: "#191622",
    zIndex: 999999
  }}
/>

      
    </div>

    <button
      className="backBtn"
      style={{
        marginTop: "15px",
        display: "block",
        marginLeft: "auto",
        marginRight: "auto"
      }}
      onClick={() => {
        const fileId =
          selectedFile.url.split("/file/d/")[1].split("/")[0];

        window.open(
          `https://drive.google.com/uc?export=download&id=${fileId}`,
          "_blank"
        );
      }}
    >
      ⬇ Télécharger le MP3
    </button>
  </>

) : selectedFile.mime.includes("video") ? (

  <>
    <div
      style={{
        position: "relative",
        background: "#191622",
        borderRadius: "20px",
        padding: "10px",
        marginBottom: "20px"
      }}
    >
      <iframe
        src={`https://drive.google.com/file/d/${selectedFile.fileId}/preview`}
        width="100%"
        height="500"
        style={{
          border: "none",
          borderRadius: "15px"
        }}
        allow="autoplay"
      />
    </div>

    <button
      className="backBtn"
      onClick={() =>
        window.open(selectedFile.downloadUrl, "_blank")
      }
    >
      ⬇ Télécharger la vidéo
    </button>
  </>

) : selectedFile.mime === "application/pdf" ? (

  <>
    <div
      style={{
        position: "relative",
        background: "#191622",
        borderRadius: "20px",
        padding: "10px",
        marginBottom: "20px"
      }}
    >
      <iframe
        src={`https://drive.google.com/file/d/${selectedFile.fileId}/preview`}
        width="100%"
        height="900"
        style={{
          border: "none",
          borderRadius: "15px"
        }}
      />
    </div>

    <button
      className="backBtn"
      onClick={() =>
        window.open(selectedFile.downloadUrl, "_blank")
      }
    >
      ⬇ Télécharger le PDF
    </button>
  </>
) : selectedFile.mime.includes("image") ? (

  <>
    <div
      style={{
        width: "100%",
        background: "#191622",
        borderRadius: "20px",
        padding: "10px",
        marginBottom: "20px"
      }}
    >
      <iframe
        src={`https://drive.google.com/file/d/${selectedFile.fileId}/preview`}
        width="100%"
        height="700"
        style={{
          border: "none",
          borderRadius: "15px"
        }}
      />
    </div>

    <button
      className="backBtn"
      onClick={() =>
        window.open(selectedFile.downloadUrl, "_blank")
      }
    >
      ⬇ Télécharger l'image
    </button>
  </>

) : selectedFile.mime === "application/pdf" ? (
  <>
    <div
      style={{
        position: "relative",
        background: "#191622",
        borderRadius: "20px",
        padding: "20px",
        marginBottom: "20px",
        overflow: "hidden"
      }}
    >
      <iframe
        src={`https://docs.google.com/document/d/${selectedFile.fileId}/preview`}
        width="100%"
        height="600"
        style={{
          border: "none",
          borderRadius: "15px"
        }}
      />

      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
          width: "80px",
          height: "1000px",
          background: "#191622",
          zIndex: 9999
        }}
      />
    </div>

    <button
      className="backBtn"
      onClick={() =>
        window.open(
          `https://docs.google.com/document/d/${selectedFile.fileId}/export?format=pdf`,
          "_blank"
        )
      }
    >
      ⬇ Télécharger le document
    </button>
  </>

) : selectedFile.mime ===
"application/vnd.google-apps.document" ? (

  <div
    style={{
      position: "relative",
      background: "#191622",
      borderRadius: "20px",
      padding: "20px",
      marginBottom: "20px",
      overflow: "hidden"
    }}
  >

    <iframe
      src={`https://docs.google.com/document/d/${selectedFile.fileId}/preview`}
      width="100%"
      height="1200"
      style={{
        border: "none",
        borderRadius: "15px"
      }}
    />

  </div>

) : (

  <button
    className="backBtn"
    onClick={() => window.open(selectedFile.url, "_blank")}
  >
    Ouvrir le document
  </button>

)}
  </div>
)}

{files.length === 0 ? (
  <p>Aucun fichier trouvé</p>
) : (
          files.map((file, i) => (
            <div
              key={i}
              className="songCard"
              onClick={() => {
  setSelectedFile(file);
  setFullScreen(true);

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}}
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