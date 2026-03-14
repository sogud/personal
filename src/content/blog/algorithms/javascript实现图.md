---
title: "JavaScript 图算法完全指南：实现与应用"
description: "深入讲解图的表示方法（邻接矩阵、邻接表）、深度优先搜索、广度优先搜索、Dijkstra最短路径算法及其实际应用"
pubDate: "2018-01-13T16:07:32"
tags: ["JavaScript", "数据结构", "算法", "图"]
---

# JavaScript 图算法完全指南

图是计算机科学中最重要的非线性数据结构之一，广泛应用于社交网络、路由算法、任务依赖等场景。

## 图的基本概念

- **顶点 (Vertex)**：图中的节点
- **边 (Edge)**：连接两个顶点的线
- **相邻顶点**：由一条边连接的两个顶点
- **度 (Degree)**：一个顶点相邻顶点的数量
- **路径**：顶点组成的连续序列
- **环**：起点和终点相同的路径

### 图的类型

1. **有向图 vs 无向图**：边是否有方向
2. **加权图 vs 非加权图**：边是否有权重
3. **连通图 vs 非连通图**：任意两点是否相通
4. **有环图 vs 无环图**：是否存在环

## 图的表示方法

### 1. 邻接矩阵

适合稠密图（边多的图）。

```javascript
class GraphMatrix {
  constructor() {
    this.vertices = [];
    this.matrix = {};
  }

  addVertex(vertex) {
    if (!this.vertices.includes(vertex)) {
      this.vertices.push(vertex);
      this.matrix[vertex] = {};
      // 初始化所有边的值为 0 或 Infinity
      this.vertices.forEach(v => {
        this.matrix[vertex][v] = 0;
        this.matrix[v][vertex] = this.matrix[v][vertex] || 0;
      });
    }
  }

  addEdge(v1, v2, weight = 1) {
    this.addVertex(v1);
    this.addVertex(v2);
    this.matrix[v1][v2] = weight;
    this.matrix[v2][v1] = weight; // 无向图
  }

  hasEdge(v1, v2) {
    return this.matrix[v1]?.[v2] !== undefined && this.matrix[v1][v2] !== 0;
  }

  getNeighbors(vertex) {
    const neighbors = [];
    for (const v of this.vertices) {
      if (this.matrix[vertex]?.[v]) {
        neighbors.push(v);
      }
    }
    return neighbors;
  }

  print() {
    console.log('   ', this.vertices.join('  '));
    for (const v1 of this.vertices) {
      const row = this.vertices.map(v2 => {
        const val = this.matrix[v1]?.[v2] || 0;
        return val === Infinity ? '∞' : String(val).padStart(2, ' ');
      });
      console.log(v1, row.join(' '));
    }
  }
}
```

### 2. 邻接表

适合稀疏图（边少的图）。

```javascript
class Graph {
  constructor() {
    this.adjList = new Map();
  }

  // 添加顶点
  addVertex(vertex) {
    if (!this.adjList.has(vertex)) {
      this.adjList.set(vertex, []);
    }
  }

  // 添加边 - 无向图
  addEdge(v1, v2, weight = 1) {
    this.addVertex(v1);
    this.addVertex(v2);
    this.adjList.get(v1).push({ vertex: v2, weight });
    this.adjList.get(v2).push({ vertex: v1, weight });
  }

  // 添加边 - 有向图
  addDirectedEdge(v1, v2, weight = 1) {
    this.addVertex(v1);
    this.addVertex(v2);
    this.adjList.get(v1).push({ vertex: v2, weight });
  }

  // 获取邻居
  getNeighbors(vertex) {
    return this.adjList.get(vertex) || [];
  }

  // 打印图
  toString() {
    let result = '';
    for (const [vertex, edges] of this.adjList) {
      const edgeStr = edges.map(e => `${e.vertex}(${e.weight})`).join(', ');
      result += `${vertex} -> ${edgeStr}\n`;
    }
    return result;
  }
}

// 使用示例
const graph = new Graph();
['A', 'B', 'C', 'D', 'E'].forEach(v => graph.addVertex(v));
graph.addEdge('A', 'B');
graph.addEdge('A', 'C');
graph.addEdge('B', 'D');
graph.addEdge('C', 'D');
graph.addEdge('D', 'E');
console.log(graph.toString());
```

## 图的遍历

### 1. 广度优先搜索 (BFS)

按层次逐层访问所有顶点。

```javascript
class Graph {
  // ... 之前的代码 ...

  // BFS - 返回访问顺序
  bfs(startVertex) {
    const visited = new Set();
    const result = [];
    const queue = new Queue();

    visited.add(startVertex);
    queue.enqueue(startVertex);

    while (!queue.isEmpty()) {
      const vertex = queue.dequeue();
      result.push(vertex);

      for (const edge of this.adjList.get(vertex)) {
        const neighbor = edge.vertex;
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.enqueue(neighbor);
        }
      }
    }

    return result;
  }

  // BFS - 最短路径（无权图）
  shortestPath(start, target) {
    if (start === target) return [start];

    const visited = new Set();
    const queue = new Queue();
    const parent = {};

    visited.add(start);
    queue.enqueue(start);

    while (!queue.isEmpty()) {
      const vertex = queue.dequeue();

      if (vertex === target) {
        // 还原路径
        const path = [];
        let current = target;
        while (current) {
          path.unshift(current);
          current = parent[current];
        }
        return path;
      }

      for (const edge of this.adjList.get(vertex)) {
        const neighbor = edge.vertex;
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          parent[neighbor] = vertex;
          queue.enqueue(neighbor);
        }
      }
    }

    return null; // 无路径
  }
}
```

### 2. 深度优先搜索 (DFS)

一条道走到黑，再回溯探索其他路径。

```javascript
class Graph {
  // DFS - 递归实现
  dfs(startVertex) {
    const visited = new Set();
    const result = [];

    const dfsHelper = (vertex) => {
      visited.add(vertex);
      result.push(vertex);

      for (const edge of this.adjList.get(vertex)) {
        if (!visited.has(edge.vertex)) {
          dfsHelper(edge.vertex);
        }
      }
    };

    dfsHelper(startVertex);
    return result;
  }

  // DFS - 迭代实现（使用栈）
  dfsIterative(startVertex) {
    const visited = new Set();
    const result = [];
    const stack = [startVertex];

    while (stack.length > 0) {
      const vertex = stack.pop();

      if (!visited.has(vertex)) {
        visited.add(vertex);
        result.push(vertex);

        // 逆序添加，确保按正确顺序访问
        const neighbors = this.adjList.get(vertex);
        for (let i = neighbors.length - 1; i >= 0; i--) {
          if (!visited.has(neighbors[i].vertex)) {
            stack.push(neighbors[i].vertex);
          }
        }
      }
    }

    return result;
  }

  // 拓扑排序（DFS 实现）
  topologicalSort() {
    const visited = new Set();
    const result = [];
    const stack = [];

    const dfsHelper = (vertex) => {
      visited.add(vertex);

      for (const edge of this.adjList.get(vertex)) {
        if (!visited.has(edge.vertex)) {
          dfsHelper(edge.vertex);
        }
      }

      stack.push(vertex);
    };

    for (const vertex of this.adjList.keys()) {
      if (!visited.has(vertex)) {
        dfsHelper(vertex);
      }
    }

    return stack.reverse();
  }
}
```

## 最短路径算法

### Dijkstra 算法

适用于加权无负边的图。

```javascript
class ShortestPath {
  constructor(graph) {
    this.graph = graph;
  }

  // Dijkstra 算法
  dijkstra(start, end) {
    const distances = {};
    const previous = {};
    const pq = new PriorityQueue();

    // 初始化
    for (const vertex of graph.adjList.keys()) {
      distances[vertex] = Infinity;
      previous[vertex] = null;
    }
    distances[start] = 0;

    pq.enqueue(start, 0);

    while (!pq.isEmpty()) {
      const { element: current } = pq.dequeue();

      if (current === end) {
        // 还原路径
        const path = [];
        let vertex = end;
        while (vertex) {
          path.unshift(vertex);
          vertex = previous[vertex];
        }
        return { path, distance: distances[end] };
      }

      for (const edge of graph.adjList.get(current)) {
        const newDist = distances[current] + edge.weight;

        if (newDist < distances[edge.vertex]) {
          distances[edge.vertex] = newDist;
          previous[edge.vertex] = current;
          pq.enqueue(edge.vertex, newDist);
        }
      }
    }

    return { path: null, distance: Infinity };
  }

  // Bellman-Ford 算法（可处理负权重）
  bellmanFord(start, end) {
    const distances = {};
    const previous = {};

    // 初始化
    for (const vertex of this.graph.adjList.keys()) {
      distances[vertex] = Infinity;
      previous[vertex] = null;
    }
    distances[start] = 0;

    // V-1 次迭代
    const vertices = [...this.graph.adjList.keys()];
    for (let i = 0; i < vertices.length - 1; i++) {
      for (const vertex of vertices) {
        if (distances[vertex] === Infinity) continue;

        for (const edge of this.graph.adjList.get(vertex)) {
          const newDist = distances[vertex] + edge.weight;
          if (newDist < distances[edge.vertex]) {
            distances[edge.vertex] = newDist;
            previous[edge.vertex] = vertex;
          }
        }
      }
    }

    // 检查负环
    for (const vertex of vertices) {
      for (const edge of this.graph.adjList.get(vertex)) {
        if (distances[vertex] + edge.weight < distances[edge.vertex]) {
          console.log('检测到负环');
          return null;
        }
      }
    }

    // 还原路径
    const path = [];
    let vertex = end;
    while (vertex) {
      path.unshift(vertex);
      vertex = previous[vertex];
    }

    return { path, distance: distances[end] };
  }

  // Floyd-Warshall 算法（多源最短路径）
  floydWarshall() {
    const vertices = [...this.graph.adjList.keys()];
    const dist = {};

    // 初始化距离矩阵
    for (const v1 of vertices) {
      dist[v1] = {};
      for (const v2 of vertices) {
        dist[v1][v2] = v1 === v2 ? 0 : Infinity;
      }
    }

    // 设置边的权重
    for (const v1 of vertices) {
      for (const edge of this.graph.adjList.get(v1)) {
        dist[v1][edge.vertex] = edge.weight;
      }
    }

    // 三重循环
    for (const k of vertices) {
      for (const i of vertices) {
        for (const j of vertices) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
          }
        }
      }
    }

    return dist;
  }
}
```

## 实际应用

### 1. 社交网络好友推荐

```javascript
class SocialNetwork {
  constructor() {
    this.graph = new Graph();
  }

  addUser(user) {
    this.graph.addVertex(user);
  }

  addFriend(user1, user2) {
    this.graph.addEdge(user1, user2);
  }

  // 获取直接好友
  getFriends(user) {
    return this.graph.getNeighbors(user).map(e => e.vertex);
  }

  // 获取可能认识的人（朋友的朋友）
  getSuggestions(user) {
    const friends = new Set(this.getFriends(user));
    const suggestions = new Set();

    for (const friend of friends) {
      for (const edge of this.graph.getNeighbors(friend)) {
        const friendOfFriend = edge.vertex;
        if (!friends.has(friendOfFriend) && friendOfFriend !== user) {
          suggestions.add(friendOfFriend);
        }
      }
    }

    return [...suggestions];
  }
}

// 使用示例
const network = new SocialNetwork();
['Alice', 'Bob', 'Charlie', 'David', 'Eve', 'Frank'].forEach(u => network.addUser(u));
network.addFriend('Alice', 'Bob');
network.addFriend('Alice', 'Charlie');
network.addFriend('Bob', 'David');
network.addFriend('Charlie', 'David');
network.addFriend('Charlie', 'Eve');
network.addFriend('David', 'Eve');
network.addFriend('Eve', 'Frank');

console.log(network.getSuggestions('Alice'));
// ['David', 'Eve']
```

### 2. 任务调度（拓扑排序）

```javascript
class TaskScheduler {
  constructor() {
    this.graph = new Graph();
  }

  addTask(task) {
    this.graph.addVertex(task);
  }

  addDependency(task, dependency) {
    // task 依赖于 dependency，需要先完成 dependency
    this.graph.addDirectedEdge(dependency, task);
  }

  // 检查是否有环
  hasCycle() {
    const visited = new Set();
    const recStack = new Set();

    const dfs = (vertex) => {
      visited.add(vertex);
      recStack.add(vertex);

      for (const edge of this.graph.getNeighbors(vertex)) {
        if (!visited.has(edge.vertex)) {
          if (dfs(edge.vertex)) return true;
        } else if (recStack.has(edge.vertex)) {
          return true;
        }
      }

      recStack.delete(vertex);
      return false;
    };

    for (const vertex of this.graph.adjList.keys()) {
      if (!visited.has(vertex)) {
        if (dfs(vertex)) return true;
      }
    }
    return false;
  }

  // 获取执行顺序
  getExecutionOrder() {
    if (this.hasCycle()) {
      throw new Error('存在循环依赖，无法执行');
    }
    return this.graph.topologicalSort();
  }
}
```

## 总结

图是处理复杂关系的数据结构的核心工具。

### 关键要点

1. **选择合适的表示方法**：稠密图用邻接矩阵，稀疏图用邻接表
2. **BFS**：适合最短路径（无权图）、层次遍历
3. **DFS**：适合拓扑排序、环检测、路径搜索
4. **Dijkstra**：单源最短路径（无负边）
5. **Bellman-Ford**：可处理负边

图的算法在实际应用中有广泛用途：社交网络、地图导航、任务调度、依赖管理等。