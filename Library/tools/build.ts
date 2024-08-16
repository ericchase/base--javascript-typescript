import { FilterDirectoryTree } from '../src/Platform/Cxx/LSD.js';
import { DeleteDirectory } from '../src/Platform/Node/Fs.js';

await DeleteDirectory('./build');
Bun.spawnSync(['bun', 'run', 'format']);

const src = {
  dir: './src',
  ext: '.ts',
  exclude: '.test.ts',
};

const dest = {
  dir: './build',
  ext: '.js',
};

const { files } = await FilterDirectoryTree({
  path: src.dir, //
  include: ['*' + src.ext],
  exclude: ['*' + src.exclude],
});

const success: string[] = [];
const failure: string[] = [];

const transpiler = new Bun.Transpiler({
  loader: 'tsx',
  target: 'browser',
});
for (const path of files) {
  const out_path = dest.dir + path.slice(src.dir.length, path.lastIndexOf(src.ext)) + dest.ext;
  const transpiled_code = transpiler.transformSync(await Bun.file(path).text());
  try {
    await Bun.write(out_path, transpiled_code);
    success.push(out_path);
  } catch (err) {
    failure.push(path);
  }
}

if (success.length > 0) {
  for (const path of success) {
    console.log('\x1b[32mpass\x1b[0m', path);
  }
}
if (failure.length > 0) {
  for (const path of failure) {
    console.log('\x1b[31mfail\x1b[0m', path);
  }
}

Bun.spawnSync(['bun', 'run', 'format']);
