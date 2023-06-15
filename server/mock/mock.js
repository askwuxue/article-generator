import fs from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// 获取当前脚本文件的URL
const shellUrl = import.meta.url;
const __dirname = dirname(fileURLToPath(shellUrl));

let dataCache = null;

function loadData() {
  if(!dataCache) {
    const file = path.resolve(__dirname, './data.json');
    const data = JSON.parse(fs.readFileSync(file, {encoding: 'utf-8'}));
    const reports = data.dailyReports; // 数组格式的数据
    dataCache = {};
    // 把数组数据转换成以日期为key的JSON格式并缓存起来
    reports.forEach((report) => {
      if (report) {
        dataCache[report.updatedDate] = report;
      }
    });
  }
  return dataCache;
}

function getCoronavirusKeyIndex() {
  return Object.keys(loadData());
}

function getCoronavirusByDate(date) {
  const dailyData = loadData()[date] || {};
  if(dailyData.countries) {
    // 按照各国确诊人数排序
    dailyData.countries.sort((a, b) => {
      return b.confirmed - a.confirmed;
    });
  }
  return dailyData;
}

export {
  getCoronavirusByDate,
  getCoronavirusKeyIndex
}