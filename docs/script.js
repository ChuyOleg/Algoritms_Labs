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

const sleep = ms => new Promise(res => setTimeout(res, ms));

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
	const endDiceNum = (player === 'user') ? 20 : 10;
	const startDiceNum = (player === 'user') ? 10 : 0;
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
  if (closedRows.length === 20 || Number.parseInt(userResult.innerText) > 1000 || Number.parseInt(computerResult.innerText) > 1000) {
    let message = (Number.parseInt(userResult.innerText) > Number.parseInt(computerResult.innerText)) ? 'You win!' : 'You lose!';
    if (Number.parseInt(userResult.innerText) === Number.parseInt(computerResult.innerText)) message = 'Draw!';
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

  if (attempsNum.innerText == 3) clearDiceRow();

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

    countResult();
    for (const key in savedDices) {
      savedDices[key] = null;
    }

	  player = (player === 'user') ? 'computer' : 'user';
	  if (player === 'computer') rollDiceButton.style.display = 'none';
	  else rollDiceButton.style.display = 'block';
    checkGameEnd();
	  attempsNum.innerText = 3;
  }
};

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
  
  if (savedArr.includes(4)) fourOneType = 5 / 6;
  else if (quantitySavedDices === 5) fourOneType = 0;
  else if (quantitySavedDices === 4 && (!savedArr.includes(3)) ) {
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

const checkFullHouseProbability = (savedArr, quantitySavedDices) => {
  let fullHouse = 1;
  
  
  if (savedArr.includes(2) && savedArr.includes(3)) return fullHouse;
  else if (savedArr.includes(4)) fullHouse = 0;
  else if (savedArr.includes(quantitySavedDices)) {
  	if (quantitySavedDices === 0) fullHouse = 10 * 5 * ((1 / 6) ** 4);
    if (quantitySavedDices === 1) fullHouse = 34 * ((1 / 6) ** 4);
    if (quantitySavedDices === 2) fullHouse = 20 * ((1 / 6) ** 3);
    if (quantitySavedDices === 3) fullHouse = 5 * ((1 / 6) ** 2);
  } else if (quantitySavedDices === 2) fullHouse = 1 / 36;
  else if (quantitySavedDices === 3 && savedArr.includes(2)) fullHouse = 3 / 36;
  else if (quantitySavedDices === 4 && savedArr.includes(3)) fullHouse = 1 / 6;
  else if (quantitySavedDices === 4 && savedArr.includes(2) && !(savedArr.includes(1)) ) fullHouse = 2 / 6;
  else fullHouse = 0;
  
  return fullHouse;
}

const checkProbabilities = () => {

  let arrNums = [savedDices['0'], savedDices['1'], savedDices['2'], savedDices['3'], savedDices['4']];

  const savedArr = checkNumbers(arrNums);
  let quantitySavedDices = 0;
  const combinationsPrice = { 'straight': 20, 'fullHouse': 30, 'fourOneType': 40, 'general': 60 };

  for (let num = 0; num < savedArr.length; num++) {
    quantitySavedDices += savedArr[num];
  };

  let straight = 0;
  let general = 0;
  let fourOneType = 0;
  let fullHouse = 0;

  if (computerColumn[6].style['background-color'] === 'yellow') {
    straight = checkStraightProbability(savedArr, quantitySavedDices) * combinationsPrice['straight'];
  }
  if (computerColumn[9].style['background-color'] === 'yellow') {
    general = checkGeneralProbability(savedArr, quantitySavedDices) * combinationsPrice['general'];
  }
  if (computerColumn[8].style['background-color'] === 'yellow') {
  	if (general === 60) fourOneType = 40;
  	else {
  	const firstPart = checkFourOneTypeProbability(savedArr, quantitySavedDices);
  	const secondPart = checkGeneralProbability(savedArr, quantitySavedDices);
  	fourOneType = (firstPart + secondPart) * combinationsPrice['fourOneType'];
  	}
  }
  if (computerColumn[7].style['background-color'] === 'yellow') {
    fullHouse = checkFullHouseProbability(savedArr, quantitySavedDices) * combinationsPrice['fullHouse'];
  }

  return [straight, fullHouse, fourOneType, general];
}

const heuristicFunc = (names, bestMove) => {

  const probabilities = checkProbabilities();
  probabilities.forEach((el, index) => {
    if (el > bestMove['value']) {
      bestMove['value'] = el;
      bestMove['combinationName'] = names[index];
      bestMove['savedCombination'] = {};
      for (const key in savedDices) {
        bestMove['savedCombination'][key] = savedDices[`${key}`];
      }
    }
  });
};

const startRecursia = async (startDice, names, bestMove) => {
  if (startDice === 15) return;
  for (let diceNum = startDice; diceNum < 15; diceNum++) {
    save_deleteDice(dices[diceNum], diceNum);
    // await sleep(100);
    heuristicFunc(names, bestMove);
    await startRecursia((diceNum + 1), names, bestMove);
    save_deleteDice(dices[diceNum + 5], (diceNum + 5));
    // await sleep(100);
  }
}

const computerAlgorithm = async () => {

  rollDice();
  await sleep(1000);

  const bestResult = [0, 0];
	  
  computerColumn.forEach((column, index) => {
    const columnValue = Number.parseInt(column.innerText);
    if (columnValue > bestResult[0] && column.style['background-color'] === 'yellow') {
      bestResult[0] = columnValue;
      bestResult[1] = index;
    }
  });

  if (attempsNum.innerText == 2) {
    
    if (bestResult[0] >= 25) {
      const bestColumn = computerColumn[bestResult[1]];
      saveValueInTable(bestColumn);
      return;
    };
  
  };

  if (attempsNum.innerText == 0) {
    console.log(bestResult);
    return;  
  };

  const names = ['straight', 'fullHouse', 'fourOneType', 'general'];

  let counter = 0;
  const bestMove = {'value': 0, 'savedCombination': {}, 'combinationName': null};

  await startRecursia(10, names, bestMove);
  
  const activePoints = [0, 0, 0, 0, 0, 0];

  for (let cellNum = 0; cellNum < 6; cellNum++) {
    if (computerColumn[cellNum].style['background-color'] === 'yellow') {
      activePoints[cellNum] = Number.parseInt(computerColumn[cellNum].innerText);
    }
  }

  activePoints.forEach((point, index) => {
    if ((point / 2.2) > bestMove['value']) {
      bestMove['value'] = point / 2.2;
    	for (let diceNum = 10; diceNum < 15; diceNum++) {
    	  if (Number.parseInt(dices[diceNum].id) === (index + 1)) {
          bestMove['savedCombination'][`${diceNum - 10}`] = Number.parseInt(dices[diceNum].id);
    	  } else {
          bestMove['savedCombination'][`${diceNum - 10}`] = null;
    	  }
    	}
      bestMove['combinationName'] = 'number => ' + (index + 1);
    }
  })

  for (const diceNum in bestMove['savedCombination']) {
    if (bestMove['savedCombination'][diceNum] != null) {
    	const diceIndex = 10 + Number.parseInt(diceNum);
      // await sleep(500);
      save_deleteDice(dices[diceIndex], diceIndex);
    }
  }

  console.log(bestMove);
  await computerAlgorithm();
};


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
