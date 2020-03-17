'use strict';

const extraFunc = arr => {
  const median = [];
  if (arr.length % 2 == 1) {
    median.push(arr[Math.floor(arr.length / 2)]);
  } else {
    let median1 = arr[Math.floor(arr.length / 2)];
    let median2 = arr[Math.floor(arr.length / 2) + 1];
    let mainMedian = median1 + ' and ' + median2;
    median.push(mainMedian);
  }
  return median;
}
const findMedian = arr => {
  for (let i = 1; i <= arr.length; i++) {
    let extraArr = arr.slice(0, i);
    let specialArr = extraArr.sort((a, b) => a > b ? 1 : -1);
    let result = extraFunc(specialArr);
    console.log(`sortArray is ${specialArr} at the moment`);
    console.log(`Median = ${result}\n`);
  }
};

const arr = [7, 5, 1, 3, 7, 9, 12, 4, 2];
findMedian(arr);

