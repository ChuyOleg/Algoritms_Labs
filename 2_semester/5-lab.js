'use strict';


function HashTable(arr, size = 3) {
  const store = [];
  let countCollision = 0;
  function hash(string) {
    let index = 0;
    for (let i = 0; i < string.length; i++) {
      index += string.charCodeAt(i) * (i + 1);
    }
    return index % size;
  }

  function findMatchingIndex(list, key) {
    for (let i = 0; i < list.length; i++) {
      if (list[i][0] == key) return i;
    }
  }

  return {
    setElement(key, value) {
      const index = hash(key);
      if (!store[index]) {
        store[index] = [
          [key, value]
        ];
      }
      else {
        const list = store[index];
        const matchingIndex = findMatchingIndex(list, key);
        if (matchingIndex + 1) {
           list[matchingIndex] = [key, value];
           return;
        }
        countCollision += 1;
        list.push([key, value]);
      }
    },
    getElement(key) {
      const index = hash(key);
      if (store[index]) {
        const list = store[index];
        const matchingIndex = findMatchingIndex(list, key);
        if (matchingIndex) return list[matchingIndex][1];
      }
    },
    dump() {
      console.log(`Here are ${countCollision} collisions`);
      return store;
    }
  }
}

const array = [5, 3, 2, 7, 6, 4, 5, 8, 4, 6, 4, 2, 1, 3];


function findResult(arr, number) {
  const ht = new HashTable(arr);
  let counter = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      let key = arr[i] + ' | ' + arr[j];
      let sum = arr[i] + arr[j];
      if (sum == number) {
        ht.setElement(key, sum);
      } 
    } 
  }
  return ht.dump();
};

console.log(findResult(array, 9));
