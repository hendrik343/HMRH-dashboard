// api/hub.js — Consolidated endpoint for the Documentation Hub section.
// Returns everything the UI needs in ONE call to minimize roundtrips.
//
// Response shape:
//   { stats, modelos, submissoes, atividade, generated_at }
//
// Reads from 3 tabs:
//   - Modelos              (you maintain this — list of available templates)
//   - Documentos_Submetidos (already exists — workers' filled uploads)
//   - Downloads_Log        (new tab — append-only download events)

import { readTab } from "./_google.js";

export const config = { api: { bodyParser: true } };

function safeReadTab(name) {
  return readTab(name).catch(() => []);
}

function toNumber(v, fallback = 0) {
  if (v == null || v === "") return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function lastNonEmpty(rows, key) {
  for (let i = rows.length - 1; i >= 0; i--) {
    if (rows[i][key]) return rows[i][key];
  }
  return null;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    // Parallel reads — much faster than sequential.
    const [modelos, submissoes, downloads] = await Promise.all([
      safeReadTab("Modelos"),
      safeReadTab("Documentos_Submetidos"),
      safeReadTab("Downloads_Log"),
    ]);

    // ----- STATS -----
    const modelos_activos = modelos.filter(
      (m) => String(m.estado || "").toUpperCase() === "ACTIVO" ||
             String(m.estado || "").toUpperCase() === "NOVO"
    );
    const uploads_pendentes = submissoes.filter(
      (s) => String(s.status || "PENDENTE").toUpperCase() === "PENDENTE"
    );
    const uploads_aprovados = submissoes.filter(
      (s) => String(s.status || "").toUpperCase() === "APROVADO"
    );

    const ultimoUpload = submissoes.length > 0
      ? submissoes[submissoes.length - 1]
      : null;
    const ultimoDownload = downloads.length > 0
      ? downloads[downloads.length - 1]
      : null;

    const totalDownloadsMes = downloads.filter((d) => {
      const t = d.timestamp || "";
      const monthPrefix = new Date().toISOString().slice(0, 7);
      return t.startsWith(monthPrefix);
    }).length;

    const totalUploadsMes = submissoes.filter((s) => {
      const t = s.data_upload || "";
      const monthPrefix = new Date().toISOString().slice(0, 7);
      return t.startsWith(monthPrefix);
    }).length;

    const taxaConclusao = submissoes.length > 0
      ? Math.round((uploads_aprovados.length / submissoes.length) * 100)
      : 0;

    const stats = {
      total_documentos: modelos.length,
      modelos_activos: modelos_activos.length,
      uploads_pendentes: uploads_pendentes.length,
      uploads_aprovados_mes: uploads_aprovados.length,
      total_downloads_mes: totalDownloadsMes,
      total_uploads_mes: totalUploadsMes,
      taxa_conclusao: taxaConclusao,
      drive_sincronizado: true,
      ultimo_upload: ultimoUpload ? {
        when: ultimoUpload.data_upload,
        autor: ultimoUpload.autor,
        nome: ultimoUpload.nome_original,
      } : null,
      ultimo_download: ultimoDownload ? {
        when: ultimoDownload.timestamp,
        autor: ultimoDownload.autor,
        nome: ultimoDownload.modelo_nome,
      } : null,
    };

    // ----- MODELOS (normalized for the table) -----
    const modelosNorm = modelos.map((m) => ({
      id: m.id || "",
      nome: m.nome || "",
      categoria: m.categoria || "",
      tipo: m.tipo || "",
      versao: m.versao || "v1.0",
      tamanho: m.tamanho || "",
      estado: (m.estado || "ACTIVO").toUpperCase(),
      drive_url: m.drive_url || "",
      data_actualizado: m.data_actualizado || "",
      downloads: toNumber(m.downloads, 0),
    }));

    // ----- SUBMISSÕES (normalized, newest first) -----
    const submissoesNorm = submissoes.map((s) => ({
      id: toNumber(s.id, 0),
      data_upload: s.data_upload || "",
      tipo_formulario: s.tipo_formulario || "",
      mes_referente: s.mes_referente || "",
      autor: s.autor || "",
      blob_url: s.blob_url || "",
      nome_original: s.nome_original || "",
      observacoes: s.observacoes || "",
      status: String(s.status || "PENDENTE").toUpperCase(),
    })).sort((a, b) => (b.data_upload || "").localeCompare(a.data_upload || ""));

    // ----- ATIVIDADE (combined feed of recent uploads + downloads) -----
    const recentUploads = submissoes.slice(-25).map((s) => ({
      tipo: "upload",
      timestamp: s.data_upload || "",
      actor: s.autor || "?",
      subject: s.nome_original || s.tipo_formulario || "ficheiro",
      status: String(s.status || "PENDENTE").toUpperCase(),
      ref: s.tipo_formulario || "",
    }));
    const recentDownloads = downloads.slice(-25).map((d) => ({
      tipo: "download",
      timestamp: d.timestamp || "",
      actor: d.autor || "anónimo",
      subject: d.modelo_nome || "modelo",
      status: "DOWNLOAD",
      ref: d.modelo_id || "",
    }));
    const atividade = [...recentUploads, ...recentDownloads]
      .sort((a, b) => (b.timestamp || "").localeCompare(a.timestamp || ""))
      .slice(0, 30);

    return res.status(200).json({
      stats,
      modelos: modelosNorm,
      submissoes: submissoesNorm,
      atividade,
      generated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error("/api/hub error:", err);
    return res.status(500).json({ error: err.message });
  }
}
