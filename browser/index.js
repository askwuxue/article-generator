import { generate } from '../libs/generate.js';
import { createRandomPick } from '../libs/random.js';

const defaultCorpus = require('../corpus/data.json');

async function loadCorpus(corpuspath) {
  if(corpuspath) {
    const corpus = await (await fetch(corpuspath)).json();
    return corpus;
  }
  return defaultCorpus;
}

Object.assign(window, { generate, createRandomPick, loadCorpus })
export { generate, createRandomPick, loadCorpus };
