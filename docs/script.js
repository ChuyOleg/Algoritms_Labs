const counters = document.querySelectorAll('.counter');
const quantityWhiteCounters = document.querySelector('.qWhite span');
const quantityBlackCounters = document.querySelector('.qBlack span');

let userMove = true;

counters.forEach(counter => {
  const div = counter.querySelector('div');
  counter.addEventListener('click', () => {
    if (div.className === '') {
	    if (userMove) {
	      div.className = 'blackCounter';
	      quantityBlackCounters.innerText++;
	      userMove = false;
	    } else {
	      div.className = 'whiteCounter';
	      quantityWhiteCounters.innerText++;
	      userMove = true;
	    }
    }
  });
})
