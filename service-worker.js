// バージョン番号をここで管理
const APP_VERSION = '1.0.0'; // index.htmlの<title>などと合わせてください
const CACHE_NAME = `shibane-search-songs-v${APP_VERSION}`;
const urlsToCache = [
	'/',
	'/index.html',
	'/manifest.json',
	'/style.css',
	'/icon-192.png',
	'/icon-512.png',
	// 必要に応じて他のリソースも追加
];

// インストール時にキャッシュ
self.addEventListener('install', event => {
	event.waitUntil(
		caches.open(CACHE_NAME).then(cache => {
			return cache.addAll(urlsToCache);
		})
	);
});

// リクエスト時にキャッシュを返す
self.addEventListener('fetch', event => {
	event.respondWith(
		caches.match(event.request).then(response => {
			return response || fetch(event.request);
		})
	);
});

// 古いキャッシュの削除
self.addEventListener('activate', event => {
	event.waitUntil(
		caches.keys().then(cacheNames => {
			return Promise.all(
				cacheNames.filter(name => name !== CACHE_NAME).map(name => caches.delete(name))
			);
		})
	);
});