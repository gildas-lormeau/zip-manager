try{self["workbox:core:6.5.3"]&&_()}catch{}const O=(n,...e)=>{let t=n;return e.length>0&&(t+=` :: ${JSON.stringify(e)}`),t},D=O;class l extends Error{constructor(e,t){const s=D(e,t);super(s),this.name=e,this.details=t}}const F=new Set,f={googleAnalytics:"googleAnalytics",precache:"precache-v2",prefix:"workbox",runtime:"runtime",suffix:typeof registration<"u"?registration.scope:""},E=n=>[f.prefix,n,f.suffix].filter(e=>e&&e.length>0).join("-"),H=n=>{for(const e of Object.keys(f))n(e)},d={updateDetails:n=>{H(e=>{typeof n[e]=="string"&&(f[e]=n[e])})},getGoogleAnalyticsName:n=>n||E(f.googleAnalytics),getPrecacheName:n=>n||E(f.precache),getPrefix:()=>f.prefix,getRuntimeName:n=>n||E(f.runtime),getSuffix:()=>f.suffix};function N(n,e){const t=new URL(n);for(const s of e)t.searchParams.delete(s);return t.href}async function v(n,e,t,s){const a=N(e.url,t);if(e.url===a)return n.match(e,s);const c=Object.assign(Object.assign({},s),{ignoreSearch:!0}),r=await n.keys(e,c);for(const i of r){const o=N(i.url,t);if(a===o)return n.match(i,s)}}let y;function W(){if(y===void 0){const n=new Response("");if("body"in n)try{new Response(n.body),y=!0}catch{y=!1}y=!1}return y}class q{constructor(){this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}}async function j(){for(const n of F)await n()}const G=n=>new URL(String(n),location.href).href.replace(new RegExp(`^${location.origin}`),"");function B(n){return new Promise(e=>setTimeout(e,n))}function I(n,e){const t=e();return n.waitUntil(t),t}const X={get googleAnalytics(){return d.getGoogleAnalyticsName()},get precache(){return d.getPrecacheName()},get prefix(){return d.getPrefix()},get runtime(){return d.getRuntimeName()},get suffix(){return d.getSuffix()}};async function $(n,e){let t=null;if(n.url&&(t=new URL(n.url).origin),t!==self.location.origin)throw new l("cross-origin-copy-response",{origin:t});const s=n.clone(),a={headers:new Headers(s.headers),status:s.status,statusText:s.statusText},c=e?e(a):a,r=W()?s.body:await s.blob();return new Response(r,c)}function z(){self.addEventListener("activate",()=>self.clients.claim())}try{self["workbox:precaching:6.5.3"]&&_()}catch{}const V="__WB_REVISION__";function Q(n){if(!n)throw new l("add-to-cache-list-unexpected-type",{entry:n});if(typeof n=="string"){const c=new URL(n,location.href);return{cacheKey:c.href,url:c.href}}const{revision:e,url:t}=n;if(!t)throw new l("add-to-cache-list-unexpected-type",{entry:n});if(!e){const c=new URL(t,location.href);return{cacheKey:c.href,url:c.href}}const s=new URL(t,location.href),a=new URL(t,location.href);return s.searchParams.set(V,e),{cacheKey:s.href,url:a.href}}class Y{constructor(){this.updatedURLs=[],this.notUpdatedURLs=[],this.handlerWillStart=async({request:e,state:t})=>{t&&(t.originalRequest=e)},this.cachedResponseWillBeUsed=async({event:e,state:t,cachedResponse:s})=>{if(e.type==="install"&&t&&t.originalRequest&&t.originalRequest instanceof Request){const a=t.originalRequest.url;s?this.notUpdatedURLs.push(a):this.updatedURLs.push(a)}return s}}}class J{constructor({precacheController:e}){this.cacheKeyWillBeUsed=async({request:t,params:s})=>{const a=(s==null?void 0:s.cacheKey)||this._precacheController.getCacheKeyForURL(t.url);return a?new Request(a,{headers:t.headers}):t},this._precacheController=e}}try{self["workbox:strategies:6.5.3"]&&_()}catch{}function m(n){return typeof n=="string"?new Request(n):n}class Z{constructor(e,t){this._cacheKeys={},Object.assign(this,t),this.event=t.event,this._strategy=e,this._handlerDeferred=new q,this._extendLifetimePromises=[],this._plugins=[...e.plugins],this._pluginStateMap=new Map;for(const s of this._plugins)this._pluginStateMap.set(s,{});this.event.waitUntil(this._handlerDeferred.promise)}async fetch(e){const{event:t}=this;let s=m(e);if(s.mode==="navigate"&&t instanceof FetchEvent&&t.preloadResponse){const r=await t.preloadResponse;if(r)return r}const a=this.hasCallback("fetchDidFail")?s.clone():null;try{for(const r of this.iterateCallbacks("requestWillFetch"))s=await r({request:s.clone(),event:t})}catch(r){if(r instanceof Error)throw new l("plugin-error-request-will-fetch",{thrownErrorMessage:r.message})}const c=s.clone();try{let r;r=await fetch(s,s.mode==="navigate"?void 0:this._strategy.fetchOptions);for(const i of this.iterateCallbacks("fetchDidSucceed"))r=await i({event:t,request:c,response:r});return r}catch(r){throw a&&await this.runCallbacks("fetchDidFail",{error:r,event:t,originalRequest:a.clone(),request:c.clone()}),r}}async fetchAndCachePut(e){const t=await this.fetch(e),s=t.clone();return this.waitUntil(this.cachePut(e,s)),t}async cacheMatch(e){const t=m(e);let s;const{cacheName:a,matchOptions:c}=this._strategy,r=await this.getCacheKey(t,"read"),i=Object.assign(Object.assign({},c),{cacheName:a});s=await caches.match(r,i);for(const o of this.iterateCallbacks("cachedResponseWillBeUsed"))s=await o({cacheName:a,matchOptions:c,cachedResponse:s,request:r,event:this.event})||void 0;return s}async cachePut(e,t){const s=m(e);await B(0);const a=await this.getCacheKey(s,"write");if(!t)throw new l("cache-put-with-no-response",{url:G(a.url)});const c=await this._ensureResponseSafeToCache(t);if(!c)return!1;const{cacheName:r,matchOptions:i}=this._strategy,o=await self.caches.open(r),h=this.hasCallback("cacheDidUpdate"),g=h?await v(o,a.clone(),["__WB_REVISION__"],i):null;try{await o.put(a,h?c.clone():c)}catch(u){if(u instanceof Error)throw u.name==="QuotaExceededError"&&await j(),u}for(const u of this.iterateCallbacks("cacheDidUpdate"))await u({cacheName:r,oldResponse:g,newResponse:c.clone(),request:a,event:this.event});return!0}async getCacheKey(e,t){const s=`${e.url} | ${t}`;if(!this._cacheKeys[s]){let a=e;for(const c of this.iterateCallbacks("cacheKeyWillBeUsed"))a=m(await c({mode:t,request:a,event:this.event,params:this.params}));this._cacheKeys[s]=a}return this._cacheKeys[s]}hasCallback(e){for(const t of this._strategy.plugins)if(e in t)return!0;return!1}async runCallbacks(e,t){for(const s of this.iterateCallbacks(e))await s(t)}*iterateCallbacks(e){for(const t of this._strategy.plugins)if(typeof t[e]=="function"){const s=this._pluginStateMap.get(t);yield c=>{const r=Object.assign(Object.assign({},c),{state:s});return t[e](r)}}}waitUntil(e){return this._extendLifetimePromises.push(e),e}async doneWaiting(){let e;for(;e=this._extendLifetimePromises.shift();)await e}destroy(){this._handlerDeferred.resolve(null)}async _ensureResponseSafeToCache(e){let t=e,s=!1;for(const a of this.iterateCallbacks("cacheWillUpdate"))if(t=await a({request:this.request,response:t,event:this.event})||void 0,s=!0,!t)break;return s||t&&t.status!==200&&(t=void 0),t}}class ee{constructor(e={}){this.cacheName=d.getRuntimeName(e.cacheName),this.plugins=e.plugins||[],this.fetchOptions=e.fetchOptions,this.matchOptions=e.matchOptions}handle(e){const[t]=this.handleAll(e);return t}handleAll(e){e instanceof FetchEvent&&(e={event:e,request:e.request});const t=e.event,s=typeof e.request=="string"?new Request(e.request):e.request,a="params"in e?e.params:void 0,c=new Z(this,{event:t,request:s,params:a}),r=this._getResponse(c,s,t),i=this._awaitComplete(r,c,s,t);return[r,i]}async _getResponse(e,t,s){await e.runCallbacks("handlerWillStart",{event:s,request:t});let a;try{if(a=await this._handle(t,e),!a||a.type==="error")throw new l("no-response",{url:t.url})}catch(c){if(c instanceof Error){for(const r of e.iterateCallbacks("handlerDidError"))if(a=await r({error:c,event:s,request:t}),a)break}if(!a)throw c}for(const c of e.iterateCallbacks("handlerWillRespond"))a=await c({event:s,request:t,response:a});return a}async _awaitComplete(e,t,s,a){let c,r;try{c=await e}catch{}try{await t.runCallbacks("handlerDidRespond",{event:a,request:s,response:c}),await t.doneWaiting()}catch(i){i instanceof Error&&(r=i)}if(await t.runCallbacks("handlerDidComplete",{event:a,request:s,response:c,error:r}),t.destroy(),r)throw r}}class p extends ee{constructor(e={}){e.cacheName=d.getPrecacheName(e.cacheName),super(e),this._fallbackToNetwork=e.fallbackToNetwork!==!1,this.plugins.push(p.copyRedirectedCacheableResponsesPlugin)}async _handle(e,t){const s=await t.cacheMatch(e);return s||(t.event&&t.event.type==="install"?await this._handleInstall(e,t):await this._handleFetch(e,t))}async _handleFetch(e,t){let s;const a=t.params||{};if(this._fallbackToNetwork){const c=a.integrity,r=e.integrity,i=!r||r===c;s=await t.fetch(new Request(e,{integrity:e.mode!=="no-cors"?r||c:void 0})),c&&i&&e.mode!=="no-cors"&&(this._useDefaultCacheabilityPluginIfNeeded(),await t.cachePut(e,s.clone()))}else throw new l("missing-precache-entry",{cacheName:this.cacheName,url:e.url});return s}async _handleInstall(e,t){this._useDefaultCacheabilityPluginIfNeeded();const s=await t.fetch(e);if(!await t.cachePut(e,s.clone()))throw new l("bad-precaching-response",{url:e.url,status:s.status});return s}_useDefaultCacheabilityPluginIfNeeded(){let e=null,t=0;for(const[s,a]of this.plugins.entries())a!==p.copyRedirectedCacheableResponsesPlugin&&(a===p.defaultPrecacheCacheabilityPlugin&&(e=s),a.cacheWillUpdate&&t++);t===0?this.plugins.push(p.defaultPrecacheCacheabilityPlugin):t>1&&e!==null&&this.plugins.splice(e,1)}}p.defaultPrecacheCacheabilityPlugin={async cacheWillUpdate({response:n}){return!n||n.status>=400?null:n}};p.copyRedirectedCacheableResponsesPlugin={async cacheWillUpdate({response:n}){return n.redirected?await $(n):n}};class te{constructor({cacheName:e,plugins:t=[],fallbackToNetwork:s=!0}={}){this._urlsToCacheKeys=new Map,this._urlsToCacheModes=new Map,this._cacheKeysToIntegrities=new Map,this._strategy=new p({cacheName:d.getPrecacheName(e),plugins:[...t,new J({precacheController:this})],fallbackToNetwork:s}),this.install=this.install.bind(this),this.activate=this.activate.bind(this)}get strategy(){return this._strategy}precache(e){this.addToCacheList(e),this._installAndActiveListenersAdded||(self.addEventListener("install",this.install),self.addEventListener("activate",this.activate),this._installAndActiveListenersAdded=!0)}addToCacheList(e){const t=[];for(const s of e){typeof s=="string"?t.push(s):s&&s.revision===void 0&&t.push(s.url);const{cacheKey:a,url:c}=Q(s),r=typeof s!="string"&&s.revision?"reload":"default";if(this._urlsToCacheKeys.has(c)&&this._urlsToCacheKeys.get(c)!==a)throw new l("add-to-cache-list-conflicting-entries",{firstEntry:this._urlsToCacheKeys.get(c),secondEntry:a});if(typeof s!="string"&&s.integrity){if(this._cacheKeysToIntegrities.has(a)&&this._cacheKeysToIntegrities.get(a)!==s.integrity)throw new l("add-to-cache-list-conflicting-integrities",{url:c});this._cacheKeysToIntegrities.set(a,s.integrity)}if(this._urlsToCacheKeys.set(c,a),this._urlsToCacheModes.set(c,r),t.length>0){const i=`Workbox is precaching URLs without revision info: ${t.join(", ")}
This is generally NOT safe. Learn more at https://bit.ly/wb-precache`;console.warn(i)}}}install(e){return I(e,async()=>{const t=new Y;this.strategy.plugins.push(t);for(const[c,r]of this._urlsToCacheKeys){const i=this._cacheKeysToIntegrities.get(r),o=this._urlsToCacheModes.get(c),h=new Request(c,{integrity:i,cache:o,credentials:"same-origin"});await Promise.all(this.strategy.handleAll({params:{cacheKey:r},request:h,event:e}))}const{updatedURLs:s,notUpdatedURLs:a}=t;return{updatedURLs:s,notUpdatedURLs:a}})}activate(e){return I(e,async()=>{const t=await self.caches.open(this.strategy.cacheName),s=await t.keys(),a=new Set(this._urlsToCacheKeys.values()),c=[];for(const r of s)a.has(r.url)||(await t.delete(r),c.push(r.url));return{deletedURLs:c}})}getURLsToCacheKeys(){return this._urlsToCacheKeys}getCachedURLs(){return[...this._urlsToCacheKeys.keys()]}getCacheKeyForURL(e){const t=new URL(e,location.href);return this._urlsToCacheKeys.get(t.href)}getIntegrityForCacheKey(e){return this._cacheKeysToIntegrities.get(e)}async matchPrecache(e){const t=e instanceof Request?e.url:e,s=this.getCacheKeyForURL(t);if(s)return(await self.caches.open(this.strategy.cacheName)).match(s)}createHandlerBoundToURL(e){const t=this.getCacheKeyForURL(e);if(!t)throw new l("non-precached-url",{url:e});return s=>(s.request=new Request(e),s.params=Object.assign({cacheKey:t},s.params),this.strategy.handle(s))}}let T;const P=()=>(T||(T=new te),T);try{self["workbox:routing:6.5.3"]&&_()}catch{}const k="GET",C=n=>n&&typeof n=="object"?n:{handle:n};class R{constructor(e,t,s=k){this.handler=C(t),this.match=e,this.method=s}setCatchHandler(e){this.catchHandler=C(e)}}class se extends R{constructor(e,t,s){const a=({url:c})=>{const r=e.exec(c.href);if(r&&!(c.origin!==location.origin&&r.index!==0))return r.slice(1)};super(a,t,s)}}class ne{constructor(){this._routes=new Map,this._defaultHandlerMap=new Map}get routes(){return this._routes}addFetchListener(){self.addEventListener("fetch",e=>{const{request:t}=e,s=this.handleRequest({request:t,event:e});s&&e.respondWith(s)})}addCacheListener(){self.addEventListener("message",e=>{if(e.data&&e.data.type==="CACHE_URLS"){const{payload:t}=e.data,s=Promise.all(t.urlsToCache.map(a=>{typeof a=="string"&&(a=[a]);const c=new Request(...a);return this.handleRequest({request:c,event:e})}));e.waitUntil(s),e.ports&&e.ports[0]&&s.then(()=>e.ports[0].postMessage(!0))}})}handleRequest({request:e,event:t}){const s=new URL(e.url,location.href);if(!s.protocol.startsWith("http"))return;const a=s.origin===location.origin,{params:c,route:r}=this.findMatchingRoute({event:t,request:e,sameOrigin:a,url:s});let i=r&&r.handler;const o=e.method;if(!i&&this._defaultHandlerMap.has(o)&&(i=this._defaultHandlerMap.get(o)),!i)return;let h;try{h=i.handle({url:s,request:e,event:t,params:c})}catch(u){h=Promise.reject(u)}const g=r&&r.catchHandler;return h instanceof Promise&&(this._catchHandler||g)&&(h=h.catch(async u=>{if(g)try{return await g.handle({url:s,request:e,event:t,params:c})}catch(L){L instanceof Error&&(u=L)}if(this._catchHandler)return this._catchHandler.handle({url:s,request:e,event:t});throw u})),h}findMatchingRoute({url:e,sameOrigin:t,request:s,event:a}){const c=this._routes.get(s.method)||[];for(const r of c){let i;const o=r.match({url:e,sameOrigin:t,request:s,event:a});if(o)return i=o,(Array.isArray(i)&&i.length===0||o.constructor===Object&&Object.keys(o).length===0||typeof o=="boolean")&&(i=void 0),{route:r,params:i}}return{}}setDefaultHandler(e,t=k){this._defaultHandlerMap.set(t,C(e))}setCatchHandler(e){this._catchHandler=C(e)}registerRoute(e){this._routes.has(e.method)||this._routes.set(e.method,[]),this._routes.get(e.method).push(e)}unregisterRoute(e){if(!this._routes.has(e.method))throw new l("unregister-route-but-not-found-with-method",{method:e.method});const t=this._routes.get(e.method).indexOf(e);if(t>-1)this._routes.get(e.method).splice(t,1);else throw new l("unregister-route-route-not-registered")}}let w;const ae=()=>(w||(w=new ne,w.addFetchListener(),w.addCacheListener()),w);function b(n,e,t){let s;if(typeof n=="string"){const c=new URL(n,location.href),r=({url:i})=>i.href===c.href;s=new R(r,e,t)}else if(n instanceof RegExp)s=new se(n,e,t);else if(typeof n=="function")s=new R(n,e,t);else if(n instanceof R)s=n;else throw new l("unsupported-route-type",{moduleName:"workbox-routing",funcName:"registerRoute",paramName:"capture"});return ae().registerRoute(s),s}function ce(n,e=[]){for(const t of[...n.searchParams.keys()])e.some(s=>s.test(t))&&n.searchParams.delete(t);return n}function*re(n,{ignoreURLParametersMatching:e=[/^utm_/,/^fbclid$/],directoryIndex:t="index.html",cleanURLs:s=!0,urlManipulation:a}={}){const c=new URL(n,location.href);c.hash="",yield c.href;const r=ce(c,e);if(yield r.href,t&&r.pathname.endsWith("/")){const i=new URL(r.href);i.pathname+=t,yield i.href}if(s){const i=new URL(r.href);i.pathname+=".html",yield i.href}if(a){const i=a({url:c});for(const o of i)yield o.href}}class ie extends R{constructor(e,t){const s=({request:a})=>{const c=e.getURLsToCacheKeys();for(const r of re(a.url,t)){const i=c.get(r);if(i){const o=e.getIntegrityForCacheKey(i);return{cacheKey:i,integrity:o}}}};super(s,e.strategy)}}function oe(n){const e=P(),t=new ie(e,n);b(t)}const le="-precache-",he=async(n,e=le)=>{const s=(await self.caches.keys()).filter(a=>a.includes(e)&&a.includes(self.registration.scope)&&a!==n);return await Promise.all(s.map(a=>self.caches.delete(a))),s};function ue(){self.addEventListener("activate",n=>{const e=d.getPrecacheName();n.waitUntil(he(e).then(t=>{}))})}function fe(n){return P().getCacheKeyForURL(n)}function de(n){P().precache(n)}function pe(n,e){de(n),oe(e)}const K=".",ge="/index.html",ye=K+ge,we="?shared-files",Re=ye+we,A="/shared-files",S=K+A,U=A+"/form",x="shared-files",me="audio/midi",_e="audio/xm",Ce="audio/prs.sid",be="music-track-",Ee=new RegExp(be+".*"),Te=/\d+$/,Ue="./assets/music/tracks.zip",Pe=".mid",Le=".xm",Ne=".sid",Ie=[{extension:Pe,type:me},{extension:Le,type:_e},{extension:Ne,type:Ce}],M="GET",ke="POST";importScripts("./assets/lib/zip-no-worker-inflate.min.js");ue();pe([{"revision":"477ccac35da8ef40fcc6aadb536326c5","url":"assets/fonts/dos-vga-9x16.ttf"},{"revision":"f03a8145bcdb7d42591edf438d009e9c","url":"assets/fonts/Exo-VariableFont_wght.ttf"},{"revision":"98ad0558f8d53bf2e20f4ce1a9a0a55c","url":"assets/icons/icon-192x192-mono.png"},{"revision":"bf17ade91c7f634ef921b7828aea012b","url":"assets/icons/icon-192x192.png"},{"revision":"fa4fcb83b66b7d6f7e39d22a453811b0","url":"assets/icons/icon-512x512-mono.png"},{"revision":"00cbe2ae543ecbf085af04d8820231e6","url":"assets/icons/icon-512x512.png"},{"revision":null,"url":"assets/index-31070a76.js"},{"revision":null,"url":"assets/index-fa1bd7f1.css"},{"revision":"959124f0507b4befbf3ce926640f608f","url":"assets/lib/libxm.wasm"},{"revision":"17965540adf9786f568c6510612ecdf8","url":"assets/lib/zip-no-worker-inflate.min.js"},{"revision":"c495605e898fd45455683cc71abff40e","url":"assets/music/tracks.zip"},{"revision":"3e76e40d16d498573c9fde269e0a5c53","url":"apple-touch-icon-120x120.png"},{"revision":"36214ecbb8e9c0a5458e25a3f45825b7","url":"apple-touch-icon.png"},{"revision":"7b73e896ae23da88f3fe219e766dfd81","url":"favicon.ico"},{"revision":"062531577bf35f5c210054705c6c7e12","url":"index.html"},{"revision":"69dcfbbaa5a363614c4fcd8d93c1211f","url":"manifest.json"},{"revision":"402b66900e731ca748771b6fc5e7a068","url":"registerSW.js"},{"revision":"7dd2dbaf2e7129ebad5b36364a56274d","url":"sw.js"},{"revision":"7b3ea18cdacd5b2bceda561ebbf21133","url":"manifest.webmanifest"}]);self.skipWaiting();b(S,Ae,M);b(S,Ke,ke);b(Ee,xe,M);z();async function Ke({event:n}){const e=await n.request.formData();return await(await caches.open(x)).put(new URL(U,self.location).href,new Response(e)),Response.redirect(Re,303)}function Ae({event:n}){n.respondWith(Se())}async function Se(){const n=await caches.open(x),e=await n.match(U);if(e)return await n.delete(U),e}async function xe({event:n}){const t=await(await caches.open(X.precache)).match(fe(Ue)),s=new zip.ZipReader(t.body),a=await s.getEntries(),c=Number(n.request.url.match(Te)[0]),r=a[c],i=Ie.find(h=>r.filename.endsWith(h.extension)).type,o=await r.getData(new zip.BlobWriter(i));return await s.close(),new Response(o)}
