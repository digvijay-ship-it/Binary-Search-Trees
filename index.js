class Node {
  constructor(value, leftNode = null, rightNode = null) {
    this.value = value;
    this.leftNode = leftNode;
    this.rightNode = rightNode;
  }
}

class Tree {
  constructor(arr) {
    this.arr = arr.sort(function (a, b) {
      return a - b;
    });
    this.arr = this.arr.filter(
      (item, index) => this.arr.indexOf(item) === index
    );
    this.root = this.buildTree(this.arr);
  }
  buildTree(arr) {
    if (arr.length === 0) return;
    if (arr.length === 1) {
      const LeafNode = new Node(arr[0]);
      return LeafNode;
    } else {
      const ArrLength = arr.length;
      let MidIndex = Math.floor(ArrLength / 2);

      const leftArr = arr.splice(0, MidIndex);
      const MidElement = arr.splice(0, 1);
      const rightArr = arr;

      const ParentNode = new Node(
        MidElement[0],
        this.buildTree(leftArr),
        this.buildTree(rightArr)
      );
      return ParentNode;
    }
  }
  insert(value, node = this.root) {
    // value will be comared with node
    // if value > then send to right
    if (value > node.value) {
      if (node.rightNode) {
        this.insert(value, node.rightNode);
        return;
      } else {
        node.rightNode = new Node(value);
      }
    }
    // if value < then send to left
    else if (value < node.value) {
      if (node.leftNode) {
        this.insert(value, node.leftNode);
        return;
      } else {
        node.leftNode = new Node(value);
      }
    } else if (value === node.value) return;
  }
}

const tree = new Tree([1, 4, 5, 5, 4, 2, 3, 9, 8, 7, 6, 5]);
tree.insert(0);
tree.insert(1);
tree.insert(100);
console.log(tree.root);
