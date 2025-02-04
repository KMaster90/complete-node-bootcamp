const fs = require('fs');
const server = require('http').createServer();

server.on('request', (req, res) => {
  // Solution 1
  // fs.readFile('test-file.txt', (err, data) => {
  //   if (err) console.log(err);
  //   res.end(data);
  // });

  // Solution 2: Streams
  // const readable = fs.createReadStream('test-file.txt');
  // readable.on('data', chunk => {
  //   console.log('chunk', chunk);
  //   res.write(chunk);
  // });
  // readable.on('end', () => {
  //   console.log('end');
  //   res.end();
  // });
  // readable.on('error', err => {
  //   console.log(err);
  //   res.statusCode = 500;
  //   res.end('File not found!');
  // });

  // Solution 3
  const readable = fs.createReadStream('test-file.txt');
  readable.pipe(res);
  // readableSource.pipe(writeableDestination)
});

server.listen(8000, 'localhost', () => {
  console.log('Listening...');
});
