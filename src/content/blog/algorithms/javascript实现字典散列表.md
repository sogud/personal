---
title: "JavaScript 字典与散列表：HashMap 完整实现指南"
description: "深入讲解散列表（Hash Table）的原理、哈希函数设计、冲突处理方法，以及字典数据结构的实现和应用"
pubDate: "2018-01-13T16:07:32"
tags: ["JavaScript", "数据结构", "算法", "Hash", "散列表"]
---

# JavaScript 字典与散列表

字典（Dictionary）和散列表（Hash Table）是计算机科学中最重要的数据结构之一。它们提供 O(1) 平均时间复杂度的键值查找，是现代编程语言和数据库系统的基石。

## 字典 (Dictionary) - 键值对存储

字典也称为映射（Map），存储的是 **[键，值]** 对，其中键名用于查询特定元素。

### 字典的实现

```javascript
class Dictionary {
  constructor() {
    this.items = {};
  }

  // 检查键是否存在
  has(key) {
    return key in this.items;
  }

  // 设置键值对
  set(key, value) {
    this.items[key] = value;
  }

  // 获取值
  get(key) {
    return this.has(key) ? this.items[key] : undefined;
  }

  // 删除键值对
  remove(key) {
    if (this.has(key)) {
      delete this.items[key];
      return true;
    }
    return false;
  }

  // 获取所有值
  values() {
    return Object.values(this.items);
  }

  // 获取所有键
  keys() {
    return Object.keys(this.items);
  }

  // 获取所有键值对
  items() {
    return this.items;
  }

  // 获取大小
  size() {
    return this.keys().length;
  }

  // 清空字典
  clear() {
    this.items = {};
  }

  // 检查是否为空
  isEmpty() {
    return this.size() === 0;
  }

  // 遍历
  forEach(callback) {
    for (const key of this.keys()) {
      callback(key, this.items[key], this.items);
    }
  }
}

// 使用示例
const dict = new Dictionary();
dict.set('name', '张三');
dict.set('age', 25);
dict.set('email', 'zhangsan@example.com');

console.log(dict.get('name')); // 张三
console.log(dict.has('age')); // true
console.log(dict.keys()); // ['name', 'age', 'email']
dict.remove('age');
console.log(dict.size()); // 2
```

## 散列表 (Hash Table) - 高效查找

散列表通过**哈希函数**将键转换为数组索引，实现快速的键值查找。

### 哈希函数的重要性

哈希函数的核心要求：
1. **一致性**：相同的键始终产生相同的哈希值
2. **均匀性**：哈希值应均匀分布
3. **高效性**：计算速度快

```javascript
// 简单的哈希函数 - djb2
function hashCode(str) {
  let hash = 5381;
  for (let i = 0; i < str.length; i++) {
    hash = hash * 33 + str.charCodeAt(i);
  }
  return hash >>> 0; // 转换为无符号整数
}

// 测试哈希分布
function testHashDistribution(size = 100) {
  const counts = new Array(size).fill(0);
  const testStrings = [];

  // 生成测试字符串
  for (let i = 0; i < 1000; i++) {
    testStrings.push(`key${i}`);
  }

  // 统计分布
  for (const str of testStrings) {
    const index = hashCode(str) % size;
    counts[index]++;
  }

  // 计算统计信息
  const max = Math.max(...counts);
  const min = Math.min(...counts.filter(c => c > 0));
  const avg = 1000 / size;

  console.log(`哈希表大小: ${size}`);
  console.log(`最大冲突数: ${max}`);
  console.log(`最小冲突数: ${min}`);
  console.log(`平均期望: ${avg.toFixed(2)}`);

  return counts;
}

testHashDistribution(100);
```

### 基础散列表实现

```javascript
class HashTable {
  constructor(size = 100) {
    this.size = size;
    this.table = new Array(size);
  }

  // 哈希函数
  hash(key) {
    let hash = 5381;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 33 + key.charCodeAt(i)) >>> 0;
    }
    return hash % this.size;
  }

  // 设置键值对
  put(key, value) {
    const index = this.hash(key);
    this.table[index] = value;
  }

  // 获取值
  get(key) {
    const index = this.hash(key);
    return this.table[index];
  }

  // 删除
  remove(key) {
    const index = this.hash(key);
    const removed = this.table[index];
    this.table[index] = undefined;
    return removed;
  }
}
```

### 问题：哈希冲突

当不同的键映射到相同的索引时，就会发生哈希冲突。常见解决方法：

1. **开放地址法**：探测其他空位置
2. **链地址法**：在冲突位置存储链表
3. **再哈希法**：使用第二个哈希函数

#### 链地址法实现

```javascript
class HashMap {
  constructor(size = 100) {
    this.size = size;
    this.buckets = new Array(size);

    // 初始化所有桶
    for (let i = 0; i < size; i++) {
      this.buckets[i] = [];
    }
  }

  hash(key) {
    let hash = 5381;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 33 + key.charCodeAt(i)) >>> 0;
    }
    return hash % this.size;
  }

  // 设置键值对
  set(key, value) {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    // 检查键是否已存在
    for (const [k, v] of bucket) {
      if (k === key) {
        v.value = value;
        return this;
      }
    }

    // 添加新键值对
    bucket.push({ key, value: { value } });
    return this;
  }

  // 获取值
  get(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    for (const item of bucket) {
      if (item.key === key) {
        return item.value.value;
      }
    }

    return undefined;
  }

  // 删除
  delete(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    for (let i = 0; i < bucket.length; i++) {
      if (bucket[i].key === key) {
        bucket.splice(i, 1);
        return true;
      }
    }

    return false;
  }

  // 检查键是否存在
  has(key) {
    const index = this.hash(key);
    const bucket = this.buckets[index];

    return bucket.some(item => item.key === key);
  }

  // 获取所有键
  keys() {
    const keys = [];
    for (const bucket of this.buckets) {
      for (const item of bucket) {
        keys.push(item.key);
      }
    }
    return keys;
  }

  // 获取所有值
  values() {
    const values = [];
    for (const bucket of this.buckets) {
      for (const item of bucket) {
        values.push(item.value.value);
      }
    }
    return values;
  }

  // 获取大小
  get size() {
    let count = 0;
    for (const bucket of this.buckets) {
      count += bucket.length;
    }
    return count;
  }

  // 打印调试信息
  print() {
    console.log('HashMap Contents:');
    for (let i = 0; i < this.buckets.length; i++) {
      if (this.buckets[i].length > 0) {
        console.log(`Bucket ${i}:`, this.buckets[i]);
      }
    }
  }
}

// 使用示例
const map = new HashMap(10);
map.set('name', '张三');
map.set('age', 25);
map.set('city', '北京');
map.set('country', '中国');

console.log(map.get('name')); // 张三
console.log(map.has('age')); // true
console.log(map.keys()); // ['name', 'age', 'city', 'country']
console.log(map.size); // 4
```

### 开放地址法实现

```javascript
class OpenAddressingHashMap {
  constructor(size = 100) {
    this.size = size;
    this.keys = new Array(size);
    this.values = new Array(size);
    this.count = 0;
  }

  hash(key) {
    let hash = 5381;
    for (let i = 0; i < key.length; i++) {
      hash = (hash * 33 + key.charCodeAt(i)) >>> 0;
    }
    return hash % this.size;
  }

  // 线性探测
  probe(index, key, keys) {
    let i = index;
    while (keys[i] !== undefined && keys[i] !== key) {
      i = (i + 1) % this.size;
      if (i === index) break; // 环回到起点
    }
    return i;
  }

  set(key, value) {
    if (this.count >= this.size * 0.75) {
      this.resize(this.size * 2);
    }

    const index = this.probe(this.hash(key), key, this.keys);
    const isNew = this.keys[index] === undefined;
    this.keys[index] = key;
    this.values[index] = value;

    if (isNew) this.count++;
    return this;
  }

  get(key) {
    const index = this.probe(this.hash(key), key, this.keys);
    return this.keys[index] === key ? this.values[index] : undefined;
  }

  delete(key) {
    const index = this.probe(this.hash(key), key, this.keys);

    if (this.keys[index] === key) {
      // 标记为已删除（不能设为 undefined，否则会破坏探测链）
      this.keys[index] = null;
      this.values[index] = null;
      this.count--;
      return true;
    }

    return false;
  }

  resize(newSize) {
    const oldKeys = this.keys;
    const oldValues = this.values;
    this.size = newSize;
    this.keys = new Array(newSize);
    this.values = new Array(newSize);
    this.count = 0;

    // 重新插入
    for (let i = 0; i < oldKeys.length; i++) {
      if (oldKeys[i] !== null && oldKeys[i] !== undefined) {
        this.set(oldKeys[i], oldValues[i]);
      }
    }
  }
}
```

## 实际应用场景

### 1. 缓存系统

```javascript
class Cache {
  constructor(maxSize = 100) {
    this.maxSize = maxSize;
    this.cache = new HashMap();
    this.accessOrder = new DoublyLinkedList();
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      // 删除最少使用的项
      const oldest = this.accessOrder.shift();
      if (oldest) {
        this.cache.delete(oldest);
      }
    }

    this.cache.set(key, {
      value,
      accessNode: this.accessOrder.append({ key, value })
    });

    return this;
  }

  get(key) {
    const item = this.cache.get(key);
    if (!item) return undefined;

    // 更新访问顺序
    this.accessOrder.removeNode(item.accessNode);
    item.accessNode = this.accessOrder.append({ key, value: item.value });

    return item.value;
  }
}
```

### 2. 单词频率统计

```javascript
function wordFrequency(text) {
  const freq = new HashMap();
  const words = text.toLowerCase().match(/\w+/g) || [];

  for (const word of words) {
    const count = freq.get(word) || 0;
    freq.set(word, count + 1);
  }

  return freq;
}

// 使用示例
const text = 'The quick brown fox jumps over the lazy dog the fox';
const freq = wordFrequency(text);
console.log(freq.get('the')); // 2
console.log(freq.get('fox')); // 2
```

### 3. 字母异位词检测

```javascript
function isAnagram(s1, s2) {
  if (s1.length !== s2.length) return false;

  const freq = new HashMap();

  // 统计第一个字符串的字符频率
  for (const char of s1) {
    const count = freq.get(char) || 0;
    freq.set(char, count + 1);
  }

  // 减去第二个字符串的字符频率
  for (const char of s2) {
    const count = freq.get(char);
    if (!count || count === 0) return false;
    freq.set(char, count - 1);
  }

  return true;
}

console.log(isAnagram('listen', 'silent')); // true
console.log(isAnagram('hello', 'world')); // false
```

### 4. LRU Cache 实现

```javascript
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new HashMap();
    this.order = [];
  }

  get(key) {
    const value = this.cache.get(key);
    if (value === undefined) return -1;

    // 移动到末尾（最近使用）
    const index = this.order.indexOf(key);
    this.order.splice(index, 1);
    this.order.push(key);

    return value;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      // 更新已有项
      const index = this.order.indexOf(key);
      this.order.splice(index, 1);
    } else if (this.cache.size >= this.capacity) {
      // 删除最旧的项
      const oldest = this.order.shift();
      this.cache.delete(oldest);
    }

    this.cache.set(key, value);
    this.order.push(key);
  }
}

// 使用示例
const lru = new LRUCache(3);
lru.put('a', 1);
lru.put('b', 2);
lru.put('c', 3);
console.log(lru.get('a')); // 1
lru.put('d', 4); // 移除 'b'
console.log(lru.get('b')); // -1
```

## 性能分析

| 操作 | 平均时间复杂度 | 最坏情况 |
|------|----------------|----------|
| 插入 | O(1) | O(n) |
| 删除 | O(1) | O(n) |
| 查找 | O(1) | O(n) |

关键影响因素：
1. **哈希函数质量**：决定冲突概率
2. **负载因子**：元素数量/桶数量，建议 < 0.75
3. **冲突解决方法**：链地址法更稳定

## 总结

散列表是计算机科学中最重要的数据结构之一，提供了接近 O(1) 的查找性能。

### 关键要点

1. **哈希函数**：选择均匀分布的哈希函数至关重要
2. **冲突处理**：链地址法和开放地址法各有优劣
3. **负载因子**：保持在 0.75 以下可保证性能
4. **应用广泛**：缓存、字典、频率统计等场景

现代 JavaScript 的 `Map` 对象已经是基于散列表实现的，可以直接使用。