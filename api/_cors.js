// api/_cors.js — Shared CORS helper.
// These endpoints have no auth/cookies (rate-limited by IP only), so they're
// safe to open to any origin. Needed because huambo/, cabinda/ and luena/
// now call this project's /api/* routes cross-origin from their own domains.
//
// Call applyCors(req, res) first in every handler. If it returns true, the
// request was an OPTIONS preflight and has already been answered — return
// immediately without doing any other work.

export function applyCors(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return true;
  }
  return false;
}
