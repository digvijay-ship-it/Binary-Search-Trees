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
        this.arr = this.arr.sort(function (a, b) {
          return a - b;
        });
      }
    } else if (value < node.value) {
      if (node.leftNode) {
        this.insert(value, node.leftNode);
        return;
      } else {
        node.leftNode = new Node(value);
        this.arr.push(value);
        this.arr = this.arr.sort(function (a, b) {
          return a - b;
        });
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
  heightOfTree(node = this.root, LeftHeight = 0, rightHeight = 0, height = 0) {
    height = LeftHeight > rightHeight ? LeftHeight : rightHeight;

    if (node === null) return 0;
    if (!node.leftNode && !node.rightNode) return height;
    else {
      if (node.leftNode) {
        LeftHeight += 1;
        return this.heightOfTree(
          node.leftNode,
          LeftHeight,
          rightHeight,
          height
        );
      }
      if (node.rightNode) {
        rightHeight += 1;
        return this.heightOfTree(
          node.rightNode,
          LeftHeight,
          rightHeight,
          height
        );
      }
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
      if (leafNodeHeight > 1) {
        return false;
      }
      return true;
    }
    return status;
  }
}

const tree = new Tree([-1, 0, 1, 2, 3, 4]);
tree.delete(0);
tree.delete(-1);
