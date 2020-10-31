"use strict";

const weights = [];
const prices = [];
const parents = [];

const randomFromTO = (from, to) => Math.floor(from + (Math.random() * (to - from + 1)));

const createElements = (n, minPrice, maxPrice, minWeight, maxWeight) => {
  for (let pointer = 0; pointer < n; pointer++) {
    weights.push(randomFromTO(minWeight, maxWeight));
    prices.push(randomFromTO(minPrice, maxPrice));
  }   
};

const createParents = (quantity, weights, prices, capacity) => {
  for (let pointer = 0; pointer < quantity; pointer++) {
    let parentPrice = 0;
    let parentCapacity = 0;
  	const parent = [];
  	for (let num = 0; num < prices.length; num++) {
      const chanse = randomFromTO(0, 1);
      parentCapacity += weights[num];
      if (chanse && (parentCapacity <= capacity)) {
        parent.push(1);
        parentPrice += prices[num];
      } else {
        parent.push(0);
        parentCapacity -= weights[num];
      }
  	}
  	parents.push({ person: parent, weigth: parentCapacity, price: parentPrice });
  }
}

const selectParents = (parents) => {
  let firstParent = parents[0];
  let firstIndex = 0;
  parents.forEach((parent, index) => {
    if (parent['price'] > firstParent['price']) {
      firstParent = parent;
      firstIndex = index;
    };
  });
  let randomNum = randomFromTO(0, (parents.length - 1));
  if (randomNum === firstIndex && randomNum > 0) --randomNum;
  else if (randomNum === firstIndex && randomNum === 0) ++randomNum;
  const secondParent = parents[randomNum];
  return { firstParent, secondParent };
}

const countCapacityAndPrice = (person, weights, prices) => {
  let capacity = 0;
  let price = 0;
  for (let num = 0; num < person.length; num++) {
    if (person[num] == 1) {
      capacity += weights[num];
      price += prices[num];
    }
  }
  return { capacity, price };
}

const firstCrossing = (firstParent, secondParent, ) => {
  const child = [];
  for (let num = 0; num < firstParent['person'].length; num++) {
    const chance = randomFromTO(0, 1);
    if (chance === 0) {
      child.push(firstParent['person'][num]);
    } else {
      child.push(secondParent['person'][num]);
    }
  }
  const { capacity, price } = countCapacityAndPrice(child, weights, prices);
  return { person: child, capacity, price};
}

const secondCrossing = (firstParent, secondParent) => {
  
}

const thirdCrossing = (firstParent, secondParent) => {
  
}

const firstMutation = (child, weights, prices) => {
  const randomNum = randomFromTO(0, 99);
  if (child['person'][randomNum]) {
    child['person'][randomNum] = 0;
    child['capacity'] -= weights[randomNum];
    child['price'] -= prices[randomNum];
  } else {
    child['person'][randomNum] = 1;     
    child['capacity'] += weights[randomNum];
    child['price'] += prices[randomNum];
  }
  return child;
}

const secondMutation = (child, weights, prices) => {
  const firstRandomNum = randomFromTO(0, 99);
  let secondRandomNum = randomFromTO(0, 99);
  while (secondRandomNum === firstRandomNum) {
    secondRandomNum = randomFromTO(0, 99);
  }
}

createElements(100, 2, 30, 1, 20);
createParents(6, weights, prices, 500);
const { firstParent, secondParent } = selectParents(parents);
const child = firstCrossing(firstParent, secondParent);
firstMutation(child, weights, prices);
secondMutation(child, weights, prices);