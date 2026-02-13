// Service Worker - 极简缓存策略
const CACHE_NAME = 'sogud-v1';
const STATIC_ASSETS = [
  '/',
  '/about',
  '/blog',
  '/styles/global.css',
  '/favicon.svg'
];

// 安装 - 缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// 激活 - 清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// 拦截请求 - 缓存优先策略
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // 跳过非 GET 请求和第三方资源
  if (request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }
  
  // HTML 页面 - 网络优先，失败回退缓存
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }
  
  // 静态资源 - 缓存优先
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) {
        // 后台更新缓存
        fetch(request).then(response => {
          caches.open(CACHE_NAME).then(cache => cache.put(request, response));
        }).catch(() => {});
        return cached;
      }
      
      return fetch(request).then(response => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return response;
      });
    })
  );
});
