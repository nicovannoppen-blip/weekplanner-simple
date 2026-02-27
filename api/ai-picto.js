export default function handler(req, res) {
  const { text } = req.query;

  if (!text) return res.status(400).json({ error: "No text" });

  const lower = text.toLowerCase();

  let icon = "algemeen";

  if (lower.includes("school") || lower.includes("les")) icon = "school";
  else if (lower.includes("voetbal") || lower.includes("sport")) icon = "sport";
  else if (lower.includes("dokter") || lower.includes("tandarts")) icon = "dokter";
  else if (lower.includes("verjaardag")) icon = "verjaardag";
  else if (lower.includes("werk") || lower.includes("meeting")) icon = "werk";

  res.json({ icon });
}
