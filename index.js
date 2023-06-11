import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

// 获取当前脚本文件的URL
const url = import.meta.url;
// 数据文件的路径
const path = resolve(dirname(fileURLToPath(url)), 'corpus/data.json');

// 读取文件
const context = readFileSync(path, 'utf-8');
