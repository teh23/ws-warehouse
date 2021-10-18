const { WebSocket } = require('ws');

const ws = new WebSocket('ws://localhost/');
let data = [];

ws.on('open', function open(item) {
  console.log('open ' + item);
});

ws.on('message', function open(item) {
  console.log(JSON.parse(item));
  data = item;
});
setTimeout(() => {
  ws.send(
    JSON.stringify({
      operation: 'product.stock.decrease',
      correlationId: 'SOME ID',
      payload: {
        productId: JSON.parse(data)[0].productId,
        stock: 100,
      },
    }),
  );
}, 1000);
