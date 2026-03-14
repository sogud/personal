---
title: "Vue 面试题完全指南：核心原理篇"
description: "深入讲解 Vue 模板解析、虚拟 DOM、响应式原理、组件生命周期等面试常考知识点"
pubDate: "2018-01-13T16:07:32"
tags: ["Vue", "面试", "前端", "虚拟DOM"]
---

# Vue 面试题完全指南

本文汇总 Vue 面试中最常考的知识点，包含详细解答和代码示例。

## 1. Vue 模板解析原理

### Vue 如何解析 Template？

Vue.js 会将组件的模板解析成一棵**虚拟 DOM 树**。

```javascript
// 模板
<template>
  <div>{{ message }}</div>
</template>

// 编译后的渲染函数
function render() {
  return h('div', null, this.message);
}
```

### 虚拟 DOM 是什么？

虚拟 DOM 是一种 JavaScript 数据结构，它在内存中模拟真实的 DOM 树。

```javascript
// 虚拟 DOM 节点
const vnode = {
  type: 'div',
  props: { class: 'container' },
  children: [
    { type: 'span', children: 'Hello' }
  ]
};
```

### 手写模板解析器

```javascript
function parse(template) {
  const parser = new Parser(template);
  const root = new Element();
  let current = root;
  const stack = [];

  while (!parser.eof()) {
    const ch = parser.next();

    if (ch === '<') {
      // 开始标签
      const tagName = parser.parseTagName();
      const element = new Element(tagName);
      current.append(element);
      current = element;
      stack.push(current);
    } else if (ch === '>') {
      stack.pop();
      current = stack[stack.length - 1];
    } else {
      current.append(ch);
    }
  }

  return root;
}

class Element {
  constructor(tagName) {
    this.tagName = tagName;
    this.children = [];
    this.text = '';
  }

  append(node) {
    if (typeof node === 'string') {
      this.text += node;
    } else {
      this.children.push(node);
    }
  }
}
```

## 2. Vue 响应式原理

### 什么是响应式？

当数据变化时，视图自动更新。

```javascript
// Vue 2 响应式原理
const data = { name: '张三' };

// 监听 data 的每个属性
Object.keys(data).forEach(key => {
  let value = data[key];

  Object.defineProperty(data, key, {
    get() {
      console.log(`读取 ${key}: ${value}`);
      return value;
    },
    set(newValue) {
      console.log(`设置 ${key}: ${newValue}`);
      value = newValue;
      // 触发视图更新
      updateView();
    }
  });
});

data.name = '李四'; // 触发 setter
```

### Vue 3 响应式

```javascript
import { reactive, ref } from 'vue';

// 响应式对象
const state = reactive({
  count: 0,
  name: '张三'
});

// ref 用于基本类型
const count = ref(0);

// 修改
count.value++;
state.count++;
```

## 3. 组件通信方式

### Props / $emit

```vue
<!-- Parent.vue -->
<template>
  <Child :name="name" @update="handleUpdate" />
</template>

<script>
export default {
  data() {
    return { name: '张三' };
  },
  methods: {
    handleUpdate(newName) {
      this.name = newName;
    }
  }
}
</script>

<!-- Child.vue -->
<template>
  <button @click="emitUpdate">{{ name }}</button>
</template>

<script>
export default {
  props: {
    name: String
  },
  methods: {
    emitUpdate() {
      this.$emit('update', '李四');
    }
  }
}
</script>
```

### Provide / Inject

```javascript
// 父组件
provide: {
  name: '张三',
  user: {
    age: 18
  }
}

// 子组件
inject: ['name', 'user'];

// 或响应式
provide() {
  return {
    name: this.name,
    setName: this.setName
  };
}
```

### Event Bus

```javascript
// bus.js
import Vue from 'vue';
export default new Vue();

// A 组件
import bus from './bus';
bus.$emit('event', data);

// B 组件
import bus from './bus';
bus.$on('event', data => {
  console.log(data);
});
```

## 4. Vuex / Pinia 状态管理

### Vuex 基本使用

```javascript
// store/index.js
import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment(state) {
      state.count++;
    }
  },
  actions: {
    incrementAsync({ commit }) {
      setTimeout(() => {
        commit('increment');
      }, 1000);
    }
  },
  getters: {
    doubleCount: state => state.count * 2
  }
});
```

### Pinia（Vue 3 推荐）

```javascript
// stores/counter.js
import { defineStore } from 'pinia';

export const useCounterStore = defineStore('counter', {
  state: () => ({ count: 0 }),

  getters: {
    double: (state) => state.count * 2
  },

  actions: {
    increment() {
      this.count++;
    }
  }
});
```

## 5. 生命周期钩子

| 阶段 | Vue 2 | Vue 3 |
|------|-------|-------|
| 创建前 | beforeCreate | - |
| 创建后 | created | onMounted |
| 挂载前 | beforeMount | onBeforeMount |
| 挂载后 | mounted | onMounted |
| 更新前 | beforeUpdate | onBeforeUpdate |
| 更新后 | updated | onUpdated |
| 销毁前 | beforeDestroy | onBeforeUnmount |
| 销毁后 | destroyed | onUnmounted |

## 6. 常见面试题

### Vue 双向绑定原理

```javascript
// v-model 本质
<input
  :value="value"
  @input="value = $event.target.value"
/>
```

### computed vs watch

- **computed**：计算属性，依赖变化自动重新计算，有缓存
- **watch**：监听数据变化，执行异步或复杂逻辑

### keep-alive 缓存

```vue
<keep-alive :include="['Home', 'About']">
  <router-view />
</keep-alive>
```

## 7. Vue 3 新特性

### Composition API

```vue
<script setup>
import { ref, computed, onMounted } from 'vue';

const count = ref(0);
const doubled = computed(() => count.value * 2);

function increment() {
  count.value++;
}

onMounted(() => {
  console.log('组件挂载');
});
</script>
```

### Teleport

```vue
<teleport to="body">
  <div class="modal">弹窗</div>
</teleport>
```

### Fragments（碎片）

Vue 3 组件可以返回多个根节点。

## 总结

Vue 面试核心：
- **响应式原理**：defineProperty / Proxy
- **模板编译**：AST → 渲染函数 → 虚拟 DOM
- **组件通信**：props、$emit、provide/inject、Vuex
- **生命周期**：创建→挂载→更新→销毁