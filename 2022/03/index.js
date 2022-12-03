// Dependencies
const { resolve } = require('path');
const { readFile } = require('fs/promises');

const priorities = [
  ...Array.from({ length: 26 }, (_, i) => String.fromCharCode('a'.charCodeAt(0) + i)),
  ...Array.from({ length: 26 }, (_, i) => String.fromCharCode('A'.charCodeAt(0) + i))
];

(async () => {
  const filePath = resolve(__dirname, './data.txt');
  const data = await readFile(filePath, 'utf-8');
  const rucksacks = data.split(/\r?\n/).filter(Boolean);
  
  const total = rucksacks.reduce((total, contents) => {
    const compartmentSize = contents.length / 2;
    const firstCompartment = contents.slice(0, compartmentSize);
    const secondCompartment = contents.slice(compartmentSize, contents.length);
    const commonCharacter = firstCompartment.split('').find(character => secondCompartment.includes(character));
    return total + (priorities.indexOf(commonCharacter) + 1);
  }, 0);
  console.log(`Part 1: The sum of the common characters based on priority score is ${total}.`);

  const elfGroups = Array.from({ length: (rucksacks.length / 3) }, () => rucksacks.splice(0, 3));
  const groupTotal = elfGroups.reduce((total, group) => {
    const [ firstElf, secondElf, thirdElf ] = group;
    const commonCharacter = firstElf.split('').find(character => secondElf.includes(character) && thirdElf.includes(character));
    return total + (priorities.indexOf(commonCharacter) + 1);
  }, 0);
  console.log(`Part 2: The sum of the common characters among the groups of 3 elfs is: ${groupTotal}`);
})();