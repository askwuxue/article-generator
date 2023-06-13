import net from 'net';

function responseData(str, status = 200, desc = 'OK') {
  // TODO 报文必须按照一定的格式返回
  return `HTTP/1.1 ${status} ${desc}
Connection: keep-alive
Date: ${new Date()}
Content-Length: ${str.length}
Content-Type: text/html

  ${str}`;
}

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    const matched = data.toString('utf-8').match(/^GET ([/\w]+) HTTP/);
    if (matched) {
      const path = matched[1];
      if (path === '/') {
        socket.write(responseData('<h1>Hello world</h1>'));
      } else {
        socket.write(responseData('<h1>404 Not Found</h1>', 404, 'NOT FOUND'));
      }
    }
    console.log('\n\n')
    console.log(data.toString());
  });

  socket.on('close', () => {
    console.log('connection closed, goodbye!\n\n\n');
  }).on('error', (err) => {
    throw err;
  })

});

server.listen({
  host: '0.0.0.0',
  port: 8000,

}, () => {
  console.log('opened server on', server.address());
})