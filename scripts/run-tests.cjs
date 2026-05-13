'use strict';

/**
 * Uruchamia: testy PHP (telefon), testy Node (sync JS), build dist jeśli brak,
 * krótki serwer PHP na 127.0.0.1:8765 i Playwright (formularz).
 * Użycie: npm test
 */
var fs = require('fs');
var path = require('path');
var http = require('http');
var { spawn, execFileSync } = require('child_process');

var root = path.join(__dirname, '..');
var dist = path.join(root, 'dist');

function run(cmd, args, opts) {
  return new Promise(function (resolve, reject) {
    var c = spawn(cmd, args, { stdio: 'inherit', ...opts });
    c.on('close', function (code) {
      if (code === 0) resolve();
      else reject(new Error(cmd + ' exited with ' + code));
    });
    c.on('error', reject);
  });
}

function waitForHttp(url, timeoutMs) {
  var deadline = Date.now() + timeoutMs;
  return /** @type {Promise<void>} */ (
    new Promise(function (resolve, reject) {
      function attempt() {
        if (Date.now() > deadline) {
          reject(new Error('Timeout waiting for ' + url));
          return;
        }
        var req = http.get(url, function (res) {
          res.resume();
          resolve();
        });
        req.on('error', function () {
          setTimeout(attempt, 250);
        });
        req.setTimeout(3000, function () {
          req.destroy();
          setTimeout(attempt, 250);
        });
      }
      attempt();
    })
  );
}

(async function main() {
  try {
    execFileSync('php', [path.join(root, 'tests', 'php', 'phone_validator_test.php')], {
      cwd: root,
      stdio: 'inherit',
    });
  } catch (e) {
    if (e && e.code === 'ENOENT') {
      console.error('Brak polecenia `php` w PATH — nie można uruchomić testów PHP ani E2E (serwer).');
      console.error('Zainstaluj PHP 8.1+ (patrz tests/README.md) albo uruchom: npm run test:node (tylko testy Node).');
      process.exit(1);
    }
    throw e;
  }
  execFileSync('node', ['--test', path.join(root, 'tests', 'node', 'phone-sync.test.cjs')], {
    cwd: root,
    stdio: 'inherit',
  });

  if (!fs.existsSync(path.join(dist, 'index.html'))) {
    execFileSync('npm', ['run', 'build'], { cwd: root, stdio: 'inherit' });
  }

  var php = spawn('php', ['-S', '127.0.0.1:8765', '-t', dist], {
    cwd: root,
    stdio: 'ignore',
  });

  await new Promise(function (r) {
    setTimeout(r, 500);
  });

  try {
    await waitForHttp('http://127.0.0.1:8765/index.html', 15000);
    var env = Object.assign({}, process.env, { BASE_URL: 'http://127.0.0.1:8765' });
    await run('npx', ['playwright', 'test'], { cwd: root, env: env });
  } finally {
    if (php && php.pid) {
      php.kill('SIGTERM');
    }
  }
})().catch(function (e) {
  console.error(e);
  process.exit(1);
});
