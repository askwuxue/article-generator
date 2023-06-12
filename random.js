export const randomInt = (min, max) => {
  // min and max included
  const random = Math.random() * (max - min) + min;
  return Math.floor(random);
}

// 高级函数的好处，可以只传参一次，利用闭包。否则每次randomPick 都要传参
export const createRandomPick = (arr) => {
  arr = [...arr];
  const randomPick = () => {
    const len = arr.length;
    const index = randomInt(0, len - 1);
    // 选中的元素
    const picked = arr[index];
    // 交换选中的元素和尾元素，尾元素首次不会被选中，可以做到不重复
    [arr[index], arr[len - 1]] = [arr[len - 1], arr[index]];
    return picked;
  }
  // 抛弃首次选中结果，解决首次永远选不到尾元素的问题
  randomPick();
  return randomPick; 
}