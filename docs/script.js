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

const pause = ms => {
  const dt = new Date();
  while ((new Date()) - dt <= ms) {};
};

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

const checkGameEnd = () => {
  const closedRows = document.querySelectorAll('#close');
  if (closedRows.length === 20) {
    const message = (Number.parseInt(userResult.innerText) > Number.parseInt(computerResult.innerText)) ? 'You win!' : 'You lose!';
    rollDiceButton.style.display = 'none';
    alert (message);
  }
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
    if (!(numbersArr.includes(`${num}`))) break;
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
  if (numbers.includes(4) || numbers.includes(5)) result = (rollNum === '3') ? 45 : 40;
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

    // DELETE
    checkProbabilities();
  }
}

const save_deleteDice = (dice, index) => {
  const diceIndex = index % 5;
  const diceClass = dice.classList[0];
  if (Number.parseInt(attempsNum.innerText) < 3) {
    
    let condition = false;
    if (player === 'user' && index < 10) condition = true;
    else if (player === 'computer' && index >= 10) condition = true;
	  
	  if (savedDices[diceIndex] === null && diceClass === 'activeDice' && condition) {
	    savedDices[diceIndex] = dice.id;
	    dice.style.background = 'white';
	    const diceImageName = diceNames[savedDices[diceIndex] - 1];
	    const diceNum = (player === 'user') ? index - 5 : index + 5;
	    dices[diceNum].style.background = `url(${diceImageName})`;
	  } else if (savedDices[diceIndex] != null && diceClass === 'savedDice' && condition) {
	    const diceImageName = diceNames[savedDices[diceIndex] - 1];
	    savedDices[diceIndex] = null;
	    dice.style.background = 'white';
	    const diceNum = (player === 'user') ? index + 5 : index - 5;
	    dices[diceNum].style.background = `url(${diceImageName})`;
	  }
  
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
    checkGameEnd();
	  player = (player === 'user') ? 'computer' : 'user';
	  attempsNum.innerText = 3;
  }
};

rollDiceButton.addEventListener('click', rollDice);
dices.forEach((dice, index) => dice.addEventListener('click', save_deleteDice.bind(null, dice, index)));
userColumn.forEach((column, index) => column.addEventListener('click', saveValueInTable.bind(null, column)));
computerColumn.forEach((column, index) => column.addEventListener('click', saveValueInTable.bind(null, column)));

const heuristicFunc = () => {
  bestResult = [0, 0];
  computerColumn.forEach((column, index) => {
    const columnValue = Number.parseInt(column.innerText);
    if (columnValue > bestResult[0] && column.style['background-color'] === 'yellow') {
      bestResult[0] = columnValue;
      bestResult[1] = index;
    }
  });
}

const checkStraightProbability = (savedArr, quantitySavedDices) => {
  let straight = 1;

  if (savedArr.includes(2) || savedArr.includes(3) || savedArr.includes(4) || savedArr.includes(5)) {
    straight = 0;
  } else if (savedArr[0] >= 1 && savedArr[5] >= 1) {
    straight = 0;
  } else {
    for (let i = 1; i <= 5 - quantitySavedDices; i++) {
    	straight = straight * i
    }
    straight = straight * ((1 / 6) ** (5 - quantitySavedDices));
    if (savedArr[0] === 0 && savedArr[5] === 0) straight = straight * 2;
  }
  return straight;
}

const checkGeneralProbability = (savedArr, quantitySavedDices) => {
  let general = 1;

  if (!(savedArr.includes(quantitySavedDices))) {
    general = 0;
  } else if (quantitySavedDices === 0) {
    general = 6 * ((1 / 6) ** 5);
  } else {
    general = (1 / 6) ** (5 - quantitySavedDices);
  }
  return general;
}

const checkFourOneTypeProbability = (savedArr, quantitySavedDices) => {
  let fourOneType = 1;
  console.log(savedArr);

  if (quantitySavedDices === 4 && (!(savedArr.includes(2) || savedArr.includes(3))) ) {
    fourOneType = 0;
  } else if (quantitySavedDices === 3 && (!(savedArr.includes(2) || savedArr.includes(3)))) {
    fourOneType = 0;
  } else if (savedArr.includes(quantitySavedDices)) {
    fourOneType = ((5 - quantitySavedDices) * ((1 / 6) ** (4 - quantitySavedDices)) * (5 / 6));
    if (quantitySavedDices === 0) fourOneType = fourOneType * 6;
    if (quantitySavedDices === 1) fourOneType += (5 * ((1 / 6) ** 4));
  } else {
    fourOneType = ((1 / 6) ** (5 - quantitySavedDices));
    if (quantitySavedDices === 2) fourOneType = fourOneType * 2;
  }

  return fourOneType;
}

const checkProbabilities = () => {

  let arrNums = [savedDices['0'], savedDices['1'], savedDices['2'], savedDices['3'], savedDices['4']];

  const savedArr = checkNumbers(arrNums);
  let quantitySavedDices = 0;

  for (let num = 0; num < savedArr.length; num++) {
    quantitySavedDices += savedArr[num];
  };
  
  const straight = checkStraightProbability(savedArr, quantitySavedDices);
  const general = checkGeneralProbability(savedArr, quantitySavedDices);
  const fourOneType = checkFourOneTypeProbability(savedArr, quantitySavedDices) + general; 
  
  // console.log(straight);
  // console.log(general);
  console.log(fourOneType);

  /*
   if  quantity === 5 do not need to count probabilities
   */

    /*
    FIND ForOneType PROBABILITY
    if (saveDices includes 3 or more different types or 2 type 2 nums then ForOneType = 0)
    else if (all Nums are one type) ForOneType = general + ((5 - quantity) * ((1 / 6) ** (4 - quantity)) * (5 / 6))
      if (quantity === 0) ForOneType = ForOneType * 6
      if (quantity === 1) ForOneType += (5 * ((1 / 6) ** 4));
    else {
      ForOneType = general + {
	      ((1 / 6) ** (5 - quantity))
	      if (quantity === 2) ForOneType = ForOneType * 2;
      }
    }
    */


    /*
    FIND FullHouse PROBABILITY
    if (savedDices includes 3 or more diff types || savedDices includes 4 one type)
    else if (savedDices includes one type) FullHouse = 5;
      if (quantity === 1) FullHouse = 34 * ((1 / 6) ** 4);
      if (quantity === 2) FullHouse = 20 * ((1 / 6) ** 3)
      if (quantity === 3) FullHouse = 5 * ((1 / 6) ** 2);
    else if (saveDices includes diff types)
      if (quantity === 2) FullHouse = 1 / 36;
      if (quantity === 3) FullHouse = 3 / 36;
      if (quantity === 4 and includes (3 + 1)) FullHouse = 1 / 6;
      if (quantity === 4 and includes (2 + 2)) FullHouse = 2 / 5;  
      
     */

}

const computerAlgorithm = () => {
  rollDice();
  let bestResult = [0, 0];
  computerColumn.forEach((column, index) => {
    const columnValue = Number.parseInt(column.innerText);
    if (columnValue > bestResult[0] && column.style['background-color'] === 'yellow') {
      bestResult[0] = columnValue;
      bestResult[1] = index;
    }
  });
  checkProbabilities();
  const bestColumn = computerColumn[bestResult[1]];
  // console.log(bestResult[1]);
  // saveValueInTable(bestColumn);
}

const startGame = () => {
  rollDiceButton.addEventListener('click', rollDice);
  dices.forEach((dice, index) => dice.addEventListener('click', save_deleteDice.bind(null, dice, index)));
  userColumn.forEach((column, index) => column.addEventListener('click', () => {
    saveValueInTable(column);
    if (player === 'computer') computerAlgorithm();  
  }));
  computerColumn.forEach((column, index) => column.addEventListener('click', saveValueInTable.bind(null, column)));
};

startGame();
