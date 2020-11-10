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
  for (start; start < end; start++) {
    const index = 8 * rowNum + start;
    const li = counters[index];
    console.log(index);
    console.log(li);
    const div = li.querySelector('div');
    console.log(div);
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
}

const checkPossibleMovements = (possibleRow, possibleCol, userNum) => {
  for (let row = 0; row < playfield.length; row++) {
    for (let col = 0; col < playfield.length; col++) {
      if (row === possibleRow && playfield[row][col] === userNum) {
      	const activeRow = playfield[row];
      	let start = null;
      	if (col === possibleCol) continue;
      	if (col > possibleCol) {
      		start = possibleCol + 1;
      	  end = col;
      	} else {
      		start = col + 1;
      		end = possibleCol;
        }
        if (start === end) continue;
       	for (let index = start; index < end; index++) {
      	  if (activeRow[index] === 0 || activeRow[index] === userNum) continue;
      	}
        console.log(start);
        console.log(end);
        captureOponentCounters('horizont', row, start, end, userNum);
        return true;
      }
    }
  }
}

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
