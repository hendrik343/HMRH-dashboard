// api/documentos-submetidos.js
//   GET  → list all submitted completed forms (rows from Documentos_Submetidos tab)
//   POST → accepts a completed form upload. Saves to Vercel Blob + appends row.
//
// Workflow: worker downloads blank template → fills it in → uploads here.
// Different from situacoes.js because:
//   - Accepts DOCX, PDF, XLSX (not just images)
//   - Higher size cap (20 MB vs 8 MB)
//   - Stores in documentos/ folder structure in Blob
//   - Logs to Documentos_Submetidos tab (id, data, tipo, mes, autor, url, notas)

import {
  readTab, appendRow, rateLimit, getClientIp,
} from "./_google.js";
import { sendEmail as _notifySendEmail, formatDocumentoMsg } from "./_notify.js";
import { put } from "@vercel/blob";
import formidable from "formidable";
import fs from "fs";

export const config = { api: { bodyParser: false } };

const MAX_FILE_MB = 20;
const ALLOWED = [
  // DOCX
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/msword",
  // XLSX
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "application/vnd.ms-excel",
  // PDF
  "application/pdf",
];

// The 18 supported template types. Must match the dashboard dropdown.
// Keep these strings stable — they get stored in the Sheet's tipo_formulario column.
const TEMPLATE_TYPES = [
  "Checklist HSE mensal",
  "Checklist Inspecção Andaime",
  "Checklist Instalações Sociais",
  "Checklist Entrada Equipamentos",
  "Checklist Primeiros Socorros",
  "Checklist Ferramentas Eléctricas",
  "Lista AR e PES",
  "Reconhecimento Mensal HSE",
  "Verificação Mensal Extintores",
  "Verificação Mensal Quadros Eléctricos",
  "Relatório Mensal HSE",
  "Reunião Semanal HSE",
  "Registo de Formação",
  "Matriz de Perigos",
  "Plano de Verificações",
  "Alcoolemia — Controlo de Casos Positivos",
  "Mapa de Limpeza",
  "SEP HSE — Actividades de Engajamento",
  "Outro",
];

function slug(s) {
  return s.toLowerCase()
    .normalize("NFD").replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 40);
}

function ext(mimetype, originalName) {
  if (mimetype === "application/pdf") return "pdf";
  if (mimetype.includes("wordprocessingml") || mimetype === "application/msword") return "docx";
  if (mimetype.includes("spreadsheetml") || mimetype === "application/vnd.ms-excel") return "xlsx";
  // Fallback: take ext from original filename
  const m = (originalName || "").match(/\.([a-z0-9]+)$/i);
  return m ? m[1].toLowerCase() : "bin";
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const rows = await readTab("Documentos_Submetidos");
      return res.status(200).json({ data: rows, templateTypes: TEMPLATE_TYPES });
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
  if (!rateLimit(ip, 20)) {
    return res.status(429).json({ error: "Limite de submissões atingido. Tente daqui a 1 hora." });
  }

  const form = formidable({
    maxFileSize: MAX_FILE_MB * 1024 * 1024,
    multiples: false,
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
  const tipo_formulario = String(get("tipo_formulario")).trim();
  const mes_referente = String(get("mes_referente")).trim();
  const autor = String(get("autor")).trim();
  const observacoes = String(get("observacoes")).trim();

  if (!tipo_formulario || !TEMPLATE_TYPES.includes(tipo_formulario)) {
    return res.status(400).json({ error: "Tipo de formulário inválido." });
  }
  if (!mes_referente.match(/^\d{4}-\d{2}$/)) {
    return res.status(400).json({ error: "Mês inválido. Use o formato AAAA-MM (ex.: 2026-05)." });
  }
  if (!autor || autor.length < 2) {
    return res.status(400).json({ error: "Autor obrigatório (mínimo 2 caracteres)." });
  }

  const fileField = files.documento;
  const file = Array.isArray(fileField) ? fileField[0] : fileField;
  if (!file) {
    return res.status(400).json({ error: "Ficheiro obrigatório." });
  }
  if (!ALLOWED.includes(file.mimetype)) {
    return res.status(400).json({
      error: `Tipo de ficheiro não permitido (${file.mimetype}). Apenas DOCX, XLSX, PDF.`,
    });
  }

  try {
    // Determine next ID
    const existing = await readTab("Documentos_Submetidos");
    const nextId = existing.reduce((m, r) => Math.max(m, Number(r.id) || 0), 0) + 1;

    // Upload to Vercel Blob with organized path:
    //   documentos/<tipo_slug>/<mes>/<id>_<slug>.ext
    const tipoSlug = slug(tipo_formulario);
    const fileExt = ext(file.mimetype, file.originalFilename);
    const fileSlug = slug(file.originalFilename || tipo_formulario);
    const pathname = `documentos/${tipoSlug}/${mes_referente}/${String(nextId).padStart(4, "0")}_${fileSlug}.${fileExt}`;

    const buf = fs.readFileSync(file.filepath);
    const blob = await put(pathname, buf, {
      access: "public",
      contentType: file.mimetype,
    });

    // Column order in Documentos_Submetidos:
    // id | data_upload | tipo_formulario | mes_referente | autor | blob_url | nome_original | observacoes
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    await appendRow("Documentos_Submetidos", [
      nextId, today, tipo_formulario, mes_referente, autor,
      blob.url, file.originalFilename || "", observacoes,
    ]);

    // Fire-and-forget email notification (never blocks the response).
    const notifyText = formatDocumentoMsg({
      tipo: tipo_formulario,
      autor,
      mes: mes_referente,
      observacoes,
      blobUrl: blob.url,
      timestamp: now.toISOString(),
    });
    await _notifySendEmail("VAMED HSE — Formulário Preenchido", notifyText);

    return res.status(200).json({
      ok: true,
      id: nextId,
      url: blob.url,
      message: "Formulário submetido com sucesso.",
    });
  } catch (err) {
    console.error("POST /api/documentos-submetidos error:", err);
    return res.status(500).json({ error: err.message || "Erro interno." });
  }
}
