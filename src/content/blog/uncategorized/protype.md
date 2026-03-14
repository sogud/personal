---
title: "JavaScript 原型链完全指南"
description: "深入理解 JavaScript 原型继承机制、prototype、__proto__、原型链查找以及 ES6 Class"
pubDate: "2018-01-13T16:07:32"
tags: ["JavaScript", "原型", "继承", "前端"]
---

# JavaScript 原型链完全指南

原型链是 JavaScript 最核心的概念之一，理解它是掌握面向对象编程的关键。

## 什么是原型？

每个 JavaScript 对象（除了 null）都有一个属性 `__proto__`，这个属性指向另一个对象，称为"原型"。

```javascript
const obj = {};
console.log(obj.__proto__); // Object {}
console.log(obj.__proto__ === Object.prototype); // true
```

## prototype vs __proto__

| 属性 | 作用对象 | 含义 |
|------|----------|------|
| `prototype` | 函数 | 创建实例时自动指定的原型对象 |
| `__proto__` | 实例 | 指向构造函数的 prototype |

```javascript
function Person(name) {
  this.name = name;
}

// prototype 是函数特有的属性
console.log(Person.prototype); // Person {}

// 实例的 __proto__ 指向构造函数的 prototype
const person1 = new Person('张三');
console.log(person1.__proto__ === Person.prototype); // true
```

## 原型链查找

当访问对象的属性时，会沿着原型链向上查找：

```javascript
function Person() {}
Person.prototype.name = '张三';

const person1 = new Person();
console.log(person1.name); // '张三'

// 查找过程：
// 1. person1 自身没有 name
// 2. 查找 person1.__proto__ (Person.prototype)
// 3. 找到 name: '张三'
```

## 原型链图示

```
person1
  │
  └── __proto__ ──→ Person.prototype
                        │
                        └── __proto__ ──→ Object.prototype
                                                    │
                                                    └── __proto__ ──→ null
```

## 原型继承

### 1. 原型链继承

```javascript
function Parent() {
  this.name = 'Parent';
}

function Child() {
  this.age = 18;
}

// 关键：设置 Child 的原型为 Parent 实例
Child.prototype = new Parent();
Child.prototype.constructor = Child;

const child = new Child();
console.log(child.name); // 'Parent'
console.log(child.age);  // 18
```

### 2. 构造函数继承（经典继承）

```javascript
function Parent(name) {
  this.name = name;
}

function Child(name, age) {
  // 在子构造函数中调用父构造函数
  Parent.call(this, name);
  this.age = age;
}

const child = new Child('张三', 18);
console.log(child.name); // '张三'
console.log(child.age);  // 18
```

### 3. 组合继承（最常用）

```javascript
function Parent(name) {
  this.name = name;
}

Parent.prototype.sayName = function() {
  console.log(this.name);
};

function Child(name, age) {
  Parent.call(this, name);
  this.age = age;
}

// 原型链继承
Child.prototype = new Parent();
Child.prototype.constructor = Child;

const child = new Child('张三', 18);
child.sayName(); // '张三'
```

### 4. ES6 Class 语法

```javascript
class Parent {
  constructor(name) {
    this.name = name;
  }

  sayName() {
    console.log(this.name);
  }
}

class Child extends Parent {
  constructor(name, age) {
    super(name); // 调用父构造函数
    this.age = age;
  }

  sayAge() {
    console.log(this.age);
  }
}

const child = new Child('张三', 18);
child.sayName(); // '张三'
child.sayAge();  // 18
```

## 原型方法

### hasOwnProperty

判断属性是否在对象自身上（不在原型链上）：

```javascript
function Person() {}
Person.prototype.name = '张三';

const person = new Person();
person.age = 18;

console.log(person.hasOwnProperty('name')); // false
console.log(person.hasOwnProperty('age'));  // true
```

### in vs hasOwnProperty

```javascript
function Person() {}
Person.prototype.name = '张三';

const person = new Person();
person.age = 18;

console.log('name' in person);  // true（包含原型链）
console.log('age' in person);   // true
console.log(Object.keys(person)); // ['age']
```

## Object.create()

创建对象并指定原型：

```javascript
const parent = {
  name: 'Parent',
  sayHello() {
    console.log('Hello');
  }
};

const child = Object.create(parent);
console.log(child.name); // 'Parent'
child.sayHello(); // 'Hello'
```

## 原型操作

### 获取对象原型

```javascript
const obj = {};

// 方法1：__proto__
console.log(obj.__proto__);

// 方法2：Object.getPrototypeOf()
console.log(Object.getPrototypeOf(obj));

// 方法3：Object.getPrototypeOf(obj.constructor.prototype)
```

### 设置对象原型

```javascript
const parent = { name: 'Parent' };
const child = { age: 18 };

// 设置 child 的原型为 parent
Object.setPrototypeOf(child, parent);
console.log(child.name); // 'Parent'
```

## 总结

理解原型链是 JavaScript 进阶的关键：
- **prototype**：函数特有，指向原型对象
- **__proto__**：实例属性，指向构造函数的 prototype
- **继承方式**：原型链继承、构造函数继承、组合继承、ES6 Class
- **查找顺序**：自身 → 原型 → 原型的原型 → ... → null