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

  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Access-Control-Allow-Origin", "*");

  response.body.pipe(res);
}