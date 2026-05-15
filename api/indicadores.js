// api/indicadores.js — GET monthly indicators from the Indicadores_Mensais tab.

import { readTab } from "./_google.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const rows = await readTab("Indicadores_Mensais");
    const data = rows.map((r) => {
      const out = {};
      for (const [k, v] of Object.entries(r)) {
        if (typeof v === "string" && v !== "" && !isNaN(Number(v))) {
          out[k] = Number(v);
        } else {
          out[k] = v;
        }
      }
      return out;
    });
    // Cache for 30 min at the edge to spare Google API quota.
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=600");
    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
