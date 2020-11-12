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
      console.log(start);
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
      /*if (row === possibleCol && playfield[col][row] === userNum) {
        let start = null;
        let end = null;
        console.log(possibleCol);
        console.log(possibleRow);
        console.log(col);
        console.log(row);
        if (col === possibleRow) console.log('HRE');
        if (col > possibleRow) {
          start = possibleRow + 1;
          end = col;
        } else {
          start = col + 1;
          end = possibleRow;
        }
        console.log(start);
        console.log(end);
        if (start != end) {
          console.log('Here');
          for (let index = start; index < end; index++) {
            if (activeColumn[index] === 0 || activeColumn[index] === userNum) continue column;
          }
          captureOponentCounters('vertical', row, start, end, userNum);
          return true;
        }
      }*/
    }
  }
  return mainCondition;
}

// remake 'if' conditions in functions
// refactor functions 
// think about 'continue'

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
