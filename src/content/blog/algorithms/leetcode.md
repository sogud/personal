---
title: "LeetCode 初级算法实战指南"
description: "详细讲解 LeetCode 初级算法题目，包括数组、字符串、链表、树等核心题目的解题思路和最优解"
pubDate: "2019-03-13T16:07:32"
tags: ["JavaScript", "算法", "LeetCode", "面试"]
---

# LeetCode 初级算法实战指南

LeetCode 是程序员面试刷题的圣地，本文详细讲解初级算法中的经典题目，提供多种解题思路和最优解。

## 1. 删除排序数组中的重复项

**题目**：给定一个排序数组，原地删除重复出现的元素，返回新数组长度。

**解法一：双指针（最优解）**

```javascript
function removeDuplicates(nums) {
  if (nums.length === 0) return 0;

  let slow = 0;
  for (let fast = 1; fast < nums.length; fast++) {
    if (nums[fast] !== nums[slow]) {
      slow++;
      nums[slow] = nums[fast];
    }
  }
  return slow + 1;
}

// 示例
const nums = [1, 1, 2, 2, 3];
const len = removeDuplicates(nums);
console.log(len); // 3
console.log(nums.slice(0, len)); // [1, 2, 3]
```

**复杂度分析**：
- 时间复杂度：O(n)
- 空间复杂度：O(1)

**解法二：Set 去重（简洁但非最优）**

```javascript
function removeDuplicatesSet(nums) {
  const set = new Set(nums);
  let i = 0;
  for (const num of set) {
    nums[i++] = num;
  }
  return set.size;
}
```

---

## 2. 买卖股票的最佳时机

**题目**：给定数组 prices，第 i 个元素是第 i 天的股票价格。最多买卖一次，求最大利润。

```javascript
function maxProfit(prices) {
  let minPrice = Infinity;
  let maxProfit = 0;

  for (const price of prices) {
    minPrice = Math.min(minPrice, price);
    maxProfit = Math.max(maxProfit, price - minPrice);
  }

  return maxProfit;
}

// 测试
console.log(maxProfit([7, 1, 5, 3, 6, 4])); // 5 (第2天买入，第5天卖出)
console.log(maxProfit([7, 6, 4, 3, 1]));   // 0 (股价一直下跌)
```

---

## 3. 最大子序和

**题目**：给定整数数组 nums，找到具有最大和的连续子数组，返回其最大和。

```javascript
function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];

  for (let i = 1; i < nums.length; i++) {
    // 决定是继续当前子数组还是重新开始
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }

  return maxSum;
}

// 测试
console.log(maxSubArray([-2, 1, -3, 4, -1, 2, 1, -5, 4])); // 6
```

**核心思想**：贪心算法 - 如果当前和为负数，则重新开始

---

## 4. 旋转数组

**题目**：将数组向右旋转 k 个位置。

```javascript
// 解法1：使用额外数组
function rotate(nums, k) {
  const newNums = new Array(nums.length);
  for (let i = 0; i < nums.length; i++) {
    newNums[(i + k) % nums.length] = nums[i];
  }
  for (let i = 0; i < nums.length; i++) {
    nums[i] = newNums[i];
  }
}

// 解法2：原地旋转（翻转三次数组）
function rotateInPlace(nums, k) {
  const n = nums.length;
  k = k % n; // 处理 k > n 的情况

  // 翻转整个数组
  reverse(nums, 0, n - 1);
  // 翻转前 k 个
  reverse(nums, 0, k - 1);
  // 翻转后 n-k 个
  reverse(nums, k, n - 1);
}

function reverse(nums, start, end) {
  while (start < end) {
    [nums[start], nums[end]] = [nums[end], nums[start]];
    start++;
    end--;
  }
}

// 测试
const arr = [1, 2, 3, 4, 5, 6, 7];
rotateInPlace(arr, 3);
console.log(arr); // [5, 6, 7, 1, 2, 3, 4]
```

---

## 5. 两数之和

**题目**：给定数组 nums 和目标值 target，返回两个数的索引。

```javascript
// 解法1：暴力枚举 O(n²)
function twoSumBrute(nums, target) {
  for (let i = 0; i < nums.length; i++) {
    for (let j = i + 1; j < nums.length; j++) {
      if (nums[i] + nums[j] === target) {
        return [i, j];
      }
    }
  }
  return [];
}

// 解法2：哈希表 O(n) - 最优解
function twoSum(nums, target) {
  const map = new Map();

  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

// 测试
console.log(twoSum([2, 7, 11, 15], 9)); // [0, 1]
```

---

## 6. 有效的括号

**题目**：判断括号字符串是否有效。

```javascript
function isValid(s) {
  const stack = [];
  const map = {
    ')': '(',
    ']': '[',
    '}': '{'
  };

  for (const char of s) {
    if (char in map) {
      // 是右括号
      if (stack.pop() !== map[char]) {
        return false;
      }
    } else {
      // 是左括号，入栈
      stack.push(char);
    }
  }

  return stack.length === 0;
}

// 测试
console.log(isValid("()[]{}")); // true
console.log(isValid("(]"));    // false
console.log(isValid("([)]"));  // false
```

---

## 7. 合并两个有序链表

**题目**：合并两个升序链表。

```javascript
// 解法1：迭代
function mergeTwoLists(l1, l2) {
  const dummy = { next: null };
  let current = dummy;

  while (l1 && l2) {
    if (l1.val <= l2.val) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }

  current.next = l1 || l2;
  return dummy.next;
}

// 解法2：递归
function mergeTwoListsRecursive(l1, l2) {
  if (!l1) return l2;
  if (!l2) return l1;

  if (l1.val <= l2.val) {
    l1.next = mergeTwoListsRecursive(l1.next, l2);
    return l1;
  } else {
    l2.next = mergeTwoListsRecursive(l1, l2.next);
    return l2;
  }
}
```

---

## 8. 反转链表

```javascript
function reverseList(head) {
  let prev = null;
  let current = head;

  while (current) {
    const next = current.next;
    current.next = prev;
    prev = current;
    current = next;
  }

  return prev;
}

// 递归版本
function reverseListRecursive(head, prev = null) {
  if (!head) return prev;
  const next = head.next;
  head.next = prev;
  return reverseListRecursive(next, head);
}
```

---

## 9. 爬楼梯

**题目**：爬 n 层楼梯，每次可以爬 1 或 2 层，求有多少种方法。

```javascript
// 解法1：动态规划
function climbStairs(n) {
  if (n <= 2) return n;

  let prev2 = 1;
  let prev1 = 2;

  for (let i = 3; i <= n; i++) {
    const current = prev1 + prev2;
    prev2 = prev1;
    prev1 = current;
  }

  return prev1;
}

// 解法2：斐波那契数列公式
function climbStairsFormula(n) {
  const sqrt5 = Math.sqrt(5);
  const fibn = Math.pow((1 + sqrt5) / 2, n + 1) - Math.pow((1 - sqrt5) / 2, n + 1);
  return Math.round(fibn / sqrt5);
}

// 测试
console.log(climbStairs(5)); // 8
```

---

## 10. 二叉树的最大深度

```javascript
// 解法1：递归（深度优先）
function maxDepth(root) {
  if (!root) return 0;
  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));
}

// 解法2：迭代（广度优先）
function maxDepthBFS(root) {
  if (!root) return 0;

  let depth = 0;
  const queue = [root];

  while (queue.length > 0) {
    depth++;
    const levelSize = queue.length;

    for (let i = 0; i < levelSize; i++) {
      const node = queue.shift();
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
  }

  return depth;
}
```

---

## 刷题技巧总结

### 1. 数组问题
- 双指针技巧：快慢指针、左右指针
- 滑动窗口：处理连续子数组问题
- 原地操作：避免使用额外空间

### 2. 链表问题
- 虚拟头节点：简化边界处理
- 快慢指针：检测环、找中点
- 递归思想：反转链表、合并有序链表

### 3. 二叉树问题
- 递归遍历：前序、中序、后序
- 层序遍历：使用队列
- 分解问题：子树的返回值

### 4. 动态规划
- 状态定义：dp[i] 表示什么
- 状态转移：如何从之前的状态推导
- 初始化：base case

### 5. 哈希表
- 空间换时间
- 用 Map 代替对象（支持任意类型 key）
- 注意边界情况