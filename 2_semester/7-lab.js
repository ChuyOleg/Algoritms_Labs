'use strict';

function randomInt(min, max) {
  const rand = min + Math.random() * (max + 1 - min);
  const number = Math.floor(rand);
  return number;
};

function createDiffDist(n, min = 1, max = 10) {
  const distances = [];
  for (let i = 0; i < n; i++) {
  	distances[i] = [];
    for (let j = 0; j < n; j++) {
      if (j == 0) {
        distances[i].push(0);
        continue;
      }
      if (i == j) {
        distances[i].push(0);
        continue;
      }
      const number = randomInt(min, max);
      distances[i].push(number);
    }
  }
  return distances;
}

function findSmallPath(n) {
  let distances = createDiffDist(n);
  const result = ['City 1'];
  let adder = 0;
  let counter = 0;
  let city = 0;
  console.log(`Matrix for ${n} cities`);
  console.log(distances);
  while (counter < (n - 1)) {
    let number = 99;
    let extra = 0;
    for (let i = 0; i < n; i++) {
      if (distances[city][i] > 0 && distances[city][i] < number) {
        number = distances[city][i];
        extra = i;
      };
    };
    city = extra;
    adder += number;
    for (let j = 0; j < n; j++) {
      distances[j][city] = 0;
    }
    counter++;
    let res = 'City ' + (city + 1);
    result.push(res);
  }
  console.log(`List of cities = ${result}`)
  console.log(`The smallest distance = ${adder}`);
};

findSmallPath(6);
