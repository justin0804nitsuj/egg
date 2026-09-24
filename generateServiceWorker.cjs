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
  console.error('找不到 dist，請先執行 expo export。');
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
  ${JSON.stringify(assets, null, 2)};

self.addEventListener(
  'install',
  (event) => {
    event.waitUntil(
      (async () => {
        const cache =
          await caches.open(
            CACHE_NAME
          );

        for (
          const url of APP_SHELL
        ) {
          try {
            const response =
              await fetch(
                url,
                {
                  cache: 'reload'
                }
              );

            if (
              response.ok
            ) {
              await cache.put(
                url,
                response
              );
            }
          } catch (error) {
            console.warn(
              'Cache failed:',
              url
            );
          }
        }

        const index =
          await cache.match(
            '/index.html'
          );

        if (!index) {
          throw new Error(
            'index.html cache failed'
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
          keys.map(
            (key) => {
              if (
                key !==
                  CACHE_NAME &&
                key.startsWith(
                  'vocabapp-'
                )
              ) {
                return caches.delete(
                  key
                );
              }

              return Promise.resolve();
            }
          )
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
        fetch(
          event.request
        )
          .then(
            (response) => {
              const copy =
                response.clone();

              caches
                .open(
                  CACHE_NAME
                )
                .then(
                  (cache) =>
                    cache.put(
                      '/index.html',
                      copy
                    )
                );

              return response;
            }
          )
          .catch(() =>
            caches.match(
              '/index.html'
            )
          )
      );

      return;
    }

    event.respondWith(
      caches
        .match(
          event.request
        )
        .then(
          (cached) => {
            if (cached) {
              return cached;
            }

            return fetch(
              event.request
            ).then(
              (response) => {
                if (
                  response &&
                  response.ok
                ) {
                  const copy =
                    response.clone();

                  caches
                    .open(
                      CACHE_NAME
                    )
                    .then(
                      (cache) =>
                        cache.put(
                          event.request,
                          copy
                        )
                    );
                }

                return response;
              }
            );
          }
        )
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
  SW_FILE
);

console.log(
  `Cached assets: ${assets.length}`
);

console.log('');