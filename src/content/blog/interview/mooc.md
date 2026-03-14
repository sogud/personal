---
title: "前端面试题汇总：Vue/React/工程化篇"
description: "精选前端面试高频考点，涵盖 Vue、React、构建工具等核心技术点"
pubDate: "2018-01-13T16:07:32"
tags: ["前端", "面试", "Vue", "React", "工程化"]
---

# 前端面试题汇总

本文汇总前端面试中最常考的 Vue、React 和工程化问题。

## Vue 面试题

### v-if vs v-show

| 特性 | v-if | v-show |
|------|------|--------|
| DOM | 不渲染 | 渲染，display:none |
| 切换开销 | 高 | 低 |
| 使用场景 | 条件很少改变 | 频繁切换 |

### v-for 中 key 的作用

1. **diff 算法优化**：快速识别节点
2. **保持状态**：避免复用错误
3. **推荐使用唯一 id**，避免使用 index

```vue
<!-- 正确：使用 id -->
<div v-for="item in items" :key="item.id">

<!-- 错误：使用 index -->
<div v-for="(item, index) in items" :key="index">
```

### Vue 组件通信方式

1. **Props / $emit**：父子组件
2. **$parent / $children**：父子组件
3. **Provide / Inject**：祖先→后代
4. **Event Bus**：兄弟组件
5. **Vuex / Pinia**：全局状态

### 组件生命周期

```
创建 → 挂载 → 更新 → 销毁
beforeCreate   created
beforeMount    mounted
beforeUpdate   updated
beforeDestroy  destroyed
```

## React 面试题

### JSX 本质

```javascript
// JSX
return <div>Hello</div>

// 编译为
return React.createElement('div', null, 'Hello')
```

### setState 同步/异步

- **通常异步**：正常情况下是异步的，会合并多次更新
- **同步场景**：在 setTimeout、DOM 事件中同步执行

```javascript
// 异步（批量更新）
this.setState({ count: 1 });
this.setState({ count: 2 });
// 最终只触发一次更新

// 同步
setTimeout(() => {
  this.setState({ count: 1 });
  this.setState({ count: 2 });
}, 0);
```

### shouldComponentUpdate

用于性能优化，控制组件是否需要重新渲染。

```javascript
shouldComponentUpdate(nextProps, nextState) {
  return nextProps.id !== this.props.id;
}
```

## 工程化面试题

### 模块 vs Chunk vs Bundle

- **module**：源代码文件（ESM、CommonJS）
- **chunk**：webpack 处理的模块组
- **bundle**：最终输出的文件

### Loader vs Plugin

| | Loader | Plugin |
|---|---|---|
| 作用 | 转换特定文件 | 打包过程扩展 |
| 执行时机 | 转换单个文件 | 打包各阶段 |
| 例子 | babel-loader | HtmlWebpackPlugin |

### Webpack 懒加载

```javascript
// 方式1：动态 import
const Component = () => import('./Component');

// 方式2：require.ensure
require.ensure([], () => {
  const Component = require('./Component');
});
```

### 性能优化

1. **代码分割**：按需加载
2. **Tree Shaking**：移除未使用代码
3. **缓存**：contenthash 命名
4. **CDN**：静态资源分离

### Babel-polyfill vs Runtime

- **polyfill**：全局 Polyfill，会污染全局
- **runtime**：按需引入，不污染全局

## 总结

前端面试核心：
- **Vue/React**：组件化、响应式、生命周期
- **工程化**：模块系统、打包工具、性能优化
- **手写能力**：防抖、节流、Promise、AJAX