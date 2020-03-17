'use strict'

const arrA = [30, 19, 9, 15, 55, 24, 3, 78, 46, 41];

const evenNum = arrA.filter(x => x % 2 == 0); // creates new array only with even numbers
const oddNum = arrA.filter(x => x % 2 == 1);  // creates new array only with odd numbers

const inSort = arr => {
  for (let i = 0; i < arr.length; i++) {
    const value = arr[i];
    let extraNum = i - 1;
    if (arr[0] % 2 == 0) {
      while (extraNum > -1 && arr[extraNum] > value) { // only for even numbers
        arr[extraNum + 1] = arr[extraNum];
        extraNum--;
      };
    };
    if (arr[0] % 2 == 1) {
      while (extraNum > -1 && arr[extraNum] < value) {  // only for odd numbers
        arr[extraNum + 1] = arr[extraNum];
        extraNum--;
      };
    };
    arr[extraNum + 1] = value;
  }
  return arr;
};

const finalArr = inSort(evenNum).concat(inSort(oddNum));
console.log(finalArr);