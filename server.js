const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = Number(process.env.PORT || 5173);
const types = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.json': 'application/json',
};

http.createServer((req, res) => {
  let urlPath;
  try {
    urlPath = decodeURIComponent(req.url.split('?')[0]);
  } catch {
    res.writeHead(400);
    return res.end('Bad request');
  }

  let file = path.join(root, urlPath);
  const isInsideRoot = file.startsWith(root);
  if (!isInsideRoot) {
    res.writeHead(403);
    return res.end('Forbidden');
  }

  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    if (!path.extname(urlPath)) {
      file = path.join(root, 'index.html');
    } else {
      res.writeHead(404);
      return res.end('404 ' + urlPath);
    }
  }

  res.writeHead(200, {
    'Content-Type': types[path.extname(file).toLowerCase()] || 'application/octet-stream',
    'Cache-Control': 'no-cache',
  });
  fs.createReadStream(file).pipe(res);
}).listen(port, '127.0.0.1', () => {
  const url = 'http://127.0.0.1:' + port + '/';
  console.log('Cupom da Vez a correr em ' + url);
  if (process.argv.includes('--open')) {
    require('child_process').exec('start "" "' + url + '"', { shell: 'cmd.exe' });
  }
});
