import { auth, send } from './_lib.js';
export default function handler(req, res) {
  const a = auth(req);
  if (!a) return send(res, 401, { error: 'PIN inválido' });
  send(res, 200, a);
}
