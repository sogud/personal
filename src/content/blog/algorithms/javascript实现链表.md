---
title: "JavaScript 链表完全指南：从单链表到双向链表"
description: "深入解析链表数据结构的原理，对比数组的优劣，详细实现单链表、双向链表、循环链表及其在实际开发中的应用"
pubDate: "2018-01-13T16:07:32"
tags: ["JavaScript", "数据结构", "算法", "链表"]
---

# JavaScript 链表完全指南：从单链表到双向链表

链表是计算机科学中最基础也是最重要的数据结构之一。与数组不同，链表中的元素在内存中不必连续存储，这赋予了链表独特的灵活性和动态性。

## 链表 vs 数组：核心差异

| 特性 | 数组 | 链表 |
|------|------|------|
| 内存布局 | 连续 | 分散 |
| 随机访问 | O(1) | O(n) |
| 插入/删除 | O(n) | O(1)* |
| 内存使用 | 预分配，可能浪费 | 按需分配 |
| 缓存命中率 | 高 | 低 |

*注：单向链表在已知位置时为 O(1)，查找位置仍需 O(n)

### 何时使用链表？

- **频繁插入/删除**：链表在任意位置添加或删除元素的时间复杂度为 O(1)
- **未知数据量**：链表可以动态增长，无需预先分配空间
- **内存碎片**：当内存中有大量分散的可用空间时，链表更能有效利用

### 何时使用数组？

- **随机访问频繁**：需要快速访问任意位置的元素
- **内存局部性**：顺序遍历操作较多，数组的缓存命中率更高
- **简单性**：数组 API 更简单直观

## 单链表的实现

### 节点类定义

```javascript
class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}
```

### 完整的单链表实现

```javascript
class LinkedList {
  constructor() {
    this.head = null;  // 头节点
    this.tail = null; // 尾节点（优化访问）
    this.length = 0;  // 链表长度
  }

  // 在链表末尾添加元素
  append(value) {
    const newNode = new ListNode(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length++;
    return this;
  }

  // 在链表头部添加元素
  prepend(value) {
    const newNode = new ListNode(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head = newNode;
    }

    this.length++;
    return this;
  }

  // 在指定位置插入元素
  insert(index, value) {
    // 边界情况：插入到头部或末尾
    if (index === 0) {
      return this.prepend(value);
    }
    if (index >= this.length) {
      return this.append(value);
    }

    const newNode = new ListNode(value);
    const previousNode = this.getNodeAt(index - 1);

    newNode.next = previousNode.next;
    previousNode.next = newNode;

    this.length++;
    return this;
  }

  // 移除指定位置的元素
  removeAt(index) {
    if (index < 0 || index >= this.length) {
      return undefined;
    }

    let removedNode;

    if (index === 0) {
      removedNode = this.head;
      this.head = this.head.next;

      if (this.length === 1) {
        this.tail = null;
      }
    } else {
      const previousNode = this.getNodeAt(index - 1);
      removedNode = previousNode.next;
      previousNode.next = removedNode.next;

      if (index === this.length - 1) {
        this.tail = previousNode;
      }
    }

    this.length--;
    return removedNode?.value;
  }

  // 按值移除第一个匹配的节点
  remove(value) {
    const index = this.indexOf(value);
    return this.removeAt(index);
  }

  // 获取指定位置的节点
  getNodeAt(index) {
    if (index < 0 || index >= this.length) {
      return null;
    }

    let current = this.head;
    for (let i = 0; i < index; i++) {
      current = current.next;
    }
    return current;
  }

  // 获取指定位置的值
  get(index) {
    const node = this.getNodeAt(index);
    return node?.value;
  }

  // 查找元素的索引
  indexOf(value) {
    let current = this.head;
    let index = 0;

    while (current) {
      if (current.value === value) {
        return index;
      }
      current = current.next;
      index++;
    }

    return -1;
  }

  // 检查是否包含元素
  contains(value) {
    return this.indexOf(value) !== -1;
  }

  // 检查链表是否为空
  isEmpty() {
    return this.length === 0;
  }

  // 获取链表大小
  size() {
    return this.length;
  }

  // 清空链表
  clear() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // 转换为数组
  toArray() {
    const result = [];
    let current = this.head;

    while (current) {
      result.push(current.value);
      current = current.next;
    }

    return result;
  }

  // 转换为字符串
  toString() {
    return this.toArray().join(' -> ');
  }

  // 反转链表
  reverse() {
    let previous = null;
    let current = this.head;
    this.tail = this.head;

    while (current) {
      const next = current.next;
      current.next = previous;
      previous = current;
      current = next;
    }

    this.head = previous;
    return this;
  }
}

// 使用示例
const list = new LinkedList();
list.append(1);
list.append(2);
list.append(3);
list.prepend(0);
list.insert(2, 1.5);

console.log(list.toString()); // 0 -> 1 -> 1.5 -> 2 -> 3
console.log(list.get(2)); // 1.5
console.log(list.indexOf(3)); // 4
list.removeAt(2);
console.log(list.toString()); // 0 -> 1 -> 2 -> 3
```

### 复杂度分析

| 操作 | 时间复杂度 | 空间复杂度 |
|------|------------|------------|
| append | O(1)* | O(1) |
| prepend | O(1) | O(1) |
| insert | O(n)** | O(1) |
| removeAt | O(n)** | O(1) |
| get | O(n) | O(1) |
| indexOf | O(n) | O(1) |
| reverse | O(n) | O(1) |

*带 tail 指针时 ** 查找位置 O(n)，操作本身 O(1)

## 双向链表

双向链表在每个节点中同时保存前驱和后继指针，支持双向遍历：

```javascript
class DoublyListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

class DoublyLinkedList {
  constructor() {
    this.head = null;
    this.tail = null;
    this.length = 0;
  }

  // 头部添加
  prepend(value) {
    const newNode = new DoublyListNode(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.next = this.head;
      this.head.prev = newNode;
      this.head = newNode;
    }

    this.length++;
    return this;
  }

  // 尾部添加
  append(value) {
    const newNode = new DoublyListNode(value);

    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      newNode.prev = this.tail;
      this.tail.next = newNode;
      this.tail = newNode;
    }

    this.length++;
    return this;
  }

  // 从头部移除
  shift() {
    if (!this.head) return undefined;

    const value = this.head.value;

    if (this.length === 1) {
      this.head = null;
      this.tail = null;
    } else {
      this.head = this.head.next;
      this.head.prev = null;
    }

    this.length--;
    return value;
  }

  // 从尾部移除
  pop() {
    if (!this.tail) return undefined;

    const value = this.tail.value;

    if (this.length === 1) {
      this.head = null;
      this.tail = null;
    } else {
      this.tail = this.tail.prev;
      this.tail.next = null;
    }

    this.length--;
    return value;
  }

  // 反向遍历
  reverseTraverse(callback) {
    let current = this.tail;

    while (current) {
      callback(current.value);
      current = current.prev;
    }
  }
}
```

### 双向链表的优势

1. **双向遍历**：可以从头部或尾部开始遍历
2. **高效的尾部操作**：O(1) 时间复杂度进行尾部插入/删除
3. **更快的反向遍历**：不需要重新遍历
4. **实现 LRU Cache**：双向链表是 LRU 缓存的标准实现方式

## 循环链表

循环链表的尾节点指向头节点，形成一个环：

```javascript
class CircularLinkedList {
  constructor() {
    this.head = null;
    this.length = 0;
  }

  append(value) {
    const newNode = new ListNode(value);

    if (!this.head) {
      newNode.next = newNode; // 指向自己
      this.head = newNode;
    } else {
      // 找到最后一个节点
      let current = this.head;
      while (current.next !== this.head) {
        current = current.next;
      }
      current.next = newNode;
      newNode.next = this.head;
    }

    this.length++;
  }

  // 约瑟夫问题（Josephus Problem）
  josephusElimination(k) {
    if (!this.head) return null;
    if (k === 1) {
      const result = this.head.value;
      this.head = null;
      this.length = 0;
      return result;
    }

    let current = this.head;

    while (this.length > 1) {
      // 移动到第 k 个人
      for (let i = 1; i < k; i++) {
        current = current.next;
      }

      // 跳过被淘汰的人
      const eliminated = current;
      current = current.next;
      this.removeNode(eliminated);
    }

    const result = this.head.value;
    this.head = null;
    this.length = 0;
    return result;
  }

  removeNode(node) {
    let current = this.head;

    // 找到要删除节点的前一个节点
    while (current.next !== node) {
      current = current.next;
    }

    current.next = node.next;

    if (node === this.head) {
      this.head = node.next;
    }

    this.length--;
  }
}

// 约瑟夫问题示例：5 个人，每 2 个人淘汰一个
function josephus(n, k) {
  const list = new CircularLinkedList();

  // 创建循环链表
  for (let i = 1; i <= n; i++) {
    list.append(i);
  }

  // 依次淘汰
  const survivors = [];
  while (list.length > 1) {
    for (let i = 1; i < k; i++) {
      list.head = list.head.next;
    }
    const eliminated = list.head;
    list.head = list.head.next;
    list.removeNode(eliminated);
    survivors.push(eliminated.value);
  }

  survivors.push(list.head.value);
  return survivors;
}

console.log(josephus(5, 2)); // [2, 4, 1, 5, 3] 淘汰顺序
```

## 实际应用场景

### 1. LRU 缓存实现

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (!this.cache.has(key)) return -1;

    // 移到末尾（最近使用）
    const value = this.cache.get(key);
    this.cache.delete(key);
    this.cache.set(key, value);

    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // 删除最旧的（第一个）
      const oldestKey = this.cache.keys().next().value;
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, value);
  }
}

// 使用双向链表实现的 LRU（更高效）
class LRUCacheOptimized {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
    // 伪头尾节点
    this.head = new DoublyListNode('head');
    this.tail = new DoublyListNode('tail');
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  moveToHead(node) {
    this.removeNode(node);
    this.addToHead(node);
  }

  addToHead(node) {
    node.prev = this.head;
    node.next = this.head.next;
    this.head.next.prev = node;
    this.head.next = node;
  }

  removeNode(node) {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  get(key) {
    const node = this.cache.get(key);
    if (!node) return -1;
    this.moveToHead(node);
    return node.value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      node.value = value;
      this.moveToHead(node);
    } else {
      const newNode = new DoublyListNode(value);
      this.cache.set(key, newNode);
      this.addToHead(newNode);

      if (this.cache.size > this.capacity) {
        const tailPrev = this.tail.prev;
        this.removeNode(tailPrev);
        this.cache.delete(tailPrev.key);
      }
    }
  }
}
```

### 2. 浏览器历史导航

```javascript
class BrowserHistory {
  constructor() {
    this.history = new DoublyLinkedList();
    this.current = null;
  }

  visit(url) {
    // 清除当前页面之后的所有历史
    if (this.current) {
      // 删除 current 之后的所有节点
      let node = this.current.next;
      while (node) {
        const next = node.next;
        node = next;
      }
    }

    this.history.append(url);
    this.current = this.history.tail;
  }

  back() {
    if (!this.current || !this.current.prev ||
        this.current.prev === this.history.head) {
      return null;
    }
    this.current = this.current.prev;
    return this.current.value;
  }

  forward() {
    if (!this.current || !this.current.next) {
      return null;
    }
    this.current = this.current.next;
    return this.current.value;
  }
}
```

### 3. 多项式运算

```javascript
class Polynomial {
  constructor() {
    this.terms = new LinkedList(); // 按指数排序
  }

  // 添加项
  addTerm(coefficient, exponent) {
    // 查找相同指数的项
    let current = this.terms.head;
    let index = 0;

    while (current) {
      const term = current.value;
      if (term.exponent === exponent) {
        // 合并同类项
        term.coefficient += coefficient;
        if (term.coefficient === 0) {
          this.terms.removeAt(index);
        }
        return this;
      }
      if (term.exponent < exponent) {
        break;
      }
      current = current.next;
      index++;
    }

    // 插入新项
    this.terms.insert(index, { coefficient, exponent });
    return this;
  }

  // 多项式加法
  add(poly) {
    let current = poly.terms.head;

    while (current) {
      this.addTerm(current.value.coefficient, current.value.exponent);
      current = current.next;
    }

    return this;
  }

  // 打印多项式
  toString() {
    const terms = [];
    let current = this.terms.head;

    while (current) {
      const { coefficient, exponent } = current.value;
      if (coefficient !== 0) {
        const sign = coefficient > 0 ? '+' : '';
        const coef = Math.abs(coefficient) === 1 && exponent > 0 ? '' : Math.abs(coefficient);
        const exp = exponent === 0 ? '' : exponent === 1 ? 'x' : `x^${exponent}`;
        terms.push(`${sign}${coef}${exp}`);
      }
      current = current.next;
    }

    return terms.reverse().join(' ') || '0';
  }
}

// 使用示例
const p1 = new Polynomial();
p1.addTerm(3, 2).addTerm(2, 1).addTerm(1, 0);
console.log(p1.toString()); // 3x^2 + 2x + 1

const p2 = new Polynomial();
p2.addTerm(1, 2).addTerm(-2, 1).addTerm(1, 0);
p1.add(p2);
console.log(p1.toString()); // 4x^2 + 1
```

## 总结

链表是一种强大的数据结构，特别适合需要频繁插入删除的场景。理解链表的工作原理对于掌握更复杂的数据结构（如树、图）至关重要。

### 关键要点

1. **链表vs数组**：链表适合写多读少，数组适合读多写少
2. **双向链表**：支持双向遍历，更适合需要尾部操作的场景
3. **循环链表**：适合周期性问题，如约瑟夫环
4. **实际应用**：LRU缓存、浏览器历史、表达式运算等

在后续文章中，我们将继续探讨更复杂的数据结构，如栈、队列、树和图。