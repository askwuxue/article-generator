import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import moment from 'moment';
import { dirname, resolve } from 'path';
import { generate } from './generate.js';
import { createRandomPick } from './random.js';

// 获取当前脚本文件的URL
const url = import.meta.url;
// 数据文件的路径
const path = resolve(dirname(fileURLToPath(url)), 'corpus/data.json');

// 读取文件
const context = readFileSync(path, 'utf-8');
// 生成文章标题
const title = createRandomPick(JSON.parse(context).title)();
// 生成文章
const article = generate({context});
// 保存文章
const saveArticle = (title, article) => {
  const outputDir = resolve(dirname(fileURLToPath(url)), 'output');
  const outFile = resolve(outputDir, `${title}-${moment().format()}.txt`);
  if (!existsSync(outputDir)) {
    try {
      mkdirSync(outputDir);      
    } catch (error) {
      console.log(`创建文件夹${outputDir}失败`);
    }
  }
  const content = `${title} \n \n    ${article}`;
  writeFileSync(outFile, content);
}

saveArticle(title, article);
