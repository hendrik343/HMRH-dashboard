import { auth, readAll, send } from './_lib.js';
export default async function handler(req, res) {
  if (!auth(req)) return send(res, 401, { error: 'Não autorizado' });
  try { send(res, 200, { records: await readAll() }); }
  catch (e) { send(res, 500, { error: 'Erro ao ler dados: ' + e.message }); }
}
