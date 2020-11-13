const counters = document.querySelectorAll('.counter');
const quantityWhiteCounters = document.querySelector('.qWhite span');
const quantityBlackCounters = document.querySelector('.qBlack span');
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

const captureOponentCounters = (type, rowNum, start, end, userNum) => {
  if (type === 'horizont') {
    for (start; start < end; start++) {
      const index = 8 * rowNum + start;
      const li = counters[index];
      const div = li.querySelector('div');
      if (userNum === 1) {
        div.className = 'blackCounter';
        playfield[rowNum][start] = 1;
        quantityBlackCounters.innerText++;
        quantityWhiteCounters.innerText--;
      } else {
        div.className = 'whiteCounter';
        playfield[rowNum][start] = 2;
        quantityWhiteCounters.innerText++;
        quantityBlackCounters.innerText--;  
      }
    }
  } else if (type === 'vertical') {
    for (start; start < end; start++) {
      const index = 8 * start + rowNum;
      const li = counters[index];
      const div = li.querySelector('div');
      if (userNum === 1) {
        div.className = 'blackCounter';
        playfield[start][rowNum] = 1;
        quantityBlackCounters.innerText++;
        quantityWhiteCounters.innerText--;
      } else {
        div.className = 'whiteCounter';
        playfield[start][rowNum] = 2;
        quantityWhiteCounters.innerText++;
        quantityBlackCounters.innerText--;  
      }
    }
  }
}

const checkPossibleMovements = (possibleRow, possibleCol, userNum) => {
  if (playfield[possibleRow][possibleCol] != 0) return false;
  let mainCondition = false;

  for (let row = 0; row < playfield.length; row++) {
    for (let col = 0; col < playfield.length; col++) {
      
      if (row === possibleRow && playfield[row][col] === userNum) {
        const activeRow = playfield[row];
        let start = (col > possibleCol) ? possibleCol + 1 : col + 1;
        let end = (col > possibleCol) ? col : possibleCol;
        let canCapture = true;
        for (let index = start; index < end; index++) {
          if ([0, userNum].includes(activeRow[index])) canCapture = false;
          if (canCapture && index === end - 1) { 
            captureOponentCounters('horizont', row, start, end, userNum);
            mainCondition = true;
          }
        }
      }

      if (col === possibleCol && playfield[row][col] === userNum) {
        const activeCol = [];
        for (let num = 0; num < playfield.length; num++) {
          activeCol.push(playfield[num][col]);
        }
        let start = (row > possibleRow) ? possibleRow + 1 : row + 1;
        let end = (row > possibleRow) ? row : possibleRow;
        let canCapture = true;
        for (let index = start; index < end; index++) {
          if ([0, userNum].includes(activeCol[index])) canCapture = false;
          if (canCapture && index === end - 1) {
            captureOponentCounters('vertical', col, start, end, userNum);
            mainCondition = true;
          }
        }
      }

      if (Math.abs(row - possibleRow) === Math.abs(col - possibleCol) && playfield[row][col] === userNum) {     
        const rowDiff = row - possibleRow;
        const colDiff = col - possibleCol;
        let activeLine = [];
        let activeLineLength = null;
        let startPosition = (row > possibleRow) ? possibleRow + 1 : row + 1;
        let endPosition = (row > possibleRow) ? row : possibleRow;
        let canCapture = true;
        if (rowDiff > 0 && colDiff > 0 || rowDiff < 0 && colDiff < 0) {
          activeLineLength = playfield.length - Math.abs(row - col);
          let startPoint =  (col - row >= 0) ? 0 : row - col;
          for (let startRow = startPoint; startRow < startPoint + activeLineLength; startRow++) {
            activeLine.push(playfield[startRow][col - (row - startRow)]);
          }
        } else {
          const newCol = playfield.length - 1 - col;
          activeLineLength = playfield.length - Math.abs(row - newCol);
          let startPoint = (newCol - row >= 0) ? 0 : row - newCol;
          for (let startRow = startPoint; startRow < startPoint + activeLineLength; startRow++) {
            activeLine.push(playfield[startRow][7 - (newCol - (row - startRow))]);
          }
          if ([0, userNum].includes(act))
        }

      }
    }
  }
  return mainCondition;
}

// remake 'if' conditions in functions
// refactor functions 

counters.forEach(counter => {
  const div = counter.querySelector('div');
  const rowNum = Number.parseInt(div.id.slice(0, 1), 10);
  const columnNum = Number.parseInt(div.id.slice(2), 10);
  counter.addEventListener('click', () => {
    const conditionMove = checkPossibleMovements(rowNum, columnNum, userNum);
    if (div.className === '' && conditionMove) {
	    if (userNum === 1) {
	      div.className = 'blackCounter';
	      playfield[rowNum][columnNum] = 1;
	      quantityBlackCounters.innerText++;
	      userNum = 2;
        //captureOponentCounters(1);
	    } else {
	      div.className = 'whiteCounter';
	      playfield[rowNum][columnNum] = 2;
	      quantityWhiteCounters.innerText++;
	      userNum = 1;
	      // captureOponentCounters(2);
	    }
    }
  });
})

// ГЛЯНУТИ СКРІН З ПОМИЛКОЮ
