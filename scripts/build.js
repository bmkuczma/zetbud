/**
 * Składa komplet plików produkcyjnych do katalogu dist/.
 * Wgraj całą zawartość dist/ na hosting (np. public_html) — bez ręcznego wybierania plików.
 */
'use strict';

var fs = require('fs');
var path = require('path');

var root = path.join(__dirname, '..');
var out = path.join(root, 'dist');

var FILES = [
  'index.html',
  'polityka-prywatnosci.html',
  'regulamin.html',
  'contact.php',
  'robots.txt',
  'sitemap.xml',
  'site.webmanifest',
  'config.local.php.example',
  'WDROZENIE.txt',
];

var DIRS = ['assets', 'lib'];

function rmrf(p) {
  if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
}

rmrf(out);
fs.mkdirSync(out, { recursive: true });

var missing = [];

FILES.forEach(function (f) {
  var src = path.join(root, f);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(out, f));
  } else {
    missing.push(f);
  }
});

DIRS.forEach(function (d) {
  var src = path.join(root, d);
  if (fs.existsSync(src)) {
    fs.cpSync(src, path.join(out, d), { recursive: true });
  } else {
    missing.push(d + '/');
  }
});

if (missing.length) {
  console.error('Brakuje:', missing.join(', '));
  process.exit(1);
}

console.log('Zbudowano katalog:', out);
console.log('Wgraj na serwer całą zawartość dist/ (np. zawartość do public_html).');
console.log('Na serwerze utwórz config.local.php z przykładu — nie jest kopiowany przez build (hasła).');
