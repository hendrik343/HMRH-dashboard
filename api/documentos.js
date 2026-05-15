// api/documentos.js — GET list of files in the Drive folder.

import { drive, ROOT_FOLDER_ID } from "./_google.js";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const r = await drive().files.list({
      q: `'${ROOT_FOLDER_ID}' in parents and trashed=false`,
      fields: "files(id,name,mimeType,modifiedTime,webViewLink,iconLink)",
      orderBy: "name",
      pageSize: 200,
    });
    res.setHeader("Cache-Control", "s-maxage=1800, stale-while-revalidate=600");
    return res.status(200).json({ files: r.data.files || [] });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
