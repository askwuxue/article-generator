import { generate } from './generate.js';
import { createRandomPick } from './random.js';
import { parseOptions } from './cmd/index.js';
import { saveArticle, loadFile } from './corpus/index.js';

// 根据命令行获取参数
const config = parseOptions();
// 读取数据文件
const context = loadFile('./corpus/data.json');
// 生成文章标题
const title = createRandomPick(JSON.parse(context).title)();
// 生成文章
const article = generate({context, ...config});
// 保存文章
saveArticle(title, article);
