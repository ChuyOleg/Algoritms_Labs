'use strict';

const D = [                // D(matrix) = u * m
  [2, 3, 1, 4],  // |'Oleg'|  u = 4  number of users
  [1, 2, 3, 4],  // |'Pasha'| m = 4  number of movies
  [4, 1, 3, 2],   // |'Sancho'|  
  [2, 4, 1, 3]    // |'Fedir'|
];

const createArr = (arr1, arr2) => {
  const specialArr = [];
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (arr1[i] == arr2[j]) specialArr.push(j);
    }
  }
  return specialArr;
};

const findInversion = arr => {
  let res = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) res = res + 1;
    }
  }
  return res;
};

const mainFunction = (matrix, x) => {
  const listArr = [];
  for (let i = 0; i < matrix.length; i++) {
  	const list = {i};
    if (matrix[i] == matrix[x]) continue;
    const res = findInversion(createArr(matrix[i], matrix[x]));
    const string = '(' + i + ',' + res + ')';
    listArr.push(string);   
  };
  console.log(`x = ${x}`);
  const finalList = listArr.sort((a, b) => a[3] <= b[3] ? -1 : 1);
  return finalList;
};
console.log(mainFunction(D, 0));
console.log(mainFunction(D, 1));
console.log(mainFunction(D, 2));
console.log(mainFunction(D, 3));