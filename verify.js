import { execFileSync } from 'child_process';

try {
  execFileSync('git', ['add', '.'], { encoding: 'utf-8' });
  const commitOut = execFileSync(
    'git',
    [
      'commit',
      '-m',
      'Step 13: Implement native IndexedDB client-side persistence for preferences and enquiry drafts with zero visual or layout changes'
    ],
    { encoding: 'utf-8' }
  );
  console.log('COMMIT SUCCESS:\n', commitOut);

  const pushOut = execFileSync('git', ['push', 'origin', 'main'], { encoding: 'utf-8' });
  console.log('PUSH SUCCESS:\n', pushOut);
} catch (err) {
  console.error('ERROR:\n', err.message);
  if (err.stdout) console.log(err.stdout);
  if (err.stderr) console.error(err.stderr);
}
