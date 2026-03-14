---
title: "JavaScript 实现队列：从基础到优先队列"
description: "深入讲解队列数据结构的原理、循环队列实现、双端队列以及优先队列在实际工程中的应用"
pubDate: "2017-01-13T16:07:32"
tags: ["JavaScript", "数据结构", "算法", "队列"]
---

# JavaScript 实现队列：从基础到优先队列

队列（Queue）是另一种基础且重要的线性数据结构，遵循**先进先出**（FIFO - First In, First Out）原则。从任务调度到消息队列，队列在现代软件开发中无处不在。

## 什么是队列？

队列是一种线性数据结构，元素按照进入的先后顺序排列，新元素添加到队尾，旧元素从队头移除。

### 核心操作与复杂度

| 操作 | 描述 | 时间复杂度 |
|------|------|------------|
| `enqueue` | 入队：将元素添加到队尾 | O(1) |
| `dequeue` | 出队：移除并返回队头元素 | O(1) |
| `front` | 查看队头元素 | O(1) |
| `isEmpty` | 检查队列是否为空 | O(1) |
| `size` | 返回队列大小 | O(1) |

## 实现方式一：基于数组的简单实现

```javascript
class Queue {
  constructor() {
    this.items = [];
  }

  // 入队
  enqueue(element) {
    this.items.push(element);
  }

  // 出队
  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }
    return this.items.shift();
  }

  // 查看队头元素
  front() {
    return this.isEmpty() ? undefined : this.items[0];
  }

  // 查看队尾元素
  back() {
    return this.isEmpty() ? undefined : this.items[this.items.length - 1];
  }

  // 检查是否为空
  isEmpty() {
    return this.items.length === 0;
  }

  // 获取大小
  size() {
    return this.items.length;
  }

  // 清空队列
  clear() {
    this.items = [];
  }

  // 打印队列
  print() {
    console.log(this.items.toString());
  }
}

// 使用示例
const queue = new Queue();
queue.enqueue(1);
queue.enqueue(2);
queue.enqueue(3);
console.log(queue.dequeue()); // 1
console.log(queue.front()); // 2
console.log(queue.size()); // 2
```

### 性能问题分析

上面的实现存在一个严重的性能问题：`shift()` 操作需要移动所有元素，时间复杂度为 **O(n)**。

```javascript
// 性能测试
const perfQueue = new Queue();
const start = Date.now();
for (let i = 0; i < 10000; i++) {
  perfQueue.enqueue(i);
}
for (let i = 0; i < 10000; i++) {
  perfQueue.dequeue();
}
console.log(`耗时：${Date.now() - start}ms`); // 可能超过 100ms
```

## 实现方式二：双指针优化

使用两个指针跟踪队头和队尾，避免数组元素的移动：

```javascript
class OptimizedQueue {
  constructor() {
    this.items = {};
    this.head = 0;
    this.tail = 0;
  }

  enqueue(element) {
    this.items[this.tail] = element;
    this.tail++;
  }

  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }
    const item = this.items[this.head];
    delete this.items[this.head];
    this.head++;
    return item;
  }

  front() {
    return this.isEmpty() ? undefined : this.items[this.head];
  }

  isEmpty() {
    return this.tail - this.head === 0;
  }

  size() {
    return this.tail - this.head;
  }

  clear() {
    this.items = {};
    this.head = 0;
    this.tail = 0;
  }
}
```

### 内存泄漏问题

上面的实现随着时间推移会积累大量已删除的键。更好的做法是定期清理：

```javascript
class OptimizedQueue {
  constructor() {
    this.items = {};
    this.head = 0;
    this.tail = 0;
    this.cleanupThreshold = 1000;
  }

  dequeue() {
    if (this.isEmpty()) return undefined;

    const item = this.items[this.head];
    delete this.items[this.head];
    this.head++;

    // 定期清理已删除的键
    if (this.head > this.cleanupThreshold && this.head > this.tail / 2) {
      this.cleanup();
    }

    return item;
  }

  cleanup() {
    const newItems = {};
    let newIndex = 0;
    for (let i = this.head; i < this.tail; i++) {
      newItems[newIndex++] = this.items[i];
    }
    this.items = newItems;
    this.head = 0;
    this.tail = newIndex;
  }
}
```

## 实现方式三：循环队列

循环队列是队列的高效实现，特别适合固定容量的场景：

```javascript
class CircularQueue {
  constructor(capacity) {
    this.capacity = capacity;
    this.items = new Array(capacity);
    this.head = 0;
    this.tail = 0;
    this.count = 0;
  }

  enqueue(element) {
    if (this.isFull()) {
      throw new Error('Queue is full');
    }
    this.items[this.tail] = element;
    this.tail = (this.tail + 1) % this.capacity;
    this.count++;
  }

  dequeue() {
    if (this.isEmpty()) {
      return undefined;
    }
    const item = this.items[this.head];
    this.head = (this.head + 1) % this.capacity;
    this.count--;
    return item;
  }

  front() {
    return this.isEmpty() ? undefined : this.items[this.head];
  }

  isFull() {
    return this.count === this.capacity;
  }

  isEmpty() {
    return this.count === 0;
  }

  size() {
    return this.count;
  }
}

// 使用示例
const circularQueue = new CircularQueue(5);
circularQueue.enqueue(1);
circularQueue.enqueue(2);
circularQueue.enqueue(3);
console.log(circularQueue.dequeue()); // 1
circularQueue.enqueue(4);
circularQueue.enqueue(5);
circularQueue.enqueue(6); // 队列已满，会抛出错误
```

### 循环队列的优势

1. **固定内存占用**: 预先分配内存，适合嵌入式或内存受限环境
2. **无内存碎片**: 不需要动态扩容或清理
3. **缓存友好**: 连续内存访问，CPU 缓存命中率高

## 双端队列（Deque）

双端队列允许在两端进行插入和删除操作：

```javascript
class Deque {
  constructor() {
    this.items = {};
    this.front = 0;
    this.back = 0;
  }

  // 从队头添加
  addFront(element) {
    if (this.isEmpty()) {
      this.items[this.front] = element;
    } else if (this.front > 0) {
      this.items[--this.front] = element;
    } else {
      // 需要扩容
      this.expand();
      this.items[this.front] = element;
    }
  }

  // 从队尾添加
  addBack(element) {
    this.items[this.back++] = element;
  }

  // 从队头移除
  removeFront() {
    if (this.isEmpty()) return undefined;
    const item = this.items[this.front];
    delete this.items[this.front++];
    return item;
  }

  // 从队尾移除
  removeBack() {
    if (this.isEmpty()) return undefined;
    const item = this.items[--this.back];
    delete this.items[this.back];
    return item;
  }

  isEmpty() {
    return this.back === this.front;
  }

  size() {
    return this.back - this.front;
  }

  expand() {
    const newItems = {};
    const size = this.size();
    const newFront = 1000;
    let newIndex = newFront;
    for (let i = this.front; i < this.back; i++) {
      newItems[newIndex++] = this.items[i];
    }
    this.items = newItems;
    this.front = newFront;
    this.back = newFront + size;
  }
}
```

## 优先队列

优先队列中的元素按照优先级出队，而非进入顺序：

```javascript
class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(element, priority) {
    const queueElement = { element, priority };

    // 找到合适的插入位置
    let added = false;
    for (let i = 0; i < this.items.length; i++) {
      if (queueElement.priority < this.items[i].priority) {
        this.items.splice(i, 0, queueElement);
        added = true;
        break;
      }
    }

    if (!added) {
      this.items.push(queueElement);
    }
  }

  dequeue() {
    return this.items.shift();
  }

  front() {
    return this.isEmpty() ? undefined : this.items[0];
  }

  isEmpty() {
    return this.items.length === 0;
  }

  size() {
    return this.items.length;
  }

  print() {
    console.log(this.items.map(e => `${e.element}(${e.priority})`).join(' <- '));
  }
}

// 使用示例
const pq = new PriorityQueue();
pq.enqueue('普通任务', 3);
pq.enqueue('紧急任务', 1);
pq.enqueue('重要任务', 2);
pq.print(); // 紧急任务 (1) <- 重要任务 (2) <- 普通任务 (3)
console.log(pq.dequeue()); // { element: '紧急任务', priority: 1 }
```

### 基于堆的优先队列

上面的实现 `enqueue` 是 O(n)，使用堆可以优化到 O(log n)：

```javascript
class HeapPriorityQueue {
  constructor() {
    this.heap = [];
  }

  enqueue(element, priority) {
    this.heap.push({ element, priority });
    this.bubbleUp(this.heap.length - 1);
  }

  dequeue() {
    if (this.isEmpty()) return undefined;

    const result = this.heap[0];
    const last = this.heap.pop();

    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.bubbleDown(0);
    }

    return result;
  }

  bubbleUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.heap[index].priority >= this.heap[parentIndex].priority) break;

      [this.heap[index], this.heap[parentIndex]] =
        [this.heap[parentIndex], this.heap[index]];
      index = parentIndex;
    }
  }

  bubbleDown(index) {
    const length = this.heap.length;
    while (true) {
      const leftChild = 2 * index + 1;
      const rightChild = 2 * index + 2;
      let smallest = index;

      if (leftChild < length &&
          this.heap[leftChild].priority < this.heap[smallest].priority) {
        smallest = leftChild;
      }
      if (rightChild < length &&
          this.heap[rightChild].priority < this.heap[smallest].priority) {
        smallest = rightChild;
      }

      if (smallest === index) break;

      [this.heap[index], this.heap[smallest]] =
        [this.heap[smallest], this.heap[index]];
      index = smallest;
    }
  }

  isEmpty() {
    return this.heap.length === 0;
  }

  size() {
    return this.heap.length;
  }
}
```

## 实际应用场景

### 1. 任务调度系统

```javascript
class TaskScheduler {
  constructor() {
    this.queue = new PriorityQueue();
  }

  addTask(task, priority, delay = 0) {
    const executeAt = Date.now() + delay;
    this.queue.enqueue({ task, executeAt }, priority);
  }

  async run() {
    while (!this.queue.isEmpty()) {
      const { task, executeAt } = this.queue.dequeue();
      const waitTime = executeAt - Date.now();
      if (waitTime > 0) {
        await new Promise(resolve => setTimeout(resolve, waitTime));
      }
      await task();
    }
  }
}

// 使用示例
const scheduler = new TaskScheduler();
scheduler.addTask(() => console.log('低优先级任务'), 3, 1000);
scheduler.addTask(() => console.log('高优先级任务'), 1, 500);
scheduler.addTask(() => console.log('中优先级任务'), 2, 750);
scheduler.run();
```

### 2. 打印队列模拟

```javascript
class PrintQueue {
  constructor() {
    this.queue = new Queue();
    this.printing = false;
  }

  addJob(document, pages) {
    this.queue.enqueue({ document, pages, timestamp: Date.now() });
    console.log(`Added print job: ${document} (${pages} pages)`);
    if (!this.printing) {
      this.processQueue();
    }
  }

  async processQueue() {
    this.printing = true;
    while (!this.queue.isEmpty()) {
      const job = this.queue.dequeue();
      console.log(`Printing: ${job.document}...`);
      // 模拟打印时间
      await new Promise(r => setTimeout(r, job.pages * 100));
      console.log(`Completed: ${job.document}`);
    }
    this.printing = false;
  }
}
```

### 3. 广度优先搜索（BFS）

```javascript
function bfs(graph, start, target) {
  const queue = new Queue();
  const visited = new Set();

  queue.enqueue({ node: start, path: [start] });
  visited.add(start);

  while (!queue.isEmpty()) {
    const { node, path } = queue.dequeue();

    if (node === target) {
      return path;
    }

    for (const neighbor of graph[node] || []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.enqueue({ node: neighbor, path: [...path, neighbor] });
      }
    }
  }

  return null;
}

// 图示例
const graph = {
  A: ['B', 'C'],
  B: ['A', 'D', 'E'],
  C: ['A', 'F'],
  D: ['B'],
  E: ['B', 'F'],
  F: ['C', 'E']
};

console.log(bfs(graph, 'A', 'F')); // ['A', 'C', 'F'] 或 ['A', 'B', 'E', 'F']
```

### 4. 请求限流

```javascript
class RateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.queue = new Queue();
  }

  async request(fn) {
    // 移除过期的请求
    const now = Date.now();
    while (!this.queue.isEmpty() && now - this.queue.front() > this.windowMs) {
      this.queue.dequeue();
    }

    if (this.queue.size() >= this.maxRequests) {
      throw new Error('Rate limit exceeded');
    }

    this.queue.enqueue(now);
    return fn();
  }
}

// 使用示例：每分钟最多 60 次请求
const limiter = new RateLimiter(60, 60000);
limiter.request(() => fetch('/api/data'));
```

## 性能对比

| 实现方式 | enqueue | dequeue | 内存使用 | 适用场景 |
|----------|---------|---------|----------|----------|
| 数组 (shift) | O(1) | O(n) | 低 | 小型队列 |
| 双指针 | O(1) | O(1) | 中 | 通用场景 |
| 循环队列 | O(1) | O(1) | 固定 | 固定容量 |
| 基于堆的优先队列 | O(log n) | O(log n) | 中 | 优先级任务 |

## 总结

队列是构建复杂系统的基础组件。理解不同实现方式的优缺点，可以帮助你根据具体场景选择最合适的数据结构。

### 关键要点

1. **避免使用 `Array.shift()`** - 性能较差，改用双指针或对象实现
2. **循环队列** - 适合固定容量、高性能要求的场景
3. **优先队列** - 任务调度、Dijkstra 算法等场景必备
4. **双端队列** - 需要两端操作时的理想选择

在下一篇文章中，我们将探讨链表数据结构及其高级应用。