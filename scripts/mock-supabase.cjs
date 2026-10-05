#!/usr/bin/env node
/**
 * Faux Supabase (API REST « PostgREST » en mémoire) pour développer et tester SANS vrai projet Supabase.
 *
 *   npm run dev:mock        démarre ce faux serveur + le site en dev, branchés ensemble
 *   npm run mock:supabase   démarre seulement le faux serveur (port 54321)
 *
 * Il imite assez de PostgREST pour supabase-js : select / insert / upsert (on_conflict) / update / delete,
 * filtres eq neq in like ilike is gt gte lt lte, order, limit, offset, « single ». Il émule aussi le
 * déclencheur d'historique de supabase/migrations/20260711000000_content_history.sql.
 *
 * Données : vides au départ. MOCK_SEED_DIR=<dossier de <page>.json> pour préremplir site_content.
 * Endpoints utiles : GET /__state (contenu de la base), POST /__reset, GET /__config?rejectDrafts=1
 * (simule une contrainte de la base qui refuse les brouillons « draft:<page> »).
 *
 * ⚠️ Outil de développement : aucune sécurité, aucune persistance.
 */
const http = require('http'), fs = require('fs'), crypto = require('crypto');

function createMockSupabase() {
  let db, rejectDrafts = false;
  const UNIQUE = { site_content: ['page', 'block_key'], cms_settings_kv: ['key'], cms_settings: ['key'] };

  function seed() {
    db = { site_content: [], site_content_history: [], cms_settings: [], cms_settings_kv: [], articles: [] };
    const dir = process.env.MOCK_SEED_DIR;
    if (!dir || !fs.existsSync(dir)) return;
    for (const f of fs.readdirSync(dir).filter(n => n.endsWith('.json'))) {
      const page = f.replace(/\.json$/, '');
      for (const r of (JSON.parse(fs.readFileSync(dir + '/' + f, 'utf8')).content || []))
        db.site_content.push({ id: crypto.randomUUID(), page, block_key: r.block_key, value: r.value, updated_at: new Date().toISOString() });
    }
  }
  seed();

  const send = (res, code, body, headers = {}) => { res.writeHead(code, { 'Content-Type': 'application/json', ...headers }); res.end(body === undefined ? '' : JSON.stringify(body)); };
  function parseFilters(url) {
    const out = [];
    for (const [k, v] of url.searchParams) {
      if (['select', 'order', 'limit', 'offset', 'on_conflict', 'columns'].includes(k)) continue;
      const m = v.match(/^(not\.)?(eq|neq|in|like|ilike|is|gt|gte|lt|lte)\.(.*)$/s);
      if (m) out.push({ col: k, neg: !!m[1], op: m[2], val: m[3] });
    }
    return out;
  }
  function matches(row, f) {
    const x = row[f.col];
    let r;
    switch (f.op) {
      case 'eq': r = String(x) === f.val; break;
      case 'neq': r = String(x) !== f.val; break;
      case 'in': r = f.val.replace(/^\(|\)$/g, '').split(',').map(s => s.replace(/^"|"$/g, '')).includes(String(x)); break;
      case 'like': case 'ilike': r = new RegExp('^' + f.val.replace(/[.+^${}()|[\]\\]/g, '\\$&').replace(/[*%]/g, '.*') + '$', f.op === 'ilike' ? 'i' : '').test(String(x ?? '')); break;
      case 'is': r = f.val === 'null' ? x == null : String(x) === f.val; break;
      case 'gt': r = x > f.val; break; case 'gte': r = x >= f.val; break; case 'lt': r = x < f.val; break; case 'lte': r = x <= f.val; break;
    }
    return f.neg ? !r : r;
  }
  function logHistory(table, op, oldRow, newRow) {
    if (table !== 'site_content') return;
    if (op === 'UPDATE' && newRow.value === oldRow.value) return;
    db.site_content_history.push({ id: db.site_content_history.length + 1, page: (oldRow || newRow).page, block_key: (oldRow || newRow).block_key, old_value: oldRow ? oldRow.value : null, new_value: newRow.value, changed_at: new Date().toISOString() });
  }

  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://x');
    if (url.pathname === '/__state') return send(res, 200, db);
    if (url.pathname === '/__reset') { seed(); rejectDrafts = false; return send(res, 200, { ok: true }); }
    if (url.pathname === '/__config') { rejectDrafts = url.searchParams.get('rejectDrafts') === '1'; return send(res, 200, { rejectDrafts }); }
    const m = url.pathname.match(/^\/rest\/v1\/([^/]+)$/);
    let chunks = '';
    req.on('data', d => (chunks += d));
    req.on('end', () => {
      if (!m) return send(res, 404, { message: 'mock: route inconnue ' + url.pathname });
      const table = m[1];
      db[table] = db[table] || [];
      const rows = db[table];
      const prefer = req.headers.prefer || '';
      const wantRep = /return=representation/.test(prefer);
      const single = /vnd\.pgrst\.object/.test(req.headers.accept || '');
      const filters = parseFilters(url);
      const body = chunks ? JSON.parse(chunks) : null;
      const respond = (code, list) => {
        if (single) {
          if (list.length !== 1) return send(res, 406, { code: 'PGRST116', details: `The result contains ${list.length} rows`, hint: null, message: 'JSON object requested, multiple (or no) rows returned' });
          return send(res, code, list[0], { 'Content-Range': '0-0/1' });
        }
        return send(res, code, list, { 'Content-Range': `0-${Math.max(list.length - 1, 0)}/${list.length}` });
      };
      if (req.method === 'GET' || req.method === 'HEAD') {
        let out = rows.filter(r => filters.every(f => matches(r, f)));
        const ord = url.searchParams.get('order');
        if (ord) { const [col, dir] = ord.split('.'); out = [...out].sort((a, b) => (a[col] > b[col] ? 1 : a[col] < b[col] ? -1 : 0) * (dir === 'desc' ? -1 : 1)); }
        if (url.searchParams.get('offset')) out = out.slice(+url.searchParams.get('offset'));
        if (url.searchParams.get('limit')) out = out.slice(0, +url.searchParams.get('limit'));
        return respond(200, out);
      }
      if (req.method === 'POST') {
        const items = Array.isArray(body) ? body : [body];
        if (rejectDrafts && items.some(it => String(it.page || '').startsWith('draft:')))
          return send(res, 400, { code: '23514', message: 'new row for relation "site_content" violates check constraint "site_content_page_check"' });
        const conflict = (url.searchParams.get('on_conflict') || '').split(',').filter(Boolean);
        const keys = conflict.length ? conflict : UNIQUE[table] || [];
        const merge = /resolution=merge-duplicates/.test(prefer), ignore = /resolution=ignore-duplicates/.test(prefer);
        const out = [];
        for (const it of items) {
          const existing = keys.length ? rows.find(r => keys.every(k => String(r[k]) === String(it[k]))) : null;
          if (existing && (merge || ignore)) {
            if (merge) { const old = { ...existing }; Object.assign(existing, it, { updated_at: new Date().toISOString() }); logHistory(table, 'UPDATE', old, existing); }
            out.push(existing);
          } else if (existing) return send(res, 409, { code: '23505', message: `duplicate key value violates unique constraint on ${table}` });
          else { const row = { id: crypto.randomUUID(), created_at: new Date().toISOString(), updated_at: new Date().toISOString(), ...it }; rows.push(row); logHistory(table, 'INSERT', null, row); out.push(row); }
        }
        return wantRep ? respond(201, out) : send(res, 201);
      }
      if (req.method === 'PATCH') {
        const hit = rows.filter(r => filters.every(f => matches(r, f)));
        for (const r of hit) { const old = { ...r }; Object.assign(r, body, { updated_at: new Date().toISOString() }); logHistory(table, 'UPDATE', old, r); }
        return wantRep ? respond(200, hit) : send(res, 204);
      }
      if (req.method === 'DELETE') {
        const hit = rows.filter(r => filters.every(f => matches(r, f)));
        db[table] = rows.filter(r => !hit.includes(r));
        return wantRep ? respond(200, hit) : send(res, 204);
      }
      send(res, 405, { message: 'mock: méthode non gérée' });
    });
  });
  return { server, getDb: () => db, reset: () => { seed(); rejectDrafts = false; } };
}

module.exports = { createMockSupabase };

if (require.main === module) {
  const port = +(process.argv[2] || process.env.MOCK_SUPABASE_PORT || 54321);
  const { server, getDb } = createMockSupabase();
  server.listen(port, () => console.log(`[mock-supabase] http://localhost:${port} — site_content : ${getDb().site_content.length} ligne(s)`));
}
