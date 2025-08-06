const CACHE_NAME = "survey-cache-v1";
const urlsToCache = [
    "/survey2.html",

    // External CSS
    "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css",
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.9/codemirror.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.9/theme/monokai.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.9/theme/dracula.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.9/theme/material.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.9/theme/eclipse.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.9/theme/ambiance.min.css",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.9/theme/3024-night.min.css",

    // External JS
    "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.9/codemirror.min.js",
    "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.9/mode/xml/xml.min.js",

    // Local CodeMirror JS
    "./scripts/CodeMirror/foldcode.js",
    "./scripts/CodeMirror/foldgutter.js",
    "./scripts/CodeMirror/xml-fold.js",
    "./scripts/CodeMirror/search.js",
    "./scripts/CodeMirror/searchcursor.js",
    "./scripts/CodeMirror/dialog.js",
    "./scripts/CodeMirror/matchtags.js",
    "./scripts/CodeMirror/closetag.js",
    "./scripts/CodeMirror/closebrackets.js",
    "./scripts/CodeMirror/matchbrackets.js",
    "./scripts/CodeMirror/xml-hint.js",
    "./scripts/CodeMirror/show-hint.js",
    "./scripts/CodeMirror/vkbeautify.js",

    // Local CodeMirror CSS
    "./scripts/CodeMirror/show-hint.css",

    // Local Styles
    "./styles/dialog.css",
    "./styles/styles.css",
    "./styles/bootstrap-theme.css",
    "./styles/foldgutter.css",

    // Local JS
    "./scripts/vars.js",
    "./scripts/tabs.js",
    "./scripts/scripts.js",
    "./scripts/modals.js",
    "./scripts/functions.js",
    "./scripts/standards.js",
    "./scripts/styles.js",
    "./scripts/questionfunctions.js",
    "./scripts/formatting.js",

    // Manifest and icons
    "./manifest.json",
    "./static/icon-192.png",
    "./static/icon-512.png"
];

// Install and cache
self.addEventListener("install", event => {
    self.skipWaiting(); // Activate immediately
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            return cache.addAll(urlsToCache);
        }));
});

// Activate and take control
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                }))));
    self.clients.claim();
});

// Fetch and update
self.addEventListener("fetch", event => {
    event.respondWith(
        fetch(event.request)
        .then(response => {
            // Clone and store in cache
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
                cache.put(event.request, responseClone);
            });
            return response;
        })
        .catch(() => {
            // Fallback to cache if offline
            return caches.match(event.request);
        }));
});
