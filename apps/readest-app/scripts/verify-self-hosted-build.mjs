import { readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';

const appDir = path.resolve(import.meta.dirname, '..');
const outputDir = path.join(appDir, 'out');

const collectFiles = (dir) =>
  readdirSync(dir).flatMap((entry) => {
    const fullPath = path.join(dir, entry);
    if (statSync(fullPath).isDirectory()) return collectFiles(fullPath);
    return /\.(?:html|js)$/.test(entry) ? [fullPath] : [];
  });

const requiredValues = {
  supabaseUrl: process.env['NEXT_PUBLIC_SUPABASE_URL'],
  supabaseAnonKey: process.env['NEXT_PUBLIC_SUPABASE_ANON_KEY'],
  apiBaseUrl: process.env['NEXT_PUBLIC_API_BASE_URL'],
  buildConfig: [
    'self-hosted',
    `storage=${process.env['NEXT_PUBLIC_STORAGE_FIXED_QUOTA']}`,
    `translation=${process.env['NEXT_PUBLIC_TRANSLATION_FIXED_QUOTA']}`,
  ].join(';'),
};

const files = collectFiles(outputDir);
for (const [name, value] of Object.entries(requiredValues)) {
  if (!value) throw new Error(`Missing required build configuration: ${name}`);
  if (!files.some((file) => readFileSync(file).includes(value))) {
    throw new Error(`Compiled frontend is missing build configuration: ${name}`);
  }
}

console.log('Verified compiled self-hosted frontend configuration.');
