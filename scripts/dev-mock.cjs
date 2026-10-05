#!/usr/bin/env node
/**
 * `npm run dev:mock` — développer le site SANS compte Supabase.
 * Démarre le faux Supabase (scripts/mock-supabase.cjs) puis `next dev` branché dessus.
 * Mot de passe de l'admin (/cms-admin) : « dev-local ».
 */
const { spawn } = require('child_process');
const path = require('path');

const MOCK_PORT = process.env.MOCK_SUPABASE_PORT || '54321';
const env = {
  ...process.env,
  NEXT_PUBLIC_SUPABASE_URL: `http://localhost:${MOCK_PORT}`,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: 'mock-anon',
  SUPABASE_SERVICE_ROLE_KEY: 'mock-service',
  CMS_PASSWORD: process.env.CMS_PASSWORD || 'dev-local',
  CMS_SESSION_SECRET: process.env.CMS_SESSION_SECRET || 'dev-local-secret-0123456789',
};

const mock = spawn(process.execPath, [path.join(__dirname, 'mock-supabase.cjs'), MOCK_PORT], { stdio: 'inherit', env });
const next = spawn(process.execPath, [require.resolve('next/dist/bin/next'), 'dev', ...process.argv.slice(2)], { stdio: 'inherit', env });

const stop = () => { mock.kill(); next.kill(); };
process.on('SIGINT', stop);
process.on('SIGTERM', stop);
next.on('exit', code => { mock.kill(); process.exit(code ?? 0); });
mock.on('exit', code => { if (code) { next.kill(); process.exit(code); } });
