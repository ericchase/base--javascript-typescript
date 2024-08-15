import node_child_process, { type ExecFileOptions } from 'node:child_process';
import type { ObjectEncodingOptions } from 'node:fs';

export interface STDIO {
  stdout?: string;
  stderr?: string;
}

interface RunParams {
  program: string;
  args?: string[];
  options?: ObjectEncodingOptions & ExecFileOptions;
}
export function Run({ program, args = [], options = {} }: RunParams) {
  return new Promise<STDIO>((resolve, reject) => {
    try {
      console.log(`[${new Date().toLocaleTimeString()}] > ${program} ${args.join(' ')}`);
      node_child_process.execFile(program, args, options, (error, stdout, stderr) => {
        if (error) return reject(error);
        return resolve({ stdout, stderr });
      });
    } catch (err) {
      return reject(err);
    }
  });
}

export async function PipeStdio(command: Promise<STDIO>) {
  try {
    const { stdout, stderr } = await command;
    if (stdout) console.log(stdout.slice(0, stdout.lastIndexOf('\n')));
    if (stderr) console.log(stderr.slice(0, stderr.lastIndexOf('\n')));
  } catch (err) {
    console.log(err);
  }
}
