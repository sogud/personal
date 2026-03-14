---
title: "Mac Nginx 完全配置指南"
description: "深入讲解 Mac 上 Nginx 的安装、配置、反向代理、负载均衡以及 HTTPS 配置"
pubDate: "2018-01-13T16:07:32"
tags: ["Nginx", "Mac", "反向代理", "Web服务器"]
---

# Mac Nginx 完全配置指南

Nginx 是高性能的 HTTP 服务器和反向代理服务器，本文详细介绍在 Mac 上的配置使用方法。

## 1. 安装 Nginx

```bash
# 更新 Homebrew
brew update

# 查看 nginx 信息
brew info nginx

# 安装 nginx
brew install nginx
```

## 2. 基本命令

```bash
# 启动 nginx
nginx

# 停止 nginx
nginx -s stop

# 重新加载配置
nginx -s reload

# 测试配置语法
nginx -t

# 查看版本
nginx -v
```

## 3. 配置文件位置

```
/usr/local/etc/nginx/nginx.conf     # 主配置文件
/usr/local/etc/nginx/servers/       # 额外的 server 配置
/usr/local/var/www/                  # 默认文档根目录
/usr/local/Cellar/nginx/             # 安装目录
```

## 4. 配置文件详解

### 主配置文件 nginx.conf

```nginx
worker_processes  1;

events {
    worker_connections  1024;
}

http {
    include       mime.types;
    default_type  application/octet-stream;

    # 日志格式
    log_format main '$remote_addr - $remote_user [$time_local] "$request" '
                    '$status $body_bytes_sent "$http_referer" '
                    '"$http_user_agent" "$http_x_forwarded_for"';

    access_log /usr/local/var/log/nginx/access.log main;
    error_log /usr/local/var/log/nginx/error.log;

    sendfile        on;
    tcp_nopush      on;
    tcp_nodelay     on;
    keepalive_timeout  65;
    types_hash_max_size 2048;

    include /usr/local/etc/nginx/servers/*.conf;
}
```

### 简单的静态服务器配置

```nginx
server {
    listen 8080;
    server_name localhost;

    root /Users/username/www;
    index index.html index.htm;

    location / {
        try_files $uri $uri/ =404;
    }

    # 访问日志
    access_log /usr/local/var/log/nginx/myapp.log;
}
```

## 5. 反向代理配置

```nginx
server {
    listen 80;
    server_name myapp.local;

    location / {
        # 代理到后端服务
        proxy_pass http://localhost:3000;

        # 设置代理请求头
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # 超时设置
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
```

## 6. 负载均衡配置

```nginx
# 上游服务器组
upstream backend {
    server localhost:3001;
    server localhost:3002;
    server localhost:3003;
}

server {
    listen 80;
    server_name myapp.local;

    location / {
        proxy_pass http://backend;

        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### 负载均衡策略

```nginx
# 轮询（默认）
upstream backend {
    server localhost:3001;
    server localhost:3002;
}

# 权重
upstream backend {
    server localhost:3001 weight=3;
    server localhost:3002 weight=1;
}

# IP 哈希（同一 IP 固定到同一服务器）
upstream backend {
    ip_hash;
    server localhost:3001;
    server localhost:3002;
}

# 最少连接
upstream backend {
    least_conn;
    server localhost:3001;
    server localhost:3002;
}
```

## 7. HTTPS 配置

### 生成自签名证书

```bash
# 创建证书目录
mkdir -p /usr/local/etc/nginx/ssl

# 生成私钥
openssl genrsa -out server.key 2048

# 生成 CSR
openssl req -new -key server.key -out server.csr

# 生成自签名证书
openssl x509 -req -days 365 -in server.csr -signkey server.key -out server.crt
```

### HTTPS 配置

```nginx
server {
    listen 443 ssl http2;
    server_name myapp.local;

    ssl_certificate /usr/local/etc/nginx/ssl/server.crt;
    ssl_certificate_key /usr/local/etc/nginx/ssl/server.key;

    # SSL 配置
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
    ssl_prefer_server_ciphers on;
    ssl_session_cache shared:SSL:10m;
    ssl_session_timeout 10m;

    location / {
        proxy_pass http://localhost:3000;
    }
}

# HTTP 重定向到 HTTPS
server {
    listen 80;
    server_name myapp.local;
    return 301 https://$server_name$request_uri;
}
```

## 8. 配置示例：Vue/React 项目

```nginx
server {
    listen 8080;
    server_name myapp.local;
    root /Users/username/project/dist;
    index index.html;

    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
    gzip_min_length 1000;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API 代理
    location /api/ {
        proxy_pass http://localhost:3000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

## 9. 常用命令速查

```bash
# 启动
nginx

# 停止
nginx -s stop

# 优雅停止
nginx -s quit

# 重载配置
nginx -s reload

# 测试配置
nginx -t

# 查看进程
ps aux | grep nginx

# 指定配置文件启动
nginx -c /path/to/nginx.conf

# 杀死所有 nginx 进程
pkill nginx
```

## 10. 常见问题

### 端口被占用

```bash
# 查找占用端口的进程
lsof -i :80

# 杀掉进程
kill -9 <PID>

# 或使用 8080 端口
nginx -p /usr/local/etc/nginx/ -c nginx.conf
```

### 权限问题

```bash
# 如果遇到权限错误
sudo chown -R $(whoami) /usr/local/var/log/nginx/
sudo chown -R $(whoami) /usr/local/etc/nginx/
```

## 总结

Nginx 是现代 Web 开发不可或缺的工具：
- **静态服务器**：高效服务静态文件
- **反向代理**：隐藏后端服务
- **负载均衡**：分发请求提高性能
- **HTTPS**：安全加密传输