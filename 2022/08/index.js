// Dependencies
const { resolve } = require('path');
const { readFile } = require('fs/promises');

function treeIsVisible(column, row, grid) {
  const visible = {
    left: true,
    right: true,
    top: true,
    bottom: true
  };

  const height = grid[row][column];
  const rightSteps = (grid[row].length - 1) - column;
  const bottomSteps = (grid.length - 1) - row;
  // Check left
  for (let i = (column - 1); i >= 0; i--) {
    const leftHeight = grid[row][i];
    if (leftHeight >= height) {
      visible.left = false;
      break;
    }
  }
  // Check right
  for (let i = (column + 1); i < (rightSteps + (column + 1)); i++) {
    const rightHeight = grid[row][i];
    if (rightHeight >= height) {
      visible.right = false;
      break;
    }
  }
  // Check top
  for (let i = (row - 1); i >= 0; i--) {
    const topHeight = grid[i][column];
    if (topHeight >= height) {
      visible.top = false;
      break;
    }
  }
  // Check bottom
  for (let i = (row + 1); i < (bottomSteps + (row + 1)); i++) {
    const bottomHeight = grid[i][column];
    if (bottomHeight >= height) {
      visible.bottom = false;
      break;
    }
  }
  return visible.left || visible.right || visible.top || visible.bottom;
}

function calculateTreeScenicScore(column, row, grid) {
  const viewgrid = {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0
  }
  const height = grid[row][column];
  const rightSteps = (grid[row].length - 1) - column;
  const bottomSteps = (grid.length - 1) - row;
  // Calculate left
  for (let i = (column - 1); i >= 0; i--) {
    viewgrid.left += 1;
    const leftHeight = grid[row][i];
    if (leftHeight >= height) {
      break;
    }
  }
  // Calculate right
  for (let i = (column + 1); i < (rightSteps + (column + 1)); i++) {
    viewgrid.right += 1;
    const rightHeight = grid[row][i];
    if (rightHeight >= height) {
      break;
    }
  }
  // Calculate top
  for (let i = (row - 1); i >= 0; i--) {
    viewgrid.top += 1;
    const topHeight = grid[i][column];
    if (topHeight >= height) {
      break;
    }
  }
  // Calculate bottom
  for (let i = (row + 1); i < (bottomSteps + (row + 1)); i++) {
    viewgrid.bottom += 1;
    const bottomHeight = grid[i][column];
    if (bottomHeight >= height) {
      break;
    }
  }
  return viewgrid.left * viewgrid.right * viewgrid.top * viewgrid.bottom;
}

(async () => {
  const filePath = resolve(__dirname, './data.txt');
  const data = await readFile(filePath, 'utf-8');

  const rows = data.split(/\r?\n/).filter(Boolean);
  const grid = rows.map(row => row.split('').map(value => parseInt(value)));

  let treesVisible = 0;
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      if (!row) {
        // First row (top edge of grid)
        treesVisible += 1;
      } else if (row === (grid.length - 1)) {
        // Last row (bottom edge of grid)
        treesVisible += 1;
      } else if (!column || column === (grid[row].length - 1)) {
        // First or last tree on row (left or right edge of grid)
        treesVisible += 1;
      } else {
        if (treeIsVisible(column, row, grid)) {
          treesVisible += 1;
        }
      }
    }
  }
  
  console.log(`[Part 1]: The number of trees that are visible are: ${treesVisible}`);

  const scoreboard = {};
  for (let row = 0; row < grid.length; row++) {
    for (let column = 0; column < grid[row].length; column++) {
      const score = calculateTreeScenicScore(column, row, grid);
      scoreboard[`${column}-${row}`] = score;
    }
  }
  const sortedScoreList = Object.values(scoreboard).sort((scoreA, scoreB) => {
    if (scoreA < scoreB) return 1;
    if (scoreA > scoreB) return -1;
    return 0;
  });
  
  console.log(`[Part 2]: The highest view scoring of all trees is: ${sortedScoreList[0]}`);

})();