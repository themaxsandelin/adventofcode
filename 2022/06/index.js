// Dependencies
const { resolve } = require('path');
const { readFile } = require('fs/promises');

function findFirstOccuranceOfSeriesOfUniqueCharacters(textString, characterCount) {
  let index;
  const characters = textString.split('');

  for (let i = 0; i < characters.length; i++) {
    const character = characters[i];
    let charGroup = `${character}`;
    for (let j = (i + 1); j < (i + characterCount); j++) {
      const siblingCharacter = characters[j];
      if (charGroup.includes(siblingCharacter)) {
        break;
      }
      charGroup += siblingCharacter;
    }
    if (charGroup.length === characterCount) {
      index = i + characterCount;
      break;
    }
  }
  return index;
}

(async () => {
  const filePath = resolve(__dirname, './data.txt');
  const message = await readFile(filePath, 'utf-8');
  
  const firstNumber = findFirstOccuranceOfSeriesOfUniqueCharacters(message, 4);
  console.log(`[Part 1]: The number of characters processed before first start-of-packet marker is detected is: ${firstNumber}`);

  const secondNUmber = findFirstOccuranceOfSeriesOfUniqueCharacters(message, 14);
  console.log(`[Part 2]: The number of characters processed before first start-of-message marker is detected is: ${secondNUmber}`);
})();