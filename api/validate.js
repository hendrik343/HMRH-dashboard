import { auth, readOne, writeOne, send, SITES } from './_lib.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Método não permitido' });
  const a = auth(req);
  if (!a || a.role !== 'admin') return send(res, 403, { error: 'Apenas o coordenador HSE pode validar' });
  const { site, month, action, note } = req.body || {};
  if (!SITES.includes(site) || !['validar', 'devolver', 'reabrir'].includes(action)) return send(res, 400, { error: 'Pedido inválido' });
  try {
    const found = await readOne(site, month);
    if (!found) return send(res, 404, { error: 'Registo não encontrado' });
    const rec = { ...found };
    delete rec.seed;
    const now = new Date().toISOString();
    rec.status = action === 'validar' ? 'validado' : action === 'devolver' ? 'devolvido' : 'submetido';
    if (action === 'validar') rec.validatedAt = now;
    rec.reviewNote = String(note || '').slice(0, 1000);
    rec.history = [...(rec.history || []), { at: now, by: 'Coordenador HSE', action, note: rec.reviewNote }];
    await writeOne(rec);
    send(res, 200, { ok: true, record: rec });
  } catch (e) { send(res, 500, { error: 'Erro: ' + e.message }); }
}
