'use strict';

const Sizes = [5, 4, 8, 2, 3, 1];
const Prices = [100, 50, 200, 86, 171, 30];

function findBestWay(maxSize, Sizes, Prices) {
  const result = [];
  let tempPrice = 0;
  let tempSize = 0;
  const tempArr = [];
  for (let i = 0; i < Sizes.length; i++) {
    let priceOneThing = Math.floor(Prices[i] / Sizes[i]);
    tempArr.push(priceOneThing + '|' + i);
  }
  const sortArr = tempArr.sort((a, b) => a.slice(0, 2) < b.slice(0, 2) ? 1 : -1);
  for (let j = 0; j < Sizes.length; j++) {
    const extra = tempArr[j].slice(3, 4);
    const size = Sizes[extra];
    const price = Prices[extra]; 
    if (tempSize + size < maxSize) {
      tempSize += size;
      tempPrice += price;
      result.push(extra);
    }
  }
  console.log(`Price is ${tempPrice} at the moment`);
  console.log(`Size is ${tempSize} at the moment`);
  console.log(`maxSize is ${maxSize}`);
  return result;
};
console.log(findBestWay(12, Sizes, Prices));
