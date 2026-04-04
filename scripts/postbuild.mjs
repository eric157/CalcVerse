import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist');
mkdirSync(distDir, { recursive: true });
writeFileSync(join(distDir, '.nojekyll'), '', 'utf8');