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
    if (value > node.value) {
      if (node.rightNode) {
        this.insert(value, node.rightNode);
        return;
      } else {
        node.rightNode = new Node(value);
      }
    } else if (value < node.value) {
      if (node.leftNode) {
        this.insert(value, node.leftNode);
        return;
      } else {
        node.leftNode = new Node(value);
      }
    } else if (value === node.value) return;
  }
  delete(value, node = this.root, parent = null) {
    if (value > node.value) {
      if (node.rightNode) {
        this.delete(value, node.rightNode, node);
        return;
      }
    } else if (value < node.value) {
      if (node.leftNode) {
        this.delete(value, node.leftNode, node);
        return;
      }
    } else if (value === node.value) {
      // case 1 if node is leafNode
      if (node.leftNode === null && node.rightNode === null) {
        console.log(parent);
        if (parent.rightNode) {
          if (parent.rightNode.value === value) {
            parent.rightNode = null;
          } else {
            parent.leftNode = null;
          }
        }
      }
      // case 2 if node has 1 children
      else if (node.leftNode === null || node.rightNode === null) {
        if (!(node.leftNode === null)) {
          parent.leftNode = node.leftNode;
          return;
        } else if (!(node.rightNode === null)) {
          parent.rightNode = node.rightNode;
          return;
        }
      }
      // case 3 if node has 2 children
      else if (node.leftNode && node.rightNode) {
        // insert leftmost leafNode of right branch of node
        let ref = node.rightNode;
        while (ref.leftNode.leftNode) {
          ref = ref.leftNode;
        }
        node.value = ref.leftNode.value;
        ref.leftNode = null;
        return;
      }
    }
  }
  find(value) {
    let ref = this.root;
    while (ref) {
      if (ref.value > value) {
        ref = ref.leftNode;
      } else if (ref.value < value) {
        ref = ref.rightNode;
      } else if (ref.value === value) {
        return ref;
      }
    }
  }
  PreOrder(callBackFunc, nodeQueue = [], node = this.root) {
    nodeQueue.push(node);
    if (nodeQueue.length > 0) {
      //
      if (node.leftNode) {
        this.PreOrder(callBackFunc, nodeQueue, node.leftNode);
      }
      if (node.rightNode) {
        this.PreOrder(callBackFunc, nodeQueue, node.rightNode);
      }
      callBackFunc(nodeQueue.shift());
    }
  }
  inOrder(callBackFunc, nodeQueue = [], node = this.root) {
    if (node.leftNode) {
      this.inOrder(callBackFunc, nodeQueue, node.leftNode);
    }
    nodeQueue.push(node);
    if (node.rightNode) {
      this.inOrder(callBackFunc, nodeQueue, node.rightNode);
    }
    callBackFunc(nodeQueue.shift());
    return;
  }
  postOrder(callBackFunc, nodeQueue = [], node = this.root) {
    if (node.rightNode) {
      this.postOrder(callBackFunc, nodeQueue, node.rightNode);
    }
    if (node.leftNode) {
      this.postOrder(callBackFunc, nodeQueue, node.leftNode);
    }
    nodeQueue.push(node);
    callBackFunc(nodeQueue.shift());
    return;
  }
}

const tree = new Tree([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]);
tree.postOrder(function (node) {
  console.log(node.value);
});
