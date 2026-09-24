module.exports = {
  globDirectory: 'dist',
  globPatterns: [
    '**/*.{html,js,css,json,png,ico,svg,ttf,woff,woff2}'
  ],
  swDest: 'dist/sw.js',
  maximumFileSizeToCacheInBytes: 10 * 1024 * 1024,
  navigateFallback: '/index.html',
  cleanupOutdatedCaches: true,
  clientsClaim: true,
  skipWaiting: true,
};