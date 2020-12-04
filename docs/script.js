"use strict";

const diceNames = ['img/dice_one.svg', 'img/dice_two.svg', 'img/dice_three.svg', 'img/dice_four.svg', 'img/dice_five.svg', 'img/dice_six.svg'];
const rollDiceButton = document.querySelector('.rollDice');
const attempsNum = document.querySelector('.attempsNum');
const dices = document.querySelectorAll('.diceRow div');
const userColumn = document.querySelectorAll('.player');
const computerColumn = document.querySelectorAll('.computer');
const userResult = document.querySelector('.playerTotal');
const computerResult = document.querySelector('.computerTotal');
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

const clearDiceRow = () => {
	const endDiceNum = (player === 'user') ? 10 : 20;
	const startDiceNum = (player === 'user') ? 0 : 10;
  for (let index = startDiceNum; index < endDiceNum; index++) {
    dices[index].style.background = 'white';
  }
};

const countResult = () => {
	const resultColumn = (player === "user") ? userResult : computerResult;
	const activeColumn = (player === "user") ? userColumn : computerColumn;
  let result = 0;
  activeColumn.forEach(column => {
    if (column.id === 'close') result += Number.parseInt(column.innerText);
  });
  resultColumn.innerText = result;
};

const checkNumbers = (numbersArr) => {
  const result = [0, 0, 0, 0, 0, 0];
  numbersArr.forEach(number => {
    if (number == 1) result[0] ++;
    if (number == 2) result[1] ++;
    if (number == 3) result[2] ++;
    if (number == 4) result[3] ++;
    if (number == 5) result[4] ++;
    if (number == 6) result[5] ++;
  });
  return result;
};

const checkStraight = (numbersArr, rollNum) => {
  let result = 0;
  for (let num = 1; num <= 5; num++) {
    if (!(numbersArr.includes(`${num}`))) break;
    if (num === 5) result = (rollNum === '3') ? 25 : 20; 
  }
  for (let num = 2; num <= 6; num++) {
    if (!(numbersArr.includes(num))) break;
    if (num === 6) result = (rollNum === '3') ? 25 : 20;
  }
  return result;
};

const checkFullHouse = (numbers, rollNum) => {
  let result = 0;
  if (numbers.includes(2) && numbers.includes(3)) result = (rollNum === '3') ? 35 : 30;
  return result;
};

const checkFourOneType = (numbers, rollNum) => {
  let result = 0;
  if (numbers.includes(4)) result = (rollNum === '3') ? 45 : 40;
  return result;
};

const checkGeneral = (numbers, rollNum) => {
  let result = 0;
  if (numbers.includes(5)) result = (rollNum === '3') ? 1000 : 60;
  return result;
}

const checkCombinations = (numbersArr, rollNum) => {
  const activeColumn = (player === 'user' ? userColumn : computerColumn);
  const result = [];
  const numbers = checkNumbers(numbersArr);
  numbers.map((number, index) => result.push(number * (index + 1)));
  result.push(checkStraight(numbersArr, rollNum));
  result.push(checkFullHouse(numbers, rollNum));
  result.push(checkFourOneType(numbers, rollNum));
  result.push(checkGeneral(numbers, rollNum));
  activeColumn.forEach((column, index) => {
    if (column.id != 'close') { 
      column.innerText = result[index];
      column.style.background = 'yellow';
    }
  });
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
    const diceNum = (player === 'user') ? index - 5 : index + 5;
    dices[diceNum].style.background = `url(${diceImageName})`;
  } else if (savedDices[diceIndex] != null && diceClass === 'savedDice') {
    const diceImageName = diceNames[savedDices[diceIndex] - 1];
    savedDices[diceIndex] = null;
    dice.style.background = 'white';
    const diceNum = (player === 'user') ? index + 5 : index - 5;
    dices[diceNum].style.background = `url(${diceImageName})`;
  }

}

const saveValueInTable = column => {
  if (column.style['background-color'] === 'yellow') {
    column.id = 'close';
    column.style.background = '#e62d47';
    const activeColumn = (player === "user") ? userColumn : computerColumn; 
    activeColumn.forEach(column => {
      
      if (column.id != 'close') {
      	column.innerText = 0;
      	column.style.background = '#9c9dce';
      }
     
    });

    clearDiceRow();
    countResult();
    for (const key in savedDices) {
      savedDices[key] = null;
    }
	  player = (player === 'user') ? 'computer' : 'user';
	  attempsNum.innerText = 3;
  }
};

rollDiceButton.addEventListener('click', rollDice);
dices.forEach((dice, index) => dice.addEventListener('click', save_deleteDice.bind(null, dice, index)));
userColumn.forEach((column, index) => column.addEventListener('click', saveValueInTable.bind(null, column)));
computerColumn.forEach((column, index) => column.addEventListener('click', saveValueInTable.bind(null, column)));
