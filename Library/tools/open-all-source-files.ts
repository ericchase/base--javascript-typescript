// does exactly what the name sounds like

import { FilterDirectoryTree } from '../src/Platform/Cxx/LSD.js';
import { Run } from '../src/Platform/Node/Process.js';

const src = {
  dir: './src',
  ext: '.ts',
};

const { files } = await FilterDirectoryTree({
  path: src.dir, //
  include: ['*' + src.ext],
});

for (const path of files) {
  Run({ program: 'code', args: [path] });
}
