'use strict';

class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  insertNumberNode(data, left = null, right = null) {
    let Node = {
      data,
      left,
      right
    };
    let currentNumberNode;

    if (!this.root) {
      this.root = Node;
    } else {
      currentNumberNode = this.root;
      while (currentNumberNode) {
        if (data < currentNumberNode.data) {

          if (!currentNumberNode.left) {
            currentNumberNode.left = Node;
            break;
          } else {
            currentNumberNode = currentNumberNode.left;
          }
        } else if (data > currentNumberNode.data) {
          if (!currentNumberNode.right) {
            currentNumberNode.right = Node;
            break;
          } else {
            currentNumberNode = currentNumberNode.right;
          }
        } else {
          console.log("Try Different Value");
          break;
        }
      }
    }
  }
}
let BSTtest = new BinarySearchTree();
BSTtest.insertNumberNode(5);

BSTtest.insertNumberNode(6);

BSTtest.insertNumberNode(4);

BSTtest.insertNumberNode(8);

BSTtest.insertNumberNode(3);

BSTtest.insertNumberNode(9);

BSTtest.insertNumberNode(1);


const util = require('util')

console.log(util.inspect(BSTtest, {showHidden: false, depth: null}))
