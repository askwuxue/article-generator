import _ from 'lodash';

import { generate } from './libs/generate.js';
import { createRandomPick } from './libs/random.js';
import { parseOptions } from './cmd/index.js';
import { saveArticle, loadFile } from './corpus/index.js';
import { interact } from './cmd/interact.js';

const { isEmpty } = _;

const QuestionConfig = [
  { text: '请输入文章标题', key: 'title', value: '狗屁不通' },
  { text: '请输入文章字数下限', key: 'articleMin', value: 2000 },
  { text: '请输入文章字数上限', key: 'articleMax', value: 10000 },
]

// 根据命令行获取参数
const config = parseOptions();

// 启动命令没有追加额外参数，使用询问的方式
(async () => {
  let finalConfig = {};
  if (isEmpty(config)) {
    const answersConfig = await interact(QuestionConfig);
    finalConfig = {...(answersConfig.reduce((acc, cur) => ({...acc, ...cur}), {}))};
  } else {
    finalConfig = {...config};
  }
  // 读取数据文件
  const context = loadFile('./corpus/data.json');
  // 生成文章标题
  const title = createRandomPick(JSON.parse(context).title)();
  // 生成文章
  const article = generate({context, ...finalConfig});
  // 保存文章
  saveArticle(title, article);
})()
