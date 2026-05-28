// api/situacoes.js
//   GET  → returns all situações from the Sheet
//   POST → accepts multipart form (titulo, responsavel, prazo, notas, photos[])
//          Photos go to Vercel Blob (permanent URLs). A new row gets appended
//          to Situacoes_HSE with the photo URLs in fotos_urls column.

import {
  readTab, appendRow, rateLimit, getClientIp,
} from "./_google.js";
import { sendEmail as _notifySendEmail, formatSituacaoMsg } from "./_notify.js";
import { put } from "@vercel/blob";
import formidable from "formidable";
import fs from "fs";

// IMPORTANT: tell Vercel not to pre-parse the body — formidable does it.
export const config = { api: { bodyParser: false } };

const MAX_FILE_MB = 8;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic"];

function slug(s) {
  return s.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const rows = await readTab("Situacoes_HSE");
      // Photos are URLs in fotos_urls column (comma-separated). Parse into array.
      const data = rows.map((r) => ({
        ...r,
        photos: (r.fotos_urls || "")
          .split(",")
          .map((u) => u.trim())
          .filter((u) => u.length > 0),
      }));
      return res.status(200).json({ data });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  // ----- POST -----
  const ip = getClientIp(req);
  if (!rateLimit(ip)) {
    return res.status(429).json({ error: "Limite de submissões atingido. Tente daqui a 1 hora." });
  }

  const form = formidable({
    maxFileSize: MAX_FILE_MB * 1024 * 1024,
    multiples: true,
    keepExtensions: true,
  });

  let fields, files;
  try {
    [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, f, fi) => err ? reject(err) : resolve([f, fi]));
    });
  } catch (err) {
    return res.status(400).json({ error: err.message });
  }

  const get = (k) => Array.isArray(fields[k]) ? fields[k][0] : (fields[k] || "");
  const titulo = String(get("titulo")).trim();
  const responsavel = String(get("responsavel")).trim();
  const prazo = String(get("prazo")).trim();
  const notas = String(get("notas")).trim();

  if (!titulo || titulo.length < 3) {
    return res.status(400).json({ error: "Título obrigatório (mínimo 3 caracteres)." });
  }
  if (titulo.length > 200) {
    return res.status(400).json({ error: "Título demasiado longo." });
  }

  let photoFiles = files.photos || [];
  if (!Array.isArray(photoFiles)) photoFiles = [photoFiles];

  for (const f of photoFiles) {
    if (f && !ALLOWED.includes(f.mimetype)) {
      return res.status(400).json({ error: `Tipo de ficheiro não permitido: ${f.mimetype}` });
    }
  }

  try {
    const existing = await readTab("Situacoes_HSE");
    const nextId = existing.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) + 1;

    // Upload photos to Vercel Blob (publicly readable URLs).
    const slugTitle = slug(titulo);
    const photoUrls = [];
    for (const f of photoFiles) {
      if (!f) continue;
      const buf = fs.readFileSync(f.filepath);
      const ext = (f.mimetype || "image/jpeg").split("/")[1] || "jpg";
      const pathname = `situacoes/sit_${String(nextId).padStart(3, "0")}_${slugTitle}/${Date.now()}_${slug(f.originalFilename || "foto")}.${ext}`;
      const blob = await put(pathname, buf, {
        access: "public",
        contentType: f.mimetype,
      });
      photoUrls.push(blob.url);
    }

    // Column order in Situacoes_HSE:
    // id | data_abertura | titulo | status | responsavel | prazo | drive_folder_id | fotos_urls
    // drive_folder_id is now unused (we kept the column for backwards compatibility).
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    await appendRow("Situacoes_HSE", [
      nextId, today, titulo, "Aberto", responsavel,
      prazo || "", "", photoUrls.join(", "),
    ]);

    // Fire-and-forget email notification (never blocks the response).
    const notifyText = formatSituacaoMsg({
      titulo, responsavel, prazo, notas,
      data: today,
      timestamp: now.toISOString(),
      photoCount: photoUrls.length,
    });
    await _notifySendEmail("VAMED HSE — Nova Situação HSE", notifyText);

    return res.status(200).json({
      ok: true,
      id: nextId,
      photoCount: photoUrls.length,
      photoUrls,
      message: "Situação registada com sucesso.",
    });
  } catch (err) {
    console.error("POST /api/situacoes error:", err);
    return res.status(500).json({ error: err.message || "Erro interno." });
  }
}
