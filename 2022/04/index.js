// Dependencies
const { resolve } = require('path');
const { readFile } = require('fs/promises');

function valueIsWithinRange(value, start, end) {
  return value >= start && value <= end;
}

function valueRangesOverlay(firstRangeStart, firstRangeEnd, secondRangeStart, secondRangeEnd) {
  return (
    firstRangeStart >= secondRangeStart && firstRangeEnd <= secondRangeEnd
  ) || (
    secondRangeStart >= firstRangeStart && secondRangeEnd <= firstRangeEnd
  )
}

function getPairSections(pair) {
  const [elfOne, elfTwo] = pair.split(',');
  return [elfOne.split('-').map(str => parseInt(str)), elfTwo.split('-').map(str => parseInt(str))];
}

function getPairSectionsOverlap(pair) {
  const [[elfOneSectionStart, elfOneSectionEnd], [elfTwoSectionStart, elfTwoSectionEnd]] = getPairSections(pair);
  return valueRangesOverlay(elfOneSectionStart, elfOneSectionEnd, elfTwoSectionStart, elfTwoSectionEnd);
}

function getPairSectionsAnyOverlap(pair) {
  const [[elfOneSectionStart, elfOneSectionEnd], [elfTwoSectionStart, elfTwoSectionEnd]] = getPairSections(pair);
  return (
    valueIsWithinRange(elfOneSectionStart, elfTwoSectionStart, elfTwoSectionEnd) || 
    valueIsWithinRange(elfOneSectionEnd, elfTwoSectionStart, elfTwoSectionEnd) || 
    valueIsWithinRange(elfTwoSectionStart, elfOneSectionStart, elfOneSectionEnd) ||
    valueIsWithinRange(elfTwoSectionEnd, elfOneSectionStart, elfOneSectionEnd)
  );
}

(async () => {
  const filePath = resolve(__dirname, './data.txt');
  const data = await readFile(filePath, 'utf-8');
  const pairs = data.split(/\r?\n/).filter(Boolean);

  const totalPairSectionOverlap = pairs.reduce((count, pair) => {
    const pairSectionsOverlap = getPairSectionsOverlap(pair);
    return count + (pairSectionsOverlap ? 1 : 0);
  }, 0);

  console.log(`[Part 1] The number of pairs where the sections overlap is: ${totalPairSectionOverlap}`);

  const totalPairSectionAnyOverlap = pairs.reduce((count, pair) => {
    const pairSectionsAnyOverlap = getPairSectionsAnyOverlap(pair);
    return count + (pairSectionsAnyOverlap ? 1 : 0);
  }, 0);

  console.log(`[Part 2] The number of pairs where the sections overlap at all is: ${totalPairSectionAnyOverlap}`);
})();