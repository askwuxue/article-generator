// import { context } from './index.js';
import { createRandomPick, randomInt } from './random.js';

// 生成文章
export const generate = ({
  context,
  articleMin = 2000,
  articleMax = 10000,
  sectionMin = 200,
  sectionMax = 500,
} = {}) => {
  const corpus = JSON.parse(context);
  const { title, famous, bosh_before, bosh, said, conclude } = corpus;
  const [ PickTitle, pickFamous, pickBoshBefore, pickBosh, pickSaid, pickConclude ] = [title, famous, bosh_before, bosh, said, conclude].map((item) => {
    return createRandomPick(item);
  });
  // 生成一句话
const sentence = (picker, config) => {
  const configArr = Object.entries(config);
  return function() {
    // 获取文本
    let text = picker();
    // 如果配置的是函数，则调用该函数
    configArr.forEach(([key, value]) => {
      text = text.replace(new RegExp(`{{${key}}}`, 'g'), typeof value === 'function' ? value() : value);
    });
    return text;
  }
};

// 生成一句废话前缀
const pickBoshBeforeSentence = sentence(pickBoshBefore, { title: PickTitle });
// 生成一句废话
const pickBoshSentence = sentence(pickBosh, { title: PickTitle });
// 生成一句名言
const pickFamousSentence = sentence(pickFamous, { said: pickSaid, conclude: pickConclude });

// 生成段落
const generateSection = (min, max) => {
  const length = randomInt(min, max);
  let section = '';
  // 段落长度不达标或者不是以句号或者问号结尾
  while(section.length < length || !/[。？]$/.test(section)) {
    const random = randomInt(0, 100);
    if (random < 20) {
      section += pickFamousSentence();
    } else if (random < 50) {
      section += `${pickBoshBeforeSentence()}${pickBoshSentence()}`
    } else {
      section += pickBoshSentence();
    }
  }
  return section;
};

  // 随机生成文章字数
  const length = randomInt(articleMin, articleMax);
  const article = []
  let totalLength = 0;
  while(totalLength < length) {
    const section = generateSection(sectionMin, sectionMax);
    article.push(section);
    totalLength += section.length;
  }
  return article;
}