"use strict";

const weights = [];
const prices = [];
const parents = [];
const parents1 = [];
const parents2 = [];

const randomFromTO = (from, to) => Math.floor(from + (Math.random() * (to - from + 1)));

// створення елементів
const createElements = (n, minPrice, maxPrice, minWeight, maxWeight) => {
  for (let pointer = 0; pointer < n; pointer++) {
    weights.push(randomFromTO(minWeight, maxWeight));
    prices.push(randomFromTO(minPrice, maxPrice));
  }   
};

// створення батьків
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
  	parents.push({ person: parent, capacity: parentCapacity, price: parentPrice });
  	parents1.push({ person: parent, capacity: parentCapacity, price: parentPrice });
  	parents2.push({ person: parent, capacity: parentCapacity, price: parentPrice });
  }
}

// вибір батьків для схрещення
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

// повертаю вагу і ціну особини
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

// схрещення вибором випадкового гена з батьків (50% на 50%)
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

// точкове схрещення (використовую 20 або 50 точок)
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

// змінити значення гена на протилежне
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

// поміняти місцями два гени
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

// заміна найгіршого гена у відношенні (вага / ціну)
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
        child['person'][badGene] = 0;
        child['person'][num] = 1;
        const { capacity, price } = countCapacityAndPrice(child['person'], weights, prices);
        child['capacity'] = capacity;
        child['price'] = price;
        return;
      }
    }
  }
}

// вибрати найдешевиший ген і замінити його (є ліміт ваги)
const secondLocalImprovement = (child, maxCapacity) => {
	let badGene = null;
	let badPrice = 100;
	const weigthLimit = 10;
	for (let num = 0; num < weights.length; num++) {
    if (child['person'][num] === 1 && prices[num] < badPrice) {
      badGene = num;
      badPrice = prices[num];
    }
	}
	for (let num = 0; num < weights.length; num++) {
    if (child['person'][num] === 0) {
      const difference = maxCapacity - (child['capacity'] - weights[badGene] + weights[num]);
      if (prices[num] > badPrice && weights[num] < weigthLimit && difference >= 0) {
        child['person'][badGene] = 0;
        child['person'][num] = 1;
        const { capacity, price } = countCapacityAndPrice(child['person'], weights, prices);
        child['capacity'] = capacity;
        child['price'] = price;
        return;
       }  
     }
	}
}

// заміна батьків на дитину після схрещення =>  мутації => покращення
const exchangeParent = (child, parents) => {
	const childPrice = child['price'];
	let badParent = 0;
	let badParentPrice = null;
  for (let parentNum = 0; parentNum < parents.length; parentNum++) {
    const parentPrice = parents[parentNum]['price'];
    if (parentPrice < badParentPrice || badParentPrice === null) {
      badParent = parentNum;
      badParentPrice = parentPrice;
    }
  }
  if (parents[badParent]['price'] < childPrice) {
    parents[badParent] = child;
  }
}

// оновлення рекорду
const setRecord = (parents, record) => {
  for (let parentNum = 0; parentNum < parents.length; parentNum++) {
    if (parents[parentNum]['price'] > record['price']) {
      record['price'] = parents[parentNum]['price'];
      record['capacity'] = parents[parentNum]['capacity'];
    }
  }
  return record;
};

// чи потрібні return в мутаціях?
// дії, якщо потомок мертвий?



const record = { price: 0, capacity: 0 };
const record1 = { price: 0, capacity: 0 };
const record2 = { price: 0, capacity: 0 };
createElements(100, 2, 30, 1, 20);
createParents(6, weights, prices, 500);

// запуск всіх попередніх функцій
const startProcess = (maxIterations, parents, record, crossNum) => {
    
	for (let iterationNum = 0; iterationNum < maxIterations; iterationNum++) {
	  const { firstParent, secondParent } = selectParents(parents);
    let child = null;
    if (crossNum === 1) child = firstCrossing(firstParent, secondParent);
	  if (crossNum === 2) child = pointCrossing(50, firstParent, secondParent, 10, 500);
	  if (crossNum === 3) child = pointCrossing(20, firstParent, secondParent, 10, 500);
	  if (child['person'] != null) {
	    firstMutation(child, weights, prices)
	    //secondMutation(child, weights, prices);
	      if (child['capacity'] > 500) {
	        continue;
	      }
	    firstLocalImprovement(child, 500);
	    //secondLocalImprovement(child, 500);
	  	exchangeParent(child, parents);
	  }
	  setRecord(parents, record);
	}

console.log(record);
};



startProcess(1000, parents, record, 1);
startProcess(1000, parents1, record1, 2);
startProcess(1000, parents2, record2, 3);
