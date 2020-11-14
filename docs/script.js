const counters = document.querySelectorAll('.counter');
const countersDiv = document.querySelectorAll('.counter div');
const quantityWhiteCounters = document.querySelector('.qWhite span');
const quantityBlackCounters = document.querySelector('.qBlack span');
const counterColor = { 1: 'blackCounter', 2: 'whiteCounter' };
const quantityCounters = { 1: quantityBlackCounters, 2: quantityWhiteCounters }
let userNum = 1;

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

const captureOponentCounters = (type, rowNum, start, end, userNum, startSign, diff, stepSign) => {
  if (type === 'horizontal' || type === 'vertical') {
    for (start; start < end; start++) {
      const index = (type === 'horizontal') ? (8 * rowNum + start) : (8 * start + rowNum);
      const div = countersDiv[index];
      if (userNum === 1) {
        div.className = counterColor[userNum];
        if (type === 'horizontal') playfield[rowNum][start] = userNum;
        else playfield[start][rowNum] = userNum;
        quantityCounters[userNum].innerText++;
        quantityCounters[userNum + 1].innerText--;
      } else {
        div.className = counterColor[userNum];
        if (type === 'horizontal') playfield[rowNum][start] = userNum;
        else playfield[start][rowNum] = userNum;
        quantityCounters[userNum].innerText++;
        quantityCounters[userNum - 1].innerText--;
      }
    }

  } else if (type = 'diagonal') {
      if (startSign === 'plus') rowNum = rowNum + diff;
      else rowNum = rowNum - diff;
      for (start; start < end; start++) {
        const index = 8 * start + rowNum;
        const div = countersDiv[index];
        if (userNum === 1) {
          div.className = 'blackCounter';
          playfield[start][rowNum] = 1;
          quantityBlackCounters.innerText++;
          quantityWhiteCounters.innerText--;
        }
        else {
          div.className = 'whiteCounter';
          playfield[start][rowNum] = 2;
          quantityWhiteCounters.innerText++;
          quantityBlackCounters.innerText--;
        }
      if (stepSign === 'plus') rowNum++;
      else rowNum--;
      }
  }
}

const checkHorizontalVerticalLines = (checkType, row, col, clickRow, clickCol, userNum) => {
    let activeLine = [];
    
    if (checkType === 'horizontal') activeLine = playfield[row];
    else {
      for (let num = 0; num < playfield.length; num++) {
        activeLine.push(playfield[num][row]);
      }
    }

    let startPosition = (col > clickCol) ? clickCol + 1 : col + 1;
    let endPosition = (col > clickCol) ? col : clickCol;
    let canCapture = true;
    
    for (let index = startPosition; index < endPosition; index++) {
      if ([0, userNum].includes(activeLine[index])) canCapture = false;
      if (canCapture && index === endPosition - 1) {
        captureOponentCounters(checkType, row, startPosition, endPosition, userNum);
        return 'canCapture';
      }
    }
}

const checkDiagonalLines = (row, col, clickRow, clickCol, userNum) => {
  const rowDiff = row - clickRow;
  const colDiff = col - clickCol;

  const conditionForDiagonal = (rowDiff >= 0 && colDiff >= 0 || rowDiff <= 0 && colDiff <= 0);
  const newSpecialCol = (conditionForDiagonal) ? col : playfield.length - 1 - col;
  const startPoint = (newSpecialCol - row >= 0) ? 0 : row - newSpecialCol;         
  let activeLine = [];
  const activeLineLength = playfield.length - Math.abs(row - newSpecialCol);
  for (let startRow = startPoint; startRow < startPoint + activeLineLength; startRow++) {
    if (conditionForDiagonal) activeLine.push(playfield[startRow][col - (row - startRow)]);
    else activeLine.push(playfield[startRow][col + row - startRow]);
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
      captureOponentCounters('diagonal', col, startPosition, endPosition, userNum, startSign, signDiff, stepSign);
      return 'canCapture';
    }
  }
}

const checkPossibleMovements = (clickRow, clickCol, userNum) => {
  if (playfield[clickRow][clickCol] != 0) return false;
  let mainCondition = false;

  for (let row = 0; row < playfield.length; row++) {
    for (let col = 0; col < playfield.length; col++) {
      
      if (row === clickRow && playfield[row][col] === userNum) {
        const result = checkHorizontalVerticalLines('horizontal', row, col, clickRow, clickCol, userNum);
        if (result === 'canCapture') mainCondition = true;
      }

      if (col === clickCol && playfield[row][col] === userNum) {
        const result = checkHorizontalVerticalLines('vertical', col, row, clickCol, clickRow, userNum);
        if (result === 'canCapture') mainCondition = true;
      }

      if (Math.abs(row - clickRow) === Math.abs(col - clickCol) && playfield[row][col] === userNum) {     
        const result = checkDiagonalLines(row, col, clickRow, clickCol, userNum);
        if (result === 'canCapture') mainCondition = true;
      }
    }
  }
  return mainCondition;
}

// refactor functions 

counters.forEach(counter => {
  const div = counter.querySelector('div');
  const rowNum = Number.parseInt(div.id.slice(0, 1), 10);
  const columnNum = Number.parseInt(div.id.slice(2), 10);
  counter.addEventListener('click', () => {
    const conditionMove = checkPossibleMovements(rowNum, columnNum, userNum);
    if (conditionMove) {
	    if (userNum === 1) {
	      div.className = 'blackCounter';
	      playfield[rowNum][columnNum] = 1;
	      quantityBlackCounters.innerText++;
        //captureOponentCounters(userNum);
	      userNum = 2;
	    } else {
	      div.className = 'whiteCounter';
	      playfield[rowNum][columnNum] = 2;
	      quantityWhiteCounters.innerText++;
	      // captureOponentCounters(userNum);
	      userNum = 1;
	    }
      const blackQuantity = Number.parseInt(quantityCounters[1].innerText, 10);
      const whiteQuantity = Number.parseInt(quantityCounters[2].innerText, 10);
      console.log(blackQuantity + whiteQuantity);
      if (blackQuantity + whiteQuantity === 40) {
        if (blackQuantity > whiteQuantity) alert('You win');
        else if (blackQuantity < whiteQuantity) alert ('You lose');
          else alert('Draw');
      }
    }
  });
});