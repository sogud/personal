---
title: "Axios 完整配置指南：从基础到企业级封装"
description: "深入讲解 Axios 的配置、拦截器、错误处理、封装实践以及 Vue 项目中的最佳集成方案"
pubDate: "2018-01-13T16:07:32"
tags: ["Vue", "Axios", "HTTP", "前端"]
---

# Axios 完整配置指南

Axios 是 Vue 项目中最常用的 HTTP 请求库，本文详细介绍从基础配置到企业级封装。

## 1. 全局默认配置

```javascript
import axios from 'axios';

// 全局默认值
axios.defaults.baseURL = 'https://api.example.com';
axios.defaults.timeout = 10000;
axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/json';
```

## 2. 创建实例

```javascript
// 创建自定义实例
const instance = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 15000,
  withCredentials: true
});

// 修改实例默认值
instance.defaults.headers.post['Content-Type'] = 'application/json';
```

## 3. 完整封装示例

```javascript
// utils/request.js
import axios from 'axios';
import { Loading, Message } from 'element-ui';
import router from '@/router';
import { removeCookies } from './auth';

let loadingInstance = null;

// 创建 axios 实例
const instance = axios.create({
  timeout: 10000,
  baseURL: process.env.VUE_APP_BASE_API,
  withCredentials: true
});

// 默认配置
instance.defaults.headers.post['Content-Type'] = 'application/json';

// HTTP 状态码提示
const httpCode = {
  400: '请求参数错误',
  401: '登录已过期，请重新登录',
  403: '没有权限访问',
  404: '请求资源不存在',
  500: '服务器内部错误',
  502: '网关错误',
  504: '网关超时'
};

// ============ 请求拦截器 ============
instance.interceptors.request.use(
  config => {
    // 开启加载动画
    loadingInstance = Loading.service({
      spinner: 'fa fa-spinner fa-spin fa-3x fa-fw',
      text: '加载中...',
      background: 'rgba(0, 0, 0, 0.7)'
    });

    // 添加 token
    const token = sessionStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    // 文件下载特殊处理
    if (config.url.includes('export') || config.url.includes('download')) {
      config.responseType = 'blob';
    }

    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// ============ 响应拦截器 ============
instance.interceptors.response.use(
  response => {
    loadingInstance?.close();

    const { status, data } = response;

    if (status === 200) {
      // 业务成功
      return data;
    }

    Message.error(data.message || '请求失败');
    return Promise.reject(response);
  },
  error => {
    loadingInstance?.close();

    if (error.response) {
      const { status, data } = error.response;
      const tips = httpCode[status] || data.message || '网络错误';

      Message.error(`${status}: ${tips}`);

      // 登录过期处理
      if (status === 401) {
        setTimeout(() => {
          removeCookies('token');
          router.push('/login');
        }, 1500);
      }
    } else {
      Message.error('网络连接失败，请检查网络');
    }

    return Promise.reject(error);
  }
);

export default instance;
```

## 4. API 封装

```javascript
// api/user.js
import request from '@/utils/request';

// GET 请求
export function getUserInfo(params) {
  return request({
    url: '/user/info',
    method: 'get',
    params
  });
}

// POST 请求
export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    data
  });
}

// 文件上传
export function uploadFile(data) {
  return request({
    url: '/upload',
    method: 'post',
    data,
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}

// 文件下载
export function downloadFile(params) {
  return request({
    url: '/export',
    method: 'get',
    params,
    responseType: 'blob'
  });
}
```

## 5. 并发请求

```javascript
import axios from 'axios';

// 并发多个请求
function getUserAndOrders() {
  return axios.all([
    axios.get('/user'),
    axios.get('/orders')
  ]).then(
    axios.spread((userRes, ordersRes) => {
      return {
        user: userRes.data,
        orders: ordersRes.data
      };
    })
  );
}

// 或使用 Promise.all
async function getData() {
  const [user, orders] = await Promise.all([
    axios.get('/user'),
    axios.get('/orders')
  ]);
  return { user: user.data, orders: orders.data };
}
```

## 6. 取消请求

```javascript
import axios from 'axios';

// 创建取消令牌
const CancelToken = axios.CancelToken;
let cancel;

// 请求
function fetchData() {
  axios.get('/api/data', {
    cancelToken: new CancelToken(c => {
      cancel = c;
    })
  });
}

// 取消请求
function cancelRequest() {
  cancel('请求已取消');
}
```

## 7. 请求重试

```javascript
// 请求重试拦截器
instance.interceptors.response.use(
  error => {
    const config = error.config;

    // 如果没有配置重试，不重试
    if (!config || !config.retry) return Promise.reject(error);

    // 重试次数
    config.retryCount = config.retryCount || 0;

    if (config.retryCount >= config.retry) {
      return Promise.reject(error);
    }

    config.retryCount++;
    console.log(`重试第 ${config.retryCount} 次`);

    return new Promise(resolve => {
      setTimeout(() => {
        resolve(instance(config));
      }, config.retryDelay || 1000);
    });
  }
);

// 使用
instance.get('/api/data', {
  retry: 3,
  retryDelay: 1000
});
```

## 8. 实际使用

```vue
<template>
  <div>
    <button @click="fetchData">获取数据</button>
  </div>
</template>

<script>
import { getUserInfo } from '@/api/user';

export default {
  methods: {
    async fetchData() {
      try {
        const data = await getUserInfo({ id: 1 });
        console.log(data);
      } catch (error) {
        console.error('请求失败', error);
      }
    }
  }
};
</script>
```

## 总结

Axios 封装要点：
- **请求拦截器**：添加 token、loading 动画
- **响应拦截器**：统一错误处理、登录过期跳转
- **API 封装**：按模块划分，易于维护
- **错误处理**：友好的用户提示
- **请求重试**：提高请求成功率