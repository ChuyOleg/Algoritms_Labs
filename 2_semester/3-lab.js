'use strcit';

const arr1 = [5, 4, 3, 2, 8, 1, 5, 7, 8, 4, 1, 2];
const arr2 = [5, 4, 3, 2, 8, 1, 5, 7, 8, 4, 1, 2];
const arr3 = [5, 4, 3, 2, 8, 1, 5, 7, 8, 4, 1, 2];
let counter1 = 0;
let counter2 = 0;
let counter3 = 0;
const quickSortFirstWay = arr => {
  if (arr.length < 2) return arr;
  const pillar = arr[0];
  const less = arr.filter(value => {
  	counter1++;
  	return value < pillar;
  });
  const bigger = arr.filter(value => {
   counter1++;
   return value > pillar;
   });
  return [...quickSortFirstWay(less), pillar, ...quickSortFirstWay(bigger)];
};

const quickSortSecondWay = arr => {
  if (arr.length < 2) return arr;
  const pillar = arr[Math.floor(arr.length / 2)];
  const less = arr.filter(value => {
  	counter2++;
  	return value < pillar;
  });
  const bigger = arr.filter(value => {
   counter2++;
   return value > pillar;
   });
  return [...quickSortSecondWay(less), pillar, ...quickSortSecondWay(bigger)];
};

const quickSortThirdWay = arr => {
  if (arr.length < 2) return arr;
  const pillar = arr[arr.length - 1];
  const less = arr.filter(value => {
  	counter3++;
  	return value < pillar;
  });
  const bigger = arr.filter(value => {
   counter3++;
   return value > pillar;
   });
  return [...quickSortSecondWay(less), pillar, ...quickSortSecondWay(bigger)];
};

console.log(`Our array is ${arr1}`);

quickSortFirstWay(arr1);
quickSortSecondWay(arr2);
quickSortThirdWay(arr3);
console.log(`${counter1} - number of element matches for the firs method`);
console.log(`${counter2} - number of element matches for the second method`);
console.log(`${counter3} - number of element matches for the third method`);