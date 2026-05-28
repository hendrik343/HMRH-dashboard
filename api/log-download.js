// api/log-download.js — Append a row to Downloads_Log every time a worker
// clicks the download button on a modelo. Called from the dashboard via
// navigator.sendBeacon() — fire-and-forget, doesn't slow down the download.

import { readTab, appendRow, rateLimit, getClientIp } from "./_google.js";
import { sendEmail as _notifySendEmail, formatDownloadMsg } from "./_notify.js";

export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = getClientIp(req);
  if (!rateLimit(ip, 200)) {
    // Don't fail loudly — downloads are best-effort logging.
    return res.status(200).json({ ok: false, throttled: true });
  }

  try {
    const body = req.body || {};
    const modelo_id = String(body.modelo_id || "").slice(0, 50);
    const modelo_nome = String(body.modelo_nome || "").slice(0, 200);
    const autor = String(body.autor || "anónimo").slice(0, 100);
    const documentUrl = String(body.document_url || "").slice(0, 500);
    const pageUrl = String(body.page_url || "").slice(0, 500);
    const site = String(body.site || "").slice(0, 80);

    if (!modelo_id || !modelo_nome) {
      return res.status(400).json({ error: "modelo_id e modelo_nome obrigatórios" });
    }

    // Determine next id
    const existing = await readTab("Downloads_Log");
    const nextId = existing.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) + 1;

    // Columns: id | timestamp | modelo_id | modelo_nome | autor
    const ts = new Date().toISOString();
    await appendRow("Downloads_Log", [nextId, ts, modelo_id, modelo_nome, autor]);

    // Fire-and-forget email notification after successful Sheet write.
    const notifyText = formatDownloadMsg({
      documento: modelo_nome,
      autor,
      timestamp: ts,
      site,
      documentUrl,
      pageUrl,
    });
    await _notifySendEmail("VAMED HSE — Documento Descarregado", notifyText);

    return res.status(200).json({ ok: true, id: nextId });
  } catch (err) {
    console.error("/api/log-download error:", err);
    // Don't bubble — never block a user's download because of logging.
    return res.status(200).json({ ok: false, error: err.message });
  }
}
