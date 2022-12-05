// Dependencies
const { resolve } = require('path');
const { readFile } = require('fs/promises');

const crateCharWidth = 3;
const crateCharSpace = 1;

(async () => {
  const filePath = resolve(__dirname, './data.txt');
  const data = await readFile(filePath, 'utf-8');
  const lines = data.split(/\r?\n/).filter(Boolean);

  const firstMoveIndex = lines.findIndex(line => line.includes('move'));
  const moveLines = lines.slice(firstMoveIndex, lines.length);
  const crateLines = lines.slice(0, firstMoveIndex - 1);
  
  const stackLine = lines.slice(firstMoveIndex - 1, firstMoveIndex)[0];
  const stackCount = stackLine.replaceAll(' ', '').split('').length;

  const stacks = Array.from({ length: stackCount }, () => []);
  crateLines.reverse().forEach(crateLine => {
    for (j = 0; j < stackCount; j++) {
      const jumpIndex = j * (crateCharWidth + crateCharSpace);
      const crate = crateLine.substring(jumpIndex, jumpIndex + crateCharWidth);
      if (crate.includes('[')) {
        const char = crate.substring(1, 2);
        stacks[j].push(char);
      }
    }
  });
  const firstStacks = JSON.parse(JSON.stringify(stacks));
  const secondStacks = JSON.parse(JSON.stringify(stacks));

  // Part 1
  moveLines.forEach(moveLine => {
    const [ amount, from, to ] = moveLine.replace('move ', '').replace('from ', '').replace(' to', '').split(' ').map(value => parseInt(value));
    const fromIndex = from - 1;
    const toIndex = to - 1;
    for (let i = 0; i < amount; i++) {
      const char = firstStacks[fromIndex].splice(firstStacks[fromIndex].length - 1, 1)[0];
      firstStacks[toIndex].push(char);
    }
  });
  const firstMessage = firstStacks.reduce((str, stack) => `${str}${stack[stack.length - 1]}`, '');
  console.log(`[Part 1]: The message is ${firstMessage}.`);

  // Part 2
  moveLines.forEach((moveLine, i) => {
    const [ amount, from, to ] = moveLine.replace('move ', '').replace('from ', '').replace(' to', '').split(' ').map(value => parseInt(value));
    const fromIndex = from - 1;
    const toIndex = to - 1;
    const charsList = secondStacks[fromIndex].splice(secondStacks[fromIndex].length - amount, amount);
    secondStacks[toIndex] = [...secondStacks[toIndex], ...charsList];
  });

  const secondMessage = secondStacks.reduce((str, stack) => `${str}${stack[stack.length - 1]}`, '');
  console.log(`[Part 2]: The message is ${secondMessage}.`);
})();