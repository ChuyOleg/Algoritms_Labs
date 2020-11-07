"use strict";

const weights = [];
const prices = [];
const parents = [];
const records = [];

const randomFromTO = (from, to) => Math.floor(from + (Math.random() * (to - from + 1)));

// створення елементів
const createElements = (n, minPrice, maxPrice, minWeight, maxWeight) => {
  
  weights.splice(0, weights.length);
  prices.splice(0, prices.length);

  for (let pointer = 0; pointer < n; pointer++) {
    weights.push(randomFromTO(minWeight, maxWeight));
    prices.push(randomFromTO(minPrice, maxPrice));
  }   
};

// створення батьків
const createParents = (quantity, weights, prices, maxCapacity, numCopies) => {
  
  parents.splice(0, parents.length);
  records.splice(0, records.length);

  for (let parentNum = 0; parentNum < numCopies; parentNum++) {
    parents.push([]);
    records.push({ price: 0, capacity: 0 });
  }

  for (let pointer = 0; pointer < quantity; pointer++) {
    let parentPrice = 0;
    let parentCapacity = 0;
  	const parent = [];
  	for (let num = 0; num < prices.length; num++) {
      const chanse = randomFromTO(0, 1);
      parentCapacity += weights[num];
      if (chanse && (parentCapacity <= maxCapacity)) {
        parent.push(1);
        parentPrice += prices[num];
      } else {
        parent.push(0);
        parentCapacity -= weights[num];
      }
  	}
    for (let parentNum = 0; parentNum < numCopies; parentNum++) {
      parents[parentNum].push({ person: parent, capacity: parentCapacity, price: parentPrice });
    }

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
const firstCrossing = (firstParent, secondParent, maxCapacity) => {
  let child = [];
  for (let num = 0; num < firstParent['person'].length; num++) {
    const chance = randomFromTO(0, 1);
    if (chance === 0) {
      child.push(firstParent['person'][num]);
    } else {
      child.push(secondParent['person'][num]);
    }
  }
  const { capacity, price } = countCapacityAndPrice(child, weights, prices);
  if (capacity > maxCapacity) child = null;
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
const firstMutation = (child, weights, prices, maxCapacity) => {
  const randomNum = randomFromTO(0, 99);
  if (child['person'][randomNum]) {
    child['person'][randomNum] = 0;
    child['capacity'] -= weights[randomNum];
    child['price'] -= prices[randomNum];
    return 'alive';
  } else if (child['capacity'] + weights[randomNum] <= maxCapacity) {
    child['person'][randomNum] = 1;     
    child['capacity'] += weights[randomNum];
    child['price'] += prices[randomNum];
    return 'alive';
  } else {
    return 'dead';
  }
}

// поміняти місцями два гени
const secondMutation = (child, weights, prices, maxCapacity) => {
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
  if (capacity > maxCapacity) {
    child['person'][firstRandomNum] = firstNum;
    child['person'][secondRandomNum] = secondNum;
    return 'dead';
  } else {
  child['capacity'] = capacity;
  child['price'] = price;
  return 'alive';
  }
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
      if (ratio > newRatio && difference >= 0/* && prices[num] > prices[badGene]*/) {
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


// запуск всіх попередніх функцій
const startProcess = (maxIterations, parents, record, crossName, mutationName, improveName) => {

	for (let iterationNum = 0; iterationNum < maxIterations; iterationNum++) {
	  const { firstParent, secondParent } = selectParents(parents);
    let child = null;

    if (crossName === 'Рівномірний_50%') child = firstCrossing(firstParent, secondParent, 500);
	  if (crossName === '20_точок') child = pointCrossing(50, firstParent, secondParent, 10, 500);
	  if (crossName === '50_точок') child = pointCrossing(20, firstParent, secondParent, 10, 500);
    if (child['person'] === null) {
      continue;
    }
 
    let stateChildAfterMutation = null;
    if (mutationName === 'заміна_одного') stateChildAfterMutation = firstMutation(child, weights, prices, 500);
    if (mutationName === 'поміняти_два') stateChildAfterMutation = secondMutation(child, weights, prices, 500);
    
    if (stateChildAfterMutation === 'alive') {
      if (improveName === 'відношення') firstLocalImprovement(child, 500);
      if (improveName === 'найдешевиший') secondLocalImprovement(child, 500);
    }
    
	  exchangeParent(child, parents);
	  setRecord(parents, record);
	 
	}
};

const crossing = ['Рівномірний_50%', '20_точок', '50_точок'];
const mutation = ['заміна_одного', 'поміняти_два'];
const improvement = ['відношення', 'найдешевиший'];

const parameters = { crossing, mutation, improvement };


const testParameters = (parameters, testParNum, testParName) => {
  
  const numAllCases = crossing.length * mutation.length * improvement.length;
  console.log(numAllCases); 

  const mainResult = new Array(parameters[testParName].length).fill(0);
  for (let attemp = 0; attemp < 100; attemp++) {
    createElements(100, 2, 30, 1, 20);
    createParents(6, weights, prices, 500, numAllCases);
    for (let iter = 0; iter < parameters[testParName].length; iter++) {
      if (testParNum === 0) {
        startProcess(1000, parents[iter], records[iter], parameters[testParName][iter], parameters['mutation'][0], parameters['improvement'][0]);
      }
      if (testParNum === 1) {
        startProcess(1000, parents[iter], records[iter], parameters['crossing'][0], parameters[testParName][iter], parameters['imrpovement'][0]);
      }
      if (testParNum === 2) {
        startProcess(1000, parents[iter], records[iter], parameters['crossing'][0], parameters['mutation'][0], parameters[testParName][iter]);
      }
    }
 
    let bestResult = records[0];
    let bestResultNum = 0;
    
    for (let recordNum = 0; recordNum < records.length; recordNum++) {
      if (records[recordNum]['price'] > bestResult['price']) {
        bestResult = records[recordNum];
        bestResultNum = recordNum;
      }
    }
    mainResult[bestResultNum] += 1;
    /*console.log(bestResultNum);
    console.log(bestResult);*/
  }
  console.log(mainResult);
  console.log(testParName);
  console.log(parameters);
}

testParameters(parameters, 0, 'crossing');
