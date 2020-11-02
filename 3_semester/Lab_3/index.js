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

const pointCrossing = (points, firstParent, secondParent, numberOfChildren, maxCapacity) => {
	let bestChild = null;
	let bestChildCapacity = null;
	let bestChildPrice = 0;
	for (let childNum = 0; childNum < numberOfChildren; childNum++) {
	  const child = [];
	  const separator = Math.ceil((firstParent['person'].length / (points + 1)));
		let randomNum = randomFromTO(0, 1);
		for (let elemNum = 0; elemNum < firstParent['person'].length; elemNum++) {
		  if (elemNum % separator === 0 && elemNum != 0) randomNum = randomFromTO(0, 1);
		  if (randomNum) child.push(secondParent['person'][elemNum]);
		  else child.push(firstParent['person'][elemNum]);
		}
	  const { capacity, price } = countCapacityAndPrice(child, weights, prices);
    if (capacity <= maxCapacity && price > bestChildPrice){
      bestChild = child;
      bestChildCapacity = capacity;
      bestChildPrice = price;
	  }
  }
  return { person: bestChild, capacity: bestChildCapacity, price: bestChildPrice };
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
  return;
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
  const { capacity, price } = countCapacityAndPrice(child['person'], weights, prices);
  child['capacity'] = capacity;
  child['price'] = price;
  return;
}

const firstLocalImprovement = (child, maxCapacity) => {
  let ratio = 0;
  let badGene = null;
  for (let gene = 0; gene < child['person'].length; gene++) {
    if (child['person'][gene] === 1) {
      const newRatio = weights[gene] / prices[gene];
      if (newRatio > ratio) {
      	ratio = newRatio;
        badGene = gene;      
      }
    }
  }
  for (let num = 0; num < weights.length; num++) {
    if (child['person'][num] === 0) {
      const newRatio = weights[num] / prices[num];
      const difference = maxCapacity - (child['capacity'] - weights[badGene] + weights[num]);
      if (ratio > newRatio && difference >= 0 && prices[num] > prices[badGene]) {
        console.log(child);
        console.log('badGene =>', badGene, weights[badGene], prices[badGene]);
        console.log('newGene =>', num, weights[num], prices[num]);
        child['person'][badGene] = 0;
        child['person'][num] = 1;
        const { capacity, price } = countCapacityAndPrice(child['person'], weights, prices);
        child['capacity'] = capacity;
        child['price'] = price;
        console.log(child);
        return;
      }
    }
  }
}

const secondLocalImprovement = () => {
  // вибрати найдешевиший ген і замінити його
}

// чи потрібні return в мутаціях?
// дії, якщо потомок після мутації мертвий?

createElements(100, 2, 30, 1, 20);
createParents(6, weights, prices, 500);
const { firstParent, secondParent } = selectParents(parents);
/*const child = firstCrossing(firstParent, secondParent);*/
const child = pointCrossing(20, firstParent, secondParent, 100, 500);
console.log('Best child =>', child);
/*firstMutation(child, weights, prices);*/
secondMutation(child, weights, prices);
firstLocalImprovement(child, 500);
