// Dependencies
const { resolve } = require('path');
const { readFile } = require('fs/promises');

const callDetails = {
  rock: {
    keys: ['A', 'X'],
    score: 1,
    win: 'paper',
    lose: 'scissors',
    draw: 'rock'
  },
  paper: {
    keys: ['B', 'Y'],
    score: 2,
    win: 'scissors',
    lose: 'rock',
    draw: 'paper'
  },
  scissors: {
    keys: ['C', 'Z'],
    score: 3,
    win: 'rock',
    lose: 'paper',
    draw: 'scissors'
  }
}

const matchOutcomes = {
  'X': 'lose',
  'Y': 'draw',
  'Z': 'win'
}

function getMatchScore(elfCall, myCall) {
  // Default to lose
  let outcomeScore = 0;
  if (myCall === elfCall) {
    // It's a draw
    outcomeScore = 3;
  } else if ((myCall === 'rock' && elfCall === 'scissors') || (myCall === 'paper' && elfCall === 'rock') || (myCall === 'scissors' && elfCall === 'paper')) {
    // I win
    outcomeScore = 6;
  }
  return outcomeScore + callDetails[myCall].score;
}

function getCallFromKey(key) {
  let call;
  const callKeys = Object.keys(callDetails);
  for (let i = 0; i < callKeys.length; i++) {
    const callKey = callKeys[i];
    if (callDetails[callKey].keys.includes(key)) {
      call = callKey;
      break;
    }
  }
  return call;
}

function getMatchScoreFromCalls(elfCallKey, myCallKey) {
  const elfCall = getCallFromKey(elfCallKey);
  const myCall = getCallFromKey(myCallKey);
  return getMatchScore(elfCall, myCall);
}

function getMatchScoreFromOutcome(elfCallKey, outcomeKey) {
  const elfCall = getCallFromKey(elfCallKey);
  const outcome = matchOutcomes[outcomeKey];
  const myCall = callDetails[elfCall][outcome];
  return getMatchScore(elfCall, myCall);
}

(async () => {
  const filePath = resolve(__dirname, './data.txt');
  const data = await readFile(filePath, 'utf-8');
  const matches = data.split(/\r?\n/).filter(Boolean);

  const firstScore = matches.reduce((totalScore, match) => {
    const [elfCallKey, myCallKey] = match.split(' ');
    return totalScore + getMatchScoreFromCalls(elfCallKey, myCallKey);
  }, 0);

  console.log(`Part 1: My total score is: ${firstScore}`);

  const secondScore = matches.reduce((totalScore, match) => {
    const [elfCallKey, outcomeKey] = match.split(' ');
    return totalScore + getMatchScoreFromOutcome(elfCallKey, outcomeKey);
  }, 0);

  console.log(`Part 2: My total score is: ${secondScore}`);
})();