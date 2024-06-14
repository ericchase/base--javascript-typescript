import { Debounce } from './lib/Algorithm/Debounce.mts';
import { Watch } from './lib/Cxx/Watch.mts';
import { PipeStdio, Run } from './lib/Node/Process.mts';

const bun_build = Debounce(async () => {
  await PipeStdio(Run({ program: 'bun', args: ['run', 'build'] }));
}, 250);

try {
  await Watch({
    path: './src',
    debounce_interval: 250,
    change_cb: () => {
      bun_build();
    },
    error_cb: (error) => {
      console.error('ERROR:', error);
    },
  });
} catch (err) {
  console.log(err);
}
