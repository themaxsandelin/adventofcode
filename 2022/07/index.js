// Dependencies
const { resolve } = require('path');
const { readFile } = require('fs/promises');

(async () => {
  const filePath = resolve(__dirname, './data.txt');
  const stdout = await readFile(filePath, 'utf-8');
  const commandLines = stdout.split(/\r?\n/).filter(Boolean);

  const directories = {};
  let currentDirectory = [];

  commandLines.forEach(line => {
    if (line.indexOf('$') === 0) {
      const [, command, param] = line.split(' ');
      if (command === 'cd') {
        if (param === '/') {
          currentDirectory = ['/'];
        } else if (param === '..') {
          currentDirectory.pop();
        } else {
          currentDirectory.push(param);
        }
      }
    } else {
      const [ indicator ] = line.split(' ');
      if (indicator !== 'dir') {
        const size = parseInt(indicator);
        currentDirectory.forEach((_, i) => {
          const name = currentDirectory.slice(0, i + 1);
          const directorySize = directories[name] ? directories[name] : 0;
          directories[name] = directorySize + size;
        });
      }
    }
  });

  const totalSize = Object.values(directories).filter(size => size < 100000).reduce((total, size) => total + size, 0);
  console.log(`[Part 1]: The accumilated size of directories is: ${totalSize}`);

  const totalSpace = 70000000;
  const requiredUnusedSpace = 30000000;
  const usedSpace = directories['/'];
  const spaceNeeded = requiredUnusedSpace - (totalSpace - usedSpace);
  const sizesSortedByClosest = Object.values(directories).sort((sizeA, sizeB) => Math.abs(sizeA - spaceNeeded) - Math.abs(sizeB - spaceNeeded));

  console.log(`[Part 2]: The directory with enough size to save up enough space has a total size of: ${sizesSortedByClosest[0]}`);

})();