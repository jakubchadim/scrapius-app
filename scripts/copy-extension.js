#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const root = process.cwd();
const src = path.join(root, 'extension', 'dist');
const dest = path.join(root, 'app', 'public', 'extension-base');

function copyDir(srcDir, destDir) {
  if (!fs.existsSync(srcDir)) {
    console.error('Extension dist not found at', srcDir);
    process.exit(1);
  }
  fs.mkdirSync(destDir, { recursive: true });
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const s = path.join(srcDir, entry.name);
    const d = path.join(destDir, entry.name);
    if (entry.isDirectory()) {
      copyDir(s, d);
    } else if (entry.isFile()) {
      fs.mkdirSync(path.dirname(d), { recursive: true });
      fs.copyFileSync(s, d);
    }
  }
  console.log('Copied extension build to', destDir);
}

copyDir(src, dest);
