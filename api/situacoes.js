// api/situacoes.js
//   GET  → returns all situações from the Sheet
//   POST → accepts multipart form (titulo, responsavel, prazo, notas, photos[])
//          and creates: a Drive subfolder + photo uploads + a new row in Situacoes_HSE

import {
  readTab, appendRow, uploadFile, ensureSubfolder, listFolderImages,
  ROOT_FOLDER_ID, rateLimit, getClientIp,
} from "./_google.js";
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
      const enriched = await Promise.all(rows.map(async (r) => {
        if (r.drive_folder_id && r.drive_folder_id.length > 5) {
          try {
            const photos = await listFolderImages(r.drive_folder_id);
            return { ...r, photos };
          } catch {
            return { ...r, photos: [] };
          }
        }
        return { ...r, photos: [] };
      }));
      return res.status(200).json({ data: enriched });
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

    const folderName = `Sit_${String(nextId).padStart(3, "0")}_${slug(titulo)}`;
    const folderId = await ensureSubfolder(folderName, ROOT_FOLDER_ID);

    const photoUrls = [];
    for (const f of photoFiles) {
      if (!f) continue;
      const buf = fs.readFileSync(f.filepath);
      const safeName = `${Date.now()}_${slug(f.originalFilename || "foto")}.jpg`;
      const uploaded = await uploadFile(buf, safeName, f.mimetype, folderId);
      photoUrls.push(uploaded.webViewLink);
    }

    // Column order in Situacoes_HSE:
    // id | data_abertura | titulo | status | responsavel | prazo | drive_folder_id | fotos_urls
    const today = new Date().toISOString().slice(0, 10);
    await appendRow("Situacoes_HSE", [
      nextId, today, titulo, "Aberto", responsavel,
      prazo || "", folderId, photoUrls.join(", "),
    ]);

    return res.status(200).json({
      ok: true, id: nextId, folderId,
      message: "Situação registada com sucesso.",
    });
  } catch (err) {
    console.error("POST /api/situacoes error:", err);
    return res.status(500).json({ error: err.message || "Erro interno." });
  }
}
