---
title: "JavaScript 排序算法完全指南：从入门到高级"
description: "深入讲解各种排序算法的原理、时间复杂度分析、JavaScript 实现以及实际应用场景，包含冒泡、选择、插入、归并、快速、堆排序等"
pubDate: "2018-01-13T16:07:32"
tags: ["JavaScript", "算法", "排序", "数据结构"]
---

# JavaScript 排序算法完全指南

排序算法是计算机科学中最基础也是最重要的课题之一。理解不同排序算法的原理、时间复杂度和适用场景，是成为合格程序员的必经之路。

## 算法复杂度一览

| 算法 | 平均时间 | 最坏时间 | 空间 | 稳定性 |
|------|----------|----------|------|--------|
| 冒泡排序 | O(n²) | O(n²) | O(1) | 稳定 |
| 选择排序 | O(n²) | O(n²) | O(1) | 不稳定 |
| 插入排序 | O(n²) | O(n²) | O(1) | 稳定 |
| 归并排序 | O(n log n) | O(n log n) | O(n) | 稳定 |
| 快速排序 | O(n log n) | O(n²) | O(log n) | 不稳定 |
| 堆排序 | O(n log n) | O(n log n) | O(1) | 不稳定 |

---

## 1. 冒泡排序 (Bubble Sort)

冒泡排序是最简单的排序算法，通过重复走访数组比较相邻元素并交换位置，逐步将最大值"冒泡"到顶部。

### 算法步骤

1. 比较相邻的元素，如果第一个比第二个大，就交换它们
2. 对每一对相邻元素做同样的工作，从开始第一对到结尾最后一对
3. 针对所有元素重复以上步骤，除了最后一个
4. 重复步骤 1~3，直到排序完成

### JavaScript 实现

```javascript
function bubbleSort(arr) {
  const n = arr.length;
  let swapped;

  for (let i = 0; i < n - 1; i++) {
    swapped = false;

    // 优化：每次冒泡后，末尾 i 个元素已排好序
    for (let j = 0; j < n - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        swapped = true;
      }
    }

    // 如果没有交换，说明数组已经有序
    if (!swapped) break;
  }

  return arr;
}

// 测试
const arr = [64, 34, 25, 12, 22, 11, 90];
console.log(bubbleSort([...arr])); // [11, 12, 22, 25, 34, 64, 90]
```

### 优化版本

```javascript
// 鸡尾酒排序（双向冒泡）
function cocktailSort(arr) {
  let left = 0;
  let right = arr.length - 1;

  while (left < right) {
    // 从左向右冒泡
    for (let i = left; i < right; i++) {
      if (arr[i] > arr[i + 1]) {
        [arr[i], arr[i + 1]] = [arr[i + 1], arr[i]];
      }
    }
    right--;

    // 从右向左冒泡
    for (let i = right; i > left; i--) {
      if (arr[i] < arr[i - 1]) {
        [arr[i], arr[i - 1]] = [arr[i - 1], arr[i]];
      }
    }
    left++;
  }

  return arr;
}
```

---

## 2. 选择排序 (Selection Sort)

选择排序的工作原理：首先在未排序序列中找到最小元素，放到排序序列的起始位置，然后从剩余未排序元素中继续寻找最小元素。

### JavaScript 实现

```javascript
function selectionSort(arr) {
  const n = arr.length;

  for (let i = 0; i < n - 1; i++) {
    let minIndex = i;

    // 找到未排序部分的最小元素
    for (let j = i + 1; j < n; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }

    // 交换到已排序部分末尾
    if (minIndex !== i) {
      [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
    }
  }

  return arr;
}

// 测试
console.log(selectionSort([64, 25, 12, 22, 11])); // [11, 12, 22, 25, 64]
```

### 特点

- **时间复杂度**：始终 O(n²)，无论数组是否有序
- **空间复杂度**：O(1)，原地排序
- **稳定性**：不稳定（相等的元素可能被交换顺序）

---

## 3. 插入排序 (Insertion Sort)

插入排序通过构建有序序列，对未排序数据在已排序序列中从后向前扫描，找到正确位置插入。

### JavaScript 实现

```javascript
function insertionSort(arr) {
  const n = arr.length;

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    // 将比 key 大的元素向后移动
    while (j >= 0 && arr[j] > key) {
      arr[j + 1] = arr[j];
      j--;
    }

    arr[j + 1] = key;
  }

  return arr;
}

// 二分查找优化版本
function binaryInsertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    const key = arr[i];
    const insertPos = binarySearch(arr, key, 0, i - 1);

    // 移动元素
    for (let j = i; j > insertPos; j--) {
      arr[j] = arr[j - 1];
    }

    arr[insertPos] = key;
  }

  return arr;
}

function binarySearch(arr, key, left, right) {
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (arr[mid] < key) {
      left = mid + 1;
    } else {
      right = mid - 1;
    }
  }
  return left;
}
```

### 适用场景

- **小规模数据**：n < 50 时效率高
- **基本有序的数据**：接近 O(n)
- **在线排序**：可以边输入边排序

---

## 4. 归并排序 (Merge Sort)

归并排序采用分治策略，将数组递归分成最小的子数组排序，然后合并。

### JavaScript 实现

```javascript
function mergeSort(arr) {
  if (arr.length <= 1) return arr;

  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));

  return merge(left, right);
}

function merge(left, right) {
  const result = [];
  let i = 0, j = 0;

  while (i < left.length && j < right.length) {
    if (left[i] <= right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }

  return result.concat(left.slice(i)).concat(right.slice(j));
}

// 原地归并排序（空间优化）
function mergeInPlace(arr, left, mid, right) {
  let i = left;
  let j = mid + 1;

  while (i <= mid && j <= right) {
    if (arr[i] <= arr[j]) {
      i++;
    } else {
      // 插入 arr[j] 到正确位置
      const temp = arr[j];
      // 移动元素
      for (let k = j; k > i; k--) {
        arr[k] = arr[k - 1];
      }
      arr[i] = temp;
      i++;
      j++;
      mid++;
    }
  }
}

function mergeSortInPlace(arr, left = 0, right = arr.length - 1) {
  if (left >= right) return;

  const mid = Math.floor((left + right) / 2);
  mergeSortInPlace(arr, left, mid);
  mergeSortInPlace(arr, mid + 1, right);
  mergeInPlace(arr, left, mid, right);
}
```

### 特点

- **时间复杂度**：始终 O(n log n)
- **空间复杂度**：O(n) 或 O(log n)（原地版本）
- **稳定性**：稳定排序
- **适用场景**：外部排序、大数据排序

---

## 5. 快速排序 (Quick Sort)

快速排序是最常用的排序算法之一，采用分治策略选择一个基准元素，将数组分成小于基准和大于基准的两部分。

### JavaScript 实现

```javascript
// 基础版本
function quickSort(arr) {
  if (arr.length <= 1) return arr;

  const pivotIndex = Math.floor(arr.length / 2);
  const pivot = arr.splice(pivotIndex, 1)[0];

  const left = [];
  const right = [];

  for (let i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }

  return quickSort(left).concat([pivot], quickSort(right));
}

// 原地分区版本（更优的空间效率）
function quickSortInPlace(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSortInPlace(arr, low, pi - 1);
    quickSortInPlace(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;

  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
  return i + 1;
}

// 三数取中优化版本
function quickSortMedian(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    // 三数取中选取基准
    const mid = Math.floor((low + high) / 2);
    if (arr[mid] > arr[high]) [arr[mid], arr[high]] = [arr[high], arr[mid]];
    if (arr[low] > arr[high]) [arr[low], arr[high]] = [arr[high], arr[low]];
    if (arr[mid] > arr[low]) [arr[mid], arr[low]] = [arr[low], arr[mid]];

    // 将基准放到倒数第二位
    [arr[low + 1], arr[high]] = [arr[high], arr[low + 1]];
    const pivot = arr[low + 1];

    let i = low + 1;
    let j = high - 1;

    while (i <= j) {
      while (i <= j && arr[i] <= pivot) i++;
      while (i <= j && arr[j] >= pivot) j--;

      if (i < j) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        i++;
        j--;
      }
    }

    [arr[i], arr[high]] = [arr[high], arr[i]];
    quickSortMedian(arr, low, i - 1);
    quickSortMedian(arr, i + 1, high);
  }
}
```

### 性能优化技巧

1. **小数组使用插入排序**：n < 10 时
2. **三数取中**：选择更好的基准
3. **尾递归优化**：减少递归深度
4. **随机化**：打乱数组顺序

---

## 6. 堆排序 (Heap Sort)

堆排序利用完全二叉树的性质，通过构建堆和调整堆来实现排序。

### JavaScript 实现

```javascript
function heapSort(arr) {
  const n = arr.length;

  // 构建最大堆
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(arr, n, i);
  }

  // 提取元素
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }

  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}

// 使用示例
console.log(heapSort([12, 11, 13, 5, 6, 7])); // [5, 6, 7, 11, 12, 13]
```

### 特点

- **时间复杂度**：始终 O(n log n)
- **空间复杂度**：O(1)
- **不稳定**：相等的元素可能改变顺序

---

## 7. 计数排序 (Counting Sort)

适用于整数范围较小的排序算法。

```javascript
function countingSort(arr) {
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const range = max - min + 1;

  // 初始化计数数组
  const count = new Array(range).fill(0);

  // 计数
  for (const num of arr) {
    count[num - min]++;
  }

  // 还原排序结果
  let index = 0;
  for (let i = 0; i < range; i++) {
    while (count[i] > 0) {
      arr[index++] = i + min;
      count[i]--;
    }
  }

  return arr;
}
```

---

## 性能对比测试

```javascript
function benchmark(sortFn, size = 10000) {
  const arr = Array.from({ length: size }, () => Math.floor(Math.random() * 10000));

  const start = performance.now();
  sortFn([...arr]);
  return performance.now() - start;
}

// 测试不同排序算法
const sizes = [1000, 5000, 10000, 50000];
const algorithms = {
  '冒泡排序': bubbleSort,
  '选择排序': selectionSort,
  '插入排序': insertionSort,
  '归并排序': mergeSort,
  '快速排序': quickSort,
  '堆排序': heapSort
};

for (const size of sizes) {
  console.log(`\n数据规模: ${size}`);
  for (const [name, fn] of Object.entries(algorithms)) {
    const time = benchmark(fn, size);
    console.log(`${name}: ${time.toFixed(2)}ms`);
  }
}
```

## 总结

### 如何选择排序算法？

| 场景 | 推荐算法 |
|------|----------|
| 小数据量 (n < 50) | 插入排序 |
| 基本有序 | 插入排序 |
| 大数据量 | 快速排序、归并排序 |
| 稳定排序 | 归并排序、插入排序 |
| 内存受限 | 堆排序、快速排序 |
| 整数范围小 | 计数排序 |
| 通用场景 | 快速排序 |

在实际开发中，JavaScript 内置的 `Array.sort()` 已经针对不同场景进行了优化，通常直接使用即可。