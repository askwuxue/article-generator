import commandLineArgs from 'command-line-args';
import commandLineUsage from 'command-line-usage';

// 配置我们的命令行参数
const optionDefinitions = [
  {name: 'help'},
  {name: 'title', alias: 't', type: String},
  {name: 'articleMin', type: Number},
  {name: 'articleMax', type: Number},
  {name: 'sectionMin', type: Number},
  {name: 'sectionMax', type: Number},
];

// 定义帮助的内容
const sections = [
  {
    header: '狗屁不通文章生成器',
    content: '生成随机的文章段落用于测试',
  },
  {
    header: 'Options',
    optionList: [
      {
        name: 'title',
        typeLabel: '{underline string}',
        description: '文章的主题。',
      },
      {
        name: 'articleMax',
        typeLabel: '{underline number}',
        description: '文章最小字数。',
      },
      {
        name: 'articleMax',
        typeLabel: '{underline number}',
        description: '文章最大字数。',
      },
      {
        name: 'sectionMin',
        typeLabel: '{underline number}',
        description: '段落最小字数。',
      },
      {
        name: 'sectionMax',
        typeLabel: '{underline number}',
        description: '段落最大字数。',
      },
    ],
  },
];

// 解析命令行参数
export const parseOptions = () => {
  const config = commandLineArgs(optionDefinitions);
  if ('help' in config) {
    const usage = commandLineUsage(sections);
    console.log(usage);
    process.exit();
  } else {
    return config;
  }
};