// api/_google.js — Authenticated Google Sheets + Drive clients.
// Files starting with "_" inside api/ are private helpers, not deployed as endpoints.

import { google } from "googleapis";
import { Readable } from "stream";

let cachedAuth = null;

function getAuth() {
  if (cachedAuth) return cachedAuth;

  const email = process.env.GOOGLE_CLIENT_EMAIL;
  let key = process.env.GOOGLE_PRIVATE_KEY;
  if (!email || !key) {
    throw new Error("Missing GOOGLE_CLIENT_EMAIL or GOOGLE_PRIVATE_KEY");
  }
  // Vercel stores newlines as literal \n; convert them back.
  key = key.replace(/\\n/g, "\n");

  cachedAuth = new google.auth.JWT({
    email,
    key,
    scopes: [
      "https://www.googleapis.com/auth/spreadsheets",
      "https://www.googleapis.com/auth/drive",
    ],
  });
  return cachedAuth;
}

export function sheets() {
  return google.sheets({ version: "v4", auth: getAuth() });
}

export function drive() {
  return google.drive({ version: "v3", auth: getAuth() });
}

export const SHEETS_ID = process.env.GOOGLE_SHEET_ID;
export const ROOT_FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;

/** Read a whole tab as an array of objects, using row 1 as the header row. */
export async function readTab(tabName) {
  const res = await sheets().spreadsheets.values.get({
    spreadsheetId: SHEETS_ID,
    range: `${tabName}!A1:ZZ`,
  });
  const rows = res.data.values || [];
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map((row) => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i] ?? ""; });
    return obj;
  });
}

/** Append one row to a tab. Values must be in the same order as the headers. */
export async function appendRow(tabName, values) {
  await sheets().spreadsheets.values.append({
    spreadsheetId: SHEETS_ID,
    range: `${tabName}!A:A`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [values] },
  });
}

/** Find or create a subfolder. */
export async function ensureSubfolder(name, parentId) {
  const d = drive();
  const safe = name.replace(/'/g, "\\'");
  const q = `name='${safe}' and '${parentId}' in parents ` +
            `and mimeType='application/vnd.google-apps.folder' and trashed=false`;
  const list = await d.files.list({ q, fields: "files(id,name)", pageSize: 1 });
  if (list.data.files && list.data.files.length > 0) {
    return list.data.files[0].id;
  }
  const created = await d.files.create({
    requestBody: {
      name,
      mimeType: "application/vnd.google-apps.folder",
      parents: [parentId],
    },
    fields: "id",
  });
  return created.data.id;
}

/** Upload a buffer to Drive and make it readable by anyone with the link. */
export async function uploadFile(buffer, filename, mimeType, parentFolderId) {
  const d = drive();
  const created = await d.files.create({
    requestBody: { name: filename, parents: [parentFolderId] },
    media: { mimeType, body: Readable.from(buffer) },
    fields: "id, webViewLink, webContentLink",
  });
  const fileId = created.data.id;
  await d.permissions.create({
    fileId,
    requestBody: { role: "reader", type: "anyone" },
  });
  return {
    id: fileId,
    webViewLink: created.data.webViewLink || `https://drive.google.com/file/d/${fileId}/view`,
  };
}

export async function listFolderImages(folderId) {
  const res = await drive().files.list({
    q: `'${folderId}' in parents and trashed=false and mimeType contains 'image/'`,
    fields: "files(id,name,mimeType,webViewLink,thumbnailLink)",
    pageSize: 50,
  });
  return res.data.files || [];
}

/** Simple in-memory rate limit per IP. */
const hits = new Map();
export function rateLimit(ip, max = 10, windowMs = 60 * 60 * 1000) {
  const now = Date.now();
  const rec = hits.get(ip);
  if (!rec || rec.reset < now) {
    hits.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  if (rec.count >= max) return false;
  rec.count++;
  return true;
}

export function getClientIp(req) {
  const xff = req.headers["x-forwarded-for"];
  if (xff) return String(xff).split(",")[0].trim();
  return req.headers["x-real-ip"] || "unknown";
}
