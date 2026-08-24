const { WebSocketServer } = require('ws');
const { uIOhook } = require('uiohook-napi');

const wss = new WebSocketServer({ port: 8080 });
console.log('Servidor WebSocket rodando em ws://localhost:8080');

function broadcast(data) {
  const message = JSON.stringify(data);
  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

uIOhook.on('keydown', (e) => broadcast({ type: 'keydown', keycode: e.keycode }));
uIOhook.on('keyup', (e) => broadcast({ type: 'keyup', keycode: e.keycode }));
uIOhook.on('mousedown', (e) => broadcast({ type: 'mousedown', button: e.button }));
uIOhook.on('mouseup', (e) => broadcast({ type: 'mouseup', button: e.button }));
uIOhook.on('mousemove', (e) => broadcast({ type: 'mousemove', x: e.x, y: e.y }));

uIOhook.start();