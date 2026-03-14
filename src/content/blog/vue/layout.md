---
title: "CSS 布局完全指南：从基础到进阶"
description: "深入讲解 CSS 各种布局方式：单栏、双栏、三栏布局，以及 Flexbox、Grid 现代布局技术"
pubDate: "2018-01-13T16:07:32"
tags: ["CSS", "布局", "Flexbox", "Grid"]
---

# CSS 布局完全指南

CSS 布局是前端开发的核心技能，本文详细介绍各种布局方式。

## 1. 单栏布局

### 基础单栏

```css
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}
```

### 通栏布局

```css
.full-width {
  width: 100%;
  height: 100vh;
}
```

## 2. 两栏布局

### Float 布局（传统）

```css
.parent::after {
  content: '';
  display: block;
  clear: both;
}

.left {
  float: left;
  width: 200px;
}

.right {
  margin-left: 200px;
}
```

### Flexbox 布局（推荐）

```css
.parent {
  display: flex;
}

.left {
  width: 200px;
  flex-shrink: 0;
}

.right {
  flex: 1;
}
```

### Grid 布局

```css
.parent {
  display: grid;
  grid-template-columns: 200px 1fr;
}
```

## 3. 三栏布局

### 圣杯布局

```css
.container {
  padding: 0 200px;
}

.middle {
  float: left;
  width: 100%;
}

.left {
  float: left;
  width: 200px;
  margin-left: -100%;
  position: relative;
  left: -200px;
}

.right {
  float: left;
  width: 200px;
  margin-left: -200px;
  position: relative;
  left: 200px;
}
```

### 双飞翼布局

```css
.middle {
  float: left;
  width: 100%;
}

.middle-inner {
  margin: 0 200px;
}

.left {
  float: left;
  width: 200px;
  margin-left: -100%;
}

.right {
  float: left;
  width: 200px;
  margin-left: -200px;
}
```

### Flexbox 实现

```css
.parent {
  display: flex;
}

.left, .right {
  width: 200px;
  flex-shrink: 0;
}

.middle {
  flex: 1;
}
```

### Grid 实现

```css
.parent {
  display: grid;
  grid-template-columns: 200px 1fr 200px;
}
```

## 4. Flexbox 深入

### 主轴对齐

```css
.container {
  display: flex;
  justify-content: flex-start;    /* 左对齐 */
  justify-content: flex-end;      /* 右对齐 */
  justify-content: center;        /* 居中 */
  justify-content: space-between; /* 两端对齐 */
  justify-content: space-around;  /* 环绕 */
}
```

### 交叉轴对齐

```css
.container {
  align-items: flex-start;   /* 顶部对齐 */
  align-items: flex-end;    /* 底部对齐 */
  align-items: center;       /* 居中 */
  align-items: stretch;      /* 拉伸填满 */
  align-items: baseline;     /* 基线对齐 */
}
```

### 	flex-wrap 换行

```css
.container {
  display: flex;
  flex-wrap: nowrap;      /* 不换行 */
  flex-wrap: wrap;        /* 换行 */
  flex-wrap: wrap-reverse;/* 反向换行 */
}
```

## 5. Grid 深入

### 网格模板

```css
.container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);  /* 三列等宽 */
  grid-template-rows: 100px 200px;         /* 两行高度 */
  gap: 20px;                              /* 间距 */
}
```

### 命名网格区域

```css
.container {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar content content"
    "footer footer footer";
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.content { grid-area: content; }
.footer { grid-area: footer; }
```

### 响应式网格

```css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}
```

## 6. 实际应用：Sticky Footer

### Flexbox 实现

```css
body {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main {
  flex: 1;
}
```

### Grid 实现

```css
body {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}
```

## 总结

| 布局方式 | 适用场景 |
|----------|----------|
| Float | 传统兼容 |
| Flexbox | 一维布局 |
| Grid | 二维布局 |
| Position | 定位元素 |

现代开发推荐使用 Flexbox 和 Grid 结合。