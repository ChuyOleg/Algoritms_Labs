const counters = document.querySelectorAll('.counter');
const countersDiv = document.querySelectorAll('.counter div');
const quantityWhiteCounters = document.querySelector('.qWhite span');
const quantityBlackCounters = document.querySelector('.qBlack span');
const counterColor = { 1: 'blackCounter', 2: 'whiteCounter' };
const quantityCounters = { 1: quantityBlackCounters, 2: quantityWhiteCounters }
const levels = [];

levels.push(document.querySelector('#easy'));
levels.push(document.querySelector('#normal'));
levels.push(document.querySelector('#hard'));

let level = null;
let userNum = 1;

levels.forEach(lev => {
  lev.addEventListener('click', () => {
    //if ()
    level = lev.id;
    document.querySelector('#menu').style.display = 'none';
    document.querySelector('#playField').style.display = 'block';
  })
});

const getCountersQuantity = () => {
  const blackQuantity = Number.parseInt(quantityCounters[1].innerText, 10);
  const whiteQuantity = Number.parseInt(quantityCounters[2].innerText, 10);
  const quantity = { blackQuantity, whiteQuantity};
  return quantity;
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

const setNewCounter = (activePlayfield, div, row, col, userNum, reason) => {
  if (userNum === 1) {
    if (reason != 'setWithoutColor') div.className = counterColor[userNum];
    activePlayfield[row][col] = userNum;
    quantityCounters[userNum].innerText++;
  } else {
    if (reason != 'setWithoutColor') div.className = counterColor[userNum];
    activePlayfield[row][col] = userNum;
    quantityCounters[userNum].innerText++;
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


const checkPosibilityMove = (activeUserNum) => {
  for (let row = 0; row < playfield.length; row++) {
    for (let col = 0; col < playfield.length; col++) {
      if (playfield[row][col] === 0) {
        const conditionMove = checkPossibleMovements(playfield, row, col, activeUserNum, 'onlyCheck');
        if (conditionMove) return true;
      }
    }
  }
  return false;
}

const findNodeValue = (fakePlayfield, row, col) => {
  const { blackQuantity, whiteQuantity } = getCountersQuantity();
  let diff = whiteQuantity - blackQuantity;
  if (level === 'normal' || level === 'hard') {
    const users = [1, 2];
    const row = [0, 7];
    const col = [0, 7];
    for (let userIndex = 0; userIndex < users.length; userIndex++) {
      for (let rowIndex = 0; rowIndex < row.length; rowIndex++) {
        for (let colIndex = 0; colIndex < col.length; colIndex++) {
          const userNum = users[userIndex];
          let rowNum = row[rowIndex];
          let colNum = col[colIndex];
          if (playfield[rowNum][colNum] === 0 && fakePlayfield[rowNum][colNum] === userNum) {
            diff = (userNum === 1) ? diff - 30 : diff + 30;
          }
          rowNum = (rowIndex === 0) ? 1 : 6;
          colNum = (rowNum === 0) ? 1 : 6;
          if (playfield[rowNum][colNum] === 0 && fakePlayfield[rowNum][colNum] === userNum) {
            diff = (userNum === 1) ? diff + 4 : diff - 4;
          }
        }
      }
    }
  }
  const minMaxValues = [diff, whiteQuantity, blackQuantity];
  return minMaxValues;
}

const computerMove = (reason, activePlayfield, deep, maxDeep, userNum, blackNum, whiteNum, min_maxValues) => {
  const tempValues = [];
  const activeMinMaxValues = min_maxValues.slice();
  
  firstLoop:
  for (let row = 0; row < playfield.length; row++) {
    for (let col = 0; col < playfield.length; col++) {
        testPlayfield = createCopyArrayWithoutLink(activePlayfield);
        quantityCounters[1].innerText = blackNum;
        quantityCounters[2].innerText = whiteNum; 
        let tempUserNum = userNum;

        const conditionMove = checkPossibleMovements(testPlayfield, row, col, tempUserNum, reason);
        if (conditionMove) {
          const div = countersDiv[8 * row + col];
          let result = null;

          if (tempUserNum === 2) {
            setNewCounter(testPlayfield, div, row, col, tempUserNum, 'setWithoutColor');
            tempUserNum = 1;
          } else if (tempUserNum === 1) {
            setNewCounter(testPlayfield, div, row, col, tempUserNum, 'setWithoutColor');
            tempUserNum = 2;
          }

          deep++;
          
          const { blackQuantity: blackN, whiteQuantity: whiteN } = getCountersQuantity();
          
          if (deep != maxDeep) result = computerMove('CaptureWithoutColor', testPlayfield, deep, maxDeep, tempUserNum, blackN, whiteN, tempValues);
          
          if (deep === 1 && quantityCounters[1].innerText == 0) { 
            quantityCounters[1].innerText = blackNum;
            quantityCounters[2].innerText = whiteNum;
            return [100, whiteNum, blackNum, row, col]; 
          }

          deep--;
          
          if (deep === maxDeep - 1) result = findNodeValue(testPlayfield, row, col);
          
          if (deep === 0 && result != null) {
            result.push(row);
            result.push(col);
          }

          // для останнього хода
          if (maxDeep === 1) {
              result.push(row);
              result.push(col);
          }

          if (result != null) tempValues.push(result);
          
          // alpha-beta
          if (result != null) {
            for (let indexValue = 0; indexValue < activeMinMaxValues.length; indexValue++) {
                        // обирає max                   обирає min
              if (deep % 2 === 0 && result[0] >= activeMinMaxValues[indexValue][0]) {
                break firstLoop;
                        // обирає min                   обирає max 
              } else if (deep % 2 === 1 && result[0] <= activeMinMaxValues[indexValue][0]) {
                break firstLoop;
              }
            }
          }

        }
    }
  }

  let bestChoice = null;
  for (let i = 0; i < tempValues.length; i++) {
    if (userNum === 1) {
      if (bestChoice === null || tempValues[i][0] < bestChoice[0]) bestChoice = tempValues[i];
    } else if (userNum === 2) {
      if (bestChoice === null || tempValues[i][0] > bestChoice[0]) bestChoice = tempValues[i];
    }
  }
  if (deep === 0) {
    quantityCounters[1].innerText = blackNum;
    quantityCounters[2].innerText = whiteNum;
  }
  return bestChoice;
}

const mini_max = (level) => {
  const { blackQuantity, whiteQuantity } = getCountersQuantity();
  const allQuantity = blackQuantity + whiteQuantity;
  let maxDeep = null;
  if (level === 'easy') maxDeep = 3;
  if (level === 'normal') maxDeep = 3;
  if (level === 'hard') maxDeep = 4;
  if (64 - allQuantity < maxDeep) maxDeep = 64 - allQuantity;

  const min_maxValues = [];
  const result = computerMove('CaptureWithoutColor', playfield, 0, maxDeep, userNum, blackQuantity, whiteQuantity, min_maxValues);
  if (result === null) {
    alert('Opponent has no move');
    userNum = 1;
    return;
  }
  checkPossibleMovements(playfield, result[3], result[4], userNum);
  const div = countersDiv[(8 * result[3] + result[4])];
  setNewCounter(playfield, div, result[3], result[4], userNum);
  userNum = 1;
  if (checkPosibilityMove(1) === false) { 
    userNum = 2;
    return mini_max(level);
  }
};

const checkGameEnd = () => {
  const blackQuantity = Number.parseInt(quantityCounters[1].innerText, 10);
  const whiteQuantity = Number.parseInt(quantityCounters[2].innerText, 10);
  if (blackQuantity + whiteQuantity === 64) {
    if (blackQuantity > whiteQuantity) alert('You win !');
    else if (blackQuantity < whiteQuantity) alert('You lose !');
    else alert('Draw');
    return true;
  }
  if (checkPosibilityMove(1) === false && checkPosibilityMove(2) === false) {
    if (blackQuantity > whiteQuantity) alert('You win !');
    else if (blackQuantity < whiteQuantity) alert('You lose !');
    else alert('Draw');
    return true;
  }
  return false;
}

counters.forEach(counter => {
  const div = counter.querySelector('div');
  const rowNum = Number.parseInt(div.id.slice(0, 1), 10);
  const colNum = Number.parseInt(div.id.slice(2), 10);
  counter.addEventListener('click', () => {
    
    const conditionMove = checkPossibleMovements(playfield, rowNum, colNum, userNum);
    if (conditionMove) {
	    if (userNum === 1) {
	      setNewCounter(playfield, div, rowNum, colNum, userNum);
        userNum = 2;

        if (checkGameEnd()) {
          return;
        }

        mini_max(level);
       
        if (checkGameEnd()) {
          return;
        }
      }
    }
  });
});

