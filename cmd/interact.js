import readline from 'readline';

const question = (rl, { text, value }) => {
  const q = `${text}(${value})\n`;
  return new Promise((resolve) => {
    rl.question(q, (answer) => {
      resolve(answer || value);
    });
  });
}

export const interact = async (config) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  const answers = [];
  for (const { text, value, key } of config) {
    const answer = await question(rl, { text, value });
    // answer.push(await question(rl, { text: key, value }));
    answers.push({ [key]: answer });
  }
  rl.close();
  return answers;
}