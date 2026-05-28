// api/_notify.js — Shared email notification helper.
// Files starting with "_" inside api/ are private — not deployed as endpoints.
//
// Uses Resend's HTTP API. Keep all credentials server-side in Vercel env vars.
//
// Required env vars:
//   RESEND_API_KEY     — Resend API key
//   EMAIL_NOTIFY_TO    — destination email address
//   EMAIL_NOTIFY_FROM  — verified sender, e.g. "VAMED HSE <notifications@domain.com>"
//
// Optional env var:
//   GOOGLE_SHEET_URL        — full URL to your Google Sheet (used in the message link)

const RESEND_API_KEY = process.env.RESEND_API_KEY;
const EMAIL_TO = process.env.EMAIL_NOTIFY_TO;
const EMAIL_FROM = process.env.EMAIL_NOTIFY_FROM;
const SHEETURL = process.env.GOOGLE_SHEET_URL ||
                 "https://docs.google.com/spreadsheets/d/" + (process.env.GOOGLE_SHEET_ID || "") + "/edit";

function formatDateTime(value) {
  const date = value ? new Date(value) : new Date();
  if (Number.isNaN(date.getTime())) return String(value || "");
  return new Intl.DateTimeFormat("pt-PT", {
    timeZone: "Africa/Luanda",
    dateStyle: "short",
    timeStyle: "medium",
  }).format(date);
}

/**
 * Send an email notification via Resend.
 * Never throws — returns { ok: true } or { ok: false, reason }.
 * Designed to be fire-and-forget so it doesn't slow down or fail the upload.
 */
export async function sendEmail(subject, text) {
  if (!RESEND_API_KEY || !EMAIL_TO || !EMAIL_FROM) {
    console.warn("[notify] RESEND_API_KEY / EMAIL_NOTIFY_TO / EMAIL_NOTIFY_FROM not set — skipping notification");
    return { ok: false, reason: "missing-env" };
  }

  try {
    // 4-second timeout — don't block the user's response
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 4000);
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      signal: ctrl.signal,
      headers: {
        "Authorization": `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
        "User-Agent": "vamed-hse-dashboard/1.0",
      },
      body: JSON.stringify({
        from: EMAIL_FROM,
        to: EMAIL_TO.split(",").map((email) => email.trim()).filter(Boolean),
        subject: subject || "VAMED HSE — Notificação",
        text,
      }),
    });
    clearTimeout(t);

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.warn("[notify] Email HTTP", res.status, body.slice(0, 240));
      return { ok: false, reason: "http-" + res.status };
    }

    return { ok: true };
  } catch (err) {
    console.warn("[notify] Email error:", err.message);
    return { ok: false, reason: err.message };
  }
}

/** Format a Situação HSE notification. */
export function formatSituacaoMsg(p) {
  const lines = [
    "🟢 *NOVA SITUAÇÃO HSE*",
    "",
    "📋 " + (p.titulo || "—"),
    "👤 " + (p.responsavel || "anónimo"),
    "📅 " + (p.dataHora || formatDateTime(p.timestamp || p.data)),
  ];
  if (p.prazo) lines.push("⏰ Prazo: " + p.prazo);
  if (p.notas) lines.push("📝 " + p.notas);
  if (p.photoCount) lines.push("📸 " + p.photoCount + " foto(s)");
  lines.push("");
  lines.push("Sheet: " + SHEETURL);
  return lines.join("\n");
}

/** Format a Documento Submetido (filled form) notification. */
export function formatDocumentoMsg(p) {
  const lines = [
    "📤 *FORMULÁRIO PREENCHIDO*",
    "",
    "📋 " + (p.tipo || "—"),
    "👤 " + (p.autor || "anónimo"),
    "📅 " + (p.dataHora || formatDateTime(p.timestamp)),
    "🗓 Mês: " + (p.mes || "—"),
  ];
  if (p.observacoes) lines.push("📝 " + p.observacoes);
  if (p.blobUrl) lines.push("📎 Ficheiro: " + p.blobUrl);
  lines.push("");
  lines.push("Sheet: " + SHEETURL);
  return lines.join("\n");
}

/** Format a physical license upload/update notification. */
export function formatLicencaMsg(p) {
  const action = p.mode === "insert" ? "NOVA LICENÇA HSE" : "LICENÇA HSE ACTUALIZADA";
  const lines = [
    "📑 *" + action + "*",
    "",
    "🏥 Site: " + (p.siteLabel || p.site || "—"),
    "📋 Licença: " + (p.nome || "—"),
    "👤 Autor: " + (p.autor || "Admin dashboard"),
    "📅 " + (p.dataHora || formatDateTime(p.timestamp)),
  ];
  if (p.dataEmissao) lines.push("🟢 Emissão: " + p.dataEmissao);
  if (p.dataExpira) lines.push("🔴 Expiração: " + p.dataExpira);
  if (p.fileName) lines.push("📎 Ficheiro: " + p.fileName);
  if (p.fileUrl) lines.push("🔗 Link: " + p.fileUrl);
  if (p.observacoes) lines.push("📝 " + p.observacoes);
  lines.push("");
  lines.push("Sheet: " + SHEETURL);
  return lines.join("\n");
}

/** Format a document download notification. */
export function formatDownloadMsg(p) {
  const lines = [
    "⬇️ *DOCUMENTO DESCARREGADO*",
    "",
    "📋 " + (p.documento || "—"),
    "👤 " + (p.autor || "anónimo"),
    "📅 " + (p.dataHora || formatDateTime(p.timestamp)),
  ];
  if (p.site) lines.push("🏥 Site: " + p.site);
  if (p.documentUrl) lines.push("🔗 Ficheiro: " + p.documentUrl);
  if (p.pageUrl) lines.push("📍 Dashboard: " + p.pageUrl);
  lines.push("");
  lines.push("Sheet: " + SHEETURL);
  return lines.join("\n");
}
