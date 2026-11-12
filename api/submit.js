import { auth, readOne, writeOne, send, SITES, REQUIRED, OPTIONAL } from './_lib.js';
export default async function handler(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Método não permitido' });
  const a = auth(req);
  if (!a || a.role === 'viewer') return send(res, 403, { error: 'Sem permissão para submeter' });
  const b = req.body || {};
  const site = String(b.site || ''), month = String(b.month || '');
  if (!SITES.includes(site)) return send(res, 400, { error: 'Hospital inválido' });
  if (a.role === 'site' && a.site !== site) return send(res, 403, { error: 'Só pode submeter dados do seu hospital' });
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) return send(res, 400, { error: 'Mês inválido' });
  const kpi = {};
  for (const f of [...REQUIRED, ...OPTIONAL]) {
    const raw = b.kpi?.[f];
    if (raw === null || raw === undefined || raw === '') {
      if (REQUIRED.includes(f)) return send(res, 400, { error: `Falta o campo ${f}` });
      kpi[f] = null; continue;
    }
    const v = Number(raw);
    if (!Number.isFinite(v) || v < 0) return send(res, 400, { error: `Valor inválido em ${f}` });
    kpi[f] = v;
  }
  if (kpi.checklist > 100) return send(res, 400, { error: 'Checklist não pode passar de 100%' });
  if (kpi.alcPos > kpi.alcTests) return send(res, 400, { error: 'Positivos acima do total de testes' });
  try {
    const prev = await readOne(site, month);
    if (prev && prev.status === 'validado' && a.role !== 'admin') return send(res, 409, { error: 'Este mês já foi validado. Peça ao coordenador HSE para o reabrir.' });
    const now = new Date().toISOString();
    const by = a.role === 'admin' ? 'Coordenador HSE' : 'HSE ' + site;
    const rec = { site, month, kpi, status: 'submetido', flag: 'portal', source: String(b.source || '').slice(0, 120) || 'Submetido no portal', submittedAt: now, submittedBy: by, note: String(b.note || '').slice(0, 1000), history: [...(prev?.history || []), { at: now, by, action: prev ? 'ressubmetido' : 'submetido' }] };
    await writeOne(rec);
    send(res, 200, { ok: true, record: rec });
  } catch (e) { send(res, 500, { error: 'Erro ao gravar: ' + e.message }); }
}
