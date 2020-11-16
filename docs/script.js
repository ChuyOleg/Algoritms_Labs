const counters = document.querySelectorAll('.counter');
const countersDiv = document.querySelectorAll('.counter div');
const quantityWhiteCounters = document.querySelector('.qWhite span');
const quantityBlackCounters = document.querySelector('.qBlack span');
const counterColor = { 1: 'blackCounter', 2: 'whiteCounter' };
const quantityCounters = { 1: quantityBlackCounters, 2: quantityWhiteCounters }

let userNum = 1;

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const createPlayfield = (size) => {  
  const playfield = [];
  for (let rowNum = 0; rowNum < size; rowNum++) {
    playfield.push([]);
    for (let colNum = 0; colNum < size; colNum++) {
      if (rowNum === 3 && colNum === 4 || rowNum === 4 && colNum === 3) {
        playfield[rowNum].push(1);  
      } else if (rowNum === 3 && colNum === 3 || rowNum === 4 && colNum === 4) {
        playfield[rowNum].push(2);
      } else {	
        playfield[rowNum].push(0);
      }
    }
  }
  return playfield;
};

const playfield = createPlayfield(8);

createCopyArrayWithoutLink = (oldArray) => {
  const newArray = [];
  oldArray.forEach(elem => newArray.push(elem.slice()));
  return newArray;
}

const captureCounter = (activePlayfield, div, row, col, userNum, reason) => {
  if (userNum === 1) {
    if (reason != 'CaptureWithoutColor') div.className = counterColor[userNum];
    activePlayfield[row][col] = userNum;
    quantityCounters[userNum].innerText++;
    quantityCounters[userNum + 1].innerText--;
  } else {
    if (reason != 'CaptureWithoutColor') div.className = counterColor[userNum];
    activePlayfield[row][col] = userNum;
    quantityCounters[userNum].innerText++;
    quantityCounters[userNum - 1].innerText--;
  }
}

const captureOponentCounters = (type, activePlayfield, rowNum, start, end, userNum, reason, startSign, diff, stepSign) => {
  if (type === 'horizontal' || type === 'vertical') {
    for (start; start < end; start++) {
      const index = (type === 'horizontal') ? (8 * rowNum + start) : (8 * start + rowNum);
      const div = countersDiv[index];
      
      if (type === 'horizontal') captureCounter(activePlayfield, div, rowNum, start, userNum, reason);
      else if (type === 'vertical') captureCounter(activePlayfield, div, start, rowNum, userNum, reason);

    }

  } else if (type = 'diagonal') {
      if (startSign === 'plus') rowNum = rowNum + diff;
      else rowNum = rowNum - diff;
      for (start; start < end; start++) {
        const index = 8 * start + rowNum;
        const div = countersDiv[index];
        
        captureCounter(activePlayfield, div, start, rowNum, userNum, reason);

        if (stepSign === 'plus') rowNum++;
        else rowNum--;
      }
  }
}

const checkHorizontalVerticalLines = (checkType, activePlayfield, row, col, clickRow, clickCol, userNum, reason) => {
    let activeLine = [];
    
    if (checkType === 'horizontal') activeLine = activePlayfield[row];
    if (checkType === 'vertical') {
      for (let num = 0; num < activePlayfield.length; num++) {
        activeLine.push(activePlayfield[num][row]);
      }
    }

    let startPosition = (col > clickCol) ? clickCol + 1 : col + 1;
    let endPosition = (col > clickCol) ? col : clickCol;
    let canCapture = true;
    
    for (let index = startPosition; index < endPosition; index++) {
      if ([0, userNum].includes(activeLine[index])) canCapture = false;
      if (canCapture && index === endPosition - 1) {
        if (reason != 'onlyCheck') captureOponentCounters(checkType, activePlayfield, row, startPosition, endPosition, userNum, reason);
        return 'canCapture';
      }
    }
}

const checkDiagonalLines = (activePlayfield, row, col, clickRow, clickCol, userNum, reason) => {
  const rowDiff = row - clickRow;
  const colDiff = col - clickCol;

  const conditionForDiagonal = (rowDiff >= 0 && colDiff >= 0 || rowDiff <= 0 && colDiff <= 0);
  const newSpecialCol = (conditionForDiagonal) ? col : activePlayfield.length - 1 - col;
  const startPoint = (newSpecialCol - row >= 0) ? 0 : row - newSpecialCol;         
  let activeLine = [];
  const activeLineLength = activePlayfield.length - Math.abs(row - newSpecialCol);
  for (let startRow = startPoint; startRow < startPoint + activeLineLength; startRow++) {
    if (conditionForDiagonal) activeLine.push(activePlayfield[startRow][col - (row - startRow)]);
    else activeLine.push(activePlayfield[startRow][col + row - startRow]);
  }

  let startPosition = (row > clickRow) ? clickRow + 1 : row + 1;
  let endPosition = (row > clickRow) ? row : clickRow;
  const startSign = (clickCol > col) ? 'plus' : 'minus';
  const stepSign = (conditionForDiagonal) ? 'plus' : 'minus';
  const signDiff = (row > clickRow) ? endPosition - startPosition : 1;
  let canCapture = true;

  for (let index = startPosition; index < endPosition; index++) {
    if ([0, userNum].includes(activeLine[index - startPoint])) canCapture = false;
    if (canCapture && index === endPosition - 1) {
      if (reason != 'onlyCheck') captureOponentCounters('diagonal', activePlayfield, col, startPosition, endPosition, userNum, reason, startSign, signDiff, stepSign);
      return 'canCapture';
    }
  }
}

const checkPossibleMovements = (activePlayfield, clickRow, clickCol, userNum, reason) => {
  if (activePlayfield[clickRow][clickCol] != 0) return false;
  let mainCondition = false;
  
  for (let row = 0; row < activePlayfield.length; row++) {
    for (let col = 0; col < activePlayfield.length; col++) {
      
      if (row === clickRow && activePlayfield[row][col] === userNum) {
        const result = checkHorizontalVerticalLines('horizontal', activePlayfield, row, col, clickRow, clickCol, userNum, reason);
        if (result === 'canCapture') mainCondition = true;
      }

      if (col === clickCol && activePlayfield[row][col] === userNum) {
        const result = checkHorizontalVerticalLines('vertical', activePlayfield, col, row, clickCol, clickRow, userNum, reason);
        if (result === 'canCapture') mainCondition = true;
      }

      if (Math.abs(row - clickRow) === Math.abs(col - clickCol) && activePlayfield[row][col] === userNum) {     
        const result = checkDiagonalLines(activePlayfield, row, col, clickRow, clickCol, userNum, reason);
        if (result === 'canCapture') mainCondition = true;
      }
    }
  }
  return mainCondition;
}


const checkPosibilityMove = () => {
  for (let row = 0; row < playfield.length; row++) {
    for (let col = 0; col < playfield.length; col++) {
      if (playfield[row][col] === 0) {
        const conditionMove = checkPossibleMovements(row, col, userNum, 'onlyCheck');
        if (conditionMove) return true;
      }
    }
  }
  return false;
}

const findNodeValue = (userNum, row, col) => {
  const blackQuantity = Number.parseInt(quantityCounters[1].innerText, 10);
  const whiteQuantity = Number.parseInt(quantityCounters[2].innerText, 10);
  const diff = whiteQuantity - blackQuantity;
  const minMaxValues =  [diff];
  return minMaxValues;
}

const computerMove = (reason, activePlayfield, deep, maxDeep, userNum, blackNum, whiteNum, min_maxValues) => {
  //if (deep === maxDeep) return;
  //let tempUserNum = userNum;
  //console.log(deep);
  //if (deep != maxDeep - 1) min_maxValues[deep] = [];
  const tempValues = [];
  for (let row = 0; row < playfield.length; row++) {
    for (let col = 0; col < playfield.length; col++) {

        testPlayfield = createCopyArrayWithoutLink(activePlayfield);
        quantityCounters[1].innerText = blackNum;
        quantityCounters[2].innerText = whiteNum; 
        let tempUserNum = userNum;

        const conditionMove = checkPossibleMovements(testPlayfield, row, col, tempUserNum, reason);
        if (conditionMove) {
          const div = countersDiv[8 * row + col]; 
          if (tempUserNum === 2) { 
            testPlayfield[row][col] = tempUserNum;
            quantityWhiteCounters.innerText++;
            tempUserNum = 1;
            deep++;
            const blackNum = quantityCounters[1].innerText;
            const whiteNum = quantityCounters[2].innerText;
            let result = null;
            if (deep != maxDeep) result = computerMove('CaptureWithoutColor', testPlayfield, deep, maxDeep, tempUserNum, blackNum, whiteNum, min_maxValues);
            //if (result != null) console.log(result);

            const newMinMaxValues = findNodeValue(tempUserNum, row, col);
            //console.log(newMinMaxValues['min_max']);
            deep--;

            if (deep === 1) {
              tempValues.push(result);
            }

            if (deep === 0) {
              result.push(row);
              result.push(col);
              tempValues.push(result);
            }

            if (deep === maxDeep - 1) {
              tempValues.push(newMinMaxValues);
              //console.log(deep, row, col, blackNum, whiteNum);
              //console.log(newMinMaxValues[0]);
              //if (newMinMaxValues[0] >= min_maxValues[deep][0]) min_maxValues[deep] = newMinMaxValues;
            }
          } else if (tempUserNum === 1) {
            quantityBlackCounters.innerText++;
            testPlayfield[row][col] = tempUserNum;
            tempUserNum = 2;
            deep++;
            const blackNum = quantityCounters[1].innerText;
            const whiteNum = quantityCounters[2].innerText;
            let result = null;
            if (deep != maxDeep) result = computerMove('CaptureWithoutColor', testPlayfield, deep, maxDeep, tempUserNum, blackNum, whiteNum, min_maxValues);
            //if (result != null) console.log(result, deep);

            const newMinMaxValues = findNodeValue(tempUserNum, row, col);
            //console.log(newMinMaxValues['min_max']);
            deep--;

            if (deep === 0) {
              tempValues.push(result);
            }

            if (deep === 1) {
              tempValues.push(result);
            }

            if (deep === maxDeep - 1) {
              tempValues.push(newMinMaxValues);
              //console.log(deep, row, col, blackNum, whiteNum);
              //console.log(newMinMaxValues[0]);
              //if (newMinMaxValues[0] <= min_maxValues[deep][0]) min_maxValues[deep] = newMinMaxValues;
            }
          }
        }
    }
  }
  
  if (deep === maxDeep - 1) { 
    let bestChoice = null;
    for (let i = 0; i < tempValues.length; i++) {
      // for white 
      if (bestChoice == null || tempValues[i][0] > bestChoice[0]) {
        bestChoice = tempValues[i];
      }
    }
    //console.log(bestChoice);
    return bestChoice;
    //min_maxValues[deep].push(bestChoice);
  }

  if (deep === 1) {
    let bestChoice = null;
    for (let i = 0; i < tempValues.length; i++) {
      console.log(tempValues[i])
      if (bestChoice == null || tempValues[i][0] > bestChoice[0]) {
        bestChoice = tempValues[i];
      }
    }
    return bestChoice;
  }

  if (deep === 0) {
    console.log(tempValues);
    let bestChoice = null;
    for (let i = 0; i < tempValues.length; i++) {
      if (bestChoice == null || tempValues[i][0] > bestChoice[0]) {
        bestChoice = tempValues[i];
      }
    }
    return bestChoice;
  }

/*  if (deep < maxDeep) {
    for (let ) 
  }*/
  //console.log(tempValues);
  //console.log(min_maxValues);
  console.log('HERE', deep);
  //userNum = (tempUserNum === 1) ? 2 : 1;
  //console.log(min_maxValues);
  //return min_maxValues;
}

const mini_max = (level) => {
  //const testPlayfield = playfield;
  let maxDeep = null;
  const min_maxValues = [];
  if (level === 'easy') maxDeep = 3;
  for (let deep = 0; deep < maxDeep; deep++) {
  // min_maxValues [ [value, row, col] ]
    min_maxValues.push([]);
  }
  const blackNum = quantityCounters[1].innerText
  const whiteNum = quantityCounters[2].innerText;
  const result = computerMove('CaptureWithoutColor', playfield, 0, maxDeep, userNum, blackNum, whiteNum, min_maxValues);
  console.log('MAIN RESULT =>', result);
  setTimeout(() => {
    checkPossibleMovements(playfield, result[1], result[2], userNum);
    const div = countersDiv[(8 * result[1] + result[2])];
    div.className = 'whiteCounter';
    playfield[result[1]][result[2]] = userNum;
    quantityWhiteCounters.innerText++;
    userNum = 1;
  }, 1000);
}

counters.forEach(counter => {
  const div = counter.querySelector('div');
  const rowNum = Number.parseInt(div.id.slice(0, 1), 10);
  const columnNum = Number.parseInt(div.id.slice(2), 10);
  counter.addEventListener('click', () => {
    //if (userNum === 2) return;

    // move to the right place
    //console.log(checkPosibilityMove());
    
    const conditionMove = checkPossibleMovements(playfield, rowNum, columnNum, userNum);
    if (conditionMove) {
	      if (userNum === 1) {
        div.className = 'blackCounter';
	      playfield[rowNum][columnNum] = 1;
	      quantityBlackCounters.innerText++;
        //captureOponentCounters(userNum);
	      userNum = 2;
        mini_max('easy');
        } else {
        div.className = 'whiteCounter';
        playfield[rowNum][columnNum] = userNum;
        quantityWhiteCounters.innerText++;
        //captureOponentCounters(userNum);
        userNum = 1;
        }
      // remake for computer player
      const blackQuantity = Number.parseInt(quantityCounters[1].innerText, 10);
      const whiteQuantity = Number.parseInt(quantityCounters[2].innerText, 10);
      if (whiteQuantity === 0) console.log('You win');
      if (blackQuantity === 0) console.log('You lose');
      /*if (blackQuantity + whiteQuantity === ) {
        if (blackQuantity > whiteQuantity) alert('You win');
        else if (blackQuantity < whiteQuantity) alert ('You lose');
          else alert('Draw');
      }*/
    }
  });
});
