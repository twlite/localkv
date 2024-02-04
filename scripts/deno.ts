import { join } from 'node:path';
import { version } from '../package.json' assert { type: 'json' };

const dest = join(import.meta.dir, '..', 'deno', 'mod.ts');

const content = `// @ts-nocheck\n\nexport * from 'npm:localkv@${version}';\n`;

await Bun.write(Bun.file(dest), content);
