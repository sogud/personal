---
title: "手写 Mini React：深入理解 React 核心原理"
description: "从零实现一个简化的 React，包含虚拟 DOM、 Fiber 架构、 Diff 算法和 Hooks 实现"
pubDate: "2018-01-13T16:07:32"
tags: ["React", "前端", "原理", "源码"]
---

# 手写 Mini React：深入理解 React 核心原理

React 是 Facebook 推出的声明式、组件化 JavaScript 库。本文通过实现一个简化版 React（Didact），深入理解其核心原理。

> 原文: https://pomb.us/build-your-own-react/

## 1. createElement 实现

```javascript
function createElement(type, props, ...children) {
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === "object" ? child : createTextElement(child)
      )
    }
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    };
  };
}
```

## 2. DOM 创建与更新

```javascript
function createDom(fiber) {
  const dom = fiber.type === "TEXT_ELEMENT"
    ? document.createTextNode("")
    : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);
  return dom;
}

// 更新 DOM 属性（事件监听、属性、样式）
function updateDom(dom, prevProps, nextProps) {
  // 移除旧事件
  Object.keys(prevProps)
    .filter(isEvent)
    .filter(key => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.removeEventListener(eventType, prevProps[name]);
    });

  // 移除旧属性
  Object.keys(prevProps)
    .filter(isProperty)
    .filter(isGone(prevProps, nextProps))
    .forEach(name => { dom[name] = ""; });

  // 设置新属性
  Object.keys(nextProps)
    .filter(isProperty)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => { dom[name] = nextProps[name]; });

  // 添加新事件
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach(name => {
      const eventType = name.toLowerCase().substring(2);
      dom.addEventListener(eventType, nextProps[name]);
    });
}
```

## 3. Fiber 架构

Fiber 是 React 16 引入的新协调引擎，特点：
- 可中断、可恢复
- 支持优先级调度
- 支持并发

```javascript
function render(element, container) {
  wipRoot = {
    dom: container,
    props: { children: [element] },
    alternate: currentRoot
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
}

// 工作循环 - 使用 requestIdleCallback
function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}
```

## 4. 协调算法（Diff）

```javascript
function reconcileChildren(wipFiber, elements) {
  let index = 0;
  let oldFiber = wipFiber.alternate?.child;
  let prevSibling = null;

  while (index < elements.length || oldFiber != null) {
    const element = elements[index];
    let newFiber = null;

    // 类型相同 → 更新
    const sameType = oldFiber && element && element.type === oldFiber.type;

    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: element.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE"
      };
    }

    // 新元素 → 挂载
    if (element && !sameType) {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "PLACEMENT"
      };
    }

    // 旧Fiber不存在 → 删除
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETION";
      deletions.push(oldFiber);
    }

    if (oldFiber) oldFiber = oldFiber.sibling;

    if (index === 0) {
      wipFiber.child = newFiber;
    } else if (element) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}
```

## 5. useState Hook 实现

```javascript
let wipFiber = null;
let hookIndex = null;

function useState(initial) {
  const oldHook = wipFiber.alternate?.hooks?.[hookIndex];

  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  };

  // 执行队列中的状态更新
  const actions = oldHook?.queue ?? [];
  actions.forEach(action => {
    hook.state = typeof action === 'function' ? action(hook.state) : action;
  });

  const setState = action => {
    hook.queue.push(action);
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}
```

## 6. 完整示例

```javascript
const Didact = {
  createElement,
  render,
  useState
};

// 使用 JSX
function Counter() {
  const [state, setState] = useState(0);
  return (
    <h1 onClick={() => setState(c => c + 1)}>
      Count: {state}
    </h1>
  );
}

const element = <Counter />;
const container = document.getElementById("root");
Didact.render(element, container);
```

## 总结

通过手写 Mini React，我们理解了：
- **createElement**: 创建虚拟 DOM
- **Fiber**: 可中断的工作单元
- **Diff 算法**: 高效的协调策略
- **commitRoot**: 将变更提交到 DOM
- **useState**: Hook 的基本实现

这些原理帮助我们更好地使用和优化 React 应用。