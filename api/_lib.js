import { put, list } from '@vercel/blob';
import { SEED } from './_seed.js';
export const SITES = ['cabinda', 'huambo', 'luena'];
export const REQUIRED = ['headcount', 'acc', 'checklist', 'alcTests', 'alcPos', 'trainPart', 'envInc'];
export const OPTIONAL = ['hours', 'lostDays', 'ifq', 'warnings', 'trainActions', 'water', 'diesel', 'elec', 'waterAcc', 'dieselAcc', 'elecAcc'];
export function auth(req) {
  const pin = String(req.headers['x-pin'] || '').trim();
  if (!pin) return null;
  const e = process.env;
  if (e.PIN_ADMIN && pin === e.PIN_ADMIN) return { role: 'admin' };
  for (const s of SITES) { const v = e['PIN_' + s.toUpperCase()]; if (v && pin === v) return { role: 'site', site: s }; }
  if (e.PIN_VIEW && pin === e.PIN_VIEW) return { role: 'viewer' };
  return null;
}
const path = (site, month) => `records/${site}/${month}.json`;
const valid = r => r && r.kpi && 'checklist' in r.kpi && SITES.includes(r.site);
async function fetchJson(url) {
  const r = await fetch(url + (url.includes('?') ? '&' : '?') + 't=' + Date.now(), { cache: 'no-store' });
  return r.ok ? r.json() : null;
}
export async function readAll() {
  const blobs = []; let cursor;
  do { const r = await list({ prefix: 'records/', cursor, limit: 1000 }); blobs.push(...r.blobs); cursor = r.hasMore ? r.cursor : undefined; } while (cursor);
  const saved = (await Promise.all(blobs.map(b => fetchJson(b.url)))).filter(valid);
  const map = new Map(SEED.map(r => [r.site + '|' + r.month, r]));
  saved.forEach(r => map.set(r.site + '|' + r.month, r));
  return [...map.values()];
}
export async function readOne(site, month) {
  const r = await list({ prefix: path(site, month), limit: 1 });
  const b = r.blobs.find(x => x.pathname === path(site, month));
  const rec = b ? await fetchJson(b.url) : null;
  return valid(rec) ? rec : SEED.find(x => x.site === site && x.month === month) || null;
}
export async function writeOne(rec) {
  await put(path(rec.site, rec.month), JSON.stringify(rec), { access: 'public', addRandomSuffix: false, allowOverwrite: true, contentType: 'application/json', cacheControlMaxAge: 60 });
}
export function send(res, code, obj) { res.status(code).setHeader('cache-control', 'no-store'); res.json(obj); }
