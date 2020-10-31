"use strict";

const weights = [];
const prices = [];
const parents = [];

const randomFromTO = (from, to) => Math.floor(from + (Math.random() * (to - from + 1)));

/*const crossing = (arr1, arr2, points) => {
  const n = 2 ** points;
  // n = кількість потомків 
  for (let i = 0; i < n; i++) {
    const template = new Array(points + 1).fill(0);
    const arr = new Array(arr1.length).fill(0); // потомок
    let num = i;

    for (let j = 0; j <= points; j++) {
      if (num > 0) {
      	template[j] = 1;
      }
      num--
      console.log(template);
    }
    //console.log(arr);
  }
}*/

const evenNumbers = [2, 4, 6, 8, 10];
const oddNumbers = [1, 3, 5, 7, 9];

const newArr = new Array(100).fill(0);


const func = (points) => {
	for (let j = 0; j < 3; j++) {
	  const Child = [];
	  const p = [];
	  const mainNum = Math.ceil((evenNumbers.length / (points + 1)));
	  console.log('MainNum =>', mainNum);
		let randomNum = randomFromTO(0, 1);
		for (let i = 0; i < oddNumbers.length; i++) {
		  if (i % mainNum === 0 && i != 0) randomNum = randomFromTO(0, 1);
			console.log(randomNum);
		  if (randomNum) Child.push(evenNumbers[i]);
		  else Child.push(oddNumbers[i]);
		}
	  console.log(Child);
	}
}

func(2);
/*[0 0 0]
[1 0 0]
[0 1 0]
[1 1 0]
[0 0 1]
[1 0 1]
[0 1 1]
[1 1 1]*/

/*crossing(oddNumbers, evenNumbers, 2);*/

process.exit();

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

const firstCrossing = (firstParent, secondParent) => {
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

const secondCrossing = (firstParent, secondParent, quantityPoints) => {
  const child = [];
  const parents = [firstParent, secondParent];
  for (let num = 0; num < firstParent['person'].length; num++) {
    
  }
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
  const firstNum = child['person'][firstRandomNum];
  const secondNum = child['person'][secondRandomNum];
  child['person'][firstRandomNum] = secondNum;
  child['person'][secondRandomNum] = firstNum;
  return child;
}

createElements(100, 2, 30, 1, 20);
createParents(6, weights, prices, 500);
const { firstParent, secondParent } = selectParents(parents);
const child = firstCrossing(firstParent, secondParent);
firstMutation(child, weights, prices);
secondMutation(child, weights, prices);
