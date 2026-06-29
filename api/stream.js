export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send("missing id");
  }

  const url = `https://drive.google.com/uc?export=download&id=${id}`;

  const response = await fetch(url);

  if (!response.ok) {
    return res.status(500).send("error fetching file");
  }

  const buffer = await response.arrayBuffer();

  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Cache-Control", "public, max-age=3600");

  return res.send(Buffer.from(buffer));
}