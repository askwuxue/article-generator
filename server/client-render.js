import { getCoronavirusKeyIndex, getCoronavirusByDate } from './mock/mock.js';

import Server from './interceptor-server.js';
import Router from './middleware/routes.js';

const app = new Server();
const router = new Router();

app.use(async ({req, res}, next) => {
  console.log(`请求访问地址${req.url}`);
  await next();
});

app.use(router.get('/coronavirus/index', async ({res}, next) => {
  const index = getCoronavirusKeyIndex();
  res.setHeader('Content-Type', 'application/json');
  res.body = {data: index};
  await next();
}));

// 精髓，通过拦截器，可以对上下文对象不断地扩展
app.use(router.get('/coronavirus/:date', async ({route, res}, next) => {
  const data = getCoronavirusByDate(route.date);
  res.setHeader('Content-Type', 'application/json');
  res.body = {data};
  await next();
}));

app.use(router.all('.*', async ({params, req, res}, next) => {
  res.setHeader('Content-Type', 'text/html');
  res.body = '<h1>Not Found</h1>';
  res.statusCode = 404;
  await next();
}));

app.listen({
  port: 3000,
  host: '127.0.0.1',
});