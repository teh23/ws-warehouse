const _ = require('lodash');
const { prefix, shopitems } = require('./_mock');
const { v4: uuidv4 } = require('uuid');

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
}

function generateItems() {
  const items = [];
  const starterId = getRandomInt(1, 3000);
  for (let i = 0; i < 10; i++) {
    const name = `${_.sample(prefix)} ${_.sample(shopitems)}`;
    const price = getRandomInt(100, 10000);
    const stock = getRandomInt(100, 10000);
    items.push({
      productId: starterId + i,
      name: name,
      price: price,
      stock: stock,
    });
  }
  return items;
}

function generateMessage(client) {
  const clientParse = JSON.parse(client);
  const arrayId = getRandomInt(0, 9);
  const sample = clientParse[arrayId];

  let newStock =
    sample.stock - Math.floor(sample.stock * (getRandomInt(1, 20) / 100)); //
  if (newStock < 0) {
    newStock = 0;
  }

  const message = {
    operation: 'product.stock.decreased',
    correlationId: uuidv4(),
    payload: {
      productId: sample.productId,
      stock: newStock,
    },
  };

  return message;
}

function generateUpdate(client) {
  const clientParse = JSON.parse(client);
  const arrayId = getRandomInt(0, 9);
  const sample = clientParse[arrayId];

  let newStock = getRandomInt(100, 10000);
  if (newStock < 0) {
    newStock = 0;
  }

  const message = {
    operation: 'product.stock.updated',
    correlationId: uuidv4(),
    payload: {
      productId: sample.productId,
      stock: newStock,
    },
  };

  return message;
}
exports.generateMessage = generateMessage;
exports.getRandomInt = getRandomInt;
exports.generateItems = generateItems;
exports.generateUpdate = generateUpdate;
