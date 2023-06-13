import http from 'http';
import { existsSync, statSync, createReadStream } from 'fs';
import { resolve, dirname, join, parse } from 'path';
import { fileURLToPath } from 'url';
import { contentType } from 'mime-types';

// 获取当前脚本文件的URL
const shellUrl = import.meta.url;
const __dirname = dirname(fileURLToPath(shellUrl));

// 实现一个静态资源服务器
const server = http.createServer((req,res) => {
  let filepath = resolve(__dirname, join('../public', fileURLToPath(`file:///${req.url}`)));
  const timeStamp = req.headers['if-modified-since'];
  let httpCode = 200;
  // 存在路径
  if (existsSync(filepath)) {
    const stat = statSync(filepath);
    const isDir = stat.isDirectory();
    // 是目录
    if (isDir) {
      filepath = join(filepath, 'index.html');
    }
    // 不是目录或存在文件
    if (!isDir || existsSync(filepath)) {
      // const context = readFileSync(filepath);
      const { ext } = parse(filepath);
      // 协商缓存命中
      if (timeStamp && Number(timeStamp) === stat.mtimeMs) {
        httpCode = 304;
      }
      res.writeHead(httpCode, { 
        'Content-Type': `${contentType(ext)}`,
        'Cache-Control': 'max-age=86400', // 强缓存
        'Last-Modified': stat.mtimeMs, // 协商缓存
       });
       if(httpCode === 200) {
        // TODO 使用流模式读取文件传输文件，避免阻塞
        const fileStream = createReadStream(filepath)
        // return res.end(context);
        // pipe 方法可以将两个流连接起来，这样数据就会从上游流向下游
        fileStream.pipe(res);
      } else { 
        res.end(); // 如果状态码不是200，不用返回Body
      }
    }
  } else {
    res.writeHead(404, {'Content-Type': 'text/html'});
    return res.end('<h1>Not Found</h1>');
  }
})


server.listen({
  port: 8000,
}, () => {
  console.log('opened server on', server.address());
})