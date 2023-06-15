import { readFileSync } from 'fs';
import handlebars from 'handlebars';
import { resolve,  dirname } from 'path';
import { fileURLToPath, parse } from 'url';
import querystring from 'querystring';

// 获取当前脚本文件的URL
const shellUrl = import.meta.url;
const __dirname = dirname(fileURLToPath(shellUrl));

import { getCoronavirusKeyIndex, getCoronavirusByDate } from './mock/mock.js';

import Server from './interceptor-server.js';
import Router from './middleware/routes.js';

const app = new Server();
const router = new Router();

app.use(async ({req, res}, next) => {
  console.log(`请求访问地址${req.url}`);
  await next();
});

// 对参数进行格式化的一个拦截器
app.use(async (ctx, next) => {
  const { req } = ctx;
  const { query } = parse(`http://${req.headers.host}${req.url}`);
  ctx.params = querystring.parse(query);
  await next();
})

app.use(router.get('/coronavirus/index', async ({res}, next) => {
  const index = getCoronavirusKeyIndex();

  // 获取模板文件
  const tpl = readFileSync(resolve(__dirname, './template/date.html'), {encoding: 'utf-8'});

  // 编译模板
  const template = handlebars.compile(tpl);

  // 将数据和模板结合
  const result = template({data: index});
  res.setHeader('Content-Type', 'text/html');

  res.body = result;
  await next();
}));

// 精髓，通过拦截器，可以对上下文对象不断地扩展
app.use(router.get('/coronavirus/:date', async ({params, route, res}, next) => {
  // console.log('params: ', params.type);
  const { type } = params;
  const data = getCoronavirusByDate(route.date);

  if (type === 'json') {
    res.setHeader('Content-Type', 'application/json');
    res.body = data;
  } else {
    // 获取模板文件
    const tpl = readFileSync(resolve(__dirname, './template/content.html'), {encoding: 'utf-8'});

    // 编译模板
    const template = handlebars.compile(tpl);

    // 将数据和模板结合
    const result = template({data});

    res.setHeader('Content-Type', 'text/html');
    res.body = result;
  }
  
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