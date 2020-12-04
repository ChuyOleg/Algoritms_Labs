"use strict";

const diceNames = ['img/dice_one.svg', 'img/dice_two.svg', 'img/dice_three.svg', 'img/dice_four.svg', 'img/dice_five.svg', 'img/dice_six.svg'];
const rollDiceButton = document.querySelector('.rollDice');
const attempsNum = document.querySelector('.attempsNum');
const dices = document.querySelectorAll('.diceRow div');
const playerColumn = document.querySelectorAll('.player');
const computerColumn = document.querySelectorAll('.computer');
let player = 'user';

const randomFromTo = (from, to) => Math.floor(from + (Math.random() * (to - from + 1)));

const savedDices = {'0': null, '1': null, '2': null, '3': null, '4': null};

const generateDices = () => {
  const newDices = {};
  for (const key in savedDices) {
    if (savedDices[key] === null) {
      newDices[key] = randomFromTo(1, 6);
    }
  }
  return newDices;
}

const checkNumbers = (numbersArr) => {
  let result = [0, 0, 0, 0, 0, 0];
  numbersArr.forEach(number => {
    if (number == 1) result[0] += 1;
    if (number == 2) result[1] += 2;
    if (number == 3) result[2] += 3;
    if (number == 4) result[3] += 4;
    if (number == 5) result[4] += 5;
    if (number == 6) result[5] += 6;
  });
  return result;
};

const checkStraight = (numbersArr, rollNum) => {
  let result = 0;
  for (let num = 1; num <= 5; num++) {
    if (!(numbersArr.includes(`${num}`))) break;
    if (num === 5) result = (rollNum === 3) ? 25 : 20; 
  }
  for (let num = 2; num <= 6; num++) {
    if (!(numbersArr.includes(num))) break;
    if (num === 6) result = (rollNum === 3) ? 25 : 20;
  }
  return result;
};

const checkFullHouse = (numbersArr, rollNum) => {
  
};

const checkCombinations = (numbersArr, rollNum) => {
  const activeColumn = (player === 'user' ? playerColumn : computerColumn);
  const numbers = checkNumbers(numbersArr);
  const straight = checkStraight(numbersArr, rollNum);
};

const rollDice = () => {
  const diff = (player === 'user') ? 5 : 10;
  if (attempsNum.innerText >= 1) {
    const newDices = generateDices();
    for (const dice in newDices) {
      const diceName = diceNames[newDices[dice] - 1];
      const index = Number.parseInt(dice) + diff;
      dices[index].style.background = `url(${diceName})`;
      dices[index].id = newDices[dice];
    }
    const numbers = [];
    for (let i = diff; i < diff + 5; i++) {
      numbers.push(dices[i].id);
    }
    checkCombinations(numbers, attempsNum.innerText);
    attempsNum.innerText--;
  }
}

const save_deleteDice = (dice, index) => {
  const diceIndex = index % 5;
  const diceClass = dice.classList[0];
  
  if (savedDices[diceIndex] === null && diceClass === 'activeDice') {
    savedDices[diceIndex] = dice.id;
    dice.style.background = 'white';
    const diceImageName = diceNames[savedDices[diceIndex] - 1];    
    dices[index - 5].style.background = `url(${diceImageName})`;
  } else if (savedDices[diceIndex] != null && diceClass === 'savedDice') {
    const diceImageName = diceNames[savedDices[diceIndex] - 1];
    savedDices[diceIndex] = null;
    dice.style.background = 'white';
    dices[index + 5].style.background = `url(${diceImageName})`;
  }

}

rollDiceButton.addEventListener('click', rollDice);
dices.forEach((dice, index) => dice.addEventListener('click', save_deleteDice.bind(null, dice, index)));
