#!/usr/bin/env node
'use strict';

// Downloads pinned helper packages and copies only the browser distributions
// plus their upstream license files into versioned, first-party asset paths.
// This script intentionally does not change the runtime loader yet.
const fs = require('node:fs');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const packages = [
  {
    name: 'pdf-lib',
    version: '1.17.1',
    asset: 'dist/pdf-lib.min.js',
    candidates: ['dist/pdf-lib.min.js'],
    licenseCandidates: ['LICENSE.md', 'LICENSE', 'license.md', 'license']
  },
  {
    name: 'jspdf',
    version: '2.5.1',
    asset: 'dist/jspdf.umd.min.js',
    candidates: ['dist/jspdf.umd.min.js'],
    licenseCandidates: ['LICENSE', 'LICENSE.md', 'license']
  },
  {
    name: 'qrcodejs',
    version: '1.0.0',
    asset: 'qrcode.min.js',
    candidates: ['qrcode.min.js', 'qrcode.js'],
    licenseCandidates: ['LICENSE', 'LICENSE.md', 'license']
  },
  {
    name: 'exif-js',
    version: '2.3.0',
    asset: 'exif.js',
    candidates: ['exif.js'],
    licenseCandidates: ['LICENSE', 'LICENSE.md', 'license']
  }
];

const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const install = spawnSync(npm, [
  'install', '--no-save', '--no-package-lock', '--ignore-scripts',
  '--no-audit', '--no-fund',
  ...packages.map(item => item.name + '@' + item.version)
], { cwd: root, stdio: 'inherit', shell: process.platform === 'win32' });

if (install.status !== 0) {
  throw new Error('Pinned helper package installation failed; no vendor assets were copied.');
}

function firstExisting(base, candidates, description) {
  for (const candidate of candidates) {
    const fullPath = path.join(base, candidate);
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) return fullPath;
  }
  throw new Error('Missing ' + description + ' in ' + base + '. Checked: ' + candidates.join(', '));
}

for (const item of packages) {
  const packageDir = path.join(root, 'node_modules', item.name);
  const metadataPath = path.join(packageDir, 'package.json');
  if (!fs.existsSync(metadataPath)) throw new Error('Package metadata not found: ' + item.name);
  const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
  if (metadata.version !== item.version) {
    throw new Error(item.name + ' version mismatch: expected ' + item.version + ', received ' + metadata.version);
  }

  const sourceAsset = firstExisting(packageDir, item.candidates, 'browser asset ' + item.name);
  const sourceLicense = firstExisting(packageDir, item.licenseCandidates, 'license file ' + item.name);
  const destinationDir = path.join(root, 'assets', 'vendor', item.name, item.version);
  fs.mkdirSync(destinationDir, { recursive: true });
  fs.copyFileSync(sourceAsset, path.join(destinationDir, path.basename(item.asset)));
  fs.copyFileSync(sourceLicense, path.join(destinationDir, 'LICENSE'));

  const relativeAsset = path.relative(root, path.join(destinationDir, path.basename(item.asset))).replace(/\\/g, '/');
  const relativeLicense = path.relative(root, path.join(destinationDir, 'LICENSE')).replace(/\\/g, '/');
  process.stdout.write('Prepared ' + item.name + '@' + item.version + ': ' + relativeAsset + ' (license: ' + relativeLicense + ')\\n');
}

const googleFontsCommit = '5bb28733cec313b63fbd415b574b5ae35c8aa8b8';
const fontFiles = [
  ['ofl/outfit/Outfit[wght].ttf', 'assets/fonts/outfit/Outfit-Variable.ttf'],
  ['ofl/outfit/OFL.txt', 'assets/fonts/outfit/OFL.txt'],
  ['ofl/ibmplexsansarabic/IBMPlexSansArabic-Regular.ttf', 'assets/fonts/ibm-plex-sans-arabic/IBMPlexSansArabic-Regular.ttf'],
  ['ofl/ibmplexsansarabic/IBMPlexSansArabic-Medium.ttf', 'assets/fonts/ibm-plex-sans-arabic/IBMPlexSansArabic-Medium.ttf'],
  ['ofl/ibmplexsansarabic/IBMPlexSansArabic-SemiBold.ttf', 'assets/fonts/ibm-plex-sans-arabic/IBMPlexSansArabic-SemiBold.ttf'],
  ['ofl/ibmplexsansarabic/IBMPlexSansArabic-Bold.ttf', 'assets/fonts/ibm-plex-sans-arabic/IBMPlexSansArabic-Bold.ttf'],
  ['ofl/ibmplexsansarabic/OFL.txt', 'assets/fonts/ibm-plex-sans-arabic/OFL.txt']
];

for (const [source, destination] of fontFiles) {
  const output = path.join(root, destination);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  const url = 'https://raw.githubusercontent.com/google/fonts/' + googleFontsCommit + '/' + encodeURI(source);
  const download = spawnSync('curl', ['--location', '--fail', '--silent', '--show-error', url, '--output', output], { cwd: root, stdio: 'inherit' });
  if (download.status !== 0 || !fs.existsSync(output) || fs.statSync(output).size < 100) {
    throw new Error('Could not download pinned font asset: ' + source);
  }
  process.stdout.write('Prepared font asset: ' + destination + '\\n');
}

process.stdout.write('Vendor preparation complete. Runtime URLs were not changed.\\n');
