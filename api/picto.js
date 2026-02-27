export default async function handler(req, res) {
  const { q } = req.query;

  if (!q) return res.status(400).json({ error: "No query" });

  const url = `https://www.sclera.be/resources/picto/${q}.png`;

  res.redirect(url);
}
