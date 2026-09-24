const fs = require('fs');
const path = require('path');

const DIST_DIR = path.join(
  __dirname,
  '..',
  'dist'
);

const SW_FILE = path.join(
  DIST_DIR,
  'sw.js'
);

if (!fs.existsSync(DIST_DIR)) {
  console.error(
    '❌ 找不到 dist 資料夾'
  );

  console.error(
    '請先執行 npm run build:web'
  );

  process.exit(1);
}

const ALLOWED_EXTENSIONS =
  new Set([
    '.html',
    '.js',
    '.css',
    '.json',

    '.png',
    '.jpg',
    '.jpeg',
    '.webp',
    '.svg',
    '.ico',

    '.ttf',
    '.otf',
    '.woff',
    '.woff2',
  ]);

function walkDirectory(directory) {
  const entries =
    fs.readdirSync(
      directory,
      {
        withFileTypes: true,
      }
    );

  const files = [];

  for (const entry of entries) {
    const fullPath =
      path.join(
        directory,
        entry.name
      );

    if (entry.isDirectory()) {
      files.push(
        ...walkDirectory(
          fullPath
        )
      );

      continue;
    }

    files.push(fullPath);
  }

  return files;
}

const files =
  walkDirectory(
    DIST_DIR
  );

const assets =
  files
    .filter((file) => {
      if (
        path.resolve(file) ===
        path.resolve(SW_FILE)
      ) {
        return false;
      }

      const extension =
        path
          .extname(file)
          .toLowerCase();

      return (
        ALLOWED_EXTENSIONS
          .has(extension)
      );
    })
    .map((file) => {
      const relative =
        path.relative(
          DIST_DIR,
          file
        );

      return (
        '/' +
        relative
          .split(path.sep)
          .join('/')
      );
    });

if (
  !assets.includes(
    '/index.html'
  )
) {
  assets.unshift(
    '/index.html'
  );
}

const CACHE_NAME =
  `vocabapp-${Date.now()}`;

const serviceWorker = `
const CACHE_NAME =
  ${JSON.stringify(CACHE_NAME)};

const APP_SHELL =
  ${JSON.stringify(
    assets,
    null,
    2
  )};

self.addEventListener(
  'install',
  (event) => {
    event.waitUntil(
      (async () => {
        const cache =
          await caches.open(
            CACHE_NAME
          );

        for (const url of APP_SHELL) {
          try {
            const response =
              await fetch(
                url,
                {
                  cache: 'reload'
                }
              );

            if (!response.ok) {
              console.warn(
                '[SW] failed:',
                url,
                response.status
              );

              continue;
            }

            await cache.put(
              url,
              response
            );
          } catch (error) {
            console.warn(
              '[SW] cache error:',
              url,
              error
            );
          }
        }

        const index =
          await cache.match(
            '/index.html'
          );

        if (!index) {
          throw new Error(
            'index.html was not cached'
          );
        }

        await self.skipWaiting();
      })()
    );
  }
);

self.addEventListener(
  'activate',
  (event) => {
    event.waitUntil(
      (async () => {
        const keys =
          await caches.keys();

        await Promise.all(
          keys.map((key) => {
            if (
              key !== CACHE_NAME &&
              key.startsWith(
                'vocabapp-'
              )
            ) {
              return caches.delete(
                key
              );
            }

            return Promise.resolve();
          })
        );

        await self.clients.claim();
      })()
    );
  }
);

self.addEventListener(
  'fetch',
  (event) => {
    if (
      event.request.method !==
      'GET'
    ) {
      return;
    }

    const url =
      new URL(
        event.request.url
      );

    if (
      url.origin !==
      self.location.origin
    ) {
      return;
    }

    if (
      event.request.mode ===
      'navigate'
    ) {
      event.respondWith(
        (async () => {
          try {
            const response =
              await fetch(
                event.request
              );

            if (response.ok) {
              const cache =
                await caches.open(
                  CACHE_NAME
                );

              await cache.put(
                '/index.html',
                response.clone()
              );
            }

            return response;
          } catch (error) {
            return caches.match(
              '/index.html'
            );
          }
        })()
      );

      return;
    }

    event.respondWith(
      (async () => {
        const cached =
          await caches.match(
            event.request
          );

        if (cached) {
          return cached;
        }

        try {
          const response =
            await fetch(
              event.request
            );

          if (
            response &&
            response.ok
          ) {
            const cache =
              await caches.open(
                CACHE_NAME
              );

            await cache.put(
              event.request,
              response.clone()
            );
          }

          return response;
        } catch (error) {
          throw error;
        }
      })()
    );
  }
);
`;

fs.writeFileSync(
  SW_FILE,
  serviceWorker,
  'utf8'
);

console.log('');
console.log(
  '✅ sw.js generated'
);

console.log(
  `Cache: ${CACHE_NAME}`
);

console.log(
  `Cached assets: ${assets.length}`
);

console.log(
  `Output: ${SW_FILE}`
);

console.log('');