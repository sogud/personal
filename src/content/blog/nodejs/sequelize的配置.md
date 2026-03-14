---
title: "Sequelize 完全指南：Node.js ORM 实战"
description: "深入讲解 Sequelize 的配置、模型定义、关联关系、查询操作以及与 TypeScript 的结合使用"
pubDate: "2018-01-13T16:07:32"
tags: ["Node.js", "Sequelize", "ORM", "数据库"]
---

# Sequelize 完全指南

Sequelize 是 Node.js 最流行的 ORM 框架，支持 MySQL、PostgreSQL、SQLite、MSSQL 等多种数据库。

## 什么是 ORM？

ORM (Object-Relational Mapping) 将关系数据库的表结构映射为 JavaScript 对象，开发者可以用面向对象的方式操作数据库。

## 安装与配置

### 1. 安装依赖

```bash
npm install sequelize mysql2
# 或
npm install sequelize pg pg-hstore
```

### 2. 初始化 Sequelize

```javascript
const { Sequelize } = require('sequelize');

// 方式1：连接参数
const sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql', // 或 'postgres', 'sqlite', 'mssql'
  logging: console.log,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// 方式2：连接 URI
const sequelize = new Sequelize('mysql://username:password@localhost:3306/database');
```

### 3. 测试连接

```javascript
async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log('数据库连接成功');
  } catch (error) {
    console.error('数据库连接失败:', error);
  }
}
```

## 模型定义

### 1. 定义模型

```javascript
const { DataTypes, Model } = Sequelize;

// 方式1：define
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    defaultValue: 18
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'banned'),
    defaultValue: 'active'
  }
}, {
  tableName: 'users', // 自定义表名
  timestamps: true,   // 自动添加 createdAt/updatedAt
  underscored: true   // 使用 snake_case 命名
});

// 方式2：继承 Model
class User extends Model {}
User.init({
  username: DataTypes.STRING,
  email: DataTypes.STRING
}, {
  sequelize,
  modelName: 'User'
});
```

### 2. 数据类型

```javascript
// 字符串
DataTypes.STRING(255)    // 可变长度
DataTypes.TEXT           // 长文本
DataTypes.TEXT('tiny')   // tiny, medium, long

// 数字
DataTypes.INTEGER
DataTypes.FLOAT
DataTypes.DECIMAL(10, 2) // 总位数和小数位数
DataTypes.BOOLEAN

// 日期
DataTypes.DATE       // DATETIME
DataTypes.DATEONLY   // 只有日期

// 其他
DataTypes.JSON       // JSON 对象
DataTypes.UUID        // UUID
DataTypes.ENUM('a', 'b', 'c')
```

## 数据库操作 CRUD

### 1. 创建数据

```javascript
// 创建单条
const user = await User.create({
  username: '张三',
  email: 'zhangsan@example.com',
  password: '123456'
});

// 批量创建
const users = await User.bulkCreate([
  { username: 'user1', email: 'user1@example.com' },
  { username: 'user2', email: 'user2@example.com' }
]);
```

### 2. 查询数据

```javascript
// 查询单条
const user = await User.findOne({
  where: { username: '张三' }
});

// 查询多条
const users = await User.findAll({
  where: {
    age: {
      [Op.gte]: 18 // >= 18
    }
  },
  order: [['createdAt', 'DESC']],
  limit: 10,
  offset: 0
});

// 分页查询
const { count, rows } = await User.findAndCountAll({
  limit: 10,
  offset: 0
});

// 原始查询
const users = await sequelize.query('SELECT * FROM users WHERE age > 18', {
  type: Sequelize.QueryTypes.SELECT
});
```

### 3. 更新数据

```javascript
// 更新单条
const user = await User.findOne({ where: { id: 1 } });
user.username = '新名字';
await user.save();

// 条件更新
await User.update(
  { status: 'inactive' },
  { where: { age: { [Op.lt]: 16 } } }
);
```

### 4. 删除数据

```javascript
// 软删除（需要 paranoid: true）
await user.destroy();

// 硬删除
await user.destroy({ force: true });

// 条件删除
await User.destroy({
  where: { status: 'banned' }
});
```

## 关联关系

### 1. 一对多 (One-to-Many)

```javascript
// 用户 - 文章 (一个用户有多篇文章)
User.hasMany(Post, { foreignKey: 'userId' });
Post.belongsTo(User, { foreignKey: 'userId' });
```

### 2. 多对多 (Many-to-Many)

```javascript
// 学生 - 课程 (一个学生可以上多门课，一门课可以有多个学生)
Student.belongsToMany(Course, { through: 'StudentCourse' });
Course.belongsToMany(Student, { through: 'StudentCourse' });
```

### 3. 一对一 (One-to-One)

```javascript
// 用户 - 用户详情
User.hasOne(Profile, { foreignKey: 'userId' });
Profile.belongsTo(User, { foreignKey: 'userId' });
```

### 4. 预加载 (Eager Loading)

```javascript
// 查询用户及其文章
const users = await User.findAll({
  include: [{
    model: Post,
    where: { status: 'published' },
    required: true
  }]
});
```

## 钩子函数 (Hooks)

```javascript
const User = sequelize.define('User', {
  username: DataTypes.STRING,
  password: DataTypes.STRING
});

// 创建前
User.beforeCreate(async (user, options) => {
  user.password = await bcrypt.hash(user.password, 10);
});

// 创建后
User.afterCreate((user, options) => {
  console.log(`用户 ${user.username} 创建成功`);
});

// 更新前
User.beforeUpdate(async (user, options) => {
  console.log('用户信息即将更新');
});
```

## 事务处理

```javascript
async function transferMoney(fromId, toId, amount) {
  const transaction = await sequelize.transaction();

  try {
    const fromUser = await User.findByPk(fromId);
    const toUser = await User.findByPk(toId);

    if (fromUser.balance < amount) {
      throw new Error('余额不足');
    }

    await fromUser.decrement('balance', { by: amount, transaction });
    await toUser.increment('balance', { by: amount, transaction });

    await transaction.commit();
    console.log('转账成功');
  } catch (error) {
    await transaction.rollback();
    console.error('转账失败:', error.message);
  }
}
```

## 与 TypeScript 结合

```typescript
import { Model, DataTypes, Optional } from 'sequelize';
import { sequelize } from '../config/database';

interface UserAttributes {
  id: number;
  username: string;
  email: string;
  password: string;
}

interface UserCreationAttributes extends Optional<UserAttributes, 'id'> {}

class User extends Model<UserAttributes, UserCreationAttributes> {
  declare id: number;
  declare username: string;
  declare email: string;
  declare password: string;
  declare readonly createdAt: Date;
  declare readonly updatedAt: Date;
}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users'
});
```

## 总结

Sequelize 让数据库操作变得简单高效：
- **模型定义**：面向对象方式定义数据表
- **CRUD 操作**：简洁的 API 完成所有操作
- **关联关系**：支持各种关联类型
- **事务支持**：确保数据一致性
- **钩子函数**：在生命周期中插入自定义逻辑