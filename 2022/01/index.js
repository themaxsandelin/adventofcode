// Dependencies
const { resolve } = require('path');
const { readFile } = require('fs/promises');

(async () => {
  const filePath = resolve(__dirname, './data.txt');
  const data = await readFile(filePath, 'utf-8');
  const lines = data.split(/\r?\n/);
  
  const elfList = [];
  let elfIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    if (lines[i] !== '') {
      const value = parseInt(lines[i]);
      if (!elfList[elfIndex]) {
        elfList[elfIndex] = {
          calories: 0
        };
      }
      elfList[elfIndex].calories += value;
    } else {
      elfIndex++;
    }
  }

  elfList.sort((elfA, elfB) => {
    if (elfA.calories < elfB.calories) return 1;
    if (elfA.calories > elfB.calories) return -1;
    return 0;
  });

  console.log(`Part 1: Elf with the most calories has ${elfList[0].calories}.`);

  const topThreeTotal = elfList.slice(0, 3).reduce((total, elf) => total + elf.calories, 0);
  console.log(`Part 2: The 3 elfs with the most calories have a total of ${topThreeTotal} calories altogether.`);
})();