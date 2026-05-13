import { mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';

const source = 'assets/branding/app-icon-master.svg';
const outputDir = 'assets/images';

mkdirSync(outputDir, { recursive: true });

const commands = [
  [
    '-density',
    '300',
    source,
    '-resize',
    '1024x1024',
    '-alpha',
    'remove',
    '-alpha',
    'off',
    `${outputDir}/icon.png`,
  ],
  [
    '-background',
    'none',
    '-density',
    '300',
    source,
    '-resize',
    '820x820',
    '-gravity',
    'center',
    '-extent',
    '1024x1024',
    `${outputDir}/adaptive-icon.png`,
  ],
  [`${outputDir}/icon.png`, '-resize', '48x48', `${outputDir}/favicon.png`],
  [`${outputDir}/icon.png`, '-resize', '1024x1024', `${outputDir}/splash-icon.png`],
];

for (const args of commands) {
  const result = spawnSync('magick', args, { stdio: 'inherit' });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}
