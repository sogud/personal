---
title: "JavaScript 集合(Set)完全指南：数学运算与实际应用"
description: "深入讲解集合数据结构的原理，实现并集、交集、差集、子集等运算，以及在去重、查找、去重等场景的实际应用"
pubDate: "2018-01-13T16:07:32"
tags: ["JavaScript", "数据结构", "算法", "集合"]
---

# JavaScript 集合(Set)完全指南

集合是数学中最基本的概念之一，在计算机科学中也有广泛应用。集合是一种**无序且不重复**的数据结构，类似于一个没有顺序概念的数组。

## 集合的基本概念

在数学中，集合是一组不同的对象的集。比如自然数集合 N = {0, 1, 2, 3, 4, 5, 6, ...}。集合中的关键特性：

1. **唯一性**：集合中的元素不会重复
2. **无序性**：集合中的元素没有顺序概念
3. **确定性**：元素要么属于集合，要么不属于

### 集合的基本操作

| 操作 | 描述 | 数学符号 |
|------|------|----------|
| 并集 | 包含两个集合所有元素的集合 | A ∪ B |
| 交集 | 同时属于两个集合的元素 | A ∩ B |
| 差集 | 属于A但不属于B的元素 | A - B |
| 子集 | A的所有元素都在B中 | A ⊆ B |

## 手动实现集合类

```javascript
class Set {
  constructor() {
    this.items = {};
  }

  // 检查元素是否存在
  has(value) {
    return this.items.hasOwnProperty(value);
  }

  // 添加元素
  add(value) {
    if (!this.has(value)) {
      this.items[value] = value;
      return true;
    }
    return false;
  }

  // 移除元素
  remove(value) {
    if (this.has(value)) {
      delete this.items[value];
      return true;
    }
    return false;
  }

  // 清空集合
  clear() {
    this.items = {};
  }

  // 获取集合大小
  size() {
    return Object.keys(this.items).length;
  }

  // 获取所有元素值
  values() {
    return Object.keys(this.items);
  }

  // 并集：包含两个集合的所有元素
  union(otherSet) {
    const unionSet = new Set();

    // 添加当前集合的所有元素
    this.values().forEach(value => unionSet.add(value));

    // 添加另一个集合的所有元素
    otherSet.values().forEach(value => unionSet.add(value));

    return unionSet;
  }

  // 交集：同时属于两个集合的元素
  intersection(otherSet) {
    const intersectionSet = new Set();
    const values = this.values();

    for (const value of values) {
      if (otherSet.has(value)) {
        intersectionSet.add(value);
      }
    }

    return intersectionSet;
  }

  // 差集：属于当前集合但不属于otherSet的元素
  difference(otherSet) {
    const differenceSet = new Set();

    for (const value of this.values()) {
      if (!otherSet.has(value)) {
        differenceSet.add(value);
      }
    }

    return differenceSet;
  }

  // 子集：当前集合是否完全包含otherSet
  isSubsetOf(otherSet) {
    if (this.size() > otherSet.size()) {
      return false;
    }

    for (const value of this.values()) {
      if (!otherSet.has(value)) {
        return false;
      }
    }

    return true;
  }
}

// 使用示例
const setA = new Set();
setA.add(1);
setA.add(2);
setA.add(3);

const setB = new Set();
setB.add(2);
setB.add(3);
setB.add(4);

console.log(setA.union(setB).values()); // ['1', '2', '3', '4']
console.log(setA.intersection(setB).values()); // ['2', '3']
console.log(setA.difference(setB).values()); // ['1']
console.log(setA.isSubsetOf(setB)); // false
```

## ES6 Set 详解

现代 JavaScript 原生提供了 Set 类，具有更丰富的 API：

```javascript
// 创建 Set
const set = new Set();

// 添加元素
set.add(1);
set.add(2);
set.add(3);

// 添加重复元素会被忽略
set.add(1); // 不起作用

// 检查元素
console.log(set.has(1)); // true
console.log(set.has(4)); // false

// 删除元素
set.delete(2);

// 获取大小
console.log(set.size); // 2

// 清空
set.clear();

// 遍历
set.forEach(value => console.log(value));

// 使用 for...of
for (const value of set) {
  console.log(value);
}

// 数组去重
const arr = [1, 2, 2, 3, 3, 3, 4];
const uniqueArr = [...new Set(arr)];
console.log(uniqueArr); // [1, 2, 3, 4]
```

### ES6 Set 的独特方法

```javascript
// keys() - 返回迭代器（与 values() 相同）
const set = new Set([1, 2, 3]);
console.log([...set.keys()]); // [1, 2, 3]

// values() - 返回迭代器
console.log([...set.values()]); // [1, 2, 3]

// entries() - 返回键值对迭代器
console.log([...set.entries()]); // [[1,1], [2,2], [3,3]]

// forEach() - 遍历
set.forEach((value, valueAgain, set) => {
  console.log(value);
});
```

## 集合的实际应用

### 1. 数组去重

```javascript
// 方法1：使用 ES6 Set
function unique(arr) {
  return [...new Set(arr)];
}

// 方法2：手动实现（兼容旧浏览器）
function uniqueClassic(arr) {
  const set = new Set();
  arr.forEach(item => set.add(item));
  return set.values();
}

// 方法3：使用 filter（时间复杂度较高）
function uniqueFilter(arr) {
  return arr.filter((item, index) => arr.indexOf(item) === index);
}

// 性能对比
const testArr = Array.from({ length: 10000 }, (_, i) => i % 1000);

console.time('ES6 Set');
unique(testArr);
console.timeEnd('ES6 Set'); // 约 1-2ms

console.time('Classic');
uniqueClassic(testArr);
console.timeEnd('Classic'); // 约 2-3ms

console.time('Filter');
uniqueFilter(testArr);
console.timeEnd('Filter'); // 约 50-100ms
```

### 2. 字符串去重

```javascript
function uniqueString(str) {
  return [...new Set(str)].join('');
}

console.log(uniqueString('hello')); // 'helo'
```

### 3. 查找共同好友

```javascript
// 模拟社交网络的好友列表
const userAFriends = new Set(['Alice', 'Bob', 'Charlie', 'David']);
const userBFriends = new Set(['Bob', 'Charlie', 'Eve', 'Frank']);

// 共同好友（交集）
function getMutualFriends(set1, set2) {
  return set1.intersection(set2);
}

// 仅 A 的好友（差集）
function getExclusiveFriends(set1, set2) {
  return set1.difference(set2);
}

// 全部好友（并集）
function getAllFriends(set1, set2) {
  return set1.union(set2);
}

console.log([...getMutualFriends(userAFriends, userBFriends)]);
// ['Bob', 'Charlie']

console.log([...getExclusiveFriends(userAFriends, userBFriends)]);
// ['Alice', 'David']
```

### 4. 标签系统

```javascript
class TagSystem {
  constructor() {
    this.allTags = new Set();
    this.postTags = new Map(); // postId -> Set
  }

  addTag(postId, tag) {
    this.allTags.add(tag);

    if (!this.postTags.has(postId)) {
      this.postTags.set(postId, new Set());
    }
    this.postTags.get(postId).add(tag);
  }

  removeTag(postId, tag) {
    if (this.postTags.has(postId)) {
      this.postTags.get(postId).delete(tag);
    }
  }

  getPostTags(postId) {
    return this.postTags.get(postId) || new Set();
  }

  // 获取所有标签
  getAllTags() {
    return this.allTags;
  }

  // 获取热门标签（出现在最多文章中）
  getPopularTags() {
    const tagCounts = new Map();

    for (const tags of this.postTags.values()) {
      for (const tag of tags) {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      }
    }

    return [...tagCounts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);
  }

  // 查找拥有共同标签的文章
  findPostsWithSimilarTags(postId) {
    const currentTags = this.getPostTags(postId);
    const similarPosts = [];

    for (const [id, tags] of this.postTags) {
      if (id === postId) continue;

      const intersection = currentTags.intersection(tags);
      if (intersection.size > 0) {
        similarPosts.push({
          postId: id,
          commonTags: intersection,
          score: intersection.size
        });
      }
    }

    return similarPosts.sort((a, b) => b.score - a.score);
  }
}
```

### 5. 权限系统

```javascript
class PermissionSystem {
  constructor() {
    this.userPermissions = new Map(); // userId -> Set<permission>
    this.rolePermissions = new Map(); // role -> Set<permission>
    this.userRoles = new Map(); // userId -> Set<role>
  }

  // 添加角色权限
  addRolePermission(role, permission) {
    if (!this.rolePermissions.has(role)) {
      this.rolePermissions.set(role, new Set());
    }
    this.rolePermissions.get(role).add(permission);
  }

  // 为用户分配角色
  assignRole(userId, role) {
    if (!this.userRoles.has(userId)) {
      this.userRoles.set(userId, new Set());
    }
    this.userRoles.get(userId).add(role);
  }

  // 获取用户所有权限
  getUserPermissions(userId) {
    const permissions = new Set();

    // 直接权限
    if (this.userPermissions.has(userId)) {
      for (const p of this.userPermissions.get(userId)) {
        permissions.add(p);
      }
    }

    // 角色带来的权限
    if (this.userRoles.has(userId)) {
      for (const role of this.userRoles.get(userId)) {
        if (this.rolePermissions.has(role)) {
          for (const p of this.rolePermissions.get(role)) {
            permissions.add(p);
          }
        }
      }
    }

    return permissions;
  }

  // 检查用户是否有权限
  hasPermission(userId, permission) {
    return this.getUserPermissions(userId).has(permission);
  }
}

// 使用示例
const perms = new PermissionSystem();

// 定义角色权限
perms.addRolePermission('admin', 'read');
perms.addRolePermission('admin', 'write');
perms.addRolePermission('admin', 'delete');
perms.addRolePermission('user', 'read');
perms.addRolePermission('user', 'write');
perms.addRolePermission('guest', 'read');

// 分配角色
perms.assignRole('user1', 'user');
perms.assignRole('user1', 'admin'); // 用户可以有多重角色

console.log(perms.getUserPermissions('user1'));
// Set { 'read', 'write', 'delete' }
```

### 6. 颜色管理（贪吃蛇游戏）

```javascript
class SnakeGame {
  constructor() {
    this.occupiedPositions = new Set();
    this.snakeBody = []; // 存储身体段的位置
  }

  // 位置转换为字符串 key
  positionKey(x, y) {
    return `${x},${y}`;
  }

  // 检查位置是否被占用
  isOccupied(x, y) {
    return this.occupiedPositions.has(this.positionKey(x, y));
  }

  // 添加蛇身
  addBody(x, y) {
    const key = this.positionKey(x, y);
    this.occupiedPositions.add(key);
    this.snakeBody.push({ x, y });
  }

  // 移动蛇
  move(newX, newY) {
    if (this.isOccupied(newX, newY)) {
      return false; // 碰撞
    }

    // 添加新头部
    this.addBody(newX, newY);

    // 移除尾部（模拟移动）
    const tail = this.snakeBody.shift();
    this.occupiedPositions.delete(this.positionKey(tail.x, tail.y));

    return true;
  }

  // 检查食物位置是否有效
  isValidFoodPosition(foodX, foodY) {
    return !this.isOccupied(foodX, foodY);
  }
}
```

## 性能分析

### 时间复杂度

| 操作 | 时间复杂度 |
|------|------------|
| add | O(1) |
| delete | O(1) |
| has | O(1) |
| size | O(1) |
| values/keys/entries | O(n) |
| forEach | O(n) |
| union | O(m + n) |
| intersection | O(min(m, n)) |
| difference | O(m) |

### 空间复杂度

集合的空间复杂度为 O(n)，其中 n 是集合中元素的数量。

## 总结

集合是一种简单但强大的数据结构，在实际开发中有广泛的应用场景：

1. **去重**：数组去重、字符串去重
2. **查找**：判断元素是否存在
3. **集合运算**：并集、交集、差集、子集判断
4. **权限系统**：用户权限管理
5. **游戏开发**：位置检测、碰撞检测

现代 JavaScript 的 Set API 已经非常完善，大多数场景可以直接使用 ES6 Set。理解集合的数学原理有助于更好地应用这一数据结构。