import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import moment from 'moment';

// 获取当前脚本文件的URL
const url = import.meta.url;
const __dirname = dirname(fileURLToPath(url));

// 加载数据文件
export const loadFile = (src) => {
  // 数据文件的路径
  const path = resolve(__dirname, '..', src);
  // 读取文件
  const context = readFileSync(path, 'utf-8');
  return context;
}

// 保存文章
export const saveArticle = (title, article) => {
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
  console.log('文章保存于: ', outFile)
}

// const context = loadFile('./data.json')
// console.log('context: ', context);
