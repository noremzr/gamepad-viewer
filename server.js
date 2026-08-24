const https = require('https');
const fs = require('fs');
const { WebSocketServer } = require('ws');
const { uIOhook } = require('uiohook-napi');

// Carrega os certificados locais
const server = https.createServer({
  cert: fs.readFileSync('./localhost+1.pem'),
  key: fs.readFileSync('./localhost+1-key.pem')
});

const wss = new WebSocketServer({ server });
server.listen(8080, () => {
  console.log('Servidor WSS Seguro rodando em wss://127.0.0.1:8080');
});

function broadcast(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) client.send(message);
  });
}

// CAPTURA TECLADO E MOUSE
uIOhook.on('keydown', (e) => broadcast({ type: 'keydown', keycode: e.keycode }));
uIOhook.on('keyup', (e) => broadcast({ type: 'keyup', keycode: e.keycode }));
uIOhook.on('mousedown', (e) => broadcast({ type: 'mousedown', button: e.button }));
uIOhook.on('mouseup', (e) => broadcast({ type: 'mouseup', button: e.button }));
uIOhook.on('mousemove', (e) => broadcast({ type: 'mousemove', x: e.x, y: e.y }));

uIOhook.start();