import { createServer } from 'http';

import Interceptor from './interceptor/index.js';

import Router from './middleware/routes.js'

class Server {
  constructor() {
    const interceptor = new Interceptor();

    this.server = createServer(async (req, res) => {
      // 执行注册的拦截函数
      await interceptor.run({req, res});

      if(!res.writableFinished) {
        let body = res.body || '200 OK';
        if(body.pipe) {
          body.pipe(res);
        } else {
          if(typeof body !== 'string' && res.getHeader('Content-Type') === 'application/json') {
            body = JSON.stringify(body);
          }
          res.end(body);
        }
      }

    });

    this.server.on('clientError', (err, socket) => {
      socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    });

    this.interceptor = interceptor;

  }

  listen(opts, cb = () => {}) {
    if(typeof opts === 'number') opts = {port: opts};
    opts.host = opts.host || '127.0.0.1';
    console.log(`Starting up http-server
    http://${opts.host}:${opts.port}`);
    this.server.listen(opts, () => cb(this.server));
  }

  use(aspect) { // 向http服务器添加不同功能的拦截切面
    return this.interceptor.use(aspect);
  }

}

// const Server = require('./lib/server');
// const Server = require('./lib/server');

const app = new Server();

app.listen({
  port: 3000,
  // host: '0.0.0.0',
  host: '127.0.0.1',
});

// 添加拦截切面
app.use(async ({res}, next) => {
  res.setHeader('Content-Type', 'text/html');
  res.body = '<h1>Hello world</h1>';
  await next();
});



const router = new Router();

app.use(router.all('/test/:course/:lecture', async ({route, res}, next) => {
  res.setHeader('Content-Type', 'application/json');
  res.body = route;
  await next();
}));

app.use(router.all('.*', async ({req, res}, next) => {
  res.setHeader('Content-Type', 'text/html');
  res.body = '<h1>Not </h1>';
  await next();
}));