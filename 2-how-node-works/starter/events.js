const EventEmitter = require('events');


// const myEmitter = new EventEmitter();

class Sales extends EventEmitter {
  constructor() {
    super();
  }
}

const myEmitter = new Sales();

myEmitter.on('newSale', () => {
  console.log('There was a new sale!');
});

myEmitter.on('newSale', () => {
  console.log('Customer name: Jonas');
});

myEmitter.on('newSale', stock => {
  console.log(`There are now ${stock} items left in stock.`);
});

myEmitter.emit('newSale', 9);

///////////////////////////////////////
// Building a Simple Web Server
// Path: 2-how-node-works/starter/server.js
// Compare this snippet from 2-how-node-works/starter/event-loop.js:
const http = require('http');

const server = http.createServer();

server.on('request', (req, res) => {
  console.log('Request received!');
  console.log('--API--', req.url);
  res.end('Request received');
});

server.on('request', (req, res) => {
  console.log('Another request 😀');
});

server.on('close', () => {
  console.log('Server closed');
});

server.listen(8000, '127.0.0.1', () => {
  console.log('Waiting for requests...');
});
