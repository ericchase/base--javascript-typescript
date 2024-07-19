import { CopyFile } from '../src/lib/external/Platform/Bun/Fs.js';
import { FilterDirectoryTree } from '../src/lib/external/Platform/Cxx/LSD.js';
import { DeleteFile } from '../src/lib/external/Platform/Node/Fs.js';

const src = {
  dir: './src',
  ext: '.ts',
  exclude: '.test.ts',
};

const dest = {
  dir: './src',
  ext: '.ts',
};

const { files } = await FilterDirectoryTree({ path: src.dir, include: ['*' + src.ext], exclude: ['*' + src.exclude] });

const success: string[] = [];
const failure: string[] = [];

for (const path of files) {
  const out_path = dest.dir + path.slice(src.dir.length, path.lastIndexOf(src.ext)) + dest.ext;
  try {
    if (await CopyFile(path, out_path)) {
      await DeleteFile(path);
      success.push(path);
    } else {
      failure.push(path);
    }
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
