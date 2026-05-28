// api/licencas.js
// GET  -> returns the 9 HSE licenses for one site with computed status + file links.
// POST -> password-protected upsert. Accepts JSON metadata or multipart file upload.

import { readTab, appendRow, sheets, SHEETS_ID, rateLimit, getClientIp } from "./_google.js";
import { sendEmail as _notifySendEmail, formatLicencaMsg } from "./_notify.js";
import { put } from "@vercel/blob";
import formidable from "formidable";
import fs from "fs";

export const config = { api: { bodyParser: false } };

const TAB_NAME = "Licencas";
const ADMIN_PASSWORD = process.env.LICENCAS_ADMIN_PASSWORD || process.env.ADMIN_PASSWORD;
const HEADERS = [
  "id", "nome", "data_emissao", "data_expira", "drive_file_id", "observacoes",
  "site", "file_url", "file_name", "mime_type", "updated_at",
];
const SITE_CODES = new Set(["HMRH", "HMRL", "HMRC"]);
const SITE_LABELS = {
  HMRH: "Huambo",
  HMRL: "Luena",
  HMRC: "Cabinda",
};
const MAX_FILE_MB = 25;
const ALLOWED = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
];

const DEFAULT_LICENSES = [
  ["1", "Licença de Obra", "2024-03-15", "2027-08-30", "", ""],
  ["2", "Licença Ambiental", "2024-06-01", "2026-06-20", "", ""],
  ["3", "Licença de Tapume", "2024-02-10", "2026-04-10", "", ""],
  ["4", "Licença de Publicidade", "2025-01-05", "2027-01-05", "", ""],
  ["5", "Licença do Gerador", "2024-05-03", "2026-06-15", "", ""],
  ["6", "Certificado Bombeiros", "2024-01-25", "2027-01-25", "", ""],
  ["7", "Licença de furo de água", "2024-05-15", "2026-05-15", "", ""],
  ["8", "Licença de Areia", "2024-05-21", "2027-05-21", "", ""],
  ["9", "Licença de Brita", "2024-05-21", "2026-06-30", "", ""],
];

function slug(s) {
  return String(s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 60) || "licenca";
}

function toRowObject(values) {
  return Object.fromEntries(HEADERS.map((header, index) => [header, values[index] || ""]));
}

function fallbackRows(site = "") {
  return DEFAULT_LICENSES.map((values) => ({ ...toRowObject(values), site }));
}

function normalizeSite(value) {
  const raw = String(value || "HMRH").trim().toUpperCase();
  if (raw.includes("LUENA")) return "HMRL";
  if (raw.includes("CABINDA")) return "HMRC";
  if (raw.includes("HUAMBO")) return "HMRH";
  return SITE_CODES.has(raw) ? raw : "HMRH";
}

function daysUntil(isoDate) {
  if (!isoDate) return null;
  const target = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((target - today) / 86400000);
}

function computeStatus(dataExpira) {
  const days = daysUntil(dataExpira);
  if (days === null) return { estado: "sem_data", dias_restantes: null, cor: "grey" };
  if (days < 0) return { estado: "expirada", dias_restantes: days, cor: "red" };
  if (days < 30) return { estado: "critica", dias_restantes: days, cor: "red" };
  if (days < 60) return { estado: "a_expirar", dias_restantes: days, cor: "amber" };
  return { estado: "vigente", dias_restantes: days, cor: "green" };
}

function enrich(row, requestedSite = "") {
  const id = String(row.id || "").trim();
  const dataExpira = String(row.data_expira || "").trim();
  const fileUrl = String(row.file_url || row.drive_file_id || "").trim();
  return {
    id,
    nome: String(row.nome || "").trim(),
    data_emissao: String(row.data_emissao || "").trim(),
    data_expira: dataExpira,
    drive_file_id: String(row.drive_file_id || "").trim(),
    observacoes: String(row.observacoes || "").trim(),
    site: normalizeSite(row.site || requestedSite),
    file_url: fileUrl,
    file_name: String(row.file_name || "").trim(),
    mime_type: String(row.mime_type || "").trim(),
    updated_at: String(row.updated_at || "").trim(),
    has_file: Boolean(fileUrl),
    ...computeStatus(dataExpira),
  };
}

async function readRowsWithFallback(site) {
  const defaults = fallbackRows(site);
  try {
    const rows = await readTab(TAB_NAME);
    if (!rows.length) return { rows: defaults, source: "fallback" };
    const byId = new Map(defaults.map((row) => [String(row.id), row]));

    // Global rows from the older format apply to all sites.
    rows.forEach((row) => {
      if (String(row.site || "").trim()) return;
      const id = String(row.id || "").trim();
      if (!id) return;
      byId.set(id, { ...(byId.get(id) || {}), ...row, site });
    });

    // Site-specific rows override global/default rows.
    rows.forEach((row) => {
      if (normalizeSite(row.site) !== site || !String(row.site || "").trim()) return;
      const id = String(row.id || "").trim();
      if (!id) return;
      byId.set(id, { ...(byId.get(id) || {}), ...row, site });
    });

    return { rows: Array.from(byId.values()), source: "sheet" };
  } catch (err) {
    if (/Unable to parse range|not found|Requested entity was not found/i.test(err.message || "")) {
      return { rows: defaults, source: "fallback" };
    }
    throw err;
  }
}

async function ensureLicencasTab() {
  const s = sheets();
  const meta = await s.spreadsheets.get({
    spreadsheetId: SHEETS_ID,
    fields: "sheets.properties.title",
  });
  const exists = (meta.data.sheets || []).some((sheet) => sheet.properties?.title === TAB_NAME);
  if (!exists) {
    await s.spreadsheets.batchUpdate({
      spreadsheetId: SHEETS_ID,
      requestBody: { requests: [{ addSheet: { properties: { title: TAB_NAME } } }] },
    });
  }
  await s.spreadsheets.values.update({
    spreadsheetId: SHEETS_ID,
    range: `${TAB_NAME}!A1:K1`,
    valueInputOption: "RAW",
    requestBody: { values: [HEADERS] },
  });
}

function validateDate(value, field) {
  if (!value) return "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    throw new Error(`${field} inválida. Use AAAA-MM-DD.`);
  }
  return value;
}

function ext(mimetype, originalName) {
  if (mimetype === "application/pdf") return "pdf";
  if (mimetype === "image/jpeg") return "jpg";
  if (mimetype === "image/png") return "png";
  if (mimetype === "image/webp") return "webp";
  if (mimetype === "image/heic") return "heic";
  if (mimetype.includes("wordprocessingml") || mimetype === "application/msword") return "docx";
  if (mimetype.includes("spreadsheetml") || mimetype === "application/vnd.ms-excel") return "xlsx";
  const m = String(originalName || "").match(/\.([a-z0-9]+)$/i);
  return m ? m[1].toLowerCase() : "bin";
}

async function parseRequest(req) {
  const type = String(req.headers["content-type"] || "");
  if (type.includes("multipart/form-data")) {
    const form = formidable({
      maxFileSize: MAX_FILE_MB * 1024 * 1024,
      multiples: false,
      keepExtensions: true,
    });
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, f, fi) => err ? reject(err) : resolve([f, fi]));
    });
    const body = {};
    Object.keys(fields || {}).forEach((key) => {
      body[key] = Array.isArray(fields[key]) ? fields[key][0] : fields[key];
    });
    const fileField = files.ficheiro || files.file || files.licenca;
    return { body, file: Array.isArray(fileField) ? fileField[0] : fileField };
  }

  const chunks = [];
  for await (const chunk of req) chunks.push(chunk);
  const raw = Buffer.concat(chunks).toString("utf8").trim();
  return { body: raw ? JSON.parse(raw) : {}, file: null };
}

async function uploadLicenseFile(file, site, id, nome) {
  if (!file) return {};
  if (!ALLOWED.includes(file.mimetype)) {
    throw new Error(`Tipo de ficheiro não permitido (${file.mimetype}). Use PDF, imagem, DOCX ou XLSX.`);
  }
  const buf = fs.readFileSync(file.filepath);
  const original = file.originalFilename || `${nome}.${ext(file.mimetype, "")}`;
  const filename = `${Date.now()}_${slug(original)}.${ext(file.mimetype, original)}`;
  const pathname = `licencas/${site}/${String(id).padStart(2, "0")}_${slug(nome)}/${filename}`;
  const blob = await put(pathname, buf, {
    access: "public",
    contentType: file.mimetype,
  });
  return {
    file_url: blob.url,
    file_name: original,
    mime_type: file.mimetype,
  };
}

async function notifyLicenseSaved(mode, payload) {
  const notifyText = formatLicencaMsg({
    mode,
    site: payload.site,
    siteLabel: SITE_LABELS[payload.site] || payload.site,
    id: payload.id,
    nome: payload.nome,
    autor: payload.autor,
    dataEmissao: payload.dataEmissao,
    dataExpira: payload.dataExpira,
    observacoes: payload.observacoes,
    fileUrl: payload.fileUrl,
    fileName: payload.fileName,
    timestamp: payload.updatedAt,
  });
  await _notifySendEmail(
    mode === "insert" ? "VAMED HSE — Nova Licença HSE" : "VAMED HSE — Licença HSE Actualizada",
    notifyText,
  );
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const site = normalizeSite(req.query?.site);
      const { rows, source } = await readRowsWithFallback(site);
      const data = rows.map((row) => enrich(row, site)).sort((a, b) => Number(a.id) - Number(b.id));
      res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=60");
      return res.status(200).json({ data, source, site });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  }

  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  const ip = getClientIp(req);
  if (!rateLimit(ip, 60)) {
    return res.status(429).json({ error: "Limite atingido. Aguarde 1 hora." });
  }

  try {
    const { body, file } = await parseRequest(req);
    if (!ADMIN_PASSWORD) {
      return res.status(503).json({ error: "Password admin não configurada no servidor." });
    }
    if (String(body.password || "") !== ADMIN_PASSWORD) {
      return res.status(401).json({ error: "Password incorrecta." });
    }

    const site = normalizeSite(body.site);
    const id = String(body.id || "").trim();
    const nome = String(body.nome || "").trim();
    if (!id || !/^\d+$/.test(id)) return res.status(400).json({ error: "ID obrigatório entre 1 e 9." });
    if (!nome || nome.length < 3) return res.status(400).json({ error: "Nome da licença obrigatório." });

    const dataEmissao = validateDate(String(body.data_emissao || "").trim(), "data_emissao");
    const dataExpira = validateDate(String(body.data_expira || "").trim(), "data_expira");
    const observacoes = String(body.observacoes || "").trim();
    const autor = String(body.autor || body.responsavel || "").trim();
    const uploaded = await uploadLicenseFile(file, site, id, nome);
    const fileUrl = uploaded.file_url || String(body.file_url || body.drive_file_id || "").trim();
    const fileName = uploaded.file_name || String(body.file_name || "").trim();
    const mimeType = uploaded.mime_type || String(body.mime_type || "").trim();
    const updatedAt = new Date().toISOString();

    await ensureLicencasTab();
    const current = await readTab(TAB_NAME);
    const rowIndex = current.findIndex((row) => (
      String(row.id || "").trim() === id && normalizeSite(row.site) === site && String(row.site || "").trim()
    ));
    const values = [id, nome, dataEmissao, dataExpira, fileUrl, observacoes, site, fileUrl, fileName, mimeType, updatedAt];
    const saved = enrich(toRowObject(values), site);

    if (rowIndex >= 0) {
      const sheetRow = rowIndex + 2;
      await sheets().spreadsheets.values.update({
        spreadsheetId: SHEETS_ID,
        range: `${TAB_NAME}!A${sheetRow}:K${sheetRow}`,
        valueInputOption: "USER_ENTERED",
        requestBody: { values: [values] },
      });
      await notifyLicenseSaved("update", {
        site, id, nome, autor, dataEmissao, dataExpira, observacoes, fileUrl, fileName, updatedAt,
      });
      return res.status(200).json({ ok: true, mode: "update", data: saved });
    }

    await appendRow(TAB_NAME, values);
    await notifyLicenseSaved("insert", {
      site, id, nome, autor, dataEmissao, dataExpira, observacoes, fileUrl, fileName, updatedAt,
    });
    return res.status(200).json({ ok: true, mode: "insert", data: saved });
  } catch (err) {
    console.error("POST /api/licencas error:", err);
    return res.status(500).json({ error: err.message || "Erro interno." });
  }
}
