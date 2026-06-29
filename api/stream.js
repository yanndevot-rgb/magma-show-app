export default async function handler(req, res) {
  const { id } = req.query;

  if (!id) {
    return res.status(400).send("missing id");
  }

  const url = `https://drive.google.com/uc?export=download&id=${id}`;

  const response = await fetch(url);

  if (!response.ok) {
    return res.status(500).send("drive error");
  }

  res.setHeader("Content-Type", "audio/mpeg");
  res.setHeader("Access-Control-Allow-Origin", "*");

  // IMPORTANT: on pipe SANS buffer
  const reader = response.body.getReader();

  const stream = new ReadableStream({
    start(controller) {
      function push() {
        reader.read().then(({ done, value }) => {
          if (done) {
            controller.close();
            return;
          }
          controller.enqueue(value);
          push();
        });
      }
      push();
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Access-Control-Allow-Origin": "*",
    },
  });
}