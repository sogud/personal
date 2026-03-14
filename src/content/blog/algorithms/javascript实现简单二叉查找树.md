---
title: "JavaScript 二叉查找树完全指南"
description: "深入讲解二叉查找树的原理、实现、遍历方式（先序、中序、后序）、搜索、删除操作以及平衡树概念"
pubDate: "2018-01-13T16:07:32"
tags: ["JavaScript", "数据结构", "算法", "二叉树"]
---

# JavaScript 二叉查找树完全指南

二叉查找树（Binary Search Tree, BST）是计算机科学中最重要的数据结构之一，它结合了数组的快速查找和链表的灵活插入删除特性。

## 什么是二叉树？

二叉树是一种每个节点最多有两个子节点的数据结构：
- **根节点**：树的顶端节点
- **叶子节点**：没有子节点的节点
- **子节点**：其他节点的后代
- **度**：节点拥有的子节点数量

### 二叉查找树的特性

对于二叉查找树中的任意节点：
- **左子树**的所有节点值 **小于** 该节点
- **右子树**的所有节点值 **大于** 该节点
- 左右子树也分别是二叉查找树

这种特性使得查找效率达到 **O(log n)** 级别（平衡时）。

## 完整实现

```javascript
class BinarySearchTree {
  constructor() {
    this.root = null;
  }

  // 节点类
  Node = class {
    constructor(key) {
      this.key = key;
      this.left = null;
      this.right = null;
    }
  }

  // 插入节点
  insert(key) {
    const newNode = new this.Node(key);

    if (this.root === null) {
      this.root = newNode;
    } else {
      this.insertNode(this.root, newNode);
    }
  }

  insertNode(node, newNode) {
    if (newNode.key < node.key) {
      if (node.left === null) {
        node.left = newNode;
      } else {
        this.insertNode(node.left, newNode);
      }
    } else {
      if (node.right === null) {
        node.right = newNode;
      } else {
        this.insertNode(node.right, newNode);
      }
    }
  }

  // 中序遍历（左-根-右）- 输出有序结果
  inOrderTraverse(callback) {
    this.inOrderTraverseNode(this.root, callback);
  }

  inOrderTraverseNode(node, callback) {
    if (node !== null) {
      this.inOrderTraverseNode(node.left, callback);
      callback(node.key);
      this.inOrderTraverseNode(node.right, callback);
    }
  }

  // 先序遍历（根-左-右）- 适合复制树
  preOrderTraverse(callback) {
    this.preOrderTraverseNode(this.root, callback);
  }

  preOrderTraverseNode(node, callback) {
    if (node !== null) {
      callback(node.key);
      this.preOrderTraverseNode(node.left, callback);
      this.preOrderTraverseNode(node.right, callback);
    }
  }

  // 后序遍历（左-右-根）- 适合删除操作
  postOrderTraverse(callback) {
    this.postOrderTraverseNode(this.root, callback);
  }

  postOrderTraverseNode(node, callback) {
    if (node !== null) {
      this.postOrderTraverseNode(node.left, callback);
      this.postOrderTraverseNode(node.right, callback);
      callback(node.key);
    }
  }

  // 搜索最小值 - 最左叶子节点
  min() {
    return this.minNode(this.root);
  }

  minNode(node) {
    if (node) {
      while (node.left !== null) {
        node = node.left;
      }
      return node.key;
    }
    return null;
  }

  // 搜索最大值 - 最右叶子节点
  max() {
    return this.maxNode(this.root);
  }

  maxNode(node) {
    if (node) {
      while (node.right !== null) {
        node = node.right;
      }
      return node.key;
    }
    return null;
  }

  // 搜索特定值
  search(key) {
    return this.searchNode(this.root, key);
  }

  searchNode(node, key) {
    if (node === null) {
      return false;
    }

    if (key < node.key) {
      return this.searchNode(node.left, key);
    } else if (key > node.key) {
      return this.searchNode(node.right, key);
    } else {
      return true;
    }
  }

  // 删除节点
  remove(key) {
    this.root = this.removeNode(this.root, key);
  }

  removeNode(node, key) {
    if (node === null) {
      return null;
    }

    if (key < node.key) {
      node.left = this.removeNode(node.left, key);
      return node;
    } else if (key > node.key) {
      node.right = this.removeNode(node.right, key);
      return node;
    } else {
      // 找到要删除的节点

      // 情况1：叶子节点
      if (node.left === null && node.right === null) {
        node = null;
        return node;
      }

      // 情况2：只有一个子节点
      if (node.left === null) {
        node = node.right;
        return node;
      }
      if (node.right === null) {
        node = node.left;
        return node;
      }

      // 情况3：有两个子节点
      // 找到右子树中的最小节点
      const aux = this.findMinNode(node.right);
      node.key = aux.key;
      node.right = this.removeNode(node.right, aux.key);
      return node;
    }
  }

  findMinNode(node) {
    while (node.left !== null) {
      node = node.left;
    }
    return node;
  }

  // 获取树的高度
  height() {
    return this.heightNode(this.root);
  }

  heightNode(node) {
    if (node === null) {
      return -1;
    }
    const leftHeight = this.heightNode(node.left);
    const rightHeight = this.heightNode(node.right);
    return Math.max(leftHeight, rightHeight) + 1;
  }

  // 检查树是否平衡
  isBalanced() {
    return this.checkBalance(this.root) !== -1;
  }

  checkBalance(node) {
    if (node === null) {
      return 0;
    }

    const left = this.checkBalance(node.left);
    const right = this.checkBalance(node.right);

    if (left === -1 || right === -1 || Math.abs(left - right) > 1) {
      return -1;
    }

    return Math.max(left, right) + 1;
  }
}

// 使用示例
const bst = new BinarySearchTree();
[7, 3, 6, 2, 8, 13, 5, 15].forEach(key => bst.insert(key));

console.log('中序遍历（从小到大）:');
bst.inOrderTraverse(key => console.log(key));
// 输出: 2, 3, 5, 6, 7, 8, 13, 15

console.log('最小值:', bst.min()); // 2
console.log('最大值:', bst.max()); // 15
console.log('查找 8:', bst.search(8)); // true
console.log('查找 9:', bst.search(9)); // false
```

## 三种遍历方式的区别与应用

| 遍历方式 | 顺序 | 应用场景 |
|----------|------|----------|
| 先序 | 根 → 左 → 右 | 复制树、序列化 |
| 中序 | 左 → 根 → 右 | **排序**、搜索树 |
| 后序 | 左 → 右 → 根 | **删除节点**、计算文件大小 |

## 删除节点的三种情况

### 情况1：叶子节点
直接删除，父节点指向 null。

### 情况2：只有一个子节点
用子节点替代被删除的位置。

### 情况3：有两个子节点
找到**右子树中的最小节点**（或左子树中的最大节点），用它替换被删除的节点，然后删除那个最小节点。

## 平衡二叉树

普通二叉查找树可能退化成链表，导致查找变成 O(n)。平衡树通过旋转操作保持左右子树高度差 <= 1。

### AVL 树

```javascript
class AVLTree {
  constructor() {
    this.root = null;
  }

  getHeight(node) {
    return node ? node.height : 0;
  }

  getBalance(node) {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  // 右旋
  rightRotate(y) {
    const x = y.left;
    const T2 = x.right;

    x.right = y;
    y.left = T2;

    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

    return x;
  }

  // 左旋
  leftRotate(x) {
    const y = x.right;
    const T2 = y.left;

    y.left = x;
    x.right = T2;

    x.height = Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height = Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

    return y;
  }

  insert(key) {
    this.root = this.insertNode(this.root, key);
  }

  insertNode(node, key) {
    if (!node) {
      return { key, left: null, right: null, height: 1 };
    }

    if (key < node.key) {
      node.left = this.insertNode(node.left, key);
    } else if (key > node.key) {
      node.right = this.insertNode(node.right, key);
    } else {
      return node;
    }

    // 更新高度
    node.height = 1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));

    // 获取平衡因子
    const balance = this.getBalance(node);

    // 左左情况 - 右旋
    if (balance > 1 && key < node.left.key) {
      return this.rightRotate(node);
    }

    // 右右情况 - 左旋
    if (balance < -1 && key > node.right.key) {
      return this.leftRotate(node);
    }

    // 左右情况 - 先左旋再右旋
    if (balance > 1 && key > node.left.key) {
      node.left = this.leftRotate(node.left);
      return this.rightRotate(node);
    }

    // 右左情况 - 先右旋再左旋
    if (balance < -1 && key < node.right.key) {
      node.right = this.rightRotate(node.right);
      return this.leftRotate(node);
    }

    return node;
  }
}
```

## 实际应用场景

### 1. 符号表

```javascript
class SymbolTable {
  constructor() {
    this.bst = new BinarySearchTree();
  }

  set(symbol, value) {
    this.bst.insert({ symbol, value });
  }

  get(symbol) {
    // 需要中序遍历查找
    let result = null;
    this.bst.inOrderTraverse(node => {
      if (node.symbol === symbol) {
        result = node.value;
      }
    });
    return result;
  }
}
```

### 2. 优先级队列

```javascript
class BSTPriorityQueue {
  constructor() {
    this.bst = new BinarySearchTree();
  }

  enqueue(priority, value) {
    this.bst.insert({ priority, value });
  }

  dequeue() {
    let min = null;
    this.bst.inOrderTraverse(node => {
      if (!min || node.priority < min.priority) {
        min = node;
      }
    });
    if (min) {
      this.bst.remove(min.priority);
    }
    return min?.value;
  }
}
```

## 总结

二叉查找树是理解更复杂数据结构（红黑树、AVL树、B树）的基础。

### 关键要点

1. **查找效率**：平衡时 O(log n)，退化成链表时 O(n)
2. **中序遍历**：输出有序序列
3. **删除操作**：两个子节点时用后继节点替换
4. **平衡树**：AVL树、红黑树保持平衡
5. **应用**：符号表、优先队列、搜索系统