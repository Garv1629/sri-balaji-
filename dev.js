import { spawn } from 'child_process';

const viteCli = 'E:\\New folder\\node_modules\\vite\\bin\\vite.js';
console.log('Starting Vite dev server...');
const child = spawn(process.execPath, [viteCli, '--port', '5173', '--host'], {
  cwd: 'E:\\New folder',
  stdio: 'inherit'
});

child.on('close', (code) => {
  console.log('Vite dev server exited with code:', code);
});
