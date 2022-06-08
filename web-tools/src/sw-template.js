/* eslint-disable no-restricted-globals */

const CacheName = 'my-cache';
const CacheVersion = 2.1;
console.log('CacheVersion: ', CacheVersion);

function shouldCache(url, httpRes) {
	if (
		url.indexOf('.js') > 0 ||
		url.indexOf('.css') > 0 ||
		url.indexOf('.json') > 0 ||
		url.indexOf('.png') > 0 ||
		url.indexOf('.jpg') > 0 ||
		url.indexOf('.jpeg') > 0 ||
		url.indexOf('.ico') > 0
	) {
		return true;
	}
	const keys = [...httpRes.headers.keys()];
	if (keys.indexOf('content-type') >= 0 && httpRes.headers.get('content-type').indexOf('text/html') >= 0) { // html文件
		return true;
	}
	return false;
}
const __WB_MANIFEST = self.__WB_MANIFEST;

self.addEventListener('install', (event) => {
	event.waitUntil(caches.open(CacheName + CacheVersion).then(function(cache) {
		return cache.addAll(__WB_MANIFEST.map(i => i.url));
	  }))
})
self.addEventListener('fetch', function (event) {
	// console.log('event: ', event);
	const url = event.request.url;
	if (
		url.startsWith('chrome-extension') ||
		url.includes('extension') ||
		!(url.indexOf('http') === 0)
	) return;
    event.respondWith(
        caches.match(event.request).then(function (response) {
            // 如果 Service Worker 有自己的返回，就直接返回，减少一次 http 请求
            if (response) {
                return response;
            }

            // 如果 service worker 没有返回，那就得直接请求真实远程服务
            var request = event.request.clone(); // 把原始请求拷过来
            return fetch(request).then(function (httpRes) {

                // http请求的返回已被抓到，可以处置了。

                // 请求失败了，直接返回失败的结果就好了。。
                if (!httpRes || httpRes.status !== 200) {
                    return httpRes;
                }
				
                // 请求成功的话，将请求缓存起来。
                if (shouldCache(request.url, httpRes)) {
					var responseClone = httpRes.clone();
					caches.open(CacheName + CacheVersion).then(function (cache) {
						cache.put(event.request, responseClone);
					});
				}

                return httpRes;
            });
        })
    );
});
self.addEventListener('activate', (event) => {
    event.waitUntil(
        Promise.all([

            // 更新客户端
            self.clients.claim(),

            // 清理旧版本
            caches.keys().then(function (cacheList) {
                return Promise.all(
                    cacheList.map(function (cacheName) {
                        if (cacheName !== CacheName + CacheVersion) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
        ])
    );
});