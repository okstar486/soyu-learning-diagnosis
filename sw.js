/**
 * 소유 학습 진단 앱 - Service Worker
 * 오프라인 지원 및 캐싱
 */

const CACHE_NAME = 'soyu-diagnosis-v4';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json',

  // CSS
  '/css/style.css',
  '/css/theme.css',
  '/css/animations.css',

  // JavaScript
  '/js/app.js',
  '/js/storage.js',
  '/js/ui.js',
  '/js/character.js',
  '/js/diagnosis.js',
  '/js/questions.js',
  '/js/level.js',
  '/js/dashboard.js',

  // Pages
  '/pages/home.html',
  '/pages/diagnosis.html',
  '/pages/result.html',
  '/pages/dashboard.html',

  // Question Data
  '/data/questions/vocabulary.json',
  '/data/questions/self-efficacy.json',
  '/data/questions/reading.json',
  '/data/questions/motivation.json',
  '/data/questions/grammar.json',
  '/data/questions/strength.json',

  // Character Images
  '/assets/images/haru_main.jpeg',
  '/assets/images/haru_happy.jpeg',
  '/assets/images/haru_encourage.jpeg',
  '/assets/images/haru_focus.jpeg',
  '/assets/images/haru_levelup.jpeg',
  '/assets/images/haru_complete.jpeg',

  // Fonts
  'https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;500;700&family=Black+Han+Sans&display=swap'
];

// 설치 이벤트 - 정적 자산 캐싱
self.addEventListener('install', (event) => {
  console.log('[SW] Installing...');

  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[SW] Caching static assets');
        return cache.addAll(CACHE_URLS);
      })
      .then(() => {
        console.log('[SW] Installation complete');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('[SW] Installation failed:', error);
      })
  );
});

// 활성화 이벤트 - 이전 캐시 정리
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...');

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('[SW] Activation complete');
        return self.clients.claim();
      })
  );
});

// Fetch 이벤트 - 캐시 우선 전략
self.addEventListener('fetch', (event) => {
  // 외부 URL은 네트워크 우선
  if (!event.request.url.startsWith(self.location.origin)) {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request);
        })
    );
    return;
  }

  // 정적 자산은 캐시 우선
  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        if (cachedResponse) {
          // 백그라운드에서 새 버전 가져오기
          fetch(event.request)
            .then((networkResponse) => {
              if (networkResponse && networkResponse.status === 200) {
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(event.request, networkResponse);
                  });
              }
            })
            .catch(() => {});

          return cachedResponse;
        }

        // 캐시에 없으면 네트워크 요청
        return fetch(event.request)
          .then((networkResponse) => {
            // 성공적인 응답 캐싱
            if (networkResponse && networkResponse.status === 200) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseClone);
                });
            }
            return networkResponse;
          })
          .catch((error) => {
            console.error('[SW] Fetch failed:', error);

            // 오프라인 폴백
            if (event.request.destination === 'document') {
              return caches.match('/index.html');
            }

            return new Response('오프라인 상태입니다', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// 메시지 이벤트 - 캐시 업데이트 요청 처리
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    caches.delete(CACHE_NAME)
      .then(() => {
        console.log('[SW] Cache cleared');
      });
  }
});
