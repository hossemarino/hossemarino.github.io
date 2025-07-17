// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (
  modules,
  entry,
  mainEntry,
  parcelRequireName,
  externals,
  distDir,
  publicUrl,
  devServer
) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var importMap = previousRequire.i || {};
  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        if (externals[name]) {
          return externals[name];
        }
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        globalObject
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.require = nodeRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.distDir = distDir;
  newRequire.publicUrl = publicUrl;
  newRequire.devServer = devServer;
  newRequire.i = importMap;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  // Only insert newRequire.load when it is actually used.
  // The code in this file is linted against ES5, so dynamic import is not allowed.
  // INSERT_LOAD_HERE

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });
    }
  }
})({"3Gpdp":[function(require,module,exports,__globalThis) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SERVER_PORT = 1234;
var HMR_SECURE = false;
var HMR_ENV_HASH = "439701173a9199ea";
var HMR_USE_SSE = false;
module.bundle.HMR_BUNDLE_ID = "542ee87b287c6406";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_SERVER_PORT, HMR_ENV_HASH, HMR_SECURE, HMR_USE_SSE, chrome, browser, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_SERVER_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var HMR_USE_SSE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets /*: {|[string]: boolean|} */ , disposedAssets /*: {|[string]: boolean|} */ , assetsToDispose /*: Array<[ParcelRequire, string]> */ , assetsToAccept /*: Array<[ParcelRequire, string]> */ , bundleNotFound = false;
function getHostname() {
    return HMR_HOST || (typeof location !== 'undefined' && location.protocol.indexOf('http') === 0 ? location.hostname : 'localhost');
}
function getPort() {
    return HMR_PORT || (typeof location !== 'undefined' ? location.port : HMR_SERVER_PORT);
}
// eslint-disable-next-line no-redeclare
let WebSocket = globalThis.WebSocket;
if (!WebSocket && typeof module.bundle.root === 'function') try {
    // eslint-disable-next-line no-global-assign
    WebSocket = module.bundle.root('ws');
} catch  {
// ignore.
}
var hostname = getHostname();
var port = getPort();
var protocol = HMR_SECURE || typeof location !== 'undefined' && location.protocol === 'https:' && ![
    'localhost',
    '127.0.0.1',
    '0.0.0.0'
].includes(hostname) ? 'wss' : 'ws';
// eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if (!parent || !parent.isParcelRequire) {
    // Web extension context
    var extCtx = typeof browser === 'undefined' ? typeof chrome === 'undefined' ? null : chrome : browser;
    // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes('test.js');
    }
    var ws;
    if (HMR_USE_SSE) ws = new EventSource('/__parcel_hmr');
    else try {
        // If we're running in the dev server's node runner, listen for messages on the parent port.
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) {
            parentPort.on('message', async (message)=>{
                try {
                    await handleMessage(message);
                    parentPort.postMessage('updated');
                } catch  {
                    parentPort.postMessage('restart');
                }
            });
            // After the bundle has finished running, notify the dev server that the HMR update is complete.
            queueMicrotask(()=>parentPort.postMessage('ready'));
        }
    } catch  {
        if (typeof WebSocket !== 'undefined') try {
            ws = new WebSocket(protocol + '://' + hostname + (port ? ':' + port : '') + '/');
        } catch (err) {
            // Ignore cloudflare workers error.
            if (err.message && !err.message.includes('Disallowed operation called within global scope')) console.error(err.message);
        }
    }
    if (ws) {
        // $FlowFixMe
        ws.onmessage = async function(event /*: {data: string, ...} */ ) {
            var data /*: HMRMessage */  = JSON.parse(event.data);
            await handleMessage(data);
        };
        if (ws instanceof WebSocket) {
            ws.onerror = function(e) {
                if (e.message) console.error(e.message);
            };
            ws.onclose = function() {
                console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
            };
        }
    }
}
async function handleMessage(data /*: HMRMessage */ ) {
    checkedAssets = {} /*: {|[string]: boolean|} */ ;
    disposedAssets = {} /*: {|[string]: boolean|} */ ;
    assetsToAccept = [];
    assetsToDispose = [];
    bundleNotFound = false;
    if (data.type === 'reload') fullReload();
    else if (data.type === 'update') {
        // Remove error overlay if there is one
        if (typeof document !== 'undefined') removeErrorOverlay();
        let assets = data.assets;
        // Handle HMR Update
        let handled = assets.every((asset)=>{
            return asset.type === 'css' || asset.type === 'js' && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
        });
        // Dispatch a custom event in case a bundle was not found. This might mean
        // an asset on the server changed and we should reload the page. This event
        // gives the client an opportunity to refresh without losing state
        // (e.g. via React Server Components). If e.preventDefault() is not called,
        // we will trigger a full page reload.
        if (handled && bundleNotFound && assets.some((a)=>a.envHash !== HMR_ENV_HASH) && typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') handled = !window.dispatchEvent(new CustomEvent('parcelhmrreload', {
            cancelable: true
        }));
        if (handled) {
            console.clear();
            // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
            if (typeof window !== 'undefined' && typeof CustomEvent !== 'undefined') window.dispatchEvent(new CustomEvent('parcelhmraccept'));
            await hmrApplyUpdates(assets);
            hmrDisposeQueue();
            // Run accept callbacks. This will also re-execute other disposed assets in topological order.
            let processedAssets = {};
            for(let i = 0; i < assetsToAccept.length; i++){
                let id = assetsToAccept[i][1];
                if (!processedAssets[id]) {
                    hmrAccept(assetsToAccept[i][0], id);
                    processedAssets[id] = true;
                }
            }
        } else fullReload();
    }
    if (data.type === 'error') {
        // Log parcel errors to console
        for (let ansiDiagnostic of data.diagnostics.ansi){
            let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
            console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + '\n' + stack + '\n\n' + ansiDiagnostic.hints.join('\n'));
        }
        if (typeof document !== 'undefined') {
            // Render the fancy html overlay
            removeErrorOverlay();
            var overlay = createErrorOverlay(data.diagnostics.html);
            // $FlowFixMe
            document.body.appendChild(overlay);
        }
    }
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] \u2728 Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement('div');
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="${protocol === 'wss' ? 'https' : 'http'}://${hostname}:${port}/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, '') : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          \u{1F6A8} ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + '</div>').join('')}
        </div>
        ${diagnostic.documentation ? `<div>\u{1F4DD} <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ''}
      </div>
    `;
    }
    errorHTML += '</div>';
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if (typeof location !== 'undefined' && 'reload' in location) location.reload();
    else if (typeof extCtx !== 'undefined' && extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
    else try {
        let { workerData, parentPort } = module.bundle.root('node:worker_threads') /*: any*/ ;
        if (workerData !== null && workerData !== void 0 && workerData.__parcel) parentPort.postMessage('restart');
    } catch (err) {
        console.error("[parcel] \u26A0\uFE0F An HMR update was not accepted. Please restart the process.");
    }
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var href = link.getAttribute('href');
    if (!href) return;
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute('href', // $FlowFixMe
    href.split('?')[0] + '?' + Date.now());
    // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout || typeof document === 'undefined') return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href /*: string */  = links[i].getAttribute('href');
            var hostname = getHostname();
            var servedFromHMRServer = hostname === 'localhost' ? new RegExp('^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):' + getPort()).test(href) : href.indexOf(hostname + ':' + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === 'js') {
        if (typeof document !== 'undefined') {
            let script = document.createElement('script');
            script.src = asset.url + '?t=' + Date.now();
            if (asset.outputFormat === 'esmodule') script.type = 'module';
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === 'function') {
            // Worker scripts
            if (asset.outputFormat === 'esmodule') return import(asset.url + '?t=' + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + '?t=' + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension fix
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3 && typeof ServiceWorkerGlobalScope != 'undefined' && global instanceof ServiceWorkerGlobalScope) {
                        extCtx.runtime.reload();
                        return;
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle /*: ParcelRequire */ , asset /*:  HMRAsset */ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === 'css') reloadCSS();
    else if (asset.type === 'js') {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
            // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        }
        // Always traverse to the parent bundle, even if we already replaced the asset in this bundle.
        // This is required in case modules are duplicated. We need to ensure all instances have the updated code.
        if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        }
        // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id];
        // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    checkedAssets = {};
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
    // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else if (a !== null) {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle /*: ParcelRequire */ , id /*: string */ , depsByBundle /*: ?{ [string]: { [string]: string } }*/ ) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) {
            bundleNotFound = true;
            return true;
        }
        return hmrAcceptCheckOne(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return null;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    if (!cached) return true;
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
    return false;
}
function hmrDisposeQueue() {
    // Dispose all old assets.
    for(let i = 0; i < assetsToDispose.length; i++){
        let id = assetsToDispose[i][1];
        if (!disposedAssets[id]) {
            hmrDispose(assetsToDispose[i][0], id);
            disposedAssets[id] = true;
        }
    }
    assetsToDispose = [];
}
function hmrDispose(bundle /*: ParcelRequire */ , id /*: string */ ) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle /*: ParcelRequire */ , id /*: string */ ) {
    // Execute the module.
    bundle(id);
    // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
        let assetsToAlsoAccept = [];
        cached.hot._acceptCallbacks.forEach(function(cb) {
            let additionalAssets = cb(function() {
                return getParents(module.bundle.root, id);
            });
            if (Array.isArray(additionalAssets) && additionalAssets.length) assetsToAlsoAccept.push(...additionalAssets);
        });
        if (assetsToAlsoAccept.length) {
            let handled = assetsToAlsoAccept.every(function(a) {
                return hmrAcceptCheck(a[0], a[1]);
            });
            if (!handled) return fullReload();
            hmrDisposeQueue();
        }
    }
}

},{}],"3Zc1l":[function(require,module,exports,__globalThis) {
var parcelHelpers = require("@parcel/transformer-js/src/esmodule-helpers.js");
parcelHelpers.defineInteropFlag(exports);
// editor selection
parcelHelpers.export(exports, "getInputOrLine", ()=>getInputOrLine);
parcelHelpers.export(exports, "setCursorAfterLine", ()=>setCursorAfterLine);
// download files
parcelHelpers.export(exports, "sanitizeFilename", ()=>sanitizeFilename);
// folding for custom XML tags
parcelHelpers.export(exports, "customTagRangeFinder", ()=>customTagRangeFinder);
//Save/load export functions
parcelHelpers.export(exports, "saveEditorContent", ()=>saveEditorContent);
parcelHelpers.export(exports, "manualSaveEditorContent", ()=>manualSaveEditorContent);
parcelHelpers.export(exports, "loadEditorContent", ()=>loadEditorContent);
// TABs
parcelHelpers.export(exports, "addTab", ()=>addTab);
parcelHelpers.export(exports, "requestTabDeletion", ()=>requestTabDeletion);
parcelHelpers.export(exports, "truncateLabel", ()=>truncateLabel);
parcelHelpers.export(exports, "confirmTabCreation", ()=>confirmTabCreation);
//FORMATTING STUFF:
parcelHelpers.export(exports, "wrapSelection", ()=>wrapSelection);
parcelHelpers.export(exports, "toTitleCase", ()=>toTitleCase);
// CONTROL ELEMENTS
// termination
parcelHelpers.export(exports, "addTerm", ()=>addTerm);
// quota tag
parcelHelpers.export(exports, "addQuota", ()=>addQuota);
// validate tag
parcelHelpers.export(exports, "validateTag", ()=>validateTag);
// validate tag
parcelHelpers.export(exports, "execTag", ()=>execTag);
// res
parcelHelpers.export(exports, "makeRes", ()=>makeRes);
// block tag
parcelHelpers.export(exports, "wrapInBlock", ()=>wrapInBlock);
// block tag randomizeChildren
parcelHelpers.export(exports, "wrapInBlockRandomize", ()=>wrapInBlockRandomize);
// LOOP tag
parcelHelpers.export(exports, "addLoopBlock", ()=>addLoopBlock);
// make looprows
parcelHelpers.export(exports, "makeLooprows", ()=>makeLooprows);
// make markers
parcelHelpers.export(exports, "makeMarker", ()=>makeMarker);
// make markers
parcelHelpers.export(exports, "makeCondition", ()=>makeCondition);
// export functionS FOR ROWS
parcelHelpers.export(exports, "makeRows", ()=>makeRows);
parcelHelpers.export(exports, "makeRowsLow", ()=>makeRowsLow);
parcelHelpers.export(exports, "makeRowsHigh", ()=>makeRowsHigh);
// export functionS FOR COLUMNS
parcelHelpers.export(exports, "makeCols", ()=>makeCols);
parcelHelpers.export(exports, "makeColsLow", ()=>makeColsLow);
parcelHelpers.export(exports, "makeColsHigh", ()=>makeColsHigh);
// export functionS FOR CHOICES
parcelHelpers.export(exports, "makeChoices", ()=>makeChoices);
parcelHelpers.export(exports, "makeChoicesLow", ()=>makeChoicesLow);
parcelHelpers.export(exports, "makeChoicesHigh", ()=>makeChoicesHigh);
// NOANSWER
parcelHelpers.export(exports, "makeNoAnswer", ()=>makeNoAnswer);
// GROUPS
parcelHelpers.export(exports, "makeGroups", ()=>makeGroups);
// QUESTION COMMENT
parcelHelpers.export(exports, "addCommentQuestion", ()=>addCommentQuestion);
// CASES for pipe
parcelHelpers.export(exports, "makeCase", ()=>makeCase);
// Autofill rows for pipe
parcelHelpers.export(exports, "makeAutoFillRows", ()=>makeAutoFillRows);
//miscelaneous
//add 2 break lines
parcelHelpers.export(exports, "brbr", ()=>brbr);
//add break line
parcelHelpers.export(exports, "br", ()=>br);
//add open end
parcelHelpers.export(exports, "addOpen", ()=>addOpen);
//add exclusive
parcelHelpers.export(exports, "addExclusive", ()=>addExclusive);
//add aggregate
parcelHelpers.export(exports, "addAggregate", ()=>addAggregate);
//add randomize="0"
parcelHelpers.export(exports, "addRandomize0", ()=>addRandomize0);
//add optional
parcelHelpers.export(exports, "addOptional", ()=>addOptional);
//add shuffle rows
parcelHelpers.export(exports, "addShuffleRows", ()=>addShuffleRows);
//add shuffle cols
parcelHelpers.export(exports, "addShuffleCols", ()=>addShuffleCols);
//add shuffle rows and cols
parcelHelpers.export(exports, "addShuffleRowsCols", ()=>addShuffleRowsCols);
//add where="execute"
parcelHelpers.export(exports, "addExecute", ()=>addExecute);
//add Add Grouping/Adim Cols
parcelHelpers.export(exports, "addGroupingCols", ()=>addGroupingCols);
//add Add Grouping/Adim Rows
parcelHelpers.export(exports, "addGroupingRows", ()=>addGroupingRows);
//add class names
//add Add rowclassnames
parcelHelpers.export(exports, "addRowClassNames", ()=>addRowClassNames);
//add Add colclassnames
parcelHelpers.export(exports, "addColClassNames", ()=>addColClassNames);
//add Add choiceclassnames
parcelHelpers.export(exports, "addChoiceClassNames", ()=>addChoiceClassNames);
// add groups
parcelHelpers.export(exports, "addGroups", ()=>addGroups);
// add values
parcelHelpers.export(exports, "addValues", ()=>addValues);
// add values L-H
parcelHelpers.export(exports, "addValuesLow", ()=>addValuesLow);
// add values H-L
parcelHelpers.export(exports, "addValuesHigh", ()=>addValuesHigh);
// swap rows and cols and vice versa
parcelHelpers.export(exports, "swapRowCol", ()=>swapRowCol);
// add altlabel
parcelHelpers.export(exports, "addAltlabel", ()=>addAltlabel);
// add ratinDirection
parcelHelpers.export(exports, "addRatingDirection", ()=>addRatingDirection);
// make link href
parcelHelpers.export(exports, "makeHref", ()=>makeHref);
//make lis
parcelHelpers.export(exports, "lis", ()=>lis);
// make ordered list (<ol>)
parcelHelpers.export(exports, "makeOl", ()=>makeOl);
// make unordered list (<ul>)
parcelHelpers.export(exports, "makeUl", ()=>makeUl);
// pre texts
parcelHelpers.export(exports, "addPreText", ()=>addPreText);
parcelHelpers.export(exports, "addPreTextInternal", ()=>addPreTextInternal);
parcelHelpers.export(exports, "makePreTextResInternal", ()=>makePreTextResInternal);
// post text
parcelHelpers.export(exports, "addPostText", ()=>addPostText);
parcelHelpers.export(exports, "addPostTextInternal", ()=>addPostTextInternal);
parcelHelpers.export(exports, "makePostTextResInternal", ()=>makePostTextResInternal);
// add contact q
parcelHelpers.export(exports, "addContactQuestion", ()=>addContactQuestion);
parcelHelpers.export(exports, "addContactQuestionIHUT", ()=>addContactQuestionIHUT);
var _state = require("@codemirror/state");
function getInputOrLine(view) {
    const { state } = view;
    const selection = state.selection.main;
    const selectedText = state.doc.slice(selection.from, selection.to).toString().trim();
    if (selectedText) return selectedText;
    const cursorLine = state.doc.lineAt(selection.from);
    return cursorLine.text.trim();
}
function setCursorAfterLine(l) {
    editor = getActiveEditor();
    editor.setCursor({
        line: l,
        ch: 0
    });
}
function sanitizeFilename(name) {
    return name.replace(/[^a-z0-9_\-\.]/gi, "_") // keep letters, numbers, underscores, hyphens, dots
    .replace(/_+/g, "_") // collapse multiple underscores
    .replace(/^_+|_+$/g, "") // trim leading/trailing underscores
    .substring(0, 100); // limit length if needed
}
function customTagRangeFinder(cm, start) {
    const lineText = cm.getLine(start.line);
    const openTagMatch = lineText.match(/<([a-zA-Z0-9_-]+)(\s[^>]*)?>/);
    if (!openTagMatch) return null;
    const tagName = openTagMatch[1];
    const excludedTags = [
        "survey",
        "note"
    ];
    if (excludedTags.includes(tagName.toLowerCase())) return null;
    const startCh = lineText.indexOf("<" + tagName);
    const startPos = CodeMirror.Pos(start.line, startCh);
    let depth = 1;
    const maxLine = cm.lastLine();
    for(let i = start.line + 1; i <= maxLine; i++){
        const text = cm.getLine(i);
        const selfClosing = new RegExp(`<${tagName}[^>]*?/>`, "g");
        const openTags = (text.match(new RegExp(`<${tagName}(\\s[^>]*)?>`, "g")) || []).length;
        const closeTags = (text.match(new RegExp(`</${tagName}>`, "g")) || []).length;
        const selfClosingCount = (text.match(selfClosing) || []).length;
        depth += openTags - closeTags - selfClosingCount;
        if (depth === 0) {
            const endCh = cm.getLine(i).indexOf(`</${tagName}>`) + `</${tagName}>`.length;
            return {
                from: startPos,
                to: CodeMirror.Pos(i, endCh)
            };
        }
    }
    return null;
}
function saveEditorContent() {
    if (activeTab && tabs[activeTab]?.editor) {
        const content = tabs[activeTab].editor.getValue();
        localStorage.setItem(`editorTab_${activeTab}`, content);
    }
}
function manualSaveEditorContent() {
    saveEditorContent(); // Save all tabs
    // Show notification
    const notification = document.getElementById("saveNotification");
    notification.style.display = "block";
    setTimeout(()=>{
        notification.style.display = "none";
    }, 3500);
}
function loadEditorContent(tabName) {
    const savedContent = localStorage.getItem(`editorTab_${tabName}`);
    if (savedContent && tabs[tabName]?.editor) tabs[tabName].editor.setValue(savedContent);
}
function addTab() {
    openModal("tab");
}
let tabPendingDeletion = null;
function requestTabDeletion(tabName) {
    tabPendingDeletion = tabName;
    openModal("delete-tab", tabName); // Show confirmation modal
}
function truncateLabel(label, max = 12) {
    return label.length > max ? label.slice(0, max) + "\u2026" : label;
}
function confirmTabCreation() {
    const tabNameInput = document.getElementById("tab_name");
    const errorDisplay = document.getElementById("tabError");
    const tabName = tabNameInput.value.trim();
    errorDisplay.textContent = "";
    errorDisplay.style.display = "none";
    if (!tabName) {
        errorDisplay.textContent = "Tab name cannot be empty.";
        errorDisplay.style.display = "block";
        return;
    }
    if (tabs[tabName]) {
        errorDisplay.textContent = "A tab with this name already exists.";
        errorDisplay.style.display = "block";
        return;
    }
    createTab(tabName);
    tabNameInput.value = "";
    bootstrap.Modal.getInstance(document.getElementById("surveyModal")).hide();
}
function wrapSelection(view, tag) {
    const { state } = view;
    const selection = state.selection.main;
    if (selection.empty) {
        console.warn("No selection made.");
        return false;
    }
    const selectedText = state.doc.slice(selection.from, selection.to).toString();
    const alreadyWrapped = new RegExp(`^<${tag}>.*</${tag}>$`).test(selectedText);
    if (alreadyWrapped) {
        console.warn(`Selection already wrapped in <${tag}>`);
        return false;
    }
    const wrappedText = `<${tag}>${selectedText}</${tag}>`;
    const transaction = state.update({
        changes: {
            from: selection.from,
            to: selection.to,
            insert: wrappedText
        },
        selection: (0, _state.EditorSelection).range(selection.from + `<${tag}>`.length, selection.from + wrappedText.length - `</${tag}>`.length),
        scrollIntoView: true
    });
    view.dispatch(transaction);
    return true;
}
function toTitleCase(str) {
    const acronyms = [
        "us",
        "uk",
        "eu",
        "xml",
        "id",
        "qa",
        "br",
        "brbr",
        "li",
        "ol",
        "ul",
        "css",
        "js",
        "ihut"
    ];
    const lowercases = [
        "res"
    ];
    return str.toLowerCase().split(/(\s|-)/) // keep spaces and hyphens
    .map((part)=>{
        if (acronyms.includes(part)) return part.toUpperCase();
        if (lowercases.includes(part)) return part;
        return /^[a-z]/.test(part) ? part.charAt(0).toUpperCase() + part.slice(1) : part;
    }).join("");
}
function addTerm() {
    const selectedText = getInputOrLine();
    const html = `<term label="term_" cond="${selectedText.trim()}"></term>`;
    window.editor.replaceSelection(html);
}
function addQuota() {
    const selectedText = getInputOrLine();
    const html = `<quota label="quota_${selectedText.trim()}" sheet="${selectedText.trim()}" overquota="noqual"/>`;
    window.editor.replaceSelection(html);
}
function validateTag() {
    const selectedText = getInputOrLine();
    const html = `  <validate>
${selectedText.trim()}

  </validate>`;
    window.editor.replaceSelection(html);
}
function execTag() {
    const selectedText = getInputOrLine();
    const html = `  <exec>
${selectedText.trim()}

  </exec>`;
    window.editor.replaceSelection(html);
}
function makeRes() {
    const editor1 = window.editor;
    const selectedText = getInputOrLine();
    try {
        if (!selectedText.trim()) {
            alert("No text selected!");
            return;
        }
        let input = selectedText;
        input = input.replace(/\t+/g, " ");
        input = input.replace(/\n +\n/g, "\n\n");
        input = input.replace(/\n{2,}/g, "\n");
        const lines = input.trim().split("\n").map((line)=>line.replace(/^[a-zA-Z0-9]{1,2}[.:)]\s+/, "").trim());
        const result = lines.filter(Boolean).map((line)=>`<res label="">${line}</res>`).join("\n");
        editor1.replaceSelection(result); // ✅ Output applied here
    } catch (err) {
        console.error("makeRes() failed:", err);
        alert("Could not process RES tags.");
    }
}
function wrapInBlock() {
    try {
        const editor1 = window.editor;
        const input = getInputOrLine().trim();
        if (!input) {
            alert("No content selected.");
            return;
        }
        const xml = `<block label="" cond="1">
${input}
</block>`;
        editor1.replaceSelection(xml);
    } catch (err) {
        console.error("wrapInBlock() failed:", err);
        alert("Could not wrap content in <block>.");
    }
}
function wrapInBlockRandomize() {
    try {
        const editor1 = window.editor;
        const input = getInputOrLine().trim();
        if (!input) {
            alert("No content selected.");
            return;
        }
        const xml = `<block label="" cond="1" randomizeChildren="1">
${input}
</block>`;
        editor1.replaceSelection(xml);
    } catch (err) {
        console.error("wrapInBlock() failed:", err);
        alert("Could not wrap content in <block>.");
    }
}
function addLoopBlock() {
    try {
        const editor1 = window.editor;
        const selection = getInputOrLine().trim();
        if (!selection) {
            alert("No content selected.");
            return;
        }
        const tagPattern = /(radio|checkbox|text|textarea|block|number|float|select|html)/;
        // Extract existing <looprow> elements
        const looprowRegex = /<looprow[\s\S]*?<\/looprow>/gi;
        const matchedLoopRows = selection.match(looprowRegex) || [];
        const loopRows = matchedLoopRows.map((row)=>`  ${row.trim()}\n`).join("\n");
        const mainBlock = selection.replace(looprowRegex, "").trim();
        // Extract all loopvar names
        const loopVarNames = [];
        const varMatchRegex = /<loopvar\s+name="([^"]+)"/gi;
        let match;
        while(match = varMatchRegex.exec(loopRows)){
            const varName = match[1].trim();
            if (varName && !loopVarNames.includes(varName)) loopVarNames.push(varName);
        }
        const varsAttr = loopVarNames.join(", ");
        const hasAltLabel = mainBlock.includes("altlabel");
        const updated = hasAltLabel ? mainBlock.replace(new RegExp(`<${tagPattern.source}([\\s\\S]*?)label="([^"]+)"([\\s\\S]*?)altlabel="([^"]+)"`, "g"), (_match, tag, pre, label, between, alt)=>`<${tag}${pre}label="${label.trim()}_[loopvar: label]"${between}altlabel="${alt.trim()}_[loopvar:label]"`) : mainBlock.replace(new RegExp(`<${tagPattern.source}([\\s\\S]*?)label="([^"]+)"`, "g"), (_match, tag, pre, label)=>`<${tag}${pre}label="${label.trim()}_[loopvar: label]"`);
        const wrapped = `<loop label="" vars="${varsAttr}" title=" " suspend="0">
  <block label="">

${updated}

  </block>

${loopRows || `  <looprow label="" cond="">
    <loopvar name=""></loopvar>
  </looprow>`}

</loop>`;
        editor1.replaceSelection(wrapped);
    } catch (err) {
        console.error("addLoopBlock() failed:", err);
        alert("Could not process loop template.");
    }
}
function makeLooprows() {
    try {
        const editor1 = window.editor;
        const rawInput = getInputOrLine().trim();
        if (!rawInput) {
            alert("No content selected.");
            return;
        }
        // Clean tabs and normalize spacing
        let cleaned = rawInput.replace(/\t+/g, " ").replace(/\n +\n/g, "\n\n").replace(/\n{2,}/g, "\n").trim().split("\n").map((line)=>line.replace(/^[a-zA-Z0-9]{1,2}[.:)\s]+\s*/, "").trim()).filter((line)=>line.length > 0);
        const result = cleaned.map((line, i)=>`  <looprow label="${i + 1}">\n    <loopvar name="var">${line}</loopvar>\n  </looprow>`).join("\n");
        editor1.replaceSelection(result);
    } catch (err) {
        console.error("makeLooprows() failed:", err);
        alert("Could not generate looprow XML.");
    }
}
function makeMarker() {
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }
    let lines = selectedText.split("\n").map((line)=>line.trim()).filter((line)=>line);
    let xmlItems1 = lines.map((line, index)=>`<marker name="${line}" cond=""/>`).join("\n");
    window.editor.replaceSelection(xmlItems1);
}
function makeCondition() {
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }
    let lines = selectedText.split("\n").map((line)=>line.trim()).filter((line)=>line);
    let xmlItems1 = lines.map((line, index)=>`<condition label="" cond="">${line}</condition >`).join("\n");
    window.editor.replaceSelection(xmlItems1);
}
function makeRows() {
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }
    let lines = selectedText.split("\n").map((line)=>line.trim()).filter((line)=>line);
    let xmlItems1 = lines.map((line, index)=>`  <row label="r${index + 1}">${line}</row>`).join("\n");
    window.editor.replaceSelection(xmlItems1);
}
function makeRowsLow() {
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }
    let lines = selectedText.split("\n").map((line)=>line.trim()).filter((line)=>line);
    let xmlItems1 = lines.map((line, index)=>`  <row label="r${index + 1}" value="${index + 1}">${line}</row>`).join("\n");
    window.editor.replaceSelection(xmlItems1);
}
function makeRowsHigh() {
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }
    let lines = selectedText.split("\n").map((line)=>line.trim()).filter((line)=>line);
    let length = lines.length;
    let xmlItems1 = lines.map((line, index)=>`  <row label="r${length - index}" value="${length - index}">${line}</row>`).join("\n");
    window.editor.replaceSelection(xmlItems1);
}
function makeCols() {
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }
    let lines = selectedText.split("\n").map((line)=>line.trim()).filter((line)=>line);
    let xmlItems1 = lines.map((line, index)=>`  <col label="c${index + 1}">${line}</col>`).join("\n");
    window.editor.replaceSelection(xmlItems1);
}
function makeColsLow() {
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }
    let lines = selectedText.split("\n").map((line)=>line.trim()).filter((line)=>line);
    let xmlItems1 = lines.map((line, index)=>`  <col label="c${index + 1}" value="${index + 1}">${line}</col>`).join("\n");
    window.editor.replaceSelection(xmlItems1);
}
function makeColsHigh() {
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }
    let lines = selectedText.split("\n").map((line)=>line.trim()).filter((line)=>line);
    let length = lines.length;
    let xmlItems1 = lines.map((line, index)=>`  <col label="c${length - index}" value="${length - index}">${line}</col>`).join("\n");
    window.editor.replaceSelection(xmlItems1);
}
function makeChoices() {
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }
    let lines = selectedText.split("\n").map((line)=>line.trim()).filter((line)=>line);
    let xmlItems1 = lines.map((line, index)=>`  <choice label="ch${index + 1}">${line}</choice>`).join("\n");
    window.editor.replaceSelection(xmlItems1);
}
function makeChoicesLow() {
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }
    let lines = selectedText.split("\n").map((line)=>line.trim()).filter((line)=>line);
    let xmlItems1 = lines.map((line, index)=>`  <choice label="ch${index + 1}" value="${index + 1}">${line}</choice>`).join("\n");
    window.editor.replaceSelection(xmlItems1);
}
function makeChoicesHigh() {
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }
    let lines = selectedText.split("\n").map((line)=>line.trim()).filter((line)=>line);
    let length = lines.length;
    let xmlItems1 = lines.map((line, index)=>`  <choice label="ch${length - index}" value="${length - index}">${line}</choice>`).join("\n");
    window.editor.replaceSelection(xmlItems1);
}
function makeNoAnswer() {
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }
    let lines = selectedText.split("\n").map((line)=>line.trim()).filter((line)=>line);
    let xmlItems1 = lines.map((line, index)=>`  <noanswer label="n${index + 1}">${line}</noanswer>`).join("\n");
    window.editor.replaceSelection(xmlItems1);
}
function makeGroups() {
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }
    let lines = selectedText.split("\n").map((line)=>line.trim()).filter((line)=>line);
    let xmlItems1 = lines.map((line, index)=>`  <group label="g${index + 1}">${line}</group>`).join("\n");
    window.editor.replaceSelection(xmlItems1);
}
function addCommentQuestion() {
    let selection = getInputOrLine();
    if (selection) {
        let xmlItems1 = `  <comment>${selection}</comment>`;
        window.editor.replaceSelection(xmlItems1);
    } else {
        alert("No text selected!");
        return "";
    }
}
function makeCase() {
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }
    let lines = selectedText.split("\n").map((line)=>line.trim()).filter((line)=>line);
    let xmlItems1 = "";
    lines.forEach((line, index)=>{
        xmlItems1 += `  <case label="c${index + 1}" cond="">${line}</case>\n`;
    });
    xmlItems1 += `  <case label="cn" cond="1">DEFAULT</case>\n`;
    window.editor.replaceSelection(xmlItems1);
}
function makeAutoFillRows() {
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }
    let lines = selectedText.split("\n").map((line)=>line.trim()).filter((line)=>line);
    let xmlItems1 = "";
    lines.forEach((line, index)=>{
        xmlItems1 += `  <row label="r${index + 1}" autofill="">${line}</row>\n`;
    });
    xmlItems1 += `  <row label="none" autofill="thisQuestion.count == 0"><i>None of These Classifications Apply</i></row>\n`;
    window.editor.replaceSelection(xmlItems1);
}
function brbr() {
    xmlItems = `<br/><br/>`;
    window.editor.replaceSelection(xmlItems);
}
function br() {
    xmlItems = `<br/>`;
    window.editor.replaceSelection(xmlItems);
}
function addOpen() {
    xmlItems = ` open="1" openSize="25" randomize="0"`;
    window.editor.replaceSelection(xmlItems);
}
function addExclusive() {
    xmlItems = ` exclusive="1" randomize="0"`;
    window.editor.replaceSelection(xmlItems);
}
function addAggregate() {
    xmlItems = ` aggregate="0" percentages="0"`;
    window.editor.replaceSelection(xmlItems);
}
function addRandomize0() {
    xmlItems = ` randomize="0"`;
    window.editor.replaceSelection(xmlItems);
}
function addOptional() {
    xmlItems = ` optional="1"`;
    window.editor.replaceSelection(xmlItems);
}
function addShuffleRows() {
    xmlItems = ` shuffle="rows"`;
    window.editor.replaceSelection(xmlItems);
}
function addShuffleCols() {
    xmlItems = ` shuffle="cols"`;
    window.editor.replaceSelection(xmlItems);
}
function addShuffleRowsCols() {
    xmlItems = ` shuffle="rows,cols"`;
    window.editor.replaceSelection(xmlItems);
}
function addExecute() {
    xmlItems = ` where="execute"`;
    window.editor.replaceSelection(xmlItems);
}
function addGroupingCols() {
    xmlItems = ` grouping="cols" adim="cols"`;
    window.editor.replaceSelection(xmlItems);
}
function addGroupingRows() {
    xmlItems = ` grouping="rows" adim="rows"`;
    window.editor.replaceSelection(xmlItems);
}
function addRowClassNames() {
    xmlItems = ` ss:rowClassNames=""`;
    window.editor.replaceSelection(xmlItems);
}
function addColClassNames() {
    xmlItems = ` ss:colClassNames=""`;
    window.editor.replaceSelection(xmlItems);
}
function addChoiceClassNames() {
    xmlItems = ` ss:choiceClassNames=""`;
    window.editor.replaceSelection(xmlItems);
}
function addGroups() {
    try {
        const editor1 = window.editor;
        const selectedText = getInputOrLine();
        if (!selectedText.trim()) {
            alert("Please select one or more lines to apply groups=\"\".");
            return;
        }
        const targetTags = [
            "group",
            "col",
            "row",
            "choice"
        ];
        let changesMade = false;
        const modifiedText = selectedText.replace(/<(\w+)([^>]*?)>/g, (full, tagName, attrs)=>{
            if (targetTags.includes(tagName) && !/groups\s*=/.test(attrs)) {
                changesMade = true;
                return `<${tagName}${attrs} groups="">`;
            }
            return full;
        });
        if (!changesMade) {
            alert('No <group>, <choice>, <col>, or <row> tags missing groups="" found.');
            return;
        }
        editor1.replaceSelection(modifiedText);
    } catch (err) {
        console.error("addGroups() failed:", err);
        alert("Something went wrong while adding groups=\"\" attributes.");
    }
}
function addValues() {
    const editor1 = window.editor;
    const selected = getInputOrLine();
    const targetTags = [
        "row",
        "col",
        "choice"
    ];
    let changed = false;
    const updated = selected.replace(/<(\w+)([^>]*?)>/g, (full, tag, attrs)=>{
        if (targetTags.includes(tag) && !/value\s*=/.test(attrs)) {
            changed = true;
            return `<${tag}${attrs} value="">`;
        }
        return full;
    });
    if (changed) editor1.replaceSelection(updated);
    else alert('No missing value="" attributes found on <row>, <col>, or <choice>.');
}
function addValuesLow() {
    const editor1 = window.editor;
    const selected = getInputOrLine();
    const targetTags = [
        "row",
        "col",
        "choice"
    ];
    let count = 1;
    const updated = selected.replace(/<(\w+)([^>]*?)>/g, (full, tag, attrs)=>{
        if (targetTags.includes(tag)) {
            const cleaned = attrs.replace(/\svalue=".*?"/, ""); // Remove existing value
            return `<${tag}${cleaned} value="${count++}">`;
        }
        return full;
    });
    editor1.replaceSelection(updated);
}
function addValuesHigh() {
    const editor1 = window.editor;
    const selected = getInputOrLine();
    const targetTags = [
        "row",
        "col",
        "choice"
    ];
    let matches = [
        ...selected.matchAll(/<(\w+)([^>]*?)>/g)
    ];
    let total = matches.filter(([_, tag])=>targetTags.includes(tag)).length;
    let count = total;
    const updated = selected.replace(/<(\w+)([^>]*?)>/g, (full, tag, attrs)=>{
        if (targetTags.includes(tag)) {
            const cleaned = attrs.replace(/\svalue=".*?"/, "");
            return `<${tag}${cleaned} value="${count--}">`;
        }
        return full;
    });
    editor1.replaceSelection(updated);
}
function swapRowCol() {
    try {
        const editor1 = window.editor;
        const selected = getInputOrLine();
        if (!selected.trim()) {
            alert("Please select some <row> or <col> tags to swap.");
            return;
        }
        const lines = selected.split("\n");
        const updated = lines.map((line)=>{
            let modifiedLine = line;
            if (/<row/.test(line)) modifiedLine = modifiedLine.replace(/(<|\/)row/g, "$1col").replace(/label=(["'])r(\d)/g, 'label=$1c$2');
            else if (/<col/.test(line)) modifiedLine = modifiedLine.replace(/(<|\/)col/g, "$1row").replace(/label=(["'])c(\d)/g, 'label=$1r$2');
            return modifiedLine;
        });
        const result = updated.join("\n");
        editor1.replaceSelection(result);
    } catch (err) {
        console.error("swapRowCol() failed:", err);
        alert("Something went wrong during row/col swapping.");
    }
}
function addAltlabel() {
    const selectedText = getInputOrLine();
    const cleaned = selectedText.trim().replace(/\s+/g, "_");
    const html = ` altlabel="${cleaned}"`;
    window.editor.replaceSelection(html);
}
function addRatingDirection() {
    const selectedText = getInputOrLine();
    const html = ` ratingDirection="reverse"`;
    window.editor.replaceSelection(html);
}
function makeHref() {
    try {
        const editor1 = window.editor;
        const input = getInputOrLine().trim();
        if (!input) {
            alert("Please select or enter a URL.");
            return;
        }
        const href = `<a href="${input}" target="_blank">${input}</a>`;
        editor1.replaceSelection(href);
    } catch (err) {
        console.error("makeHref() failed:", err);
        alert("Something went wrong while generating the hyperlink.");
    }
}
function lis() {
    let selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }
    let lines = selectedText.split("\n").map((line)=>line.trim()).filter((line)=>line);
    let xmlItems1 = "";
    lines.forEach((line)=>{
        xmlItems1 += `  <li>${line}</li>\n`;
    });
    window.editor.replaceSelection(xmlItems1);
}
function makeOl() {
    const selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }
    try {
        let input = selectedText.trim();
        // Remove blank lines
        input = input.replace(/\n\n+/g, "\n");
        // Check if there is at least one <li>
        if (!input.includes("<li")) {
            alert("<ol> tag requires at least one <li> element.");
            return;
        }
        const output = `<ol>\n  ${input}\n</ol>\n`;
        window.editor.replaceSelection(output);
        return output;
    } catch (error) {
        console.error("makeOl clip failed:", error);
        alert("An error occurred while generating the <ol> tag.");
        return "";
    }
}
function makeUl() {
    const selectedText = getInputOrLine();
    if (!selectedText.trim()) {
        alert("No text selected!");
        return;
    }
    try {
        let input = selectedText.trim();
        // Remove blank lines
        input = input.replace(/\n\n+/g, "\n");
        // Check if there is at least one <li>
        if (!input.includes("<li")) {
            alert("<ul> tag requires at least one <li> element.");
            return;
        }
        const output = `<ul>\n  ${input}\n</ul>\n`;
        window.editor.replaceSelection(output);
        return output;
    } catch (error) {
        console.error("makeUl clip failed:", error);
        alert("An error occurred while generating the <ul> tag.");
        return "";
    }
}
function addPreText() {
    const selectedText = getInputOrLine();
    const xmlContent = ` ss:preText="\${res.$ {
            selectedText.trim()
        }
}"`;
    window.editor.replaceSelection(xmlContent);
}
function addPreTextInternal() {
    const selectedText = getInputOrLine();
    const xmlContent = ` ss:preText="\${res['%s,preText' % this.label]}"`;
    window.editor.replaceSelection(xmlContent);
}
function makePreTextResInternal() {
    const selectedText = getInputOrLine();
    const xmlContent = `<res label="preText">${selectedText.trim()}</res>`;
    window.editor.replaceSelection(xmlContent);
}
function addPostText() {
    const selectedText = getInputOrLine();
    const xmlContent = ` ss:postText="\${res.$ {
            selectedText.trim()
        }
}"`;
    window.editor.replaceSelection(xmlContent);
}
function addPostTextInternal() {
    const selectedText = getInputOrLine();
    const xmlContent = ` ss:postText="\${res['%s,postText' % this.label]}"`;
    window.editor.replaceSelection(xmlContent);
}
function makePostTextResInternal() {
    const selectedText = getInputOrLine();
    const xmlContent = `<res label="postText">${selectedText.trim()}</res>`;
    window.editor.replaceSelection(xmlContent);
}
function addContactQuestion() {
    const xmlContent = CONTACT_QUESTION;
    window.editor.replaceSelection(xmlContent);
}
function addContactQuestionIHUT() {
    const xmlContent = CONTACT_QUESTION_IHUT;
    window.editor.replaceSelection(xmlContent);
}

},{"@codemirror/state":"axaOu","@parcel/transformer-js/src/esmodule-helpers.js":"jnFvT"}]},["3Gpdp","3Zc1l"], "3Zc1l", "parcelRequire8bb2", {})

//# sourceMappingURL=survey3.287c6406.js.map
