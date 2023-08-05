function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    const midIndex = Math.floor(arr.length / 2);
    const leftArr = arr.splice(0, midIndex);
    const rightArr = arr;
    const sorted = merge(mergeSort(leftArr), mergeSort(rightArr));
    return sorted;
  }
}
function merge(
  leftArr,
  rightArr,
  leftArrIndex = 0,
  rightArrIndex = 0,
  newArr = []
) {
  if (leftArr[leftArrIndex] <= rightArr[rightArrIndex]) {
    newArr.push(leftArr[leftArrIndex]);
    leftArrIndex++;
    if (leftArrIndex === leftArr.length) {
      newArr.push(
        ...rightArr.splice(rightArrIndex, rightArr.length - rightArrIndex)
      );
      return newArr;
    }
  } else if (leftArr[leftArrIndex] >= rightArr[rightArrIndex]) {
    newArr.push(rightArr[rightArrIndex]);
    rightArrIndex++;
    if (rightArrIndex === rightArr.length) {
      newArr.push(
        ...leftArr.splice(leftArrIndex, leftArr.length - leftArrIndex)
      );
      return newArr;
    }
  }
  return merge(leftArr, rightArr, leftArrIndex, rightArrIndex, newArr);
}
class Node {
  constructor(value, leftNode = null, rightNode = null) {
    this.value = value;
    this.leftNode = leftNode;
    this.rightNode = rightNode;
  }
}

class Tree {
  constructor(arr) {
    this.arr = mergeSort(arr);
    this.arr = this.arr.filter(
      (item, index) => this.arr.indexOf(item) === index
    );
    this.root = this.buildTree(Array.from(this.arr));
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
        this.arr.push(value);
        this.arr = mergeSort(this.arr);
      }
    } else if (value < node.value) {
      if (node.leftNode) {
        this.insert(value, node.leftNode);
        return;
      } else {
        node.leftNode = new Node(value);
        this.arr.push(value);
        this.arr = mergeSort(this.arr);
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
        let previousNode;
        let ref = node.rightNode;
        previousNode = node;
        while (ref.leftNode) {
          previousNode = ref;
          ref = ref.leftNode;
        }
        node.value = ref.value;
        previousNode.leftNode = null;
      }
      const deletingValueIndex = this.arr.indexOf(value);
      if (deletingValueIndex !== -1) {
        this.arr.splice(deletingValueIndex, 1);
      }
      return;
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
  levelOrder(callBackFunc, discoverQueue = [], node = this.root) {
    if (node) {
      discoverQueue.push(node);
    }

    if (discoverQueue.length > 0) {
      const readNode = discoverQueue.shift();
      callBackFunc(readNode);
      if (readNode.leftNode) {
        discoverQueue.push(readNode.leftNode);
      }
      if (readNode.rightNode) {
        discoverQueue.push(readNode.rightNode);
      }
      this.levelOrder(callBackFunc, discoverQueue, readQueue, null);
    }
  }
  depth(node, NoOfEdges = 0, refNode = this.root) {
    if (refNode === null) return null;
    if (refNode.value === node) {
      return NoOfEdges;
    } else {
      if (refNode.value > node) {
        refNode = refNode.leftNode;
        NoOfEdges += 1;
      } else if (refNode.value < node) {
        refNode = refNode.rightNode;
        NoOfEdges += 1;
      }
      return this.depth(node, NoOfEdges, refNode);
    }
  }
  heightOfTree(node = this.root) {
    if (node === null) {
      return 0;
    } else {
      let lDepth = this.heightOfTree(node.leftNode);
      let rDepth = this.heightOfTree(node.rightNode);

      if (lDepth > rDepth) {
        return lDepth + 1;
      } else return rDepth + 1;
    }
  }
  heightOfNode(value) {
    const heightOfTree = this.heightOfTree();
    const depthOfNode = this.depth(value);

    return heightOfTree - depthOfNode;
  }
  isBalanced(node = this.root, heightOfTree = this.heightOfTree()) {
    let status = true;
    if (node.leftNode) {
      status = this.isBalanced(node.leftNode, heightOfTree);
      if (status === false) {
        return status;
      }
    }
    if (node.rightNode) {
      status = this.isBalanced(node.rightNode, heightOfTree);
      if (status === false) {
        return status;
      }
    } else if (!node.leftNode && !node.rightNode) {
      const leafNodeHeight = this.heightOfNode(node.value);
      if (leafNodeHeight > 2) {
        return false;
      }
      return true;
    }
    return status;
  }
  rebalanceTree(arr = null) {
    if (arr) {
      this.arr = mergeSort(arr);
      this.arr = this.arr.filter(
        (item, index) => this.arr.indexOf(item) === index
      );
    }
    this.root = this.buildTree(Array.from(this.arr));
  }
}

const tree = new Tree([1, 2, 3]);
tree.insert(4);
tree.insert(5);
tree.insert(6);
// tree.insert(7);
// tree.insert(8);
console.log(tree.isBalanced());
