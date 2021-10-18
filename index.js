//TODO make it as class
const { WebSocketServer } = require('ws');
const {
  generateItems,
  generateMessage,
  getRandomInt,
  generateUpdate,
} = require('./helpers');

const wss = new WebSocketServer({ port: 80 });

const clients = new Map();

wss.on('connection', function connection(ws) {
  var items = JSON.stringify(generateItems());

  ws.send(items);

  clients.set(ws, items);

  setInterval(() => {
    let wrapItems = JSON.parse(items);
    let message = generateMessage(items);

    let itemIndex = wrapItems.findIndex(
      ({ productId }) => productId === message.payload.productId,
    );

    wrapItems[itemIndex].stock = message.payload.stock;
    items = JSON.stringify(wrapItems);
    ws.send(JSON.stringify(message));
  }, 3000);

  setInterval(() => {
    let wrapItems = JSON.parse(items);
    let message = generateUpdate(items);

    let itemIndex = wrapItems.findIndex(
      ({ productId }) => productId === message.payload.productId,
    );

    wrapItems[itemIndex].stock = message.payload.stock;
    items = JSON.stringify(wrapItems);
    ws.send(JSON.stringify(message));
  }, 20000);

  ws.on('message', function incoming(message) {
    const data = JSON.parse(message);
    const wrapItems = JSON.parse(items);
    try {
      if (data.operation === 'product.stock.decrease') {
        let itemIndex = wrapItems.findIndex(
          ({ productId }) => productId === data.payload.productId,
        );

        if (typeof itemIndex === 'number') {
          let newStock = wrapItems[itemIndex].stock;
          newStock -= data.payload.stock;

          if (newStock >= 0) {
            wrapItems[itemIndex].stock = newStock;
            items = JSON.stringify(wrapItems);

            let response = {
              operation: 'product.stock.decreased',
              correlationId: data.correlationId,
              payload: {
                productId: data.payload.productId,
                stock: newStock,
              },
            };
            console.log(response);
            ws.send(JSON.stringify(response));
          }
        }
      }
    } catch (err) {
      let errorResponse = {
        operation: 'product.stock.decrease.failed',
        correlationId: data.correlationId,
        payload: {
          error: true,
          message: err.message,
        },
      };
      ws.send(JSON.stringify(errorResponse));
    }
  });

  ws.on('close', function () {
    clients.delete(ws);
  });
});
