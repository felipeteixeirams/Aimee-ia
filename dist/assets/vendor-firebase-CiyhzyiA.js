import{o as tm,R as nl}from"./vendor-core-kxyyGiPE.js";/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uw=()=>{};var Jd={};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nm=function(n){const e=[];let t=0;for(let r=0;r<n.length;r++){let s=n.charCodeAt(r);s<128?e[t++]=s:s<2048?(e[t++]=s>>6|192,e[t++]=s&63|128):(s&64512)===55296&&r+1<n.length&&(n.charCodeAt(r+1)&64512)===56320?(s=65536+((s&1023)<<10)+(n.charCodeAt(++r)&1023),e[t++]=s>>18|240,e[t++]=s>>12&63|128,e[t++]=s>>6&63|128,e[t++]=s&63|128):(e[t++]=s>>12|224,e[t++]=s>>6&63|128,e[t++]=s&63|128)}return e},lw=function(n){const e=[];let t=0,r=0;for(;t<n.length;){const s=n[t++];if(s<128)e[r++]=String.fromCharCode(s);else if(s>191&&s<224){const i=n[t++];e[r++]=String.fromCharCode((s&31)<<6|i&63)}else if(s>239&&s<365){const i=n[t++],o=n[t++],c=n[t++],u=((s&7)<<18|(i&63)<<12|(o&63)<<6|c&63)-65536;e[r++]=String.fromCharCode(55296+(u>>10)),e[r++]=String.fromCharCode(56320+(u&1023))}else{const i=n[t++],o=n[t++];e[r++]=String.fromCharCode((s&15)<<12|(i&63)<<6|o&63)}}return e.join("")},rm={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:typeof atob=="function",encodeByteArray(n,e){if(!Array.isArray(n))throw Error("encodeByteArray takes an array as a parameter");this.init_();const t=e?this.byteToCharMapWebSafe_:this.byteToCharMap_,r=[];for(let s=0;s<n.length;s+=3){const i=n[s],o=s+1<n.length,c=o?n[s+1]:0,u=s+2<n.length,l=u?n[s+2]:0,d=i>>2,p=(i&3)<<4|c>>4;let g=(c&15)<<2|l>>6,w=l&63;u||(w=64,o||(g=64)),r.push(t[d],t[p],t[g],t[w])}return r.join("")},encodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?btoa(n):this.encodeByteArray(nm(n),e)},decodeString(n,e){return this.HAS_NATIVE_SUPPORT&&!e?atob(n):lw(this.decodeStringToByteArray(n,e))},decodeStringToByteArray(n,e){this.init_();const t=e?this.charToByteMapWebSafe_:this.charToByteMap_,r=[];for(let s=0;s<n.length;){const i=t[n.charAt(s++)],c=s<n.length?t[n.charAt(s)]:0;++s;const l=s<n.length?t[n.charAt(s)]:64;++s;const p=s<n.length?t[n.charAt(s)]:64;if(++s,i==null||c==null||l==null||p==null)throw new hw;const g=i<<2|c>>4;if(r.push(g),l!==64){const w=c<<4&240|l>>2;if(r.push(w),p!==64){const S=l<<6&192|p;r.push(S)}}}return r},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let n=0;n<this.ENCODED_VALS.length;n++)this.byteToCharMap_[n]=this.ENCODED_VALS.charAt(n),this.charToByteMap_[this.byteToCharMap_[n]]=n,this.byteToCharMapWebSafe_[n]=this.ENCODED_VALS_WEBSAFE.charAt(n),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[n]]=n,n>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(n)]=n,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(n)]=n)}}};class hw extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}}const dw=function(n){const e=nm(n);return rm.encodeByteArray(e,!0)},ga=function(n){return dw(n).replace(/\./g,"")},sm=function(n){try{return rm.decodeString(n,!0)}catch(e){console.error("base64Decode failed: ",e)}return null};/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function im(){if(typeof self<"u")return self;if(typeof window<"u")return window;if(typeof global<"u")return global;throw new Error("Unable to locate global object.")}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const fw=()=>im().__FIREBASE_DEFAULTS__,pw=()=>{if(typeof process>"u"||typeof Jd>"u")return;const n=Jd.__FIREBASE_DEFAULTS__;if(n)return JSON.parse(n)},mw=()=>{if(typeof document>"u")return;let n;try{n=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch{return}const e=n&&sm(n[1]);return e&&JSON.parse(e)},Qa=()=>{try{return uw()||fw()||pw()||mw()}catch(n){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${n}`);return}},om=n=>{var e,t;return(t=(e=Qa())==null?void 0:e.emulatorHosts)==null?void 0:t[n]},gw=n=>{const e=om(n);if(!e)return;const t=e.lastIndexOf(":");if(t<=0||t+1===e.length)throw new Error(`Invalid host ${e} with no separate hostname and port!`);const r=parseInt(e.substring(t+1),10);return e[0]==="["?[e.substring(1,t-1),r]:[e.substring(0,t),r]},am=()=>{var n;return(n=Qa())==null?void 0:n.config},cm=n=>{var e;return(e=Qa())==null?void 0:e[`_${n}`]};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class um{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),typeof e=="function"&&(this.promise.catch(()=>{}),e.length===1?e(t):e(t,r))}}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _w(n,e){if(n.uid)throw new Error('The "uid" field is no longer supported by mockUserToken. Please use "sub" instead for Firebase Auth User ID.');const t={alg:"none",type:"JWT"},r=e||"demo-project",s=n.iat||0,i=n.sub||n.user_id;if(!i)throw new Error("mockUserToken must contain 'sub' or 'user_id' field!");const o={iss:`https://securetoken.google.com/${r}`,aud:r,iat:s,exp:s+3600,auth_time:s,sub:i,user_id:i,firebase:{sign_in_provider:"custom",identities:{}},...n};return[ga(JSON.stringify(t)),ga(JSON.stringify(o)),""].join(".")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ce(){return typeof navigator<"u"&&typeof navigator.userAgent=="string"?navigator.userAgent:""}function yw(){return typeof window<"u"&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(Ce())}function lm(){var e;const n=(e=Qa())==null?void 0:e.forceEnvironment;if(n==="node")return!0;if(n==="browser")return!1;try{return Object.prototype.toString.call(global.process)==="[object process]"}catch{return!1}}function Iw(){return typeof navigator<"u"&&navigator.userAgent==="Cloudflare-Workers"}function rl(){const n=typeof chrome=="object"?chrome.runtime:typeof browser=="object"?browser.runtime:void 0;return typeof n=="object"&&n.id!==void 0}function ww(){return typeof navigator=="object"&&navigator.product==="ReactNative"}function Tw(){const n=Ce();return n.indexOf("MSIE ")>=0||n.indexOf("Trident/")>=0}function hm(){return!lm()&&!!navigator.userAgent&&navigator.userAgent.includes("Safari")&&!navigator.userAgent.includes("Chrome")}function dm(){return!lm()&&!!navigator.userAgent&&(navigator.userAgent.includes("Safari")||navigator.userAgent.includes("WebKit"))&&!navigator.userAgent.includes("Chrome")}function Ja(){try{return typeof indexedDB=="object"}catch{return!1}}function sl(){return new Promise((n,e)=>{try{let t=!0;const r="validate-browser-context-for-indexeddb-analytics-module",s=self.indexedDB.open(r);s.onsuccess=()=>{s.result.close(),t||self.indexedDB.deleteDatabase(r),n(!0)},s.onupgradeneeded=()=>{t=!1},s.onerror=()=>{var i;e(((i=s.error)==null?void 0:i.message)||"")}}catch(t){e(t)}})}function fm(){return!(typeof navigator>"u"||!navigator.cookieEnabled)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ew="FirebaseError";class bt extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name=Ew,Object.setPrototypeOf(this,bt.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,Lr.prototype.create)}}class Lr{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){const r=t[0]||{},s=`${this.service}/${e}`,i=this.errors[e],o=i?vw(i,r):"Error",c=`${this.serviceName}: ${o} (${s}).`;return new bt(s,c,r)}}function vw(n,e){try{let t=0,r="";for(;t<n.length;){const s=n.indexOf("{$",t);if(s===-1){r+=n.substring(t);break}const i=n.indexOf("}",s+2);if(i===-1){r+=n.substring(t);break}const o=n.substring(s+2,i),c=e[o];r+=n.substring(t,s)+(c!=null?String(c):`<${o}?>`),t=i+1}return r}catch{return n}}function Aw(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}function _t(n,e){if(n===e)return!0;const t=Object.keys(n),r=Object.keys(e);for(const s of t){if(!r.includes(s))return!1;const i=n[s],o=e[s];if(Yd(i)&&Yd(o)){if(!_t(i,o))return!1}else if(i!==o)return!1}for(const s of r)if(!t.includes(s))return!1;return!0}function Yd(n){return n!==null&&typeof n=="object"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ao(n){const e=[];for(const[t,r]of Object.entries(n))Array.isArray(r)?r.forEach(s=>{e.push(encodeURIComponent(t)+"="+encodeURIComponent(s))}):e.push(encodeURIComponent(t)+"="+encodeURIComponent(r));return e.length?"&"+e.join("&"):""}function Ri(n){const e={};return n.replace(/^\?/,"").split("&").forEach(r=>{if(r){const[s,i]=r.split("=");e[decodeURIComponent(s)]=decodeURIComponent(i)}}),e}function Pi(n){const e=n.indexOf("?");if(!e)return"";const t=n.indexOf("#",e);return n.substring(e,t>0?t:void 0)}function Rw(n,e){const t=new Pw(n,e);return t.subscribe.bind(t)}class Pw{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(r=>{this.error(r)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let s;if(e===void 0&&t===void 0&&r===void 0)throw new Error("Missing Observer.");bw(e,["next","error","complete"])?s=e:s={next:e,error:t,complete:r},s.next===void 0&&(s.next=su),s.error===void 0&&(s.error=su),s.complete===void 0&&(s.complete=su);const i=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?s.error(this.finalError):s.complete()}catch{}}),this.observers.push(s),i}unsubscribeOne(e){this.observers===void 0||this.observers[e]===void 0||(delete this.observers[e],this.observerCount-=1,this.observerCount===0&&this.onNoObservers!==void 0&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(this.observers!==void 0&&this.observers[e]!==void 0)try{t(this.observers[e])}catch(r){typeof console<"u"&&console.error&&console.error(r)}})}close(e){this.finalized||(this.finalized=!0,e!==void 0&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}}function bw(n,e){if(typeof n!="object"||n===null)return!1;for(const t of e)if(t in n&&typeof n[t]=="function")return!0;return!1}function su(){}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Sw=1e3,Vw=2,Cw=14400*1e3,xw=.5;function Xd(n,e=Sw,t=Vw){const r=e*Math.pow(t,n),s=Math.round(xw*r*(Math.random()-.5)*2);return Math.min(Cw,r+s)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function re(n){return n&&n._delegate?n._delegate:n}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Fs(n){try{return(n.startsWith("http://")||n.startsWith("https://")?new URL(n).hostname:n).endsWith(".cloudworkstations.dev")}catch{return!1}}async function il(n){return(await fetch(n,{credentials:"include"})).ok}class Rt{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cr="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Nw{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){const t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){const r=new um;if(this.instancesDeferred.set(t,r),this.isInitialized(t)||this.shouldAutoInitialize())try{const s=this.getOrInitializeService({instanceIdentifier:t});s&&r.resolve(s)}catch{}}return this.instancesDeferred.get(t).promise}getImmediate(e){const t=this.normalizeInstanceIdentifier(e==null?void 0:e.identifier),r=(e==null?void 0:e.optional)??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(s){if(r)return null;throw s}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,!!this.shouldAutoInitialize()){if(kw(e))try{this.getOrInitializeService({instanceIdentifier:cr})}catch{}for(const[t,r]of this.instancesDeferred.entries()){const s=this.normalizeInstanceIdentifier(t);try{const i=this.getOrInitializeService({instanceIdentifier:s});r.resolve(i)}catch{}}}}clearInstance(e=cr){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){const e=Array.from(this.instances.values());await Promise.all([...e.filter(t=>"INTERNAL"in t).map(t=>t.INTERNAL.delete()),...e.filter(t=>"_delete"in t).map(t=>t._delete())])}isComponentSet(){return this.component!=null}isInitialized(e=cr){return this.instances.has(e)}getOptions(e=cr){return this.instancesOptions.get(e)||{}}initialize(e={}){const{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);const s=this.getOrInitializeService({instanceIdentifier:r,options:t});for(const[i,o]of this.instancesDeferred.entries()){const c=this.normalizeInstanceIdentifier(i);r===c&&o.resolve(s)}return s}onInit(e,t){const r=this.normalizeInstanceIdentifier(t),s=this.onInitCallbacks.get(r)??new Set;s.add(e),this.onInitCallbacks.set(r,s);const i=this.instances.get(r);return i&&e(i,r),()=>{s.delete(e)}}invokeOnInitCallbacks(e,t){const r=this.onInitCallbacks.get(t);if(r)for(const s of r)try{s(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:Dw(e),options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=cr){return this.component?this.component.multipleInstances?e:cr:e}shouldAutoInitialize(){return!!this.component&&this.component.instantiationMode!=="EXPLICIT"}}function Dw(n){return n===cr?void 0:n}function kw(n){return n.instantiationMode==="EAGER"}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ow{constructor(e){this.name=e,this.providers=new Map}addComponent(e){const t=this.getProvider(e.name);if(t.isComponentSet())throw new Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){this.getProvider(e.name).isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);const t=new Nw(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Z;(function(n){n[n.DEBUG=0]="DEBUG",n[n.VERBOSE=1]="VERBOSE",n[n.INFO=2]="INFO",n[n.WARN=3]="WARN",n[n.ERROR=4]="ERROR",n[n.SILENT=5]="SILENT"})(Z||(Z={}));const Lw={debug:Z.DEBUG,verbose:Z.VERBOSE,info:Z.INFO,warn:Z.WARN,error:Z.ERROR,silent:Z.SILENT},Mw=Z.INFO,Fw={[Z.DEBUG]:"log",[Z.VERBOSE]:"log",[Z.INFO]:"info",[Z.WARN]:"warn",[Z.ERROR]:"error"},Uw=(n,e,...t)=>{if(e<n.logLevel)return;const r=new Date().toISOString(),s=Fw[e];if(s)console[s](`[${r}]  ${n.name}:`,...t);else throw new Error(`Attempted to log a message with an invalid logType (value: ${e})`)};class Ya{constructor(e){this.name=e,this._logLevel=Mw,this._logHandler=Uw,this._userLogHandler=null}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in Z))throw new TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel=typeof e=="string"?Lw[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if(typeof e!="function")throw new TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,Z.DEBUG,...e),this._logHandler(this,Z.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,Z.VERBOSE,...e),this._logHandler(this,Z.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,Z.INFO,...e),this._logHandler(this,Z.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,Z.WARN,...e),this._logHandler(this,Z.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,Z.ERROR,...e),this._logHandler(this,Z.ERROR,...e)}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bw{constructor(e){this.container=e}getPlatformInfoString(){return this.container.getProviders().map(t=>{if(qw(t)){const r=t.getImmediate();return`${r.library}/${r.version}`}else return null}).filter(t=>t).join(" ")}}function qw(n){const e=n.getComponent();return(e==null?void 0:e.type)==="VERSION"}const Tu="@firebase/app",Zd="0.16.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nn=new Ya("@firebase/app"),$w="@firebase/app-compat",jw="@firebase/analytics-compat",zw="@firebase/analytics",Gw="@firebase/app-check-compat",Kw="@firebase/app-check",Ww="@firebase/auth",Hw="@firebase/auth-compat",Qw="@firebase/database",Jw="@firebase/data-connect",Yw="@firebase/database-compat",Xw="@firebase/functions",Zw="@firebase/functions-compat",eT="@firebase/installations",tT="@firebase/installations-compat",nT="@firebase/messaging",rT="@firebase/messaging-compat",sT="@firebase/performance",iT="@firebase/performance-compat",oT="@firebase/remote-config",aT="@firebase/remote-config-compat",cT="@firebase/storage",uT="@firebase/storage-compat",lT="@firebase/firestore",hT="@firebase/ai",dT="@firebase/firestore-compat",fT="firebase",pT="12.17.0";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _a="[DEFAULT]",mT={[Tu]:"fire-core",[$w]:"fire-core-compat",[zw]:"fire-analytics",[jw]:"fire-analytics-compat",[Kw]:"fire-app-check",[Gw]:"fire-app-check-compat",[Ww]:"fire-auth",[Hw]:"fire-auth-compat",[Qw]:"fire-rtdb",[Jw]:"fire-data-connect",[Yw]:"fire-rtdb-compat",[Xw]:"fire-fn",[Zw]:"fire-fn-compat",[eT]:"fire-iid",[tT]:"fire-iid-compat",[nT]:"fire-fcm",[rT]:"fire-fcm-compat",[sT]:"fire-perf",[iT]:"fire-perf-compat",[oT]:"fire-rc",[aT]:"fire-rc-compat",[cT]:"fire-gcs",[uT]:"fire-gcs-compat",[lT]:"fire-fst",[dT]:"fire-fst-compat",[hT]:"fire-vertex","fire-js":"fire-js",[fT]:"fire-js-all"};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ya=new Map,gT=new Map,Eu=new Map;function ef(n,e){try{n.container.addComponent(e)}catch(t){nn.debug(`Component ${e.name} failed to register with FirebaseApp ${n.name}`,t)}}function $t(n){const e=n.name;if(Eu.has(e))return nn.debug(`There were multiple attempts to register component ${e}.`),!1;Eu.set(e,n);for(const t of ya.values())ef(t,n);for(const t of gT.values())ef(t,n);return!0}function un(n,e){const t=n.container.getProvider("heartbeat").getImmediate({optional:!0});return t&&t.triggerHeartbeat(),n.container.getProvider(e)}function _T(n,e,t=_a){un(n,e).clearInstance(t)}function lt(n){return n==null?!1:n.settings!==void 0}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yT={"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."},Qt=new Lr("app","Firebase",yT);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IT{constructor(e,t,r){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Rt("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw Qt.create("app-deleted",{appName:this._name})}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Us=pT;function wT(n,e={}){let t=n;typeof e!="object"&&(e={name:e});const r={name:_a,automaticDataCollectionEnabled:!0,...e},s=r.name;if(typeof s!="string"||!s)throw Qt.create("bad-app-name",{appName:String(s)});if(t||(t=am()),!t)throw Qt.create("no-options");const i=ya.get(s);if(i)if(_t(t,i.options)){if(_t(r,i.config))return i;throw Qt.create("duplicate-app",{appName:s,mismatchedParam:"config",oldValue:JSON.stringify(i.config),newValue:JSON.stringify(r)})}else throw Qt.create("duplicate-app",{appName:s,mismatchedParam:"options",oldValue:JSON.stringify(i.options),newValue:JSON.stringify(t)});const o=new Ow(s);for(const u of Eu.values())o.addComponent(u);const c=new IT(t,r,o);return ya.set(s,c),c}function ol(n=_a){const e=ya.get(n);if(!e&&n===_a&&am())return wT();if(!e)throw Qt.create("no-app",{appName:n});return e}function gt(n,e,t){let r=mT[n]??n;t&&(r+=`-${t}`);const s=r.match(/\s|\//),i=e.match(/\s|\//);if(s||i){const o=[`Unable to register library "${r}" with version "${e}":`];s&&o.push(`library name "${r}" contains illegal characters (whitespace or "/")`),s&&i&&o.push("and"),i&&o.push(`version name "${e}" contains illegal characters (whitespace or "/")`),nn.warn(o.join(" "));return}$t(new Rt(`${r}-version`,()=>({library:r,version:e}),"VERSION"))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TT="firebase-heartbeat-database",ET=1,Gi="firebase-heartbeat-store";let iu=null;function pm(){return iu||(iu=tm(TT,ET,{upgrade:(n,e)=>{switch(e){case 0:try{n.createObjectStore(Gi)}catch(t){console.warn(t)}}}}).catch(n=>{throw Qt.create("idb-open",{originalErrorMessage:n.message})})),iu}async function vT(n){try{const t=(await pm()).transaction(Gi),r=await t.objectStore(Gi).get(mm(n));return await t.done,r}catch(e){if(e instanceof bt)nn.warn(e.message);else{const t=Qt.create("idb-get",{originalErrorMessage:e==null?void 0:e.message});nn.warn(t.message)}}}async function tf(n,e){try{const r=(await pm()).transaction(Gi,"readwrite");await r.objectStore(Gi).put(e,mm(n)),await r.done}catch(t){if(t instanceof bt)nn.warn(t.message);else{const r=Qt.create("idb-set",{originalErrorMessage:t==null?void 0:t.message});nn.warn(r.message)}}}function mm(n){return`${n.name}!${n.options.appId}`}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const AT=1024,RT=30;class PT{constructor(e){this.container=e,this._heartbeatsCache=null;const t=this.container.getProvider("app").getImmediate();this._storage=new ST(t),this._heartbeatsCachePromise=this._storage.read().then(r=>(this._heartbeatsCache=r,r))}async triggerHeartbeat(){var e,t;try{const s=this.container.getProvider("platform-logger").getImmediate().getPlatformInfoString(),i=nf();if(((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,((t=this._heartbeatsCache)==null?void 0:t.heartbeats)==null)||this._heartbeatsCache.lastSentHeartbeatDate===i||this._heartbeatsCache.heartbeats.some(o=>o.date===i))return;if(this._heartbeatsCache.heartbeats.push({date:i,agent:s}),this._heartbeatsCache.heartbeats.length>RT){const o=VT(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(o,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(r){nn.warn(r)}}async getHeartbeatsHeader(){var e;try{if(this._heartbeatsCache===null&&await this._heartbeatsCachePromise,((e=this._heartbeatsCache)==null?void 0:e.heartbeats)==null||this._heartbeatsCache.heartbeats.length===0)return"";const t=nf(),{heartbeatsToSend:r,unsentEntries:s}=bT(this._heartbeatsCache.heartbeats),i=ga(JSON.stringify({version:2,heartbeats:r}));return this._heartbeatsCache.lastSentHeartbeatDate=t,s.length>0?(this._heartbeatsCache.heartbeats=s,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(t){return nn.warn(t),""}}}function nf(){return new Date().toISOString().substring(0,10)}function bT(n,e=AT){const t=[];let r=n.slice();for(const s of n){const i=t.find(o=>o.agent===s.agent);if(i){if(i.dates.push(s.date),rf(t)>e){i.dates.pop();break}}else if(t.push({agent:s.agent,dates:[s.date]}),rf(t)>e){t.pop();break}r=r.slice(1)}return{heartbeatsToSend:t,unsentEntries:r}}class ST{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return Ja()?sl().then(()=>!0).catch(()=>!1):!1}async read(){if(await this._canUseIndexedDBPromise){const t=await vT(this.app);return t!=null&&t.heartbeats?t:{heartbeats:[]}}else return{heartbeats:[]}}async overwrite(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return tf(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:e.heartbeats})}else return}async add(e){if(await this._canUseIndexedDBPromise){const r=await this.read();return tf(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??r.lastSentHeartbeatDate,heartbeats:[...r.heartbeats,...e.heartbeats]})}else return}}function rf(n){return ga(JSON.stringify({version:2,heartbeats:n})).length}function VT(n){if(n.length===0)return-1;let e=0,t=n[0].date;for(let r=1;r<n.length;r++)n[r].date<t&&(t=n[r].date,e=r);return e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function CT(n){$t(new Rt("platform-logger",e=>new Bw(e),"PRIVATE")),$t(new Rt("heartbeat",e=>new PT(e),"PRIVATE")),gt(Tu,Zd,n),gt(Tu,Zd,"esm2020"),gt("fire-js","")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */CT("");var xT="firebase",NT="12.17.1";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */gt(xT,NT,"app");function gm(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}const DT=gm,_m=new Lr("auth","Firebase",gm());/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ia=new Ya("@firebase/auth");function ym(n,...e){Ia.logLevel<=Z.WARN&&Ia.warn(`Auth (${Us}): ${n}`,...e)}function na(n,...e){Ia.logLevel<=Z.ERROR&&Ia.error(`Auth (${Us}): ${n}`,...e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yt(n,...e){throw cl(n,...e)}function Et(n,...e){return cl(n,...e)}function al(n,e,t){const r={...DT(),[e]:t};return new Lr("auth","Firebase",r).create(e,{appName:n.name})}function Zt(n){return al(n,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function kT(n,e,t){const r=t;if(!(e instanceof r))throw r.name!==e.constructor.name&&yt(n,"argument-error"),al(n,"argument-error",`Type of ${e.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}function cl(n,...e){if(typeof n!="string"){const t=e[0],r=[...e.slice(1)];return r[0]&&(r[0].appName=n.name),n._errorFactory.create(t,...r)}return _m.create(n,...e)}function K(n,e,...t){if(!n)throw cl(e,...t)}function Jt(n){const e="INTERNAL ASSERTION FAILED: "+n;throw na(e),new Error(e)}function rn(n,e){n||Jt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wa(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.href)||""}function Im(){return sf()==="http:"||sf()==="https:"}function sf(){var n;return typeof self<"u"&&((n=self.location)==null?void 0:n.protocol)||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function OT(){return typeof navigator<"u"&&navigator&&"onLine"in navigator&&typeof navigator.onLine=="boolean"&&(Im()||rl()||"connection"in navigator)?navigator.onLine:!0}function LT(){if(typeof navigator>"u")return null;const n=navigator;return n.languages&&n.languages[0]||n.language||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class co{constructor(e,t){this.shortDelay=e,this.longDelay=t,rn(t>e,"Short delay should be less than long delay!"),this.isMobile=yw()||ww()}get(){return OT()?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ul(n,e){rn(n.emulator,"Emulator should always be set here");const{url:t}=n.emulator;return e?`${t}${e.startsWith("/")?e.slice(1):e}`:t}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wm{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){if(this.fetchImpl)return this.fetchImpl;if(typeof self<"u"&&"fetch"in self)return self.fetch;if(typeof globalThis<"u"&&globalThis.fetch)return globalThis.fetch;if(typeof fetch<"u")return fetch;Jt("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){if(this.headersImpl)return this.headersImpl;if(typeof self<"u"&&"Headers"in self)return self.Headers;if(typeof globalThis<"u"&&globalThis.Headers)return globalThis.Headers;if(typeof Headers<"u")return Headers;Jt("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){if(this.responseImpl)return this.responseImpl;if(typeof self<"u"&&"Response"in self)return self.Response;if(typeof globalThis<"u"&&globalThis.Response)return globalThis.Response;if(typeof Response<"u")return Response;Jt("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const MT={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const FT=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],UT=new co(3e4,6e4);function Kt(n,e){return n.tenantId&&!e.tenantId?{...e,tenantId:n.tenantId}:e}async function St(n,e,t,r,s={}){return Tm(n,s,async()=>{let i={},o={};r&&(e==="GET"?o=r:i={body:JSON.stringify(r)});const c=ao({...o,key:n.config.apiKey}).slice(1),u=await n._getAdditionalHeaders();u["Content-Type"]="application/json",n.languageCode&&(u["X-Firebase-Locale"]=n.languageCode);const l={method:e,headers:u,...i};return Iw()||(l.referrerPolicy="strict-origin-when-cross-origin"),n.emulatorConfig&&Fs(n.emulatorConfig.host)&&(l.credentials="include"),wm.fetch()(await Em(n,n.config.apiHost,t,c),l)})}async function Tm(n,e,t){n._canInitEmulator=!1;const r={...MT,...e};try{const s=new qT(n),i=await Promise.race([t(),s.promise]);s.clearNetworkTimeout();const o=await i.json();if("needConfirmation"in o)throw Go(n,"account-exists-with-different-credential",o);if(i.ok&&!("errorMessage"in o))return o;{const c=i.ok?o.errorMessage:o.error.message,[u,l]=c.split(" : ");if(u==="FEDERATED_USER_ID_ALREADY_LINKED")throw Go(n,"credential-already-in-use",o);if(u==="EMAIL_EXISTS")throw Go(n,"email-already-in-use",o);if(u==="USER_DISABLED")throw Go(n,"user-disabled",o);const d=r[u]||u.toLowerCase().replace(/[_\s]+/g,"-");if(l)throw al(n,d,l);yt(n,d)}}catch(s){if(s instanceof bt)throw s;yt(n,"network-request-failed",{message:String(s)})}}async function uo(n,e,t,r,s={}){const i=await St(n,e,t,r,s);return"mfaPendingCredential"in i&&yt(n,"multi-factor-auth-required",{_serverResponse:i}),i}async function Em(n,e,t,r){const s=`${e}${t}?${r}`,i=n,o=i.config.emulator?ul(n.config,s):`${n.config.apiScheme}://${s}`;return FT.includes(t)&&(await i._persistenceManagerAvailable,i._getPersistenceType()==="COOKIE")?i._getPersistence()._getFinalTarget(o).toString():o}function BT(n){switch(n){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}class qT{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((t,r)=>{this.timer=setTimeout(()=>r(Et(this.auth,"network-request-failed")),UT.get())})}}function Go(n,e,t){const r={appName:n.name};t.email&&(r.email=t.email),t.phoneNumber&&(r.phoneNumber=t.phoneNumber);const s=Et(n,e,r);return s.customData._tokenResponse=t,s}function of(n){return n!==void 0&&n.enterprise!==void 0}class $T{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],e.recaptchaKey===void 0)throw new Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||this.recaptchaEnforcementState.length===0)return null;for(const t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return BT(t.enforcementState);return null}isProviderEnabled(e){return this.getProviderEnforcementState(e)==="ENFORCE"||this.getProviderEnforcementState(e)==="AUDIT"}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}}async function jT(n,e){return St(n,"GET","/v2/recaptchaConfig",Kt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function zT(n,e){return St(n,"POST","/v1/accounts:delete",e)}async function Ta(n,e){return St(n,"POST","/v1/accounts:lookup",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xi(n){if(n)try{const e=new Date(Number(n));if(!isNaN(e.getTime()))return e.toUTCString()}catch{}}async function GT(n,e=!1){const t=re(n),r=await t.getIdToken(e),s=ll(r);K(s&&s.exp&&s.auth_time&&s.iat,t.auth,"internal-error");const i=typeof s.firebase=="object"?s.firebase:void 0,o=i==null?void 0:i.sign_in_provider;return{claims:s,token:r,authTime:xi(ou(s.auth_time)),issuedAtTime:xi(ou(s.iat)),expirationTime:xi(ou(s.exp)),signInProvider:o||null,signInSecondFactor:(i==null?void 0:i.sign_in_second_factor)||null}}function ou(n){return Number(n)*1e3}function ll(n){const[e,t,r]=n.split(".");if(e===void 0||t===void 0||r===void 0)return na("JWT malformed, contained fewer than 3 sections"),null;try{const s=sm(t);return s?JSON.parse(s):(na("Failed to decode base64 JWT payload"),null)}catch(s){return na("Caught error parsing JWT payload as JSON",s==null?void 0:s.toString()),null}}function af(n){const e=ll(n);return K(e,"internal-error"),K(typeof e.exp<"u","internal-error"),K(typeof e.iat<"u","internal-error"),Number(e.exp)-Number(e.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function fs(n,e,t=!1){if(t)return e;try{return await e}catch(r){throw r instanceof bt&&KT(r)&&n.auth.currentUser===n&&await n.auth.signOut(),r}}function KT({code:n}){return n==="auth/user-disabled"||n==="auth/user-token-expired"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class WT{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,this.timerId!==null&&clearTimeout(this.timerId))}getInterval(e){if(e){const t=this.errorBackoff;return this.errorBackoff=Math.min(this.errorBackoff*2,96e4),t}else{this.errorBackoff=3e4;const r=(this.user.stsTokenManager.expirationTime??0)-Date.now()-3e5;return Math.max(0,r)}}schedule(e=!1){if(!this.isRunning)return;const t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){(e==null?void 0:e.code)==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vu{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=xi(this.lastLoginAt),this.creationTime=xi(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Ea(n){var p;const e=n.auth,t=await n.getIdToken(),r=await fs(n,Ta(e,{idToken:t}));K(r==null?void 0:r.users.length,e,"internal-error");const s=r.users[0];n._notifyReloadListener(s);const i=(p=s.providerUserInfo)!=null&&p.length?vm(s.providerUserInfo):[],o=QT(n.providerData,i),c=n.isAnonymous,u=!(n.email&&s.passwordHash)&&!(o!=null&&o.length),l=c?u:!1,d={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:o,metadata:new vu(s.createdAt,s.lastLoginAt),isAnonymous:l};Object.assign(n,d)}async function HT(n){const e=re(n);await Ea(e),await e.auth._persistUserIfCurrent(e),e.auth._notifyListenersIfCurrent(e)}function QT(n,e){return[...n.filter(r=>!e.some(s=>s.providerId===r.providerId)),...e]}function vm(n){return n.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function JT(n,e){const t=await Tm(n,{},async()=>{const r=ao({grant_type:"refresh_token",refresh_token:e}).slice(1),{tokenApiHost:s,apiKey:i}=n.config,o=await Em(n,s,"/v1/token",`key=${i}`),c=await n._getAdditionalHeaders();c["Content-Type"]="application/x-www-form-urlencoded";const u={method:"POST",headers:c,body:r};return n.emulatorConfig&&Fs(n.emulatorConfig.host)&&(u.credentials="include"),wm.fetch()(o,u)});return{accessToken:t.access_token,expiresIn:t.expires_in,refreshToken:t.refresh_token}}async function YT(n,e){return St(n,"POST","/v2/accounts:revokeToken",Kt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class os{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){K(e.idToken,"internal-error"),K(typeof e.idToken<"u","internal-error"),K(typeof e.refreshToken<"u","internal-error");const t="expiresIn"in e&&typeof e.expiresIn<"u"?Number(e.expiresIn):af(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){K(e.length!==0,"internal-error");const t=af(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return!t&&this.accessToken&&!this.isExpired?this.accessToken:(K(this.refreshToken,e,"user-token-expired"),this.refreshToken?(await this.refresh(e,this.refreshToken),this.accessToken):null)}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){const{accessToken:r,refreshToken:s,expiresIn:i}=await JT(e,t);this.updateTokensAndExpiration(r,s,Number(i))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+r*1e3}static fromJSON(e,t){const{refreshToken:r,accessToken:s,expirationTime:i}=t,o=new os;return r&&(K(typeof r=="string","internal-error",{appName:e}),o.refreshToken=r),s&&(K(typeof s=="string","internal-error",{appName:e}),o.accessToken=s),i&&(K(typeof i=="number","internal-error",{appName:e}),o.expirationTime=i),o}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new os,this.toJSON())}_performRefresh(){return Jt("not implemented")}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Tn(n,e){K(typeof n=="string"||typeof n>"u","internal-error",{appName:e})}class Tt{constructor({uid:e,auth:t,stsTokenManager:r,...s}){this.providerId="firebase",this.proactiveRefresh=new WT(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=s.displayName||null,this.email=s.email||null,this.emailVerified=s.emailVerified||!1,this.phoneNumber=s.phoneNumber||null,this.photoURL=s.photoURL||null,this.isAnonymous=s.isAnonymous||!1,this.tenantId=s.tenantId||null,this.providerData=s.providerData?[...s.providerData]:[],this.metadata=new vu(s.createdAt||void 0,s.lastLoginAt||void 0)}async getIdToken(e){const t=await fs(this,this.stsTokenManager.getToken(this.auth,e));return K(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return GT(this,e)}reload(){return HT(this)}_assign(e){this!==e&&(K(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(t=>({...t})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){const t=new Tt({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){K(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await Ea(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(lt(this.auth.app))return Promise.reject(Zt(this.auth));const e=await this.getIdToken();return await fs(this,zT(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){const r=t.displayName??void 0,s=t.email??void 0,i=t.phoneNumber??void 0,o=t.photoURL??void 0,c=t.tenantId??void 0,u=t._redirectEventId??void 0,l=t.createdAt??void 0,d=t.lastLoginAt??void 0,{uid:p,emailVerified:g,isAnonymous:w,providerData:S,stsTokenManager:D}=t;K(p&&D,e,"internal-error");const k=os.fromJSON(this.name,D);K(typeof p=="string",e,"internal-error"),Tn(r,e.name),Tn(s,e.name),K(typeof g=="boolean",e,"internal-error"),K(typeof w=="boolean",e,"internal-error"),Tn(i,e.name),Tn(o,e.name),Tn(c,e.name),Tn(u,e.name),Tn(l,e.name),Tn(d,e.name);const $=new Tt({uid:p,auth:e,email:s,emailVerified:g,displayName:r,isAnonymous:w,photoURL:o,phoneNumber:i,tenantId:c,stsTokenManager:k,createdAt:l,lastLoginAt:d});return S&&Array.isArray(S)&&($.providerData=S.map(z=>({...z}))),u&&($._redirectEventId=u),$}static async _fromIdTokenResponse(e,t,r=!1){const s=new os;s.updateFromServerResponse(t);const i=new Tt({uid:t.localId,auth:e,stsTokenManager:s,isAnonymous:r});return await Ea(i),i}static async _fromGetAccountInfoResponse(e,t,r){const s=t.users[0];K(s.localId!==void 0,"internal-error");const i=s.providerUserInfo!==void 0?vm(s.providerUserInfo):[],o=!(s.email&&s.passwordHash)&&!(i!=null&&i.length),c=new os;c.updateFromIdToken(r);const u=new Tt({uid:s.localId,auth:e,stsTokenManager:c,isAnonymous:o}),l={uid:s.localId,displayName:s.displayName||null,photoURL:s.photoUrl||null,email:s.email||null,emailVerified:s.emailVerified||!1,phoneNumber:s.phoneNumber||null,tenantId:s.tenantId||null,providerData:i,metadata:new vu(s.createdAt,s.lastLoginAt),isAnonymous:!(s.email&&s.passwordHash)&&!(i!=null&&i.length)};return Object.assign(u,l),u}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cf=new Map;function Yt(n){rn(n instanceof Function,"Expected a class definition");let e=cf.get(n);return e?(rn(e instanceof n,"Instance stored in cache mismatched with class"),e):(e=new n,cf.set(n,e),e)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Am{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){const t=this.storage[e];return t===void 0?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}}Am.type="NONE";const uf=Am;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ra(n,e,t){return`firebase:${n}:${e}:${t}`}class as{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;const{config:s,name:i}=this.auth;this.fullUserKey=ra(this.userKey,s.apiKey,i),this.fullPersistenceKey=ra("persistence",s.apiKey,i),this.boundEventHandler=t._onStorageEvent.bind(t),this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){const e=await this.persistence._get(this.fullUserKey);if(!e)return null;if(typeof e=="string"){const t=await Ta(this.auth,{idToken:e}).catch(()=>{});return t?Tt._fromGetAccountInfoResponse(this.auth,t,e):null}return Tt._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;const t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}static async create(e,t,r="authUser"){if(!t.length)return new as(Yt(uf),e,r);const s=(await Promise.all(t.map(async l=>{if(await l._isAvailable())return l}))).filter(l=>l);let i=s[0]||Yt(uf);const o=ra(r,e.config.apiKey,e.name);let c=null;for(const l of t)try{const d=await l._get(o);if(d){let p;if(typeof d=="string"){const g=await Ta(e,{idToken:d}).catch(()=>{});if(!g)break;p=await Tt._fromGetAccountInfoResponse(e,g,d)}else p=Tt._fromJSON(e,d);l!==i&&(c=p),i=l;break}}catch{}const u=s.filter(l=>l._shouldAllowMigration);return!i._shouldAllowMigration||!u.length?new as(i,e,r):(i=u[0],c&&await i._set(o,c.toJSON()),await Promise.all(t.map(async l=>{if(l!==i)try{await l._remove(o)}catch{}})),new as(i,e,r))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function lf(n){const e=n.toLowerCase();if(e.includes("opera/")||e.includes("opr/")||e.includes("opios/"))return"Opera";if(Sm(e))return"IEMobile";if(e.includes("msie")||e.includes("trident/"))return"IE";if(e.includes("edge/"))return"Edge";if(Rm(e))return"Firefox";if(e.includes("silk/"))return"Silk";if(Cm(e))return"Blackberry";if(xm(e))return"Webos";if(Pm(e))return"Safari";if((e.includes("chrome/")||bm(e))&&!e.includes("edge/"))return"Chrome";if(Vm(e))return"Android";{const t=/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/,r=n.match(t);if((r==null?void 0:r.length)===2)return r[1]}return"Other"}function Rm(n=Ce()){return/firefox\//i.test(n)}function Pm(n=Ce()){const e=n.toLowerCase();return e.includes("safari/")&&!e.includes("chrome/")&&!e.includes("crios/")&&!e.includes("android")}function bm(n=Ce()){return/crios\//i.test(n)}function Sm(n=Ce()){return/iemobile/i.test(n)}function Vm(n=Ce()){return/android/i.test(n)}function Cm(n=Ce()){return/blackberry/i.test(n)}function xm(n=Ce()){return/webos/i.test(n)}function hl(n=Ce()){return/iphone|ipad|ipod/i.test(n)||/macintosh/i.test(n)&&/mobile/i.test(n)}function XT(n=Ce()){var e;return hl(n)&&!!((e=window.navigator)!=null&&e.standalone)}function ZT(){return Tw()&&document.documentMode===10}function Nm(n=Ce()){return hl(n)||Vm(n)||xm(n)||Cm(n)||/windows phone/i.test(n)||Sm(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Dm(n,e=[]){let t;switch(n){case"Browser":t=lf(Ce());break;case"Worker":t=`${lf(Ce())}-${n}`;break;default:t=n}const r=e.length?e.join(","):"FirebaseCore-web";return`${t}/JsCore/${Us}/${r}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eE{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){const r=i=>new Promise((o,c)=>{try{const u=e(i);o(u)}catch(u){c(u)}});r.onAbort=t,this.queue.push(r);const s=this.queue.length-1;return()=>{this.queue[s]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;const t=[];try{for(const r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(r){t.reverse();for(const s of t)try{s()}catch{}throw this.auth._errorFactory.create("login-blocked",{originalMessage:r==null?void 0:r.message})}}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function tE(n,e={}){return St(n,"GET","/v2/passwordPolicy",Kt(n,e))}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const nE=6;class rE{constructor(e){var r;const t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??nE,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),t.containsLowercaseCharacter!==void 0&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),t.containsUppercaseCharacter!==void 0&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),t.containsNumericCharacter!==void 0&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),t.containsNonAlphanumericCharacter!==void 0&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,this.enforcementState==="ENFORCEMENT_STATE_UNSPECIFIED"&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=((r=e.allowedNonAlphanumericCharacters)==null?void 0:r.join(""))??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){const t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){const r=this.customStrengthOptions.minPasswordLength,s=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),s&&(t.meetsMaxPasswordLength=e.length<=s)}validatePasswordCharacterOptions(e,t){this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);let r;for(let s=0;s<e.length;s++)r=e.charAt(s),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,s,i){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=s)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=i))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sE{constructor(e,t,r,s){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=s,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new hf(this),this.idTokenSubscription=new hf(this),this.beforeStateQueue=new eE(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=_m,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=s.sdkClientVersion,this._persistenceManagerAvailable=new Promise(i=>this._resolvePersistenceManagerAvailable=i)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=Yt(t)),this._initializationPromise=this.queue(async()=>{var r,s,i;if(!this._deleted&&(this.persistenceManager=await as.create(this,e),(r=this._resolvePersistenceManagerAvailable)==null||r.call(this),!this._deleted)){if((s=this._popupRedirectResolver)!=null&&s._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch{}await this.initializeCurrentUser(t),this.lastNotifiedUid=((i=this.currentUser)==null?void 0:i.uid)||null,!this._deleted&&(this._isInitialized=!0)}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;const e=await this.assertedPersistence.getCurrentUser();if(!(!this.currentUser&&!e)){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{const t=await Ta(this,{idToken:e}),r=await Tt._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(t){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",t),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){var i;if(lt(this.app)){const o=this.app.settings.authIdToken;return o?new Promise(c=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(o).then(c,c))}):this.directlySetCurrentUser(null)}const t=await this.assertedPersistence.getCurrentUser();let r=t,s=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();const o=(i=this.redirectUser)==null?void 0:i._redirectEventId,c=r==null?void 0:r._redirectEventId,u=await this.tryRedirectSignIn(e);(!o||o===c)&&(u!=null&&u.user)&&(r=u.user,s=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(s)try{await this.beforeStateQueue.runMiddleware(r)}catch(o){r=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(o))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return K(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch{await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await Ea(e)}catch(t){if((t==null?void 0:t.code)!=="auth/network-request-failed")return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=LT()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(lt(this.app))return Promise.reject(Zt(this));const t=e?re(e):null;return t&&K(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&K(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return lt(this.app)?Promise.reject(Zt(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return lt(this.app)?Promise.reject(Zt(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(Yt(e))})}_getRecaptchaConfig(){return this.tenantId==null?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();const t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return this.tenantId===null?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){const e=await tE(this),t=new rE(e);this.tenantId===null?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new Lr("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{const r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){const t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};this.tenantId!=null&&(r.tenantId=this.tenantId),await YT(this,r)}}toJSON(){var e;return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:(e=this._currentUser)==null?void 0:e.toJSON()}}async _setRedirectUser(e,t){const r=await this.getOrInitRedirectPersistenceManager(t);return e===null?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){const t=e&&Yt(e)||this._popupRedirectResolver;K(t,this,"argument-error"),this.redirectPersistenceManager=await as.create(this,[Yt(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){var t,r;return this._isInitialized&&await this.queue(async()=>{}),((t=this._currentUser)==null?void 0:t._redirectEventId)===e?this._currentUser:((r=this.redirectUser)==null?void 0:r._redirectEventId)===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){var t;if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);const e=((t=this.currentUser)==null?void 0:t.uid)??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,s){if(this._deleted)return()=>{};const i=typeof t=="function"?t:t.next.bind(t);let o=!1;const c=this._isInitialized?Promise.resolve():this._initializationPromise;if(K(c,this,"internal-error"),c.then(()=>{o||i(this.currentUser)}),typeof t=="function"){const u=e.addObserver(t,r,s);return()=>{o=!0,u()}}else{const u=e.addObserver(t);return()=>{o=!0,u()}}}async directlySetCurrentUser(e){this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,e?await this.assertedPersistence.setCurrentUser(e):await this.assertedPersistence.removeCurrentUser()}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return K(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=Dm(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){var s;const e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);const t=await((s=this.heartbeatServiceProvider.getImmediate({optional:!0}))==null?void 0:s.getHeartbeatsHeader());t&&(e["X-Firebase-Client"]=t);const r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){var t;if(lt(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;const e=await((t=this.appCheckServiceProvider.getImmediate({optional:!0}))==null?void 0:t.getToken());return e!=null&&e.error&&ym(`Error while retrieving App Check token: ${e.error}`),e==null?void 0:e.token}}function ln(n){return re(n)}class hf{constructor(e){this.auth=e,this.observer=null,this.addObserver=Rw(t=>this.observer=t)}get next(){return K(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Xa={async loadJS(){throw new Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function iE(n){Xa=n}function km(n){return Xa.loadJS(n)}function oE(){return Xa.recaptchaEnterpriseScript}function aE(){return Xa.gapiScript}function cE(n){return`__${n}${Math.floor(Math.random()*1e6)}`}class uE{constructor(){this.enterprise=new lE}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}class lE{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hE="recaptcha-enterprise",Om="NO_RECAPTCHA",df="onFirebaseAuthREInstanceReady";class Pn{constructor(e){this.type=hE,this.auth=ln(e)}async verify(e="verify",t=!1){async function r(i){if(!t){if(i.tenantId==null&&i._agentRecaptchaConfig!=null)return i._agentRecaptchaConfig.siteKey;if(i.tenantId!=null&&i._tenantRecaptchaConfigs[i.tenantId]!==void 0)return i._tenantRecaptchaConfigs[i.tenantId].siteKey}return new Promise(async(o,c)=>{jT(i,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(u=>{if(u.recaptchaKey===void 0)c(new Error("recaptcha Enterprise site key undefined"));else{const l=new $T(u);return i.tenantId==null?i._agentRecaptchaConfig=l:i._tenantRecaptchaConfigs[i.tenantId]=l,o(l.siteKey)}}).catch(u=>{c(u)})})}function s(i,o,c){const u=window.grecaptcha;of(u)?u.enterprise.ready(()=>{u.enterprise.execute(i,{action:e}).then(l=>{o(l)}).catch(()=>{o(Om)})}):c(Error("No reCAPTCHA enterprise script loaded."))}return this.auth.settings.appVerificationDisabledForTesting?new uE().execute("siteKey",{action:"verify"}):new Promise((i,o)=>{r(this.auth).then(async c=>{if(!t&&of(window.grecaptcha)&&Pn.scriptInjectionDeferred)await Pn.scriptInjectionDeferred.promise,s(c,i,o);else{if(typeof window>"u"){o(new Error("RecaptchaVerifier is only supported in browser"));return}let u=oE();u.length!==0&&(u+=c+`&onload=${df}`),Pn.scriptInjectionDeferred=new um,window[df]=()=>{var l;(l=Pn.scriptInjectionDeferred)==null||l.resolve()},km(u).then(()=>{var l;return(l=Pn.scriptInjectionDeferred)==null?void 0:l.promise}).then(()=>{s(c,i,o)}).catch(l=>{o(l)})}}).catch(c=>{o(c)})})}}Pn.scriptInjectionDeferred=null;async function ff(n,e,t,r=!1,s=!1){const i=new Pn(n);let o;if(s)o=Om;else try{o=await i.verify(t)}catch{o=await i.verify(t,!0)}const c={...e};if(t==="mfaSmsEnrollment"||t==="mfaSmsSignIn"){if("phoneEnrollmentInfo"in c){const u=c.phoneEnrollmentInfo.phoneNumber,l=c.phoneEnrollmentInfo.recaptchaToken;Object.assign(c,{phoneEnrollmentInfo:{phoneNumber:u,recaptchaToken:l,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in c){const u=c.phoneSignInInfo.recaptchaToken;Object.assign(c,{phoneSignInInfo:{recaptchaToken:u,captchaResponse:o,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return c}return r?Object.assign(c,{captchaResp:o}):Object.assign(c,{captchaResponse:o}),Object.assign(c,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(c,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),c}async function va(n,e,t,r,s){var i;if((i=n._getRecaptchaConfig())!=null&&i.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")){const o=await ff(n,e,t,t==="getOobCode");return r(n,o)}else return r(n,e).catch(async o=>{if(o.code==="auth/missing-recaptcha-token"){console.log(`${t} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);const c=await ff(n,e,t,t==="getOobCode");return r(n,c)}else return Promise.reject(o)})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function dE(n,e){const t=un(n,"auth");if(t.isInitialized()){const s=t.getImmediate(),i=t.getOptions();if(_t(i,e??{}))return s;yt(s,"already-initialized")}return t.initialize({options:e})}function fE(n,e){const t=(e==null?void 0:e.persistence)||[],r=(Array.isArray(t)?t:[t]).map(Yt);e!=null&&e.errorMap&&n._updateErrorMap(e.errorMap),n._initializeWithPersistence(r,e==null?void 0:e.popupRedirectResolver)}function pE(n,e,t){const r=ln(n);K(/^https?:\/\//.test(e),r,"invalid-emulator-scheme");const s=!1,i=Lm(e),{host:o,port:c}=mE(e),u=c===null?"":`:${c}`,l={url:`${i}//${o}${u}/`},d=Object.freeze({host:o,port:c,protocol:i.replace(":",""),options:Object.freeze({disableWarnings:s})});if(!r._canInitEmulator){K(r.config.emulator&&r.emulatorConfig,r,"emulator-config-failed"),K(_t(l,r.config.emulator)&&_t(d,r.emulatorConfig),r,"emulator-config-failed");return}r.config.emulator=l,r.emulatorConfig=d,r.settings.appVerificationDisabledForTesting=!0,Fs(o)?il(`${i}//${o}${u}`):gE()}function Lm(n){const e=n.indexOf(":");return e<0?"":n.substr(0,e+1)}function mE(n){const e=Lm(n),t=/(\/\/)?([^?#/]+)/.exec(n.substr(e.length));if(!t)return{host:"",port:null};const r=t[2].split("@").pop()||"",s=/^(\[[^\]]+\])(:|$)/.exec(r);if(s){const i=s[1];return{host:i,port:pf(r.substr(i.length+1))}}else{const[i,o]=r.split(":");return{host:i,port:pf(o)}}}function pf(n){if(!n)return null;const e=Number(n);return isNaN(e)?null:e}function gE(){function n(){const e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}typeof console<"u"&&typeof console.info=="function"&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),typeof window<"u"&&typeof document<"u"&&(document.readyState==="loading"?window.addEventListener("DOMContentLoaded",n):n())}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dl{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return Jt("not implemented")}_getIdTokenResponse(e){return Jt("not implemented")}_linkToIdToken(e,t){return Jt("not implemented")}_getReauthenticationResolver(e){return Jt("not implemented")}}async function _E(n,e){return St(n,"POST","/v1/accounts:signUp",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function yE(n,e){return uo(n,"POST","/v1/accounts:signInWithPassword",Kt(n,e))}async function IE(n,e){return St(n,"POST","/v1/accounts:sendOobCode",Kt(n,e))}async function wE(n,e){return IE(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function TE(n,e){return uo(n,"POST","/v1/accounts:signInWithEmailLink",Kt(n,e))}async function EE(n,e){return uo(n,"POST","/v1/accounts:signInWithEmailLink",Kt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ki extends dl{constructor(e,t,r,s=null){super("password",r),this._email=e,this._password=t,this._tenantId=s}static _fromEmailAndPassword(e,t){return new Ki(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new Ki(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e;if(t!=null&&t.email&&(t!=null&&t.password)){if(t.signInMethod==="password")return this._fromEmailAndPassword(t.email,t.password);if(t.signInMethod==="emailLink")return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":const t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return va(e,t,"signInWithPassword",yE);case"emailLink":return TE(e,{email:this._email,oobCode:this._password});default:yt(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":const r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return va(e,r,"signUpPassword",_E);case"emailLink":return EE(e,{idToken:t,email:this._email,oobCode:this._password});default:yt(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function cs(n,e){return uo(n,"POST","/v1/accounts:signInWithIdp",Kt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const vE="http://localhost";class vr extends dl{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){const t=new vr(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):yt("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){const t=typeof e=="string"?JSON.parse(e):e,{providerId:r,signInMethod:s,...i}=t;if(!r||!s)return null;const o=new vr(r,s);return o.idToken=i.idToken||void 0,o.accessToken=i.accessToken||void 0,o.secret=i.secret,o.nonce=i.nonce,o.pendingToken=i.pendingToken||null,o}_getIdTokenResponse(e){const t=this.buildRequest();return cs(e,t)}_linkToIdToken(e,t){const r=this.buildRequest();return r.idToken=t,cs(e,r)}_getReauthenticationResolver(e){const t=this.buildRequest();return t.autoCreate=!1,cs(e,t)}buildRequest(){const e={requestUri:vE,returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{const t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=ao(t)}return e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function AE(n){switch(n){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}function RE(n){const e=Ri(Pi(n)).link,t=e?Ri(Pi(e)).deep_link_id:null,r=Ri(Pi(n)).deep_link_id;return(r?Ri(Pi(r)).link:null)||r||t||e||n}class fl{constructor(e){const t=Ri(Pi(e)),r=t.apiKey??null,s=t.oobCode??null,i=AE(t.mode??null);K(r&&s&&i,"argument-error"),this.apiKey=r,this.operation=i,this.code=s,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){const t=RE(e);try{return new fl(t)}catch{return null}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bs{constructor(){this.providerId=Bs.PROVIDER_ID}static credential(e,t){return Ki._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){const r=fl.parseLink(t);return K(r,"argument-error"),Ki._fromEmailAndCode(e,r.code,r.tenantId)}}Bs.PROVIDER_ID="password";Bs.EMAIL_PASSWORD_SIGN_IN_METHOD="password";Bs.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pl{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lo extends pl{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bn extends lo{constructor(){super("facebook.com")}static credential(e){return vr._fromParams({providerId:bn.PROVIDER_ID,signInMethod:bn.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return bn.credentialFromTaggedObject(e)}static credentialFromError(e){return bn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return bn.credential(e.oauthAccessToken)}catch{return null}}}bn.FACEBOOK_SIGN_IN_METHOD="facebook.com";bn.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sn extends lo{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return vr._fromParams({providerId:Sn.PROVIDER_ID,signInMethod:Sn.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return Sn.credentialFromTaggedObject(e)}static credentialFromError(e){return Sn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return Sn.credential(t,r)}catch{return null}}}Sn.GOOGLE_SIGN_IN_METHOD="google.com";Sn.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Vn extends lo{constructor(){super("github.com")}static credential(e){return vr._fromParams({providerId:Vn.PROVIDER_ID,signInMethod:Vn.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return Vn.credentialFromTaggedObject(e)}static credentialFromError(e){return Vn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return Vn.credential(e.oauthAccessToken)}catch{return null}}}Vn.GITHUB_SIGN_IN_METHOD="github.com";Vn.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Cn extends lo{constructor(){super("twitter.com")}static credential(e,t){return vr._fromParams({providerId:Cn.PROVIDER_ID,signInMethod:Cn.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return Cn.credentialFromTaggedObject(e)}static credentialFromError(e){return Cn.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;const{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return Cn.credential(t,r)}catch{return null}}}Cn.TWITTER_SIGN_IN_METHOD="twitter.com";Cn.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function PE(n,e){return uo(n,"POST","/v1/accounts:signUp",Kt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ar{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,s=!1){const i=await Tt._fromIdTokenResponse(e,r,s),o=mf(r);return new Ar({user:i,providerId:o,_tokenResponse:r,operationType:t})}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);const s=mf(r);return new Ar({user:e,providerId:s,_tokenResponse:r,operationType:t})}}function mf(n){return n.providerId?n.providerId:"phoneNumber"in n?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Aa extends bt{constructor(e,t,r,s){super(t.code,t.message),this.operationType=r,this.user=s,Object.setPrototypeOf(this,Aa.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,s){return new Aa(e,t,r,s)}}function Mm(n,e,t,r){return(e==="reauthenticate"?t._getReauthenticationResolver(n):t._getIdTokenResponse(n)).catch(i=>{throw i.code==="auth/multi-factor-auth-required"?Aa._fromErrorAndOperation(n,i,e,r):i})}async function bE(n,e,t=!1){const r=await fs(n,e._linkToIdToken(n.auth,await n.getIdToken()),t);return Ar._forOperation(n,"link",r)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function SE(n,e,t=!1){const{auth:r}=n;if(lt(r.app))return Promise.reject(Zt(r));const s="reauthenticate";try{const i=await fs(n,Mm(r,s,e,n),t);K(i.idToken,r,"internal-error");const o=ll(i.idToken);K(o,r,"internal-error");const{sub:c}=o;return K(n.uid===c,r,"user-mismatch"),Ar._forOperation(n,s,i)}catch(i){throw(i==null?void 0:i.code)==="auth/user-not-found"&&yt(r,"user-mismatch"),i}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Fm(n,e,t=!1){if(lt(n.app))return Promise.reject(Zt(n));const r="signIn",s=await Mm(n,r,e),i=await Ar._fromIdTokenResponse(n,r,s);return t||await n._updateCurrentUser(i.user),i}async function VE(n,e){return Fm(ln(n),e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function CE(n,e,t){var r;K(((r=t.url)==null?void 0:r.length)>0,n,"invalid-continue-uri"),K(typeof t.dynamicLinkDomain>"u"||t.dynamicLinkDomain.length>0,n,"invalid-dynamic-link-domain"),K(typeof t.linkDomain>"u"||t.linkDomain.length>0,n,"invalid-hosting-link-domain"),e.continueUrl=t.url,e.dynamicLinkDomain=t.dynamicLinkDomain,e.linkDomain=t.linkDomain,e.canHandleCodeInApp=t.handleCodeInApp,t.iOS&&(K(t.iOS.bundleId.length>0,n,"missing-ios-bundle-id"),e.iOSBundleId=t.iOS.bundleId),t.android&&(K(t.android.packageName.length>0,n,"missing-android-pkg-name"),e.androidInstallApp=t.android.installApp,e.androidMinimumVersionCode=t.android.minimumVersion,e.androidPackageName=t.android.packageName)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Um(n){const e=ln(n);e._getPasswordPolicyInternal()&&await e._updatePasswordPolicy()}async function G0(n,e,t){const r=ln(n),s={requestType:"PASSWORD_RESET",email:e,clientType:"CLIENT_TYPE_WEB"};t&&CE(r,s,t),await va(r,s,"getOobCode",wE)}async function K0(n,e,t){if(lt(n.app))return Promise.reject(Zt(n));const r=ln(n),o=await va(r,{returnSecureToken:!0,email:e,password:t,clientType:"CLIENT_TYPE_WEB"},"signUpPassword",PE).catch(u=>{throw u.code==="auth/password-does-not-meet-requirements"&&Um(n),u}),c=await Ar._fromIdTokenResponse(r,"signIn",o);return await r._updateCurrentUser(c.user),c}function W0(n,e,t){return lt(n.app)?Promise.reject(Zt(n)):VE(re(n),Bs.credential(e,t)).catch(async r=>{throw r.code==="auth/password-does-not-meet-requirements"&&Um(n),r})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function xE(n,e){return St(n,"POST","/v1/accounts:createAuthUri",Kt(n,e))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function H0(n,e){const t=Im()?wa():"http://localhost",r={identifier:e,continueUri:t},{signinMethods:s}=await xE(re(n),r);return s||[]}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function NE(n,e){return St(n,"POST","/v1/accounts:update",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Q0(n,{displayName:e,photoURL:t}){if(e===void 0&&t===void 0)return;const r=re(n),i={idToken:await r.getIdToken(),displayName:e,photoUrl:t,returnSecureToken:!0},o=await fs(r,NE(r.auth,i));r.displayName=o.displayName||null,r.photoURL=o.photoUrl||null;const c=r.providerData.find(({providerId:u})=>u==="password");c&&(c.displayName=r.displayName,c.photoURL=r.photoURL),await r._updateTokensIfNecessary(o)}function DE(n,e,t,r){return re(n).onIdTokenChanged(e,t,r)}function kE(n,e,t){return re(n).beforeAuthStateChanged(e,t)}function J0(n,e,t,r){return re(n).onAuthStateChanged(e,t,r)}function Y0(n){return re(n).signOut()}const Ra="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Bm{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{return this.storage?(this.storage.setItem(Ra,"1"),this.storage.removeItem(Ra),Promise.resolve(!0)):Promise.resolve(!1)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){const t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const OE=1e3,LE=10;class qm extends Bm{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=Nm(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(const t of Object.keys(this.listeners)){const r=this.storage.getItem(t),s=this.localCache[t];r!==s&&e(t,s,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((o,c,u)=>{this.notifyListeners(o,u)});return}const r=e.key;t?this.detachListener():this.stopPolling();const s=()=>{const o=this.storage.getItem(r);!t&&this.localCache[r]===o||this.notifyListeners(r,o)},i=this.storage.getItem(r);ZT()&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(s,LE):s()}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t&&JSON.parse(t))}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},OE)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){const t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}}qm.type="LOCAL";const ME=qm;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $m extends Bm{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}}$m.type="SESSION";const jm=$m;/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function FE(n){return Promise.all(n.map(async e=>{try{return{fulfilled:!0,value:await e}}catch(t){return{fulfilled:!1,reason:t}}}))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Za{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){const t=this.receivers.find(s=>s.isListeningto(e));if(t)return t;const r=new Za(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){const t=e,{eventId:r,eventType:s,data:i}=t.data,o=this.handlersMap[s];if(!(o!=null&&o.size))return;t.ports[0].postMessage({status:"ack",eventId:r,eventType:s});const c=Array.from(o).map(async l=>l(t.origin,i)),u=await FE(c);t.ports[0].postMessage({status:"done",eventId:r,eventType:s,response:u})}_subscribe(e,t){Object.keys(this.handlersMap).length===0&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),(!t||this.handlersMap[e].size===0)&&delete this.handlersMap[e],Object.keys(this.handlersMap).length===0&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}}Za.receivers=[];/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ml(n="",e=10){let t="";for(let r=0;r<e;r++)t+=Math.floor(Math.random()*10);return n+t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class UE{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){const s=typeof MessageChannel<"u"?new MessageChannel:null;if(!s)throw new Error("connection_unavailable");let i,o;return new Promise((c,u)=>{const l=ml("",20);s.port1.start();const d=setTimeout(()=>{u(new Error("unsupported_event"))},r);o={messageChannel:s,onMessage(p){const g=p;if(g.data.eventId===l)switch(g.data.status){case"ack":clearTimeout(d),i=setTimeout(()=>{u(new Error("timeout"))},3e3);break;case"done":clearTimeout(i),c(g.data.response);break;default:clearTimeout(d),clearTimeout(i),u(new Error("invalid_response"));break}}},this.handlers.add(o),s.port1.addEventListener("message",o.onMessage),this.target.postMessage({eventType:e,eventId:l,data:t},[s.port2])}).finally(()=>{o&&this.removeMessageHandler(o)})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ft(){return window}function BE(n){Ft().location.href=n}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zm(){return typeof Ft().WorkerGlobalScope<"u"&&typeof Ft().importScripts=="function"}async function qE(){if(!(navigator!=null&&navigator.serviceWorker))return null;try{return(await navigator.serviceWorker.ready).active}catch{return null}}function $E(){var n;return((n=navigator==null?void 0:navigator.serviceWorker)==null?void 0:n.controller)||null}function jE(){return zm()?self:null}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gm="firebaseLocalStorageDb",zE=1,Pa="firebaseLocalStorage",Km="fbase_key";class ho{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}}function ec(n,e){return n.transaction([Pa],e?"readwrite":"readonly").objectStore(Pa)}function GE(){const n=indexedDB.deleteDatabase(Gm);return new ho(n).toPromise()}function Wm(){const n=indexedDB.open(Gm,zE);return new Promise((e,t)=>{n.addEventListener("error",()=>{t(n.error)}),n.addEventListener("upgradeneeded",()=>{const r=n.result;try{r.createObjectStore(Pa,{keyPath:Km})}catch(s){t(s)}}),n.addEventListener("success",async()=>{const r=n.result;r.objectStoreNames.contains(Pa)?e(r):(r.close(),await GE(),e(await Wm()))})})}async function gf(n,e,t){const r=ec(n,!0).put({[Km]:e,value:t});return new ho(r).toPromise()}async function KE(n,e){const t=ec(n,!1).get(e),r=await new ho(t).toPromise();return r===void 0?null:r.value}function _f(n,e){const t=ec(n,!0).delete(e);return new ho(t).toPromise()}const WE=800,HE=3;class Hm{registerLifecycleListeners(){typeof window<"u"&&typeof window.addEventListener=="function"&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow)),typeof document<"u"&&typeof document.addEventListener=="function"&&document.addEventListener("visibilitychange",this.onVisibilityChange)}unregisterLifecycleListeners(){typeof window<"u"&&typeof window.removeEventListener=="function"&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow)),typeof document<"u"&&typeof document.removeEventListener=="function"&&document.removeEventListener("visibilitychange",this.onVisibilityChange)}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isHiding=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isHiding=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isHiding&&(this.isHiding=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this.onVisibilityChange=()=>{typeof document<"u"&&(document.visibilityState==="hidden"?this.onPageHide():document.visibilityState==="visible"&&this.onPageShow())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){if(this.isHiding)throw new Error("Database is closing/hidden");return this.dbPromise?this.dbPromise:(this.dbPromise=Wm(),this.dbPromise.catch(()=>{this.dbPromise=null}),this.dbPromise)}async _withRetries(e){let t=0;for(;;)try{const r=await this._openDb();return await e(r)}catch(r){if(this.isHiding||t++>HE)throw r;this.dbPromise&&((await this.dbPromise).close(),this.dbPromise=null)}}async initializeServiceWorkerMessaging(){return zm()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Za._getInstance(jE()),this.receiver._subscribe("keyChanged",async(e,t)=>({keyProcessed:(await this._poll()).includes(t.key)})),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){var t,r;if(this.activeServiceWorker=await qE(),!this.activeServiceWorker)return;this.sender=new UE(this.activeServiceWorker);const e=await this.sender._send("ping",{},800);e&&(t=e[0])!=null&&t.fulfilled&&(r=e[0])!=null&&r.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(!(!this.sender||!this.activeServiceWorker||$E()!==this.activeServiceWorker))try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{return indexedDB?(await this._withRetries(async e=>{await gf(e,Ra,"1"),await _f(e,Ra)}),!0):!1}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>gf(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){const t=await this._withRetries(r=>KE(r,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>_f(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isHiding)return[];try{const e=await this._withRetries(s=>{const i=ec(s,!1).getAll();return new ho(i).toPromise()});if(this.isHiding)return[];if(!e)return[];if(this.pendingWrites!==0)return[];const t=[],r=new Set;if(e.length!==0)for(const{fbase_key:s,value:i}of e)r.add(s),JSON.stringify(this.localCache[s])!==JSON.stringify(i)&&(this.notifyListeners(s,i),t.push(s));for(const s of Object.keys(this.localCache))this.localCache[s]&&!r.has(s)&&(this.notifyListeners(s,null),t.push(s));return t}catch(e){return this.isHiding||ym(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,t){this.localCache[e]=t;const r=this.listeners[e];if(r)for(const s of Array.from(r))s(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),WE)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){Object.keys(this.listeners).length===0&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),this.listeners[e].size===0&&delete this.listeners[e]),Object.keys(this.listeners).length===0&&(this.stopPolling(),this.unregisterLifecycleListeners())}}Hm.type="LOCAL";const QE=Hm;new co(3e4,6e4);/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Qm(n,e){return e?Yt(e):(K(n._popupRedirectResolver,n,"argument-error"),n._popupRedirectResolver)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class gl extends dl{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return cs(e,this._buildIdpRequest())}_linkToIdToken(e,t){return cs(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return cs(e,this._buildIdpRequest())}_buildIdpRequest(e){const t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}}function JE(n){return Fm(n.auth,new gl(n),n.bypassAuthState)}function YE(n){const{auth:e,user:t}=n;return K(t,e,"internal-error"),SE(t,new gl(n),n.bypassAuthState)}async function XE(n){const{auth:e,user:t}=n;return K(t,e,"internal-error"),bE(t,new gl(n),n.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jm{constructor(e,t,r,s,i=!1){this.auth=e,this.resolver=r,this.user=s,this.bypassAuthState=i,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(r){this.reject(r)}})}async onAuthEvent(e){const{urlResponse:t,sessionId:r,postBody:s,tenantId:i,error:o,type:c}=e;if(o){this.reject(o);return}const u={auth:this.auth,requestUri:t,sessionId:r,tenantId:i||void 0,postBody:s||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(c)(u))}catch(l){this.reject(l)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return JE;case"linkViaPopup":case"linkViaRedirect":return XE;case"reauthViaPopup":case"reauthViaRedirect":return YE;default:yt(this.auth,"internal-error")}}resolve(e){rn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){rn(this.pendingPromise,"Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ZE=new co(2e3,1e4);async function X0(n,e,t){if(lt(n.app))return Promise.reject(Et(n,"operation-not-supported-in-this-environment"));const r=ln(n);kT(n,e,pl);const s=Qm(r,t);return new gr(r,"signInViaPopup",e,s).executeNotNull()}class gr extends Jm{constructor(e,t,r,s,i){super(e,t,s,i),this.provider=r,this.authWindow=null,this.pollId=null,gr.currentPopupAction&&gr.currentPopupAction.cancel(),gr.currentPopupAction=this}async executeNotNull(){const e=await this.execute();return K(e,this.auth,"internal-error"),e}async onExecution(){rn(this.filter.length===1,"Popup operations only handle one event");const e=ml();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(t=>{this.reject(t)}),this.resolver._isIframeWebStorageSupported(this.auth,t=>{t||this.reject(Et(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){var e;return((e=this.authWindow)==null?void 0:e.associatedEvent)||null}cancel(){this.reject(Et(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,gr.currentPopupAction=null}pollUserCancellation(){const e=()=>{var t,r;if((r=(t=this.authWindow)==null?void 0:t.window)!=null&&r.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(Et(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(e,ZE.get())};e()}}gr.currentPopupAction=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ev="pendingRedirect",sa=new Map;class tv extends Jm{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=sa.get(this.auth._key());if(!e){try{const r=await nv(this.resolver,this.auth)?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}sa.set(this.auth._key(),e)}return this.bypassAuthState||sa.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if(e.type==="signInViaRedirect")return super.onAuthEvent(e);if(e.type==="unknown"){this.resolve(null);return}if(e.eventId){const t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}}async function nv(n,e){const t=iv(e),r=sv(n);if(!await r._isAvailable())return!1;const s=await r._get(t)==="true";return await r._remove(t),s}function rv(n,e){sa.set(n._key(),e)}function sv(n){return Yt(n._redirectPersistence)}function iv(n){return ra(ev,n.config.apiKey,n.name)}async function ov(n,e,t=!1){if(lt(n.app))return Promise.reject(Zt(n));const r=ln(n),s=Qm(r,e),o=await new tv(r,s,t).execute();return o&&!t&&(delete o.user._redirectEventId,await r._persistUserIfCurrent(o.user),await r._setRedirectUser(null,e)),o}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const av=600*1e3;class cv{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!uv(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){var r;if(e.error&&!Ym(e)){const s=((r=e.error.code)==null?void 0:r.split("auth/")[1])||"internal-error";t.onError(Et(this.auth,s))}else t.onAuthEvent(e)}isEventForConsumer(e,t){const r=t.eventId===null||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=av&&this.cachedEventUids.clear(),this.cachedEventUids.has(yf(e))}saveEventToCache(e){this.cachedEventUids.add(yf(e)),this.lastProcessedEventTime=Date.now()}}function yf(n){return[n.type,n.eventId,n.sessionId,n.tenantId].filter(e=>e).join("-")}function Ym({type:n,error:e}){return n==="unknown"&&(e==null?void 0:e.code)==="auth/no-auth-event"}function uv(n){switch(n.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return Ym(n);default:return!1}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function lv(n,e={}){return St(n,"GET","/v1/projects",e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hv=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,dv=/^https?/;async function fv(n){if(n.config.emulator)return;const{authorizedDomains:e}=await lv(n);for(const t of e)try{if(pv(t))return}catch{}yt(n,"unauthorized-domain")}function pv(n){const e=wa(),{protocol:t,hostname:r}=new URL(e);if(n.startsWith("chrome-extension://")){const o=new URL(n);return o.hostname===""&&r===""?t==="chrome-extension:"&&n.replace("chrome-extension://","")===e.replace("chrome-extension://",""):t==="chrome-extension:"&&o.hostname===r}if(!dv.test(t))return!1;if(hv.test(n))return r===n;const s=n.replace(/\./g,"\\.");return new RegExp("^(.+\\."+s+"|"+s+")$","i").test(r)}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const mv=new co(3e4,6e4);function If(){const n=Ft().___jsl;if(n!=null&&n.H){for(const e of Object.keys(n.H))if(n.H[e].r=n.H[e].r||[],n.H[e].L=n.H[e].L||[],n.H[e].r=[...n.H[e].L],n.CP)for(let t=0;t<n.CP.length;t++)n.CP[t]=null}}function gv(n){return new Promise((e,t)=>{var s,i,o;function r(){If(),gapi.load("gapi.iframes",{callback:()=>{e(gapi.iframes.getContext())},ontimeout:()=>{If(),t(Et(n,"network-request-failed"))},timeout:mv.get()})}if((i=(s=Ft().gapi)==null?void 0:s.iframes)!=null&&i.Iframe)e(gapi.iframes.getContext());else if((o=Ft().gapi)!=null&&o.load)r();else{const c=cE("iframefcb");return Ft()[c]=()=>{gapi.load?r():t(Et(n,"network-request-failed"))},km(`${aE()}?onload=${c}`).catch(u=>t(u))}}).catch(e=>{throw ia=null,e})}let ia=null;function _v(n){return ia=ia||gv(n),ia}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yv=new co(5e3,15e3),Iv="__/auth/iframe",wv="emulator/auth/iframe",Tv={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},Ev=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);function vv(n){const e=n.config;K(e.authDomain,n,"auth-domain-config-required");const t=e.emulator?ul(e,wv):`https://${n.config.authDomain}/${Iv}`,r={apiKey:e.apiKey,appName:n.name,v:Us},s=Ev.get(n.config.apiHost);s&&(r.eid=s);const i=n._getFrameworks();return i.length&&(r.fw=i.join(",")),`${t}?${ao(r).slice(1)}`}async function Av(n){const e=await _v(n),t=Ft().gapi;return K(t,n,"internal-error"),e.open({where:document.body,url:vv(n),messageHandlersFilter:t.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:Tv,dontclear:!0},r=>new Promise(async(s,i)=>{await r.restyle({setHideOnLeave:!1});const o=Et(n,"network-request-failed"),c=Ft().setTimeout(()=>{i(o)},yv.get());function u(){Ft().clearTimeout(c),s(r)}r.ping(u).then(u,()=>{i(o)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Rv={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"},Pv=500,bv=600,Sv="_blank",Vv="http://localhost";class wf{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch{}}}function Cv(n,e,t,r=Pv,s=bv){const i=Math.max((window.screen.availHeight-s)/2,0).toString(),o=Math.max((window.screen.availWidth-r)/2,0).toString();let c="";const u={...Rv,width:r.toString(),height:s.toString(),top:i,left:o},l=Ce().toLowerCase();t&&(c=bm(l)?Sv:t),Rm(l)&&(e=e||Vv,u.scrollbars="yes");const d=Object.entries(u).reduce((g,[w,S])=>`${g}${w}=${S},`,"");if(XT(l)&&c!=="_self")return xv(e||"",c),new wf(null);const p=window.open(e||"",c,d);K(p,n,"popup-blocked");try{p.focus()}catch{}return new wf(p)}function xv(n,e){const t=document.createElement("a");t.href=n,t.target=e;const r=document.createEvent("MouseEvent");r.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),t.dispatchEvent(r)}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nv="__/auth/handler",Dv="emulator/auth/handler",kv=encodeURIComponent("fac");async function Tf(n,e,t,r,s,i){K(n.config.authDomain,n,"auth-domain-config-required"),K(n.config.apiKey,n,"invalid-api-key");const o={apiKey:n.config.apiKey,appName:n.name,authType:t,redirectUrl:r,v:Us,eventId:s};if(e instanceof pl){e.setDefaultLanguage(n.languageCode),o.providerId=e.providerId||"",Aw(e.getCustomParameters())||(o.customParameters=JSON.stringify(e.getCustomParameters()));for(const[d,p]of Object.entries({}))o[d]=p}if(e instanceof lo){const d=e.getScopes().filter(p=>p!=="");d.length>0&&(o.scopes=d.join(","))}n.tenantId&&(o.tid=n.tenantId);const c=o;for(const d of Object.keys(c))c[d]===void 0&&delete c[d];const u=await n._getAppCheckToken(),l=u?`#${kv}=${encodeURIComponent(u)}`:"";return`${Ov(n)}?${ao(c).slice(1)}${l}`}function Ov({config:n}){return n.emulator?ul(n,Dv):`https://${n.authDomain}/${Nv}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const au="webStorageSupport";class Lv{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=jm,this._completeRedirectFn=ov,this._overrideRedirectResult=rv}async _openPopup(e,t,r,s){var o;rn((o=this.eventManagers[e._key()])==null?void 0:o.manager,"_initialize() not called before _openPopup()");const i=await Tf(e,t,r,wa(),s);return Cv(e,i,ml())}async _openRedirect(e,t,r,s){await this._originValidation(e);const i=await Tf(e,t,r,wa(),s);return BE(i),new Promise(()=>{})}_initialize(e){const t=e._key();if(this.eventManagers[t]){const{manager:s,promise:i}=this.eventManagers[t];return s?Promise.resolve(s):(rn(i,"If manager is not set, promise should be"),i)}const r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){const t=await Av(e),r=new cv(e);return t.register("authEvent",s=>(K(s==null?void 0:s.authEvent,e,"invalid-auth-event"),{status:r.onEvent(s.authEvent)?"ACK":"ERROR"}),gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){this.iframes[e._key()].send(au,{type:au},s=>{var o;const i=(o=s==null?void 0:s[0])==null?void 0:o[au];i!==void 0&&t(!!i),yt(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){const t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=fv(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return Nm()||Pm()||hl()}}const Mv=Lv;var Ef="@firebase/auth",vf="1.13.4";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fv{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){var e;return this.assertAuthConfigured(),((e=this.auth.currentUser)==null?void 0:e.uid)||null}async getToken(e){return this.assertAuthConfigured(),await this.auth._initializationPromise,this.auth.currentUser?{accessToken:await this.auth.currentUser.getIdToken(e)}:null}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;const t=this.auth.onIdTokenChanged(r=>{e((r==null?void 0:r.stsTokenManager.accessToken)||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();const t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){K(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Uv(n){switch(n){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}function Bv(n){$t(new Rt("auth",(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("heartbeat"),i=e.getProvider("app-check-internal"),{apiKey:o,authDomain:c}=r.options;K(o&&!o.includes(":"),"invalid-api-key",{appName:r.name});const u={apiKey:o,authDomain:c,clientPlatform:n,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:Dm(n)},l=new sE(r,s,i,u);return fE(l,t),l},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{e.getProvider("auth-internal").initialize()})),$t(new Rt("auth-internal",e=>{const t=ln(e.getProvider("auth").getImmediate());return(r=>new Fv(r))(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),gt(Ef,vf,Uv(n)),gt(Ef,vf,"esm2020")}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const qv=300,$v=cm("authIdTokenMaxAge")||qv;let Af=null;const jv=n=>async e=>{const t=e&&await e.getIdTokenResult(),r=t&&(new Date().getTime()-Date.parse(t.issuedAtTime))/1e3;if(r&&r>$v)return;const s=t==null?void 0:t.token;Af!==s&&(Af=s,await fetch(n,{method:s?"POST":"DELETE",headers:s?{Authorization:`Bearer ${s}`}:{}}))};function Z0(n=ol()){const e=un(n,"auth");if(e.isInitialized())return e.getImmediate();const t=dE(n,{popupRedirectResolver:Mv,persistence:[QE,ME,jm]}),r=cm("authTokenSyncURL");if(r&&typeof isSecureContext=="boolean"&&isSecureContext){const i=new URL(r,location.origin);if(location.origin===i.origin){const o=jv(i.toString());kE(t,o,()=>o(t.currentUser)),DE(t,c=>o(c))}}const s=om("auth");return s&&pE(t,`http://${s}`),t}function zv(){var n;return((n=document.getElementsByTagName("head"))==null?void 0:n[0])??document}iE({loadJS(n){return new Promise((e,t)=>{const r=document.createElement("script");r.setAttribute("src",n),r.onload=e,r.onerror=s=>{const i=Et("internal-error");i.customData=s,t(i)},r.type="text/javascript",r.charset="UTF-8",zv().appendChild(r)})},gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="});Bv("Browser");var Rf=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var On,Xm;(function(){var n;/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/function e(E,_){function I(){}I.prototype=_.prototype,E.F=_.prototype,E.prototype=new I,E.prototype.constructor=E,E.D=function(A,v,V){for(var y=Array(arguments.length-2),Ze=2;Ze<arguments.length;Ze++)y[Ze-2]=arguments[Ze];return _.prototype[v].apply(A,y)}}function t(){this.blockSize=-1}function r(){this.blockSize=-1,this.blockSize=64,this.g=Array(4),this.C=Array(this.blockSize),this.o=this.h=0,this.u()}e(r,t),r.prototype.u=function(){this.g[0]=1732584193,this.g[1]=4023233417,this.g[2]=2562383102,this.g[3]=271733878,this.o=this.h=0};function s(E,_,I){I||(I=0);const A=Array(16);if(typeof _=="string")for(var v=0;v<16;++v)A[v]=_.charCodeAt(I++)|_.charCodeAt(I++)<<8|_.charCodeAt(I++)<<16|_.charCodeAt(I++)<<24;else for(v=0;v<16;++v)A[v]=_[I++]|_[I++]<<8|_[I++]<<16|_[I++]<<24;_=E.g[0],I=E.g[1],v=E.g[2];let V=E.g[3],y;y=_+(V^I&(v^V))+A[0]+3614090360&4294967295,_=I+(y<<7&4294967295|y>>>25),y=V+(v^_&(I^v))+A[1]+3905402710&4294967295,V=_+(y<<12&4294967295|y>>>20),y=v+(I^V&(_^I))+A[2]+606105819&4294967295,v=V+(y<<17&4294967295|y>>>15),y=I+(_^v&(V^_))+A[3]+3250441966&4294967295,I=v+(y<<22&4294967295|y>>>10),y=_+(V^I&(v^V))+A[4]+4118548399&4294967295,_=I+(y<<7&4294967295|y>>>25),y=V+(v^_&(I^v))+A[5]+1200080426&4294967295,V=_+(y<<12&4294967295|y>>>20),y=v+(I^V&(_^I))+A[6]+2821735955&4294967295,v=V+(y<<17&4294967295|y>>>15),y=I+(_^v&(V^_))+A[7]+4249261313&4294967295,I=v+(y<<22&4294967295|y>>>10),y=_+(V^I&(v^V))+A[8]+1770035416&4294967295,_=I+(y<<7&4294967295|y>>>25),y=V+(v^_&(I^v))+A[9]+2336552879&4294967295,V=_+(y<<12&4294967295|y>>>20),y=v+(I^V&(_^I))+A[10]+4294925233&4294967295,v=V+(y<<17&4294967295|y>>>15),y=I+(_^v&(V^_))+A[11]+2304563134&4294967295,I=v+(y<<22&4294967295|y>>>10),y=_+(V^I&(v^V))+A[12]+1804603682&4294967295,_=I+(y<<7&4294967295|y>>>25),y=V+(v^_&(I^v))+A[13]+4254626195&4294967295,V=_+(y<<12&4294967295|y>>>20),y=v+(I^V&(_^I))+A[14]+2792965006&4294967295,v=V+(y<<17&4294967295|y>>>15),y=I+(_^v&(V^_))+A[15]+1236535329&4294967295,I=v+(y<<22&4294967295|y>>>10),y=_+(v^V&(I^v))+A[1]+4129170786&4294967295,_=I+(y<<5&4294967295|y>>>27),y=V+(I^v&(_^I))+A[6]+3225465664&4294967295,V=_+(y<<9&4294967295|y>>>23),y=v+(_^I&(V^_))+A[11]+643717713&4294967295,v=V+(y<<14&4294967295|y>>>18),y=I+(V^_&(v^V))+A[0]+3921069994&4294967295,I=v+(y<<20&4294967295|y>>>12),y=_+(v^V&(I^v))+A[5]+3593408605&4294967295,_=I+(y<<5&4294967295|y>>>27),y=V+(I^v&(_^I))+A[10]+38016083&4294967295,V=_+(y<<9&4294967295|y>>>23),y=v+(_^I&(V^_))+A[15]+3634488961&4294967295,v=V+(y<<14&4294967295|y>>>18),y=I+(V^_&(v^V))+A[4]+3889429448&4294967295,I=v+(y<<20&4294967295|y>>>12),y=_+(v^V&(I^v))+A[9]+568446438&4294967295,_=I+(y<<5&4294967295|y>>>27),y=V+(I^v&(_^I))+A[14]+3275163606&4294967295,V=_+(y<<9&4294967295|y>>>23),y=v+(_^I&(V^_))+A[3]+4107603335&4294967295,v=V+(y<<14&4294967295|y>>>18),y=I+(V^_&(v^V))+A[8]+1163531501&4294967295,I=v+(y<<20&4294967295|y>>>12),y=_+(v^V&(I^v))+A[13]+2850285829&4294967295,_=I+(y<<5&4294967295|y>>>27),y=V+(I^v&(_^I))+A[2]+4243563512&4294967295,V=_+(y<<9&4294967295|y>>>23),y=v+(_^I&(V^_))+A[7]+1735328473&4294967295,v=V+(y<<14&4294967295|y>>>18),y=I+(V^_&(v^V))+A[12]+2368359562&4294967295,I=v+(y<<20&4294967295|y>>>12),y=_+(I^v^V)+A[5]+4294588738&4294967295,_=I+(y<<4&4294967295|y>>>28),y=V+(_^I^v)+A[8]+2272392833&4294967295,V=_+(y<<11&4294967295|y>>>21),y=v+(V^_^I)+A[11]+1839030562&4294967295,v=V+(y<<16&4294967295|y>>>16),y=I+(v^V^_)+A[14]+4259657740&4294967295,I=v+(y<<23&4294967295|y>>>9),y=_+(I^v^V)+A[1]+2763975236&4294967295,_=I+(y<<4&4294967295|y>>>28),y=V+(_^I^v)+A[4]+1272893353&4294967295,V=_+(y<<11&4294967295|y>>>21),y=v+(V^_^I)+A[7]+4139469664&4294967295,v=V+(y<<16&4294967295|y>>>16),y=I+(v^V^_)+A[10]+3200236656&4294967295,I=v+(y<<23&4294967295|y>>>9),y=_+(I^v^V)+A[13]+681279174&4294967295,_=I+(y<<4&4294967295|y>>>28),y=V+(_^I^v)+A[0]+3936430074&4294967295,V=_+(y<<11&4294967295|y>>>21),y=v+(V^_^I)+A[3]+3572445317&4294967295,v=V+(y<<16&4294967295|y>>>16),y=I+(v^V^_)+A[6]+76029189&4294967295,I=v+(y<<23&4294967295|y>>>9),y=_+(I^v^V)+A[9]+3654602809&4294967295,_=I+(y<<4&4294967295|y>>>28),y=V+(_^I^v)+A[12]+3873151461&4294967295,V=_+(y<<11&4294967295|y>>>21),y=v+(V^_^I)+A[15]+530742520&4294967295,v=V+(y<<16&4294967295|y>>>16),y=I+(v^V^_)+A[2]+3299628645&4294967295,I=v+(y<<23&4294967295|y>>>9),y=_+(v^(I|~V))+A[0]+4096336452&4294967295,_=I+(y<<6&4294967295|y>>>26),y=V+(I^(_|~v))+A[7]+1126891415&4294967295,V=_+(y<<10&4294967295|y>>>22),y=v+(_^(V|~I))+A[14]+2878612391&4294967295,v=V+(y<<15&4294967295|y>>>17),y=I+(V^(v|~_))+A[5]+4237533241&4294967295,I=v+(y<<21&4294967295|y>>>11),y=_+(v^(I|~V))+A[12]+1700485571&4294967295,_=I+(y<<6&4294967295|y>>>26),y=V+(I^(_|~v))+A[3]+2399980690&4294967295,V=_+(y<<10&4294967295|y>>>22),y=v+(_^(V|~I))+A[10]+4293915773&4294967295,v=V+(y<<15&4294967295|y>>>17),y=I+(V^(v|~_))+A[1]+2240044497&4294967295,I=v+(y<<21&4294967295|y>>>11),y=_+(v^(I|~V))+A[8]+1873313359&4294967295,_=I+(y<<6&4294967295|y>>>26),y=V+(I^(_|~v))+A[15]+4264355552&4294967295,V=_+(y<<10&4294967295|y>>>22),y=v+(_^(V|~I))+A[6]+2734768916&4294967295,v=V+(y<<15&4294967295|y>>>17),y=I+(V^(v|~_))+A[13]+1309151649&4294967295,I=v+(y<<21&4294967295|y>>>11),y=_+(v^(I|~V))+A[4]+4149444226&4294967295,_=I+(y<<6&4294967295|y>>>26),y=V+(I^(_|~v))+A[11]+3174756917&4294967295,V=_+(y<<10&4294967295|y>>>22),y=v+(_^(V|~I))+A[2]+718787259&4294967295,v=V+(y<<15&4294967295|y>>>17),y=I+(V^(v|~_))+A[9]+3951481745&4294967295,E.g[0]=E.g[0]+_&4294967295,E.g[1]=E.g[1]+(v+(y<<21&4294967295|y>>>11))&4294967295,E.g[2]=E.g[2]+v&4294967295,E.g[3]=E.g[3]+V&4294967295}r.prototype.v=function(E,_){_===void 0&&(_=E.length);const I=_-this.blockSize,A=this.C;let v=this.h,V=0;for(;V<_;){if(v==0)for(;V<=I;)s(this,E,V),V+=this.blockSize;if(typeof E=="string"){for(;V<_;)if(A[v++]=E.charCodeAt(V++),v==this.blockSize){s(this,A),v=0;break}}else for(;V<_;)if(A[v++]=E[V++],v==this.blockSize){s(this,A),v=0;break}}this.h=v,this.o+=_},r.prototype.A=function(){var E=Array((this.h<56?this.blockSize:this.blockSize*2)-this.h);E[0]=128;for(var _=1;_<E.length-8;++_)E[_]=0;_=this.o*8;for(var I=E.length-8;I<E.length;++I)E[I]=_&255,_/=256;for(this.v(E),E=Array(16),_=0,I=0;I<4;++I)for(let A=0;A<32;A+=8)E[_++]=this.g[I]>>>A&255;return E};function i(E,_){var I=c;return Object.prototype.hasOwnProperty.call(I,E)?I[E]:I[E]=_(E)}function o(E,_){this.h=_;const I=[];let A=!0;for(let v=E.length-1;v>=0;v--){const V=E[v]|0;A&&V==_||(I[v]=V,A=!1)}this.g=I}var c={};function u(E){return-128<=E&&E<128?i(E,function(_){return new o([_|0],_<0?-1:0)}):new o([E|0],E<0?-1:0)}function l(E){if(isNaN(E)||!isFinite(E))return p;if(E<0)return k(l(-E));const _=[];let I=1;for(let A=0;E>=I;A++)_[A]=E/I|0,I*=4294967296;return new o(_,0)}function d(E,_){if(E.length==0)throw Error("number format error: empty string");if(_=_||10,_<2||36<_)throw Error("radix out of range: "+_);if(E.charAt(0)=="-")return k(d(E.substring(1),_));if(E.indexOf("-")>=0)throw Error('number format error: interior "-" character');const I=l(Math.pow(_,8));let A=p;for(let V=0;V<E.length;V+=8){var v=Math.min(8,E.length-V);const y=parseInt(E.substring(V,V+v),_);v<8?(v=l(Math.pow(_,v)),A=A.j(v).add(l(y))):(A=A.j(I),A=A.add(l(y)))}return A}var p=u(0),g=u(1),w=u(16777216);n=o.prototype,n.m=function(){if(D(this))return-k(this).m();let E=0,_=1;for(let I=0;I<this.g.length;I++){const A=this.i(I);E+=(A>=0?A:4294967296+A)*_,_*=4294967296}return E},n.toString=function(E){if(E=E||10,E<2||36<E)throw Error("radix out of range: "+E);if(S(this))return"0";if(D(this))return"-"+k(this).toString(E);const _=l(Math.pow(E,6));var I=this;let A="";for(;;){const v=ie(I,_).g;I=$(I,v.j(_));let V=((I.g.length>0?I.g[0]:I.h)>>>0).toString(E);if(I=v,S(I))return V+A;for(;V.length<6;)V="0"+V;A=V+A}},n.i=function(E){return E<0?0:E<this.g.length?this.g[E]:this.h};function S(E){if(E.h!=0)return!1;for(let _=0;_<E.g.length;_++)if(E.g[_]!=0)return!1;return!0}function D(E){return E.h==-1}n.l=function(E){return E=$(this,E),D(E)?-1:S(E)?0:1};function k(E){const _=E.g.length,I=[];for(let A=0;A<_;A++)I[A]=~E.g[A];return new o(I,~E.h).add(g)}n.abs=function(){return D(this)?k(this):this},n.add=function(E){const _=Math.max(this.g.length,E.g.length),I=[];let A=0;for(let v=0;v<=_;v++){let V=A+(this.i(v)&65535)+(E.i(v)&65535),y=(V>>>16)+(this.i(v)>>>16)+(E.i(v)>>>16);A=y>>>16,V&=65535,y&=65535,I[v]=y<<16|V}return new o(I,I[I.length-1]&-2147483648?-1:0)};function $(E,_){return E.add(k(_))}n.j=function(E){if(S(this)||S(E))return p;if(D(this))return D(E)?k(this).j(k(E)):k(k(this).j(E));if(D(E))return k(this.j(k(E)));if(this.l(w)<0&&E.l(w)<0)return l(this.m()*E.m());const _=this.g.length+E.g.length,I=[];for(var A=0;A<2*_;A++)I[A]=0;for(A=0;A<this.g.length;A++)for(let v=0;v<E.g.length;v++){const V=this.i(A)>>>16,y=this.i(A)&65535,Ze=E.i(v)>>>16,nr=E.i(v)&65535;I[2*A+2*v]+=y*nr,z(I,2*A+2*v),I[2*A+2*v+1]+=V*nr,z(I,2*A+2*v+1),I[2*A+2*v+1]+=y*Ze,z(I,2*A+2*v+1),I[2*A+2*v+2]+=V*Ze,z(I,2*A+2*v+2)}for(E=0;E<_;E++)I[E]=I[2*E+1]<<16|I[2*E];for(E=_;E<2*_;E++)I[E]=0;return new o(I,0)};function z(E,_){for(;(E[_]&65535)!=E[_];)E[_+1]+=E[_]>>>16,E[_]&=65535,_++}function G(E,_){this.g=E,this.h=_}function ie(E,_){if(S(_))throw Error("division by zero");if(S(E))return new G(p,p);if(D(E))return _=ie(k(E),_),new G(k(_.g),k(_.h));if(D(_))return _=ie(E,k(_)),new G(k(_.g),_.h);if(E.g.length>30){if(D(E)||D(_))throw Error("slowDivide_ only works with positive integers.");for(var I=g,A=_;A.l(E)<=0;)I=ne(I),A=ne(A);var v=se(I,1),V=se(A,1);for(A=se(A,2),I=se(I,2);!S(A);){var y=V.add(A);y.l(E)<=0&&(v=v.add(I),V=y),A=se(A,1),I=se(I,1)}return _=$(E,v.j(_)),new G(v,_)}for(v=p;E.l(_)>=0;){for(I=Math.max(1,Math.floor(E.m()/_.m())),A=Math.ceil(Math.log(I)/Math.LN2),A=A<=48?1:Math.pow(2,A-48),V=l(I),y=V.j(_);D(y)||y.l(E)>0;)I-=A,V=l(I),y=V.j(_);S(V)&&(V=g),v=v.add(V),E=$(E,y)}return new G(v,E)}n.B=function(E){return ie(this,E).h},n.and=function(E){const _=Math.max(this.g.length,E.g.length),I=[];for(let A=0;A<_;A++)I[A]=this.i(A)&E.i(A);return new o(I,this.h&E.h)},n.or=function(E){const _=Math.max(this.g.length,E.g.length),I=[];for(let A=0;A<_;A++)I[A]=this.i(A)|E.i(A);return new o(I,this.h|E.h)},n.xor=function(E){const _=Math.max(this.g.length,E.g.length),I=[];for(let A=0;A<_;A++)I[A]=this.i(A)^E.i(A);return new o(I,this.h^E.h)};function ne(E){const _=E.g.length+1,I=[];for(let A=0;A<_;A++)I[A]=E.i(A)<<1|E.i(A-1)>>>31;return new o(I,E.h)}function se(E,_){const I=_>>5;_%=32;const A=E.g.length-I,v=[];for(let V=0;V<A;V++)v[V]=_>0?E.i(V+I)>>>_|E.i(V+I+1)<<32-_:E.i(V+I);return new o(v,E.h)}r.prototype.digest=r.prototype.A,r.prototype.reset=r.prototype.u,r.prototype.update=r.prototype.v,Xm=r,o.prototype.add=o.prototype.add,o.prototype.multiply=o.prototype.j,o.prototype.modulo=o.prototype.B,o.prototype.compare=o.prototype.l,o.prototype.toNumber=o.prototype.m,o.prototype.toString=o.prototype.toString,o.prototype.getBits=o.prototype.i,o.fromNumber=l,o.fromString=d,On=o}).apply(typeof Rf<"u"?Rf:typeof self<"u"?self:typeof window<"u"?window:{});var Ko=typeof globalThis<"u"?globalThis:typeof window<"u"?window:typeof global<"u"?global:typeof self<"u"?self:{};/** @license
Copyright The Closure Library Authors.
SPDX-License-Identifier: Apache-2.0
*/var Zm,bi,eg,oa,Au,tg,ng,rg;(function(){var n,e=Object.defineProperty;function t(a){a=[typeof globalThis=="object"&&globalThis,a,typeof window=="object"&&window,typeof self=="object"&&self,typeof Ko=="object"&&Ko];for(var h=0;h<a.length;++h){var f=a[h];if(f&&f.Math==Math)return f}throw Error("Cannot find global object")}var r=t(this);function s(a,h){if(h)e:{var f=r;a=a.split(".");for(var m=0;m<a.length-1;m++){var P=a[m];if(!(P in f))break e;f=f[P]}a=a[a.length-1],m=f[a],h=h(m),h!=m&&h!=null&&e(f,a,{configurable:!0,writable:!0,value:h})}}s("Symbol.dispose",function(a){return a||Symbol("Symbol.dispose")}),s("Array.prototype.values",function(a){return a||function(){return this[Symbol.iterator]()}}),s("Object.entries",function(a){return a||function(h){var f=[],m;for(m in h)Object.prototype.hasOwnProperty.call(h,m)&&f.push([m,h[m]]);return f}});/** @license

 Copyright The Closure Library Authors.
 SPDX-License-Identifier: Apache-2.0
*/var i=i||{},o=this||self;function c(a){var h=typeof a;return h=="object"&&a!=null||h=="function"}function u(a,h,f){return a.call.apply(a.bind,arguments)}function l(a,h,f){return l=u,l.apply(null,arguments)}function d(a,h){var f=Array.prototype.slice.call(arguments,1);return function(){var m=f.slice();return m.push.apply(m,arguments),a.apply(this,m)}}function p(a,h){function f(){}f.prototype=h.prototype,a.Z=h.prototype,a.prototype=new f,a.prototype.constructor=a,a.Ob=function(m,P,C){for(var B=Array(arguments.length-2),Y=2;Y<arguments.length;Y++)B[Y-2]=arguments[Y];return h.prototype[P].apply(m,B)}}var g=typeof AsyncContext<"u"&&typeof AsyncContext.Snapshot=="function"?a=>a&&AsyncContext.Snapshot.wrap(a):a=>a;function w(a){const h=a.length;if(h>0){const f=Array(h);for(let m=0;m<h;m++)f[m]=a[m];return f}return[]}function S(a,h){for(let m=1;m<arguments.length;m++){const P=arguments[m];var f=typeof P;if(f=f!="object"?f:P?Array.isArray(P)?"array":f:"null",f=="array"||f=="object"&&typeof P.length=="number"){f=a.length||0;const C=P.length||0;a.length=f+C;for(let B=0;B<C;B++)a[f+B]=P[B]}else a.push(P)}}class D{constructor(h,f){this.i=h,this.j=f,this.h=0,this.g=null}get(){let h;return this.h>0?(this.h--,h=this.g,this.g=h.next,h.next=null):h=this.i(),h}}function k(a){o.setTimeout(()=>{throw a},0)}function $(){var a=E;let h=null;return a.g&&(h=a.g,a.g=a.g.next,a.g||(a.h=null),h.next=null),h}class z{constructor(){this.h=this.g=null}add(h,f){const m=G.get();m.set(h,f),this.h?this.h.next=m:this.g=m,this.h=m}}var G=new D(()=>new ie,a=>a.reset());class ie{constructor(){this.next=this.g=this.h=null}set(h,f){this.h=h,this.g=f,this.next=null}reset(){this.next=this.g=this.h=null}}let ne,se=!1,E=new z,_=()=>{const a=Promise.resolve(void 0);ne=()=>{a.then(I)}};function I(){for(var a;a=$();){try{a.h.call(a.g)}catch(f){k(f)}var h=G;h.j(a),h.h<100&&(h.h++,a.next=h.g,h.g=a)}se=!1}function A(){this.u=this.u,this.C=this.C}A.prototype.u=!1,A.prototype.dispose=function(){this.u||(this.u=!0,this.N())},A.prototype[Symbol.dispose]=function(){this.dispose()},A.prototype.N=function(){if(this.C)for(;this.C.length;)this.C.shift()()};function v(a,h){this.type=a,this.g=this.target=h,this.defaultPrevented=!1}v.prototype.h=function(){this.defaultPrevented=!0};var V=(function(){if(!o.addEventListener||!Object.defineProperty)return!1;var a=!1,h=Object.defineProperty({},"passive",{get:function(){a=!0}});try{const f=()=>{};o.addEventListener("test",f,h),o.removeEventListener("test",f,h)}catch{}return a})();function y(a){return/^[\s\xa0]*$/.test(a)}function Ze(a,h){v.call(this,a?a.type:""),this.relatedTarget=this.g=this.target=null,this.button=this.screenY=this.screenX=this.clientY=this.clientX=0,this.key="",this.metaKey=this.shiftKey=this.altKey=this.ctrlKey=!1,this.state=null,this.pointerId=0,this.pointerType="",this.i=null,a&&this.init(a,h)}p(Ze,v),Ze.prototype.init=function(a,h){const f=this.type=a.type,m=a.changedTouches&&a.changedTouches.length?a.changedTouches[0]:null;this.target=a.target||a.srcElement,this.g=h,h=a.relatedTarget,h||(f=="mouseover"?h=a.fromElement:f=="mouseout"&&(h=a.toElement)),this.relatedTarget=h,m?(this.clientX=m.clientX!==void 0?m.clientX:m.pageX,this.clientY=m.clientY!==void 0?m.clientY:m.pageY,this.screenX=m.screenX||0,this.screenY=m.screenY||0):(this.clientX=a.clientX!==void 0?a.clientX:a.pageX,this.clientY=a.clientY!==void 0?a.clientY:a.pageY,this.screenX=a.screenX||0,this.screenY=a.screenY||0),this.button=a.button,this.key=a.key||"",this.ctrlKey=a.ctrlKey,this.altKey=a.altKey,this.shiftKey=a.shiftKey,this.metaKey=a.metaKey,this.pointerId=a.pointerId||0,this.pointerType=a.pointerType,this.state=a.state,this.i=a,a.defaultPrevented&&Ze.Z.h.call(this)},Ze.prototype.h=function(){Ze.Z.h.call(this);const a=this.i;a.preventDefault?a.preventDefault():a.returnValue=!1};var nr="closure_listenable_"+(Math.random()*1e6|0),xI=0;function NI(a,h,f,m,P){this.listener=a,this.proxy=null,this.src=h,this.type=f,this.capture=!!m,this.ha=P,this.key=++xI,this.da=this.fa=!1}function Co(a){a.da=!0,a.listener=null,a.proxy=null,a.src=null,a.ha=null}function xo(a,h,f){for(const m in a)h.call(f,a[m],m,a)}function DI(a,h){for(const f in a)h.call(void 0,a[f],f,a)}function Qh(a){const h={};for(const f in a)h[f]=a[f];return h}const Jh="constructor hasOwnProperty isPrototypeOf propertyIsEnumerable toLocaleString toString valueOf".split(" ");function Yh(a,h){let f,m;for(let P=1;P<arguments.length;P++){m=arguments[P];for(f in m)a[f]=m[f];for(let C=0;C<Jh.length;C++)f=Jh[C],Object.prototype.hasOwnProperty.call(m,f)&&(a[f]=m[f])}}function No(a){this.src=a,this.g={},this.h=0}No.prototype.add=function(a,h,f,m,P){const C=a.toString();a=this.g[C],a||(a=this.g[C]=[],this.h++);const B=Oc(a,h,m,P);return B>-1?(h=a[B],f||(h.fa=!1)):(h=new NI(h,this.src,C,!!m,P),h.fa=f,a.push(h)),h};function kc(a,h){const f=h.type;if(f in a.g){var m=a.g[f],P=Array.prototype.indexOf.call(m,h,void 0),C;(C=P>=0)&&Array.prototype.splice.call(m,P,1),C&&(Co(h),a.g[f].length==0&&(delete a.g[f],a.h--))}}function Oc(a,h,f,m){for(let P=0;P<a.length;++P){const C=a[P];if(!C.da&&C.listener==h&&C.capture==!!f&&C.ha==m)return P}return-1}var Lc="closure_lm_"+(Math.random()*1e6|0),Mc={};function Xh(a,h,f,m,P){if(Array.isArray(h)){for(let C=0;C<h.length;C++)Xh(a,h[C],f,m,P);return null}return f=td(f),a&&a[nr]?a.J(h,f,c(m)?!!m.capture:!1,P):kI(a,h,f,!1,m,P)}function kI(a,h,f,m,P,C){if(!h)throw Error("Invalid event type");const B=c(P)?!!P.capture:!!P;let Y=Uc(a);if(Y||(a[Lc]=Y=new No(a)),f=Y.add(h,f,m,B,C),f.proxy)return f;if(m=OI(),f.proxy=m,m.src=a,m.listener=f,a.addEventListener)V||(P=B),P===void 0&&(P=!1),a.addEventListener(h.toString(),m,P);else if(a.attachEvent)a.attachEvent(ed(h.toString()),m);else if(a.addListener&&a.removeListener)a.addListener(m);else throw Error("addEventListener and attachEvent are unavailable.");return f}function OI(){function a(f){return h.call(a.src,a.listener,f)}const h=LI;return a}function Zh(a,h,f,m,P){if(Array.isArray(h))for(var C=0;C<h.length;C++)Zh(a,h[C],f,m,P);else m=c(m)?!!m.capture:!!m,f=td(f),a&&a[nr]?(a=a.i,C=String(h).toString(),C in a.g&&(h=a.g[C],f=Oc(h,f,m,P),f>-1&&(Co(h[f]),Array.prototype.splice.call(h,f,1),h.length==0&&(delete a.g[C],a.h--)))):a&&(a=Uc(a))&&(h=a.g[h.toString()],a=-1,h&&(a=Oc(h,f,m,P)),(f=a>-1?h[a]:null)&&Fc(f))}function Fc(a){if(typeof a!="number"&&a&&!a.da){var h=a.src;if(h&&h[nr])kc(h.i,a);else{var f=a.type,m=a.proxy;h.removeEventListener?h.removeEventListener(f,m,a.capture):h.detachEvent?h.detachEvent(ed(f),m):h.addListener&&h.removeListener&&h.removeListener(m),(f=Uc(h))?(kc(f,a),f.h==0&&(f.src=null,h[Lc]=null)):Co(a)}}}function ed(a){return a in Mc?Mc[a]:Mc[a]="on"+a}function LI(a,h){if(a.da)a=!0;else{h=new Ze(h,this);const f=a.listener,m=a.ha||a.src;a.fa&&Fc(a),a=f.call(m,h)}return a}function Uc(a){return a=a[Lc],a instanceof No?a:null}var Bc="__closure_events_fn_"+(Math.random()*1e9>>>0);function td(a){return typeof a=="function"?a:(a[Bc]||(a[Bc]=function(h){return a.handleEvent(h)}),a[Bc])}function qe(){A.call(this),this.i=new No(this),this.M=this,this.G=null}p(qe,A),qe.prototype[nr]=!0,qe.prototype.removeEventListener=function(a,h,f,m){Zh(this,a,h,f,m)};function Qe(a,h){var f,m=a.G;if(m)for(f=[];m;m=m.G)f.push(m);if(a=a.M,m=h.type||h,typeof h=="string")h=new v(h,a);else if(h instanceof v)h.target=h.target||a;else{var P=h;h=new v(m,a),Yh(h,P)}P=!0;let C,B;if(f)for(B=f.length-1;B>=0;B--)C=h.g=f[B],P=Do(C,m,!0,h)&&P;if(C=h.g=a,P=Do(C,m,!0,h)&&P,P=Do(C,m,!1,h)&&P,f)for(B=0;B<f.length;B++)C=h.g=f[B],P=Do(C,m,!1,h)&&P}qe.prototype.N=function(){if(qe.Z.N.call(this),this.i){var a=this.i;for(const h in a.g){const f=a.g[h];for(let m=0;m<f.length;m++)Co(f[m]);delete a.g[h],a.h--}}this.G=null},qe.prototype.J=function(a,h,f,m){return this.i.add(String(a),h,!1,f,m)},qe.prototype.K=function(a,h,f,m){return this.i.add(String(a),h,!0,f,m)};function Do(a,h,f,m){if(h=a.i.g[String(h)],!h)return!0;h=h.concat();let P=!0;for(let C=0;C<h.length;++C){const B=h[C];if(B&&!B.da&&B.capture==f){const Y=B.listener,Se=B.ha||B.src;B.fa&&kc(a.i,B),P=Y.call(Se,m)!==!1&&P}}return P&&!m.defaultPrevented}function MI(a,h){if(typeof a!="function")if(a&&typeof a.handleEvent=="function")a=l(a.handleEvent,a);else throw Error("Invalid listener argument");return Number(h)>2147483647?-1:o.setTimeout(a,h||0)}function nd(a){a.g=MI(()=>{a.g=null,a.i&&(a.i=!1,nd(a))},a.l);const h=a.h;a.h=null,a.m.apply(null,h)}class FI extends A{constructor(h,f){super(),this.m=h,this.l=f,this.h=null,this.i=!1,this.g=null}j(h){this.h=arguments,this.g?this.i=!0:nd(this)}N(){super.N(),this.g&&(o.clearTimeout(this.g),this.g=null,this.i=!1,this.h=null)}}function ri(a){A.call(this),this.h=a,this.g={}}p(ri,A);var rd=[];function sd(a){xo(a.g,function(h,f){this.g.hasOwnProperty(f)&&Fc(h)},a),a.g={}}ri.prototype.N=function(){ri.Z.N.call(this),sd(this)},ri.prototype.handleEvent=function(){throw Error("EventHandler.handleEvent not implemented")};var qc=o.JSON.stringify,UI=o.JSON.parse,BI=class{stringify(a){return o.JSON.stringify(a,void 0)}parse(a){return o.JSON.parse(a,void 0)}};function id(){}function od(){}var si={OPEN:"a",hb:"b",ERROR:"c",tb:"d"};function $c(){v.call(this,"d")}p($c,v);function jc(){v.call(this,"c")}p(jc,v);var rr={},ad=null;function ko(){return ad=ad||new qe}rr.Ia="serverreachability";function cd(a){v.call(this,rr.Ia,a)}p(cd,v);function ii(a){const h=ko();Qe(h,new cd(h))}rr.STAT_EVENT="statevent";function ud(a,h){v.call(this,rr.STAT_EVENT,a),this.stat=h}p(ud,v);function Je(a){const h=ko();Qe(h,new ud(h,a))}rr.Ja="timingevent";function ld(a,h){v.call(this,rr.Ja,a),this.size=h}p(ld,v);function oi(a,h){if(typeof a!="function")throw Error("Fn must not be null and must be a function");return o.setTimeout(function(){a()},h)}function ai(){this.g=!0}ai.prototype.ua=function(){this.g=!1};function qI(a,h,f,m,P,C){a.info(function(){if(a.g)if(C){var B="",Y=C.split("&");for(let he=0;he<Y.length;he++){var Se=Y[he].split("=");if(Se.length>1){const ke=Se[0];Se=Se[1];const Ct=ke.split("_");B=Ct.length>=2&&Ct[1]=="type"?B+(ke+"="+Se+"&"):B+(ke+"=redacted&")}}}else B=null;else B=C;return"XMLHTTP REQ ("+m+") [attempt "+P+"]: "+h+`
`+f+`
`+B})}function $I(a,h,f,m,P,C,B){a.info(function(){return"XMLHTTP RESP ("+m+") [ attempt "+P+"]: "+h+`
`+f+`
`+C+" "+B})}function Kr(a,h,f,m){a.info(function(){return"XMLHTTP TEXT ("+h+"): "+zI(a,f)+(m?" "+m:"")})}function jI(a,h){a.info(function(){return"TIMEOUT: "+h})}ai.prototype.info=function(){};function zI(a,h){if(!a.g)return h;if(!h)return null;try{const C=JSON.parse(h);if(C){for(a=0;a<C.length;a++)if(Array.isArray(C[a])){var f=C[a];if(!(f.length<2)){var m=f[1];if(Array.isArray(m)&&!(m.length<1)){var P=m[0];if(P!="noop"&&P!="stop"&&P!="close")for(let B=1;B<m.length;B++)m[B]=""}}}}return qc(C)}catch{return h}}var Oo={NO_ERROR:0,cb:1,qb:2,pb:3,kb:4,ob:5,rb:6,Ga:7,TIMEOUT:8,ub:9},hd={ib:"complete",Fb:"success",ERROR:"error",Ga:"abort",xb:"ready",yb:"readystatechange",TIMEOUT:"timeout",sb:"incrementaldata",wb:"progress",lb:"downloadprogress",Nb:"uploadprogress"},dd;function zc(){}p(zc,id),zc.prototype.g=function(){return new XMLHttpRequest},dd=new zc;function ci(a){return encodeURIComponent(String(a))}function GI(a){var h=1;a=a.split(":");const f=[];for(;h>0&&a.length;)f.push(a.shift()),h--;return a.length&&f.push(a.join(":")),f}function mn(a,h,f,m){this.j=a,this.i=h,this.l=f,this.S=m||1,this.V=new ri(this),this.H=45e3,this.J=null,this.o=!1,this.u=this.B=this.A=this.M=this.F=this.T=this.D=null,this.G=[],this.g=null,this.C=0,this.m=this.v=null,this.X=-1,this.K=!1,this.P=0,this.O=null,this.W=this.L=this.U=this.R=!1,this.h=new fd}function fd(){this.i=null,this.g="",this.h=!1}var pd={},Gc={};function Kc(a,h,f){a.M=1,a.A=Mo(Vt(h)),a.u=f,a.R=!0,md(a,null)}function md(a,h){a.F=Date.now(),Lo(a),a.B=Vt(a.A);var f=a.B,m=a.S;Array.isArray(m)||(m=[String(m)]),Sd(f.i,"t",m),a.C=0,f=a.j.L,a.h=new fd,a.g=Kd(a.j,f?h:null,!a.u),a.P>0&&(a.O=new FI(l(a.Y,a,a.g),a.P)),h=a.V,f=a.g,m=a.ba;var P="readystatechange";Array.isArray(P)||(P&&(rd[0]=P.toString()),P=rd);for(let C=0;C<P.length;C++){const B=Xh(f,P[C],m||h.handleEvent,!1,h.h||h);if(!B)break;h.g[B.key]=B}h=a.J?Qh(a.J):{},a.u?(a.v||(a.v="POST"),h["Content-Type"]="application/x-www-form-urlencoded",a.g.ea(a.B,a.v,a.u,h)):(a.v="GET",a.g.ea(a.B,a.v,null,h)),ii(),qI(a.i,a.v,a.B,a.l,a.S,a.u)}mn.prototype.ba=function(a){a=a.target;const h=this.O;h&&yn(a)==3?h.j():this.Y(a)},mn.prototype.Y=function(a){try{if(a==this.g)e:{const Y=yn(this.g),Se=this.g.ya(),he=this.g.ca();if(!(Y<3)&&(Y!=3||this.g&&(this.h.h||this.g.la()||Od(this.g)))){this.K||Y!=4||Se==7||(Se==8||he<=0?ii(3):ii(2)),Wc(this);var h=this.g.ca();this.X=h;var f=KI(this);if(this.o=h==200,$I(this.i,this.v,this.B,this.l,this.S,Y,h),this.o){if(this.U&&!this.L){t:{if(this.g){var m,P=this.g;if((m=P.g?P.g.getResponseHeader("X-HTTP-Initial-Response"):null)&&!y(m)){var C=m;break t}}C=null}if(a=C)Kr(this.i,this.l,a,"Initial handshake response via X-HTTP-Initial-Response"),this.L=!0,Hc(this,a);else{this.o=!1,this.m=3,Je(12),sr(this),ui(this);break e}}if(this.R){a=!0;let ke;for(;!this.K&&this.C<f.length;)if(ke=WI(this,f),ke==Gc){Y==4&&(this.m=4,Je(14),a=!1),Kr(this.i,this.l,null,"[Incomplete Response]");break}else if(ke==pd){this.m=4,Je(15),Kr(this.i,this.l,f,"[Invalid Chunk]"),a=!1;break}else Kr(this.i,this.l,ke,null),Hc(this,ke);if(gd(this)&&this.C!=0&&(this.h.g=this.h.g.slice(this.C),this.C=0),Y!=4||f.length!=0||this.h.h||(this.m=1,Je(16),a=!1),this.o=this.o&&a,!a)Kr(this.i,this.l,f,"[Invalid Chunked Response]"),sr(this),ui(this);else if(f.length>0&&!this.W){this.W=!0;var B=this.j;B.g==this&&B.aa&&!B.P&&(B.j.info("Great, no buffering proxy detected. Bytes received: "+f.length),nu(B),B.P=!0,Je(11))}}else Kr(this.i,this.l,f,null),Hc(this,f);Y==4&&sr(this),this.o&&!this.K&&(Y==4?$d(this.j,this):(this.o=!1,Lo(this)))}else aw(this.g),h==400&&f.indexOf("Unknown SID")>0?(this.m=3,Je(12)):(this.m=0,Je(13)),sr(this),ui(this)}}}catch{}finally{}};function KI(a){if(!gd(a))return a.g.la();const h=Od(a.g);if(h==="")return"";let f="";const m=h.length,P=yn(a.g)==4;if(!a.h.i){if(typeof TextDecoder>"u")return sr(a),ui(a),"";a.h.i=new o.TextDecoder}for(let C=0;C<m;C++)a.h.h=!0,f+=a.h.i.decode(h[C],{stream:!(P&&C==m-1)});return h.length=0,a.h.g+=f,a.C=0,a.h.g}function gd(a){return a.g?a.v=="GET"&&a.M!=2&&a.j.Aa:!1}function WI(a,h){var f=a.C,m=h.indexOf(`
`,f);return m==-1?Gc:(f=Number(h.substring(f,m)),isNaN(f)?pd:(m+=1,m+f>h.length?Gc:(h=h.slice(m,m+f),a.C=m+f,h)))}mn.prototype.cancel=function(){this.K=!0,sr(this)};function Lo(a){a.T=Date.now()+a.H,_d(a,a.H)}function _d(a,h){if(a.D!=null)throw Error("WatchDog timer not null");a.D=oi(l(a.aa,a),h)}function Wc(a){a.D&&(o.clearTimeout(a.D),a.D=null)}mn.prototype.aa=function(){this.D=null;const a=Date.now();a-this.T>=0?(jI(this.i,this.B),this.M!=2&&(ii(),Je(17)),sr(this),this.m=2,ui(this)):_d(this,this.T-a)};function ui(a){a.j.I==0||a.K||$d(a.j,a)}function sr(a){Wc(a);var h=a.O;h&&typeof h.dispose=="function"&&h.dispose(),a.O=null,sd(a.V),a.g&&(h=a.g,a.g=null,h.abort(),h.dispose())}function Hc(a,h){try{var f=a.j;if(f.I!=0&&(f.g==a||Qc(f.h,a))){if(!a.L&&Qc(f.h,a)&&f.I==3){try{var m=f.Ba.g.parse(h)}catch{m=null}if(Array.isArray(m)&&m.length==3){var P=m;if(P[0]==0){e:if(!f.v){if(f.g)if(f.g.F+3e3<a.F)$o(f),Bo(f);else break e;tu(f),Je(18)}}else f.xa=P[1],0<f.xa-f.K&&P[2]<37500&&f.F&&f.A==0&&!f.C&&(f.C=oi(l(f.Va,f),6e3));wd(f.h)<=1&&f.ta&&(f.ta=void 0)}else or(f,11)}else if((a.L||f.g==a)&&$o(f),!y(h))for(P=f.Ba.g.parse(h),h=0;h<P.length;h++){let he=P[h];const ke=he[0];if(!(ke<=f.K))if(f.K=ke,he=he[1],f.I==2)if(he[0]=="c"){f.M=he[1],f.ba=he[2];const Ct=he[3];Ct!=null&&(f.ka=Ct,f.j.info("VER="+f.ka));const ar=he[4];ar!=null&&(f.za=ar,f.j.info("SVER="+f.za));const In=he[5];In!=null&&typeof In=="number"&&In>0&&(m=1.5*In,f.O=m,f.j.info("backChannelRequestTimeoutMs_="+m)),m=f;const wn=a.g;if(wn){const zo=wn.g?wn.g.getResponseHeader("X-Client-Wire-Protocol"):null;if(zo){var C=m.h;C.g||zo.indexOf("spdy")==-1&&zo.indexOf("quic")==-1&&zo.indexOf("h2")==-1||(C.j=C.l,C.g=new Set,C.h&&(Jc(C,C.h),C.h=null))}if(m.G){const ru=wn.g?wn.g.getResponseHeader("X-HTTP-Session-Id"):null;ru&&(m.wa=ru,me(m.J,m.G,ru))}}f.I=3,f.l&&f.l.ra(),f.aa&&(f.T=Date.now()-a.F,f.j.info("Handshake RTT: "+f.T+"ms")),m=f;var B=a;if(m.na=Gd(m,m.L?m.ba:null,m.W),B.L){Td(m.h,B);var Y=B,Se=m.O;Se&&(Y.H=Se),Y.D&&(Wc(Y),Lo(Y)),m.g=B}else Bd(m);f.i.length>0&&qo(f)}else he[0]!="stop"&&he[0]!="close"||or(f,7);else f.I==3&&(he[0]=="stop"||he[0]=="close"?he[0]=="stop"?or(f,7):eu(f):he[0]!="noop"&&f.l&&f.l.qa(he),f.A=0)}}ii(4)}catch{}}var HI=class{constructor(a,h){this.g=a,this.map=h}};function yd(a){this.l=a||10,o.PerformanceNavigationTiming?(a=o.performance.getEntriesByType("navigation"),a=a.length>0&&(a[0].nextHopProtocol=="hq"||a[0].nextHopProtocol=="h2")):a=!!(o.chrome&&o.chrome.loadTimes&&o.chrome.loadTimes()&&o.chrome.loadTimes().wasFetchedViaSpdy),this.j=a?this.l:1,this.g=null,this.j>1&&(this.g=new Set),this.h=null,this.i=[]}function Id(a){return a.h?!0:a.g?a.g.size>=a.j:!1}function wd(a){return a.h?1:a.g?a.g.size:0}function Qc(a,h){return a.h?a.h==h:a.g?a.g.has(h):!1}function Jc(a,h){a.g?a.g.add(h):a.h=h}function Td(a,h){a.h&&a.h==h?a.h=null:a.g&&a.g.has(h)&&a.g.delete(h)}yd.prototype.cancel=function(){if(this.i=Ed(this),this.h)this.h.cancel(),this.h=null;else if(this.g&&this.g.size!==0){for(const a of this.g.values())a.cancel();this.g.clear()}};function Ed(a){if(a.h!=null)return a.i.concat(a.h.G);if(a.g!=null&&a.g.size!==0){let h=a.i;for(const f of a.g.values())h=h.concat(f.G);return h}return w(a.i)}var vd=RegExp("^(?:([^:/?#.]+):)?(?://(?:([^\\\\/?#]*)@)?([^\\\\/?#]*?)(?::([0-9]+))?(?=[\\\\/?#]|$))?([^?#]+)?(?:\\?([^#]*))?(?:#([\\s\\S]*))?$");function QI(a,h){if(a){a=a.split("&");for(let f=0;f<a.length;f++){const m=a[f].indexOf("=");let P,C=null;m>=0?(P=a[f].substring(0,m),C=a[f].substring(m+1)):P=a[f],h(P,C?decodeURIComponent(C.replace(/\+/g," ")):"")}}}function gn(a){this.g=this.o=this.j="",this.u=null,this.m=this.h="",this.l=!1;let h;a instanceof gn?(this.l=a.l,li(this,a.j),this.o=a.o,this.g=a.g,hi(this,a.u),this.h=a.h,Yc(this,Vd(a.i)),this.m=a.m):a&&(h=String(a).match(vd))?(this.l=!1,li(this,h[1]||"",!0),this.o=di(h[2]||""),this.g=di(h[3]||"",!0),hi(this,h[4]),this.h=di(h[5]||"",!0),Yc(this,h[6]||"",!0),this.m=di(h[7]||"")):(this.l=!1,this.i=new pi(null,this.l))}gn.prototype.toString=function(){const a=[];var h=this.j;h&&a.push(fi(h,Ad,!0),":");var f=this.g;return(f||h=="file")&&(a.push("//"),(h=this.o)&&a.push(fi(h,Ad,!0),"@"),a.push(ci(f).replace(/%25([0-9a-fA-F]{2})/g,"%$1")),f=this.u,f!=null&&a.push(":",String(f))),(f=this.h)&&(this.g&&f.charAt(0)!="/"&&a.push("/"),a.push(fi(f,f.charAt(0)=="/"?XI:YI,!0))),(f=this.i.toString())&&a.push("?",f),(f=this.m)&&a.push("#",fi(f,ew)),a.join("")},gn.prototype.resolve=function(a){const h=Vt(this);let f=!!a.j;f?li(h,a.j):f=!!a.o,f?h.o=a.o:f=!!a.g,f?h.g=a.g:f=a.u!=null;var m=a.h;if(f)hi(h,a.u);else if(f=!!a.h){if(m.charAt(0)!="/")if(this.g&&!this.h)m="/"+m;else{var P=h.h.lastIndexOf("/");P!=-1&&(m=h.h.slice(0,P+1)+m)}if(P=m,P==".."||P==".")m="";else if(P.indexOf("./")!=-1||P.indexOf("/.")!=-1){m=P.lastIndexOf("/",0)==0,P=P.split("/");const C=[];for(let B=0;B<P.length;){const Y=P[B++];Y=="."?m&&B==P.length&&C.push(""):Y==".."?((C.length>1||C.length==1&&C[0]!="")&&C.pop(),m&&B==P.length&&C.push("")):(C.push(Y),m=!0)}m=C.join("/")}else m=P}return f?h.h=m:f=a.i.toString()!=="",f?Yc(h,Vd(a.i)):f=!!a.m,f&&(h.m=a.m),h};function Vt(a){return new gn(a)}function li(a,h,f){a.j=f?di(h,!0):h,a.j&&(a.j=a.j.replace(/:$/,""))}function hi(a,h){if(h){if(h=Number(h),isNaN(h)||h<0)throw Error("Bad port number "+h);a.u=h}else a.u=null}function Yc(a,h,f){h instanceof pi?(a.i=h,tw(a.i,a.l)):(f||(h=fi(h,ZI)),a.i=new pi(h,a.l))}function me(a,h,f){a.i.set(h,f)}function Mo(a){return me(a,"zx",Math.floor(Math.random()*2147483648).toString(36)+Math.abs(Math.floor(Math.random()*2147483648)^Date.now()).toString(36)),a}function di(a,h){return a?h?decodeURI(a.replace(/%25/g,"%2525")):decodeURIComponent(a):""}function fi(a,h,f){return typeof a=="string"?(a=encodeURI(a).replace(h,JI),f&&(a=a.replace(/%25([0-9a-fA-F]{2})/g,"%$1")),a):null}function JI(a){return a=a.charCodeAt(0),"%"+(a>>4&15).toString(16)+(a&15).toString(16)}var Ad=/[#\/\?@]/g,YI=/[#\?:]/g,XI=/[#\?]/g,ZI=/[#\?@]/g,ew=/#/g;function pi(a,h){this.h=this.g=null,this.i=a||null,this.j=!!h}function ir(a){a.g||(a.g=new Map,a.h=0,a.i&&QI(a.i,function(h,f){a.add(decodeURIComponent(h.replace(/\+/g," ")),f)}))}n=pi.prototype,n.add=function(a,h){ir(this),this.i=null,a=Wr(this,a);let f=this.g.get(a);return f||this.g.set(a,f=[]),f.push(h),this.h+=1,this};function Rd(a,h){ir(a),h=Wr(a,h),a.g.has(h)&&(a.i=null,a.h-=a.g.get(h).length,a.g.delete(h))}function Pd(a,h){return ir(a),h=Wr(a,h),a.g.has(h)}n.forEach=function(a,h){ir(this),this.g.forEach(function(f,m){f.forEach(function(P){a.call(h,P,m,this)},this)},this)};function bd(a,h){ir(a);let f=[];if(typeof h=="string")Pd(a,h)&&(f=f.concat(a.g.get(Wr(a,h))));else for(a=Array.from(a.g.values()),h=0;h<a.length;h++)f=f.concat(a[h]);return f}n.set=function(a,h){return ir(this),this.i=null,a=Wr(this,a),Pd(this,a)&&(this.h-=this.g.get(a).length),this.g.set(a,[h]),this.h+=1,this},n.get=function(a,h){return a?(a=bd(this,a),a.length>0?String(a[0]):h):h};function Sd(a,h,f){Rd(a,h),f.length>0&&(a.i=null,a.g.set(Wr(a,h),w(f)),a.h+=f.length)}n.toString=function(){if(this.i)return this.i;if(!this.g)return"";const a=[],h=Array.from(this.g.keys());for(let m=0;m<h.length;m++){var f=h[m];const P=ci(f);f=bd(this,f);for(let C=0;C<f.length;C++){let B=P;f[C]!==""&&(B+="="+ci(f[C])),a.push(B)}}return this.i=a.join("&")};function Vd(a){const h=new pi;return h.i=a.i,a.g&&(h.g=new Map(a.g),h.h=a.h),h}function Wr(a,h){return h=String(h),a.j&&(h=h.toLowerCase()),h}function tw(a,h){h&&!a.j&&(ir(a),a.i=null,a.g.forEach(function(f,m){const P=m.toLowerCase();m!=P&&(Rd(this,m),Sd(this,P,f))},a)),a.j=h}function nw(a,h){const f=new ai;if(o.Image){const m=new Image;m.onload=d(_n,f,"TestLoadImage: loaded",!0,h,m),m.onerror=d(_n,f,"TestLoadImage: error",!1,h,m),m.onabort=d(_n,f,"TestLoadImage: abort",!1,h,m),m.ontimeout=d(_n,f,"TestLoadImage: timeout",!1,h,m),o.setTimeout(function(){m.ontimeout&&m.ontimeout()},1e4),m.src=a}else h(!1)}function rw(a,h){const f=new ai,m=new AbortController,P=setTimeout(()=>{m.abort(),_n(f,"TestPingServer: timeout",!1,h)},1e4);fetch(a,{signal:m.signal}).then(C=>{clearTimeout(P),C.ok?_n(f,"TestPingServer: ok",!0,h):_n(f,"TestPingServer: server error",!1,h)}).catch(()=>{clearTimeout(P),_n(f,"TestPingServer: error",!1,h)})}function _n(a,h,f,m,P){try{P&&(P.onload=null,P.onerror=null,P.onabort=null,P.ontimeout=null),m(f)}catch{}}function sw(){this.g=new BI}function Xc(a){this.i=a.Sb||null,this.h=a.ab||!1}p(Xc,id),Xc.prototype.g=function(){return new Fo(this.i,this.h)};function Fo(a,h){qe.call(this),this.H=a,this.o=h,this.m=void 0,this.status=this.readyState=0,this.responseType=this.responseText=this.response=this.statusText="",this.onreadystatechange=null,this.A=new Headers,this.h=null,this.F="GET",this.D="",this.g=!1,this.B=this.j=this.l=null,this.v=new AbortController}p(Fo,qe),n=Fo.prototype,n.open=function(a,h){if(this.readyState!=0)throw this.abort(),Error("Error reopening a connection");this.F=a,this.D=h,this.readyState=1,gi(this)},n.send=function(a){if(this.readyState!=1)throw this.abort(),Error("need to call open() first. ");if(this.v.signal.aborted)throw this.abort(),Error("Request was aborted.");this.g=!0;const h={headers:this.A,method:this.F,credentials:this.m,cache:void 0,signal:this.v.signal};a&&(h.body=a),(this.H||o).fetch(new Request(this.D,h)).then(this.Pa.bind(this),this.ga.bind(this))},n.abort=function(){this.response=this.responseText="",this.A=new Headers,this.status=0,this.v.abort(),this.j&&this.j.cancel("Request was aborted.").catch(()=>{}),this.readyState>=1&&this.g&&this.readyState!=4&&(this.g=!1,mi(this)),this.readyState=0},n.Pa=function(a){if(this.g&&(this.l=a,this.h||(this.status=this.l.status,this.statusText=this.l.statusText,this.h=a.headers,this.readyState=2,gi(this)),this.g&&(this.readyState=3,gi(this),this.g)))if(this.responseType==="arraybuffer")a.arrayBuffer().then(this.Na.bind(this),this.ga.bind(this));else if(typeof o.ReadableStream<"u"&&"body"in a){if(this.j=a.body.getReader(),this.o){if(this.responseType)throw Error('responseType must be empty for "streamBinaryChunks" mode responses.');this.response=[]}else this.response=this.responseText="",this.B=new TextDecoder;Cd(this)}else a.text().then(this.Oa.bind(this),this.ga.bind(this))};function Cd(a){a.j.read().then(a.Ma.bind(a)).catch(a.ga.bind(a))}n.Ma=function(a){if(this.g){if(this.o&&a.value)this.response.push(a.value);else if(!this.o){var h=a.value?a.value:new Uint8Array(0);(h=this.B.decode(h,{stream:!a.done}))&&(this.response=this.responseText+=h)}a.done?mi(this):gi(this),this.readyState==3&&Cd(this)}},n.Oa=function(a){this.g&&(this.response=this.responseText=a,mi(this))},n.Na=function(a){this.g&&(this.response=a,mi(this))},n.ga=function(){this.g&&mi(this)};function mi(a){a.readyState=4,a.l=null,a.j=null,a.B=null,gi(a)}n.setRequestHeader=function(a,h){this.A.append(a,h)},n.getResponseHeader=function(a){return this.h&&this.h.get(a.toLowerCase())||""},n.getAllResponseHeaders=function(){if(!this.h)return"";const a=[],h=this.h.entries();for(var f=h.next();!f.done;)f=f.value,a.push(f[0]+": "+f[1]),f=h.next();return a.join(`\r
`)};function gi(a){a.onreadystatechange&&a.onreadystatechange.call(a)}Object.defineProperty(Fo.prototype,"withCredentials",{get:function(){return this.m==="include"},set:function(a){this.m=a?"include":"same-origin"}});function xd(a){let h="";return xo(a,function(f,m){h+=m,h+=":",h+=f,h+=`\r
`}),h}function Zc(a,h,f){e:{for(m in f){var m=!1;break e}m=!0}m||(f=xd(f),typeof a=="string"?f!=null&&ci(f):me(a,h,f))}function we(a){qe.call(this),this.headers=new Map,this.L=a||null,this.h=!1,this.g=null,this.D="",this.o=0,this.l="",this.j=this.B=this.v=this.A=!1,this.m=null,this.F="",this.H=!1}p(we,qe);var iw=/^https?$/i,ow=["POST","PUT"];n=we.prototype,n.Fa=function(a){this.H=a},n.ea=function(a,h,f,m){if(this.g)throw Error("[goog.net.XhrIo] Object is active with another request="+this.D+"; newUri="+a);h=h?h.toUpperCase():"GET",this.D=a,this.l="",this.o=0,this.A=!1,this.h=!0,this.g=this.L?this.L.g():dd.g(),this.g.onreadystatechange=g(l(this.Ca,this));try{this.B=!0,this.g.open(h,String(a),!0),this.B=!1}catch(C){Nd(this,C);return}if(a=f||"",f=new Map(this.headers),m)if(Object.getPrototypeOf(m)===Object.prototype)for(var P in m)f.set(P,m[P]);else if(typeof m.keys=="function"&&typeof m.get=="function")for(const C of m.keys())f.set(C,m.get(C));else throw Error("Unknown input type for opt_headers: "+String(m));m=Array.from(f.keys()).find(C=>C.toLowerCase()=="content-type"),P=o.FormData&&a instanceof o.FormData,!(Array.prototype.indexOf.call(ow,h,void 0)>=0)||m||P||f.set("Content-Type","application/x-www-form-urlencoded;charset=utf-8");for(const[C,B]of f)this.g.setRequestHeader(C,B);this.F&&(this.g.responseType=this.F),"withCredentials"in this.g&&this.g.withCredentials!==this.H&&(this.g.withCredentials=this.H);try{this.m&&(clearTimeout(this.m),this.m=null),this.v=!0,this.g.send(a),this.v=!1}catch(C){Nd(this,C)}};function Nd(a,h){a.h=!1,a.g&&(a.j=!0,a.g.abort(),a.j=!1),a.l=h,a.o=5,Dd(a),Uo(a)}function Dd(a){a.A||(a.A=!0,Qe(a,"complete"),Qe(a,"error"))}n.abort=function(a){this.g&&this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1,this.o=a||7,Qe(this,"complete"),Qe(this,"abort"),Uo(this))},n.N=function(){this.g&&(this.h&&(this.h=!1,this.j=!0,this.g.abort(),this.j=!1),Uo(this,!0)),we.Z.N.call(this)},n.Ca=function(){this.u||(this.B||this.v||this.j?kd(this):this.Xa())},n.Xa=function(){kd(this)};function kd(a){if(a.h&&typeof i<"u"){if(a.v&&yn(a)==4)setTimeout(a.Ca.bind(a),0);else if(Qe(a,"readystatechange"),yn(a)==4){a.h=!1;try{const C=a.ca();e:switch(C){case 200:case 201:case 202:case 204:case 206:case 304:case 1223:var h=!0;break e;default:h=!1}var f;if(!(f=h)){var m;if(m=C===0){let B=String(a.D).match(vd)[1]||null;!B&&o.self&&o.self.location&&(B=o.self.location.protocol.slice(0,-1)),m=!iw.test(B?B.toLowerCase():"")}f=m}if(f)Qe(a,"complete"),Qe(a,"success");else{a.o=6;try{var P=yn(a)>2?a.g.statusText:""}catch{P=""}a.l=P+" ["+a.ca()+"]",Dd(a)}}finally{Uo(a)}}}}function Uo(a,h){if(a.g){a.m&&(clearTimeout(a.m),a.m=null);const f=a.g;a.g=null,h||Qe(a,"ready");try{f.onreadystatechange=null}catch{}}}n.isActive=function(){return!!this.g};function yn(a){return a.g?a.g.readyState:0}n.ca=function(){try{return yn(this)>2?this.g.status:-1}catch{return-1}},n.la=function(){try{return this.g?this.g.responseText:""}catch{return""}},n.La=function(a){if(this.g){var h=this.g.responseText;return a&&h.indexOf(a)==0&&(h=h.substring(a.length)),UI(h)}};function Od(a){try{if(!a.g)return null;if("response"in a.g)return a.g.response;switch(a.F){case"":case"text":return a.g.responseText;case"arraybuffer":if("mozResponseArrayBuffer"in a.g)return a.g.mozResponseArrayBuffer}return null}catch{return null}}function aw(a){const h={};a=(a.g&&yn(a)>=2&&a.g.getAllResponseHeaders()||"").split(`\r
`);for(let m=0;m<a.length;m++){if(y(a[m]))continue;var f=GI(a[m]);const P=f[0];if(f=f[1],typeof f!="string")continue;f=f.trim();const C=h[P]||[];h[P]=C,C.push(f)}DI(h,function(m){return m.join(", ")})}n.ya=function(){return this.o},n.Ha=function(){return typeof this.l=="string"?this.l:String(this.l)};function _i(a,h,f){return f&&f.internalChannelParams&&f.internalChannelParams[a]||h}function Ld(a){this.za=0,this.i=[],this.j=new ai,this.ba=this.na=this.J=this.W=this.g=this.wa=this.G=this.H=this.u=this.U=this.o=null,this.Ya=this.V=0,this.Sa=_i("failFast",!1,a),this.F=this.C=this.v=this.m=this.l=null,this.X=!0,this.xa=this.K=-1,this.Y=this.A=this.D=0,this.Qa=_i("baseRetryDelayMs",5e3,a),this.Za=_i("retryDelaySeedMs",1e4,a),this.Ta=_i("forwardChannelMaxRetries",2,a),this.va=_i("forwardChannelRequestTimeoutMs",2e4,a),this.ma=a&&a.xmlHttpFactory||void 0,this.Ua=a&&a.Rb||void 0,this.Aa=a&&a.useFetchStreams||!1,this.O=void 0,this.L=a&&a.supportsCrossDomainXhr||!1,this.M="",this.h=new yd(a&&a.concurrentRequestLimit),this.Ba=new sw,this.S=a&&a.fastHandshake||!1,this.R=a&&a.encodeInitMessageHeaders||!1,this.S&&this.R&&(this.R=!1),this.Ra=a&&a.Pb||!1,a&&a.ua&&this.j.ua(),a&&a.forceLongPolling&&(this.X=!1),this.aa=!this.S&&this.X&&a&&a.detectBufferingProxy||!1,this.ia=void 0,a&&a.longPollingTimeout&&a.longPollingTimeout>0&&(this.ia=a.longPollingTimeout),this.ta=void 0,this.T=0,this.P=!1,this.ja=this.B=null}n=Ld.prototype,n.ka=8,n.I=1,n.connect=function(a,h,f,m){Je(0),this.W=a,this.H=h||{},f&&m!==void 0&&(this.H.OSID=f,this.H.OAID=m),this.F=this.X,this.J=Gd(this,null,this.W),qo(this)};function eu(a){if(Md(a),a.I==3){var h=a.V++,f=Vt(a.J);if(me(f,"SID",a.M),me(f,"RID",h),me(f,"TYPE","terminate"),yi(a,f),h=new mn(a,a.j,h),h.M=2,h.A=Mo(Vt(f)),f=!1,o.navigator&&o.navigator.sendBeacon)try{f=o.navigator.sendBeacon(h.A.toString(),"")}catch{}!f&&o.Image&&(new Image().src=h.A,f=!0),f||(h.g=Kd(h.j,null),h.g.ea(h.A)),h.F=Date.now(),Lo(h)}zd(a)}function Bo(a){a.g&&(nu(a),a.g.cancel(),a.g=null)}function Md(a){Bo(a),a.v&&(o.clearTimeout(a.v),a.v=null),$o(a),a.h.cancel(),a.m&&(typeof a.m=="number"&&o.clearTimeout(a.m),a.m=null)}function qo(a){if(!Id(a.h)&&!a.m){a.m=!0;var h=a.Ea;ne||_(),se||(ne(),se=!0),E.add(h,a),a.D=0}}function cw(a,h){return wd(a.h)>=a.h.j-(a.m?1:0)?!1:a.m?(a.i=h.G.concat(a.i),!0):a.I==1||a.I==2||a.D>=(a.Sa?0:a.Ta)?!1:(a.m=oi(l(a.Ea,a,h),jd(a,a.D)),a.D++,!0)}n.Ea=function(a){if(this.m)if(this.m=null,this.I==1){if(!a){this.V=Math.floor(Math.random()*1e5),a=this.V++;const P=new mn(this,this.j,a);let C=this.o;if(this.U&&(C?(C=Qh(C),Yh(C,this.U)):C=this.U),this.u!==null||this.R||(P.J=C,C=null),this.S)e:{for(var h=0,f=0;f<this.i.length;f++){t:{var m=this.i[f];if("__data__"in m.map&&(m=m.map.__data__,typeof m=="string")){m=m.length;break t}m=void 0}if(m===void 0)break;if(h+=m,h>4096){h=f;break e}if(h===4096||f===this.i.length-1){h=f+1;break e}}h=1e3}else h=1e3;h=Ud(this,P,h),f=Vt(this.J),me(f,"RID",a),me(f,"CVER",22),this.G&&me(f,"X-HTTP-Session-Id",this.G),yi(this,f),C&&(this.R?h="headers="+ci(xd(C))+"&"+h:this.u&&Zc(f,this.u,C)),Jc(this.h,P),this.Ra&&me(f,"TYPE","init"),this.S?(me(f,"$req",h),me(f,"SID","null"),P.U=!0,Kc(P,f,null)):Kc(P,f,h),this.I=2}}else this.I==3&&(a?Fd(this,a):this.i.length==0||Id(this.h)||Fd(this))};function Fd(a,h){var f;h?f=h.l:f=a.V++;const m=Vt(a.J);me(m,"SID",a.M),me(m,"RID",f),me(m,"AID",a.K),yi(a,m),a.u&&a.o&&Zc(m,a.u,a.o),f=new mn(a,a.j,f,a.D+1),a.u===null&&(f.J=a.o),h&&(a.i=h.G.concat(a.i)),h=Ud(a,f,1e3),f.H=Math.round(a.va*.5)+Math.round(a.va*.5*Math.random()),Jc(a.h,f),Kc(f,m,h)}function yi(a,h){a.H&&xo(a.H,function(f,m){me(h,m,f)}),a.l&&xo({},function(f,m){me(h,m,f)})}function Ud(a,h,f){f=Math.min(a.i.length,f);const m=a.l?l(a.l.Ka,a.l,a):null;e:{var P=a.i;let Y=-1;for(;;){const Se=["count="+f];Y==-1?f>0?(Y=P[0].g,Se.push("ofs="+Y)):Y=0:Se.push("ofs="+Y);let he=!0;for(let ke=0;ke<f;ke++){var C=P[ke].g;const Ct=P[ke].map;if(C-=Y,C<0)Y=Math.max(0,P[ke].g-100),he=!1;else try{C="req"+C+"_"||"";try{var B=Ct instanceof Map?Ct:Object.entries(Ct);for(const[ar,In]of B){let wn=In;c(In)&&(wn=qc(In)),Se.push(C+ar+"="+encodeURIComponent(wn))}}catch(ar){throw Se.push(C+"type="+encodeURIComponent("_badmap")),ar}}catch{m&&m(Ct)}}if(he){B=Se.join("&");break e}}B=void 0}return a=a.i.splice(0,f),h.G=a,B}function Bd(a){if(!a.g&&!a.v){a.Y=1;var h=a.Da;ne||_(),se||(ne(),se=!0),E.add(h,a),a.A=0}}function tu(a){return a.g||a.v||a.A>=3?!1:(a.Y++,a.v=oi(l(a.Da,a),jd(a,a.A)),a.A++,!0)}n.Da=function(){if(this.v=null,qd(this),this.aa&&!(this.P||this.g==null||this.T<=0)){var a=4*this.T;this.j.info("BP detection timer enabled: "+a),this.B=oi(l(this.Wa,this),a)}},n.Wa=function(){this.B&&(this.B=null,this.j.info("BP detection timeout reached."),this.j.info("Buffering proxy detected and switch to long-polling!"),this.F=!1,this.P=!0,Je(10),Bo(this),qd(this))};function nu(a){a.B!=null&&(o.clearTimeout(a.B),a.B=null)}function qd(a){a.g=new mn(a,a.j,"rpc",a.Y),a.u===null&&(a.g.J=a.o),a.g.P=0;var h=Vt(a.na);me(h,"RID","rpc"),me(h,"SID",a.M),me(h,"AID",a.K),me(h,"CI",a.F?"0":"1"),!a.F&&a.ia&&me(h,"TO",a.ia),me(h,"TYPE","xmlhttp"),yi(a,h),a.u&&a.o&&Zc(h,a.u,a.o),a.O&&(a.g.H=a.O);var f=a.g;a=a.ba,f.M=1,f.A=Mo(Vt(h)),f.u=null,f.R=!0,md(f,a)}n.Va=function(){this.C!=null&&(this.C=null,Bo(this),tu(this),Je(19))};function $o(a){a.C!=null&&(o.clearTimeout(a.C),a.C=null)}function $d(a,h){var f=null;if(a.g==h){$o(a),nu(a),a.g=null;var m=2}else if(Qc(a.h,h))f=h.G,Td(a.h,h),m=1;else return;if(a.I!=0){if(h.o)if(m==1){f=h.u?h.u.length:0,h=Date.now()-h.F;var P=a.D;m=ko(),Qe(m,new ld(m,f)),qo(a)}else Bd(a);else if(P=h.m,P==3||P==0&&h.X>0||!(m==1&&cw(a,h)||m==2&&tu(a)))switch(f&&f.length>0&&(h=a.h,h.i=h.i.concat(f)),P){case 1:or(a,5);break;case 4:or(a,10);break;case 3:or(a,6);break;default:or(a,2)}}}function jd(a,h){let f=a.Qa+Math.floor(Math.random()*a.Za);return a.isActive()||(f*=2),f*h}function or(a,h){if(a.j.info("Error code "+h),h==2){var f=l(a.bb,a),m=a.Ua;const P=!m;m=new gn(m||"//www.google.com/images/cleardot.gif"),o.location&&o.location.protocol=="http"||li(m,"https"),Mo(m),P?nw(m.toString(),f):rw(m.toString(),f)}else Je(2);a.I=0,a.l&&a.l.pa(h),zd(a),Md(a)}n.bb=function(a){a?(this.j.info("Successfully pinged google.com"),Je(2)):(this.j.info("Failed to ping google.com"),Je(1))};function zd(a){if(a.I=0,a.ja=[],a.l){const h=Ed(a.h);(h.length!=0||a.i.length!=0)&&(S(a.ja,h),S(a.ja,a.i),a.h.i.length=0,w(a.i),a.i.length=0),a.l.oa()}}function Gd(a,h,f){var m=f instanceof gn?Vt(f):new gn(f);if(m.g!="")h&&(m.g=h+"."+m.g),hi(m,m.u);else{var P=o.location;m=P.protocol,h=h?h+"."+P.hostname:P.hostname,P=+P.port;const C=new gn(null);m&&li(C,m),h&&(C.g=h),P&&hi(C,P),f&&(C.h=f),m=C}return f=a.G,h=a.wa,f&&h&&me(m,f,h),me(m,"VER",a.ka),yi(a,m),m}function Kd(a,h,f){if(h&&!a.L)throw Error("Can't create secondary domain capable XhrIo object.");return h=a.Aa&&!a.ma?new we(new Xc({ab:f})):new we(a.ma),h.Fa(a.L),h}n.isActive=function(){return!!this.l&&this.l.isActive(this)};function Wd(){}n=Wd.prototype,n.ra=function(){},n.qa=function(){},n.pa=function(){},n.oa=function(){},n.isActive=function(){return!0},n.Ka=function(){};function jo(){}jo.prototype.g=function(a,h){return new at(a,h)};function at(a,h){qe.call(this),this.g=new Ld(h),this.l=a,this.h=h&&h.messageUrlParams||null,a=h&&h.messageHeaders||null,h&&h.clientProtocolHeaderRequired&&(a?a["X-Client-Protocol"]="webchannel":a={"X-Client-Protocol":"webchannel"}),this.g.o=a,a=h&&h.initMessageHeaders||null,h&&h.messageContentType&&(a?a["X-WebChannel-Content-Type"]=h.messageContentType:a={"X-WebChannel-Content-Type":h.messageContentType}),h&&h.sa&&(a?a["X-WebChannel-Client-Profile"]=h.sa:a={"X-WebChannel-Client-Profile":h.sa}),this.g.U=a,(a=h&&h.Qb)&&!y(a)&&(this.g.u=a),this.A=h&&h.supportsCrossDomainXhr||!1,this.v=h&&h.sendRawJson||!1,(h=h&&h.httpSessionIdParam)&&!y(h)&&(this.g.G=h,a=this.h,a!==null&&h in a&&(a=this.h,h in a&&delete a[h])),this.j=new Hr(this)}p(at,qe),at.prototype.m=function(){this.g.l=this.j,this.A&&(this.g.L=!0),this.g.connect(this.l,this.h||void 0)},at.prototype.close=function(){eu(this.g)},at.prototype.o=function(a){var h=this.g;if(typeof a=="string"){var f={};f.__data__=a,a=f}else this.v&&(f={},f.__data__=qc(a),a=f);h.i.push(new HI(h.Ya++,a)),h.I==3&&qo(h)},at.prototype.N=function(){this.g.l=null,delete this.j,eu(this.g),delete this.g,at.Z.N.call(this)};function Hd(a){$c.call(this),a.__headers__&&(this.headers=a.__headers__,this.statusCode=a.__status__,delete a.__headers__,delete a.__status__);var h=a.__sm__;if(h){e:{for(const f in h){a=f;break e}a=void 0}(this.i=a)&&(a=this.i,h=h!==null&&a in h?h[a]:void 0),this.data=h}else this.data=a}p(Hd,$c);function Qd(){jc.call(this),this.status=1}p(Qd,jc);function Hr(a){this.g=a}p(Hr,Wd),Hr.prototype.ra=function(){Qe(this.g,"a")},Hr.prototype.qa=function(a){Qe(this.g,new Hd(a))},Hr.prototype.pa=function(a){Qe(this.g,new Qd)},Hr.prototype.oa=function(){Qe(this.g,"b")},jo.prototype.createWebChannel=jo.prototype.g,at.prototype.send=at.prototype.o,at.prototype.open=at.prototype.m,at.prototype.close=at.prototype.close,rg=function(){return new jo},ng=function(){return ko()},tg=rr,Au={jb:0,mb:1,nb:2,Hb:3,Mb:4,Jb:5,Kb:6,Ib:7,Gb:8,Lb:9,PROXY:10,NOPROXY:11,Eb:12,Ab:13,Bb:14,zb:15,Cb:16,Db:17,fb:18,eb:19,gb:20},Oo.NO_ERROR=0,Oo.TIMEOUT=8,Oo.HTTP_ERROR=6,oa=Oo,hd.COMPLETE="complete",eg=hd,od.EventType=si,si.OPEN="a",si.CLOSE="b",si.ERROR="c",si.MESSAGE="d",qe.prototype.listen=qe.prototype.J,bi=od,we.prototype.listenOnce=we.prototype.K,we.prototype.getLastError=we.prototype.Ha,we.prototype.getLastErrorCode=we.prototype.ya,we.prototype.getStatus=we.prototype.ca,we.prototype.getResponseJson=we.prototype.La,we.prototype.getResponseText=we.prototype.la,we.prototype.send=we.prototype.ea,we.prototype.setWithCredentials=we.prototype.Fa,Zm=we}).apply(typeof Ko<"u"?Ko:typeof self<"u"?self:typeof window<"u"?window:{});/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let qs="12.17.0";function Gv(n){qs=n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Un=new Ya("@firebase/firestore");function ns(){return Un.logLevel}function Kv(n){Un.setLogLevel(n)}function O(n,...e){if(Un.logLevel<=Z.DEBUG){const t=e.map(_l);Un.debug(`Firestore (${qs}): ${n}`,...t)}}function Te(n,...e){if(Un.logLevel<=Z.ERROR){const t=e.map(_l);Un.error(`Firestore (${qs}): ${n}`,...t)}}function xe(n,...e){if(Un.logLevel<=Z.WARN){const t=e.map(_l);Un.warn(`Firestore (${qs}): ${n}`,...t)}}function _l(n){if(typeof n=="string")return n;try{return(function(t){return JSON.stringify(t)})(n)}catch{return n}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function q(n,e,t){let r="Unexpected state";typeof e=="string"?r=e:t=e,sg(n,r,t)}function sg(n,e,t){let r=`FIRESTORE (${qs}) INTERNAL ASSERTION FAILED: ${e} (ID: ${n.toString(16)})`;if(t!==void 0)try{r+=" CONTEXT: "+JSON.stringify(t)}catch{r+=" CONTEXT: "+t}throw Te(r),new Error(r)}function L(n,e,t,r){let s="Unexpected state";typeof t=="string"?s=t:r=t,n||sg(e,s,r)}function Wv(n,e){n||q(57014,e)}function U(n,e){return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Hv(n){const e=typeof self<"u"&&(self.crypto||self.msCrypto),t=new Uint8Array(n);if(e&&typeof e.getRandomValues=="function")e.getRandomValues(t);else for(let r=0;r<n;r++)t[r]=Math.floor(256*Math.random());return t}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tc{static newId(){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",t=62*Math.floor(4.129032258064516);let r="";for(;r.length<20;){const s=Hv(40);for(let i=0;i<s.length;++i)r.length<20&&s[i]<t&&(r+=e.charAt(s[i]%62))}return r}}function H(n,e){return n<e?-1:n>e?1:0}function Ru(n,e){const t=Math.min(n.length,e.length);for(let r=0;r<t;r++){const s=n.charAt(r),i=e.charAt(r);if(s!==i)return cu(s)===cu(i)?H(s,i):cu(s)?1:-1}return H(n.length,e.length)}const Qv=55296,Jv=57343;function cu(n){const e=n.charCodeAt(0);return e>=Qv&&e<=Jv}function ps(n,e,t){return n.length===e.length&&n.every(((r,s)=>t(r,e[s])))}function ig(n){return n+"\0"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class de{constructor(e,t){this.comparator=e,this.root=t||Ue.EMPTY}insert(e,t){return new de(this.comparator,this.root.insert(e,t,this.comparator).copy(null,null,Ue.BLACK,null,null))}remove(e){return new de(this.comparator,this.root.remove(e,this.comparator).copy(null,null,Ue.BLACK,null,null))}get(e){let t=this.root;for(;!t.isEmpty();){const r=this.comparator(e,t.key);if(r===0)return t.value;r<0?t=t.left:r>0&&(t=t.right)}return null}indexOf(e){let t=0,r=this.root;for(;!r.isEmpty();){const s=this.comparator(e,r.key);if(s===0)return t+r.left.size;s<0?r=r.left:(t+=r.left.size+1,r=r.right)}return-1}isEmpty(){return this.root.isEmpty()}get size(){return this.root.size}minKey(){return this.root.minKey()}maxKey(){return this.root.maxKey()}inorderTraversal(e){return this.root.inorderTraversal(e)}forEach(e){this.inorderTraversal(((t,r)=>(e(t,r),!1)))}toString(){const e=[];return this.inorderTraversal(((t,r)=>(e.push(`${t}:${r}`),!1))),`{${e.join(", ")}}`}reverseTraversal(e){return this.root.reverseTraversal(e)}getIterator(){return new Wo(this.root,null,this.comparator,!1)}getIteratorFrom(e){return new Wo(this.root,e,this.comparator,!1)}getReverseIterator(){return new Wo(this.root,null,this.comparator,!0)}getReverseIteratorFrom(e){return new Wo(this.root,e,this.comparator,!0)}}class Wo{constructor(e,t,r,s){this.isReverse=s,this.nodeStack=[];let i=1;for(;!e.isEmpty();)if(i=t?r(e.key,t):1,t&&s&&(i*=-1),i<0)e=this.isReverse?e.left:e.right;else{if(i===0){this.nodeStack.push(e);break}this.nodeStack.push(e),e=this.isReverse?e.right:e.left}}getNext(){let e=this.nodeStack.pop();const t={key:e.key,value:e.value};if(this.isReverse)for(e=e.left;!e.isEmpty();)this.nodeStack.push(e),e=e.right;else for(e=e.right;!e.isEmpty();)this.nodeStack.push(e),e=e.left;return t}hasNext(){return this.nodeStack.length>0}peek(){if(this.nodeStack.length===0)return null;const e=this.nodeStack[this.nodeStack.length-1];return{key:e.key,value:e.value}}}class Ue{constructor(e,t,r,s,i){this.key=e,this.value=t,this.color=r??Ue.RED,this.left=s??Ue.EMPTY,this.right=i??Ue.EMPTY,this.size=this.left.size+1+this.right.size}copy(e,t,r,s,i){return new Ue(e??this.key,t??this.value,r??this.color,s??this.left,i??this.right)}isEmpty(){return!1}inorderTraversal(e){return this.left.inorderTraversal(e)||e(this.key,this.value)||this.right.inorderTraversal(e)}reverseTraversal(e){return this.right.reverseTraversal(e)||e(this.key,this.value)||this.left.reverseTraversal(e)}min(){return this.left.isEmpty()?this:this.left.min()}minKey(){return this.min().key}maxKey(){return this.right.isEmpty()?this.key:this.right.maxKey()}insert(e,t,r){let s=this;const i=r(e,s.key);return s=i<0?s.copy(null,null,null,s.left.insert(e,t,r),null):i===0?s.copy(null,t,null,null,null):s.copy(null,null,null,null,s.right.insert(e,t,r)),s.fixUp()}removeMin(){if(this.left.isEmpty())return Ue.EMPTY;let e=this;return e.left.isRed()||e.left.left.isRed()||(e=e.moveRedLeft()),e=e.copy(null,null,null,e.left.removeMin(),null),e.fixUp()}remove(e,t){let r,s=this;if(t(e,s.key)<0)s.left.isEmpty()||s.left.isRed()||s.left.left.isRed()||(s=s.moveRedLeft()),s=s.copy(null,null,null,s.left.remove(e,t),null);else{if(s.left.isRed()&&(s=s.rotateRight()),s.right.isEmpty()||s.right.isRed()||s.right.left.isRed()||(s=s.moveRedRight()),t(e,s.key)===0){if(s.right.isEmpty())return Ue.EMPTY;r=s.right.min(),s=s.copy(r.key,r.value,null,null,s.right.removeMin())}s=s.copy(null,null,null,null,s.right.remove(e,t))}return s.fixUp()}isRed(){return this.color}fixUp(){let e=this;return e.right.isRed()&&!e.left.isRed()&&(e=e.rotateLeft()),e.left.isRed()&&e.left.left.isRed()&&(e=e.rotateRight()),e.left.isRed()&&e.right.isRed()&&(e=e.colorFlip()),e}moveRedLeft(){let e=this.colorFlip();return e.right.left.isRed()&&(e=e.copy(null,null,null,null,e.right.rotateRight()),e=e.rotateLeft(),e=e.colorFlip()),e}moveRedRight(){let e=this.colorFlip();return e.left.left.isRed()&&(e=e.rotateRight(),e=e.colorFlip()),e}rotateLeft(){const e=this.copy(null,null,Ue.RED,null,this.right.left);return this.right.copy(null,null,this.color,e,null)}rotateRight(){const e=this.copy(null,null,Ue.RED,this.left.right,null);return this.left.copy(null,null,this.color,null,e)}colorFlip(){const e=this.left.copy(null,null,!this.left.color,null,null),t=this.right.copy(null,null,!this.right.color,null,null);return this.copy(null,null,!this.color,e,t)}checkMaxDepth(){const e=this.check();return Math.pow(2,e)<=this.size+1}check(){if(this.isRed()&&this.left.isRed())throw q(43730,{key:this.key,value:this.value});if(this.right.isRed())throw q(14113,{key:this.key,value:this.value});const e=this.left.check();if(e!==this.right.check())throw q(27949);return e+(this.isRed()?0:1)}}Ue.EMPTY=null,Ue.RED=!0,Ue.BLACK=!1;Ue.EMPTY=new class{constructor(){this.size=0}get key(){throw q(57766)}get value(){throw q(16141)}get color(){throw q(16727)}get left(){throw q(29726)}get right(){throw q(36894)}copy(e,t,r,s,i){return this}insert(e,t,r){return new Ue(e,t)}remove(e,t){return this}isEmpty(){return!0}inorderTraversal(e){return!1}reverseTraversal(e){return!1}minKey(){return null}maxKey(){return null}isRed(){return!1}checkMaxDepth(){return!0}check(){return 0}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ce{constructor(e){this.comparator=e,this.data=new de(this.comparator)}has(e){return this.data.get(e)!==null}first(){return this.data.minKey()}last(){return this.data.maxKey()}get size(){return this.data.size}indexOf(e){return this.data.indexOf(e)}forEach(e){this.data.inorderTraversal(((t,r)=>(e(t),!1)))}forEachInRange(e,t){const r=this.data.getIteratorFrom(e[0]);for(;r.hasNext();){const s=r.getNext();if(this.comparator(s.key,e[1])>=0)return;t(s.key)}}forEachWhile(e,t){let r;for(r=t!==void 0?this.data.getIteratorFrom(t):this.data.getIterator();r.hasNext();)if(!e(r.getNext().key))return}firstAfterOrEqual(e){const t=this.data.getIteratorFrom(e);return t.hasNext()?t.getNext().key:null}getIterator(){return new Pf(this.data.getIterator())}getIteratorFrom(e){return new Pf(this.data.getIteratorFrom(e))}add(e){return this.copy(this.data.remove(e).insert(e,!0))}delete(e){return this.has(e)?this.copy(this.data.remove(e)):this}isEmpty(){return this.data.isEmpty()}unionWith(e){let t=this;return t.size<e.size&&(t=e,e=this),e.forEach((r=>{t=t.add(r)})),t}isEqual(e){if(!(e instanceof ce)||this.size!==e.size)return!1;const t=this.data.getIterator(),r=e.data.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(this.comparator(s,i)!==0)return!1}return!0}toArray(){const e=[];return this.forEach((t=>{e.push(t)})),e}toString(){const e=[];return this.forEach((t=>e.push(t))),"SortedSet("+e.toString()+")"}copy(e){const t=new ce(this.comparator);return t.data=e,t}}class Pf{constructor(e){this.iter=e}getNext(){return this.iter.getNext().key}hasNext(){return this.iter.hasNext()}}function Qr(n){return n.hasNext()?n.getNext():void 0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const b={OK:"ok",CANCELLED:"cancelled",UNKNOWN:"unknown",INVALID_ARGUMENT:"invalid-argument",DEADLINE_EXCEEDED:"deadline-exceeded",NOT_FOUND:"not-found",ALREADY_EXISTS:"already-exists",PERMISSION_DENIED:"permission-denied",UNAUTHENTICATED:"unauthenticated",RESOURCE_EXHAUSTED:"resource-exhausted",FAILED_PRECONDITION:"failed-precondition",ABORTED:"aborted",OUT_OF_RANGE:"out-of-range",UNIMPLEMENTED:"unimplemented",INTERNAL:"internal",UNAVAILABLE:"unavailable",DATA_LOSS:"data-loss"};class N extends bt{constructor(e,t){super(e,t),this.code=e,this.message=t,this.toString=()=>`${this.name}: [code=${this.code}]: ${this.message}`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Dt="__name__";class xt{constructor(e,t,r){t===void 0?t=0:t>e.length&&q(637,{offset:t,range:e.length}),r===void 0?r=e.length-t:r>e.length-t&&q(1746,{length:r,range:e.length-t}),this.segments=e,this.offset=t,this.len=r}get length(){return this.len}isEqual(e){return xt.comparator(this,e)===0}child(e){const t=this.segments.slice(this.offset,this.limit());return e instanceof xt?e.forEach((r=>{t.push(r)})):t.push(e),this.construct(t)}limit(){return this.offset+this.length}popFirst(e){return e=e===void 0?1:e,this.construct(this.segments,this.offset+e,this.length-e)}popLast(){return this.construct(this.segments,this.offset,this.length-1)}firstSegment(){return this.segments[this.offset]}lastSegment(){return this.get(this.length-1)}get(e){return this.segments[this.offset+e]}isEmpty(){return this.length===0}isPrefixOf(e){if(e.length<this.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}isImmediateParentOf(e){if(this.length+1!==e.length)return!1;for(let t=0;t<this.length;t++)if(this.get(t)!==e.get(t))return!1;return!0}forEach(e){for(let t=this.offset,r=this.limit();t<r;t++)e(this.segments[t])}toArray(){return this.segments.slice(this.offset,this.limit())}static comparator(e,t){const r=Math.min(e.length,t.length);for(let s=0;s<r;s++){const i=xt.compareSegments(e.get(s),t.get(s));if(i!==0)return i}return H(e.length,t.length)}static compareSegments(e,t){const r=xt.isNumericId(e),s=xt.isNumericId(t);return r&&!s?-1:!r&&s?1:r&&s?xt.extractNumericId(e).compare(xt.extractNumericId(t)):Ru(e,t)}static isNumericId(e){return e.startsWith("__id")&&e.endsWith("__")}static extractNumericId(e){return On.fromString(e.substring(4,e.length-2))}}class J extends xt{construct(e,t,r){return new J(e,t,r)}canonicalString(){return this.toArray().join("/")}toString(){return this.canonicalString()}toStringWithLeadingSlash(){return`/${this.canonicalString()}`}toUriEncodedString(){return this.toArray().map(encodeURIComponent).join("/")}static fromString(...e){const t=[];for(const r of e){if(r.indexOf("//")>=0)throw new N(b.INVALID_ARGUMENT,`Invalid segment (${r}). Paths must not contain // in them.`);t.push(...r.split("/").filter((s=>s.length>0)))}return new J(t)}static emptyPath(){return new J([])}}const Yv=/^[_a-zA-Z][_a-zA-Z0-9]*$/;let Ee=class rs extends xt{construct(e,t,r){return new rs(e,t,r)}static isValidIdentifier(e){return Yv.test(e)}canonicalString(){return this.toArray().map((e=>(e=e.replace(/\\/g,"\\\\").replace(/`/g,"\\`"),rs.isValidIdentifier(e)||(e="`"+e+"`"),e))).join(".")}toString(){return this.canonicalString()}isKeyField(){return this.length===1&&this.get(0)===Dt}static keyField(){return new rs([Dt])}static fromServerFormat(e){const t=[];let r="",s=0;const i=()=>{if(r.length===0)throw new N(b.INVALID_ARGUMENT,`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`);t.push(r),r=""};let o=!1;for(;s<e.length;){const c=e[s];if(c==="\\"){if(s+1===e.length)throw new N(b.INVALID_ARGUMENT,"Path has trailing escape character: "+e);const u=e[s+1];if(u!=="\\"&&u!=="."&&u!=="`")throw new N(b.INVALID_ARGUMENT,"Path has invalid escape sequence: "+e);r+=u,s+=2}else c==="`"?(o=!o,s++):c!=="."||o?(r+=c,s++):(i(),s++)}if(i(),o)throw new N(b.INVALID_ARGUMENT,"Unterminated ` in path: "+e);return new rs(t)}static emptyPath(){return new rs([])}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tt{constructor(e){this.fields=e,e.sort(Ee.comparator)}static empty(){return new tt([])}unionWith(e){let t=new ce(Ee.comparator);for(const r of this.fields)t=t.add(r);for(const r of e)t=t.add(r);return new tt(t.toArray())}covers(e){for(const t of this.fields)if(t.isPrefixOf(e))return!0;return!1}isEqual(e){return ps(this.fields,e.fields,((t,r)=>t.isEqual(r)))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ba(n){let e=0;for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e++;return e}function Jn(n,e){for(const t in n)Object.prototype.hasOwnProperty.call(n,t)&&e(t,n[t])}function yl(n,e){const t=[];for(const r in n)Object.prototype.hasOwnProperty.call(n,r)&&t.push(e(n[r],r,n));return t}function og(n){for(const e in n)if(Object.prototype.hasOwnProperty.call(n,e))return!1;return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class M{constructor(e){this.path=e}static fromPath(e){return new M(J.fromString(e))}static fromName(e){return new M(J.fromString(e).popFirst(5))}static empty(){return new M(J.emptyPath())}get collectionGroup(){return this.path.popLast().lastSegment()}hasCollectionId(e){return this.path.length>=2&&this.path.get(this.path.length-2)===e}getCollectionGroup(){return this.path.get(this.path.length-2)}getCollectionPath(){return this.path.popLast()}isEqual(e){return e!==null&&J.comparator(this.path,e.path)===0}toString(){return this.path.toString()}static comparator(e,t){return J.comparator(e.path,t.path)}static isDocumentKey(e){return e.length%2==0}static fromSegments(e){return new M(new J(e.slice()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Il(n,e,t){if(!t)throw new N(b.INVALID_ARGUMENT,`Function ${n}() cannot be called with an empty ${e}.`)}function ag(n,e,t,r){if(e===!0&&r===!0)throw new N(b.INVALID_ARGUMENT,`${n} and ${t} cannot be used together.`)}function bf(n){if(!M.isDocumentKey(n))throw new N(b.INVALID_ARGUMENT,`Invalid document reference. Document references must have an even number of segments, but ${n} has ${n.length}.`)}function Sf(n){if(M.isDocumentKey(n))throw new N(b.INVALID_ARGUMENT,`Invalid collection reference. Collection references must have an odd number of segments, but ${n} has ${n.length}.`)}function fo(n){return typeof n=="object"&&n!==null&&(Object.getPrototypeOf(n)===Object.prototype||Object.getPrototypeOf(n)===null)}function nc(n){if(n===void 0)return"undefined";if(n===null)return"null";if(typeof n=="string")return n.length>20&&(n=`${n.substring(0,20)}...`),JSON.stringify(n);if(typeof n=="number"||typeof n=="boolean")return""+n;if(typeof n=="object"){if(n instanceof Array)return"an array";{const e=(function(r){return r.constructor?r.constructor.name:null})(n);return e?`a custom ${e} object`:"an object"}}return typeof n=="function"?"a function":q(12329,{type:typeof n})}function X(n,e){if("_delegate"in n&&(n=n._delegate),!(n instanceof e)){if(e.name===n.constructor.name)throw new N(b.INVALID_ARGUMENT,"Type does not match the expected instance. Did you pass a reference from a different Firestore SDK?");{const t=nc(n);throw new N(b.INVALID_ARGUMENT,`Expected type '${e.name}', but it was: ${t}`)}}return n}function cg(n,e){if(e<=0)throw new N(b.INVALID_ARGUMENT,`Function ${n}() requires a positive number, but it was: ${e}.`)}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Pe(n,e){const t={typeString:n};return e&&(t.value=e),t}function Mr(n,e){if(!fo(n))throw new N(b.INVALID_ARGUMENT,"JSON must be an object");let t;for(const r in e)if(e[r]){const s=e[r].typeString,i="value"in e[r]?{value:e[r].value}:void 0;if(!(r in n)){t=`JSON missing required field: '${r}'`;break}const o=n[r];if(s&&typeof o!==s){t=`JSON field '${r}' must be a ${s}.`;break}if(i!==void 0&&o!==i.value){t=`Expected '${r}' field to equal '${i.value}'`;break}}if(t)throw new N(b.INVALID_ARGUMENT,t);return!0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Vf=-62135596800,Cf=1e6;class oe{static now(){return oe.fromMillis(Date.now())}static fromDate(e){return oe.fromMillis(e.getTime())}static fromMillis(e){const t=Math.floor(e/1e3),r=Math.floor((e-1e3*t)*Cf);return new oe(t,r)}constructor(e,t){if(this.seconds=e,this.nanoseconds=t,t<0)throw new N(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(t>=1e9)throw new N(b.INVALID_ARGUMENT,"Timestamp nanoseconds out of range: "+t);if(e<Vf)throw new N(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e);if(e>=253402300800)throw new N(b.INVALID_ARGUMENT,"Timestamp seconds out of range: "+e)}toDate(){return new Date(this.toMillis())}toMillis(){return 1e3*this.seconds+this.nanoseconds/Cf}_compareTo(e){return this.seconds===e.seconds?H(this.nanoseconds,e.nanoseconds):H(this.seconds,e.seconds)}isEqual(e){return e.seconds===this.seconds&&e.nanoseconds===this.nanoseconds}toString(){return"Timestamp(seconds="+this.seconds+", nanoseconds="+this.nanoseconds+")"}toJSON(){return{type:oe._jsonSchemaVersion,seconds:this.seconds,nanoseconds:this.nanoseconds}}static fromJSON(e){if(Mr(e,oe._jsonSchema))return new oe(e.seconds,e.nanoseconds)}valueOf(){const e=this.seconds-Vf;return String(e).padStart(12,"0")+"."+String(this.nanoseconds).padStart(9,"0")}}oe._jsonSchemaVersion="firestore/timestamp/1.0",oe._jsonSchema={type:Pe("string",oe._jsonSchemaVersion),seconds:Pe("number"),nanoseconds:Pe("number")};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ug extends Error{constructor(){super(...arguments),this.name="Base64DecodeError"}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xv(){return typeof atob<"u"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pe{constructor(e){this.binaryString=e}static fromBase64String(e){const t=(function(s){try{return atob(s)}catch(i){throw typeof DOMException<"u"&&i instanceof DOMException?new ug("Invalid base64 string: "+i):i}})(e);return new pe(t)}static fromUint8Array(e){const t=(function(s){let i="";for(let o=0;o<s.length;++o)i+=String.fromCharCode(s[o]);return i})(e);return new pe(t)}[Symbol.iterator](){let e=0;return{next:()=>e<this.binaryString.length?{value:this.binaryString.charCodeAt(e++),done:!1}:{value:void 0,done:!0}}}toBase64(){return(function(t){return btoa(t)})(this.binaryString)}toUint8Array(){return(function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r})(this.binaryString)}approximateByteSize(){return 2*this.binaryString.length}compareTo(e){return H(this.binaryString,e.binaryString)}isEqual(e){return this.binaryString===e.binaryString}}pe.EMPTY_BYTE_STRING=new pe("");const Zv=new RegExp(/^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(?:\.(\d+))?Z$/);function sn(n){if(L(!!n,39018),typeof n=="string"){let e=0;const t=Zv.exec(n);if(L(!!t,46558,{timestamp:n}),t[1]){let s=t[1];s=(s+"000000000").substr(0,9),e=Number(s)}const r=new Date(n);return{seconds:Math.floor(r.getTime()/1e3),nanos:e}}return{seconds:fe(n.seconds),nanos:fe(n.nanos)}}function fe(n){return typeof n=="number"?n:typeof n=="string"?Number(n):0}function on(n){return typeof n=="string"?pe.fromBase64String(n):pe.fromUint8Array(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lg="server_timestamp",hg="__type__",dg="__previous_value__",fg="__local_write_time__";function po(n){var t,r;return((r=(((t=n==null?void 0:n.mapValue)==null?void 0:t.fields)||{})[hg])==null?void 0:r.stringValue)===lg}function mo(n){const e=n.mapValue.fields[dg];return po(e)?mo(e):e}function ms(n){const e=sn(n.mapValue.fields[fg].timestampValue);return new oe(e.seconds,e.nanos)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class eA{constructor(e,t,r,s,i,o,c,u,l,d,p,g,w){this.databaseId=e,this.appId=t,this.persistenceKey=r,this.host=s,this.ssl=i,this.forceLongPolling=o,this.autoDetectLongPolling=c,this.longPollingOptions=u,this.useFetchStreams=l,this.isUsingEmulator=d,this.apiKey=p,this._customHeaders=g,this.grpcFlowControlWindow=w}}const Wi="(default)";class Bn{constructor(e,t){this.projectId=e,this.database=t||Wi}static empty(){return new Bn("","")}get isDefaultDatabase(){return this.database===Wi}isEqual(e){return e instanceof Bn&&e.projectId===this.projectId&&e.database===this.database}}function tA(n,e){if(!Object.prototype.hasOwnProperty.apply(n.options,["projectId"]))throw new N(b.INVALID_ARGUMENT,'"projectId" not provided in firebase.initializeApp.');return new Bn(n.options.projectId,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ln=-1;function go(n){return n==null}function gs(n){return n===0&&1/n==-1/0}function pg(n){return typeof n=="number"&&Number.isInteger(n)&&!gs(n)&&n<=Number.MAX_SAFE_INTEGER&&n>=Number.MIN_SAFE_INTEGER}function nA(n){return typeof n=="string"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wl="__type__",mg="__max__",Dn={mapValue:{fields:{__type__:{stringValue:mg}}}},Tl="__vector__",Rr="value",Ut={nullValue:"NULL_VALUE"},it={booleanValue:!0},Me={booleanValue:!1};function be(n){return"nullValue"in n?0:"booleanValue"in n?1:"integerValue"in n||"doubleValue"in n?2:"timestampValue"in n?3:"stringValue"in n?5:"bytesValue"in n?6:"referenceValue"in n?7:"geoPointValue"in n?8:"arrayValue"in n?9:"mapValue"in n?po(n)?4:gg(n)?9007199254740991:br(n)?10:11:q(28295,{value:n})}function It(n,e,t){if(n===e)return!0;const r=be(n);if(r!==be(e))return!1;switch(r){case 0:case 9007199254740991:return!0;case 1:return n.booleanValue===e.booleanValue;case 4:return ms(n).isEqual(ms(e));case 3:return(function(i,o){if(typeof i.timestampValue=="string"&&typeof o.timestampValue=="string"&&i.timestampValue.length===o.timestampValue.length)return i.timestampValue===o.timestampValue;const c=sn(i.timestampValue),u=sn(o.timestampValue);return c.seconds===u.seconds&&c.nanos===u.nanos})(n,e);case 5:return n.stringValue===e.stringValue;case 6:return(function(i,o){return on(i.bytesValue).isEqual(on(o.bytesValue))})(n,e);case 7:return n.referenceValue===e.referenceValue;case 8:return(function(i,o){return fe(i.geoPointValue.latitude)===fe(o.geoPointValue.latitude)&&fe(i.geoPointValue.longitude)===fe(o.geoPointValue.longitude)})(n,e);case 2:return(function(i,o,c){if("integerValue"in i&&"integerValue"in o)return fe(i.integerValue)===fe(o.integerValue);let u,l;if("doubleValue"in i&&"doubleValue"in o)u=fe(i.doubleValue),l=fe(o.doubleValue);else{if(!(c!=null&&c.t))return!1;u=fe(i.integerValue??i.doubleValue),l=fe(o.integerValue??o.doubleValue)}return u===l?!!(c!=null&&c.i)||gs(u)===gs(l):!!(c===void 0||c.o)&&isNaN(u)&&isNaN(l)})(n,e,t);case 9:return ps(n.arrayValue.values||[],e.arrayValue.values||[],((s,i)=>It(s,i,t)));case 10:case 11:return(function(i,o,c){const u=i.mapValue.fields||{},l=o.mapValue.fields||{};if(ba(u)!==ba(l))return!1;for(const d in u)if(u.hasOwnProperty(d)&&(l[d]===void 0||!It(u[d],l[d],c)))return!1;return!0})(n,e,t);default:return q(52216,{left:n})}}function Hi(n,e){return(n.values||[]).find((t=>It(t,e)))!==void 0}function We(n,e){if(n===e)return 0;const t=be(n),r=be(e);if(t!==r)return H(t,r);switch(t){case 0:case 9007199254740991:return 0;case 1:return H(n.booleanValue,e.booleanValue);case 2:return(function(i,o){const c=fe(i.integerValue||i.doubleValue),u=fe(o.integerValue||o.doubleValue);return c<u?-1:c>u?1:c===u?0:isNaN(c)?isNaN(u)?0:-1:1})(n,e);case 3:return xf(n.timestampValue,e.timestampValue);case 4:return xf(ms(n),ms(e));case 5:return Ru(n.stringValue,e.stringValue);case 6:return(function(i,o){const c=on(i),u=on(o);return c.compareTo(u)})(n.bytesValue,e.bytesValue);case 7:return(function(i,o){const c=i.split("/"),u=o.split("/");for(let l=0;l<c.length&&l<u.length;l++){const d=H(c[l],u[l]);if(d!==0)return d}return H(c.length,u.length)})(n.referenceValue,e.referenceValue);case 8:return(function(i,o){const c=H(fe(i.latitude),fe(o.latitude));return c!==0?c:H(fe(i.longitude),fe(o.longitude))})(n.geoPointValue,e.geoPointValue);case 9:return Nf(n.arrayValue,e.arrayValue);case 10:return(function(i,o){var g,w,S,D;const c=i.fields||{},u=o.fields||{},l=(g=c[Rr])==null?void 0:g.arrayValue,d=(w=u[Rr])==null?void 0:w.arrayValue,p=H(((S=l==null?void 0:l.values)==null?void 0:S.length)||0,((D=d==null?void 0:d.values)==null?void 0:D.length)||0);return p!==0?p:Nf(l,d)})(n.mapValue,e.mapValue);case 11:return(function(i,o){if(i===Dn.mapValue&&o===Dn.mapValue)return 0;if(i===Dn.mapValue)return 1;if(o===Dn.mapValue)return-1;const c=i.fields||{},u=Object.keys(c),l=o.fields||{},d=Object.keys(l);u.sort(),d.sort();for(let p=0;p<u.length&&p<d.length;++p){const g=Ru(u[p],d[p]);if(g!==0)return g;const w=We(c[u[p]],l[d[p]]);if(w!==0)return w}return H(u.length,d.length)})(n.mapValue,e.mapValue);default:throw q(23264,{u:t})}}function xf(n,e){if(typeof n=="string"&&typeof e=="string"&&n.length===e.length)return H(n,e);const t=sn(n),r=sn(e),s=H(t.seconds,r.seconds);return s!==0?s:H(t.nanos,r.nanos)}function Nf(n,e){const t=n.values||[],r=e.values||[];for(let s=0;s<t.length&&s<r.length;++s){const i=We(t[s],r[s]);if(i!==void 0&&i!==0)return i}return H(t.length,r.length)}function _s(n){return Pu(n)}function Pu(n){return"nullValue"in n?"null":"booleanValue"in n?""+n.booleanValue:"integerValue"in n?""+n.integerValue:"doubleValue"in n?""+n.doubleValue:"timestampValue"in n?(function(t){const r=sn(t);return`time(${r.seconds},${r.nanos})`})(n.timestampValue):"stringValue"in n?n.stringValue:"bytesValue"in n?(function(t){return on(t).toBase64()})(n.bytesValue):"referenceValue"in n?(function(t){return M.fromName(t).toString()})(n.referenceValue):"geoPointValue"in n?(function(t){return`geo(${t.latitude},${t.longitude})`})(n.geoPointValue):"arrayValue"in n?(function(t){let r="[",s=!0;for(const i of t.values||[])s?s=!1:r+=",",r+=Pu(i);return r+"]"})(n.arrayValue):"mapValue"in n?(function(t){const r=Object.keys(t.fields||{}).sort();let s="{",i=!0;for(const o of r)i?i=!1:s+=",",s+=`${o}:${Pu(t.fields[o])}`;return s+"}"})(n.mapValue):q(61005,{value:n})}function aa(n){switch(be(n)){case 0:case 1:return 4;case 2:return 8;case 3:case 8:return 16;case 4:const e=mo(n);return e?16+aa(e):16;case 5:return 2*n.stringValue.length;case 6:return on(n.bytesValue).approximateByteSize();case 7:return n.referenceValue.length;case 9:return(function(r){return(r.values||[]).reduce(((s,i)=>s+aa(i)),0)})(n.arrayValue);case 10:case 11:return(function(r){let s=0;return Jn(r.fields,((i,o)=>{s+=i.length+aa(o)})),s})(n.mapValue);default:throw q(13486,{value:n})}}function Pr(n,e){return{referenceValue:`projects/${n.projectId}/databases/${n.database}/documents/${e.path.canonicalString()}`}}function kt(n){return!!n&&"integerValue"in n}function _r(n){return!!n&&"doubleValue"in n}function qn(n){return kt(n)||_r(n)}function $n(n){return!!n&&"arrayValue"in n}function ht(n){return!!n&&"nullValue"in n}function ot(n){return!!n&&"doubleValue"in n&&isNaN(Number(n.doubleValue))}function wr(n){return!!n&&"mapValue"in n}function br(n){var t,r;return((r=(((t=n==null?void 0:n.mapValue)==null?void 0:t.fields)||{})[wl])==null?void 0:r.stringValue)===Tl}function bu(n){var e,t;return(t=(((e=n==null?void 0:n.mapValue)==null?void 0:e.fields)||{})[Rr])==null?void 0:t.arrayValue}function Ni(n){if(n.geoPointValue)return{geoPointValue:{...n.geoPointValue}};if(n.timestampValue&&typeof n.timestampValue=="object")return{timestampValue:{...n.timestampValue}};if(n.mapValue){const e={mapValue:{fields:{}}};return Jn(n.mapValue.fields,((t,r)=>e.mapValue.fields[t]=Ni(r))),e}if(n.arrayValue){const e={arrayValue:{values:[]}};for(let t=0;t<(n.arrayValue.values||[]).length;++t)e.arrayValue.values[t]=Ni(n.arrayValue.values[t]);return e}return{...n}}function gg(n){return(((n.mapValue||{}).fields||{}).__type__||{}).stringValue===mg}const _g={mapValue:{fields:{[wl]:{stringValue:Tl},[Rr]:{arrayValue:{}}}}};function rA(n){return"nullValue"in n?Ut:"booleanValue"in n?{booleanValue:!1}:"integerValue"in n||"doubleValue"in n?{doubleValue:NaN}:"timestampValue"in n?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"stringValue"in n?{stringValue:""}:"bytesValue"in n?{bytesValue:""}:"referenceValue"in n?Pr(Bn.empty(),M.empty()):"geoPointValue"in n?{geoPointValue:{latitude:-90,longitude:-180}}:"arrayValue"in n?{arrayValue:{}}:"mapValue"in n?br(n)?_g:{mapValue:{}}:q(35942,{value:n})}function sA(n){return"nullValue"in n?{booleanValue:!1}:"booleanValue"in n?{doubleValue:NaN}:"integerValue"in n||"doubleValue"in n?{timestampValue:{seconds:Number.MIN_SAFE_INTEGER}}:"timestampValue"in n?{stringValue:""}:"stringValue"in n?{bytesValue:""}:"bytesValue"in n?Pr(Bn.empty(),M.empty()):"referenceValue"in n?{geoPointValue:{latitude:-90,longitude:-180}}:"geoPointValue"in n?{arrayValue:{}}:"arrayValue"in n?_g:"mapValue"in n?br(n)?{mapValue:{}}:Dn:q(61959,{value:n})}function Df(n,e){const t=We(n.value,e.value);return t!==0?t:n.inclusive&&!e.inclusive?-1:!n.inclusive&&e.inclusive?1:0}function kf(n,e){const t=We(n.value,e.value);return t!==0?t:n.inclusive&&!e.inclusive?1:!n.inclusive&&e.inclusive?-1:0}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ve{constructor(e){this.value=e}static empty(){return new Ve({mapValue:{}})}field(e){if(e.isEmpty())return this.value;{let t=this.value;for(let r=0;r<e.length-1;++r)if(t=(t.mapValue.fields||{})[e.get(r)],!wr(t))return null;return t=(t.mapValue.fields||{})[e.lastSegment()],t||null}}set(e,t){this.getFieldsMap(e.popLast())[e.lastSegment()]=Ni(t)}setAll(e){let t=Ee.emptyPath(),r={},s=[];e.forEach(((o,c)=>{if(!t.isImmediateParentOf(c)){const u=this.getFieldsMap(t);this.applyChanges(u,r,s),r={},s=[],t=c.popLast()}o?r[c.lastSegment()]=Ni(o):s.push(c.lastSegment())}));const i=this.getFieldsMap(t);this.applyChanges(i,r,s)}delete(e){const t=this.field(e.popLast());wr(t)&&t.mapValue.fields&&delete t.mapValue.fields[e.lastSegment()]}isEqual(e){return It(this.value,e.value)}getFieldsMap(e){let t=this.value;t.mapValue.fields||(t.mapValue={fields:{}});for(let r=0;r<e.length;++r){let s=t.mapValue.fields[e.get(r)];wr(s)&&s.mapValue.fields||(s={mapValue:{fields:{}}},t.mapValue.fields[e.get(r)]=s),t=s}return t.mapValue.fields}applyChanges(e,t,r){Jn(t,((s,i)=>e[s]=i));for(const s of r)delete e[s]}clone(){return new Ve(Ni(this.value))}}function yg(n){const e=[];return Jn(n.fields,((t,r)=>{const s=new Ee([t]);if(wr(r)){const i=yg(r.mapValue).fields;if(i.length===0)e.push(s);else for(const o of i)e.push(s.child(o))}else e.push(s)})),new tt(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function rc(n,e){if(n.useProto3Json){if(isNaN(e))return{doubleValue:"NaN"};if(e===1/0)return{doubleValue:"Infinity"};if(e===-1/0)return{doubleValue:"-Infinity"}}return{doubleValue:gs(e)?"-0":e}}function El(n){return{integerValue:""+n}}function $s(n,e,t){return pg(e)?El(e):rc(n,e)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sc{constructor(){this._=void 0}}function iA(n,e,t){return n instanceof ys?(function(s,i){const o={fields:{[hg]:{stringValue:lg},[fg]:{timestampValue:{seconds:s.seconds,nanos:s.nanoseconds}}}};return i&&po(i)&&(i=mo(i)),i&&(o.fields[dg]=i),{mapValue:o}})(t,e):n instanceof Sr?wg(n,e):n instanceof Vr?Tg(n,e):n instanceof Cr?(function(s,i){const o=Ig(s,i),c=Sa(o)+Sa(s.l);return kt(o)&&kt(s.l)?El(c):rc(s.serializer,c)})(n,e):n instanceof Is?(function(s,i){return Of(s,i,Math.min)})(n,e):n instanceof ws?(function(s,i){return Of(s,i,Math.max)})(n,e):void 0}function oA(n,e,t){return n instanceof Sr?wg(n,e):n instanceof Vr?Tg(n,e):t}function Ig(n,e){return n instanceof Cr?qn(e)?e:{integerValue:0}:null}class ys extends sc{}class Sr extends sc{constructor(e){super(),this.elements=e}}function wg(n,e){const t=Eg(e);for(const r of n.elements)t.some((s=>It(s,r)))||t.push(r);return{arrayValue:{values:t}}}class Vr extends sc{constructor(e){super(),this.elements=e}}function Tg(n,e){let t=Eg(e);for(const r of n.elements)t=t.filter((s=>!It(s,r)));return{arrayValue:{values:t}}}class vl extends sc{constructor(e,t){super(),this.serializer=e,this.l=t}}class Cr extends vl{}class Is extends vl{}class ws extends vl{}function Of(n,e,t){if(!qn(e))return n.l;const r=t(Sa(e),Sa(n.l));return kt(e)&&kt(n.l)?El(r):rc(n.serializer,r)}function Sa(n){return fe(n.integerValue||n.doubleValue)}function Eg(n){return $n(n)&&n.arrayValue.values?n.arrayValue.values.slice():[]}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fr{constructor(e,t){this.field=e,this.transform=t}}function aA(n,e){return n.field.isEqual(e.field)&&(function(r,s){return r instanceof Sr&&s instanceof Sr||r instanceof Vr&&s instanceof Vr?ps(r.elements,s.elements,It):r instanceof Cr&&s instanceof Cr||r instanceof Is&&s instanceof Is||r instanceof ws&&s instanceof ws?It(r.l,s.l):r instanceof ys&&s instanceof ys})(n.transform,e.transform)}class cA{constructor(e,t){this.version=e,this.transformResults=t}}class _e{constructor(e,t){this.updateTime=e,this.exists=t}static none(){return new _e}static exists(e){return new _e(void 0,e)}static updateTime(e){return new _e(e)}get isNone(){return this.updateTime===void 0&&this.exists===void 0}isEqual(e){return this.exists===e.exists&&(this.updateTime?!!e.updateTime&&this.updateTime.isEqual(e.updateTime):!e.updateTime)}}function ca(n,e){return n.updateTime!==void 0?e.isFoundDocument()&&e.version.isEqual(n.updateTime):n.exists===void 0||n.exists===e.isFoundDocument()}class ic{}function vg(n,e){if(!n.hasLocalMutations||e&&e.fields.length===0)return null;if(e===null)return n.isNoDocument()?new zs(n.key,_e.none()):new js(n.key,n.data,_e.none());{const t=n.data,r=Ve.empty();let s=new ce(Ee.comparator);for(let i of e.fields)if(!s.has(i)){let o=t.field(i);o===null&&i.length>1&&(i=i.popLast(),o=t.field(i)),o===null?r.delete(i):r.set(i,o),s=s.add(i)}return new hn(n.key,r,new tt(s.toArray()),_e.none())}}function uA(n,e,t){n instanceof js?(function(s,i,o){const c=s.value.clone(),u=Mf(s.fieldTransforms,i,o.transformResults);c.setAll(u),i.convertToFoundDocument(o.version,c).setHasCommittedMutations()})(n,e,t):n instanceof hn?(function(s,i,o){if(!ca(s.precondition,i))return void i.convertToUnknownDocument(o.version);const c=Mf(s.fieldTransforms,i,o.transformResults),u=i.data;u.setAll(Ag(s)),u.setAll(c),i.convertToFoundDocument(o.version,u).setHasCommittedMutations()})(n,e,t):(function(s,i,o){i.convertToNoDocument(o.version).setHasCommittedMutations()})(0,e,t)}function Di(n,e,t,r){return n instanceof js?(function(i,o,c,u){if(!ca(i.precondition,o))return c;const l=i.value.clone(),d=Ff(i.fieldTransforms,u,o);return l.setAll(d),o.convertToFoundDocument(o.version,l).setHasLocalMutations(),null})(n,e,t,r):n instanceof hn?(function(i,o,c,u){if(!ca(i.precondition,o))return c;const l=Ff(i.fieldTransforms,u,o),d=o.data;return d.setAll(Ag(i)),d.setAll(l),o.convertToFoundDocument(o.version,d).setHasLocalMutations(),c===null?null:c.unionWith(i.fieldMask.fields).unionWith(i.fieldTransforms.map((p=>p.field)))})(n,e,t,r):(function(i,o,c){return ca(i.precondition,o)?(o.convertToNoDocument(o.version).setHasLocalMutations(),null):c})(n,e,t)}function lA(n,e){let t=null;for(const r of n.fieldTransforms){const s=e.data.field(r.field),i=Ig(r.transform,s||null);i!=null&&(t===null&&(t=Ve.empty()),t.set(r.field,i))}return t||null}function Lf(n,e){return n.type===e.type&&!!n.key.isEqual(e.key)&&!!n.precondition.isEqual(e.precondition)&&!!(function(r,s){return r===void 0&&s===void 0||!(!r||!s)&&ps(r,s,((i,o)=>aA(i,o)))})(n.fieldTransforms,e.fieldTransforms)&&(n.type===0?n.value.isEqual(e.value):n.type!==1||n.data.isEqual(e.data)&&n.fieldMask.isEqual(e.fieldMask))}class js extends ic{constructor(e,t,r,s=[]){super(),this.key=e,this.value=t,this.precondition=r,this.fieldTransforms=s,this.type=0}getFieldMask(){return null}}class hn extends ic{constructor(e,t,r,s,i=[]){super(),this.key=e,this.data=t,this.fieldMask=r,this.precondition=s,this.fieldTransforms=i,this.type=1}getFieldMask(){return this.fieldMask}}function Ag(n){const e=new Map;return n.fieldMask.fields.forEach((t=>{if(!t.isEmpty()){const r=n.data.field(t);e.set(t,r)}})),e}function Mf(n,e,t){const r=new Map;L(n.length===t.length,32656,{h:t.length,T:n.length});for(let s=0;s<t.length;s++){const i=n[s],o=i.transform,c=e.data.field(i.field);r.set(i.field,oA(o,c,t[s]))}return r}function Ff(n,e,t){const r=new Map;for(const s of n){const i=s.transform,o=t.data.field(s.field);r.set(s.field,iA(i,o,e))}return r}class zs extends ic{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=2,this.fieldTransforms=[]}getFieldMask(){return null}}class Al extends ic{constructor(e,t){super(),this.key=e,this.precondition=t,this.type=3,this.fieldTransforms=[]}getFieldMask(){return null}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Rg{constructor(e,t,r){this.alias=e,this.aggregateType=t,this.fieldPath=r}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jn{constructor(e,t){this.position=e,this.inclusive=t}}function Uf(n,e,t){let r=0;for(let s=0;s<n.position.length;s++){const i=e[s],o=n.position[s];if(i.field.isKeyField()?r=M.comparator(M.fromName(o.referenceValue),t.key):r=We(o,t.data.field(i.field)),i.dir==="desc"&&(r*=-1),r!==0)break}return r}function Bf(n,e){if(n===null)return e===null;if(e===null||n.inclusive!==e.inclusive||n.position.length!==e.position.length)return!1;for(let t=0;t<n.position.length;t++)if(!It(n.position[t],e.position[t]))return!1;return!0}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Pg{}class ee extends Pg{constructor(e,t,r){super(),this.field=e,this.op=t,this.value=r}static create(e,t,r){return e.isKeyField()?t==="in"||t==="not-in"?this.createKeyFieldInFilter(e,t,r):new hA(e,t,r):t==="array-contains"?new pA(e,r):t==="in"?new Ng(e,r):t==="not-in"?new mA(e,r):t==="array-contains-any"?new gA(e,r):new ee(e,t,r)}static createKeyFieldInFilter(e,t,r){return t==="in"?new dA(e,r):new fA(e,r)}matches(e){const t=e.data.field(this.field);return this.op==="!="?t!==null&&t.nullValue===void 0&&this.matchesComparison(We(t,this.value)):t!==null&&be(this.value)===be(t)&&this.matchesComparison(We(t,this.value))}matchesComparison(e){switch(this.op){case"<":return e<0;case"<=":return e<=0;case"==":return e===0;case"!=":return e!==0;case">":return e>0;case">=":return e>=0;default:return q(47266,{operator:this.op})}}isInequality(){return["<","<=",">",">=","!=","not-in"].indexOf(this.op)>=0}getFlattenedFilters(){return[this]}getFilters(){return[this]}}class ue extends Pg{constructor(e,t){super(),this.filters=e,this.op=t,this.P=null}static create(e,t){return new ue(e,t)}matches(e){return Ts(this)?this.filters.find((t=>!t.matches(e)))===void 0:this.filters.find((t=>t.matches(e)))!==void 0}getFlattenedFilters(){return this.P!==null||(this.P=this.filters.reduce(((e,t)=>e.concat(t.getFlattenedFilters())),[])),this.P}getFilters(){return Object.assign([],this.filters)}}function Ts(n){return n.op==="and"}function Su(n){return n.op==="or"}function Rl(n){return bg(n)&&Ts(n)}function bg(n){for(const e of n.filters)if(e instanceof ue)return!1;return!0}function Vu(n){if(n instanceof ee)return n.field.canonicalString()+n.op.toString()+_s(n.value);if(Rl(n))return n.filters.map((e=>Vu(e))).join(",");{const e=n.filters.map((t=>Vu(t))).join(",");return`${n.op}(${e})`}}function Sg(n,e){return n instanceof ee?(function(r,s){return s instanceof ee&&r.op===s.op&&r.field.isEqual(s.field)&&It(r.value,s.value)})(n,e):n instanceof ue?(function(r,s){return s instanceof ue&&r.op===s.op&&r.filters.length===s.filters.length?r.filters.reduce(((i,o,c)=>i&&Sg(o,s.filters[c])),!0):!1})(n,e):void q(19439)}function Vg(n,e){const t=n.filters.concat(e);return ue.create(t,n.op)}function Cg(n){return n instanceof ee?(function(t){return`${t.field.canonicalString()} ${t.op} ${_s(t.value)}`})(n):n instanceof ue?(function(t){return t.op.toString()+" {"+t.getFilters().map(Cg).join(" ,")+"}"})(n):"Filter"}class hA extends ee{constructor(e,t,r){super(e,t,r),this.key=M.fromName(r.referenceValue)}matches(e){const t=M.comparator(e.key,this.key);return this.matchesComparison(t)}}class dA extends ee{constructor(e,t){super(e,"in",t),this.keys=xg("in",t)}matches(e){return this.keys.some((t=>t.isEqual(e.key)))}}class fA extends ee{constructor(e,t){super(e,"not-in",t),this.keys=xg("not-in",t)}matches(e){return!this.keys.some((t=>t.isEqual(e.key)))}}function xg(n,e){var t;return(((t=e.arrayValue)==null?void 0:t.values)||[]).map((r=>M.fromName(r.referenceValue)))}class pA extends ee{constructor(e,t){super(e,"array-contains",t)}matches(e){const t=e.data.field(this.field);return $n(t)&&Hi(t.arrayValue,this.value)}}class Ng extends ee{constructor(e,t){super(e,"in",t)}matches(e){const t=e.data.field(this.field);return t!==null&&Hi(this.value.arrayValue,t)}}class mA extends ee{constructor(e,t){super(e,"not-in",t)}matches(e){if(Hi(this.value.arrayValue,{nullValue:"NULL_VALUE"}))return!1;const t=e.data.field(this.field);return t!==null&&t.nullValue===void 0&&!Hi(this.value.arrayValue,t)}}class gA extends ee{constructor(e,t){super(e,"array-contains-any",t)}matches(e){const t=e.data.field(this.field);return!(!$n(t)||!t.arrayValue.values)&&t.arrayValue.values.some((r=>Hi(this.value.arrayValue,r)))}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Qi{constructor(e,t="asc"){this.field=e,this.dir=t}}function _A(n,e){return n.dir===e.dir&&n.field.isEqual(e.field)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class j{static fromTimestamp(e){return new j(e)}static min(){return new j(new oe(0,0))}static max(){return new j(new oe(253402300799,999999999))}constructor(e){this.timestamp=e}compareTo(e){return this.timestamp._compareTo(e.timestamp)}isEqual(e){return this.timestamp.isEqual(e.timestamp)}toMicroseconds(){return 1e6*this.timestamp.seconds+this.timestamp.nanoseconds/1e3}toString(){return"SnapshotVersion("+this.timestamp.toString()+")"}toTimestamp(){return this.timestamp}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ge{constructor(e,t,r,s,i,o,c){this.key=e,this.documentType=t,this.version=r,this.readTime=s,this.createTime=i,this.data=o,this.documentState=c}static newInvalidDocument(e){return new ge(e,0,j.min(),j.min(),j.min(),Ve.empty(),0)}static newFoundDocument(e,t,r,s){return new ge(e,1,t,j.min(),r,s,0)}static newNoDocument(e,t){return new ge(e,2,t,j.min(),j.min(),Ve.empty(),0)}static newUnknownDocument(e,t){return new ge(e,3,t,j.min(),j.min(),Ve.empty(),2)}convertToFoundDocument(e,t){return!this.createTime.isEqual(j.min())||this.documentType!==2&&this.documentType!==0||(this.createTime=e),this.version=e,this.documentType=1,this.data=t,this.documentState=0,this}convertToNoDocument(e){return this.version=e,this.documentType=2,this.data=Ve.empty(),this.documentState=0,this}convertToUnknownDocument(e){return this.version=e,this.documentType=3,this.data=Ve.empty(),this.documentState=2,this}setHasCommittedMutations(){return this.documentState=2,this}setHasLocalMutations(){return this.documentState=1,this.version=j.min(),this}setReadTime(e){return this.readTime=e,this}get hasLocalMutations(){return this.documentState===1}get hasCommittedMutations(){return this.documentState===2}get hasPendingWrites(){return this.hasLocalMutations||this.hasCommittedMutations}isValidDocument(){return this.documentType!==0}isFoundDocument(){return this.documentType===1}isNoDocument(){return this.documentType===2}isUnknownDocument(){return this.documentType===3}isEqual(e){return e instanceof ge&&this.key.isEqual(e.key)&&this.version.isEqual(e.version)&&this.documentType===e.documentType&&this.documentState===e.documentState&&this.data.isEqual(e.data)}mutableCopy(){return new ge(this.key,this.documentType,this.version,this.readTime,this.createTime,this.data.clone(),this.documentState)}toString(){return`Document(${this.key}, ${this.version}, ${JSON.stringify(this.data.value)}, {createTime: ${this.createTime}}), {documentType: ${this.documentType}}), {documentState: ${this.documentState}})`}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Es=-1;class vs{constructor(e,t,r,s){this.indexId=e,this.collectionGroup=t,this.fields=r,this.indexState=s}}function Cu(n){return n.fields.find((e=>e.kind===2))}function ur(n){return n.fields.filter((e=>e.kind!==2))}function yA(n,e){let t=H(n.collectionGroup,e.collectionGroup);if(t!==0)return t;for(let r=0;r<Math.min(n.fields.length,e.fields.length);++r)if(t=IA(n.fields[r],e.fields[r]),t!==0)return t;return H(n.fields.length,e.fields.length)}vs.UNKNOWN_ID=-1;class Tr{constructor(e,t){this.fieldPath=e,this.kind=t}}function IA(n,e){const t=Ee.comparator(n.fieldPath,e.fieldPath);return t!==0?t:H(n.kind,e.kind)}class As{constructor(e,t){this.sequenceNumber=e,this.offset=t}static empty(){return new As(0,ft.min())}}function Dg(n,e){const t=n.toTimestamp().seconds,r=n.toTimestamp().nanoseconds+1,s=j.fromTimestamp(r===1e9?new oe(t+1,0):new oe(t,r));return new ft(s,M.empty(),e)}function kg(n){return new ft(n.readTime,n.key,Es)}class ft{constructor(e,t,r){this.readTime=e,this.documentKey=t,this.largestBatchId=r}static min(){return new ft(j.min(),M.empty(),Es)}static max(){return new ft(j.max(),M.empty(),Es)}}function Pl(n,e){let t=n.readTime.compareTo(e.readTime);return t!==0?t:(t=M.comparator(n.documentKey,e.documentKey),t!==0?t:H(n.largestBatchId,e.largestBatchId))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class wA{constructor(e,t=null,r=[],s=[],i=null,o=null,c=null){this.path=e,this.collectionGroup=t,this.orderBy=r,this.filters=s,this.limit=i,this.startAt=o,this.endAt=c,this.R=null}}function xu(n,e=null,t=[],r=[],s=null,i=null,o=null){return new wA(n,e,t,r,s,i,o)}function Va(n){const e=U(n);if(e.R===null){let t=e.path.canonicalString();e.collectionGroup!==null&&(t+="|cg:"+e.collectionGroup),t+="|f:",t+=e.filters.map((r=>Vu(r))).join(","),t+="|ob:",t+=e.orderBy.map((r=>(function(i){return i.field.canonicalString()+i.dir})(r))).join(","),go(e.limit)||(t+="|l:",t+=e.limit),e.startAt&&(t+="|lb:",t+=e.startAt.inclusive?"b:":"a:",t+=e.startAt.position.map((r=>_s(r))).join(",")),e.endAt&&(t+="|ub:",t+=e.endAt.inclusive?"a:":"b:",t+=e.endAt.position.map((r=>_s(r))).join(",")),e.R=t}return e.R}function bl(n,e){if(n.limit!==e.limit||n.orderBy.length!==e.orderBy.length)return!1;for(let t=0;t<n.orderBy.length;t++)if(!_A(n.orderBy[t],e.orderBy[t]))return!1;if(n.filters.length!==e.filters.length)return!1;for(let t=0;t<n.filters.length;t++)if(!Sg(n.filters[t],e.filters[t]))return!1;return n.collectionGroup===e.collectionGroup&&!!n.path.isEqual(e.path)&&!!Bf(n.startAt,e.startAt)&&Bf(n.endAt,e.endAt)}function Ht(n){return!!n.isCorePipeline}function Sl(n){return!!n.path&&M.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}function Ca(n,e){return n.filters.filter((t=>t instanceof ee&&t.field.isEqual(e)))}function qf(n,e,t){let r=Ut,s=!0;for(const i of Ca(n,e)){let o=Ut,c=!0;switch(i.op){case"<":case"<=":o=rA(i.value);break;case"==":case"in":case">=":o=i.value;break;case">":o=i.value,c=!1;break;case"!=":case"not-in":o=Ut}Df({value:r,inclusive:s},{value:o,inclusive:c})<0&&(r=o,s=c)}if(t!==null){for(let i=0;i<n.orderBy.length;++i)if(n.orderBy[i].field.isEqual(e)){const o=t.position[i];Df({value:r,inclusive:s},{value:o,inclusive:t.inclusive})<0&&(r=o,s=t.inclusive);break}}return{value:r,inclusive:s}}function $f(n,e,t){let r=Dn,s=!0;for(const i of Ca(n,e)){let o=Dn,c=!0;switch(i.op){case">=":case">":o=sA(i.value),c=!1;break;case"==":case"in":case"<=":o=i.value;break;case"<":o=i.value,c=!1;break;case"!=":case"not-in":o=Dn}kf({value:r,inclusive:s},{value:o,inclusive:c})>0&&(r=o,s=c)}if(t!==null){for(let i=0;i<n.orderBy.length;++i)if(n.orderBy[i].field.isEqual(e)){const o=t.position[i];kf({value:r,inclusive:s},{value:o,inclusive:t.inclusive})>0&&(r=o,s=t.inclusive);break}}return{value:r,inclusive:s}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dn{constructor(e,t=null,r=[],s=[],i=null,o="F",c=null,u=null){this.path=e,this.collectionGroup=t,this.explicitOrderBy=r,this.filters=s,this.limit=i,this.limitType=o,this.startAt=c,this.endAt=u,this.I=null,this.A=null,this.V=null,this.startAt,this.endAt}}function Og(n,e,t,r,s,i,o,c){return new dn(n,e,t,r,s,i,o,c)}function Gs(n){return new dn(n)}function jf(n){return n.filters.length===0&&n.limit===null&&n.startAt==null&&n.endAt==null&&(n.explicitOrderBy.length===0||n.explicitOrderBy.length===1&&n.explicitOrderBy[0].field.isKeyField())}function TA(n){return M.isDocumentKey(n.path)&&n.collectionGroup===null&&n.filters.length===0}function Vl(n){return n.collectionGroup!==null}function us(n){const e=U(n);if(e.I===null){e.I=[];const t=new Set;for(const i of e.explicitOrderBy)e.I.push(i),t.add(i.field.canonicalString());const r=e.explicitOrderBy.length>0?e.explicitOrderBy[e.explicitOrderBy.length-1].dir:"asc";(function(o){let c=new ce(Ee.comparator);return o.filters.forEach((u=>{u.getFlattenedFilters().forEach((l=>{l.isInequality()&&(c=c.add(l.field))}))})),c})(e).forEach((i=>{t.has(i.canonicalString())||i.isKeyField()||e.I.push(new Qi(i,r))})),t.has(Ee.keyField().canonicalString())||e.I.push(new Qi(Ee.keyField(),r))}return e.I}function Ge(n){const e=U(n);return e.A||(e.A=Mg(e,us(n))),e.A}function Lg(n){const e=U(n);return e.V||(e.V=Mg(e,n.explicitOrderBy)),e.V}function Mg(n,e){if(n.limitType==="F")return xu(n.path,n.collectionGroup,e,n.filters,n.limit,n.startAt,n.endAt);{e=e.map((s=>{const i=s.dir==="desc"?"asc":"desc";return new Qi(s.field,i)}));const t=n.endAt?new jn(n.endAt.position,n.endAt.inclusive):null,r=n.startAt?new jn(n.startAt.position,n.startAt.inclusive):null;return xu(n.path,n.collectionGroup,e,n.filters,n.limit,t,r)}}function Nu(n,e){const t=n.filters.concat([e]);return new dn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),t,n.limit,n.limitType,n.startAt,n.endAt)}function EA(n,e){const t=n.explicitOrderBy.concat([e]);return new dn(n.path,n.collectionGroup,t,n.filters.slice(),n.limit,n.limitType,n.startAt,n.endAt)}function xa(n,e,t){return new dn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),e,t,n.startAt,n.endAt)}function vA(n,e){return new dn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),n.limit,n.limitType,e,n.endAt)}function AA(n,e){return new dn(n.path,n.collectionGroup,n.explicitOrderBy.slice(),n.filters.slice(),n.limit,n.limitType,n.startAt,e)}function Fg(n,e){return bl(Ge(n),Ge(e))&&n.limitType===e.limitType}function ki(n){return`Query(target=${(function(t){let r=t.path.canonicalString();return t.collectionGroup!==null&&(r+=" collectionGroup="+t.collectionGroup),t.filters.length>0&&(r+=`, filters: [${t.filters.map((s=>Cg(s))).join(", ")}]`),go(t.limit)||(r+=", limit: "+t.limit),t.orderBy.length>0&&(r+=`, orderBy: [${t.orderBy.map((s=>(function(o){return`${o.field.canonicalString()} (${o.dir})`})(s))).join(", ")}]`),t.startAt&&(r+=", startAt: ",r+=t.startAt.inclusive?"b:":"a:",r+=t.startAt.position.map((s=>_s(s))).join(",")),t.endAt&&(r+=", endAt: ",r+=t.endAt.inclusive?"a:":"b:",r+=t.endAt.position.map((s=>_s(s))).join(",")),`Target(${r})`})(Ge(n))}; limitType=${n.limitType})`}function oc(n,e){return e.isFoundDocument()&&(function(r,s){const i=s.key.path;return r.collectionGroup!==null?s.key.hasCollectionId(r.collectionGroup)&&r.path.isPrefixOf(i):M.isDocumentKey(r.path)?r.path.isEqual(i):r.path.isImmediateParentOf(i)})(n,e)&&(function(r,s){for(const i of us(r))if(!i.field.isKeyField()&&s.data.field(i.field)===null)return!1;return!0})(n,e)&&(function(r,s){for(const i of r.filters)if(!i.matches(s))return!1;return!0})(n,e)&&(function(r,s){return!(r.startAt&&!(function(o,c,u){const l=Uf(o,c,u);return o.inclusive?l<=0:l<0})(r.startAt,us(r),s)||r.endAt&&!(function(o,c,u){const l=Uf(o,c,u);return o.inclusive?l>=0:l>0})(r.endAt,us(r),s))})(n,e)}function ac(n){return(e,t)=>{let r=!1;for(const s of us(n)){const i=RA(s,e,t);if(i!==0)return i;r=r||s.field.isKeyField()}return 0}}function RA(n,e,t){const r=n.field.isKeyField()?M.comparator(e.key,t.key):(function(i,o,c){const u=o.data.field(i),l=c.data.field(i);return u!==null&&l!==null?We(u,l):q(42886)})(n.field,e,t);switch(n.dir){case"asc":return r;case"desc":return-1*r;default:return q(19790,{direction:n.dir})}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class PA{constructor(e,t){this.count=e,this.unchangedNames=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */var Ae,te;function Ug(n){switch(n){case b.OK:return q(64938);case b.CANCELLED:case b.UNKNOWN:case b.DEADLINE_EXCEEDED:case b.RESOURCE_EXHAUSTED:case b.INTERNAL:case b.UNAVAILABLE:case b.UNAUTHENTICATED:return!1;case b.INVALID_ARGUMENT:case b.NOT_FOUND:case b.ALREADY_EXISTS:case b.PERMISSION_DENIED:case b.FAILED_PRECONDITION:case b.ABORTED:case b.OUT_OF_RANGE:case b.UNIMPLEMENTED:case b.DATA_LOSS:return!0;default:return q(15467,{code:n})}}function Bg(n){if(n===void 0)return Te("GRPC error has no .code"),b.UNKNOWN;switch(n){case Ae.OK:return b.OK;case Ae.CANCELLED:return b.CANCELLED;case Ae.UNKNOWN:return b.UNKNOWN;case Ae.DEADLINE_EXCEEDED:return b.DEADLINE_EXCEEDED;case Ae.RESOURCE_EXHAUSTED:return b.RESOURCE_EXHAUSTED;case Ae.INTERNAL:return b.INTERNAL;case Ae.UNAVAILABLE:return b.UNAVAILABLE;case Ae.UNAUTHENTICATED:return b.UNAUTHENTICATED;case Ae.INVALID_ARGUMENT:return b.INVALID_ARGUMENT;case Ae.NOT_FOUND:return b.NOT_FOUND;case Ae.ALREADY_EXISTS:return b.ALREADY_EXISTS;case Ae.PERMISSION_DENIED:return b.PERMISSION_DENIED;case Ae.FAILED_PRECONDITION:return b.FAILED_PRECONDITION;case Ae.ABORTED:return b.ABORTED;case Ae.OUT_OF_RANGE:return b.OUT_OF_RANGE;case Ae.UNIMPLEMENTED:return b.UNIMPLEMENTED;case Ae.DATA_LOSS:return b.DATA_LOSS;default:return q(39323,{code:n})}}(te=Ae||(Ae={}))[te.OK=0]="OK",te[te.CANCELLED=1]="CANCELLED",te[te.UNKNOWN=2]="UNKNOWN",te[te.INVALID_ARGUMENT=3]="INVALID_ARGUMENT",te[te.DEADLINE_EXCEEDED=4]="DEADLINE_EXCEEDED",te[te.NOT_FOUND=5]="NOT_FOUND",te[te.ALREADY_EXISTS=6]="ALREADY_EXISTS",te[te.PERMISSION_DENIED=7]="PERMISSION_DENIED",te[te.UNAUTHENTICATED=16]="UNAUTHENTICATED",te[te.RESOURCE_EXHAUSTED=8]="RESOURCE_EXHAUSTED",te[te.FAILED_PRECONDITION=9]="FAILED_PRECONDITION",te[te.ABORTED=10]="ABORTED",te[te.OUT_OF_RANGE=11]="OUT_OF_RANGE",te[te.UNIMPLEMENTED=12]="UNIMPLEMENTED",te[te.INTERNAL=13]="INTERNAL",te[te.UNAVAILABLE=14]="UNAVAILABLE",te[te.DATA_LOSS=15]="DATA_LOSS";/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fn{constructor(e,t){this.mapKeyFn=e,this.equalsFn=t,this.inner={},this.innerSize=0}get(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r!==void 0){for(const[s,i]of r)if(this.equalsFn(s,e))return i}}has(e){return this.get(e)!==void 0}set(e,t){const r=this.mapKeyFn(e),s=this.inner[r];if(s===void 0)return this.inner[r]=[[e,t]],void this.innerSize++;for(let i=0;i<s.length;i++)if(this.equalsFn(s[i][0],e))return void(s[i]=[e,t]);s.push([e,t]),this.innerSize++}delete(e){const t=this.mapKeyFn(e),r=this.inner[t];if(r===void 0)return!1;for(let s=0;s<r.length;s++)if(this.equalsFn(r[s][0],e))return r.length===1?delete this.inner[t]:r.splice(s,1),this.innerSize--,!0;return!1}forEach(e){Jn(this.inner,((t,r)=>{for(const[s,i]of r)e(s,i)}))}isEmpty(){return og(this.inner)}size(){return this.innerSize}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bA=new de(M.comparator);function Re(){return bA}const qg=new de(M.comparator);function hr(...n){let e=qg;for(const t of n)e=e.insert(t.key,t);return e}function $g(n){let e=qg;return n.forEach(((t,r)=>e=e.insert(t,r.overlayedDocument))),e}function mt(){return Oi()}function jg(){return Oi()}function Oi(){return new fn((n=>n.toString()),((n,e)=>n.isEqual(e)))}const SA=new de(M.comparator),VA=new ce(M.comparator);function Q(...n){let e=VA;for(const t of n)e=e.add(t);return e}const CA=new ce(H);function Cl(){return CA}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Li=null;function xA(n){if(Li)throw new Error("a TestingHooksSpi instance is already set");Li=n}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function zg(){return new TextEncoder}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const NA=new On([4294967295,4294967295],0);function zf(n){const e=zg().encode(n),t=new Xm;return t.update(e),new Uint8Array(t.digest())}function Gf(n){const e=new DataView(n.buffer),t=e.getUint32(0,!0),r=e.getUint32(4,!0),s=e.getUint32(8,!0),i=e.getUint32(12,!0);return[new On([t,r],0),new On([s,i],0)]}class xl{constructor(e,t,r){if(this.bitmap=e,this.padding=t,this.hashCount=r,t<0||t>=8)throw new Si(`Invalid padding: ${t}`);if(r<0)throw new Si(`Invalid hash count: ${r}`);if(e.length>0&&this.hashCount===0)throw new Si(`Invalid hash count: ${r}`);if(e.length===0&&t!==0)throw new Si(`Invalid padding when bitmap length is 0: ${t}`);this.m=8*e.length-t,this.p=On.fromNumber(this.m)}v(e,t,r){let s=e.add(t.multiply(On.fromNumber(r)));return s.compare(NA)===1&&(s=new On([s.getBits(0),s.getBits(1)],0)),s.modulo(this.p).toNumber()}S(e){return!!(this.bitmap[Math.floor(e/8)]&1<<e%8)}mightContain(e){if(this.m===0)return!1;const t=zf(e),[r,s]=Gf(t);for(let i=0;i<this.hashCount;i++){const o=this.v(r,s,i);if(!this.S(o))return!1}return!0}static create(e,t,r){const s=e%8==0?0:8-e%8,i=new Uint8Array(Math.ceil(e/8)),o=new xl(i,s,t);return r.forEach((c=>o.insert(c))),o}insert(e){if(this.m===0)return;const t=zf(e),[r,s]=Gf(t);for(let i=0;i<this.hashCount;i++){const o=this.v(r,s,i);this.D(o)}}D(e){const t=Math.floor(e/8),r=e%8;this.bitmap[t]|=1<<r}}class Si extends Error{constructor(){super(...arguments),this.name="BloomFilterError"}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ks{constructor(e,t,r,s,i,o){this.snapshotVersion=e,this.targetChanges=t,this.targetMismatches=r,this.documentUpdates=s,this.augmentedDocumentUpdates=i,this.resolvedLimboDocuments=o}static createSynthesizedRemoteEventForCurrentChange(e,t,r){const s=new Map;return s.set(e,_o.createSynthesizedTargetChangeForCurrentChange(e,t,r)),new Ks(j.min(),s,new de(H),Re(),Re(),Q())}}class _o{constructor(e,t,r,s,i){this.resumeToken=e,this.current=t,this.addedDocuments=r,this.modifiedDocuments=s,this.removedDocuments=i}static createSynthesizedTargetChangeForCurrentChange(e,t,r){return new _o(r,t,Q(),Q(),Q())}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ua{constructor(e,t,r,s){this.C=e,this.removedTargetIds=t,this.key=r,this.F=s}}class Gg{constructor(e,t){this.targetId=e,this.O=t}}class Kg{constructor(e,t,r=pe.EMPTY_BYTE_STRING,s=null){this.state=e,this.targetIds=t,this.resumeToken=r,this.cause=s}}class Kf{constructor(e){this.targetId=e,this.M=0,this.N=Wf(),this.L=pe.EMPTY_BYTE_STRING,this.B=!1,this.U=!0}get current(){return this.B}get resumeToken(){return this.L}get k(){return this.M!==0}get q(){return this.U}$(e){e.approximateByteSize()>0&&(this.U=!0,this.L=e)}K(){let e=Q(),t=Q(),r=Q();return this.N.forEach(((s,i)=>{switch(i){case 0:e=e.add(s);break;case 2:t=t.add(s);break;case 1:r=r.add(s);break;default:q(38017,{changeType:i})}})),new _o(this.L,this.B,e,t,r)}W(){this.U=!1,this.N=Wf()}G(e,t){this.U=!0,this.N=this.N.insert(e,t)}j(e){this.U=!0,this.N=this.N.remove(e)}H(){this.M+=1}J(){this.M-=1,L(this.M>=0,3241,{M:this.M,targetId:this.targetId})}Y(){this.U=!0,this.B=!0}}const Ii="WatchChangeAggregator";class DA{constructor(e){this.Z=e,this.X=new Map,this.ee=Re(),this.te=Ho(),this.ne=Re(),this.re=Ho(),this.ie=new de(H)}se(e){for(const t of e.C)e.F&&e.F.isFoundDocument()?this._e(t,e.F):this.oe(t,e.key,e.F);for(const t of e.removedTargetIds)this.oe(t,e.key,e.F)}ae(e){this.forEachTarget(e,(t=>{const r=this.X.get(t);if(r)switch(e.state){case 0:this.ue(t)&&r.$(e.resumeToken);break;case 1:r.J(),r.k||r.W(),r.$(e.resumeToken);break;case 2:r.J(),r.k||this.removeTarget(t);break;case 3:this.ue(t)&&(r.Y(),r.$(e.resumeToken));break;case 4:this.ue(t)&&(this.ce(t),r.$(e.resumeToken));break;default:q(56790,{state:e.state})}else O(Ii,`handleTargetChange received targetChange for untracked target ID (${t}) with state (${e.state})`)}))}forEachTarget(e,t){e.targetIds.length>0?e.targetIds.forEach(t):this.X.forEach(((r,s)=>{this.ue(s)&&t(s)}))}le(e){var t;return Ht(e)?e.getPipelineSourceType()==="documents"&&((t=e.getPipelineDocuments())==null?void 0:t.length)===1:Sl(e)}Ee(e){const t=e.targetId,r=e.O.count,s=this.he(t);if(s){const i=s.target;if(this.le(i))if(r===0){const o=new M(Ht(i)?J.fromString(i.getPipelineDocuments()[0]):i.path);this.oe(t,o,ge.newNoDocument(o,j.min()))}else L(r===1,20013,"Single document existence filter with count: "+r);else{const o=this.Te(t);if(o!==r){const c=this.Pe(e),u=c?this.Re(c,e,o):1;if(u!==0){this.ce(t);const l=u===2?"TargetPurposeExistenceFilterMismatchBloom":"TargetPurposeExistenceFilterMismatch";this.ie=this.ie.insert(t,l)}Li==null||Li.Ie((function(d,p,g,w,S){var $,z,G;const D={localCacheCount:d,existenceFilterCount:p.count,databaseId:g.database,projectId:g.projectId},k=p.unchangedNames;return k&&(D.bloomFilter={applied:S===0,hashCount:(k==null?void 0:k.hashCount)??0,bitmapLength:((z=($=k==null?void 0:k.bits)==null?void 0:$.bitmap)==null?void 0:z.length)??0,padding:((G=k==null?void 0:k.bits)==null?void 0:G.padding)??0,mightContain:ie=>(w==null?void 0:w.mightContain(ie))??!1}),D})(o,e.O,this.Z.Ae(),c,u))}}}}Pe(e){const t=e.O.unchangedNames;if(!t||!t.bits)return null;const{bits:{bitmap:r="",padding:s=0},hashCount:i=0}=t;let o,c;try{o=on(r).toUint8Array()}catch(u){if(u instanceof ug)return xe("Decoding the base64 bloom filter in existence filter failed ("+u.message+"); ignoring the bloom filter and falling back to full re-query."),null;throw u}try{c=new xl(o,s,i)}catch(u){return xe(u instanceof Si?"BloomFilter error: ":"Applying bloom filter failed: ",u),null}return c.m===0?null:c}Re(e,t,r){return t.O.count===r-this.Ve(e,t.targetId)?0:2}Ve(e,t){const r=this.Z.getRemoteKeysForTarget(t);let s=0;return r.forEach((i=>{const o=this.Z.Ae(),c=`projects/${o.projectId}/databases/${o.database}/documents/${i.path.canonicalString()}`;e.mightContain(c)||(this.oe(t,i,null),s++)})),s}de(e){const t=new Map;this.X.forEach(((i,o)=>{const c=this.he(o);if(c){if(i.current&&this.le(c.target)){const u=Ht(c.target)?J.fromString(c.target.getPipelineDocuments()[0]):c.target.path,l=new M(u);this.fe(l).has(o)||this.me(o,l)||this.oe(o,l,ge.newNoDocument(l,e))}i.q&&(t.set(o,i.K()),i.W())}}));let r=Q();this.re.forEach(((i,o)=>{let c=!0;o.forEachWhile((u=>{const l=this.he(u);return!l||l.purpose==="TargetPurposeLimboResolution"||(c=!1,!1)})),c&&(r=r.add(i))})),this.ee.forEach(((i,o)=>o.setReadTime(e))),this.ne.forEach(((i,o)=>o.setReadTime(e)));const s=new Ks(e,t,this.ie,this.ee,this.ne,r);return this.ee=Re(),this.te=Ho(),this.ne=Re(),this.re=Ho(),this.ie=new de(H),s}_e(e,t){const r=this.X.get(e);if(!r||!this.ue(e))return void O(Ii,`addDocumentToTarget received document for unknown inactive target (${e})`);const s=this.me(e,t.key)?2:0;r.G(t.key,s),Ht(this.he(e).target)&&this.he(e).target.getPipelineFlavor()!=="exact"?this.ne=this.ne.insert(t.key,t):this.ee=this.ee.insert(t.key,t),this.te=this.te.insert(t.key,this.fe(t.key).add(e)),this.re=this.re.insert(t.key,this.pe(t.key).add(e))}oe(e,t,r){const s=this.X.get(e);s&&this.ue(e)?(this.me(e,t)?s.G(t,1):s.j(t),this.re=this.re.insert(t,this.pe(t).delete(e)),this.re=this.re.insert(t,this.pe(t).add(e)),r&&(Ht(this.he(e).target)&&this.he(e).target.getPipelineFlavor()!=="exact"?this.ne=this.ne.insert(t,r):this.ee=this.ee.insert(t,r))):O(Ii,`removeDocumentFromTarget received document for unknown or inactive target (${e})`)}removeTarget(e){this.X.delete(e)}Te(e){const t=this.X.get(e);if(!t)return 0;const r=t.K();return this.Z.getRemoteKeysForTarget(e).size+r.addedDocuments.size-r.removedDocuments.size}H(e){let t=this.X.get(e);t||(O(Ii,`recordPendingTargetRequest set up tracking for target ID ${e}`),t=new Kf(e),this.X.set(e,t)),t.H()}pe(e){let t=this.re.get(e);return t||(t=new ce(H),this.re=this.re.insert(e,t)),t}fe(e){let t=this.te.get(e);return t||(t=new ce(H),this.te=this.te.insert(e,t)),t}ue(e){const t=this.he(e)!==null;return t||O(Ii,"Detected inactive target",e),t}he(e){const t=this.X.get(e);return t===void 0||t.k?null:this.Z.ge(e)}ce(e){this.X.set(e,new Kf(e)),this.Z.getRemoteKeysForTarget(e).forEach((t=>{this.oe(e,t,null)}))}me(e,t){return this.Z.getRemoteKeysForTarget(e).has(t)}}function Ho(){return new de(M.comparator)}function Wf(){return new de(M.comparator)}const kA={asc:"ASCENDING",desc:"DESCENDING"},OA={"<":"LESS_THAN","<=":"LESS_THAN_OR_EQUAL",">":"GREATER_THAN",">=":"GREATER_THAN_OR_EQUAL","==":"EQUAL","!=":"NOT_EQUAL","array-contains":"ARRAY_CONTAINS",in:"IN","not-in":"NOT_IN","array-contains-any":"ARRAY_CONTAINS_ANY"},LA={and:"AND",or:"OR"};class MA{constructor(e,t){this.databaseId=e,this.useProto3Json=t}}function Du(n,e){return n.useProto3Json||go(e)?e:{value:e}}function Rs(n,e){return n.useProto3Json?`${new Date(1e3*e.seconds).toISOString().replace(/\.\d*/,"").replace("Z","")}.${("000000000"+e.nanoseconds).slice(-9)}Z`:{seconds:""+e.seconds,nanos:e.nanoseconds}}function Nl(n){const e=sn(n);return new oe(e.seconds,e.nanos)}function Wg(n,e){return n.useProto3Json?e.toBase64():e.toUint8Array()}function la(n,e){return Rs(n,e.toTimestamp())}function ve(n){return L(!!n,49232),j.fromTimestamp(Nl(n))}function Dl(n,e){return ku(n,e).canonicalString()}function ku(n,e){const t=(function(s){return new J(["projects",s.projectId,"databases",s.database])})(n).child("documents");return e===void 0?t:t.child(e)}function Hg(n){const e=J.fromString(n);return L(s_(e),10190,{key:e.toString()}),e}function Ps(n,e){return Dl(n.databaseId,e.path)}function Bt(n,e){const t=Hg(e);if(t.get(1)!==n.databaseId.projectId)throw new N(b.INVALID_ARGUMENT,"Tried to deserialize key from different project: "+t.get(1)+" vs "+n.databaseId.projectId);if(t.get(3)!==n.databaseId.database)throw new N(b.INVALID_ARGUMENT,"Tried to deserialize key from different database: "+t.get(3)+" vs "+n.databaseId.database);return new M(Yg(t))}function Qg(n,e){return Dl(n.databaseId,e)}function Jg(n){const e=Hg(n);return e.length===4?J.emptyPath():Yg(e)}function Ou(n){return new J(["projects",n.databaseId.projectId,"databases",n.databaseId.database]).canonicalString()}function Yg(n){return L(n.length>4&&n.get(4)==="documents",29091,{key:n.toString()}),n.popFirst(5)}function Hf(n,e,t){return{name:Ps(n,e),fields:t.value.mapValue.fields}}function cc(n,e,t){const r=Bt(n,e.name),s=ve(e.updateTime),i=e.createTime?ve(e.createTime):j.min(),o=new Ve({mapValue:{fields:e.fields}}),c=ge.newFoundDocument(r,s,i,o);return t&&c.setHasCommittedMutations(),t?c.setHasCommittedMutations():c}function FA(n,e){return"found"in e?(function(r,s){L(!!s.found,43571),s.found.name,s.found.updateTime;const i=Bt(r,s.found.name),o=ve(s.found.updateTime),c=s.found.createTime?ve(s.found.createTime):j.min(),u=new Ve({mapValue:{fields:s.found.fields}});return ge.newFoundDocument(i,o,c,u)})(n,e):"missing"in e?(function(r,s){L(!!s.missing,3894),L(!!s.readTime,22933);const i=Bt(r,s.missing),o=ve(s.readTime);return ge.newNoDocument(i,o)})(n,e):q(7234,{result:e})}function UA(n,e){let t;if("targetChange"in e){e.targetChange;const r=(function(l){return l==="NO_CHANGE"?0:l==="ADD"?1:l==="REMOVE"?2:l==="CURRENT"?3:l==="RESET"?4:q(39313,{state:l})})(e.targetChange.targetChangeType||"NO_CHANGE"),s=e.targetChange.targetIds||[],i=(function(l,d){return l.useProto3Json?(L(d===void 0||typeof d=="string",58123),pe.fromBase64String(d||"")):(L(d===void 0||d instanceof Buffer||d instanceof Uint8Array,16193),pe.fromUint8Array(d||new Uint8Array))})(n,e.targetChange.resumeToken),o=e.targetChange.cause,c=o&&(function(l){const d=l.code===void 0?b.UNKNOWN:Bg(l.code);return new N(d,l.message||"")})(o);t=new Kg(r,s,i,c||null)}else if("documentChange"in e){e.documentChange;const r=e.documentChange;r.document,r.document.name,r.document.updateTime;const s=Bt(n,r.document.name),i=ve(r.document.updateTime),o=r.document.createTime?ve(r.document.createTime):j.min(),c=new Ve({mapValue:{fields:r.document.fields}}),u=ge.newFoundDocument(s,i,o,c),l=r.targetIds||[],d=r.removedTargetIds||[];t=new ua(l,d,u.key,u)}else if("documentDelete"in e){e.documentDelete;const r=e.documentDelete;r.document;const s=Bt(n,r.document),i=r.readTime?ve(r.readTime):j.min(),o=ge.newNoDocument(s,i),c=r.removedTargetIds||[];t=new ua([],c,o.key,o)}else if("documentRemove"in e){e.documentRemove;const r=e.documentRemove;r.document;const s=Bt(n,r.document),i=r.removedTargetIds||[];t=new ua([],i,s,null)}else{if(!("filter"in e))return q(11601,{ye:e});{e.filter;const r=e.filter;r.targetId;const{count:s=0,unchangedNames:i}=r,o=new PA(s,i),c=r.targetId;t=new Gg(c,o)}}return t}function Ji(n,e){let t;if(e instanceof js)t={update:Hf(n,e.key,e.value)};else if(e instanceof zs)t={delete:Ps(n,e.key)};else if(e instanceof hn)t={update:Hf(n,e.key,e.data),updateMask:GA(e.fieldMask)};else{if(!(e instanceof Al))return q(16599,{we:e.type});t={verify:Ps(n,e.key)}}return e.fieldTransforms.length>0&&(t.updateTransforms=e.fieldTransforms.map((r=>(function(i,o){const c=o.transform;if(c instanceof ys)return{fieldPath:o.field.canonicalString(),setToServerValue:"REQUEST_TIME"};if(c instanceof Sr)return{fieldPath:o.field.canonicalString(),appendMissingElements:{values:c.elements}};if(c instanceof Vr)return{fieldPath:o.field.canonicalString(),removeAllFromArray:{values:c.elements}};if(c instanceof Cr)return{fieldPath:o.field.canonicalString(),increment:c.l};if(c instanceof Is)return{fieldPath:o.field.canonicalString(),minimum:c.l};if(c instanceof ws)return{fieldPath:o.field.canonicalString(),maximum:c.l};throw q(20930,{transform:o.transform})})(0,r)))),e.precondition.isNone||(t.currentDocument=(function(s,i){return i.updateTime!==void 0?{updateTime:la(s,i.updateTime)}:i.exists!==void 0?{exists:i.exists}:q(27497)})(n,e.precondition)),t}function Lu(n,e){const t=e.currentDocument?(function(i){return i.updateTime!==void 0?_e.updateTime(ve(i.updateTime)):i.exists!==void 0?_e.exists(i.exists):_e.none()})(e.currentDocument):_e.none(),r=e.updateTransforms?e.updateTransforms.map((s=>(function(o,c){let u=null;if("setToServerValue"in c)L(c.setToServerValue==="REQUEST_TIME",16630,{proto:c}),u=new ys;else if("appendMissingElements"in c){const d=c.appendMissingElements.values||[];u=new Sr(d)}else if("removeAllFromArray"in c){const d=c.removeAllFromArray.values||[];u=new Vr(d)}else"increment"in c?u=new Cr(o,c.increment):"minimum"in c?u=new Is(o,c.minimum):"maximum"in c?u=new ws(o,c.maximum):q(16584,{proto:c});const l=Ee.fromServerFormat(c.fieldPath);return new Fr(l,u)})(n,s))):[];if(e.update){e.update.name;const s=Bt(n,e.update.name),i=new Ve({mapValue:{fields:e.update.fields}});if(e.updateMask){const o=(function(u){const l=u.fieldPaths||[];return new tt(l.map((d=>Ee.fromServerFormat(d))))})(e.updateMask);return new hn(s,i,o,t,r)}return new js(s,i,t,r)}if(e.delete){const s=Bt(n,e.delete);return new zs(s,t)}if(e.verify){const s=Bt(n,e.verify);return new Al(s,t)}return q(1463,{proto:e})}function BA(n,e){return n&&n.length>0?(L(e!==void 0,14353),n.map((t=>(function(s,i){let o=s.updateTime?ve(s.updateTime):ve(i);return o.isEqual(j.min())&&(o=ve(i)),new cA(o,s.transformResults||[])})(t,e)))):[]}function Xg(n,e){return{documents:[Qg(n,e.path)]}}function uc(n,e){const t={structuredQuery:{}},r=e.path;let s;e.collectionGroup!==null?(s=r,t.structuredQuery.from=[{collectionId:e.collectionGroup,allDescendants:!0}]):(s=r.popLast(),t.structuredQuery.from=[{collectionId:r.lastSegment()}]),t.parent=Qg(n,s);const i=(function(l){if(l.length!==0)return r_(ue.create(l,"and"))})(e.filters);i&&(t.structuredQuery.where=i);const o=(function(l){if(l.length!==0)return l.map((d=>(function(g){return{field:xn(g.field),direction:$A(g.dir)}})(d)))})(e.orderBy);o&&(t.structuredQuery.orderBy=o);const c=Du(n,e.limit);return c!==null&&(t.structuredQuery.limit=c),e.startAt&&(t.structuredQuery.startAt=(function(l){return{before:l.inclusive,values:l.position}})(e.startAt)),e.endAt&&(t.structuredQuery.endAt=(function(l){return{before:!l.inclusive,values:l.position}})(e.endAt)),{be:t,parent:s}}function Zg(n,e,t,r){const{be:s,parent:i}=uc(n,e),o={},c=[];let u=0;return t.forEach((l=>{const d=r?l.alias:"aggregate_"+u++;o[d]=l.alias,l.aggregateType==="count"?c.push({alias:d,count:{}}):l.aggregateType==="avg"?c.push({alias:d,avg:{field:xn(l.fieldPath)}}):l.aggregateType==="sum"&&c.push({alias:d,sum:{field:xn(l.fieldPath)}})})),{request:{structuredAggregationQuery:{aggregations:c,structuredQuery:s.structuredQuery},parent:s.parent},ve:o,parent:i}}function e_(n){let e=Jg(n.parent);const t=n.structuredQuery,r=t.from?t.from.length:0;let s=null;if(r>0){L(r===1,65062);const d=t.from[0];d.allDescendants?s=d.collectionId:e=e.child(d.collectionId)}let i=[];t.where&&(i=(function(p){const g=n_(p);return g instanceof ue&&Rl(g)?g.getFilters():[g]})(t.where));let o=[];t.orderBy&&(o=(function(p){return p.map((g=>(function(S){return new Qi(ss(S.field),(function(k){switch(k){case"ASCENDING":return"asc";case"DESCENDING":return"desc";default:return}})(S.direction))})(g)))})(t.orderBy));let c=null;t.limit&&(c=(function(p){let g;return g=typeof p=="object"?p.value:p,go(g)?null:g})(t.limit));let u=null;t.startAt&&(u=(function(p){const g=!!p.before,w=p.values||[];return new jn(w,g)})(t.startAt));let l=null;return t.endAt&&(l=(function(p){const g=!p.before,w=p.values||[];return new jn(w,g)})(t.endAt)),Og(e,s,o,i,c,"F",u,l)}function qA(n,e){const t=(function(s){switch(s){case"TargetPurposeListen":return null;case"TargetPurposeExistenceFilterMismatch":return"existence-filter-mismatch";case"TargetPurposeExistenceFilterMismatchBloom":return"existence-filter-mismatch-bloom";case"TargetPurposeLimboResolution":return"limbo-document";default:return q(28987,{purpose:s})}})(e.purpose);return t==null?null:{"goog-listen-tags":t}}function t_(n,e){return{structuredPipeline:{pipeline:{stages:e.stages.map((t=>t._toProto(n)))}}}}function n_(n){return n.unaryFilter!==void 0?(function(t){switch(t.unaryFilter.op){case"IS_NAN":const r=ss(t.unaryFilter.field);return ee.create(r,"==",{doubleValue:NaN});case"IS_NULL":const s=ss(t.unaryFilter.field);return ee.create(s,"==",{nullValue:"NULL_VALUE"});case"IS_NOT_NAN":const i=ss(t.unaryFilter.field);return ee.create(i,"!=",{doubleValue:NaN});case"IS_NOT_NULL":const o=ss(t.unaryFilter.field);return ee.create(o,"!=",{nullValue:"NULL_VALUE"});case"OPERATOR_UNSPECIFIED":return q(61313);default:return q(60726)}})(n):n.fieldFilter!==void 0?(function(t){return ee.create(ss(t.fieldFilter.field),(function(s){switch(s){case"EQUAL":return"==";case"NOT_EQUAL":return"!=";case"GREATER_THAN":return">";case"GREATER_THAN_OR_EQUAL":return">=";case"LESS_THAN":return"<";case"LESS_THAN_OR_EQUAL":return"<=";case"ARRAY_CONTAINS":return"array-contains";case"IN":return"in";case"NOT_IN":return"not-in";case"ARRAY_CONTAINS_ANY":return"array-contains-any";case"OPERATOR_UNSPECIFIED":return q(58110);default:return q(50506)}})(t.fieldFilter.op),t.fieldFilter.value)})(n):n.compositeFilter!==void 0?(function(t){return ue.create(t.compositeFilter.filters.map((r=>n_(r))),(function(s){switch(s){case"AND":return"and";case"OR":return"or";default:return q(1026)}})(t.compositeFilter.op))})(n):q(30097,{filter:n})}function $A(n){return kA[n]}function jA(n){return OA[n]}function zA(n){return LA[n]}function xn(n){return{fieldPath:n.canonicalString()}}function ss(n){return Ee.fromServerFormat(n.fieldPath)}function r_(n){return n instanceof ee?(function(t){if(t.op==="=="){if(ot(t.value))return{unaryFilter:{field:xn(t.field),op:"IS_NAN"}};if(ht(t.value))return{unaryFilter:{field:xn(t.field),op:"IS_NULL"}}}else if(t.op==="!="){if(ot(t.value))return{unaryFilter:{field:xn(t.field),op:"IS_NOT_NAN"}};if(ht(t.value))return{unaryFilter:{field:xn(t.field),op:"IS_NOT_NULL"}}}return{fieldFilter:{field:xn(t.field),op:jA(t.op),value:t.value}}})(n):n instanceof ue?(function(t){const r=t.getFilters().map((s=>r_(s)));return r.length===1?r[0]:{compositeFilter:{op:zA(t.op),filters:r}}})(n):q(54877,{filter:n})}function GA(n){const e=[];return n.fields.forEach((t=>e.push(t.canonicalString()))),{fieldPaths:e}}function s_(n){return n.length>=4&&n.get(0)==="projects"&&n.get(2)==="databases"}function i_(n){return!!n&&typeof n._toProto=="function"&&n._protoValueType==="ProtoValue"}function Yi(n,e){const t={fields:{}};return e.forEach(((r,s)=>{if(typeof s!="string")throw new Error(`Cannot encode map with non-string key: ${s}`);t.fields[s]=r._toProto(n)})),{mapValue:t}}function o_(n){return{stringValue:n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Ur(n){return new MA(n,!0)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class et{constructor(e){this._byteString=e}static fromBase64String(e){try{return new et(pe.fromBase64String(e))}catch(t){throw new N(b.INVALID_ARGUMENT,"Failed to construct data from Base64 string: "+t)}}static fromUint8Array(e){return new et(pe.fromUint8Array(e))}toBase64(){return this._byteString.toBase64()}toUint8Array(){return this._byteString.toUint8Array()}toString(){return"Bytes(base64: "+this.toBase64()+")"}isEqual(e){return this._byteString.isEqual(e._byteString)}toJSON(){return{type:et._jsonSchemaVersion,bytes:this.toBase64()}}static fromJSON(e){if(Mr(e,et._jsonSchema))return et.fromBase64String(e.bytes)}}et._jsonSchemaVersion="firestore/bytes/1.0",et._jsonSchema={type:Pe("string",et._jsonSchemaVersion),bytes:Pe("string")};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Br{constructor(...e){for(let t=0;t<e.length;++t)if(e[t].length===0)throw new N(b.INVALID_ARGUMENT,"Invalid field name at argument $(i + 1). Field names must not be empty.");this._internalPath=new Ee(e)}isEqual(e){return this._internalPath.isEqual(e._internalPath)}}function a_(){return new Br(Dt)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wt{constructor(e){this._methodName=e}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vt{constructor(e,t){if(!isFinite(e)||e<-90||e>90)throw new N(b.INVALID_ARGUMENT,"Latitude must be a number between -90 and 90, but was: "+e);if(!isFinite(t)||t<-180||t>180)throw new N(b.INVALID_ARGUMENT,"Longitude must be a number between -180 and 180, but was: "+t);this._lat=e,this._long=t}get latitude(){return this._lat}get longitude(){return this._long}isEqual(e){return this._lat===e._lat&&this._long===e._long}_compareTo(e){return H(this._lat,e._lat)||H(this._long,e._long)}toJSON(){return{latitude:this._lat,longitude:this._long,type:vt._jsonSchemaVersion}}static fromJSON(e){if(Mr(e,vt._jsonSchema))return new vt(e.latitude,e.longitude)}}vt._jsonSchemaVersion="firestore/geoPoint/1.0",vt._jsonSchema={type:Pe("string",vt._jsonSchemaVersion),latitude:Pe("number"),longitude:Pe("number")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Le{constructor(e){this.uid=e}isAuthenticated(){return this.uid!=null}toKey(){return this.isAuthenticated()?"uid:"+this.uid:"anonymous-user"}isEqual(e){return e.uid===this.uid}}Le.UNAUTHENTICATED=new Le(null),Le.GOOGLE_CREDENTIALS=new Le("google-credentials-uid"),Le.FIRST_PARTY=new Le("first-party-uid"),Le.MOCK_USER=new Le("mock-user");/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fe{constructor(){this.promise=new Promise(((e,t)=>{this.resolve=e,this.reject=t}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class c_{constructor(e,t){this.user=t,this.type="OAuth",this.headers=new Map,this.headers.set("Authorization",`Bearer ${e}`)}}class u_{getToken(){return Promise.resolve(null)}invalidateToken(){}start(e,t){e.enqueueRetryable((()=>t(Le.UNAUTHENTICATED)))}shutdown(){}}class KA{constructor(e){this.token=e,this.changeListener=null}getToken(){return Promise.resolve(this.token)}invalidateToken(){}start(e,t){this.changeListener=t,e.enqueueRetryable((()=>t(this.token.user)))}shutdown(){this.changeListener=null}}class WA{constructor(e){this.Se=e,this.currentUser=Le.UNAUTHENTICATED,this.De=0,this.forceRefresh=!1,this.auth=null}start(e,t){L(this.xe===void 0,42304);let r=this.De;const s=u=>this.De!==r?(r=this.De,t(u)):Promise.resolve();let i=new Fe;this.xe=()=>{this.De++,this.currentUser=this.Ce(),i.resolve(),i=new Fe,e.enqueueRetryable((()=>s(this.currentUser)))};const o=()=>{const u=i;e.enqueueRetryable((async()=>{await u.promise,await s(this.currentUser)}))},c=u=>{O("FirebaseAuthCredentialsProvider","Auth detected"),this.auth=u,this.xe&&(this.auth.addAuthTokenListener(this.xe),o())};this.Se.onInit((u=>c(u))),setTimeout((()=>{if(!this.auth){const u=this.Se.getImmediate({optional:!0});u?c(u):(O("FirebaseAuthCredentialsProvider","Auth not yet detected"),i.resolve(),i=new Fe)}}),0),o()}getToken(){const e=this.De,t=this.forceRefresh;return this.forceRefresh=!1,this.auth?this.auth.getToken(t).then((r=>this.De!==e?(O("FirebaseAuthCredentialsProvider","getToken aborted due to token change."),this.getToken()):r?(L(typeof r.accessToken=="string",31837,{Fe:r}),new c_(r.accessToken,this.currentUser)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.auth&&this.xe&&this.auth.removeAuthTokenListener(this.xe),this.xe=void 0}Ce(){const e=this.auth&&this.auth.getUid();return L(e===null||typeof e=="string",2055,{Oe:e}),new Le(e)}}class HA{constructor(e,t,r){this.Me=e,this.Ne=t,this.Le=r,this.type="FirstParty",this.user=Le.FIRST_PARTY,this.Be=new Map}Ue(){return this.Le?this.Le():null}get headers(){this.Be.set("X-Goog-AuthUser",this.Me);const e=this.Ue();return e&&this.Be.set("Authorization",e),this.Ne&&this.Be.set("X-Goog-Iam-Authorization-Token",this.Ne),this.Be}}class QA{constructor(e,t,r){this.Me=e,this.Ne=t,this.Le=r}getToken(){return Promise.resolve(new HA(this.Me,this.Ne,this.Le))}start(e,t){e.enqueueRetryable((()=>t(Le.FIRST_PARTY)))}shutdown(){}invalidateToken(){}}class Mu{constructor(e){this.value=e,this.type="AppCheck",this.headers=new Map,e&&e.length>0&&this.headers.set("x-firebase-appcheck",this.value)}}class JA{constructor(e,t){this.ke=t,this.forceRefresh=!1,this.appCheck=null,this.qe=null,this.$e=null,lt(e)&&e.settings.appCheckToken&&(this.$e=e.settings.appCheckToken)}start(e,t){L(this.xe===void 0,3512);const r=i=>{i.error!=null&&O("FirebaseAppCheckTokenProvider",`Error getting App Check token; using placeholder token instead. Error: ${i.error.message}`);const o=i.token!==this.qe;return this.qe=i.token,O("FirebaseAppCheckTokenProvider",`Received ${o?"new":"existing"} token.`),o?t(i.token):Promise.resolve()};this.xe=i=>{e.enqueueRetryable((()=>r(i)))};const s=i=>{O("FirebaseAppCheckTokenProvider","AppCheck detected"),this.appCheck=i,this.xe&&this.appCheck.addTokenListener(this.xe)};this.ke.onInit((i=>s(i))),setTimeout((()=>{if(!this.appCheck){const i=this.ke.getImmediate({optional:!0});i?s(i):O("FirebaseAppCheckTokenProvider","AppCheck not yet detected")}}),0)}getToken(){if(this.$e)return Promise.resolve(new Mu(this.$e));const e=this.forceRefresh;return this.forceRefresh=!1,this.appCheck?this.appCheck.getToken(e).then((t=>t?(L(typeof t.token=="string",44558,{tokenResult:t}),this.qe=t.token,new Mu(t.token)):null)):Promise.resolve(null)}invalidateToken(){this.forceRefresh=!0}shutdown(){this.appCheck&&this.xe&&this.appCheck.removeTokenListener(this.xe),this.xe=void 0}}class YA{getToken(){return Promise.resolve(new Mu(""))}invalidateToken(){}start(e,t){}shutdown(){}}function l_(n){const e={};return n.timeoutSeconds!==void 0&&(e.timeoutSeconds=n.timeoutSeconds),e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class XA{Ke(e){}shutdown(){}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qf="ConnectivityMonitor";class Jf{constructor(){this.We=()=>this.Qe(),this.Ge=()=>this.ze(),this.je=[],this.He()}Ke(e){this.je.push(e)}shutdown(){window.removeEventListener("online",this.We),window.removeEventListener("offline",this.Ge)}He(){window.addEventListener("online",this.We),window.addEventListener("offline",this.Ge)}Qe(){O(Qf,"Network connectivity changed: AVAILABLE");for(const e of this.je)e(0)}ze(){O(Qf,"Network connectivity changed: UNAVAILABLE");for(const e of this.je)e(1)}static Je(){return typeof window<"u"&&window.addEventListener!==void 0&&window.removeEventListener!==void 0}}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Qo=null;function Fu(){return Qo===null?Qo=(function(){return 268435456+Math.round(2147483648*Math.random())})():Qo++,"0x"+Qo.toString(16)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const uu="RestConnection",ZA={BatchGetDocuments:"batchGet",Commit:"commit",RunQuery:"runQuery",RunAggregationQuery:"runAggregationQuery",ExecutePipeline:"executePipeline"};class eR{get Ye(){return!1}constructor(e){this.databaseInfo=e,this.databaseId=e.databaseId;const t=e.ssl?"https":"http",r=encodeURIComponent(this.databaseId.projectId),s=encodeURIComponent(this.databaseId.database);this.Ze=t+"://"+e.host,this.Xe=`projects/${r}/databases/${s}`,this.et=this.databaseId.database===Wi?`project_id=${r}`:`project_id=${r}&database_id=${s}`}tt(e,t,r,s,i){const o=Fu(),c=this.nt(e,t.toUriEncodedString());O(uu,`Sending RPC '${e}' ${o}:`,c,r);const u={"google-cloud-resource-prefix":this.Xe,"x-goog-request-params":this.et};this.rt(u,s,i);const{host:l}=new URL(c),d=Fs(l);return this.it(e,c,u,r,d).then((p=>(O(uu,`Received RPC '${e}' ${o}: `,p),p)),(p=>{throw xe(uu,`RPC '${e}' ${o} failed with error: `,p,"url: ",c,"request:",r),p}))}st(e,t,r,s,i,o){return this.tt(e,t,r,s,i)}rt(e,t,r){if(e["X-Goog-Api-Client"]=(function(){return"gl-js/ fire/"+qs})(),e["Content-Type"]="text/plain",this.databaseInfo.appId&&(e["X-Firebase-GMPID"]=this.databaseInfo.appId),t&&t.headers.forEach(((s,i)=>e[i]=s)),r&&r.headers.forEach(((s,i)=>e[i]=s)),this.databaseInfo._customHeaders)for(const s of Object.keys(this.databaseInfo._customHeaders))e[s]=this.databaseInfo._customHeaders[s]}nt(e,t){const r=ZA[e];let s=`${this.Ze}/v1/${t}:${r}`;return this.databaseInfo.apiKey&&(s=`${s}?key=${encodeURIComponent(this.databaseInfo.apiKey)}`),s}terminate(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tR{constructor(e){this._t=e._t,this.ot=e.ot}ut(e){this.ct=e}lt(e){this.Et=e}ht(e){this.Tt=e}onMessage(e){this.Pt=e}close(){this.ot()}send(e){this._t(e)}Rt(){this.ct()}It(){this.Et()}At(e){this.Tt(e)}Vt(e){this.Pt(e)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const $e="WebChannelConnection",wi=(n,e,t)=>{n.listen(e,(r=>{try{t(r)}catch(s){setTimeout((()=>{throw s}),0)}}))};class ls extends eR{constructor(e){super(e),this.dt=[],this.forceLongPolling=e.forceLongPolling,this.autoDetectLongPolling=e.autoDetectLongPolling,this.useFetchStreams=e.useFetchStreams,this.longPollingOptions=e.longPollingOptions}static ft(){if(!ls.gt){const e=ng();wi(e,tg.STAT_EVENT,(t=>{t.stat===Au.PROXY?O($e,"STAT_EVENT: detected buffering proxy"):t.stat===Au.NOPROXY&&O($e,"STAT_EVENT: detected no buffering proxy")})),ls.gt=!0}}it(e,t,r,s,i){const o=Fu();return new Promise(((c,u)=>{const l=new Zm;l.setWithCredentials(!0),l.listenOnce(eg.COMPLETE,(()=>{try{switch(l.getLastErrorCode()){case oa.NO_ERROR:const p=l.getResponseJson();O($e,`XHR for RPC '${e}' ${o} received:`,JSON.stringify(p)),c(p);break;case oa.TIMEOUT:O($e,`RPC '${e}' ${o} timed out`),u(new N(b.DEADLINE_EXCEEDED,"Request time out"));break;case oa.HTTP_ERROR:const g=l.getStatus();if(O($e,`RPC '${e}' ${o} failed with status:`,g,"response text:",l.getResponseText()),g>0){let w=l.getResponseJson();Array.isArray(w)&&(w=w[0]);const S=w==null?void 0:w.error;if(S&&S.status&&S.message){const D=(function($){const z=$.toLowerCase().replace(/_/g,"-");return Object.values(b).indexOf(z)>=0?z:b.UNKNOWN})(S.status);u(new N(D,S.message))}else u(new N(b.UNKNOWN,"Server responded with status "+l.getStatus()))}else u(new N(b.UNAVAILABLE,"Connection failed."));break;default:q(9055,{yt:e,streamId:o,wt:l.getLastErrorCode(),bt:l.getLastError()})}}finally{O($e,`RPC '${e}' ${o} completed.`)}}));const d=JSON.stringify(s);O($e,`RPC '${e}' ${o} sending request:`,s),l.send(t,"POST",d,r,15)}))}vt(e,t,r){const s=Fu(),i=[this.Ze,"/","google.firestore.v1.Firestore","/",e,"/channel"],o=this.createWebChannelTransport(),c={httpSessionIdParam:"gsessionid",initMessageHeaders:{},messageUrlParams:{database:`projects/${this.databaseId.projectId}/databases/${this.databaseId.database}`},sendRawJson:!0,supportsCrossDomainXhr:!0,internalChannelParams:{forwardChannelRequestTimeoutMs:6e5},forceLongPolling:this.forceLongPolling,detectBufferingProxy:this.autoDetectLongPolling},u=this.longPollingOptions.timeoutSeconds;u!==void 0&&(c.longPollingTimeout=Math.round(1e3*u)),this.useFetchStreams&&(c.useFetchStreams=!0),this.rt(c.initMessageHeaders,t,r),c.encodeInitMessageHeaders=!0;const l=i.join("");O($e,`Creating RPC '${e}' stream ${s}: ${l}`,c);const d=o.createWebChannel(l,c);this.St(d);let p=!1,g=!1;const w=new tR({_t:S=>{g?O($e,`Not sending because RPC '${e}' stream ${s} is closed:`,S):(p||(O($e,`Opening RPC '${e}' stream ${s} transport.`),d.open(),p=!0),O($e,`RPC '${e}' stream ${s} sending:`,S),d.send(S))},ot:()=>d.close()});return wi(d,bi.EventType.OPEN,(()=>{g||(O($e,`RPC '${e}' stream ${s} transport opened.`),w.Rt())})),wi(d,bi.EventType.CLOSE,(()=>{g||(g=!0,O($e,`RPC '${e}' stream ${s} transport closed`),w.At(),this.Dt(d))})),wi(d,bi.EventType.ERROR,(S=>{g||(g=!0,xe($e,`RPC '${e}' stream ${s} transport errored. Name:`,S.name,"Message:",S.message),w.At(new N(b.UNAVAILABLE,"The operation could not be completed")))})),wi(d,bi.EventType.MESSAGE,(S=>{var D;if(!g){const k=S.data[0];L(!!k,16349);const $=k,z=($==null?void 0:$.error)||((D=$[0])==null?void 0:D.error);if(z){O($e,`RPC '${e}' stream ${s} received error:`,z);const G=z.status;let ie=(function(E){const _=Ae[E];if(_!==void 0)return Bg(_)})(G),ne=z.message;G==="NOT_FOUND"&&ne.includes("database")&&ne.includes("does not exist")&&ne.includes(this.databaseId.database)&&xe(`Database '${this.databaseId.database}' not found. Please check your project configuration.`),ie===void 0&&(ie=b.INTERNAL,ne="Unknown error status: "+G+" with message "+z.message),g=!0,w.At(new N(ie,ne)),d.close()}else O($e,`RPC '${e}' stream ${s} received:`,k),w.Vt(k)}})),ls.ft(),setTimeout((()=>{w.It()}),0),w}terminate(){this.dt.forEach((e=>e.close())),this.dt=[]}St(e){this.dt.push(e)}Dt(e){this.dt=this.dt.filter((t=>t===e))}rt(e,t,r){super.rt(e,t,r),this.databaseInfo.apiKey&&(e["x-goog-api-key"]=this.databaseInfo.apiKey)}createWebChannelTransport(){return rg()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function nR(n){return new ls(n)}ls.gt=!1;class kl{constructor(e,t,r=1e3,s=1.5,i=6e4){this.xt=e,this.timerId=t,this.Ct=r,this.Ft=s,this.Ot=i,this.Mt=0,this.Nt=null,this.Lt=Date.now(),this.reset()}reset(){this.Mt=0}Bt(){this.Mt=this.Ot}Ut(e){this.cancel();const t=Math.floor(this.Mt+this.kt()),r=Math.max(0,Date.now()-this.Lt),s=Math.max(0,t-r);s>0&&O("ExponentialBackoff",`Backing off for ${s} ms (base delay: ${this.Mt} ms, delay with jitter: ${t} ms, last attempt: ${r} ms ago)`),this.Nt=this.xt.enqueueAfterDelay(this.timerId,s,(()=>(this.Lt=Date.now(),e()))),this.Mt*=this.Ft,this.Mt<this.Ct&&(this.Mt=this.Ct),this.Mt>this.Ot&&(this.Mt=this.Ot)}qt(){this.Nt!==null&&(this.Nt.skipDelay(),this.Nt=null)}cancel(){this.Nt!==null&&(this.Nt.cancel(),this.Nt=null)}kt(){return(Math.random()-.5)*this.Mt}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Yf="PersistentStream";class h_{constructor(e,t,r,s,i,o,c,u){this.xt=e,this.$t=r,this.Kt=s,this.connection=i,this.authCredentialsProvider=o,this.appCheckCredentialsProvider=c,this.listener=u,this.state=0,this.Wt=0,this.Qt=null,this.Gt=null,this.stream=null,this.zt=0,this.jt=new kl(e,t)}Ht(){return this.state===1||this.state===5||this.Jt()}Jt(){return this.state===2||this.state===3}start(){this.zt=0,this.state!==4?this.auth():this.Yt()}async stop(){this.Ht()&&await this.close(0)}Zt(){this.state=0,this.jt.reset()}Xt(){this.Jt()&&this.Qt===null&&(this.Qt=this.xt.enqueueAfterDelay(this.$t,6e4,(()=>this.en())))}tn(e){this.nn(),this.stream.send(e)}async en(){if(this.Jt())return this.close(0)}nn(){this.Qt&&(this.Qt.cancel(),this.Qt=null)}rn(){this.Gt&&(this.Gt.cancel(),this.Gt=null)}async close(e,t){this.nn(),this.rn(),this.jt.cancel(),this.Wt++,e!==4?this.jt.reset():t&&t.code===b.RESOURCE_EXHAUSTED?(Te(t.toString()),Te("Using maximum backoff delay to prevent overloading the backend."),this.jt.Bt()):t&&t.code===b.UNAUTHENTICATED&&this.state!==3&&(this.authCredentialsProvider.invalidateToken(),this.appCheckCredentialsProvider.invalidateToken()),this.stream!==null&&(this.sn(),this.stream.close(),this.stream=null),this.state=e,await this.listener.ht(t)}sn(){}auth(){this.state=1;const e=this._n(this.Wt),t=this.Wt;Promise.all([this.authCredentialsProvider.getToken(),this.appCheckCredentialsProvider.getToken()]).then((([r,s])=>{this.Wt===t&&this.an(r,s)}),(r=>{e((()=>{const s=new N(b.UNKNOWN,"Fetching auth token failed: "+r.message);return this.un(s)}))}))}an(e,t){const r=this._n(this.Wt);this.stream=this.cn(e,t),this.stream.ut((()=>{r((()=>this.listener.ut()))})),this.stream.lt((()=>{r((()=>(this.state=2,this.Gt=this.xt.enqueueAfterDelay(this.Kt,1e4,(()=>(this.Jt()&&(this.state=3),Promise.resolve()))),this.listener.lt())))})),this.stream.ht((s=>{r((()=>this.un(s)))})),this.stream.onMessage((s=>{r((()=>++this.zt==1?this.En(s):this.onNext(s)))}))}Yt(){this.state=5,this.jt.Ut((async()=>{this.state=0,this.start()}))}un(e){return O(Yf,`close with error: ${e}`),this.stream=null,this.close(4,e)}_n(e){return t=>{this.xt.enqueueAndForget((()=>this.Wt===e?t():(O(Yf,"stream callback skipped by getCloseGuardedDispatcher."),Promise.resolve())))}}}class rR extends h_{constructor(e,t,r,s,i,o){super(e,"listen_stream_connection_backoff","listen_stream_idle","health_check_timeout",t,r,s,o),this.serializer=i}cn(e,t){return this.connection.vt("Listen",e,t)}En(e){return this.onNext(e)}onNext(e){this.jt.reset();const t=UA(this.serializer,e),r=(function(i){if(!("targetChange"in i))return j.min();const o=i.targetChange;return o.targetIds&&o.targetIds.length?j.min():o.readTime?ve(o.readTime):j.min()})(e);return this.listener.hn(t,r)}Tn(e){const t={};t.database=Ou(this.serializer),t.addTarget=(function(i,o){let c;const u=o.target;if(c=Ht(u)?{pipelineQuery:t_(i,u)}:Sl(u)?{documents:Xg(i,u)}:{query:uc(i,u).be},c.targetId=o.targetId,o.resumeToken.approximateByteSize()>0){c.resumeToken=Wg(i,o.resumeToken);const l=Du(i,o.expectedCount);l!==null&&(c.expectedCount=l)}else if(o.snapshotVersion.compareTo(j.min())>0){c.readTime=Rs(i,o.snapshotVersion.toTimestamp());const l=Du(i,o.expectedCount);l!==null&&(c.expectedCount=l)}return c})(this.serializer,e);const r=qA(this.serializer,e);r&&(t.labels=r),this.tn(t)}Pn(e){const t={};t.database=Ou(this.serializer),t.removeTarget=e,this.tn(t)}}class sR extends h_{constructor(e,t,r,s,i,o){super(e,"write_stream_connection_backoff","write_stream_idle","health_check_timeout",t,r,s,o),this.serializer=i}get Rn(){return this.zt>0}start(){this.lastStreamToken=void 0,super.start()}sn(){this.Rn&&this.In([])}cn(e,t){return this.connection.vt("Write",e,t)}En(e){return L(!!e.streamToken,31322),this.lastStreamToken=e.streamToken,L(!e.writeResults||e.writeResults.length===0,55816),this.listener.An()}onNext(e){L(!!e.streamToken,12678),this.lastStreamToken=e.streamToken,this.jt.reset();const t=BA(e.writeResults,e.commitTime),r=ve(e.commitTime);return this.listener.Vn(r,t)}dn(){const e={};e.database=Ou(this.serializer),this.tn(e)}In(e){const t={streamToken:this.lastStreamToken,writes:e.map((r=>Ji(this.serializer,r)))};this.tn(t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class iR{}class oR extends iR{constructor(e,t,r,s){super(),this.authCredentials=e,this.appCheckCredentials=t,this.connection=r,this.serializer=s,this.fn=!1}mn(){if(this.fn)throw new N(b.FAILED_PRECONDITION,"The client has already been terminated.")}tt(e,t,r,s){return this.mn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([i,o])=>this.connection.tt(e,ku(t,r),s,i,o))).catch((i=>{throw i.name==="FirebaseError"?(i.code===b.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),i):new N(b.UNKNOWN,i.toString())}))}st(e,t,r,s,i){return this.mn(),Promise.all([this.authCredentials.getToken(),this.appCheckCredentials.getToken()]).then((([o,c])=>this.connection.st(e,ku(t,r),s,o,c,i))).catch((o=>{throw o.name==="FirebaseError"?(o.code===b.UNAUTHENTICATED&&(this.authCredentials.invalidateToken(),this.appCheckCredentials.invalidateToken()),o):new N(b.UNKNOWN,o.toString())}))}terminate(){this.fn=!0,this.connection.terminate()}}function aR(n,e,t,r){return new oR(n,e,t,r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const cR="ComponentProvider",Xf=new Map;function uR(n,e,t,r,s){return new eA(n,e,t,s.host,s.ssl,s.experimentalForceLongPolling,s.experimentalAutoDetectLongPolling,l_(s.experimentalLongPollingOptions),s.useFetchStreams,s.isUsingEmulator,r,s._customHeaders,s.grpcFlowControlWindow)}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Zf={didRun:!1,sequenceNumbersCollected:0,targetsRemoved:0,documentsRemoved:0},d_=41943040;class je{static withCacheSize(e){return new je(e,je.DEFAULT_COLLECTION_PERCENTILE,je.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT)}constructor(e,t,r){this.cacheSizeCollectionThreshold=e,this.percentileToCollect=t,this.maximumSequenceNumbersToCollect=r}}je.DEFAULT_COLLECTION_PERCENTILE=10,je.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT=1e3,je.DEFAULT=new je(d_,je.DEFAULT_COLLECTION_PERCENTILE,je.DEFAULT_MAX_SEQUENCE_NUMBERS_TO_COLLECT),je.DISABLED=new je(-1,0,0);/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class nt{constructor(e,t){this.previousValue=e,t&&(t.sequenceNumberHandler=r=>this.pn(r),this.gn=r=>t.writeSequenceNumber(r))}pn(e){return this.previousValue=Math.max(e,this.previousValue),this.previousValue}next(){const e=++this.previousValue;return this.gn&&this.gn(e),e}}nt.yn=-1;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const f_="The current tab is not in the required state to perform this operation. It might be necessary to refresh the browser tab.";class p_{constructor(){this.onCommittedListeners=[]}addOnCommittedListener(e){this.onCommittedListeners.push(e)}raiseOnCommittedEvent(){this.onCommittedListeners.forEach((e=>e()))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Yn(n){if(n.code!==b.FAILED_PRECONDITION||n.message!==f_)throw n;O("LocalStore","Unexpectedly lost primary lease")}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class R{constructor(e){this.nextCallback=null,this.catchCallback=null,this.result=void 0,this.error=void 0,this.isDone=!1,this.callbackAttached=!1,e((t=>{this.isDone=!0,this.result=t,this.nextCallback&&this.nextCallback(t)}),(t=>{this.isDone=!0,this.error=t,this.catchCallback&&this.catchCallback(t)}))}catch(e){return this.next(void 0,e)}next(e,t){return this.callbackAttached&&q(59440),this.callbackAttached=!0,this.isDone?this.error?this.wrapFailure(t,this.error):this.wrapSuccess(e,this.result):new R(((r,s)=>{this.nextCallback=i=>{this.wrapSuccess(e,i).next(r,s)},this.catchCallback=i=>{this.wrapFailure(t,i).next(r,s)}}))}toPromise(){return new Promise(((e,t)=>{this.next(e,t)}))}wrapUserFunction(e){try{const t=e();return t instanceof R?t:R.resolve(t)}catch(t){return R.reject(t)}}wrapSuccess(e,t){return e?this.wrapUserFunction((()=>e(t))):R.resolve(t)}wrapFailure(e,t){return e?this.wrapUserFunction((()=>e(t))):R.reject(t)}static resolve(e){return new R(((t,r)=>{t(e)}))}static reject(e){return new R(((t,r)=>{r(e)}))}static waitFor(e){return new R(((t,r)=>{let s=0,i=0,o=!1;e.forEach((c=>{++s,c.next((()=>{++i,o&&i===s&&t()}),(u=>r(u)))})),o=!0,i===s&&t()}))}static or(e){let t=R.resolve(!1);for(const r of e)t=t.next((s=>s?R.resolve(s):r()));return t}static forEach(e,t){const r=[];return e.forEach(((s,i)=>{r.push(t.call(this,s,i))})),this.waitFor(r)}static mapArray(e,t){return new R(((r,s)=>{const i=e.length,o=new Array(i);let c=0;for(let u=0;u<i;u++){const l=u;t(e[l]).next((d=>{o[l]=d,++c,c===i&&r(o)}),(d=>s(d)))}}))}static doWhile(e,t){return new R(((r,s)=>{const i=()=>{e()===!0?t().next((()=>{i()}),s):r()};i()}))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const ut="SimpleDb";class lc{static open(e,t,r,s){try{return new lc(t,e.transaction(s,r))}catch(i){throw new Mi(t,i)}}constructor(e,t){this.action=e,this.transaction=t,this.aborted=!1,this.wn=new Fe,this.transaction.oncomplete=()=>{this.wn.resolve()},this.transaction.onabort=()=>{t.error?this.wn.reject(new Mi(e,t.error)):this.wn.resolve()},this.transaction.onerror=r=>{const s=Ol(r.target.error);this.wn.reject(new Mi(e,s))}}get bn(){return this.wn.promise}abort(e){e&&this.wn.reject(e),this.aborted||(O(ut,"Aborting transaction:",e?e.message:"Client-initiated abort"),this.aborted=!0,this.transaction.abort())}vn(){const e=this.transaction;this.aborted||typeof e.commit!="function"||e.commit()}store(e){const t=this.transaction.objectStore(e);return new hR(t)}}class qt{static delete(e){return O(ut,"Removing database:",e),dr(im().indexedDB.deleteDatabase(e)).toPromise()}static Je(){if(!Ja())return!1;if(qt.Sn())return!0;const e=Ce(),t=qt.Dn(e),r=0<t&&t<10,s=m_(e),i=0<s&&s<4.5;return!(e.indexOf("MSIE ")>0||e.indexOf("Trident/")>0||e.indexOf("Edge/")>0||r||i)}static Sn(){var e;return typeof process<"u"&&((e=process.__PRIVATE_env)==null?void 0:e.__PRIVATE_USE_MOCK_PERSISTENCE)==="YES"}static xn(e,t){return e.store(t)}static Dn(e){const t=e.match(/i(?:phone|pad|pod) os ([\d_]+)/i),r=t?t[1].split("_").slice(0,2).join("."):"-1";return Number(r)}constructor(e,t,r){this.name=e,this.version=t,this.Cn=r,this.Fn=null,qt.Dn(Ce())===12.2&&Te("Firestore persistence suffers from a bug in iOS 12.2 Safari that may cause your app to stop working. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.")}async On(e){return this.db||(O(ut,"Opening database:",this.name),this.db=await new Promise(((t,r)=>{const s=indexedDB.open(this.name,this.version);s.onsuccess=i=>{const o=i.target.result;t(o)},s.onblocked=()=>{r(new Mi(e,"Cannot upgrade IndexedDB schema while another tab is open. Close all tabs that access Firestore and reload this page to proceed."))},s.onerror=i=>{const o=i.target.error;o.name==="VersionError"?r(new N(b.FAILED_PRECONDITION,"A newer version of the Firestore SDK was previously used and so the persisted data is not compatible with the version of the SDK you are now using. The SDK will operate with persistence disabled. If you need persistence, please re-upgrade to a newer version of the SDK or else clear the persisted IndexedDB data for your app to start fresh.")):o.name==="InvalidStateError"?r(new N(b.FAILED_PRECONDITION,"Unable to open an IndexedDB connection. This could be due to running in a private browsing session on a browser whose private browsing sessions do not support IndexedDB: "+o)):r(new Mi(e,o))},s.onupgradeneeded=i=>{O(ut,'Database "'+this.name+'" requires upgrade from version:',i.oldVersion);const o=i.target.result;this.Cn.Mn(o,s.transaction,i.oldVersion,this.version).next((()=>{O(ut,"Database upgrade to version "+this.version+" complete")}))}}))),this.Nn&&(this.db.onversionchange=t=>this.Nn(t)),this.db}Ln(e){this.Nn=e,this.db&&(this.db.onversionchange=t=>e(t))}async runTransaction(e,t,r,s){const i=t==="readonly";let o=0;for(;;){++o;try{this.db=await this.On(e);const c=lc.open(this.db,e,i?"readonly":"readwrite",r),u=s(c).next((l=>(c.vn(),l))).catch((l=>(c.abort(l),R.reject(l)))).toPromise();return u.catch((()=>{})),await c.bn,u}catch(c){const u=c,l=u.name!=="FirebaseError"&&o<3;if(O(ut,"Transaction failed with error:",u.message,"Retrying:",l),this.close(),!l)return Promise.reject(u)}}}close(){this.db&&this.db.close(),this.db=void 0}}function m_(n){const e=n.match(/Android ([\d.]+)/i),t=e?e[1].split(".").slice(0,2).join("."):"-1";return Number(t)}class lR{constructor(e){this.Bn=e,this.Un=!1,this.kn=null}get isDone(){return this.Un}get qn(){return this.kn}set cursor(e){this.Bn=e}done(){this.Un=!0}$n(e){this.kn=e}delete(){return dr(this.Bn.delete())}}class Mi extends N{constructor(e,t){super(b.UNAVAILABLE,`IndexedDB transaction '${e}' failed: ${t}`),this.name="IndexedDbTransactionError"}}function Xn(n){return n.name==="IndexedDbTransactionError"}class hR{constructor(e){this.store=e}put(e,t){let r;return t!==void 0?(O(ut,"PUT",this.store.name,e,t),r=this.store.put(t,e)):(O(ut,"PUT",this.store.name,"<auto-key>",e),r=this.store.put(e)),dr(r)}add(e){return O(ut,"ADD",this.store.name,e,e),dr(this.store.add(e))}get(e){return dr(this.store.get(e)).next((t=>(t===void 0&&(t=null),O(ut,"GET",this.store.name,e,t),t)))}delete(e){return O(ut,"DELETE",this.store.name,e),dr(this.store.delete(e))}count(){return O(ut,"COUNT",this.store.name),dr(this.store.count())}Kn(e,t){const r=this.options(e,t),s=r.index?this.store.index(r.index):this.store;if(typeof s.getAll=="function"){const i=s.getAll(r.range);return new R(((o,c)=>{i.onerror=u=>{c(u.target.error)},i.onsuccess=u=>{o(u.target.result)}}))}{const i=this.cursor(r),o=[];return this.Wn(i,((c,u)=>{o.push(u)})).next((()=>o))}}Qn(e,t){const r=this.store.getAll(e,t===null?void 0:t);return new R(((s,i)=>{r.onerror=o=>{i(o.target.error)},r.onsuccess=o=>{s(o.target.result)}}))}Gn(e,t){O(ut,"DELETE ALL",this.store.name);const r=this.options(e,t);r.zn=!1;const s=this.cursor(r);return this.Wn(s,((i,o,c)=>c.delete()))}jn(e,t){let r;t?r=e:(r={},t=e);const s=this.cursor(r);return this.Wn(s,t)}Hn(e){const t=this.cursor({});return new R(((r,s)=>{t.onerror=i=>{const o=Ol(i.target.error);s(o)},t.onsuccess=i=>{const o=i.target.result;o?e(o.primaryKey,o.value).next((c=>{c?o.continue():r()})):r()}}))}Wn(e,t){const r=[];return new R(((s,i)=>{e.onerror=o=>{i(o.target.error)},e.onsuccess=o=>{const c=o.target.result;if(!c)return void s();const u=new lR(c),l=t(c.primaryKey,c.value,u);if(l instanceof R){const d=l.catch((p=>(u.done(),R.reject(p))));r.push(d)}u.isDone?s():u.qn===null?c.continue():c.continue(u.qn)}})).next((()=>R.waitFor(r)))}options(e,t){let r;return e!==void 0&&(typeof e=="string"?r=e:t=e),{index:r,range:t}}cursor(e){let t="next";if(e.reverse&&(t="prev"),e.index){const r=this.store.index(e.index);return e.zn?r.openKeyCursor(e.range,t):r.openCursor(e.range,t)}return this.store.openCursor(e.range,t)}}function dr(n){return new R(((e,t)=>{n.onsuccess=r=>{const s=r.target.result;e(s)},n.onerror=r=>{const s=Ol(r.target.error);t(s)}}))}let ep=!1;function Ol(n){const e=qt.Dn(Ce());if(e>=12.2&&e<13){const t="An internal error was encountered in the Indexed Database server";if(n.message.indexOf(t)>=0){const r=new N("internal",`IOS_INDEXEDDB_BUG1: IndexedDb has thrown '${t}'. This is likely due to an unavoidable bug in iOS. See https://stackoverflow.com/q/56496296/110915 for details and a potential workaround.`);return ep||(ep=!0,setTimeout((()=>{throw r}),0)),r}}return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const tp="LruGarbageCollector",g_=1048576;function np([n,e],[t,r]){const s=H(n,t);return s===0?H(e,r):s}class dR{constructor(e){this.Jn=e,this.buffer=new ce(np),this.Yn=0}Zn(){return++this.Yn}Xn(e){const t=[e,this.Zn()];if(this.buffer.size<this.Jn)this.buffer=this.buffer.add(t);else{const r=this.buffer.last();np(t,r)<0&&(this.buffer=this.buffer.delete(r).add(t))}}get maxValue(){return this.buffer.last()[0]}}class __{constructor(e,t,r){this.garbageCollector=e,this.asyncQueue=t,this.localStore=r,this.er=null}start(){this.garbageCollector.params.cacheSizeCollectionThreshold!==-1&&this.tr(6e4)}stop(){this.er&&(this.er.cancel(),this.er=null)}get started(){return this.er!==null}tr(e){O(tp,`Garbage collection scheduled in ${e}ms`),this.er=this.asyncQueue.enqueueAfterDelay("lru_garbage_collection",e,(async()=>{this.er=null;try{await this.localStore.collectGarbage(this.garbageCollector)}catch(t){Xn(t)?O(tp,"Ignoring IndexedDB error during garbage collection: ",t):await Yn(t)}await this.tr(3e5)}))}}class fR{constructor(e,t){this.nr=e,this.params=t}calculateTargetCount(e,t){return this.nr.rr(e).next((r=>Math.floor(t/100*r)))}nthSequenceNumber(e,t){if(t===0)return R.resolve(nt.yn);const r=new dR(t);return this.nr.forEachTarget(e,(s=>r.Xn(s.sequenceNumber))).next((()=>this.nr.ir(e,(s=>r.Xn(s))))).next((()=>r.maxValue))}removeTargets(e,t,r){return this.nr.removeTargets(e,t,r)}removeOrphanedDocuments(e,t){return this.nr.removeOrphanedDocuments(e,t)}collect(e,t){return this.params.cacheSizeCollectionThreshold===-1?(O("LruGarbageCollector","Garbage collection skipped; disabled"),R.resolve(Zf)):this.getCacheSize(e).next((r=>r<this.params.cacheSizeCollectionThreshold?(O("LruGarbageCollector",`Garbage collection skipped; Cache size ${r} is lower than threshold ${this.params.cacheSizeCollectionThreshold}`),Zf):this.sr(e,t)))}getCacheSize(e){return this.nr.getCacheSize(e)}sr(e,t){let r,s,i,o,c,u,l;const d=Date.now();return this.calculateTargetCount(e,this.params.percentileToCollect).next((p=>(p>this.params.maximumSequenceNumbersToCollect?(O("LruGarbageCollector",`Capping sequence numbers to collect down to the maximum of ${this.params.maximumSequenceNumbersToCollect} from ${p}`),s=this.params.maximumSequenceNumbersToCollect):s=p,o=Date.now(),this.nthSequenceNumber(e,s)))).next((p=>(r=p,c=Date.now(),this.removeTargets(e,r,t)))).next((p=>(i=p,u=Date.now(),this.removeOrphanedDocuments(e,r)))).next((p=>(l=Date.now(),ns()<=Z.DEBUG&&O("LruGarbageCollector",`LRU Garbage Collection
	Counted targets in ${o-d}ms
	Determined least recently used ${s} in `+(c-o)+`ms
	Removed ${i} targets in `+(u-c)+`ms
	Removed ${p} documents in `+(l-u)+`ms
Total Duration: ${l-d}ms`),R.resolve({didRun:!0,sequenceNumbersCollected:s,targetsRemoved:i,documentsRemoved:p}))))}}function y_(n,e){return new fR(n,e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const I_="firestore.googleapis.com",rp=!0;class sp{constructor(e){if(e.host===void 0){if(e.ssl!==void 0)throw new N(b.INVALID_ARGUMENT,"Can't provide ssl option if host option is not set");this.host=I_,this.ssl=rp}else this.host=e.host,this.ssl=e.ssl??rp;if(this.isUsingEmulator=e.emulatorOptions!==void 0,this.credentials=e.credentials,this.ignoreUndefinedProperties=!!e.ignoreUndefinedProperties,this.localCache=e.localCache,e._customHeaders&&(this._customHeaders={...e._customHeaders}),e.cacheSizeBytes===void 0)this.cacheSizeBytes=d_;else{if(e.cacheSizeBytes!==-1&&e.cacheSizeBytes<g_)throw new N(b.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");this.cacheSizeBytes=e.cacheSizeBytes}if(ag("experimentalForceLongPolling",e.experimentalForceLongPolling,"experimentalAutoDetectLongPolling",e.experimentalAutoDetectLongPolling),this.experimentalForceLongPolling=!!e.experimentalForceLongPolling,this.experimentalForceLongPolling?this.experimentalAutoDetectLongPolling=!1:e.experimentalAutoDetectLongPolling===void 0?this.experimentalAutoDetectLongPolling=!0:this.experimentalAutoDetectLongPolling=!!e.experimentalAutoDetectLongPolling,this.experimentalLongPollingOptions=l_(e.experimentalLongPollingOptions??{}),(function(r){if(r.timeoutSeconds!==void 0){if(isNaN(r.timeoutSeconds))throw new N(b.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (must not be NaN)`);if(r.timeoutSeconds<5)throw new N(b.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (minimum allowed value is 5)`);if(r.timeoutSeconds>30)throw new N(b.INVALID_ARGUMENT,`invalid long polling timeout: ${r.timeoutSeconds} (maximum allowed value is 30)`)}})(this.experimentalLongPollingOptions),this.useFetchStreams=!!e.useFetchStreams,e.grpcFlowControlWindow!==void 0){if(typeof e.grpcFlowControlWindow!="number"||e.grpcFlowControlWindow<=0||e.grpcFlowControlWindow>2147483647||!Number.isInteger(e.grpcFlowControlWindow))throw new N(b.INVALID_ARGUMENT,"grpcFlowControlWindow must be a positive integer and cannot exceed 2147483647");this.grpcFlowControlWindow=e.grpcFlowControlWindow}}isEqual(e){return this.host===e.host&&this.ssl===e.ssl&&this.credentials===e.credentials&&this.cacheSizeBytes===e.cacheSizeBytes&&this.experimentalForceLongPolling===e.experimentalForceLongPolling&&this.experimentalAutoDetectLongPolling===e.experimentalAutoDetectLongPolling&&(function(r,s){return r.timeoutSeconds===s.timeoutSeconds})(this.experimentalLongPollingOptions,e.experimentalLongPollingOptions)&&this.ignoreUndefinedProperties===e.ignoreUndefinedProperties&&this.useFetchStreams===e.useFetchStreams&&this.grpcFlowControlWindow===e.grpcFlowControlWindow&&(function(r,s){if(r===s)return!0;if(!r||!s)return!1;const i=Object.keys(r),o=Object.keys(s);if(i.length!==o.length)return!1;for(const c of i)if(r[c]!==s[c])return!1;return!0})(this._customHeaders,e._customHeaders)}}let yo=class{constructor(e,t,r,s){this._authCredentials=e,this._appCheckCredentials=t,this._databaseId=r,this._app=s,this.type="firestore-lite",this._persistenceKey="(lite)",this._settings=new sp({}),this._settingsFrozen=!1,this._emulatorOptions={},this._terminateTask="notTerminated"}get app(){if(!this._app)throw new N(b.FAILED_PRECONDITION,"Firestore was not initialized using the Firebase SDK. 'app' is not available");return this._app}get _initialized(){return this._settingsFrozen}get _terminated(){return this._terminateTask!=="notTerminated"}_setSettings(e){if(this._settingsFrozen)throw new N(b.FAILED_PRECONDITION,"Firestore has already been started and its settings can no longer be changed. You can only modify settings before calling any other methods on a Firestore object.");this._settings=new sp(e),this._emulatorOptions=e.emulatorOptions||{},e.credentials!==void 0&&(this._authCredentials=(function(r){if(!r)return new u_;switch(r.type){case"firstParty":return new QA(r.sessionIndex||"0",r.iamToken||null,r.authTokenFactory||null);case"provider":return r.client;default:throw new N(b.INVALID_ARGUMENT,"makeAuthCredentialsProvider failed due to invalid credential type")}})(e.credentials))}_getSettings(){return this._settings}_getEmulatorOptions(){return this._emulatorOptions}_freezeSettings(){return this._settingsFrozen=!0,this._settings}_delete(){return this._terminateTask==="notTerminated"&&(this._terminateTask=this._terminate()),this._terminateTask}async _restart(){this._terminateTask==="notTerminated"?await this._terminate():this._terminateTask="notTerminated"}toJSON(){return{app:this._app,databaseId:this._databaseId,settings:this._settings}}_terminate(){return(function(t){const r=Xf.get(t);r&&(O(cR,"Removing Datastore"),Xf.delete(t),r.terminate())})(this),Promise.resolve()}};function w_(n,e,t,r={}){var l;n=X(n,yo);const s=Fs(e),i=n._getSettings(),o={...i,emulatorOptions:n._getEmulatorOptions()},c=`${e}:${t}`;s&&il(`https://${c}`),i.host!==I_&&i.host!==c&&xe("Host has been set in both settings() and connectFirestoreEmulator(), emulator host will be used.");const u={...i,host:c,ssl:s,emulatorOptions:r};if(!_t(u,o)&&(n._setSettings(u),r.mockUserToken)){let d,p;if(typeof r.mockUserToken=="string")d=r.mockUserToken,p=Le.MOCK_USER;else{d=_w(r.mockUserToken,(l=n._app)==null?void 0:l.options.projectId);const g=r.mockUserToken.sub||r.mockUserToken.user_id;if(!g)throw new N(b.INVALID_ARGUMENT,"mockUserToken must contain 'sub' or 'user_id' field!");p=new Le(g)}n._authCredentials=new KA(new c_(d,p))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ne{constructor(e,t,r){this.converter=t,this._query=r,this.type="query",this.firestore=e}withConverter(e){return new Ne(this.firestore,e,this._query)}}class ae{constructor(e,t,r){this.converter=t,this._key=r,this.type="document",this.firestore=e}get _path(){return this._key.path}get id(){return this._key.path.lastSegment()}get path(){return this._key.path.canonicalString()}get parent(){return new At(this.firestore,this.converter,this._key.path.popLast())}withConverter(e){return new ae(this.firestore,e,this._key)}toJSON(){return{type:ae._jsonSchemaVersion,referencePath:this._key.toString()}}static fromJSON(e,t,r){if(Mr(t,ae._jsonSchema))return new ae(e,r||null,new M(J.fromString(t.referencePath)))}}ae._jsonSchemaVersion="firestore/documentReference/1.0",ae._jsonSchema={type:Pe("string",ae._jsonSchemaVersion),referencePath:Pe("string")};class At extends Ne{constructor(e,t,r){super(e,t,Gs(r)),this._path=r,this.type="collection"}get id(){return this._query.path.lastSegment()}get path(){return this._query.path.canonicalString()}get parent(){const e=this._path.popLast();return e.isEmpty()?null:new ae(this.firestore,null,new M(e))}withConverter(e){return new At(this.firestore,e,this._path)}}function pR(n,e,...t){if(n=re(n),Il("collection","path",e),n instanceof yo){const r=J.fromString(e,...t);return Sf(r),new At(n,null,r)}{if(!(n instanceof ae||n instanceof At))throw new N(b.INVALID_ARGUMENT,"Expected first argument to collection() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(J.fromString(e,...t));return Sf(r),new At(n.firestore,null,r)}}function mR(n,e){if(n=X(n,yo),Il("collectionGroup","collection id",e),e.indexOf("/")>=0)throw new N(b.INVALID_ARGUMENT,`Invalid collection ID '${e}' passed to function collectionGroup(). Collection IDs must not contain '/'.`);return new Ne(n,null,(function(r){return new dn(J.emptyPath(),r)})(e))}function T_(n,e,...t){if(n=re(n),arguments.length===1&&(e=tc.newId()),Il("doc","path",e),n instanceof yo){const r=J.fromString(e,...t);return bf(r),new ae(n,null,new M(r))}{if(!(n instanceof ae||n instanceof At))throw new N(b.INVALID_ARGUMENT,"Expected first argument to doc() to be a CollectionReference, a DocumentReference or FirebaseFirestore");const r=n._path.child(J.fromString(e,...t));return bf(r),new ae(n.firestore,n instanceof At?n.converter:null,new M(r))}}function gR(n,e){return n=re(n),e=re(e),(n instanceof ae||n instanceof At)&&(e instanceof ae||e instanceof At)&&n.firestore===e.firestore&&n.path===e.path&&n.converter===e.converter}function Ll(n,e){return n=re(n),e=re(e),n instanceof Ne&&e instanceof Ne&&n.firestore===e.firestore&&Fg(n._query,e._query)&&n.converter===e.converter}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ye{constructor(e){this._values=(e||[]).map((t=>t))}toArray(){return this._values.map((e=>e))}isEqual(e){return(function(r,s){if(r.length!==s.length)return!1;for(let i=0;i<r.length;++i)if(r[i]!==s[i])return!1;return!0})(this._values,e._values)}toJSON(){return{type:Ye._jsonSchemaVersion,vectorValues:this._values}}static fromJSON(e){if(Mr(e,Ye._jsonSchema)){if(Array.isArray(e.vectorValues)&&e.vectorValues.every((t=>typeof t=="number")))return new Ye(e.vectorValues);throw new N(b.INVALID_ARGUMENT,"Expected 'vectorValues' field to be a number array")}}}Ye._jsonSchemaVersion="firestore/vectorValue/1.0",Ye._jsonSchema={type:Pe("string",Ye._jsonSchemaVersion),vectorValues:Pe("object")};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const _R=/^__.*__$/;class yR{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return this.fieldMask!==null?new hn(e,this.data,this.fieldMask,t,this.fieldTransforms):new js(e,this.data,t,this.fieldTransforms)}}class E_{constructor(e,t,r){this.data=e,this.fieldMask=t,this.fieldTransforms=r}toMutation(e,t){return new hn(e,this.data,this.fieldMask,t,this.fieldTransforms)}}function v_(n){switch(n){case 0:case 2:case 1:return!0;case 3:case 4:return!1;default:throw q(40011,{dataSource:n})}}class hc{constructor(e,t,r,s,i,o){this.settings=e,this.databaseId=t,this.serializer=r,this.ignoreUndefinedProperties=s,i===void 0&&this.validatePath(),this.fieldTransforms=i||[],this.fieldMask=o||[]}get path(){return this.settings.path}get dataSource(){return this.settings.dataSource}contextWith(e){return new hc({...this.settings,...e},this.databaseId,this.serializer,this.ignoreUndefinedProperties,this.fieldTransforms,this.fieldMask)}childContextForField(e){var s;const t=(s=this.path)==null?void 0:s.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePathSegment(e),r}childContextForFieldPath(e){var s;const t=(s=this.path)==null?void 0:s.child(e),r=this.contextWith({path:t,arrayElement:!1});return r.validatePath(),r}childContextForArray(e){return this.contextWith({path:void 0,arrayElement:!0})}createError(e){return Na(e,this.settings.methodName,this.settings.hasConverter||!1,this.path,this.settings.targetDoc)}contains(e){return this.fieldMask.find((t=>e.isPrefixOf(t)))!==void 0||this.fieldTransforms.find((t=>e.isPrefixOf(t.field)))!==void 0}validatePath(){if(this.path)for(let e=0;e<this.path.length;e++)this.validatePathSegment(this.path.get(e))}validatePathSegment(e){if(e.length===0)throw this.createError("Document fields must not be empty");if(v_(this.dataSource)&&_R.test(e))throw this.createError('Document fields cannot begin and end with "__"')}}class IR{constructor(e,t,r){this.databaseId=e,this.ignoreUndefinedProperties=t,this.serializer=r||Ur(e)}createContext(e,t,r,s=!1){return new hc({dataSource:e,methodName:t,targetDoc:r,path:Ee.emptyPath(),arrayElement:!1,hasConverter:s},this.databaseId,this.serializer,this.ignoreUndefinedProperties)}}function qr(n){const e=n._freezeSettings(),t=Ur(n._databaseId);return new IR(n._databaseId,!!e.ignoreUndefinedProperties,t)}function dc(n,e,t,r,s,i={}){const o=n.createContext(i.merge||i.mergeFields?2:0,e,t,s);Gl("Data must be an object, but it was:",o,r);const c=P_(r,o);let u,l;if(i.merge)u=new tt(o.fieldMask),l=o.fieldTransforms;else if(i.mergeFields){const d=[];for(const p of i.mergeFields){const g=Pt(e,p,t);if(!o.contains(g))throw new N(b.INVALID_ARGUMENT,`Field '${g}' is specified in your field mask but missing from your input data.`);S_(d,g)||d.push(g)}u=new tt(d),l=o.fieldTransforms.filter((p=>u.covers(p.field)))}else u=null,l=o.fieldTransforms;return new yR(new Ve(c),u,l)}class Io extends Wt{_toFieldTransform(e){if(e.dataSource!==2)throw e.dataSource===1?e.createError(`${this._methodName}() can only appear at the top level of your update data`):e.createError(`${this._methodName}() cannot be used with set() unless you pass {merge:true}`);return e.fieldMask.push(e.path),null}isEqual(e){return e instanceof Io}}function A_(n,e,t){return new hc({dataSource:3,targetDoc:e.settings.targetDoc,methodName:n._methodName,arrayElement:t},e.databaseId,e.serializer,e.ignoreUndefinedProperties)}class Ml extends Wt{_toFieldTransform(e){return new Fr(e.path,new ys)}isEqual(e){return e instanceof Ml}}class Fl extends Wt{constructor(e,t){super(e),this._r=t}_toFieldTransform(e){const t=A_(this,e,!0),r=this._r.map((i=>jt(i,t))),s=new Sr(r);return new Fr(e.path,s)}isEqual(e){return e instanceof Fl&&_t(this._r,e._r)}}class Ul extends Wt{constructor(e,t){super(e),this._r=t}_toFieldTransform(e){const t=A_(this,e,!0),r=this._r.map((i=>jt(i,t))),s=new Vr(r);return new Fr(e.path,s)}isEqual(e){return e instanceof Ul&&_t(this._r,e._r)}}class Bl extends Wt{constructor(e,t){super(e),this.ar=t}_toFieldTransform(e){const t=new Cr(e.serializer,$s(e.serializer,this.ar));return new Fr(e.path,t)}isEqual(e){return e instanceof Bl&&(this.ar===e.ar||Number.isNaN(this.ar)&&Number.isNaN(e.ar))}}class ql extends Wt{constructor(e,t){super(e),this.ar=t}_toFieldTransform(e){const t=new Is(e.serializer,$s(e.serializer,this.ar));return new Fr(e.path,t)}isEqual(e){return e instanceof ql&&(this.ar===e.ar||Number.isNaN(this.ar)&&Number.isNaN(e.ar))}}class $l extends Wt{constructor(e,t){super(e),this.ar=t}_toFieldTransform(e){const t=new ws(e.serializer,$s(e.serializer,this.ar));return new Fr(e.path,t)}isEqual(e){return e instanceof $l&&(this.ar===e.ar||Number.isNaN(this.ar)&&Number.isNaN(e.ar))}}function jl(n,e,t,r){const s=n.createContext(1,e,t);Gl("Data must be an object, but it was:",s,r);const i=[],o=Ve.empty();Jn(r,((u,l)=>{const d=Kl(e,u,t);l=re(l);const p=s.childContextForFieldPath(d);if(l instanceof Io)i.push(d);else{const g=jt(l,p);g!=null&&(i.push(d),o.set(d,g))}}));const c=new tt(i);return new E_(o,c,s.fieldTransforms)}function zl(n,e,t,r,s,i){const o=n.createContext(1,e,t),c=[Pt(e,r,t)],u=[s];if(i.length%2!=0)throw new N(b.INVALID_ARGUMENT,`Function ${e}() needs to be called with an even number of arguments that alternate between field names and values.`);for(let g=0;g<i.length;g+=2)c.push(Pt(e,i[g])),u.push(i[g+1]);const l=[],d=Ve.empty();for(let g=c.length-1;g>=0;--g)if(!S_(l,c[g])){const w=c[g];let S=u[g];S=re(S);const D=o.childContextForFieldPath(w);if(S instanceof Io)l.push(w);else{const k=jt(S,D);k!=null&&(l.push(w),d.set(w,k))}}const p=new tt(l);return new E_(d,p,o.fieldTransforms)}function R_(n,e,t,r=!1){return jt(t,n.createContext(r?4:3,e))}function jt(n,e,t){if(b_(n=re(n)))return Gl("Unsupported field value:",e,n),P_(n,e);if(n instanceof Wt)return(function(s,i){if(!v_(i.dataSource))throw i.createError(`${s._methodName}() can only be used with update() and set()`);if(!i.path)throw i.createError(`${s._methodName}() is not currently supported inside arrays`);const o=s._toFieldTransform(i);o&&i.fieldTransforms.push(o)})(n,e),null;if(n===void 0&&e.ignoreUndefinedProperties)return null;if(e.path&&e.fieldMask.push(e.path),n instanceof Array){if(e.settings.arrayElement&&e.dataSource!==4)throw e.createError("Nested arrays are not supported");return(function(s,i){const o=[];let c=0;for(const u of s){let l=jt(u,i.childContextForArray(c));l==null&&(l={nullValue:"NULL_VALUE"}),o.push(l),c++}return{arrayValue:{values:o}}})(n,e)}return(function(s,i,o){if((s=re(s))===null)return{nullValue:"NULL_VALUE"};if(typeof s=="number")return $s(i.serializer,s);if(typeof s=="boolean")return{booleanValue:s};if(typeof s=="string")return{stringValue:s};if(s instanceof Date){const c=oe.fromDate(s);return{timestampValue:Rs(i.serializer,c)}}if(s instanceof oe){const c=new oe(s.seconds,1e3*Math.floor(s.nanoseconds/1e3));return{timestampValue:Rs(i.serializer,c)}}if(s instanceof vt)return{geoPointValue:{latitude:s.latitude,longitude:s.longitude}};if(s instanceof et)return{bytesValue:Wg(i.serializer,s._byteString)};if(s instanceof ae){const c=i.databaseId,u=s.firestore._databaseId;if(!u.isEqual(c))throw i.createError(`Document reference is for database ${u.projectId}/${u.database} but should be for database ${c.projectId}/${c.database}`);return{referenceValue:Dl(s.firestore._databaseId||i.databaseId,s._key.path)}}if(s instanceof Ye)return(function(u,l){const d=u instanceof Ye?u.toArray():u;return{mapValue:{fields:{[wl]:{stringValue:Tl},[Rr]:{arrayValue:{values:d.map((g=>{if(typeof g!="number")throw l.createError("VectorValues must only contain numeric values.");return rc(l.serializer,g)}))}}}}}})(s,i);if(i_(s))return s._toProto(i.serializer);throw i.createError(`Unsupported field value: ${nc(s)}`)})(n,e)}function P_(n,e){const t={};return og(n)?e.path&&e.path.length>0&&e.fieldMask.push(e.path):Jn(n,((r,s)=>{const i=jt(s,e.childContextForField(r));i!=null&&(t[r]=i)})),{mapValue:{fields:t}}}function b_(n){return!(typeof n!="object"||n===null||n instanceof Array||n instanceof Date||n instanceof oe||n instanceof vt||n instanceof et||n instanceof ae||n instanceof Wt||n instanceof Ye||i_(n))}function Gl(n,e,t){if(!b_(t)||!fo(t)){const r=nc(t);throw r==="an object"?e.createError(n+" a custom object"):e.createError(n+" "+r)}}function Pt(n,e,t){if((e=re(e))instanceof Br)return e._internalPath;if(typeof e=="string")return Kl(n,e);throw Na("Field path arguments must be of type string or ",n,!1,void 0,t)}const wR=new RegExp("[~\\*/\\[\\]]");function Kl(n,e,t){if(e.search(wR)>=0)throw Na(`Invalid field path (${e}). Paths must not contain '~', '*', '/', '[', or ']'`,n,!1,void 0,t);try{return new Br(...e.split("."))._internalPath}catch{throw Na(`Invalid field path (${e}). Paths must not be empty, begin with '.', end with '.', or contain '..'`,n,!1,void 0,t)}}function Na(n,e,t,r,s){const i=r&&!r.isEmpty(),o=s!==void 0;let c=`Function ${e}() called with invalid data`;t&&(c+=" (via `toFirestore()`)"),c+=". ";let u="";return(i||o)&&(u+=" (found",i&&(u+=` in field ${r}`),o&&(u+=` in document ${s}`),u+=")"),new N(b.INVALID_ARGUMENT,c+n+u)}function S_(n,e){return n.some((t=>t.isEqual(e)))}function V_(n){return typeof n._readUserData=="function"}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class He{constructor(e){this.optionDefinitions=e}_getKnownOptions(e,t){const r=Ve.empty();for(const s in this.optionDefinitions)if(this.optionDefinitions.hasOwnProperty(s)){const i=this.optionDefinitions[s];if(s in e){const o=e[s];let c;i.nestedOptions&&fo(o)?c={mapValue:{fields:new He(i.nestedOptions).getOptionsProto(t,o)}}:o&&(c=jt(o,t)??void 0),c&&r.set(Ee.fromServerFormat(i.serverName),c)}}return r}getOptionsProto(e,t,r){const s=this._getKnownOptions(t,e);if(r){const i=new Map(yl(r,((o,c)=>[Ee.fromServerFormat(c),o!==void 0?jt(o,e):null])));s.setAll(i)}return s.value.mapValue.fields??{}}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function TR(n){return typeof n=="object"&&n!==null&&!!("nullValue"in n&&(n.nullValue===null||n.nullValue==="NULL_VALUE")||"booleanValue"in n&&(n.booleanValue===null||typeof n.booleanValue=="boolean")||"integerValue"in n&&(n.integerValue===null||typeof n.integerValue=="number"||typeof n.integerValue=="string")||"doubleValue"in n&&(n.doubleValue===null||typeof n.doubleValue=="number")||"timestampValue"in n&&(n.timestampValue===null||(function(t){return typeof t=="object"&&t!==null&&"seconds"in t&&(t.seconds===null||typeof t.seconds=="number"||typeof t.seconds=="string")&&"nanos"in t&&(t.nanos===null||typeof t.nanos=="number")})(n.timestampValue))||"stringValue"in n&&(n.stringValue===null||typeof n.stringValue=="string")||"bytesValue"in n&&(n.bytesValue===null||n.bytesValue instanceof Uint8Array)||"referenceValue"in n&&(n.referenceValue===null||typeof n.referenceValue=="string")||"geoPointValue"in n&&(n.geoPointValue===null||(function(t){return typeof t=="object"&&t!==null&&"latitude"in t&&(t.latitude===null||typeof t.latitude=="number")&&"longitude"in t&&(t.longitude===null||typeof t.longitude=="number")})(n.geoPointValue))||"arrayValue"in n&&(n.arrayValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("values"in t)||t.values!==null&&!Array.isArray(t.values))})(n.arrayValue))||"mapValue"in n&&(n.mapValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("fields"in t)||t.fields!==null&&!fo(t.fields))})(n.mapValue))||"fieldReferenceValue"in n&&(n.fieldReferenceValue===null||typeof n.fieldReferenceValue=="string")||"functionValue"in n&&(n.functionValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("name"in t)||t.name!==null&&typeof t.name!="string"||!("args"in t)||t.args!==null&&!Array.isArray(t.args))})(n.functionValue))||"pipelineValue"in n&&(n.pipelineValue===null||(function(t){return typeof t=="object"&&t!==null&&!(!("stages"in t)||t.stages!==null&&!Array.isArray(t.stages))})(n.pipelineValue)))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ER(){return new Io("deleteField")}function vR(){return new Ml("serverTimestamp")}function AR(...n){return new Fl("arrayUnion",n)}function RR(...n){return new Ul("arrayRemove",n)}function PR(n){return new Bl("increment",n)}function bR(n){return new ql("minimum",n)}function SR(n){return new $l("maximum",n)}function C_(n){return new Ye(n)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function F(n){let e;return n instanceof $r?n:(e=fo(n)?DR(n):n instanceof Array?kR(n):x_(n,void 0),e)}function lu(n){if(n instanceof $r)return n;if(n instanceof Ye)return Xi(n);if(Array.isArray(n))return Xi(C_(n));throw new Error("Unsupported value: "+typeof n)}function Wl(n){return nA(n)?ha(n):F(n)}class $r{constructor(){this._protoValueType="ProtoValue"}add(e){return new x("add",[this,F(e)],"add")}asBoolean(){if(this instanceof zn)return this;if(this instanceof zr)return new D_(this);if(this instanceof jr)return new NR(this);if(this instanceof x)return new N_(this);throw new N("invalid-argument",`Conversion of type ${typeof this} to BooleanExpression not supported.`)}subtract(e){return new x("subtract",[this,F(e)],"subtract")}multiply(e){return new x("multiply",[this,F(e)],"multiply")}divide(e){return new x("divide",[this,F(e)],"divide")}mod(e){return new x("mod",[this,F(e)],"mod")}equal(e){return new x("equal",[this,F(e)],"equal").asBoolean()}notEqual(e){return new x("not_equal",[this,F(e)],"notEqual").asBoolean()}lessThan(e){return new x("less_than",[this,F(e)],"lessThan").asBoolean()}lessThanOrEqual(e){return new x("less_than_or_equal",[this,F(e)],"lessThanOrEqual").asBoolean()}greaterThan(e){return new x("greater_than",[this,F(e)],"greaterThan").asBoolean()}greaterThanOrEqual(e){return new x("greater_than_or_equal",[this,F(e)],"greaterThanOrEqual").asBoolean()}arrayConcat(e,...t){const r=[e,...t].map((s=>F(s)));return new x("array_concat",[this,...r],"arrayConcat")}arrayContains(e){return new x("array_contains",[this,F(e)],"arrayContains").asBoolean()}arrayContainsAll(e){const t=Array.isArray(e)?new Vi(e.map(F),"arrayContainsAll"):e;return new x("array_contains_all",[this,t],"arrayContainsAll").asBoolean()}arrayContainsAny(e){const t=Array.isArray(e)?new Vi(e.map(F),"arrayContainsAny"):e;return new x("array_contains_any",[this,t],"arrayContainsAny").asBoolean()}arrayReverse(){return new x("array_reverse",[this])}arrayLength(){return new x("array_length",[this],"arrayLength")}equalAny(e){const t=Array.isArray(e)?new Vi(e.map(F),"equalAny"):e;return new x("equal_any",[this,t],"equalAny").asBoolean()}notEqualAny(e){const t=Array.isArray(e)?new Vi(e.map(F),"notEqualAny"):e;return new x("not_equal_any",[this,t],"notEqualAny").asBoolean()}exists(){return new x("exists",[this],"exists").asBoolean()}charLength(){return new x("char_length",[this],"charLength")}like(e){return new x("like",[this,F(e)],"like").asBoolean()}regexContains(e){return new x("regex_contains",[this,F(e)],"regexContains").asBoolean()}regexFind(e){return new x("regex_find",[this,F(e)],"regexFind")}regexFindAll(e){return new x("regex_find_all",[this,F(e)],"regexFindAll")}regexMatch(e){return new x("regex_match",[this,F(e)],"regexMatch").asBoolean()}stringContains(e){return new x("string_contains",[this,F(e)],"stringContains").asBoolean()}startsWith(e){return new x("starts_with",[this,F(e)],"startsWith").asBoolean()}endsWith(e){return new x("ends_with",[this,F(e)],"endsWith").asBoolean()}toLower(){return new x("to_lower",[this],"toLower")}toUpper(){return new x("to_upper",[this],"toUpper")}trim(e){const t=[this];return e&&t.push(F(e)),new x("trim",t,"trim")}ltrim(e){const t=[this];return e&&t.push(F(e)),new x("ltrim",t,"ltrim")}rtrim(e){const t=[this];return e&&t.push(F(e)),new x("rtrim",t,"rtrim")}type(){return new x("type",[this])}isType(e){return new x("is_type",[this,Xi(e)],"isType").asBoolean()}stringConcat(e,...t){const r=[e,...t].map(F);return new x("string_concat",[this,...r],"stringConcat")}stringIndexOf(e){return new x("string_index_of",[this,F(e)],"stringIndexOf")}stringRepeat(e){return new x("string_repeat",[this,F(e)],"stringRepeat")}stringReplaceAll(e,t){return new x("string_replace_all",[this,F(e),F(t)],"stringReplaceAll")}stringReplaceOne(e,t){return new x("string_replace_one",[this,F(e),F(t)],"stringReplaceOne")}concat(e,...t){const r=[e,...t].map(F);return new x("concat",[this,...r],"concat")}reverse(){return new x("reverse",[this],"reverse")}arrayFilter(e,t){return new x("array_filter",[this,F(e),t],"arrayFilter")}arrayTransform(e,t){return new x("array_transform",[this,F(e),t],"arrayTransform")}arrayTransformWithIndex(e,t,r){return new x("array_transform",[this,F(e),F(t),r],"arrayTransformWithIndex")}arraySlice(e,t){const r=[this,F(e)];return t!==void 0&&r.push(F(t)),new x("array_slice",r,"arraySlice")}arrayFirst(){return new x("array_first",[this],"arrayFirst")}arrayFirstN(e){return new x("array_first_n",[this,F(e)],"arrayFirstN")}arrayLast(){return new x("array_last",[this],"arrayLast")}arrayLastN(e){return new x("array_last_n",[this,F(e)],"arrayLastN")}arrayMaximum(){return new x("maximum",[this],"arrayMaximum")}arrayMaximumN(e){return new x("maximum_n",[this,F(e)],"arrayMaximumN")}arrayMinimum(){return new x("minimum",[this],"arrayMinimum")}arrayMinimumN(e){return new x("minimum_n",[this,F(e)],"arrayMinimumN")}arrayIndexOf(e){return new x("array_index_of",[this,F(e),F("first")],"arrayIndexOf")}arrayLastIndexOf(e){return new x("array_index_of",[this,F(e),F("last")],"arrayLastIndexOf")}arrayIndexOfAll(e){return new x("array_index_of_all",[this,F(e)],"arrayIndexOfAll")}byteLength(){return new x("byte_length",[this],"byteLength")}ceil(){return new x("ceil",[this])}floor(){return new x("floor",[this])}abs(){return new x("abs",[this])}exp(){return new x("exp",[this])}mapGet(e){return new x("map_get",[this,Xi(e)],"mapGet")}mapSet(e,t,...r){const s=[this,F(e),F(t),...r.map(F)];return new x("map_set",s,"mapSet")}mapKeys(){return new x("map_keys",[this],"mapKeys")}mapValues(){return new x("map_values",[this],"mapValues")}mapEntries(){return new x("map_entries",[this],"mapEntries")}getField(e){return new x("get_field",[this,F(e)],"get_field")}count(){return ct._create("count",[this],"count")}sum(){return ct._create("sum",[this],"sum")}average(){return ct._create("average",[this],"average")}minimum(){return ct._create("minimum",[this],"minimum")}maximum(){return ct._create("maximum",[this],"maximum")}first(){return ct._create("first",[this],"first")}last(){return ct._create("last",[this],"last")}arrayAgg(){return ct._create("array_agg",[this],"arrayAgg")}arrayAggDistinct(){return ct._create("array_agg_distinct",[this],"arrayAggDistinct")}countDistinct(){return ct._create("count_distinct",[this],"countDistinct")}logicalMaximum(e,...t){const r=[e,...t];return new x("maximum",[this,...r.map(F)],"logicalMaximum")}logicalMinimum(e,...t){const r=[e,...t];return new x("minimum",[this,...r.map(F)],"minimum")}vectorLength(){return new x("vector_length",[this],"vectorLength")}cosineDistance(e){return new x("cosine_distance",[this,lu(e)],"cosineDistance")}dotProduct(e){return new x("dot_product",[this,lu(e)],"dotProduct")}euclideanDistance(e){return new x("euclidean_distance",[this,lu(e)],"euclideanDistance")}unixMicrosToTimestamp(){return new x("unix_micros_to_timestamp",[this],"unixMicrosToTimestamp")}timestampToUnixMicros(){return new x("timestamp_to_unix_micros",[this],"timestampToUnixMicros")}unixMillisToTimestamp(){return new x("unix_millis_to_timestamp",[this],"unixMillisToTimestamp")}timestampToUnixMillis(){return new x("timestamp_to_unix_millis",[this],"timestampToUnixMillis")}unixSecondsToTimestamp(){return new x("unix_seconds_to_timestamp",[this],"unixSecondsToTimestamp")}timestampToUnixSeconds(){return new x("timestamp_to_unix_seconds",[this],"timestampToUnixSeconds")}timestampAdd(e,t){return new x("timestamp_add",[this,F(e),F(t)],"timestampAdd")}timestampSubtract(e,t){return new x("timestamp_subtract",[this,F(e),F(t)],"timestampSubtract")}timestampDiff(e,t){return new x("timestamp_diff",[this,Wl(e),F(t)],"timestampDiff")}timestampExtract(e,t){const r=[this,F(e)];return t&&r.push(F(t)),new x("timestamp_extract",r,"timestampExtract")}documentId(){return new x("document_id",[this],"documentId")}parent(){return new x("parent",[this],"parent")}substring(e,t){const r=F(e);return new x("substring",t===void 0?[this,r]:[this,r,F(t)],"substring")}arrayGet(e){return new x("array_get",[this,F(e)],"arrayGet")}isError(){return new x("is_error",[this],"isError").asBoolean()}ifError(e){const t=new x("if_error",[this,F(e)],"ifError");return e instanceof zn?t.asBoolean():t}isAbsent(){return new x("is_absent",[this],"isAbsent").asBoolean()}mapRemove(e){return new x("map_remove",[this,F(e)],"mapRemove")}mapMerge(e,...t){const r=F(e),s=t.map(F);return new x("map_merge",[this,r,...s],"mapMerge")}pow(e){return new x("pow",[this,F(e)])}trunc(e){return e===void 0?new x("trunc",[this]):new x("trunc",[this,F(e)],"trunc")}round(e){return e===void 0?new x("round",[this]):new x("round",[this,F(e)],"round")}collectionId(){return new x("collection_id",[this])}length(){return new x("length",[this])}ln(){return new x("ln",[this])}sqrt(){return new x("sqrt",[this])}stringReverse(){return new x("string_reverse",[this])}ifAbsent(e){return new x("if_absent",[this,F(e)],"ifAbsent")}ifNull(e){return new x("if_null",[this,F(e)],"ifNull")}coalesce(e,...t){return new x("coalesce",[this,F(e),...t.map(F)],"coalesce")}join(e){return new x("join",[this,F(e)],"join")}log10(){return new x("log10",[this])}arraySum(){return new x("sum",[this])}split(e){return new x("split",[this,F(e)])}timestampTruncate(e,t){const r=[this,F(e)];return t&&r.push(F(t)),new x("timestamp_trunc",r)}ascending(){return OR(this)}descending(){return LR(this)}as(e){return new CR(this,e,"as")}}class ct{constructor(e,t){this.name=e,this.params=t,this.exprType="AggregateFunction",this._protoValueType="ProtoValue"}static _create(e,t,r){const s=new ct(e,t);return s._methodName=r,s}as(e){return new VR(this,e,"as")}_toProto(e){return{functionValue:{name:this.name,args:this.params.map((t=>t._toProto(e)))}}}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e)))}}class VR{constructor(e,t,r){this.aggregate=e,this.alias=t,this._methodName=r}_readUserData(e){this.aggregate._readUserData(e)}}class CR{constructor(e,t,r){this.expr=e,this.alias=t,this._methodName=r,this.exprType="AliasedExpression",this.selectable=!0}_readUserData(e){this.expr._readUserData(e)}}class Vi extends $r{constructor(e,t){super(),this.ur=e,this._methodName=t,this.expressionType="ListOfExpressions"}_toProto(e){return{arrayValue:{values:this.ur.map((t=>t._toProto(e)))}}}_readUserData(e){this.ur.forEach((t=>t._readUserData(e)))}}class jr extends $r{constructor(e,t){super(),this.fieldPath=e,this._methodName=t,this.expressionType="Field",this.selectable=!0}get _fieldPath(){return this.fieldPath}get fieldName(){return this.fieldPath.canonicalString()}get alias(){return this.fieldName}get expr(){return this}geoDistance(e){return new x("geo_distance",[this,F(e)],"geoDistance")}_toProto(e){return{fieldReferenceValue:this.fieldPath.canonicalString()}}_readUserData(e){}}function ha(n){return xR(n,"field")}function xR(n,e){return new jr(typeof n=="string"?Dt===n?a_()._internalPath:Pt("field",n):n._internalPath,e)}class zr extends $r{constructor(e,t){super(),this.value=e,this._methodName=t,this.expressionType="Constant"}static _fromProto(e){const t=new zr(e,void 0);return t._protoValue=e,t}_toProto(e){return L(this._protoValue!==void 0,237),this._protoValue}_getValue(){return this._protoValue}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,TR(this._protoValue)||(this._protoValue=jt(this.value,e))}}function Xi(n,e){return x_(n,"constant")}function x_(n,e){const t=new zr(n,e);return typeof n=="boolean"?new D_(t):t}class x extends $r{constructor(e,t,r,s){super(),this.name=e,this.params=t,this.expressionType="Function",this._optionsProto=void 0,r!==void 0&&(this._methodName=r),s!==void 0&&(this._options=s)}get _optionsUtil(){return new He({})}_toProto(e){const t={functionValue:{name:this.name,args:this.params.map((r=>r._toProto(e)))}};return this._optionsProto&&(t.functionValue.options=this._optionsProto),t}_readUserData(e){e=this._methodName?e.contextWith({methodName:this._methodName}):e,this.params.forEach((t=>t._readUserData(e))),this._options&&(this._optionsProto=this._optionsUtil.getOptionsProto(e,this._options))}}class zn extends $r{get _methodName(){return this._expr._methodName}countIf(){return ct._create("count_if",[this],"countIf")}not(){return new x("not",[this],"not").asBoolean()}conditional(e,t){return new x("conditional",[this,e,t],"conditional")}ifError(e){const t=F(e),r=new x("if_error",[this,t],"ifError");return t instanceof zn?r.asBoolean():r}_toProto(e){return this._expr._toProto(e)}_readUserData(e){this._expr._readUserData(e)}}class N_ extends zn{constructor(e){super(),this._expr=e,this.expressionType="Function"}}class D_ extends zn{constructor(e){super(),this._expr=e,this.expressionType="Constant"}_getValue(){return this._expr._getValue()}}class NR extends zn{constructor(e){super(),this._expr=e,this.expressionType="Field"}}function DR(n,e){const t=[];for(const r in n)if(Object.prototype.hasOwnProperty.call(n,r)){const s=n[r];t.push(Xi(r)),t.push(F(s))}return new x("map",t,"map")}function kR(n){return(function(t,r){return new x("array",t.map((s=>F(s))),r)})(n,"array")}function OR(n){return new Hl(Wl(n),"ascending","ascending")}function LR(n){return new Hl(Wl(n),"descending","descending")}class Hl{constructor(e,t,r){this.expr=e,this.direction=t,this._methodName=r,this._protoValueType="ProtoValue"}_toProto(e){return{mapValue:{fields:{direction:o_(this.direction),expression:this.expr._toProto(e)}}}}_readUserData(e){this.expr._readUserData(e)}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pt{constructor(e){this.optionsProto=void 0,{rawOptions:this.rawOptions,...this.knownOptions}=e}_readUserData(e){this.optionsProto=this._optionsUtil.getOptionsProto(e,this.knownOptions,this.rawOptions)}_toProto(e){return{name:this._name,options:this.optionsProto}}}class k_ extends pt{get _name(){return"add_fields"}get _optionsUtil(){return new He({})}constructor(e,t){super(t),this.fields=e}_toProto(e){return{...super._toProto(e),args:[Yi(e,this.fields)]}}_readUserData(e){super._readUserData(e),Kn(this.fields,e)}}class O_ extends pt{get _name(){return"aggregate"}get _optionsUtil(){return new He({})}constructor(e,t,r){super(r),this.groups=e,this.accumulators=t}_toProto(e){return{...super._toProto(e),args:[Yi(e,this.accumulators),Yi(e,this.groups)]}}_readUserData(e){super._readUserData(e),Kn(this.groups,e),Kn(this.accumulators,e)}}class L_ extends pt{get _name(){return"distinct"}get _optionsUtil(){return new He({})}constructor(e,t){super(t),this.groups=e}_toProto(e){return{...super._toProto(e),args:[Yi(e,this.groups)]}}_readUserData(e){super._readUserData(e),Kn(this.groups,e)}}class wo extends pt{get _name(){return"collection"}get _optionsUtil(){return new He({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.Er=e.startsWith("/")?e:"/"+e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:this.Er}]}}_readUserData(e){super._readUserData(e)}}class To extends pt{get _name(){return"collection_group"}get _optionsUtil(){return new He({forceIndex:{serverName:"force_index"}})}constructor(e,t){super(t),this.collectionId=e}_toProto(e){return{...super._toProto(e),args:[{referenceValue:""},{stringValue:this.collectionId}]}}_readUserData(e){super._readUserData(e)}}class fc extends pt{get _name(){return"database"}get _optionsUtil(){return new He({})}_toProto(e){return{...super._toProto(e)}}_readUserData(e){super._readUserData(e)}}class pc extends pt{get _name(){return"documents"}get _optionsUtil(){return new He({})}constructor(e,t){if(super(t),!e||e.length===0)throw new N(b.INVALID_ARGUMENT,"Empty document paths are not allowed in DocumentsSource");const r=e.map((i=>i.startsWith("/")?i:"/"+i)),s=new Set(r);if(s.size!==r.length)throw new N(b.INVALID_ARGUMENT,"Duplicate document paths are not allowed in DocumentsSource");this.hr=r,this.Tr=s}_toProto(e){return{...super._toProto(e),args:this.hr.map((t=>({referenceValue:t})))}}_readUserData(e){super._readUserData(e)}}class Eo extends pt{get _name(){return"where"}get _optionsUtil(){return new He({})}constructor(e,t){super(t),this.condition=e}_toProto(e){return{...super._toProto(e),args:[this.condition._toProto(e)]}}_readUserData(e){super._readUserData(e),Kn(this.condition,e)}}class Gn extends pt{get _name(){return"limit"}get _optionsUtil(){return new He({})}constructor(e,t){L(!isNaN(e)&&e!==1/0&&e!==-1/0,34860),super(t),this.limit=e}_toProto(e){return{...super._toProto(e),args:[$s(e,this.limit)]}}}class ip extends pt{get _name(){return"offset"}get _optionsUtil(){return new He({})}constructor(e,t){super(t),this.offset=e}_toProto(e){return{...super._toProto(e),args:[$s(e,this.offset)]}}}class MR extends pt{get _name(){return"select"}get _optionsUtil(){return new He({})}constructor(e,t){super(t),this.selections=e}_toProto(e){return{...super._toProto(e),args:[Yi(e,this.selections)]}}_readUserData(e){super._readUserData(e),Kn(this.selections,e)}}class Ot extends pt{get _name(){return"sort"}get _optionsUtil(){return new He({})}constructor(e,t){super(t),this.orderings=e}_toProto(e){return{...super._toProto(e),args:this.orderings.map((t=>t._toProto(e)))}}_readUserData(e){super._readUserData(e),Kn(this.orderings,e)}}class Ql extends pt{get _name(){return"replace_with"}get _optionsUtil(){return new He({})}constructor(e,t){super(t),this.map=e}_toProto(e){return{...super._toProto(e),args:[this.map._toProto(e),o_(Ql.Pr)]}}_readUserData(e){super._readUserData(e),Kn(this.map,e)}}Ql.Pr="full_replace";function Kn(n,e){return V_(n)?n._readUserData(e):Array.isArray(n)?n.forEach((t=>t._readUserData(e))):n instanceof Map?n.forEach((t=>t._readUserData(e))):Object.values(n).forEach((t=>t._readUserData(e))),n}/**
 * @license
 * Copyright 2026 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fi{constructor(e,t,r,s){this._db=e,this.userDataReader=t,this._userDataWriter=r,this.stages=s}Ar(e,t){const r=this.userDataReader.createContext(3,e);return V_(t)?t._readUserData(r):Array.isArray(t)?t.forEach((s=>s._readUserData(r))):t.forEach((s=>s._readUserData(r))),t}where(e){const t=this.stages.map((r=>r));return this.Ar("where",e),t.push(new Eo(e,{})),new Fi(this._db,this.userDataReader,this._userDataWriter,t)}limit(e){const t=this.stages.map((r=>r));return t.push(new Gn(e,{})),new Fi(this._db,this.userDataReader,this._userDataWriter,t)}sort(e,...t){const r=this.stages.map((s=>s));return"orderings"in e?r.push(new Ot(this.Ar("sort",e.orderings),{})):r.push(new Ot(this.Ar("sort",[e,...t]),{})),new Fi(this._db,this.userDataReader,this._userDataWriter,r)}Vr(e){return{pipeline:{stages:this.stages.map((t=>t._toProto(e)))}}}}// Copyright 2024 Google LLC* @license
class T{constructor(e,t){this.type=e,this.value=t}static dr(){return new T("ERROR",void 0)}static mr(){return new T("UNSET",void 0)}static pr(){return new T("NULL",Ut)}static newValue(e){return ht(e)?new T("NULL",Ut):(function(r){return!!r&&"booleanValue"in r})(e)?new T("BOOLEAN",e):kt(e)?new T("INT",e):_r(e)?new T("DOUBLE",e):(function(r){return!!r&&"timestampValue"in r&&!!r.timestampValue})(e)?new T("TIMESTAMP",e):(function(r){return!!r&&"stringValue"in r})(e)?new T("STRING",e):(function(r){return!!r&&"bytesValue"in r})(e)?new T("BYTES",e):e.referenceValue?new T("REFERENCE",e):e.geoPointValue?new T("GEO_POINT",e):$n(e)?new T("ARRAY",e):br(e)?new T("VECTOR",e):wr(e)?new T("MAP",e):new T("ERROR",void 0)}gr(){return this.type==="ERROR"||this.type==="UNSET"}yr(){return this.type==="NULL"}}function Ui(n){if(!n.gr())return n.value}function M_(n){return n instanceof zn?n._expr:n}function W(n){if((n=M_(n))instanceof jr)return new FR(n);if(n instanceof zr)return new UR(n);if(n instanceof Vi)return new BR(n);if(n instanceof x){if(n.name==="add")return new jR(n);if(n.name==="subtract")return new zR(n);if(n.name==="multiply")return new GR(n);if(n.name==="divide")return new KR(n);if(n.name==="mod")return new WR(n);if(n.name==="and")return new HR(n);if(n.name==="equal")return new oP(n);if(n.name==="not_equal")return new aP(n);if(n.name==="less_than")return new cP(n);if(n.name==="less_than_or_equal")return new uP(n);if(n.name==="greater_than")return new lP(n);if(n.name==="greater_than_or_equal")return new hP(n);if(n.name==="array_concat")return new dP(n);if(n.name==="array_reverse")return new fP(n);if(n.name==="array_contains")return new pP(n);if(n.name==="array_contains_all")return new mP(n);if(n.name==="array_contains_any")return new gP(n);if(n.name==="array_length")return new _P(n);if(n.name==="array_element")return new yP(n);if(n.name==="equal_any")return new F_(n);if(n.name==="not_equal_any")return new JR(n);if(n.name==="is_nan")return new YR(n);if(n.name==="is_not_nan")return new XR(n);if(n.name==="is_null")return new ZR(n);if(n.name==="is_not_null")return new eP(n);if(n.name==="is_error")return new tP(n);if(n.name==="exists")return new nP(n);if(n.name==="not")return new mc(n);if(n.name==="or")return new QR(n);if(n.name==="xor")return new Jl(n);if(n.name==="conditional")return new rP(n);if(n.name==="maximum")return new sP(n);if(n.name==="minimum")return new iP(n);if(n.name==="reverse")return new IP(n);if(n.name==="replace_first")return new wP(n);if(n.name==="replace_all")return new TP(n);if(n.name==="char_length")return new EP(n);if(n.name==="byte_length")return new vP(n);if(n.name==="like")return new AP(n);if(n.name==="regex_contains")return new RP(n);if(n.name==="regex_match")return new PP(n);if(n.name==="string_contains")return new bP(n);if(n.name==="starts_with")return new SP(n);if(n.name==="ends_with")return new VP(n);if(n.name==="to_lower")return new CP(n);if(n.name==="to_upper")return new xP(n);if(n.name==="trim")return new NP(n);if(n.name==="string_concat")return new DP(n);if(n.name==="map_get")return new kP(n);if(n.name==="cosine_distance")return new OP(n);if(n.name==="dot_product")return new LP(n);if(n.name==="euclidean_distance")return new MP(n);if(n.name==="vector_length")return new FP(n);if(n.name==="unix_micros_to_timestamp")return new jP(n);if(n.name==="timestamp_to_unix_micros")return new KP(n);if(n.name==="unix_millis_to_timestamp")return new zP(n);if(n.name==="timestamp_to_unix_millis")return new WP(n);if(n.name==="unix_seconds_to_timestamp")return new GP(n);if(n.name==="timestamp_to_unix_seconds")return new HP(n);if(n.name==="timestamp_add")return new QP(n);if(n.name==="timestamp_subtract")return new JP(n)}throw new Error(`Unknown Expr : ${n}`)}class FR{constructor(e){this.expr=e}evaluate(e,t){if(this.expr.fieldName===Dt)return T.newValue({referenceValue:Ps(e.serializer,t.key)});if(this.expr.fieldName==="__update_time__")return T.newValue({timestampValue:la(e.serializer,t.version)});if(this.expr.fieldName==="__create_time__")return T.newValue({timestampValue:la(e.serializer,t.createTime)});const r=t.data.field(this.expr._fieldPath);return r?po(r)?T.newValue((function(i,o){if(i.serverTimestampBehavior==="estimate")return{timestampValue:la(i.serializer,j.fromTimestamp(ms(o)))};if(i.serverTimestampBehavior==="previous"){const c=mo(o);if(c)return c}return{nullValue:"NULL_VALUE"}})(e,r)):T.newValue(r):T.mr()}}class UR{constructor(e){this.expr=e}evaluate(e,t){return T.newValue(this.expr._getValue())}}class BR{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.ur.map((s=>W(s).evaluate(e,t)));return r.some((s=>s.gr()))?T.dr():T.newValue({arrayValue:{values:r.map((s=>s.value))}})}}function Be(n){return _r(n)?Number(n.doubleValue):Number(n.integerValue)}function zt(n){return BigInt(n.integerValue)}const qR=BigInt("0x7fffffffffffffff"),$R=-BigInt("0x8000000000000000");class vo{constructor(e){this.expr=e}evaluate(e,t){L(this.expr.params.length>=2,24778);const r=W(this.expr.params[0]).evaluate(e,t),s=W(this.expr.params[1]).evaluate(e,t);let i=this.wr(r,s);for(const o of this.expr.params.slice(2)){const c=W(o).evaluate(e,t);i=this.wr(i,c)}return i}wr(e,t){if(e.gr()||t.gr())return T.dr();if(e.yr()||t.yr())return T.pr();const r=e.value,s=t.value;if(!_r(r)&&!kt(r)||!_r(s)&&!kt(s))return T.dr();if(_r(r)||_r(s)){const i=this.br(r,s);return i?T.newValue(i):T.dr()}if(kt(r)&&kt(s)){const i=this.vr(r,s);return i===void 0?T.dr():typeof i=="number"?T.newValue({doubleValue:i}):i<$R||i>qR?T.dr():T.newValue({integerValue:`${i}`})}return T.dr()}}function an(n,e){return be(n)!==be(e)?"TYPE_MISMATCH":ot(n)||ot(e)?"NOT_EQ":ht(n)&&ht(e)?"EQ":ht(n)||ht(e)?"NULL":$n(n)&&$n(e)?(function(r,s){var o,c,u;if(((o=r.values)==null?void 0:o.length)!==((c=s.values)==null?void 0:c.length))return"NOT_EQ";let i=!1;for(let l=0;l<(((u=r.values)==null?void 0:u.length)??0);l++){const d=r.values[l],p=s.values[l];switch(an(d,p)){case"EQ":break;case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":i=!0;break;default:q(44609,{Sr:d,Dr:p})}}return i?"NULL":"EQ"})(n.arrayValue,e.arrayValue):br(n)&&br(e)||wr(n)&&wr(e)?(function(r,s){const i=r.fields||{},o=s.fields||{};if(ba(i)!==ba(o))return"NOT_EQ";let c=!1;for(const u in i)if(i.hasOwnProperty(u)){if(o[u]===void 0)return"NOT_EQ";switch(an(i[u],o[u])){case"NOT_EQ":case"TYPE_MISMATCH":return"NOT_EQ";case"NULL":c=!0}}return c?"NULL":"EQ"})(n.mapValue,e.mapValue):(function(r,s){return It(r,s,{o:!1,t:!0,i:!0})})(n,e)?"EQ":"NOT_EQ"}class jR extends vo{vr(e,t){return zt(e)+zt(t)}br(e,t){return{doubleValue:Be(e)+Be(t)}}}class zR extends vo{constructor(e){super(e),this.expr=e}vr(e,t){return zt(e)-zt(t)}br(e,t){return{doubleValue:Be(e)-Be(t)}}}class GR extends vo{constructor(e){super(e),this.expr=e}vr(e,t){return zt(e)*zt(t)}br(e,t){return{doubleValue:Be(e)*Be(t)}}}class KR extends vo{constructor(e){super(e),this.expr=e}vr(e,t){const r=zt(t);if(r!==BigInt(0))return zt(e)/r}br(e,t){const r=Be(t);return r===0?{doubleValue:gs(r)?Number.NEGATIVE_INFINITY:Number.POSITIVE_INFINITY}:{doubleValue:Be(e)/r}}}class WR extends vo{constructor(e){super(e),this.expr=e}vr(e,t){const r=zt(t);if(r!==BigInt(0))return zt(e)%r}br(e,t){const r=Be(t);if(r!==0)return{doubleValue:Be(e)%r}}}class HR{constructor(e){this.expr=e}evaluate(e,t){var i;let r=!1,s=!1;for(const o of this.expr.params){const c=W(o).evaluate(e,t);switch(c.type){case"BOOLEAN":if(!((i=c.value)!=null&&i.booleanValue))return T.newValue(Me);break;case"NULL":s=!0;break;default:r=!0}}return r?T.dr():s?T.pr():T.newValue(it)}}class mc{constructor(e){this.expr=e}evaluate(e,t){var s;L(this.expr.params.length===1,9634);const r=W(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BOOLEAN":return T.newValue({booleanValue:!((s=r.value)!=null&&s.booleanValue)});case"NULL":return T.pr();default:return T.dr()}}}class QR{constructor(e){this.expr=e}evaluate(e,t){var i;let r=!1,s=!1;for(const o of this.expr.params){const c=W(o).evaluate(e,t);switch(c.type){case"BOOLEAN":if((i=c.value)!=null&&i.booleanValue)return T.newValue(it);break;case"NULL":s=!0;break;default:r=!0}}return r?T.dr():s?T.pr():T.newValue(Me)}}class Jl{constructor(e){this.expr=e}evaluate(e,t){var i;let r=!1,s=!1;for(const o of this.expr.params){const c=W(o).evaluate(e,t);switch(c.type){case"BOOLEAN":r=Jl.xor(r,!!((i=c.value)!=null&&i.booleanValue));break;case"NULL":s=!0;break;default:return T.dr()}}return s?T.pr():T.newValue({booleanValue:r})}static xor(e,t){return(e||t)&&!(e&&t)}}class F_{constructor(e){this.expr=e}evaluate(e,t){var o,c;L(this.expr.params.length===2,55094);let r=!1;const s=W(this.expr.params[0]).evaluate(e,t);switch(s.type){case"NULL":r=!0;break;case"ERROR":case"UNSET":return T.dr()}const i=W(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return T.dr()}if(r)return T.pr();for(const u of((c=(o=i.value)==null?void 0:o.arrayValue)==null?void 0:c.values)??[])switch(ht(s.value)&&ht(u)?"EQ":an(s.value,u)){case"EQ":return T.newValue(it);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:q(44608,{value:s.value,candidate:u})}return r?T.pr():T.newValue(Me)}}class JR{constructor(e){this.expr=e}evaluate(e,t){return new mc(new x("not",[new x("equal_any",this.expr.params)])).evaluate(e,t)}}class YR{constructor(e){this.expr=e}evaluate(e,t){L(this.expr.params.length===1,23322);const r=W(this.expr.params[0]).evaluate(e,t);switch(r.type){case"INT":return T.newValue(Me);case"DOUBLE":return T.newValue({booleanValue:isNaN(Be(r.value))});case"NULL":return T.pr();default:return T.dr()}}}class XR{constructor(e){this.expr=e}evaluate(e,t){return L(this.expr.params.length===1,50406),new mc(new x("not",[new x("is_nan",this.expr.params)])).evaluate(e,t)}}class ZR{constructor(e){this.expr=e}evaluate(e,t){switch(L(this.expr.params.length===1,23123),W(this.expr.params[0]).evaluate(e,t).type){case"NULL":return T.newValue(it);case"UNSET":case"ERROR":return T.dr();default:return T.newValue(Me)}}}class eP{constructor(e){this.expr=e}evaluate(e,t){return L(this.expr.params.length===1,23167),new mc(new x("not",[new x("is_null",this.expr.params)])).evaluate(e,t)}}class tP{constructor(e){this.expr=e}evaluate(e,t){return L(this.expr.params.length===1,5228),W(this.expr.params[0]).evaluate(e,t).type==="ERROR"?T.newValue(it):T.newValue(Me)}}class nP{constructor(e){this.expr=e}evaluate(e,t){switch(L(this.expr.params.length===1,6877),W(this.expr.params[0]).evaluate(e,t).type){case"ERROR":return T.dr();case"UNSET":return T.newValue(Me);default:return T.newValue(it)}}}class rP{constructor(e){this.expr=e}evaluate(e,t){var s;L(this.expr.params.length===3,11706);const r=W(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BOOLEAN":return(s=r.value)!=null&&s.booleanValue?W(this.expr.params[1]).evaluate(e,t):W(this.expr.params[2]).evaluate(e,t);case"NULL":return W(this.expr.params[2]).evaluate(e,t);default:return T.dr()}}}class sP{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.params.map((i=>W(i).evaluate(e,t)));let s;for(const i of r)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||We(i.value,s.value)>0?i:s}return s===void 0?T.pr():s}}class iP{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.params.map((i=>W(i).evaluate(e,t)));let s;for(const i of r)switch(i.type){case"ERROR":case"UNSET":case"NULL":continue;default:s=s===void 0||We(i.value,s.value)<0?i:s}return s===void 0?T.pr():s}}class Ws{constructor(e){this.expr=e}evaluate(e,t){L(this.expr.params.length===2,31033,`${this.expr.name}() function should have exactly 2 params`);const r=W(this.expr.params[0]).evaluate(e,t);switch(r.type){case"ERROR":case"UNSET":return T.dr()}const s=W(this.expr.params[1]).evaluate(e,t);switch(s.type){case"ERROR":case"UNSET":return T.dr()}return this.Cr(r,s)}}class oP extends Ws{constructor(e){super(e),this.expr=e}Cr(e,t){if(e.yr()&&t.yr())return T.newValue(it);if(e.yr()||t.yr()||ot(e.value)||ot(t.value)||be(e.value)!==be(t.value))return T.newValue(Me);switch(an(e.value,t.value)){case"EQ":return T.newValue(it);case"NOT_EQ":return T.newValue(Me);case"NULL":return T.pr();default:q(44615,{left:e,right:t})}}}class aP extends Ws{constructor(e){super(e),this.expr=e}Cr(e,t){switch(an(e.value,t.value)){case"EQ":return T.newValue(Me);case"NOT_EQ":case"TYPE_MISMATCH":return T.newValue(it);case"NULL":return T.pr();default:q(44614,{left:e,right:t})}}}class cP extends Ws{constructor(e){super(e),this.expr=e}Cr(e,t){return be(e.value)!==be(t.value)||ot(e.value)||ot(t.value)?T.newValue(Me):T.newValue({booleanValue:We(e.value,t.value)<0})}}class uP extends Ws{constructor(e){super(e),this.expr=e}Cr(e,t){return be(e.value)!==be(t.value)||ot(e.value)||ot(t.value)?T.newValue(Me):an(e.value,t.value)==="EQ"?T.newValue(it):T.newValue({booleanValue:We(e.value,t.value)<0})}}class lP extends Ws{constructor(e){super(e),this.expr=e}Cr(e,t){return be(e.value)!==be(t.value)||ot(e.value)||ot(t.value)?T.newValue(Me):T.newValue({booleanValue:We(e.value,t.value)>0})}}class hP extends Ws{constructor(e){super(e),this.expr=e}Cr(e,t){return be(e.value)!==be(t.value)||ot(e.value)||ot(t.value)?T.newValue(Me):an(e.value,t.value)==="EQ"?T.newValue(it):T.newValue({booleanValue:We(e.value,t.value)>0})}}class dP{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class fP{constructor(e){this.expr=e}evaluate(e,t){var s;L(this.expr.params.length===1,216);const r=W(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return T.pr();case"ARRAY":{const i=((s=r.value.arrayValue)==null?void 0:s.values)??[];return T.newValue({arrayValue:{values:[...i].reverse()}})}default:return T.dr()}}}class pP{constructor(e){this.expr=e}evaluate(e,t){return L(this.expr.params.length===2,52884),new F_(new x("eq_any",[this.expr.params[1],this.expr.params[0]])).evaluate(e,t)}}class mP{constructor(e){this.expr=e}evaluate(e,t){var u,l,d,p;L(this.expr.params.length===2,1392);let r=!1;const s=W(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":r=!0;break;default:return T.dr()}const i=W(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return T.dr()}if(r)return T.pr();const o=((l=(u=i.value)==null?void 0:u.arrayValue)==null?void 0:l.values)??[],c=((p=(d=s.value)==null?void 0:d.arrayValue)==null?void 0:p.values)??[];for(const g of o){let w=!1;r=!1;for(const S of c){switch(ht(g)&&ht(S)?"EQ":an(g,S)){case"EQ":w=!0;break;case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:q(44613,{value:S,search:g})}if(w)break}if(!w)return T.newValue(Me)}return T.newValue(it)}}class gP{constructor(e){this.expr=e}evaluate(e,t){var u,l,d,p;L(this.expr.params.length===2,2680);let r=!1;const s=W(this.expr.params[0]).evaluate(e,t);switch(s.type){case"ARRAY":break;case"NULL":r=!0;break;default:return T.dr()}const i=W(this.expr.params[1]).evaluate(e,t);switch(i.type){case"ARRAY":break;case"NULL":r=!0;break;default:return T.dr()}if(r)return T.pr();const o=((l=(u=i.value)==null?void 0:u.arrayValue)==null?void 0:l.values)??[],c=((p=(d=s.value)==null?void 0:d.arrayValue)==null?void 0:p.values)??[];for(const g of c)for(const w of o)switch(ht(g)&&ht(w)?"EQ":an(g,w)){case"EQ":return T.newValue(it);case"NOT_EQ":case"TYPE_MISMATCH":break;case"NULL":r=!0;break;default:q(60403,{value:g,search:w})}return r?T.pr():T.newValue(Me)}}class _P{constructor(e){this.expr=e}evaluate(e,t){var s,i,o;L(this.expr.params.length===1,38605);const r=W(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return T.pr();case"ARRAY":return T.newValue({integerValue:`${((o=(i=(s=r.value)==null?void 0:s.arrayValue)==null?void 0:i.values)==null?void 0:o.length)??0}`});default:return T.dr()}}}class yP{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class IP{constructor(e){this.expr=e}evaluate(e,t){var s,i;L(this.expr.params.length===1,1508);const r=W(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return T.pr();case"BYTES":{const o=(s=r.value)==null?void 0:s.bytesValue;if(typeof o=="string"){const c=pe.fromBase64String(o).toUint8Array();return c.reverse(),T.newValue({bytesValue:pe.fromUint8Array(c).toBase64()})}return T.newValue({bytesValue:new Uint8Array(o).reverse()})}case"STRING":{const o=(i=r.value)==null?void 0:i.stringValue,c=new Intl.__PRIVATE_Segmenter(void 0,{granularity:"grapheme"}).segment(o),u=Array.from(c,(l=>l.segment)).reverse();return T.newValue({stringValue:u.join("")})}default:return T.dr()}}}class wP{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class TP{constructor(e){this.expr=e}evaluate(e,t){throw new Error("Unimplemented")}}class EP{constructor(e){this.expr=e}evaluate(e,t){L(this.expr.params.length===1,19400);const r=W(this.expr.params[0]).evaluate(e,t);switch(r.type){case"NULL":return T.pr();case"STRING":{const s=(function(o){let c=0;for(let u=0;u<o.length;u++){const l=o.codePointAt(u);if(l===void 0)return;if(l<=65535)if(l>=55296&&l<=57343)if(l<=56319){const d=o.codePointAt(u+1);d!==void 0&&d>=56320&&d<=57343?(c+=1,u++):c+=1}else c+=1;else c+=1;else{if(!(l<=1114111))return;c+=1,u++}}return c})(r.value.stringValue);return s===void 0?T.dr():T.newValue({integerValue:s})}default:return T.dr()}}}class vP{constructor(e){this.expr=e}evaluate(e,t){var s,i;L(this.expr.params.length===1,8486);const r=W(this.expr.params[0]).evaluate(e,t);switch(r.type){case"BYTES":{const o=(s=r.value)==null?void 0:s.bytesValue;return typeof o=="string"?T.newValue({integerValue:pe.fromBase64String(o).toUint8Array().length}):T.newValue({integerValue:new Uint8Array(o).length})}case"STRING":{const o=(function(u){let l=0;for(let d=0;d<u.length;d++){const p=u.codePointAt(d);if(p===void 0)return;if(p>=55296&&p<=57343){if(!(p<=56319))return;{const g=u.codePointAt(d+1);if(g===void 0||!(g>=56320&&g<=57343))return;l+=4,d++}}else if(p<=127)l+=1;else if(p<=2047)l+=2;else if(p<=65535)l+=3;else{if(!(p<=1114111))return;l+=4,d++}}return l})((i=r.value)==null?void 0:i.stringValue);return o===void 0?T.dr():T.newValue({integerValue:o})}case"NULL":return T.pr();default:return T.dr()}}}class Hs{constructor(e){this.expr=e}evaluate(e,t){var o,c;L(this.expr.params.length===2,39773,`${this.expr.name}() function should have exactly two parameters`);let r=!1;const s=W(this.expr.params[0]).evaluate(e,t);switch(s.type){case"STRING":break;case"NULL":r=!0;break;default:return T.dr()}const i=W(this.expr.params[1]).evaluate(e,t);switch(i.type){case"STRING":break;case"NULL":r=!0;break;default:return T.dr()}return r?T.pr():this.Fr((o=s.value)==null?void 0:o.stringValue,(c=i.value)==null?void 0:c.stringValue)}}class AP extends Hs{Fr(e,t){try{const r=(function(o){let c="";for(let u=0;u<o.length;u++){const l=o.charAt(u);switch(l){case"_":c+=".";break;case"%":c+=".*";break;case"\\":case".":case"*":case"?":case"+":case"^":case"$":case"|":case"(":case")":case"[":case"]":case"{":case"}":c+="\\"+l;break;default:c+=l}}return"^"+c+"$"})(t),s=nl.compile(r);return T.newValue({booleanValue:s.matches(e)})}catch(r){return xe(`Invalid LIKE pattern converted to regex: ${t}, returning error. Error: ${r}`),T.dr()}}}class RP extends Hs{Fr(e,t){try{const r=nl.compile(t);return T.newValue({booleanValue:r.test(e)})}catch{return xe(`Invalid regex pattern found in regex_contains: ${t}, returning error`),T.dr()}}}class PP extends Hs{Fr(e,t){try{return T.newValue({booleanValue:nl.compile(t).matches(e)})}catch{return xe(`Invalid regex pattern found in regex_match: ${t}, returning error`),T.dr()}}}class bP extends Hs{Fr(e,t){return T.newValue({booleanValue:e.includes(t)})}}class SP extends Hs{Fr(e,t){return T.newValue({booleanValue:e.startsWith(t)})}}class VP extends Hs{Fr(e,t){return T.newValue({booleanValue:e.endsWith(t)})}}class CP{constructor(e){this.expr=e}evaluate(e,t){var s,i;L(this.expr.params.length===1,29079);const r=W(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return T.newValue({stringValue:(i=(s=r.value)==null?void 0:s.stringValue)==null?void 0:i.toLowerCase()});case"NULL":return T.pr();default:return T.dr()}}}class xP{constructor(e){this.expr=e}evaluate(e,t){var s,i;L(this.expr.params.length===1,60487);const r=W(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return T.newValue({stringValue:(i=(s=r.value)==null?void 0:s.stringValue)==null?void 0:i.toUpperCase()});case"NULL":return T.pr();default:return T.dr()}}}class NP{constructor(e){this.expr=e}evaluate(e,t){var s,i;L(this.expr.params.length===1,28544);const r=W(this.expr.params[0]).evaluate(e,t);switch(r.type){case"STRING":return T.newValue({stringValue:(i=(s=r.value)==null?void 0:s.stringValue)==null?void 0:i.trim()});case"NULL":return T.pr();default:return T.dr()}}}class DP{constructor(e){this.expr=e}evaluate(e,t){const r=this.expr.params.map((o=>W(o).evaluate(e,t)));let s="",i=!1;for(const o of r)switch(o.type){case"STRING":s+=o.value.stringValue;break;case"NULL":i=!0;break;default:return T.dr()}return i?T.pr():T.newValue({stringValue:s})}}class kP{constructor(e){this.expr=e}evaluate(e,t){var o,c,u,l;L(this.expr.params.length===2,4483);const r=W(this.expr.params[0]).evaluate(e,t);switch(r.type){case"UNSET":return T.mr();case"MAP":break;default:return T.dr()}const s=W(this.expr.params[1]).evaluate(e,t);if(s.type!=="STRING")return T.dr();const i=(l=(c=(o=r.value)==null?void 0:o.mapValue)==null?void 0:c.fields)==null?void 0:l[(u=s.value)==null?void 0:u.stringValue];return i===void 0?T.mr():T.newValue(i)}}class Yl{constructor(e){this.expr=e}evaluate(e,t){var l,d;L(this.expr.params.length===2,25231,`${this.expr.name}() function should have exactly 2 params`);let r=!1;const s=W(this.expr.params[0]).evaluate(e,t);switch(s.type){case"VECTOR":break;case"NULL":r=!0;break;default:return T.dr()}const i=W(this.expr.params[1]).evaluate(e,t);switch(i.type){case"VECTOR":break;case"NULL":r=!0;break;default:return T.dr()}if(r)return T.pr();const o=bu(s.value),c=bu(i.value);if(o===void 0||c===void 0||((l=o.values)==null?void 0:l.length)!==((d=c.values)==null?void 0:d.length))return T.dr();const u=this.Or(o,c);return u===void 0||isNaN(u)?T.dr():T.newValue({doubleValue:u})}}class OP extends Yl{Or(e,t){const r=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(r.length===0)return;let i=0,o=0,c=0;for(let l=0;l<r.length;l++){if(!qn(r[l])||!qn(s[l]))return;const d=Be(r[l]),p=Be(s[l]);i+=d*p,o+=d*d,c+=p*p}const u=Math.sqrt(o)*Math.sqrt(c);if(u!==0)return 1-Math.max(-1,Math.min(1,i/u))}}class LP extends Yl{Or(e,t){const r=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(r.length===0)return 0;let i=0;for(let o=0;o<r.length;o++){if(!qn(r[o])||!qn(s[o]))return;i+=Be(r[o])*Be(s[o])}return i}}class MP extends Yl{Or(e,t){const r=(e==null?void 0:e.values)??[],s=(t==null?void 0:t.values)??[];if(r.length===0)return 0;let i=0;for(let o=0;o<r.length;o++){if(!qn(r[o])||!qn(s[o]))return;const c=Be(r[o]),u=Be(s[o]);i+=Math.pow(c-u,2)}return Math.sqrt(i)}}class FP{constructor(e){this.expr=e}evaluate(e,t){var s;L(this.expr.params.length===1,39044);const r=W(this.expr.params[0]).evaluate(e,t);switch(r.type){case"VECTOR":{const i=bu(r.value);return T.newValue({integerValue:((s=i==null?void 0:i.values)==null?void 0:s.length)??0})}case"NULL":return T.pr();default:return T.dr()}}}const Zi=BigInt(-62135596800),eo=BigInt(253402300799),Da=BigInt(1e3),Mn=BigInt(1e6),UP=Zi*Da,BP=eo*Da+BigInt(999),qP=Zi*Mn,$P=eo*Mn+BigInt(999999);function Xl(n){return n>=qP&&n<=$P}function U_(n){return n>=Zi&&n<=eo}function to(n,e){const t=BigInt(n);return!(t<Zi||t>eo)&&!(e<0||e>=1e9)&&(t!==Zi||e===0)&&!(t===eo&&e>999999999)}function B_(n,e){return e<0?{seconds:n-1,nanos:e+1e9}:{seconds:n,nanos:e}}function Zl(n){return BigInt(n.seconds)*Mn+BigInt(Math.trunc(n.nanoseconds/1e3))}class eh{constructor(e){this.expr=e}evaluate(e,t){L(this.expr.params.length===1,49262,`${this.expr.name}() function should have exactly one parameter`);const r=W(this.expr.params[0]).evaluate(e,t);switch(r.type){case"INT":return this.toTimestamp(BigInt(r.value.integerValue));case"NULL":return T.pr();default:return T.dr()}}}class jP extends eh{toTimestamp(e){if(!Xl(e))return T.dr();let t=Number(e/Mn),r=Number(e%Mn*BigInt(1e3));const s=B_(t,r);return t=s.seconds,r=s.nanos,to(t,r)?T.newValue({timestampValue:{seconds:t,nanos:r}}):T.dr()}}class zP extends eh{toTimestamp(e){if(!(function(o){return o>=UP&&o<=BP})(e))return T.dr();let t=Number(e/Da),r=Number(e%Da*BigInt(1e6));const s=B_(t,r);return t=s.seconds,r=s.nanos,to(t,r)?T.newValue({timestampValue:{seconds:t,nanos:r}}):T.dr()}}class GP extends eh{toTimestamp(e){if(!U_(e))return T.dr();const t=Number(e);return T.newValue({timestampValue:{seconds:t,nanos:0}})}}class th{constructor(e){this.expr=e}evaluate(e,t){L(this.expr.params.length===1,1265,`${this.expr.name}() function should have exactly one parameter`);const r=W(this.expr.params[0]).evaluate(e,t);switch(r.type){case"TIMESTAMP":break;case"NULL":return T.pr();default:return T.dr()}const s=Nl(r.value.timestampValue);return to(s.seconds,s.nanoseconds)?this.Mr(s):T.dr()}}class KP extends th{Mr(e){const t=Zl(e);return Xl(t)?T.newValue({integerValue:`${t.toString()}`}):T.dr()}}class WP extends th{Mr(e){const t=Zl(e),r=t/BigInt(1e3),s=t%BigInt(1e3);return r>BigInt(0)||s===BigInt(0)?T.newValue({integerValue:r.toString()}):T.newValue({integerValue:(r-BigInt(1)).toString()})}}class HP extends th{Mr(e){const t=BigInt(e.seconds);return U_(t)?T.newValue({integerValue:t.toString()}):T.dr()}}class q_{constructor(e){this.expr=e}evaluate(e,t){L(this.expr.params.length===3,2775,`${this.expr.name}() function should have exactly 3 parameters`);let r=!1;const s=W(this.expr.params[0]).evaluate(e,t);switch(s.type){case"TIMESTAMP":break;case"NULL":r=!0;break;default:return T.dr()}const i=W(this.expr.params[1]).evaluate(e,t);let o;switch(i.type){case"STRING":if(o=(function(z){switch(z){case"microsecond":return"microsecond";case"millisecond":return"millisecond";case"second":return"second";case"minute":return"minute";case"hour":return"hour";case"day":return"day";default:return}})(i.value.stringValue),o===void 0)return T.dr();break;case"NULL":r=!0;break;default:return T.dr()}const c=W(this.expr.params[2]).evaluate(e,t);switch(c.type){case"INT":break;case"NULL":r=!0;break;default:return T.dr()}if(r)return T.pr();const u=BigInt(c.value.integerValue);let l;try{switch(o){case"microsecond":l=u;break;case"millisecond":l=u*BigInt(1e3);break;case"second":l=u*BigInt(1e6);break;case"minute":l=u*BigInt(6e7);break;case"hour":l=u*BigInt(36e8);break;case"day":l=u*BigInt(864e8);break;default:return T.dr()}if(o!=="microsecond"&&u!==BigInt(0)&&l/u!==BigInt(this.Nr(o)))return T.dr()}catch($){return xe(`Error during timestamp arithmetic: ${$}`),T.dr()}const d=Nl(s.value.timestampValue);if(!to(d.seconds,d.nanoseconds))return T.dr();const p=Zl(d),g=this.Lr(p,l);if(!Xl(g))return T.dr();const w=Number(g/Mn),S=g%Mn,D=Number((S<0?S+Mn:S)*BigInt(1e3)),k=S<0?w-1:w;return to(k,D)?T.newValue({timestampValue:{seconds:k,nanos:D}}):T.dr()}Nr(e){switch(e){case"millisecond":return 1e3;case"second":return 1e6;case"minute":return 6e7;case"hour":return 36e8;case"day":return 864e8;default:return 1}}}class QP extends q_{Lr(e,t){return e+t}}class JP extends q_{Lr(e,t){return e-t}}// Copyright 2024 Google LLC* @license
class ze{constructor(e,t,r){this.serializer=e,this.stages=t,this.listenOptions=r,this.isCorePipeline=!0}getPipelineCollection(){return Ao(this)}getPipelineCollectionGroup(){return nh(this)}getPipelineCollectionId(){return $_(this)}getPipelineDocuments(){return ka(this)}getPipelineFlavor(){return(function(t){let r="exact";return t.stages.forEach(((s,i)=>{s._name!==L_.name&&s._name!==O_.name||(r="keyless"),s._name===MR.name&&r==="exact"&&(r="augmented"),s._name===k_.name&&i<t.stages.length-1&&r==="exact"&&(r="augmented")})),r})(this)}getPipelineSourceType(){return en(this)}}function en(n){const e=n.stages[0];return e instanceof wo||e instanceof To||e instanceof fc||e instanceof pc?e._name:"unknown"}function Ao(n){if(en(n)==="collection")return n.stages[0].Er}function nh(n){if(en(n)==="collection_group")return n.stages[0].collectionId}function $_(n){switch(en(n)){case"collection":return J.fromString(Ao(n)).lastSegment();case"collection_group":return nh(n);default:return}}function ka(n){if(en(n)==="documents")return n.stages[0].hr}function no(n){if((n=M_(n))instanceof jr)return`fld(${n.fieldName})`;if(n instanceof zr)return`cst(${(function(t){return t===null?"null":typeof t=="number"?t.toString():typeof t=="string"?`"${t}"`:t instanceof ae?`ref(${t.path})`:t instanceof Ye?`vec(${JSON.stringify(t)})`:JSON.stringify(t)})(n.value)})`;if(n instanceof x)return`fn(${n.name},[${n.params.map(no).join(",")}])`;if(n.expressionType==="ListOfExpressions")return`list([${n.ur.map(no).join(",")}])`;throw new Error(`Unrecognized expr ${JSON.stringify(n,null,2)}`)}function YP(n){if(n instanceof k_)return`${n._name}(${Jo(n.fields)})`;if(n instanceof O_){let e=`${n._name}(${Jo(n.accumulators)})`;return n.groups.size>0&&(e+=`grouping(${Jo(n.groups)})`),e}if(n instanceof L_)return`${n._name}(${Jo(n.groups)})`;if(n instanceof wo)return`${n._name}(${n.Er})`;if(n instanceof To)return`${n._name}(${n.collectionId})`;if(n instanceof fc)return`${n._name}()`;if(n instanceof pc)return`${n._name}(${n.hr.sort()})`;if(n instanceof Eo)return`${n._name}(${no(n.condition)})`;if(n instanceof Gn)return`${n._name}(${n.limit})`;if(n instanceof Ot)return`${n._name}(${(function(t){return t.map((r=>`${no(r.expr)}${r.direction}`)).join(",")})(n.orderings)})`;throw new Error(`Unrecognized stage ${n._name}`)}function Jo(n){return`${Array.from(n.entries()).sort().map((([e,t])=>`${e}=${no(t)}`)).join(",")}`}function tn(n){return n.stages.map((e=>YP(e))).join("|")}function j_(n,e){return tn(n)===tn(e)}function Ie(n){return n instanceof ze}function op(n){return Ie(n)?tn(n):ki(n)}function z_(n){return Ie(n)?tn(n):(function(t){return`${Va(Ge(t))}|lt:${t.limitType}`})(n)}function gc(n,e){return n instanceof ze&&e instanceof ze?j_(n,e):!(n instanceof ze&&!(e instanceof ze)||!(n instanceof ze)&&e instanceof ze)&&Fg(n,e)}function _c(n){return Ht(n)?tn(n):Va(n)}function rh(n,e){return n instanceof ze&&e instanceof ze?j_(n,e):!(n instanceof ze&&!(e instanceof ze)||!(n instanceof ze)&&e instanceof ze)&&bl(n,e)}function XP(n,e){const t=(function(s){let i=!1;const o=[];for(const c of s)if(c instanceof Ot)if(i=!0,c.orderings.some((u=>u.expr instanceof jr&&u.expr.fieldName===Dt)))o.push(c);else{const u=c.orderings.map((l=>l));u.push(ha(Dt).ascending()),o.push(new Ot(u,{}))}else c instanceof Gn&&(i||(o.push(new Ot([ha(Dt).ascending()],{})),i=!0)),o.push(c);return i||o.push(new Ot([ha(Dt).ascending()],{})),o})(n.stages);if(n.userDataReader){const r=n.userDataReader.createContext(3,"toCorePipeline");t.forEach((s=>s._readUserData(r)))}return new ze(n.userDataReader.serializer,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class sh{constructor(e,t,r,s){this.batchId=e,this.localWriteTime=t,this.baseMutations=r,this.mutations=s}applyToRemoteDocument(e,t){const r=t.mutationResults;for(let s=0;s<this.mutations.length;s++){const i=this.mutations[s];i.key.isEqual(e.key)&&uA(i,e,r[s])}}applyToLocalView(e,t){for(const r of this.baseMutations)r.key.isEqual(e.key)&&(t=Di(r,e,t,this.localWriteTime));for(const r of this.mutations)r.key.isEqual(e.key)&&(t=Di(r,e,t,this.localWriteTime));return t}applyToLocalDocumentSet(e,t){const r=jg();return this.mutations.forEach((s=>{const i=e.get(s.key),o=i.overlayedDocument;let c=this.applyToLocalView(o,i.mutatedFields);c=t.has(s.key)?null:c;const u=vg(o,c);u!==null&&r.set(s.key,u),o.isValidDocument()||o.convertToNoDocument(j.min())})),r}keys(){return this.mutations.reduce(((e,t)=>e.add(t.key)),Q())}isEqual(e){return this.batchId===e.batchId&&ps(this.mutations,e.mutations,((t,r)=>Lf(t,r)))&&ps(this.baseMutations,e.baseMutations,((t,r)=>Lf(t,r)))}}class ih{constructor(e,t,r,s){this.batch=e,this.commitVersion=t,this.mutationResults=r,this.docVersions=s}static from(e,t,r){L(e.mutations.length===r.length,58842,{Br:e.mutations.length,Ur:r.length});let s=(function(){return SA})();const i=e.mutations;for(let o=0;o<i.length;o++)s=s.insert(i[o].key,r[o].version);return new ih(e,t,r,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Oa="";function Ke(n){let e="";for(let t=0;t<n.length;t++)e.length>0&&(e=ap(e)),e=ZP(n.get(t),e);return ap(e)}function ZP(n,e){let t=e;const r=n.length;for(let s=0;s<r;s++){const i=n.charAt(s);switch(i){case"\0":t+="";break;case Oa:t+="";break;default:t+=i}}return t}function ap(n){return n+Oa+""}function Lt(n){const e=n.length;if(L(e>=2,64408,{path:n}),e===2)return L(n.charAt(0)===Oa&&n.charAt(1)==="",56145,{path:n}),J.emptyPath();const t=e-2,r=[];let s="";for(let i=0;i<e;){const o=n.indexOf(Oa,i);switch((o<0||o>t)&&q(50515,{path:n}),n.charAt(o+1)){case"":const c=n.substring(i,o);let u;s.length===0?u=c:(s+=c,u=s,s=""),r.push(u);break;case"":s+=n.substring(i,o),s+="\0";break;case"":s+=n.substring(i,o+1);break;default:q(61167,{path:n})}i=o+2}return new J(r)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const lr="remoteDocuments",Ro="owner",Jr="owner",ro="mutationQueues",eb="userId",wt="mutations",cp="batchId",yr="userMutationsIndex",up=["userId","batchId"];/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function da(n,e){return[n,Ke(e)]}function G_(n,e,t){return[n,Ke(e),t]}const tb={},bs="documentMutations",La="remoteDocumentsV14",nb=["prefixPath","collectionGroup","readTime","documentId"],fa="documentKeyIndex",rb=["prefixPath","collectionGroup","documentId"],K_="collectionGroupIndex",sb=["collectionGroup","readTime","prefixPath","documentId"],so="remoteDocumentGlobal",Uu="remoteDocumentGlobalKey",Ss="targets",W_="queryTargetsIndex",ib=["canonicalId","targetId"],Vs="targetDocuments",ob=["targetId","path"],oh="documentTargetsIndex",ab=["path","targetId"],Ma="targetGlobalKey",Er="targetGlobal",io="collectionParents",cb=["collectionId","parent"],Cs="clientMetadata",ub="clientId",yc="bundles",lb="bundleId",Ic="namedQueries",hb="name",ah="indexConfiguration",db="indexId",Bu="collectionGroupIndex",fb="collectionGroup",Bi="indexState",pb=["indexId","uid"],H_="sequenceNumberIndex",mb=["uid","sequenceNumber"],qi="indexEntries",gb=["indexId","uid","arrayValue","directionalValue","orderedDocumentKey","documentKey"],Q_="documentKeyIndex",_b=["indexId","uid","orderedDocumentKey"],wc="documentOverlays",yb=["userId","collectionPath","documentId"],qu="collectionPathOverlayIndex",Ib=["userId","collectionPath","largestBatchId"],J_="collectionGroupOverlayIndex",wb=["userId","collectionGroup","largestBatchId"],ch="globals",Tb="name",Y_=[ro,wt,bs,lr,Ss,Ro,Er,Vs,Cs,so,io,yc,Ic],Eb=[...Y_,wc],X_=[ro,wt,bs,La,Ss,Ro,Er,Vs,Cs,so,io,yc,Ic,wc],Z_=X_,uh=[...Z_,ah,Bi,qi],vb=uh,ey=[...uh,ch],Ab=ey;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ty(n,e,t){const r=n.store(wt),s=n.store(bs),i=[],o=IDBKeyRange.only(t.batchId);let c=0;const u=r.jn({range:o},((d,p,g)=>(c++,g.delete())));i.push(u.next((()=>{L(c===1,47070,{batchId:t.batchId})})));const l=[];for(const d of t.mutations){const p=G_(e,d.key.path,t.batchId);i.push(s.delete(p)),l.push(d.key)}return R.waitFor(i).next((()=>l))}function Fa(n){if(!n)return 0;let e;if(n.document)e=n.document;else if(n.unknownDocument)e=n.unknownDocument;else{if(!n.noDocument)throw q(14731);e=n.noDocument}return JSON.stringify(e).length}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $u extends p_{constructor(e,t){super(),this.kr=e,this.currentSequenceNumber=t}}function De(n,e){const t=U(n);return qt.xn(t.kr,e)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class lh{constructor(e,t){this.largestBatchId=e,this.mutation=t}getKey(){return this.mutation.key}isEqual(e){return e!==null&&this.mutation===e.mutation}toString(){return`Overlay{
      largestBatchId: ${this.largestBatchId},
      mutation: ${this.mutation.toString()}
    }`}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mt{constructor(e,t,r,s,i=j.min(),o=j.min(),c=pe.EMPTY_BYTE_STRING,u=null){this.target=e,this.targetId=t,this.purpose=r,this.sequenceNumber=s,this.snapshotVersion=i,this.lastLimboFreeSnapshotVersion=o,this.resumeToken=c,this.expectedCount=u}withSequenceNumber(e){return new Mt(this.target,this.targetId,this.purpose,e,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,this.expectedCount)}withResumeToken(e,t){return new Mt(this.target,this.targetId,this.purpose,this.sequenceNumber,t,this.lastLimboFreeSnapshotVersion,e,null)}withExpectedCount(e){return new Mt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,this.lastLimboFreeSnapshotVersion,this.resumeToken,e)}withLastLimboFreeSnapshotVersion(e){return new Mt(this.target,this.targetId,this.purpose,this.sequenceNumber,this.snapshotVersion,e,this.resumeToken,this.expectedCount)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ny{constructor(e){this.qr=e}}function Rb(n,e){let t;if(e.document)t=cc(n.qr,e.document,!!e.hasCommittedMutations);else if(e.noDocument){const r=M.fromSegments(e.noDocument.path),s=Nr(e.noDocument.readTime);t=ge.newNoDocument(r,s),e.hasCommittedMutations&&t.setHasCommittedMutations()}else{if(!e.unknownDocument)return q(56709);{const r=M.fromSegments(e.unknownDocument.path),s=Nr(e.unknownDocument.version);t=ge.newUnknownDocument(r,s)}}return e.readTime&&t.setReadTime((function(s){const i=new oe(s[0],s[1]);return j.fromTimestamp(i)})(e.readTime)),t}function lp(n,e){const t=e.key,r={prefixPath:t.getCollectionPath().popLast().toArray(),collectionGroup:t.collectionGroup,documentId:t.path.lastSegment(),readTime:Ua(e.readTime),hasCommittedMutations:e.hasCommittedMutations};if(e.isFoundDocument())r.document=(function(i,o){return{name:Ps(i,o.key),fields:o.data.value.mapValue.fields,updateTime:Rs(i,o.version.toTimestamp()),createTime:Rs(i,o.createTime.toTimestamp())}})(n.qr,e);else if(e.isNoDocument())r.noDocument={path:t.path.toArray(),readTime:xr(e.version)};else{if(!e.isUnknownDocument())return q(57904,{document:e});r.unknownDocument={path:t.path.toArray(),version:xr(e.version)}}return r}function Ua(n){const e=n.toTimestamp();return[e.seconds,e.nanoseconds]}function xr(n){const e=n.toTimestamp();return{seconds:e.seconds,nanoseconds:e.nanoseconds}}function Nr(n){const e=new oe(n.seconds,n.nanoseconds);return j.fromTimestamp(e)}function fr(n,e){const t=(e.baseMutations||[]).map((i=>Lu(n.qr,i)));for(let i=0;i<e.mutations.length-1;++i){const o=e.mutations[i];if(i+1<e.mutations.length&&e.mutations[i+1].transform!==void 0){const c=e.mutations[i+1];o.updateTransforms=c.transform.fieldTransforms,e.mutations.splice(i+1,1),++i}}const r=e.mutations.map((i=>Lu(n.qr,i))),s=oe.fromMillis(e.localWriteTimeMs);return new sh(e.batchId,s,t,r)}function Ci(n,e){const t=Nr(e.readTime),r=e.lastLimboFreeSnapshotVersion!==void 0?Nr(e.lastLimboFreeSnapshotVersion):j.min();let s;return s=(function(o){return o.structuredPipeline!==void 0})(e.query)?(function(o,c){var d,p;const u=o.structuredPipeline;L((((d=u==null?void 0:u.pipeline)==null?void 0:d.stages)??[]).length>0,1845);const l=(p=u==null?void 0:u.pipeline)==null?void 0:p.stages.map(Pb);return new ze(c,l)})(e.query,n.qr):(function(o){return o.documents!==void 0})(e.query)?(function(o){const c=o.documents.length;return L(c===1,1966,{count:c}),Ge(Gs(Jg(o.documents[0])))})(e.query):(function(o){return Ge(e_(o))})(e.query),new Mt(s,e.targetId,"TargetPurposeListen",e.lastListenSequenceNumber,t,r,pe.fromBase64String(e.resumeToken))}function ry(n,e){const t=xr(e.snapshotVersion),r=xr(e.lastLimboFreeSnapshotVersion);let s;s=Ht(e.target)?t_(n.qr,e.target):Sl(e.target)?Xg(n.qr,e.target):uc(n.qr,e.target).be;const i=e.resumeToken.toBase64();return{targetId:e.targetId,canonicalId:_c(e.target),readTime:t,resumeToken:i,lastListenSequenceNumber:e.sequenceNumber,lastLimboFreeSnapshotVersion:r,query:s}}function Tc(n){const e=e_({parent:n.parent,structuredQuery:n.structuredQuery});return n.limitType==="LAST"?xa(e,e.limit,"L"):e}function Yo(n,e){return new lh(e.largestBatchId,Lu(n.qr,e.overlayMutation))}function hp(n,e){const t=e.path.lastSegment();return[n,Ke(e.path.popLast()),t]}function dp(n,e,t,r){return{indexId:n,uid:e,sequenceNumber:t,readTime:xr(r.readTime),documentKey:Ke(r.documentKey.path),largestBatchId:r.largestBatchId}}function Pb(n){switch(n.name){case"collection":return new wo(n.args[0].referenceValue,{});case"collection_group":return new To(n.args[1].stringValue,{});case"database":return new fc({});case"documents":return new pc(n.args.map((e=>e.referenceValue)),{});case"where":return new Eo(ju(n.args[0]),{});case"limit":{const e=n.args[0].integerValue??n.args[0].doubleValue;return new Gn(typeof e=="number"?e:Number(e),{})}case"sort":return new Ot(n.args.map((e=>(function(r){var i,o;const s=(i=r.mapValue)==null?void 0:i.fields;return new Hl(ju(s.expression),(o=s.direction)==null?void 0:o.stringValue,"orderingFromProto")})(e))),{});default:throw new Error(`Stage type: ${n.name} not supported.`)}}function ju(n){return n.fieldReferenceValue?new jr(Pt("_exprFromProto",n.fieldReferenceValue),"_exprFromProto"):n.functionValue?(function(t){var r;return new x(t.functionValue.name,((r=t.functionValue.args)==null?void 0:r.map(ju))||[])})(n):zr._fromProto(n)}class Ec{constructor(e,t,r,s){this.userId=e,this.serializer=t,this.indexManager=r,this.referenceDelegate=s,this.$r={}}static Kr(e,t,r,s){L(e.uid!=="",64387);const i=e.isAuthenticated()?e.uid:"";return new Ec(i,t,r,s)}checkEmpty(e){let t=!0;const r=IDBKeyRange.bound([this.userId,Number.NEGATIVE_INFINITY],[this.userId,Number.POSITIVE_INFINITY]);return En(e).jn({index:yr,range:r},((s,i,o)=>{t=!1,o.done()})).next((()=>t))}addMutationBatch(e,t,r,s){const i=is(e),o=En(e);return o.add({}).next((c=>{L(typeof c=="number",49019);const u=new sh(c,t,r,s),l=(function(w,S,D){const k=D.baseMutations.map((z=>Ji(w.qr,z))),$=D.mutations.map((z=>Ji(w.qr,z)));return{userId:S,batchId:D.batchId,localWriteTimeMs:D.localWriteTime.toMillis(),baseMutations:k,mutations:$}})(this.serializer,this.userId,u),d=[];let p=new ce(((g,w)=>H(g.canonicalString(),w.canonicalString())));for(const g of s){const w=G_(this.userId,g.key.path,c);p=p.add(g.key.path.popLast()),d.push(o.put(l)),d.push(i.put(w,tb))}return p.forEach((g=>{d.push(this.indexManager.addToCollectionParentIndex(e,g))})),e.addOnCommittedListener((()=>{this.$r[c]=u.keys()})),R.waitFor(d).next((()=>u))}))}lookupMutationBatch(e,t){return En(e).get(t).next((r=>r?(L(r.userId===this.userId,48,"Unexpected user for mutation batch",{userId:r.userId,batchId:t}),fr(this.serializer,r)):null))}Wr(e,t){return this.$r[t]?R.resolve(this.$r[t]):this.lookupMutationBatch(e,t).next((r=>{if(r){const s=r.keys();return this.$r[t]=s,s}return null}))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,s=IDBKeyRange.lowerBound([this.userId,r]);let i=null;return En(e).jn({index:yr,range:s},((o,c,u)=>{c.userId===this.userId&&(L(c.batchId>=r,47524,{Qr:r}),i=fr(this.serializer,c)),u.done()})).next((()=>i))}getHighestUnacknowledgedBatchId(e){const t=IDBKeyRange.upperBound([this.userId,Number.POSITIVE_INFINITY]);let r=Ln;return En(e).jn({index:yr,range:t,reverse:!0},((s,i,o)=>{r=i.batchId,o.done()})).next((()=>r))}getAllMutationBatches(e){const t=IDBKeyRange.bound([this.userId,Ln],[this.userId,Number.POSITIVE_INFINITY]);return En(e).Kn(yr,t).next((r=>r.map((s=>fr(this.serializer,s)))))}getAllMutationBatchesAffectingDocumentKey(e,t){const r=da(this.userId,t.path),s=IDBKeyRange.lowerBound(r),i=[];return is(e).jn({range:s},((o,c,u)=>{const[l,d,p]=o,g=Lt(d);if(l===this.userId&&t.path.isEqual(g))return En(e).get(p).next((w=>{if(!w)throw q(61480,{Gr:o,batchId:p});L(w.userId===this.userId,10503,"Unexpected user for mutation batch",{userId:w.userId,batchId:p}),i.push(fr(this.serializer,w))}));u.done()})).next((()=>i))}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new ce(H);const s=[];return t.forEach((i=>{const o=da(this.userId,i.path),c=IDBKeyRange.lowerBound(o),u=is(e).jn({range:c},((l,d,p)=>{const[g,w,S]=l,D=Lt(w);g===this.userId&&i.path.isEqual(D)?r=r.add(S):p.done()}));s.push(u)})),R.waitFor(s).next((()=>this.zr(e,r)))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,s=r.length+1,i=da(this.userId,r),o=IDBKeyRange.lowerBound(i);let c=new ce(H);return is(e).jn({range:o},((u,l,d)=>{const[p,g,w]=u,S=Lt(g);p===this.userId&&r.isPrefixOf(S)?S.length===s&&(c=c.add(w)):d.done()})).next((()=>this.zr(e,c)))}zr(e,t){const r=[],s=[];return t.forEach((i=>{s.push(En(e).get(i).next((o=>{if(o===null)throw q(35274,{batchId:i});L(o.userId===this.userId,9748,"Unexpected user for mutation batch",{userId:o.userId,batchId:i}),r.push(fr(this.serializer,o))})))})),R.waitFor(s).next((()=>r))}removeMutationBatch(e,t){return ty(e.kr,this.userId,t).next((r=>(e.addOnCommittedListener((()=>{this.jr(t.batchId)})),R.forEach(r,(s=>this.referenceDelegate.markPotentiallyOrphaned(e,s))))))}jr(e){delete this.$r[e]}performConsistencyCheck(e){return this.checkEmpty(e).next((t=>{if(!t)return R.resolve();const r=IDBKeyRange.lowerBound((function(o){return[o]})(this.userId)),s=[];return is(e).jn({range:r},((i,o,c)=>{if(i[0]===this.userId){const u=Lt(i[1]);s.push(u)}else c.done()})).next((()=>{L(s.length===0,56720,{Hr:s.map((i=>i.canonicalString()))})}))}))}containsKey(e,t){return sy(e,this.userId,t)}Jr(e){return iy(e).get(this.userId).next((t=>t||{userId:this.userId,lastAcknowledgedBatchId:Ln,lastStreamToken:""}))}}function sy(n,e,t){const r=da(e,t.path),s=r[1],i=IDBKeyRange.lowerBound(r);let o=!1;return is(n).jn({range:i,zn:!0},((c,u,l)=>{const[d,p,g]=c;d===e&&p===s&&(o=!0),l.done()})).next((()=>o))}function En(n){return De(n,wt)}function is(n){return De(n,bs)}function iy(n){return De(n,ro)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bb{getBundleMetadata(e,t){return fp(e).get(t).next((r=>{if(r)return(function(i){return{id:i.bundleId,createTime:Nr(i.createTime),version:i.version}})(r)}))}saveBundleMetadata(e,t){return fp(e).put((function(s){return{bundleId:s.id,createTime:xr(ve(s.createTime)),version:s.version}})(t))}getNamedQuery(e,t){return pp(e).get(t).next((r=>{if(r)return(function(i){return{name:i.name,query:Tc(i.bundledQuery),readTime:Nr(i.readTime)}})(r)}))}saveNamedQuery(e,t){return pp(e).put((function(s){return{name:s.name,readTime:xr(ve(s.readTime)),bundledQuery:s.bundledQuery}})(t))}}function fp(n){return De(n,yc)}function pp(n){return De(n,Ic)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vc{constructor(e,t){this.serializer=e,this.userId=t}static Kr(e,t){const r=t.uid||"";return new vc(e,r)}getOverlay(e,t){return Yr(e).get(hp(this.userId,t)).next((r=>r?Yo(this.serializer,r):null))}getOverlays(e,t){const r=mt();return R.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&r.set(s,i)})))).next((()=>r))}getAllOverlays(e,t){const r=mt();return Yr(e).jn(((s,i)=>{const o=Yo(this.serializer,i);o.largestBatchId>t&&r.set(o.getKey(),o)})).next((()=>r))}saveOverlays(e,t,r){const s=[];return r.forEach(((i,o)=>{const c=new lh(t,o);s.push(this.Yr(e,c))})),R.waitFor(s)}removeOverlaysForBatchId(e,t,r){const s=new Set;t.forEach((o=>s.add(Ke(o.getCollectionPath()))));const i=[];return s.forEach((o=>{const c=IDBKeyRange.bound([this.userId,o,r],[this.userId,o,r+1],!1,!0);i.push(Yr(e).Gn(qu,c))})),R.waitFor(i)}getOverlaysForCollection(e,t,r){const s=mt(),i=Ke(t),o=IDBKeyRange.bound([this.userId,i,r],[this.userId,i,Number.POSITIVE_INFINITY],!0);return Yr(e).Kn(qu,o).next((c=>{for(const u of c){const l=Yo(this.serializer,u);s.set(l.getKey(),l)}return s}))}getOverlaysForCollectionGroup(e,t,r,s){const i=mt();let o;const c=IDBKeyRange.bound([this.userId,t,r],[this.userId,t,Number.POSITIVE_INFINITY],!0);return Yr(e).jn({index:J_,range:c},((u,l,d)=>{const p=Yo(this.serializer,l);i.size()<s||p.largestBatchId===o?(i.set(p.getKey(),p),o=p.largestBatchId):d.done()})).next((()=>i))}Yr(e,t){return Yr(e).put((function(s,i,o){const[c,u,l]=hp(i,o.mutation.key);return{userId:i,collectionPath:u,documentId:l,collectionGroup:o.mutation.key.getCollectionGroup(),largestBatchId:o.largestBatchId,overlayMutation:Ji(s.qr,o.mutation)}})(this.serializer,this.userId,t))}}function Yr(n){return De(n,wc)}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Sb{Zr(e){return De(e,ch)}getSessionToken(e){return this.Zr(e).get("sessionToken").next((t=>{const r=t==null?void 0:t.value;return r?pe.fromUint8Array(r):pe.EMPTY_BYTE_STRING}))}setSessionToken(e,t){return this.Zr(e).put({name:"sessionToken",value:t.toUint8Array()})}}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class pr{constructor(){}Xr(e,t){this.ei(e,t),t.ti()}ei(e,t){if("nullValue"in e)this.ni(t,5);else if("booleanValue"in e)this.ni(t,10),t.ri(e.booleanValue?1:0);else if("integerValue"in e)this.ni(t,15),t.ri(fe(e.integerValue));else if("doubleValue"in e){const r=fe(e.doubleValue);isNaN(r)?this.ni(t,13):(this.ni(t,15),gs(r)?t.ri(0):t.ri(r))}else if("timestampValue"in e){let r=e.timestampValue;this.ni(t,20),typeof r=="string"&&(r=sn(r)),t.ii(`${r.seconds||""}`),t.ri(r.nanos||0)}else if("stringValue"in e)this.si(e.stringValue,t),this._i(t);else if("bytesValue"in e)this.ni(t,30),t.oi(on(e.bytesValue)),this._i(t);else if("referenceValue"in e)this.ai(e.referenceValue,t);else if("geoPointValue"in e){const r=e.geoPointValue;this.ni(t,45),t.ri(r.latitude||0),t.ri(r.longitude||0)}else"mapValue"in e?gg(e)?this.ni(t,Number.MAX_SAFE_INTEGER):br(e)?this.ui(e.mapValue,t):(this.ci(e.mapValue,t),this._i(t)):"arrayValue"in e?(this.li(e.arrayValue,t),this._i(t)):q(19022,{Ei:e})}si(e,t){this.ni(t,25),this.hi(e,t)}hi(e,t){t.ii(e)}ci(e,t){const r=e.fields||{};this.ni(t,55);for(const s of Object.keys(r))this.si(s,t),this.ei(r[s],t)}ui(e,t){var o,c;const r=e.fields||{};this.ni(t,53);const s=Rr,i=((c=(o=r[s].arrayValue)==null?void 0:o.values)==null?void 0:c.length)||0;this.ni(t,15),t.ri(fe(i)),this.si(s,t),this.ei(r[s],t)}li(e,t){const r=e.values||[];this.ni(t,50);for(const s of r)this.ei(s,t)}ai(e,t){this.ni(t,37),M.fromName(e).path.forEach((r=>{this.ni(t,60),this.hi(r,t)}))}ni(e,t){e.ri(t)}_i(e){e.ri(2)}}pr.Ti=new pr;/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law | agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES | CONDITIONS OF ANY KIND, either express | implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xr=255;function Vb(n){if(n===0)return 8;let e=0;return n>>4||(e+=4,n<<=4),n>>6||(e+=2,n<<=2),n>>7||(e+=1),e}function mp(n){const e=64-(function(r){let s=0;for(let i=0;i<8;++i){const o=Vb(255&r[i]);if(s+=o,o!==8)break}return s})(n);return Math.ceil(e/8)}class Cb{constructor(){this.buffer=new Uint8Array(1024),this.position=0}Pi(e){const t=e[Symbol.iterator]();let r=t.next();for(;!r.done;)this.Ri(r.value),r=t.next();this.Ii()}Ai(e){const t=e[Symbol.iterator]();let r=t.next();for(;!r.done;)this.Vi(r.value),r=t.next();this.di()}fi(e){for(const t of e){const r=t.charCodeAt(0);if(r<128)this.Ri(r);else if(r<2048)this.Ri(960|r>>>6),this.Ri(128|63&r);else if(t<"\uD800"||"\uDBFF"<t)this.Ri(480|r>>>12),this.Ri(128|63&r>>>6),this.Ri(128|63&r);else{const s=t.codePointAt(0);this.Ri(240|s>>>18),this.Ri(128|63&s>>>12),this.Ri(128|63&s>>>6),this.Ri(128|63&s)}}this.Ii()}mi(e){for(const t of e){const r=t.charCodeAt(0);if(r<128)this.Vi(r);else if(r<2048)this.Vi(960|r>>>6),this.Vi(128|63&r);else if(t<"\uD800"||"\uDBFF"<t)this.Vi(480|r>>>12),this.Vi(128|63&r>>>6),this.Vi(128|63&r);else{const s=t.codePointAt(0);this.Vi(240|s>>>18),this.Vi(128|63&s>>>12),this.Vi(128|63&s>>>6),this.Vi(128|63&s)}}this.di()}pi(e){const t=this.gi(e),r=mp(t);this.yi(1+r),this.buffer[this.position++]=255&r;for(let s=t.length-r;s<t.length;++s)this.buffer[this.position++]=255&t[s]}wi(e){const t=this.gi(e),r=mp(t);this.yi(1+r),this.buffer[this.position++]=~(255&r);for(let s=t.length-r;s<t.length;++s)this.buffer[this.position++]=~(255&t[s])}bi(){this.Si(Xr),this.Si(255)}Di(){this.xi(Xr),this.xi(255)}reset(){this.position=0}seed(e){this.yi(e.length),this.buffer.set(e,this.position),this.position+=e.length}Ci(){return this.buffer.slice(0,this.position)}gi(e){const t=(function(i){const o=new DataView(new ArrayBuffer(8));return o.setFloat64(0,i,!1),new Uint8Array(o.buffer)})(e),r=!!(128&t[0]);t[0]^=r?255:128;for(let s=1;s<t.length;++s)t[s]^=r?255:0;return t}Ri(e){const t=255&e;t===0?(this.Si(0),this.Si(255)):t===Xr?(this.Si(Xr),this.Si(0)):this.Si(t)}Vi(e){const t=255&e;t===0?(this.xi(0),this.xi(255)):t===Xr?(this.xi(Xr),this.xi(0)):this.xi(e)}Ii(){this.Si(0),this.Si(1)}di(){this.xi(0),this.xi(1)}Si(e){this.yi(1),this.buffer[this.position++]=e}xi(e){this.yi(1),this.buffer[this.position++]=~e}yi(e){const t=e+this.position;if(t<=this.buffer.length)return;let r=2*this.buffer.length;r<t&&(r=t);const s=new Uint8Array(r);s.set(this.buffer),this.buffer=s}}class xb{constructor(e){this.Fi=e}oi(e){this.Fi.Pi(e)}ii(e){this.Fi.fi(e)}ri(e){this.Fi.pi(e)}ti(){this.Fi.bi()}}class Nb{constructor(e){this.Fi=e}oi(e){this.Fi.Ai(e)}ii(e){this.Fi.mi(e)}ri(e){this.Fi.wi(e)}ti(){this.Fi.Di()}}class Ti{constructor(){this.Fi=new Cb,this.ascending=new xb(this.Fi),this.descending=new Nb(this.Fi)}seed(e){this.Fi.seed(e)}Oi(e){return e===0?this.ascending:this.descending}Ci(){return this.Fi.Ci()}reset(){this.Fi.reset()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class mr{constructor(e,t,r,s){this.Mi=e,this.Ni=t,this.Li=r,this.Bi=s}Ui(){const e=this.Bi.length,t=e===0||this.Bi[e-1]===255?e+1:e,r=new Uint8Array(t);return r.set(this.Bi,0),t!==e?r.set([0],this.Bi.length):++r[r.length-1],new mr(this.Mi,this.Ni,this.Li,r)}ki(e,t,r){return{indexId:this.Mi,uid:e,arrayValue:pa(this.Li),directionalValue:pa(this.Bi),orderedDocumentKey:pa(t),documentKey:r.path.toArray()}}qi(e,t,r){const s=this.ki(e,t,r);return[s.indexId,s.uid,s.arrayValue,s.directionalValue,s.orderedDocumentKey,s.documentKey]}}function vn(n,e){let t=n.Mi-e.Mi;return t!==0?t:(t=gp(n.Li,e.Li),t!==0?t:(t=gp(n.Bi,e.Bi),t!==0?t:M.comparator(n.Ni,e.Ni)))}function gp(n,e){for(let t=0;t<n.length&&t<e.length;++t){const r=n[t]-e[t];if(r!==0)return r}return n.length-e.length}function pa(n){return dm()?(function(t){let r="";for(let s=0;s<t.length;s++)r+=String.fromCharCode(t[s]);return r})(n):n}function _p(n){return typeof n!="string"?n:(function(t){const r=new Uint8Array(t.length);for(let s=0;s<t.length;s++)r[s]=t.charCodeAt(s);return r})(n)}class yp{constructor(e){this.$i=new ce(((t,r)=>Ee.comparator(t.field,r.field))),this.collectionId=e.collectionGroup!=null?e.collectionGroup:e.path.lastSegment(),this.Ki=e.orderBy,this.Wi=[];for(const t of e.filters){const r=t;r.isInequality()?this.$i=this.$i.add(r):this.Wi.push(r)}}get Qi(){return this.$i.size>1}Gi(e){if(L(e.collectionGroup===this.collectionId,49279),this.Qi)return!1;const t=Cu(e);if(t!==void 0&&!this.zi(t))return!1;const r=ur(e);let s=new Set,i=0,o=0;for(;i<r.length&&this.zi(r[i]);++i)s=s.add(r[i].fieldPath.canonicalString());if(i===r.length)return!0;if(this.$i.size>0){const c=this.$i.getIterator().getNext();if(!s.has(c.field.canonicalString())){const u=r[i];if(!this.ji(c,u)||!this.Hi(this.Ki[o++],u))return!1}++i}for(;i<r.length;++i){const c=r[i];if(o>=this.Ki.length||!this.Hi(this.Ki[o++],c))return!1}return!0}Ji(){if(this.Qi)return null;let e=new ce(Ee.comparator);const t=[];for(const r of this.Wi)if(!r.field.isKeyField())if(r.op==="array-contains"||r.op==="array-contains-any")t.push(new Tr(r.field,2));else{if(e.has(r.field))continue;e=e.add(r.field),t.push(new Tr(r.field,0))}for(const r of this.Ki)r.field.isKeyField()||e.has(r.field)||(e=e.add(r.field),t.push(new Tr(r.field,r.dir==="asc"?0:1)));return new vs(vs.UNKNOWN_ID,this.collectionId,t,As.empty())}zi(e){for(const t of this.Wi)if(this.ji(t,e))return!0;return!1}ji(e,t){if(e===void 0||!e.field.isEqual(t.fieldPath))return!1;const r=e.op==="array-contains"||e.op==="array-contains-any";return t.kind===2===r}Hi(e,t){return!!e.field.isEqual(t.fieldPath)&&(t.kind===0&&e.dir==="asc"||t.kind===1&&e.dir==="desc")}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function oy(n){var t,r;if(L(n instanceof ee||n instanceof ue,20012),n instanceof ee){if(n instanceof Ng){const s=((r=(t=n.value.arrayValue)==null?void 0:t.values)==null?void 0:r.map((i=>ee.create(n.field,"==",i))))||[];return ue.create(s,"or")}return n}const e=n.filters.map((s=>oy(s)));return ue.create(e,n.op)}function Db(n){if(n.getFilters().length===0)return[];const e=Ku(oy(n));return L(ay(e),7391),zu(e)||Gu(e)?[e]:e.getFilters()}function zu(n){return n instanceof ee}function Gu(n){return n instanceof ue&&Rl(n)}function ay(n){return zu(n)||Gu(n)||(function(t){if(t instanceof ue&&Su(t)){for(const r of t.getFilters())if(!zu(r)&&!Gu(r))return!1;return!0}return!1})(n)}function Ku(n){if(L(n instanceof ee||n instanceof ue,34018),n instanceof ee)return n;if(n.filters.length===1)return Ku(n.filters[0]);const e=n.filters.map((r=>Ku(r)));let t=ue.create(e,n.op);return t=Ba(t),ay(t)?t:(L(t instanceof ue,64498),L(Ts(t),40251),L(t.filters.length>1,57927),t.filters.reduce(((r,s)=>hh(r,s))))}function hh(n,e){let t;return L(n instanceof ee||n instanceof ue,38388),L(e instanceof ee||e instanceof ue,25473),t=n instanceof ee?e instanceof ee?(function(s,i){return ue.create([s,i],"and")})(n,e):Ip(n,e):e instanceof ee?Ip(e,n):(function(s,i){if(L(s.filters.length>0&&i.filters.length>0,48005),Ts(s)&&Ts(i))return Vg(s,i.getFilters());const o=Su(s)?s:i,c=Su(s)?i:s,u=o.filters.map((l=>hh(l,c)));return ue.create(u,"or")})(n,e),Ba(t)}function Ip(n,e){if(Ts(e))return Vg(e,n.getFilters());{const t=e.filters.map((r=>hh(n,r)));return ue.create(t,"or")}}function Ba(n){if(L(n instanceof ee||n instanceof ue,11850),n instanceof ee)return n;const e=n.getFilters();if(e.length===1)return Ba(e[0]);if(bg(n))return n;const t=e.map((s=>Ba(s))),r=[];return t.forEach((s=>{s instanceof ee?r.push(s):s instanceof ue&&(s.op===n.op?r.push(...s.filters):r.push(s))})),r.length===1?r[0]:ue.create(r,n.op)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kb{constructor(){this.Yi=new dh}addToCollectionParentIndex(e,t){return this.Yi.add(t),R.resolve()}getCollectionParents(e,t){return R.resolve(this.Yi.getEntries(t))}addFieldIndex(e,t){return R.resolve()}deleteFieldIndex(e,t){return R.resolve()}deleteAllFieldIndexes(e){return R.resolve()}createTargetIndexes(e,t){return R.resolve()}getDocumentsMatchingTarget(e,t){return R.resolve(null)}getIndexType(e,t){return R.resolve(0)}getFieldIndexes(e,t){return R.resolve([])}getNextCollectionGroupToUpdate(e){return R.resolve(null)}getMinOffset(e,t){return R.resolve(ft.min())}getMinOffsetFromCollectionGroup(e,t){return R.resolve(ft.min())}updateCollectionGroup(e,t,r){return R.resolve()}updateIndexEntries(e,t){return R.resolve()}}class dh{constructor(){this.index={}}add(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t]||new ce(J.comparator),i=!s.has(r);return this.index[t]=s.add(r),i}has(e){const t=e.lastSegment(),r=e.popLast(),s=this.index[t];return s&&s.has(r)}getEntries(e){return(this.index[e]||new ce(J.comparator)).toArray()}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const wp="IndexedDbIndexManager",Xo=new Uint8Array(0);class Ob{constructor(e,t){this.databaseId=t,this.Zi=new dh,this.Xi=new fn((r=>Va(r)),((r,s)=>bl(r,s))),this.uid=e.uid||""}addToCollectionParentIndex(e,t){if(!this.Zi.has(t)){const r=t.lastSegment(),s=t.popLast();e.addOnCommittedListener((()=>{this.Zi.add(t)}));const i={collectionId:r,parent:Ke(s)};return Tp(e).put(i)}return R.resolve()}getCollectionParents(e,t){const r=[],s=IDBKeyRange.bound([t,""],[ig(t),""],!1,!0);return Tp(e).Kn(s).next((i=>{for(const o of i){if(o.collectionId!==t)break;r.push(Lt(o.parent))}return r}))}addFieldIndex(e,t){const r=Ei(e),s=(function(c){return{indexId:c.indexId,collectionGroup:c.collectionGroup,fields:c.fields.map((u=>[u.fieldPath.canonicalString(),u.kind]))}})(t);delete s.indexId;const i=r.add(s);if(t.indexState){const o=es(e);return i.next((c=>{o.put(dp(c,this.uid,t.indexState.sequenceNumber,t.indexState.offset))}))}return i.next()}deleteFieldIndex(e,t){const r=Ei(e),s=es(e),i=Zr(e);return r.delete(t.indexId).next((()=>s.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0)))).next((()=>i.delete(IDBKeyRange.bound([t.indexId],[t.indexId+1],!1,!0))))}deleteAllFieldIndexes(e){const t=Ei(e),r=Zr(e),s=es(e);return t.Gn().next((()=>r.Gn())).next((()=>s.Gn()))}createTargetIndexes(e,t){return R.forEach(this.es(t),(r=>this.getIndexType(e,r).next((s=>{if(s===0||s===1){const i=new yp(r).Ji();if(i!=null)return this.addFieldIndex(e,i)}}))))}getDocumentsMatchingTarget(e,t){const r=Zr(e);let s=!0;const i=new Map;return R.forEach(this.es(t),(o=>this.ts(e,o).next((c=>{s&&(s=!!c),i.set(o,c)})))).next((()=>{if(s){let o=Q();const c=[];return R.forEach(i,((u,l)=>{O(wp,`Using index ${(function(G){return`id=${G.indexId}|cg=${G.collectionGroup}|f=${G.fields.map((ie=>`${ie.fieldPath}:${ie.kind}`)).join(",")}`})(u)} to execute ${Va(t)}`);const d=(function(G,ie){const ne=Cu(ie);if(ne===void 0)return null;for(const se of Ca(G,ne.fieldPath))switch(se.op){case"array-contains-any":return se.value.arrayValue.values||[];case"array-contains":return[se.value]}return null})(l,u),p=(function(G,ie){const ne=new Map;for(const se of ur(ie))for(const E of Ca(G,se.fieldPath))switch(E.op){case"==":case"in":ne.set(se.fieldPath.canonicalString(),E.value);break;case"not-in":case"!=":return ne.set(se.fieldPath.canonicalString(),E.value),Array.from(ne.values())}return null})(l,u),g=(function(G,ie){const ne=[];let se=!0;for(const E of ur(ie)){const _=E.kind===0?qf(G,E.fieldPath,G.startAt):$f(G,E.fieldPath,G.startAt);ne.push(_.value),se&&(se=_.inclusive)}return new jn(ne,se)})(l,u),w=(function(G,ie){const ne=[];let se=!0;for(const E of ur(ie)){const _=E.kind===0?$f(G,E.fieldPath,G.endAt):qf(G,E.fieldPath,G.endAt);ne.push(_.value),se&&(se=_.inclusive)}return new jn(ne,se)})(l,u),S=this.ns(u,l,g),D=this.ns(u,l,w),k=this.rs(u,l,p),$=this.ss(u.indexId,d,S,g.inclusive,D,w.inclusive,k);return R.forEach($,(z=>r.Qn(z,t.limit).next((G=>{G.forEach((ie=>{const ne=M.fromSegments(ie.documentKey);o.has(ne)||(o=o.add(ne),c.push(ne))}))}))))})).next((()=>c))}return R.resolve(null)}))}es(e){let t=this.Xi.get(e);return t||(e.filters.length===0?t=[e]:t=Db(ue.create(e.filters,"and")).map((r=>xu(e.path,e.collectionGroup,e.orderBy,r.getFilters(),e.limit,e.startAt,e.endAt))),this.Xi.set(e,t),t)}ss(e,t,r,s,i,o,c){const u=(t!=null?t.length:1)*Math.max(r.length,i.length),l=u/(t!=null?t.length:1),d=[];for(let p=0;p<u;++p){const g=t?this._s(t[p/l]):Xo,w=this.us(e,g,r[p%l],s),S=this.cs(e,g,i[p%l],o),D=c.map((k=>this.us(e,g,k,!0)));d.push(...this.createRange(w,S,D))}return d}us(e,t,r,s){const i=new mr(e,M.empty(),t,r);return s?i:i.Ui()}cs(e,t,r,s){const i=new mr(e,M.empty(),t,r);return s?i.Ui():i}ts(e,t){const r=new yp(t),s=t.collectionGroup!=null?t.collectionGroup:t.path.lastSegment();return this.getFieldIndexes(e,s).next((i=>{let o=null;for(const c of i)r.Gi(c)&&(!o||c.fields.length>o.fields.length)&&(o=c);return o}))}getIndexType(e,t){let r=2;const s=this.es(t);return R.forEach(s,(i=>this.ts(e,i).next((o=>{o?r!==0&&o.fields.length<(function(u){let l=new ce(Ee.comparator),d=!1;for(const p of u.filters)for(const g of p.getFlattenedFilters())g.field.isKeyField()||(g.op==="array-contains"||g.op==="array-contains-any"?d=!0:l=l.add(g.field));for(const p of u.orderBy)p.field.isKeyField()||(l=l.add(p.field));return l.size+(d?1:0)})(i)&&(r=1):r=0})))).next((()=>(function(o){return o.limit!==null})(t)&&s.length>1&&r===2?1:r))}ls(e,t){const r=new Ti;for(const s of ur(e)){const i=t.data.field(s.fieldPath);if(i==null)return null;const o=r.Oi(s.kind);pr.Ti.Xr(i,o)}return r.Ci()}_s(e){const t=new Ti;return pr.Ti.Xr(e,t.Oi(0)),t.Ci()}Es(e,t){const r=new Ti;return pr.Ti.Xr(Pr(this.databaseId,t),r.Oi((function(i){const o=ur(i);return o.length===0?0:o[o.length-1].kind})(e))),r.Ci()}rs(e,t,r){if(r===null)return[];let s=[];s.push(new Ti);let i=0;for(const o of ur(e)){const c=r[i++];for(const u of s)if(this.hs(t,o.fieldPath)&&$n(c))s=this.Ts(s,o,c);else{const l=u.Oi(o.kind);pr.Ti.Xr(c,l)}}return this.Ps(s)}ns(e,t,r){return this.rs(e,t,r.position)}Ps(e){const t=[];for(let r=0;r<e.length;++r)t[r]=e[r].Ci();return t}Ts(e,t,r){const s=[...e],i=[];for(const o of r.arrayValue.values||[])for(const c of s){const u=new Ti;u.seed(c.Ci()),pr.Ti.Xr(o,u.Oi(t.kind)),i.push(u)}return i}hs(e,t){return!!e.filters.find((r=>r instanceof ee&&r.field.isEqual(t)&&(r.op==="in"||r.op==="not-in")))}getFieldIndexes(e,t){const r=Ei(e),s=es(e);return(t?r.Kn(Bu,IDBKeyRange.bound(t,t)):r.Kn()).next((i=>{const o=[];return R.forEach(i,(c=>s.get([c.indexId,this.uid]).next((u=>{o.push((function(d,p){const g=p?new As(p.sequenceNumber,new ft(Nr(p.readTime),new M(Lt(p.documentKey)),p.largestBatchId)):As.empty(),w=d.fields.map((([S,D])=>new Tr(Ee.fromServerFormat(S),D)));return new vs(d.indexId,d.collectionGroup,w,g)})(c,u))})))).next((()=>o))}))}getNextCollectionGroupToUpdate(e){return this.getFieldIndexes(e).next((t=>t.length===0?null:(t.sort(((r,s)=>{const i=r.indexState.sequenceNumber-s.indexState.sequenceNumber;return i!==0?i:H(r.collectionGroup,s.collectionGroup)})),t[0].collectionGroup)))}updateCollectionGroup(e,t,r){const s=Ei(e),i=es(e);return this.Rs(e).next((o=>s.Kn(Bu,IDBKeyRange.bound(t,t)).next((c=>R.forEach(c,(u=>i.put(dp(u.indexId,this.uid,o,r))))))))}updateIndexEntries(e,t){const r=new Map;return R.forEach(t,((s,i)=>{const o=r.get(s.collectionGroup);return(o?R.resolve(o):this.getFieldIndexes(e,s.collectionGroup)).next((c=>(r.set(s.collectionGroup,c),R.forEach(c,(u=>this.Is(e,s,u).next((l=>{const d=this.As(i,u);return l.isEqual(d)?R.resolve():this.Vs(e,i,u,l,d)})))))))}))}ds(e,t,r,s){return Zr(e).put(s.ki(this.uid,this.Es(r,t.key),t.key))}fs(e,t,r,s){return Zr(e).delete(s.qi(this.uid,this.Es(r,t.key),t.key))}Is(e,t,r){const s=Zr(e);let i=new ce(vn);return s.jn({index:Q_,range:IDBKeyRange.only([r.indexId,this.uid,pa(this.Es(r,t))])},((o,c)=>{i=i.add(new mr(r.indexId,t,_p(c.arrayValue),_p(c.directionalValue)))})).next((()=>i))}As(e,t){let r=new ce(vn);const s=this.ls(t,e);if(s==null)return r;const i=Cu(t);if(i!=null){const o=e.data.field(i.fieldPath);if($n(o))for(const c of o.arrayValue.values||[])r=r.add(new mr(t.indexId,e.key,this._s(c),s))}else r=r.add(new mr(t.indexId,e.key,Xo,s));return r}Vs(e,t,r,s,i){O(wp,"Updating index entries for document '%s'",t.key);const o=[];return(function(u,l,d,p,g){const w=u.getIterator(),S=l.getIterator();let D=Qr(w),k=Qr(S);for(;D||k;){let $=!1,z=!1;if(D&&k){const G=d(D,k);G<0?z=!0:G>0&&($=!0)}else D!=null?z=!0:$=!0;$?(p(k),k=Qr(S)):z?(g(D),D=Qr(w)):(D=Qr(w),k=Qr(S))}})(s,i,vn,(c=>{o.push(this.ds(e,t,r,c))}),(c=>{o.push(this.fs(e,t,r,c))})),R.waitFor(o)}Rs(e){let t=1;return es(e).jn({index:H_,reverse:!0,range:IDBKeyRange.upperBound([this.uid,Number.MAX_SAFE_INTEGER])},((r,s,i)=>{i.done(),t=s.sequenceNumber+1})).next((()=>t))}createRange(e,t,r){r=r.sort(((o,c)=>vn(o,c))).filter(((o,c,u)=>!c||vn(o,u[c-1])!==0));const s=[];s.push(e);for(const o of r){const c=vn(o,e),u=vn(o,t);if(c===0)s[0]=e.Ui();else if(c>0&&u<0)s.push(o),s.push(o.Ui());else if(u>0)break}s.push(t);const i=[];for(let o=0;o<s.length;o+=2){if(this.ps(s[o],s[o+1]))return[];const c=s[o].qi(this.uid,Xo,M.empty()),u=s[o+1].qi(this.uid,Xo,M.empty());i.push(IDBKeyRange.bound(c,u))}return i}ps(e,t){return vn(e,t)>0}getMinOffsetFromCollectionGroup(e,t){return this.getFieldIndexes(e,t).next(Ep)}getMinOffset(e,t){return R.mapArray(this.es(t),(r=>this.ts(e,r).next((s=>s||q(44426))))).next(Ep)}}function Tp(n){return De(n,io)}function Zr(n){return De(n,qi)}function Ei(n){return De(n,ah)}function es(n){return De(n,Bi)}function Ep(n){L(n.length!==0,28825);let e=n[0].indexState.offset,t=e.largestBatchId;for(let r=1;r<n.length;r++){const s=n[r].indexState.offset;Pl(s,e)<0&&(e=s),t<s.largestBatchId&&(t=s.largestBatchId)}return new ft(e.readTime,e.documentKey,t)}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cn{constructor(e){this.gs=e}next(){return this.gs+=2,this.gs}static ys(){return new cn(0)}static ws(){return new cn(-1)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Lb{constructor(e,t){this.referenceDelegate=e,this.serializer=t}allocateTargetId(e){return this.bs(e).next((t=>{const r=new cn(t.highestTargetId);return t.highestTargetId=r.next(),this.vs(e,t).next((()=>t.highestTargetId))}))}getLastRemoteSnapshotVersion(e){return this.bs(e).next((t=>j.fromTimestamp(new oe(t.lastRemoteSnapshotVersion.seconds,t.lastRemoteSnapshotVersion.nanoseconds))))}getHighestSequenceNumber(e){return this.bs(e).next((t=>t.highestListenSequenceNumber))}setTargetsMetadata(e,t,r){return this.bs(e).next((s=>(s.highestListenSequenceNumber=t,r&&(s.lastRemoteSnapshotVersion=r.toTimestamp()),t>s.highestListenSequenceNumber&&(s.highestListenSequenceNumber=t),this.vs(e,s))))}addTargetData(e,t){return this.Ss(e,t).next((()=>this.bs(e).next((r=>(r.targetCount+=1,this.Ds(t,r),this.vs(e,r))))))}updateTargetData(e,t){return this.Ss(e,t)}removeTargetData(e,t){return this.removeMatchingKeysForTargetId(e,t.targetId).next((()=>ts(e).delete(t.targetId))).next((()=>this.bs(e))).next((r=>(L(r.targetCount>0,8065),r.targetCount-=1,this.vs(e,r))))}removeTargets(e,t,r){let s=0;const i=[];return ts(e).jn(((o,c)=>{const u=Ci(this.serializer,c);u.sequenceNumber<=t&&r.get(u.targetId)===null&&(s++,i.push(this.removeTargetData(e,u)))})).next((()=>R.waitFor(i))).next((()=>s))}forEachTarget(e,t){return ts(e).jn(((r,s)=>{const i=Ci(this.serializer,s);t(i)}))}bs(e){return vp(e).get(Ma).next((t=>(L(t!==null,2888),t)))}vs(e,t){return vp(e).put(Ma,t)}Ss(e,t){return ts(e).put(ry(this.serializer,t))}Ds(e,t){let r=!1;return e.targetId>t.highestTargetId&&(t.highestTargetId=e.targetId,r=!0),e.sequenceNumber>t.highestListenSequenceNumber&&(t.highestListenSequenceNumber=e.sequenceNumber,r=!0),r}getTargetCount(e){return this.bs(e).next((t=>t.targetCount))}getTargetData(e,t){const r=_c(t),s=IDBKeyRange.bound([r,Number.NEGATIVE_INFINITY],[r,Number.POSITIVE_INFINITY]);let i=null;return ts(e).jn({range:s,index:W_},((o,c,u)=>{const l=Ci(this.serializer,c);rh(t,l.target)&&(i=l,u.done())})).next((()=>i))}addMatchingKeys(e,t,r){const s=[],i=Nn(e);return t.forEach((o=>{const c=Ke(o.path);s.push(i.put({targetId:r,path:c})),s.push(this.referenceDelegate.addReference(e,r,o))})),R.waitFor(s)}removeMatchingKeys(e,t,r){const s=Nn(e);return R.forEach(t,(i=>{const o=Ke(i.path);return R.waitFor([s.delete([r,o]),this.referenceDelegate.removeReference(e,r,i)])}))}removeMatchingKeysForTargetId(e,t){const r=Nn(e),s=IDBKeyRange.bound([t],[t+1],!1,!0);return r.delete(s)}getMatchingKeysForTargetId(e,t){const r=IDBKeyRange.bound([t],[t+1],!1,!0),s=Nn(e);let i=Q();return s.jn({range:r,zn:!0},((o,c,u)=>{const l=Lt(o[1]),d=new M(l);i=i.add(d)})).next((()=>i))}containsKey(e,t){const r=Ke(t.path),s=IDBKeyRange.bound([r],[ig(r)],!1,!0);let i=0;return Nn(e).jn({index:oh,zn:!0,range:s},(([o,c],u,l)=>{o!==0&&(i++,l.done())})).next((()=>i>0))}ge(e,t){return ts(e).get(t).next((r=>r?Ci(this.serializer,r):null))}}function ts(n){return De(n,Ss)}function vp(n){return De(n,Er)}function Nn(n){return De(n,Vs)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Mb{constructor(e,t){this.db=e,this.garbageCollector=y_(this,t)}rr(e){const t=this.xs(e);return this.db.getTargetCache().getTargetCount(e).next((r=>t.next((s=>r+s))))}xs(e){let t=0;return this.ir(e,(r=>{t++})).next((()=>t))}forEachTarget(e,t){return this.db.getTargetCache().forEachTarget(e,t)}ir(e,t){return this.Cs(e,((r,s)=>t(s)))}addReference(e,t,r){return Zo(e,r)}removeReference(e,t,r){return Zo(e,r)}removeTargets(e,t,r){return this.db.getTargetCache().removeTargets(e,t,r)}markPotentiallyOrphaned(e,t){return Zo(e,t)}Fs(e,t){return(function(s,i){let o=!1;return iy(s).Hn((c=>sy(s,c,i).next((u=>(u&&(o=!0),R.resolve(!u)))))).next((()=>o))})(e,t)}removeOrphanedDocuments(e,t){const r=this.db.getRemoteDocumentCache().newChangeBuffer(),s=[];let i=0;return this.Cs(e,((o,c)=>{if(c<=t){const u=this.Fs(e,o).next((l=>{if(!l)return i++,r.getEntry(e,o).next((()=>(r.removeEntry(o,j.min()),Nn(e).delete((function(p){return[0,Ke(p.path)]})(o)))))}));s.push(u)}})).next((()=>R.waitFor(s))).next((()=>r.apply(e))).next((()=>i))}removeTarget(e,t){const r=t.withSequenceNumber(e.currentSequenceNumber);return this.db.getTargetCache().updateTargetData(e,r)}updateLimboDocument(e,t){return Zo(e,t)}Cs(e,t){const r=Nn(e);let s,i=nt.yn;return r.jn({index:oh},(([o,c],{path:u,sequenceNumber:l})=>{o===0?(i!==nt.yn&&t(new M(Lt(s)),i),i=l,s=u):i=nt.yn})).next((()=>{i!==nt.yn&&t(new M(Lt(s)),i)}))}getCacheSize(e){return this.db.getRemoteDocumentCache().getSize(e)}}function Zo(n,e){return Nn(n).put((function(r,s){return{targetId:0,path:Ke(r.path),sequenceNumber:s}})(e,n.currentSequenceNumber))}// Copyright 2024 Google LLC* @license
function cy(n,e){var r;let t=e;for(const s of n.stages)t=Fb({serializer:n.serializer,serverTimestampBehavior:(r=n.listenOptions)==null?void 0:r.serverTimestampBehavior},s,t);return t}function Ac(n,e){return cy(n,[e]).length>0}function uy(n,e){return Ie(n)?Ac(n,e):oc(n,e)}function Fb(n,e,t){if(e instanceof wo)return(function(s,i,o){return o.filter((c=>c.isFoundDocument()&&`/${c.key.getCollectionPath().canonicalString()}`===i.Er))})(0,e,t);if(e instanceof Eo)return(function(s,i,o){return o.filter((c=>{const u=Ui(W(i.condition).evaluate(s,c));return u!==void 0&&It(u,it)}))})(n,e,t);if(e instanceof To)return(function(s,i,o){return o.filter((c=>c.isFoundDocument()&&c.key.getCollectionPath().lastSegment()===i.collectionId))})(0,e,t);if(e instanceof fc)return(function(s,i,o){return o.filter((c=>c.isFoundDocument()))})(0,0,t);if(e instanceof pc)return(function(s,i,o){return o.filter((c=>c.isFoundDocument()&&i.Tr.has(c.key.path.toStringWithLeadingSlash())))})(0,e,t);if(e instanceof Gn)return(function(s,i,o){return o.slice(0,i.limit)})(0,e,t);if(e instanceof Ot)return(function(s,i,o){const c=i.orderings.map((u=>({Os:W(u.expr),direction:u.direction})));return[...o].sort(((u,l)=>{for(const{Os:d,direction:p}of c){const g=Ui(d.evaluate(s,u)),w=Ui(d.evaluate(s,l)),S=We(g??Ut,w??Ut);if(S!==0)return p==="ascending"?S:-S}return 0}))})(n,e,t);throw new Error(`Unknown stage: ${e._name}`)}function qa(n){const e=(function(r){for(let s=r.stages.length-1;s>=0;s--){const i=r.stages[s];if(i instanceof Ot)return i.orderings}throw new Error("Pipeline must contain at least one Sort stage")})(n);return(t,r)=>{for(const s of e){const i=Ui(W(s.expr).evaluate({serializer:n.serializer},t)),o=Ui(W(s.expr).evaluate({serializer:n.serializer},r)),c=We(i||Ut,o||Ut);if(c!==0)return s.direction==="ascending"?c:-c}return 0}}function hu(n){for(let e=n.stages.length-1;e>=0;e--){const t=n.stages[e];if(t instanceof Gn)return{limit:t.limit}}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ly{constructor(){this.changes=new fn((e=>e.toString()),((e,t)=>e.isEqual(t))),this.changesApplied=!1}addEntry(e){this.assertNotApplied(),this.changes.set(e.key,e)}removeEntry(e,t){this.assertNotApplied(),this.changes.set(e,ge.newInvalidDocument(e).setReadTime(t))}getEntry(e,t){this.assertNotApplied();const r=this.changes.get(t);return r!==void 0?R.resolve(r):this.getFromCache(e,t)}getEntries(e,t){return this.getAllFromCache(e,t)}apply(e){return this.assertNotApplied(),this.changesApplied=!0,this.applyChanges(e)}assertNotApplied(){}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ub{constructor(e){this.serializer=e}setIndexManager(e){this.indexManager=e}addEntry(e,t,r){return An(e).put(r)}removeEntry(e,t,r){return An(e).delete((function(i,o){const c=i.path.toArray();return[c.slice(0,c.length-2),c[c.length-2],Ua(o),c[c.length-1]]})(t,r))}updateMetadata(e,t){return this.getMetadata(e).next((r=>(r.byteSize+=t,this.Ms(e,r))))}getEntry(e,t){let r=ge.newInvalidDocument(t);return An(e).jn({index:fa,range:IDBKeyRange.only(vi(t))},((s,i)=>{r=this.Ns(t,i)})).next((()=>r))}Ls(e,t){let r={size:0,document:ge.newInvalidDocument(t)};return An(e).jn({index:fa,range:IDBKeyRange.only(vi(t))},((s,i)=>{r={document:this.Ns(t,i),size:Fa(i)}})).next((()=>r))}getEntries(e,t){let r=Re();return this.Bs(e,t,((s,i)=>{const o=this.Ns(s,i);r=r.insert(s,o)})).next((()=>r))}getAllEntries(e){let t=Re();return An(e).jn(((r,s)=>{const i=this.Ns(M.fromSegments(s.prefixPath.concat(s.collectionGroup,s.documentId)),s);t=t.insert(i.key,i)})).next((()=>t))}Us(e,t){let r=Re(),s=new de(M.comparator);return this.Bs(e,t,((i,o)=>{const c=this.Ns(i,o);r=r.insert(i,c),s=s.insert(i,Fa(o))})).next((()=>({documents:r,ks:s})))}Bs(e,t,r){if(t.isEmpty())return R.resolve();let s=new ce(Pp);t.forEach((u=>s=s.add(u)));const i=IDBKeyRange.bound(vi(s.first()),vi(s.last())),o=s.getIterator();let c=o.getNext();return An(e).jn({index:fa,range:i},((u,l,d)=>{const p=M.fromSegments([...l.prefixPath,l.collectionGroup,l.documentId]);for(;c&&Pp(c,p)<0;)r(c,null),c=o.getNext();c&&c.isEqual(p)&&(r(c,l),c=o.hasNext()?o.getNext():null),c?d.$n(vi(c)):d.done()})).next((()=>{for(;c;)r(c,null),c=o.hasNext()?o.getNext():null}))}getDocumentsMatchingQuery(e,t,r,s,i){const o=Ie(t)?J.fromString(Ao(t)):t.path,c=[o.popLast().toArray(),o.lastSegment(),Ua(r.readTime),r.documentKey.path.isEmpty()?"":r.documentKey.path.lastSegment()],u=[o.popLast().toArray(),o.lastSegment(),[Number.MAX_SAFE_INTEGER,Number.MAX_SAFE_INTEGER],""];return An(e).Kn(IDBKeyRange.bound(c,u,!0)).next((l=>{i==null||i.incrementDocumentReadCount(l.length);let d=Re();for(const p of l){const g=this.Ns(M.fromSegments(p.prefixPath.concat(p.collectionGroup,p.documentId)),p);g.isFoundDocument()&&(uy(t,g)||s.has(g.key))&&(d=d.insert(g.key,g))}return d}))}getAllFromCollectionGroup(e,t,r,s){let i=Re();const o=Rp(t,r),c=Rp(t,ft.max());return An(e).jn({index:K_,range:IDBKeyRange.bound(o,c,!0)},((u,l,d)=>{const p=this.Ns(M.fromSegments(l.prefixPath.concat(l.collectionGroup,l.documentId)),l);i=i.insert(p.key,p),i.size===s&&d.done()})).next((()=>i))}newChangeBuffer(e){return new Bb(this,!!e&&e.trackRemovals)}getSize(e){return this.getMetadata(e).next((t=>t.byteSize))}getMetadata(e){return Ap(e).get(Uu).next((t=>(L(!!t,20021),t)))}Ms(e,t){return Ap(e).put(Uu,t)}Ns(e,t){if(t){const r=Rb(this.serializer,t);if(!(r.isNoDocument()&&r.version.isEqual(j.min())))return r}return ge.newInvalidDocument(e)}}function hy(n){return new Ub(n)}class Bb extends ly{constructor(e,t){super(),this.qs=e,this.trackRemovals=t,this.$s=new fn((r=>r.toString()),((r,s)=>r.isEqual(s)))}applyChanges(e){const t=[];let r=0,s=new ce(((i,o)=>H(i.canonicalString(),o.canonicalString())));return this.changes.forEach(((i,o)=>{const c=this.$s.get(i);if(t.push(this.qs.removeEntry(e,i,c.readTime)),o.isValidDocument()){const u=lp(this.qs.serializer,o);s=s.add(i.path.popLast());const l=Fa(u);r+=l-c.size,t.push(this.qs.addEntry(e,i,u))}else if(r-=c.size,this.trackRemovals){const u=lp(this.qs.serializer,o.convertToNoDocument(j.min()));t.push(this.qs.addEntry(e,i,u))}})),s.forEach((i=>{t.push(this.qs.indexManager.addToCollectionParentIndex(e,i))})),t.push(this.qs.updateMetadata(e,r)),R.waitFor(t)}getFromCache(e,t){return this.qs.Ls(e,t).next((r=>(this.$s.set(t,{size:r.size,readTime:r.document.readTime}),r.document)))}getAllFromCache(e,t){return this.qs.Us(e,t).next((({documents:r,ks:s})=>(s.forEach(((i,o)=>{this.$s.set(i,{size:o,readTime:r.get(i).readTime})})),r)))}}function Ap(n){return De(n,so)}function An(n){return De(n,La)}function vi(n){const e=n.path.toArray();return[e.slice(0,e.length-2),e[e.length-2],e[e.length-1]]}function Rp(n,e){const t=e.documentKey.path.toArray();return[n,Ua(e.readTime),t.slice(0,t.length-2),t.length>0?t[t.length-1]:""]}function Pp(n,e){const t=n.path.toArray(),r=e.path.toArray();let s=0;for(let i=0;i<t.length-2&&i<r.length-2;++i)if(s=H(t[i],r[i]),s)return s;return s=H(t.length,r.length),s||(s=H(t[t.length-2],r[r.length-2]),s||H(t[t.length-1],r[r.length-1]))}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class qb{constructor(e,t){this.overlayedDocument=e,this.mutatedFields=t}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class dy{constructor(e,t,r,s){this.remoteDocumentCache=e,this.mutationQueue=t,this.documentOverlayCache=r,this.indexManager=s}getDocument(e,t){let r=null;return this.documentOverlayCache.getOverlay(e,t).next((s=>(r=s,this.remoteDocumentCache.getEntry(e,t)))).next((s=>(r!==null&&Di(r.mutation,s,tt.empty(),oe.now()),s)))}getDocuments(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.getLocalViewOfDocuments(e,r,Q()).next((()=>r))))}getLocalViewOfDocuments(e,t,r=Q()){const s=mt();return this.populateOverlays(e,s,t).next((()=>this.computeViews(e,t,s,r).next((i=>{let o=hr();return i.forEach(((c,u)=>{o=o.insert(c,u.overlayedDocument)})),o}))))}getOverlayedDocuments(e,t){const r=mt();return this.populateOverlays(e,r,t).next((()=>this.computeViews(e,t,r,Q())))}populateOverlays(e,t,r){const s=[];return r.forEach((i=>{t.has(i)||s.push(i)})),this.documentOverlayCache.getOverlays(e,s).next((i=>{i.forEach(((o,c)=>{t.set(o,c)}))}))}computeViews(e,t,r,s){let i=Re();const o=Oi(),c=(function(){return Oi()})();return t.forEach(((u,l)=>{const d=r.get(l.key);s.has(l.key)&&(d===void 0||d.mutation instanceof hn)?i=i.insert(l.key,l):d!==void 0?(o.set(l.key,d.mutation.getFieldMask()),Di(d.mutation,l,d.mutation.getFieldMask(),oe.now())):o.set(l.key,tt.empty())})),this.recalculateAndSaveOverlays(e,i).next((u=>(u.forEach(((l,d)=>o.set(l,d))),t.forEach(((l,d)=>c.set(l,new qb(d,o.get(l)??null)))),c)))}recalculateAndSaveOverlays(e,t){const r=Oi();let s=new de(((o,c)=>o-c)),i=Q();return this.mutationQueue.getAllMutationBatchesAffectingDocumentKeys(e,t).next((o=>{for(const c of o)c.keys().forEach((u=>{const l=t.get(u);if(l===null)return;let d=r.get(u)||tt.empty();d=c.applyToLocalView(l,d),r.set(u,d);const p=(s.get(c.batchId)||Q()).add(u);s=s.insert(c.batchId,p)}))})).next((()=>{const o=[],c=s.getReverseIterator();for(;c.hasNext();){const u=c.getNext(),l=u.key,d=u.value,p=jg();d.forEach((g=>{if(!i.has(g)){const w=vg(t.get(g),r.get(g));w!==null&&p.set(g,w),i=i.add(g)}})),o.push(this.documentOverlayCache.saveOverlays(e,l,p))}return R.waitFor(o)})).next((()=>r))}recalculateAndSaveOverlaysForDocumentKeys(e,t){return this.remoteDocumentCache.getEntries(e,t).next((r=>this.recalculateAndSaveOverlays(e,r)))}getDocumentsMatchingQuery(e,t,r,s){return Ie(t)?this.getDocumentsMatchingPipeline(e,t,r,s):TA(t)?this.getDocumentsMatchingDocumentQuery(e,t.path):Vl(t)?this.getDocumentsMatchingCollectionGroupQuery(e,t,r,s):this.getDocumentsMatchingCollectionQuery(e,t,r,s)}getNextDocuments(e,t,r,s){return this.remoteDocumentCache.getAllFromCollectionGroup(e,t,r,s).next((i=>{const o=s-i.size>0?this.documentOverlayCache.getOverlaysForCollectionGroup(e,t,r.largestBatchId,s-i.size):R.resolve(mt());let c=Es,u=i;return o.next((l=>R.forEach(l,((d,p)=>(c<p.largestBatchId&&(c=p.largestBatchId),i.get(d)?R.resolve():this.remoteDocumentCache.getEntry(e,d).next((g=>{u=u.insert(d,g)}))))).next((()=>this.populateOverlays(e,l,i))).next((()=>this.computeViews(e,u,l,Q()))).next((d=>({batchId:c,changes:$g(d)})))))}))}getDocumentsMatchingDocumentQuery(e,t){return this.getDocument(e,new M(t)).next((r=>{let s=hr();return r.isFoundDocument()&&(s=s.insert(r.key,r)),s}))}getDocumentsMatchingCollectionGroupQuery(e,t,r,s){const i=t.collectionGroup;let o=hr();return this.indexManager.getCollectionParents(e,i).next((c=>R.forEach(c,(u=>{const l=(function(p,g){return new dn(g,null,p.explicitOrderBy.slice(),p.filters.slice(),p.limit,p.limitType,p.startAt,p.endAt)})(t,u.child(i));return this.getDocumentsMatchingCollectionQuery(e,l,r,s).next((d=>{d.forEach(((p,g)=>{o=o.insert(p,g)}))}))})).next((()=>o))))}getDocumentsMatchingCollectionQuery(e,t,r,s){let i;return this.documentOverlayCache.getOverlaysForCollection(e,t.path,r.largestBatchId).next((o=>(i=o,this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s)))).next((o=>this.retrieveMatchingLocalDocuments(i,o,(c=>oc(t,c)))))}getDocumentsMatchingPipeline(e,t,r,s){if(en(t)==="collection_group"){const i=nh(t);let o=hr();return this.indexManager.getCollectionParents(e,i).next((c=>R.forEach(c,(u=>{const l=(function(p,g){const w=p.stages.map((S=>S instanceof To?new wo(g.canonicalString(),{}):S));return new ze(p.serializer,w)})(t,u.child(i));return this.getDocumentsMatchingPipeline(e,l,r,s).next((d=>{d.forEach(((p,g)=>{o=o.insert(p,g)}))}))})).next((()=>o))))}{let i;return this.getOverlaysForPipeline(e,t,r.largestBatchId).next((o=>{switch(i=o,en(t)){case"collection":return this.remoteDocumentCache.getDocumentsMatchingQuery(e,t,r,i,s);case"documents":let c=Q();for(const u of ka(t))c=c.add(M.fromPath(u));return this.remoteDocumentCache.getEntries(e,c);case"database":return this.remoteDocumentCache.getAllEntries(e);default:throw new N("invalid-argument",`Invalid pipeline source to execute offline: ${tn(t)}`)}})).next((o=>this.retrieveMatchingLocalDocuments(i,o,(c=>Ac(t,c)))))}}retrieveMatchingLocalDocuments(e,t,r){e.forEach(((i,o)=>{const c=o.getKey();t.get(c)===null&&(t=t.insert(c,ge.newInvalidDocument(c)))}));let s=hr();return t.forEach(((i,o)=>{const c=e.get(i);c!==void 0&&Di(c.mutation,o,tt.empty(),oe.now()),r(o)&&(s=s.insert(i,o))})),s}getOverlaysForPipeline(e,t,r){switch(en(t)){case"collection":return this.documentOverlayCache.getOverlaysForCollection(e,J.fromString(Ao(t)),r);case"collection_group":throw new N("invalid-argument",`Unexpected collection group pipeline: ${tn(t)}`);case"documents":return this.documentOverlayCache.getOverlays(e,ka(t).map((s=>M.fromPath(s))));case"database":return this.documentOverlayCache.getAllOverlays(e,r);default:throw new N("invalid-argument",`Failed to get overlays for pipeline: ${tn(t)}`)}}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class $b{constructor(e){this.serializer=e,this.Ks=new Map,this.Ws=new Map}getBundleMetadata(e,t){return R.resolve(this.Ks.get(t))}saveBundleMetadata(e,t){return this.Ks.set(t.id,(function(s){return{id:s.id,version:s.version,createTime:ve(s.createTime)}})(t)),R.resolve()}getNamedQuery(e,t){return R.resolve(this.Ws.get(t))}saveNamedQuery(e,t){return this.Ws.set(t.name,(function(s){return{name:s.name,query:Tc(s.bundledQuery),readTime:ve(s.readTime)}})(t)),R.resolve()}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class jb{constructor(){this.overlays=new de(M.comparator),this.Qs=new Map}getOverlay(e,t){return R.resolve(this.overlays.get(t))}getOverlays(e,t){const r=mt();return R.forEach(t,(s=>this.getOverlay(e,s).next((i=>{i!==null&&r.set(s,i)})))).next((()=>r))}getAllOverlays(e,t){const r=mt();return this.overlays.forEach(((s,i)=>{i.largestBatchId>t&&r.set(s,i)})),R.resolve(r)}saveOverlays(e,t,r){return r.forEach(((s,i)=>{this.Yr(e,t,i)})),R.resolve()}removeOverlaysForBatchId(e,t,r){const s=this.Qs.get(r);return s!==void 0&&(s.forEach((i=>this.overlays=this.overlays.remove(i))),this.Qs.delete(r)),R.resolve()}getOverlaysForCollection(e,t,r){const s=mt(),i=t.length+1,o=new M(t.child("")),c=this.overlays.getIteratorFrom(o);for(;c.hasNext();){const u=c.getNext().value,l=u.getKey();if(!t.isPrefixOf(l.path))break;l.path.length===i&&u.largestBatchId>r&&s.set(u.getKey(),u)}return R.resolve(s)}getOverlaysForCollectionGroup(e,t,r,s){let i=new de(((l,d)=>l-d));const o=this.overlays.getIterator();for(;o.hasNext();){const l=o.getNext().value;if(l.getKey().getCollectionGroup()===t&&l.largestBatchId>r){let d=i.get(l.largestBatchId);d===null&&(d=mt(),i=i.insert(l.largestBatchId,d)),d.set(l.getKey(),l)}}const c=mt(),u=i.getIterator();for(;u.hasNext()&&(u.getNext().value.forEach(((l,d)=>c.set(l,d))),!(c.size()>=s)););return R.resolve(c)}Yr(e,t,r){const s=this.overlays.get(r.key);if(s!==null){const o=this.Qs.get(s.largestBatchId).delete(r.key);this.Qs.set(s.largestBatchId,o)}this.overlays=this.overlays.insert(r.key,new lh(t,r));let i=this.Qs.get(t);i===void 0&&(i=Q(),this.Qs.set(t,i)),this.Qs.set(t,i.add(r.key))}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class zb{constructor(){this.sessionToken=pe.EMPTY_BYTE_STRING}getSessionToken(e){return R.resolve(this.sessionToken)}setSessionToken(e,t){return this.sessionToken=t,R.resolve()}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class fh{constructor(){this.Gs=new ce(Oe.zs),this.js=new ce(Oe.Hs)}isEmpty(){return this.Gs.isEmpty()}addReference(e,t){const r=new Oe(e,t);this.Gs=this.Gs.add(r),this.js=this.js.add(r)}Js(e,t){e.forEach((r=>this.addReference(r,t)))}removeReference(e,t){this.Ys(new Oe(e,t))}Zs(e,t){e.forEach((r=>this.removeReference(r,t)))}Xs(e){const t=new M(new J([])),r=new Oe(t,e),s=new Oe(t,e+1),i=[];return this.js.forEachInRange([r,s],(o=>{this.Ys(o),i.push(o.key)})),i}e_(){this.Gs.forEach((e=>this.Ys(e)))}Ys(e){this.Gs=this.Gs.delete(e),this.js=this.js.delete(e)}t_(e){const t=new M(new J([])),r=new Oe(t,e),s=new Oe(t,e+1);let i=Q();return this.js.forEachInRange([r,s],(o=>{i=i.add(o.key)})),i}containsKey(e){const t=new Oe(e,0),r=this.Gs.firstAfterOrEqual(t);return r!==null&&e.isEqual(r.key)}}class Oe{constructor(e,t){this.key=e,this.n_=t}static zs(e,t){return M.comparator(e.key,t.key)||H(e.n_,t.n_)}static Hs(e,t){return H(e.n_,t.n_)||M.comparator(e.key,t.key)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Gb{constructor(e,t){this.indexManager=e,this.referenceDelegate=t,this.mutationQueue=[],this.Qr=1,this.r_=new ce(Oe.zs)}checkEmpty(e){return R.resolve(this.mutationQueue.length===0)}addMutationBatch(e,t,r,s){const i=this.Qr;this.Qr++,this.mutationQueue.length>0&&this.mutationQueue[this.mutationQueue.length-1];const o=new sh(i,t,r,s);this.mutationQueue.push(o);for(const c of s)this.r_=this.r_.add(new Oe(c.key,i)),this.indexManager.addToCollectionParentIndex(e,c.key.path.popLast());return R.resolve(o)}lookupMutationBatch(e,t){return R.resolve(this.i_(t))}getNextMutationBatchAfterBatchId(e,t){const r=t+1,s=this.s_(r),i=s<0?0:s;return R.resolve(this.mutationQueue.length>i?this.mutationQueue[i]:null)}getHighestUnacknowledgedBatchId(){return R.resolve(this.mutationQueue.length===0?Ln:this.Qr-1)}getAllMutationBatches(e){return R.resolve(this.mutationQueue.slice())}getAllMutationBatchesAffectingDocumentKey(e,t){const r=new Oe(t,0),s=new Oe(t,Number.POSITIVE_INFINITY),i=[];return this.r_.forEachInRange([r,s],(o=>{const c=this.i_(o.n_);i.push(c)})),R.resolve(i)}getAllMutationBatchesAffectingDocumentKeys(e,t){let r=new ce(H);return t.forEach((s=>{const i=new Oe(s,0),o=new Oe(s,Number.POSITIVE_INFINITY);this.r_.forEachInRange([i,o],(c=>{r=r.add(c.n_)}))})),R.resolve(this.__(r))}getAllMutationBatchesAffectingQuery(e,t){const r=t.path,s=r.length+1;let i=r;M.isDocumentKey(i)||(i=i.child(""));const o=new Oe(new M(i),0);let c=new ce(H);return this.r_.forEachWhile((u=>{const l=u.key.path;return!!r.isPrefixOf(l)&&(l.length===s&&(c=c.add(u.n_)),!0)}),o),R.resolve(this.__(c))}__(e){const t=[];return e.forEach((r=>{const s=this.i_(r);s!==null&&t.push(s)})),t}removeMutationBatch(e,t){L(this.o_(t.batchId,"removed")===0,55003),this.mutationQueue.shift();let r=this.r_;return R.forEach(t.mutations,(s=>{const i=new Oe(s.key,t.batchId);return r=r.delete(i),this.referenceDelegate.markPotentiallyOrphaned(e,s.key)})).next((()=>{this.r_=r}))}jr(e){}containsKey(e,t){const r=new Oe(t,0),s=this.r_.firstAfterOrEqual(r);return R.resolve(t.isEqual(s&&s.key))}performConsistencyCheck(e){return this.mutationQueue.length,R.resolve()}o_(e,t){return this.s_(e)}s_(e){return this.mutationQueue.length===0?0:e-this.mutationQueue[0].batchId}i_(e){const t=this.s_(e);return t<0||t>=this.mutationQueue.length?null:this.mutationQueue[t]}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Kb{constructor(e){this.a_=e,this.docs=(function(){return new de(M.comparator)})(),this.size=0}setIndexManager(e){this.indexManager=e}addEntry(e,t){const r=t.key,s=this.docs.get(r),i=s?s.size:0,o=this.a_(t);return this.docs=this.docs.insert(r,{document:t.mutableCopy(),size:o}),this.size+=o-i,this.indexManager.addToCollectionParentIndex(e,r.path.popLast())}removeEntry(e){const t=this.docs.get(e);t&&(this.docs=this.docs.remove(e),this.size-=t.size)}getEntry(e,t){const r=this.docs.get(t);return R.resolve(r?r.document.mutableCopy():ge.newInvalidDocument(t))}getEntries(e,t){let r=Re();return t.forEach((s=>{const i=this.docs.get(s);r=r.insert(s,i?i.document.mutableCopy():ge.newInvalidDocument(s))})),R.resolve(r)}getAllEntries(e){let t=Re();return this.docs.forEach(((r,s)=>{t=t.insert(r,s.document)})),R.resolve(t)}getDocumentsMatchingQuery(e,t,r,s){let i,o;Ie(t)?(i=J.fromString(Ao(t)),o=d=>Ac(t,d)):(i=t.path,o=d=>oc(t,d));let c=Re();const u=new M(i.child("__id-9223372036854775808__")),l=this.docs.getIteratorFrom(u);for(;l.hasNext();){const{key:d,value:{document:p}}=l.getNext();if(!i.isPrefixOf(d.path))break;d.path.length>i.length+1||Pl(kg(p),r)<=0||(s.has(p.key)||o(p))&&(c=c.insert(p.key,p.mutableCopy()))}return R.resolve(c)}getAllFromCollectionGroup(e,t,r,s){q(9500)}u_(e,t){return R.forEach(this.docs,(r=>t(r)))}newChangeBuffer(e){return new Wb(this)}getSize(e){return R.resolve(this.size)}}class Wb extends ly{constructor(e){super(),this.qs=e}applyChanges(e){const t=[];return this.changes.forEach(((r,s)=>{s.isValidDocument()?t.push(this.qs.addEntry(e,s)):this.qs.removeEntry(r)})),R.waitFor(t)}getFromCache(e,t){return this.qs.getEntry(e,t)}getAllFromCache(e,t){return this.qs.getEntries(e,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Hb{constructor(e){this.persistence=e,this.c_=new fn((t=>_c(t)),rh),this.lastRemoteSnapshotVersion=j.min(),this.highestTargetId=0,this.l_=0,this.E_=new fh,this.targetCount=0,this.h_=cn.ys()}forEachTarget(e,t){return this.c_.forEach(((r,s)=>t(s))),R.resolve()}getLastRemoteSnapshotVersion(e){return R.resolve(this.lastRemoteSnapshotVersion)}getHighestSequenceNumber(e){return R.resolve(this.l_)}allocateTargetId(e){return this.highestTargetId=this.h_.next(),R.resolve(this.highestTargetId)}setTargetsMetadata(e,t,r){return r&&(this.lastRemoteSnapshotVersion=r),t>this.l_&&(this.l_=t),R.resolve()}Ss(e){this.c_.set(e.target,e);const t=e.targetId;t>this.highestTargetId&&(this.h_=new cn(t),this.highestTargetId=t),e.sequenceNumber>this.l_&&(this.l_=e.sequenceNumber)}addTargetData(e,t){return this.Ss(t),this.targetCount+=1,R.resolve()}updateTargetData(e,t){return this.Ss(t),R.resolve()}removeTargetData(e,t){return this.c_.delete(t.target),this.E_.Xs(t.targetId),this.targetCount-=1,R.resolve()}removeTargets(e,t,r){let s=0;const i=[];return this.c_.forEach(((o,c)=>{c.sequenceNumber<=t&&r.get(c.targetId)===null&&(this.c_.delete(o),i.push(this.removeMatchingKeysForTargetId(e,c.targetId)),s++)})),R.waitFor(i).next((()=>s))}getTargetCount(e){return R.resolve(this.targetCount)}getTargetData(e,t){const r=this.c_.get(t)||null;return R.resolve(r)}addMatchingKeys(e,t,r){return this.E_.Js(t,r),R.resolve()}removeMatchingKeys(e,t,r){this.E_.Zs(t,r);const s=this.persistence.referenceDelegate,i=[];return s&&t.forEach((o=>{i.push(s.markPotentiallyOrphaned(e,o))})),R.waitFor(i)}removeMatchingKeysForTargetId(e,t){return this.E_.Xs(t),R.resolve()}getMatchingKeysForTargetId(e,t){const r=this.E_.t_(t);return R.resolve(r)}containsKey(e,t){return R.resolve(this.E_.containsKey(t))}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ph{constructor(e,t){this.T_={},this.overlays={},this.P_=new nt(0),this.R_=!1,this.R_=!0,this.I_=new zb,this.referenceDelegate=e(this),this.A_=new Hb(this),this.indexManager=new kb,this.remoteDocumentCache=(function(s){return new Kb(s)})((r=>this.referenceDelegate.V_(r))),this.serializer=new ny(t),this.d_=new $b(this.serializer)}start(){return Promise.resolve()}shutdown(){return this.R_=!1,Promise.resolve()}get started(){return this.R_}setDatabaseDeletedListener(){}setNetworkEnabled(){}getIndexManager(e){return this.indexManager}getDocumentOverlayCache(e){let t=this.overlays[e.toKey()];return t||(t=new jb,this.overlays[e.toKey()]=t),t}getMutationQueue(e,t){let r=this.T_[e.toKey()];return r||(r=new Gb(t,this.referenceDelegate),this.T_[e.toKey()]=r),r}getGlobalsCache(){return this.I_}getTargetCache(){return this.A_}getRemoteDocumentCache(){return this.remoteDocumentCache}getBundleCache(){return this.d_}runTransaction(e,t,r){O("MemoryPersistence","Starting transaction:",e);const s=new Qb(this.P_.next());return this.referenceDelegate.f_(),r(s).next((i=>this.referenceDelegate.m_(s).next((()=>i)))).toPromise().then((i=>(s.raiseOnCommittedEvent(),i)))}p_(e,t){return R.or(Object.values(this.T_).map((r=>()=>r.containsKey(e,t))))}}class Qb extends p_{constructor(e){super(),this.currentSequenceNumber=e}}class Rc{constructor(e){this.persistence=e,this.g_=new fh,this.y_=null}static w_(e){return new Rc(e)}get b_(){if(this.y_)return this.y_;throw q(60996)}addReference(e,t,r){return this.g_.addReference(r,t),this.b_.delete(r.toString()),R.resolve()}removeReference(e,t,r){return this.g_.removeReference(r,t),this.b_.add(r.toString()),R.resolve()}markPotentiallyOrphaned(e,t){return this.b_.add(t.toString()),R.resolve()}removeTarget(e,t){this.g_.Xs(t.targetId).forEach((s=>this.b_.add(s.toString())));const r=this.persistence.getTargetCache();return r.getMatchingKeysForTargetId(e,t.targetId).next((s=>{s.forEach((i=>this.b_.add(i.toString())))})).next((()=>r.removeTargetData(e,t)))}f_(){this.y_=new Set}m_(e){const t=this.persistence.getRemoteDocumentCache().newChangeBuffer();return R.forEach(this.b_,(r=>{const s=M.fromPath(r);return this.v_(e,s).next((i=>{i||t.removeEntry(s,j.min())}))})).next((()=>(this.y_=null,t.apply(e))))}updateLimboDocument(e,t){return this.v_(e,t).next((r=>{r?this.b_.delete(t.toString()):this.b_.add(t.toString())}))}V_(e){return 0}v_(e,t){return R.or([()=>R.resolve(this.g_.containsKey(t)),()=>this.persistence.getTargetCache().containsKey(e,t),()=>this.persistence.p_(e,t)])}}class $a{constructor(e,t){this.persistence=e,this.S_=new fn((r=>Ke(r.path)),((r,s)=>r.isEqual(s))),this.garbageCollector=y_(this,t)}static w_(e,t){return new $a(e,t)}f_(){}m_(e){return R.resolve()}forEachTarget(e,t){return this.persistence.getTargetCache().forEachTarget(e,t)}rr(e){const t=this.xs(e);return this.persistence.getTargetCache().getTargetCount(e).next((r=>t.next((s=>r+s))))}xs(e){let t=0;return this.ir(e,(r=>{t++})).next((()=>t))}ir(e,t){return R.forEach(this.S_,((r,s)=>this.Fs(e,r,s).next((i=>i?R.resolve():t(s)))))}removeTargets(e,t,r){return this.persistence.getTargetCache().removeTargets(e,t,r)}removeOrphanedDocuments(e,t){let r=0;const s=this.persistence.getRemoteDocumentCache(),i=s.newChangeBuffer();return s.u_(e,(o=>this.Fs(e,o,t).next((c=>{c||(r++,i.removeEntry(o,j.min()))})))).next((()=>i.apply(e))).next((()=>r))}markPotentiallyOrphaned(e,t){return this.S_.set(t,e.currentSequenceNumber),R.resolve()}removeTarget(e,t){const r=t.withSequenceNumber(e.currentSequenceNumber);return this.persistence.getTargetCache().updateTargetData(e,r)}addReference(e,t,r){return this.S_.set(r,e.currentSequenceNumber),R.resolve()}removeReference(e,t,r){return this.S_.set(r,e.currentSequenceNumber),R.resolve()}updateLimboDocument(e,t){return this.S_.set(t,e.currentSequenceNumber),R.resolve()}V_(e){let t=e.key.toString().length;return e.isFoundDocument()&&(t+=aa(e.data.value)),t}Fs(e,t,r){return R.or([()=>this.persistence.p_(e,t),()=>this.persistence.getTargetCache().containsKey(e,t),()=>{const s=this.S_.get(t);return R.resolve(s!==void 0&&s>r)}])}getCacheSize(e){return this.persistence.getRemoteDocumentCache().getSize(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Jb{constructor(e){this.serializer=e}Mn(e,t,r,s){const i=new lc("createOrUpgrade",t);r<1&&s>=1&&((function(u){u.createObjectStore(Ro)})(e),(function(u){u.createObjectStore(ro,{keyPath:eb}),u.createObjectStore(wt,{keyPath:cp,autoIncrement:!0}).createIndex(yr,up,{unique:!0}),u.createObjectStore(bs)})(e),bp(e),(function(u){u.createObjectStore(lr)})(e));let o=R.resolve();return r<3&&s>=3&&(r!==0&&((function(u){u.deleteObjectStore(Vs),u.deleteObjectStore(Ss),u.deleteObjectStore(Er)})(e),bp(e)),o=o.next((()=>(function(u){const l=u.store(Er),d={highestTargetId:0,highestListenSequenceNumber:0,lastRemoteSnapshotVersion:j.min().toTimestamp(),targetCount:0};return l.put(Ma,d)})(i)))),r<4&&s>=4&&(r!==0&&(o=o.next((()=>(function(u,l){return l.store(wt).Kn().next((p=>{u.deleteObjectStore(wt),u.createObjectStore(wt,{keyPath:cp,autoIncrement:!0}).createIndex(yr,up,{unique:!0});const g=l.store(wt),w=p.map((S=>g.put(S)));return R.waitFor(w)}))})(e,i)))),o=o.next((()=>{(function(u){u.createObjectStore(Cs,{keyPath:ub})})(e)}))),r<5&&s>=5&&(o=o.next((()=>this.D_(i)))),r<6&&s>=6&&(o=o.next((()=>((function(u){u.createObjectStore(so)})(e),this.x_(i))))),r<7&&s>=7&&(o=o.next((()=>this.C_(i)))),r<8&&s>=8&&(o=o.next((()=>this.F_(e,i)))),r<9&&s>=9&&(o=o.next((()=>{(function(u){u.objectStoreNames.contains("remoteDocumentChanges")&&u.deleteObjectStore("remoteDocumentChanges")})(e)}))),r<10&&s>=10&&(o=o.next((()=>this.O_(i)))),r<11&&s>=11&&(o=o.next((()=>{(function(u){u.createObjectStore(yc,{keyPath:lb})})(e),(function(u){u.createObjectStore(Ic,{keyPath:hb})})(e)}))),r<12&&s>=12&&(o=o.next((()=>{(function(u){const l=u.createObjectStore(wc,{keyPath:yb});l.createIndex(qu,Ib,{unique:!1}),l.createIndex(J_,wb,{unique:!1})})(e)}))),r<13&&s>=13&&(o=o.next((()=>(function(u){const l=u.createObjectStore(La,{keyPath:nb});l.createIndex(fa,rb),l.createIndex(K_,sb)})(e))).next((()=>this.M_(e,i))).next((()=>e.deleteObjectStore(lr)))),r<14&&s>=14&&(o=o.next((()=>this.N_(e,i)))),r<15&&s>=15&&(o=o.next((()=>(function(u){u.createObjectStore(ah,{keyPath:db,autoIncrement:!0}).createIndex(Bu,fb,{unique:!1}),u.createObjectStore(Bi,{keyPath:pb}).createIndex(H_,mb,{unique:!1}),u.createObjectStore(qi,{keyPath:gb}).createIndex(Q_,_b,{unique:!1})})(e)))),r<16&&s>=16&&(o=o.next((()=>{t.objectStore(Bi).clear()})).next((()=>{t.objectStore(qi).clear()}))),r<17&&s>=17&&(o=o.next((()=>{(function(u){u.createObjectStore(ch,{keyPath:Tb})})(e)}))),r<18&&s>=18&&dm()&&(o=o.next((()=>{t.objectStore(Bi).clear()})).next((()=>{t.objectStore(qi).clear()}))),o}x_(e){let t=0;return e.store(lr).jn(((r,s)=>{t+=Fa(s)})).next((()=>{const r={byteSize:t};return e.store(so).put(Uu,r)}))}D_(e){const t=e.store(ro),r=e.store(wt);return t.Kn().next((s=>R.forEach(s,(i=>{const o=IDBKeyRange.bound([i.userId,Ln],[i.userId,i.lastAcknowledgedBatchId]);return r.Kn(yr,o).next((c=>R.forEach(c,(u=>{L(u.userId===i.userId,18650,"Cannot process batch from unexpected user",{batchId:u.batchId});const l=fr(this.serializer,u);return ty(e,i.userId,l).next((()=>{}))}))))}))))}C_(e){const t=e.store(Vs),r=e.store(lr);return e.store(Er).get(Ma).next((s=>{const i=[];return r.jn(((o,c)=>{const u=new J(o),l=(function(p){return[0,Ke(p)]})(u);i.push(t.get(l).next((d=>d?R.resolve():(p=>t.put({targetId:0,path:Ke(p),sequenceNumber:s.highestListenSequenceNumber}))(u))))})).next((()=>R.waitFor(i)))}))}F_(e,t){e.createObjectStore(io,{keyPath:cb});const r=t.store(io),s=new dh,i=o=>{if(s.add(o)){const c=o.lastSegment(),u=o.popLast();return r.put({collectionId:c,parent:Ke(u)})}};return t.store(lr).jn({zn:!0},((o,c)=>{const u=new J(o);return i(u.popLast())})).next((()=>t.store(bs).jn({zn:!0},(([o,c,u],l)=>{const d=Lt(c);return i(d.popLast())}))))}O_(e){const t=e.store(Ss);return t.jn(((r,s)=>{const i=Ci(this.serializer,s),o=ry(this.serializer,i);return t.put(o)}))}M_(e,t){const r=t.store(lr),s=[];return r.jn(((i,o)=>{const c=t.store(La),u=(function(p){return p.document?new M(J.fromString(p.document.name).popFirst(5)):p.noDocument?M.fromSegments(p.noDocument.path):p.unknownDocument?M.fromSegments(p.unknownDocument.path):q(36783)})(o).path.toArray(),l={prefixPath:u.slice(0,u.length-2),collectionGroup:u[u.length-2],documentId:u[u.length-1],readTime:o.readTime||[0,0],unknownDocument:o.unknownDocument,noDocument:o.noDocument,document:o.document,hasCommittedMutations:!!o.hasCommittedMutations};s.push(c.put(l))})).next((()=>R.waitFor(s)))}N_(e,t){const r=t.store(wt),s=hy(this.serializer),i=new ph(Rc.w_,this.serializer.qr);return r.Kn().next((o=>{const c=new Map;return o.forEach((u=>{let l=c.get(u.userId)??Q();fr(this.serializer,u).keys().forEach((d=>l=l.add(d))),c.set(u.userId,l)})),R.forEach(c,((u,l)=>{const d=new Le(l),p=vc.Kr(this.serializer,d),g=i.getIndexManager(d),w=Ec.Kr(d,this.serializer,g,i.referenceDelegate);return new dy(s,w,p,g).recalculateAndSaveOverlaysForDocumentKeys(new $u(t,nt.yn),u).next()}))}))}}function bp(n){n.createObjectStore(Vs,{keyPath:ob}).createIndex(oh,ab,{unique:!0}),n.createObjectStore(Ss,{keyPath:"targetId"}).createIndex(W_,ib,{unique:!0}),n.createObjectStore(Er)}const Rn="IndexedDbPersistence",du=18e5,fu=5e3,pu="Failed to obtain exclusive access to the persistence layer. To allow shared access, multi-tab synchronization has to be enabled in all tabs. If you are using `experimentalForceOwningTab:true`, make sure that only one tab has persistence enabled at any given time.",fy="main";class mh{constructor(e,t,r,s,i,o,c,u,l,d,p=18){if(this.allowTabSynchronization=e,this.persistenceKey=t,this.clientId=r,this.xt=i,this.window=o,this.document=c,this.L_=l,this.B_=d,this.U_=p,this.P_=null,this.R_=!1,this.isPrimary=!1,this.networkEnabled=!0,this.k_=null,this.inForeground=!1,this.q_=null,this.K_=null,this.W_=Number.NEGATIVE_INFINITY,this.Q_=g=>Promise.resolve(),!mh.Je())throw new N(b.UNIMPLEMENTED,"This platform is either missing IndexedDB or is known to have an incomplete implementation. Offline persistence has been disabled.");this.referenceDelegate=new Mb(this,s),this.G_=t+fy,this.serializer=new ny(u),this.z_=new qt(this.G_,this.U_,new Jb(this.serializer)),this.I_=new Sb,this.A_=new Lb(this.referenceDelegate,this.serializer),this.remoteDocumentCache=hy(this.serializer),this.d_=new bb,this.window&&this.window.localStorage?this.j_=this.window.localStorage:(this.j_=null,d===!1&&Te(Rn,"LocalStorage is unavailable. As a result, persistence may not work reliably. In particular enablePersistence() could fail immediately after refreshing the page."))}start(){return this.H_().then((()=>{if(!this.isPrimary&&!this.allowTabSynchronization)throw new N(b.FAILED_PRECONDITION,pu);return this.J_(),this.Y_(),this.Z_(),this.runTransaction("getHighestListenSequenceNumber","readonly",(e=>this.A_.getHighestSequenceNumber(e)))})).then((e=>{this.P_=new nt(e,this.L_)})).then((()=>{this.R_=!0})).catch((e=>(this.z_&&this.z_.close(),Promise.reject(e))))}X_(e){return this.Q_=async t=>{if(this.started)return e(t)},e(this.isPrimary)}setDatabaseDeletedListener(e){this.z_.Ln((async t=>{t.newVersion===null&&await e()}))}setNetworkEnabled(e){this.networkEnabled!==e&&(this.networkEnabled=e,this.xt.enqueueAndForget((async()=>{this.started&&await this.H_()})))}H_(){return this.runTransaction("updateClientMetadataAndTryBecomePrimary","readwrite",(e=>ea(e).put({clientId:this.clientId,updateTimeMs:Date.now(),networkEnabled:this.networkEnabled,inForeground:this.inForeground}).next((()=>{if(this.isPrimary)return this.eo(e).next((t=>{t||(this.isPrimary=!1,this.xt.enqueueRetryable((()=>this.Q_(!1))))}))})).next((()=>this.no(e))).next((t=>this.isPrimary&&!t?this.ro(e).next((()=>!1)):!!t&&this.io(e).next((()=>!0)))))).catch((e=>{if(Xn(e))return O(Rn,"Failed to extend owner lease: ",e),this.isPrimary;if(!this.allowTabSynchronization)throw e;return O(Rn,"Releasing owner lease after error during lease refresh",e),!1})).then((e=>{this.isPrimary!==e&&this.xt.enqueueRetryable((()=>this.Q_(e))),this.isPrimary=e}))}eo(e){return Ai(e).get(Jr).next((t=>R.resolve(this.so(t))))}_o(e){return ea(e).delete(this.clientId)}async oo(){if(this.isPrimary&&!this.ao(this.W_,du)){this.W_=Date.now();const e=await this.runTransaction("maybeGarbageCollectMultiClientState","readwrite-primary",(t=>{const r=De(t,Cs);return r.Kn().next((s=>{const i=this.uo(s,du),o=s.filter((c=>i.indexOf(c)===-1));return R.forEach(o,(c=>r.delete(c.clientId))).next((()=>o))}))})).catch((()=>[]));if(this.j_)for(const t of e)this.j_.removeItem(this.co(t.clientId))}}Z_(){this.K_=this.xt.enqueueAfterDelay("client_metadata_refresh",4e3,(()=>this.H_().then((()=>this.oo())).then((()=>this.Z_()))))}so(e){return!!e&&e.ownerId===this.clientId}no(e){return this.B_?R.resolve(!0):Ai(e).get(Jr).next((t=>{if(t!==null&&this.ao(t.leaseTimestampMs,fu)&&!this.lo(t.ownerId)){if(this.so(t)&&this.networkEnabled)return!0;if(!this.so(t)){if(!t.allowTabSynchronization)throw new N(b.FAILED_PRECONDITION,pu);return!1}}return!(!this.networkEnabled||!this.inForeground)||ea(e).Kn().next((r=>this.uo(r,fu).find((s=>{if(this.clientId!==s.clientId){const i=!this.networkEnabled&&s.networkEnabled,o=!this.inForeground&&s.inForeground,c=this.networkEnabled===s.networkEnabled;if(i||o&&c)return!0}return!1}))===void 0))})).next((t=>(this.isPrimary!==t&&O(Rn,`Client ${t?"is":"is not"} eligible for a primary lease.`),t)))}async shutdown(){this.R_=!1,this.Eo(),this.K_&&(this.K_.cancel(),this.K_=null),this.ho(),this.To(),await this.z_.runTransaction("shutdown","readwrite",[Ro,Cs],(e=>{const t=new $u(e,nt.yn);return this.ro(t).next((()=>this._o(t)))})),this.z_.close(),this.Po()}uo(e,t){return e.filter((r=>this.ao(r.updateTimeMs,t)&&!this.lo(r.clientId)))}Ro(){return this.runTransaction("getActiveClients","readonly",(e=>ea(e).Kn().next((t=>this.uo(t,du).map((r=>r.clientId))))))}get started(){return this.R_}getGlobalsCache(){return this.I_}getMutationQueue(e,t){return Ec.Kr(e,this.serializer,t,this.referenceDelegate)}getTargetCache(){return this.A_}getRemoteDocumentCache(){return this.remoteDocumentCache}getIndexManager(e){return new Ob(e,this.serializer.qr.databaseId)}getDocumentOverlayCache(e){return vc.Kr(this.serializer,e)}getBundleCache(){return this.d_}runTransaction(e,t,r){O(Rn,"Starting transaction:",e);const s=t==="readonly"?"readonly":"readwrite",i=(function(u){return u===18?Ab:u===17?ey:u===16?vb:u===15?uh:u===14?Z_:u===13?X_:u===12?Eb:u===11?Y_:void q(60245)})(this.U_);let o;return this.z_.runTransaction(e,s,i,(c=>(o=new $u(c,this.P_?this.P_.next():nt.yn),t==="readwrite-primary"?this.eo(o).next((u=>!!u||this.no(o))).next((u=>{if(!u)throw Te(`Failed to obtain primary lease for action '${e}'.`),this.isPrimary=!1,this.xt.enqueueRetryable((()=>this.Q_(!1))),new N(b.FAILED_PRECONDITION,f_);return r(o)})).next((u=>this.io(o).next((()=>u)))):this.Io(o).next((()=>r(o)))))).then((c=>(o.raiseOnCommittedEvent(),c)))}Io(e){return Ai(e).get(Jr).next((t=>{if(t!==null&&this.ao(t.leaseTimestampMs,fu)&&!this.lo(t.ownerId)&&!this.so(t)&&!(this.B_||this.allowTabSynchronization&&t.allowTabSynchronization))throw new N(b.FAILED_PRECONDITION,pu)}))}io(e){const t={ownerId:this.clientId,allowTabSynchronization:this.allowTabSynchronization,leaseTimestampMs:Date.now()};return Ai(e).put(Jr,t)}static Je(){return qt.Je()}ro(e){const t=Ai(e);return t.get(Jr).next((r=>this.so(r)?(O(Rn,"Releasing primary lease."),t.delete(Jr)):R.resolve()))}ao(e,t){const r=Date.now();return!(e<r-t)&&(!(e>r)||(Te(`Detected an update time that is in the future: ${e} > ${r}`),!1))}J_(){this.document!==null&&typeof this.document.addEventListener=="function"&&(this.q_=()=>{this.xt.enqueueAndForget((()=>(this.inForeground=this.document.visibilityState==="visible",this.H_())))},this.document.addEventListener("visibilitychange",this.q_),this.inForeground=this.document.visibilityState==="visible")}ho(){this.q_&&(this.document.removeEventListener("visibilitychange",this.q_),this.q_=null)}Y_(){var e;typeof((e=this.window)==null?void 0:e.addEventListener)=="function"&&(this.k_=()=>{this.Eo();const t=/(?:Version|Mobile)\/1[456]/;hm()&&(navigator.appVersion.match(t)||navigator.userAgent.match(t))&&this.xt.enterRestrictedMode(!0),this.xt.enqueueAndForget((()=>this.shutdown()))},this.window.addEventListener("pagehide",this.k_))}To(){this.k_&&(this.window.removeEventListener("pagehide",this.k_),this.k_=null)}lo(e){var t;try{const r=((t=this.j_)==null?void 0:t.getItem(this.co(e)))!==null;return O(Rn,`Client '${e}' ${r?"is":"is not"} zombied in LocalStorage`),r}catch(r){return Te(Rn,"Failed to get zombied client id.",r),!1}}Eo(){if(this.j_)try{this.j_.setItem(this.co(this.clientId),String(Date.now()))}catch(e){Te("Failed to set zombie client id.",e)}}Po(){if(this.j_)try{this.j_.removeItem(this.co(this.clientId))}catch{}}co(e){return`firestore_zombie_${this.persistenceKey}_${e}`}}function Ai(n){return De(n,Ro)}function ea(n){return De(n,Cs)}function gh(n,e){let t=n.projectId;return n.isDefaultDatabase||(t+="."+n.database),"firestore/"+e+"/"+t+"/"}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class _h{constructor(e,t,r,s){this.targetId=e,this.fromCache=t,this.Ao=r,this.Vo=s}static fo(e,t){let r=Q(),s=Q();for(const i of t.docChanges)switch(i.type){case 0:r=r.add(i.doc.key);break;case 1:s=s.add(i.doc.key)}return new _h(e,t.fromCache,r,s)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Yb(n,e){return M.comparator(n.key,e.key)}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Xb{constructor(){this._documentReadCount=0}get documentReadCount(){return this._documentReadCount}incrementDocumentReadCount(e){this._documentReadCount+=e}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class py{constructor(){this.mo=!1,this.po=!1,this.yo=100,this.wo=(function(){return hm()?8:m_(Ce())>0?6:4})()}initialize(e,t){this.bo=e,this.indexManager=t,this.mo=!0}getDocumentsMatchingQuery(e,t,r,s){const i={result:null};return this.vo(e,t).next((o=>{i.result=o})).next((()=>{if(!i.result)return this.So(e,t,s,r).next((o=>{i.result=o}))})).next((()=>{if(i.result)return;const o=new Xb;return this.Do(e,t,o).next((c=>{if(i.result=c,this.po)return this.xo(e,t,o,c.size)}))})).next((()=>i.result))}xo(e,t,r,s){return Ie(t)?R.resolve():r.documentReadCount<this.yo?(ns()<=Z.DEBUG&&O("QueryEngine","SDK will not create cache indexes for query:",ki(t),"since it only creates cache indexes for collection contains","more than or equal to",this.yo,"documents"),R.resolve()):(ns()<=Z.DEBUG&&O("QueryEngine","Query:",ki(t),"scans",r.documentReadCount,"local documents and returns",s,"documents as results."),r.documentReadCount>this.wo*s?(ns()<=Z.DEBUG&&O("QueryEngine","The SDK decides to create cache indexes for query:",ki(t),"as using cache indexes may help improve performance."),this.indexManager.createTargetIndexes(e,Ge(t))):R.resolve())}vo(e,t){if(Ie(t))return R.resolve(null);let r=t;if(jf(r))return R.resolve(null);let s=Ge(r);return this.indexManager.getIndexType(e,s).next((i=>i===0?null:(r.limit!==null&&i===1&&(r=xa(r,null,"F"),s=Ge(r)),this.indexManager.getDocumentsMatchingTarget(e,s).next((o=>{const c=Q(...o);return this.bo.getDocuments(e,c).next((u=>this.indexManager.getMinOffset(e,s).next((l=>{const d=this.Co(r,u);return this.Fo(r,d,c,l.readTime)?this.vo(e,xa(r,null,"F")):this.Oo(e,d,r,l)}))))})))))}So(e,t,r,s){return(Ie(t)?(function(o){for(const c of o.stages){if(c instanceof Gn||c instanceof ip)return!1;if(c instanceof Eo){if(c.condition instanceof N_&&c.condition._expr.name==="exists"&&c.condition._expr.params[0]instanceof jr&&c.condition._expr.params[0].fieldName===Dt)continue;return!1}}return!0})(t):jf(t))||s.isEqual(j.min())?R.resolve(null):this.bo.getDocuments(e,r).next((i=>{const o=this.Co(t,i);return this.Fo(t,o,r,s)?R.resolve(null):(ns()<=Z.DEBUG&&O("QueryEngine","Re-using previous result from %s to execute query: %s",s.toString(),op(t)),this.Oo(e,o,t,Dg(s,Es)).next((c=>c)))}))}Co(e,t){let r,s;return Ie(e)?(r=new ce(Yb),s=i=>Ac(e,i)):(r=new ce(ac(e)),s=i=>oc(e,i)),t.forEach(((i,o)=>{s(o)&&(r=r.add(o))})),r}Fo(e,t,r,s){if(Ie(e))return(function(c){return c.stages.some((u=>u instanceof Gn||u instanceof ip))})(e);if(e.limit===null)return!1;if(r.size!==t.size)return!0;const i=e.limitType==="F"?t.last():t.first();return!!i&&(i.hasPendingWrites||i.version.compareTo(s)>0)}Do(e,t,r){return ns()<=Z.DEBUG&&O("QueryEngine","Using full collection scan to execute query:",op(t)),this.bo.getDocumentsMatchingQuery(e,t,ft.min(),r)}Oo(e,t,r,s){return this.bo.getDocumentsMatchingQuery(e,r,s).next((i=>(t.forEach((o=>{i=i.insert(o.key,o)})),i)))}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const yh="LocalStore",Zb=3e8;class eS{constructor(e,t,r,s){this.persistence=e,this.Mo=t,this.serializer=s,this.No=new de(H),this.Lo=new fn((i=>_c(i)),rh),this.Bo=new Map,this.Uo=e.getRemoteDocumentCache(),this.A_=e.getTargetCache(),this.d_=e.getBundleCache(),this.ko(r)}ko(e){this.documentOverlayCache=this.persistence.getDocumentOverlayCache(e),this.indexManager=this.persistence.getIndexManager(e),this.mutationQueue=this.persistence.getMutationQueue(e,this.indexManager),this.localDocuments=new dy(this.Uo,this.mutationQueue,this.documentOverlayCache,this.indexManager),this.Uo.setIndexManager(this.indexManager),this.Mo.initialize(this.localDocuments,this.indexManager)}collectGarbage(e){return this.persistence.runTransaction("Collect garbage","readwrite-primary",(t=>e.collect(t,this.No)))}}function my(n,e,t,r){return new eS(n,e,t,r)}async function gy(n,e){const t=U(n);return await t.persistence.runTransaction("Handle user change","readonly",(r=>{let s;return t.mutationQueue.getAllMutationBatches(r).next((i=>(s=i,t.ko(e),t.mutationQueue.getAllMutationBatches(r)))).next((i=>{const o=[],c=[];let u=Q();for(const l of s){o.push(l.batchId);for(const d of l.mutations)u=u.add(d.key)}for(const l of i){c.push(l.batchId);for(const d of l.mutations)u=u.add(d.key)}return t.localDocuments.getDocuments(r,u).next((l=>({qo:l,removedBatchIds:o,addedBatchIds:c})))}))}))}function tS(n,e){const t=U(n);return t.persistence.runTransaction("Acknowledge batch","readwrite-primary",(r=>{const s=e.batch.keys(),i=t.Uo.newChangeBuffer({trackRemovals:!0});return(function(c,u,l,d){const p=l.batch,g=p.keys();let w=R.resolve();return g.forEach((S=>{w=w.next((()=>d.getEntry(u,S))).next((D=>{const k=l.docVersions.get(S);L(k!==null,48541),D.version.compareTo(k)<0&&(p.applyToRemoteDocument(D,l),D.isValidDocument()&&(D.setReadTime(l.commitVersion),d.addEntry(D)))}))})),w.next((()=>c.mutationQueue.removeMutationBatch(u,p)))})(t,r,e,i).next((()=>i.apply(r))).next((()=>t.mutationQueue.performConsistencyCheck(r))).next((()=>t.documentOverlayCache.removeOverlaysForBatchId(r,s,e.batch.batchId))).next((()=>t.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(r,(function(c){let u=Q();for(let l=0;l<c.mutationResults.length;++l)c.mutationResults[l].transformResults.length>0&&(u=u.add(c.batch.mutations[l].key));return u})(e)))).next((()=>t.localDocuments.getDocuments(r,s)))}))}function _y(n){const e=U(n);return e.persistence.runTransaction("Get last remote snapshot version","readonly",(t=>e.A_.getLastRemoteSnapshotVersion(t)))}function nS(n,e){const t=U(n),r=e.snapshotVersion;let s=t.No;return t.persistence.runTransaction("Apply remote event","readwrite-primary",(i=>{const o=t.Uo.newChangeBuffer({trackRemovals:!0});s=t.No;const c=[];e.targetChanges.forEach(((d,p)=>{const g=s.get(p);if(!g)return;c.push(t.A_.removeMatchingKeys(i,d.removedDocuments,p).next((()=>t.A_.addMatchingKeys(i,d.addedDocuments,p))));let w=g.withSequenceNumber(i.currentSequenceNumber);e.targetMismatches.get(p)!==null?w=w.withResumeToken(pe.EMPTY_BYTE_STRING,j.min()).withLastLimboFreeSnapshotVersion(j.min()):d.resumeToken.approximateByteSize()>0&&(w=w.withResumeToken(d.resumeToken,r)),s=s.insert(p,w),(function(D,k,$){return D.resumeToken.approximateByteSize()===0||k.snapshotVersion.toMicroseconds()-D.snapshotVersion.toMicroseconds()>=Zb?!0:$.addedDocuments.size+$.modifiedDocuments.size+$.removedDocuments.size>0})(g,w,d)&&c.push(t.A_.updateTargetData(i,w))}));let u=Re(),l=Q();if(e.documentUpdates.forEach((d=>{e.resolvedLimboDocuments.has(d)&&c.push(t.persistence.referenceDelegate.updateLimboDocument(i,d))})),c.push(yy(i,o,e.documentUpdates).next((d=>{u=d.$o,l=d.Ko}))),!r.isEqual(j.min())){const d=t.A_.getLastRemoteSnapshotVersion(i).next((p=>t.A_.setTargetsMetadata(i,i.currentSequenceNumber,r)));c.push(d)}return R.waitFor(c).next((()=>o.apply(i))).next((()=>t.localDocuments.getLocalViewOfDocuments(i,u,l))).next((()=>u))})).then((i=>(t.No=s,i)))}function yy(n,e,t){let r=Q(),s=Q();return t.forEach((i=>r=r.add(i))),e.getEntries(n,r).next((i=>{let o=Re();return t.forEach(((c,u)=>{const l=i.get(c);u.isFoundDocument()!==l.isFoundDocument()&&(s=s.add(c)),u.isNoDocument()&&u.version.isEqual(j.min())?(e.removeEntry(c,u.readTime),o=o.insert(c,u)):!l.isValidDocument()||u.version.compareTo(l.version)>0||u.version.compareTo(l.version)===0&&l.hasPendingWrites?(e.addEntry(u),o=o.insert(c,u)):O(yh,"Ignoring outdated watch update for ",c,". Current version:",l.version," Watch version:",u.version)})),{$o:o,Ko:s}}))}function rS(n,e){const t=U(n);return t.persistence.runTransaction("Get next mutation batch","readonly",(r=>(e===void 0&&(e=Ln),t.mutationQueue.getNextMutationBatchAfterBatchId(r,e))))}function xs(n,e){const t=U(n);return t.persistence.runTransaction("Allocate target","readwrite",(r=>{let s;return t.A_.getTargetData(r,e).next((i=>i?(s=i,R.resolve(s)):t.A_.allocateTargetId(r).next((o=>(s=new Mt(e,o,"TargetPurposeListen",r.currentSequenceNumber),t.A_.addTargetData(r,s).next((()=>s)))))))})).then((r=>{const s=t.No.get(r.targetId);return(s===null||r.snapshotVersion.compareTo(s.snapshotVersion)>0)&&(t.No=t.No.insert(r.targetId,r),t.Lo.set(e,r.targetId)),r}))}async function Ns(n,e,t){const r=U(n),s=r.No.get(e),i=t?"readwrite":"readwrite-primary";try{t||await r.persistence.runTransaction("Release target",i,(o=>r.persistence.referenceDelegate.removeTarget(o,s)))}catch(o){if(!Xn(o))throw o;O(yh,`Failed to update sequence numbers for target ${e}: ${o}`)}r.No=r.No.remove(e),r.Lo.delete(s.target)}function ja(n,e,t){const r=U(n);let s=j.min(),i=Q();return r.persistence.runTransaction("Execute query","readwrite",(o=>(function(u,l,d){const p=U(u),g=p.Lo.get(d);return g!==void 0?R.resolve(p.No.get(g)):p.A_.getTargetData(l,d)})(r,o,Ie(e)?e:Ge(e)).next((c=>{if(c)return s=c.lastLimboFreeSnapshotVersion,r.A_.getMatchingKeysForTargetId(o,c.targetId).next((u=>{i=u}))})).next((()=>r.Mo.getDocumentsMatchingQuery(o,e,t?s:j.min(),t?i:Q()))).next((c=>(wy(r,c),{documents:c,Wo:i})))))}function Iy(n,e){const t=U(n),r=U(t.A_),s=t.No.get(e);return s?Promise.resolve(s.target??null):t.persistence.runTransaction("Get target data","readonly",(i=>r.ge(i,e).next((o=>(o==null?void 0:o.target)??null))))}function Wu(n,e){const t=U(n),r=t.Bo.get(e)||j.min();return t.persistence.runTransaction("Get new document changes","readonly",(s=>t.Uo.getAllFromCollectionGroup(s,e,Dg(r,Es),Number.MAX_SAFE_INTEGER))).then((s=>(wy(t,s),s)))}function wy(n,e){e.forEach(((t,r)=>{const s=r.key.getCollectionGroup(),i=n.Bo.get(s)||j.min();r.readTime.compareTo(i)>0&&n.Bo.set(s,r.readTime)}))}async function sS(n,e,t,r){const s=U(n);let i=Q(),o=Re();for(const l of t){const d=e.Qo(l.metadata.name);l.document&&(i=i.add(d));const p=e.Go(l);p.setReadTime(e.zo(l.metadata.readTime)),o=o.insert(d,p)}const c=s.Uo.newChangeBuffer({trackRemovals:!0}),u=await xs(s,(function(d){return Ge(Gs(J.fromString(`__bundle__/docs/${d}`)))})(r));return s.persistence.runTransaction("Apply bundle documents","readwrite",(l=>yy(l,c,o).next((d=>(c.apply(l),d))).next((d=>s.A_.removeMatchingKeysForTargetId(l,u.targetId).next((()=>s.A_.addMatchingKeys(l,i,u.targetId))).next((()=>s.localDocuments.getLocalViewOfDocuments(l,d.$o,d.Ko))).next((()=>d.$o))))))}async function iS(n,e,t=Q()){const r=await xs(n,Ge(Tc(e.bundledQuery))),s=U(n);return s.persistence.runTransaction("Save named query","readwrite",(i=>{const o=ve(e.readTime);if(r.snapshotVersion.compareTo(o)>=0)return s.d_.saveNamedQuery(i,e);const c=r.withResumeToken(pe.EMPTY_BYTE_STRING,o);return s.No=s.No.insert(c.targetId,c),s.A_.updateTargetData(i,c).next((()=>s.A_.removeMatchingKeysForTargetId(i,r.targetId))).next((()=>s.A_.addMatchingKeys(i,t,r.targetId))).next((()=>s.d_.saveNamedQuery(i,e)))}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ty{constructor(e,t){this.jo=e,this.byteLength=t}Ho(){return"metadata"in this.jo}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Sp(n,e=10240){let t=0;return{async read(){if(t<n.byteLength){const r={value:n.slice(t,t+e),done:!1};return t+=e,r}return{done:!0}},async cancel(){},releaseLock(){},closed:Promise.resolve()}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oS{constructor(e,t){this.asyncQueue=e,this.onlineStateHandler=t,this.state="Unknown",this.Jo=0,this.Yo=null,this.Zo=!0}Xo(){this.Jo===0&&(this.ea("Unknown"),this.Yo=this.asyncQueue.enqueueAfterDelay("online_state_timeout",1e4,(()=>(this.Yo=null,this.ta("Backend didn't respond within 10 seconds."),this.ea("Offline"),Promise.resolve()))))}na(e){this.state==="Online"?this.ea("Unknown"):(this.Jo++,this.Jo>=1&&(this.ra(),this.ta(`Connection failed 1 times. Most recent error: ${e.toString()}`),this.ea("Offline")))}set(e){this.ra(),this.Jo=0,e==="Online"&&(this.Zo=!1),this.ea(e)}ea(e){e!==this.state&&(this.state=e,this.onlineStateHandler(e))}ta(e){const t=`Could not reach Cloud Firestore backend. ${e}
This typically indicates that your device does not have a healthy Internet connection at the moment. The client will operate in offline mode until it is able to successfully connect to the backend.`;this.Zo?(Te(t),this.Zo=!1):O("OnlineStateTracker",t)}ra(){this.Yo!==null&&(this.Yo.cancel(),this.Yo=null)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Gt="RemoteStore";class aS{constructor(e,t,r,s,i){this.localStore=e,this.datastore=t,this.asyncQueue=r,this.remoteSyncer={},this.ia=[],this.sa=new Map,this._a=new Map,this.oa=new Map,this.aa=new cn(1e3),this.ua=new cn(1001),this.ca=new Set,this.la=[],this.Ea=i,this.Ea.Ke((o=>{r.enqueueAndForget((async()=>{Zn(this)&&(O(Gt,"Restarting streams for network reachability change."),await(async function(u){const l=U(u);l.ca.add(4),await Qs(l),l.ha.set("Unknown"),l.ca.delete(4),await Po(l)})(this))}))})),this.ha=new oS(r,s)}}async function Po(n){if(Zn(n))for(const e of n.la)await e(!0)}async function Qs(n){for(const e of n.la)await e(!1)}function Hu(n,e){return n._a.get(e)||void 0}function Pc(n,e){const t=U(n),r=Hu(t,e.targetId);if(r!==void 0&&t.sa.has(r))return;const s=(function(c,u){const l=Hu(c,u);l!==void 0&&c.oa.delete(l);const d=(function(g,w){return w%2!=0?g.ua.next():g.aa.next()})(c,u);return c._a.set(u,d),c.oa.set(d,u),d})(t,e.targetId);O(Gt,"remoteStoreListen mapping SDK target ID to remote",e.targetId,s);const i=new Mt(e.target,s,e.purpose,e.sequenceNumber,e.snapshotVersion,e.lastLimboFreeSnapshotVersion,e.resumeToken);t.sa.set(s,i),Th(t)?wh(t):Ys(t).Jt()&&Ih(t,i)}function Ds(n,e){const t=U(n),r=Ys(t),s=Hu(t,e);O(Gt,"remoteStoreUnlisten removing mapping of SDK target ID to remote",e,s),t.sa.delete(s),t._a.delete(e),t.oa.delete(s),r.Jt()&&Ey(t,s),t.sa.size===0&&(r.Jt()?r.Xt():Zn(t)&&t.ha.set("Unknown"))}function Ih(n,e){if(n.Ta.H(e.targetId),e.resumeToken.approximateByteSize()>0||e.snapshotVersion.compareTo(j.min())>0){const t=n.oa.get(e.targetId);if(t===void 0)return void O(Gt,"SDK target ID not found for remote ID: "+e.targetId);const r=n.remoteSyncer.getRemoteKeysForTarget(t).size;e=e.withExpectedCount(r)}Ys(n).Tn(e)}function Ey(n,e){n.Ta.H(e),Ys(n).Pn(e)}function wh(n){n.Ta=new DA({getRemoteKeysForTarget:e=>{const t=n.oa.get(e);return t!==void 0?n.remoteSyncer.getRemoteKeysForTarget(t):Q()},ge:e=>n.sa.get(e)||null,Ae:()=>n.datastore.serializer.databaseId}),Ys(n).start(),n.ha.Xo()}function Th(n){return Zn(n)&&!Ys(n).Ht()&&n.sa.size>0}function Zn(n){return U(n).ca.size===0}function vy(n){n.Ta=void 0}async function cS(n){n.ha.set("Online")}async function uS(n){n.sa.forEach(((e,t)=>{Ih(n,e)}))}async function lS(n,e){vy(n),Th(n)?(n.ha.na(e),wh(n)):n.ha.set("Unknown")}async function hS(n,e,t){if(n.ha.set("Online"),e instanceof Kg&&e.state===2&&e.cause)try{await(async function(s,i){const o=i.cause;for(const c of i.targetIds){if(s.sa.has(c)){const u=s.oa.get(c);u!==void 0&&(await s.remoteSyncer.rejectListen(u,o),s._a.delete(u),s.oa.delete(c)),s.sa.delete(c)}s.Ta.removeTarget(c)}})(n,e)}catch(r){O(Gt,"Failed to remove targets %s: %s ",e.targetIds.join(","),r),await za(n,r)}else if(e instanceof ua?n.Ta.se(e):e instanceof Gg?n.Ta.Ee(e):n.Ta.ae(e),!t.isEqual(j.min()))try{const r=await _y(n.localStore);t.compareTo(r)>=0&&await(function(i,o){const c=i.Ta.de(o);c.targetChanges.forEach(((l,d)=>{if(l.resumeToken.approximateByteSize()>0){const p=i.sa.get(d);p&&i.sa.set(d,p.withResumeToken(l.resumeToken,o))}})),c.targetMismatches.forEach(((l,d)=>{const p=i.sa.get(l);if(!p)return;i.sa.set(l,p.withResumeToken(pe.EMPTY_BYTE_STRING,p.snapshotVersion)),Ey(i,l);const g=new Mt(p.target,l,d,p.sequenceNumber);Ih(i,g)}));const u=(function(d,p){const g=new Map;p.targetChanges.forEach(((S,D)=>{const k=d.oa.get(D);k!==void 0&&g.set(k,S)}));let w=new de(H);return p.targetMismatches.forEach(((S,D)=>{const k=d.oa.get(S);k!==void 0&&(w=w.insert(k,D))})),new Ks(p.snapshotVersion,g,w,p.documentUpdates,p.augmentedDocumentUpdates,p.resolvedLimboDocuments)})(i,c);return i.remoteSyncer.applyRemoteEvent(u)})(n,t)}catch(r){O(Gt,"Failed to raise snapshot:",r),await za(n,r)}}async function za(n,e,t){if(!Xn(e))throw e;n.ca.add(1),await Qs(n),n.ha.set("Offline"),t||(t=()=>_y(n.localStore)),n.asyncQueue.enqueueRetryable((async()=>{O(Gt,"Retrying IndexedDB access"),await t(),n.ca.delete(1),await Po(n)}))}function Ay(n,e){return e().catch((t=>za(n,t,e)))}async function Js(n){const e=U(n),t=Wn(e);let r=e.ia.length>0?e.ia[e.ia.length-1].batchId:Ln;for(;dS(e);)try{const s=await rS(e.localStore,r);if(s===null){e.ia.length===0&&t.Xt();break}r=s.batchId,fS(e,s)}catch(s){await za(e,s)}Ry(e)&&Py(e)}function dS(n){return Zn(n)&&n.ia.length<10}function fS(n,e){n.ia.push(e);const t=Wn(n);t.Jt()&&t.Rn&&t.In(e.mutations)}function Ry(n){return Zn(n)&&!Wn(n).Ht()&&n.ia.length>0}function Py(n){Wn(n).start()}async function pS(n){Wn(n).dn()}async function mS(n){const e=Wn(n);for(const t of n.ia)e.In(t.mutations)}async function gS(n,e,t){const r=n.ia.shift(),s=ih.from(r,e,t);await Ay(n,(()=>n.remoteSyncer.applySuccessfulWrite(s))),await Js(n)}async function _S(n,e){e&&Wn(n).Rn&&await(async function(r,s){if((function(o){return Ug(o)&&o!==b.ABORTED})(s.code)){const i=r.ia.shift();Wn(r).Zt(),await Ay(r,(()=>r.remoteSyncer.rejectFailedWrite(i.batchId,s))),await Js(r)}})(n,e),Ry(n)&&Py(n)}async function Vp(n,e){const t=U(n);t.asyncQueue.verifyOperationInProgress(),O(Gt,"RemoteStore received new credentials");const r=Zn(t);t.ca.add(3),await Qs(t),r&&t.ha.set("Unknown"),await t.remoteSyncer.handleCredentialChange(e),t.ca.delete(3),await Po(t)}async function Qu(n,e){const t=U(n);e?(t.ca.delete(2),await Po(t)):e||(t.ca.add(2),await Qs(t),t.ha.set("Unknown"))}function Ys(n){return n.Pa||(n.Pa=(function(t,r,s){const i=U(t);return i.mn(),new rR(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{ut:cS.bind(null,n),lt:uS.bind(null,n),ht:lS.bind(null,n),hn:hS.bind(null,n)}),n.la.push((async e=>{e?(n.Pa.Zt(),Th(n)?wh(n):n.ha.set("Unknown")):(await n.Pa.stop(),vy(n))}))),n.Pa}function Wn(n){return n.Ra||(n.Ra=(function(t,r,s){const i=U(t);return i.mn(),new sR(r,i.connection,i.authCredentials,i.appCheckCredentials,i.serializer,s)})(n.datastore,n.asyncQueue,{ut:()=>Promise.resolve(),lt:pS.bind(null,n),ht:_S.bind(null,n),An:mS.bind(null,n),Vn:gS.bind(null,n)}),n.la.push((async e=>{e?(n.Ra.Zt(),await Js(n)):(await n.Ra.stop(),n.ia.length>0&&(O(Gt,`Stopping write stream with ${n.ia.length} pending writes`),n.ia=[]))}))),n.Ra}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class bc{constructor(e){this.observer=e,this.muted=!1}next(e){this.muted||this.observer.next&&this.Ia(this.observer.next,e)}error(e){this.muted||(this.observer.error?this.Ia(this.observer.error,e):Te("Uncaught Error in snapshot listener:",e.toString()))}Aa(){this.muted=!0}Ia(e,t){setTimeout((()=>{this.muted||e(t)}),0)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Eh{constructor(e,t,r,s,i){this.asyncQueue=e,this.timerId=t,this.targetTimeMs=r,this.op=s,this.removalCallback=i,this.deferred=new Fe,this.then=this.deferred.promise.then.bind(this.deferred.promise),this.deferred.promise.catch((o=>{}))}get promise(){return this.deferred.promise}static createAndSchedule(e,t,r,s,i){const o=Date.now()+r,c=new Eh(e,t,o,s,i);return c.start(r),c}start(e){this.timerHandle=setTimeout((()=>this.handleDelayElapsed()),e)}skipDelay(){return this.handleDelayElapsed()}cancel(e){this.timerHandle!==null&&(this.clearTimeout(),this.deferred.reject(new N(b.CANCELLED,"Operation cancelled"+(e?": "+e:""))))}handleDelayElapsed(){this.asyncQueue.enqueueAndForget((()=>this.timerHandle!==null?(this.clearTimeout(),this.op().then((e=>this.deferred.resolve(e)))):Promise.resolve()))}clearTimeout(){this.timerHandle!==null&&(this.removalCallback(this),clearTimeout(this.timerHandle),this.timerHandle=null)}}function Xs(n,e){if(Te("AsyncQueue",`${e}: ${n}`),Xn(n))return new N(b.UNAVAILABLE,`${e}: ${n}`);throw n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class yS{constructor(e,t){this.Va=e,this.serializer=t,this.metadata=new Fe,this.buffer=new Uint8Array,this.da=(function(){return new TextDecoder("utf-8")})(),this.fa().then((r=>{r&&r.Ho()?this.metadata.resolve(r.jo.metadata):this.metadata.reject(new Error(`The first element of the bundle is not a metadata, it is
             ${JSON.stringify(r==null?void 0:r.jo)}`))}),(r=>this.metadata.reject(r)))}close(){return this.Va.cancel()}async getMetadata(){return this.metadata.promise}async ma(){return await this.getMetadata(),this.fa()}async fa(){const e=await this.pa();if(e===null)return null;const t=this.da.decode(e),r=Number(t);isNaN(r)&&this.ga(`length string (${t}) is not valid number`);const s=await this.ya(r);return new Ty(JSON.parse(s),e.length+r)}wa(){return this.buffer.findIndex((e=>e===123))}async pa(){for(;this.wa()<0&&!await this.ba(););if(this.buffer.length===0)return null;const e=this.wa();e<0&&this.ga("Reached the end of bundle when a length string is expected.");const t=this.buffer.slice(0,e);return this.buffer=this.buffer.slice(e),t}async ya(e){for(;this.buffer.length<e;)await this.ba()&&this.ga("Reached the end of bundle when more is expected.");const t=this.da.decode(this.buffer.slice(0,e));return this.buffer=this.buffer.slice(e),t}ga(e){throw this.Va.cancel(),new Error(`Invalid bundle format: ${e}`)}async ba(){const e=await this.Va.read();if(!e.done){const t=new Uint8Array(this.buffer.length+e.value.length);t.set(this.buffer),t.set(e.value,this.buffer.length),this.buffer=t}return e.done}}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class IS{constructor(e,t){this.bundleData=e,this.serializer=t,this.cursor=0,this.elements=[];let r=this.ma();if(!r||!r.Ho())throw new Error(`The first element of the bundle is not a metadata object, it is
         ${JSON.stringify(r==null?void 0:r.jo)}`);this.metadata=r;do r=this.ma(),r!==null&&this.elements.push(r);while(r!==null)}getMetadata(){return this.metadata}va(){return this.elements}ma(){if(this.cursor===this.bundleData.length)return null;const e=this.pa(),t=this.ya(e);return new Ty(JSON.parse(t),e)}ya(e){if(this.cursor+e>this.bundleData.length)throw new N(b.INTERNAL,"Reached the end of bundle when more is expected.");return this.bundleData.slice(this.cursor,this.cursor+=e)}pa(){const e=this.cursor;let t=this.cursor;for(;t<this.bundleData.length;){if(this.bundleData[t]==="{"){if(t===e)throw new Error("First character is a bracket and not a number");return this.cursor=t,Number(this.bundleData.slice(e,t))}t++}throw new Error("Reached the end of bundle when more is expected.")}}const $i="IndexBackfiller";class wS{constructor(e,t){this.asyncQueue=e,this.Sa=t,this.task=null}start(){this.Da(15e3)}stop(){this.task&&(this.task.cancel(),this.task=null)}get started(){return this.task!==null}Da(e){O($i,`Scheduled in ${e}ms`),this.task=this.asyncQueue.enqueueAfterDelay("index_backfill",e,(async()=>{this.task=null;try{const t=await this.Sa.xa();O($i,`Documents written: ${t}`)}catch(t){Xn(t)?O($i,"Ignoring IndexedDB error during index backfill: ",t):await Yn(t)}await this.Da(6e4)}))}}class TS{constructor(e,t){this.localStore=e,this.persistence=t}async xa(e=50){return this.persistence.runTransaction("Backfill Indexes","readwrite-primary",(t=>this.Ca(t,e)))}Ca(e,t){const r=new Set;let s=t,i=!0;return R.doWhile((()=>i===!0&&s>0),(()=>this.localStore.indexManager.getNextCollectionGroupToUpdate(e).next((o=>{if(o!==null&&!r.has(o))return O($i,`Processing collection: ${o}`),this.Fa(e,o,s).next((c=>{s-=c,r.add(o)}));i=!1})))).next((()=>t-s))}Fa(e,t,r){return this.localStore.indexManager.getMinOffsetFromCollectionGroup(e,t).next((s=>this.localStore.localDocuments.getNextDocuments(e,t,s,r).next((i=>{const o=i.changes;return this.localStore.indexManager.updateIndexEntries(e,o).next((()=>this.Oa(s,i))).next((c=>(O($i,`Updating offset: ${c}`),this.localStore.indexManager.updateCollectionGroup(e,t,c)))).next((()=>o.size))}))))}Oa(e,t){let r=e;return t.changes.forEach(((s,i)=>{const o=kg(i);Pl(o,r)>0&&(r=o)})),new ft(r.readTime,r.documentKey,Math.max(t.batchId,e.largestBatchId))}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const by="firestore_clients";function Cp(n,e){return`${by}_${n}_${e}`}const Sy="firestore_mutations";function xp(n,e,t){let r=`${Sy}_${n}_${t}`;return e.isAuthenticated()&&(r+=`_${e.uid}`),r}const Vy="firestore_targets";function mu(n,e){return`${Vy}_${n}_${e}`}/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Nt="SharedClientState";class Ga{constructor(e,t,r,s){this.user=e,this.batchId=t,this.state=r,this.error=s}static Ma(e,t,r){const s=JSON.parse(r);let i,o=typeof s=="object"&&["pending","acknowledged","rejected"].indexOf(s.state)!==-1&&(s.error===void 0||typeof s.error=="object");return o&&s.error&&(o=typeof s.error.message=="string"&&typeof s.error.code=="string",o&&(i=new N(s.error.code,s.error.message))),o?new Ga(e,t,s.state,i):(Te(Nt,`Failed to parse mutation state for ID '${t}': ${r}`),null)}Na(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class ji{constructor(e,t,r){this.targetId=e,this.state=t,this.error=r}static Ma(e,t){const r=JSON.parse(t);let s,i=typeof r=="object"&&["not-current","current","rejected"].indexOf(r.state)!==-1&&(r.error===void 0||typeof r.error=="object");return i&&r.error&&(i=typeof r.error.message=="string"&&typeof r.error.code=="string",i&&(s=new N(r.error.code,r.error.message))),i?new ji(e,r.state,s):(Te(Nt,`Failed to parse target state for ID '${e}': ${t}`),null)}Na(){const e={state:this.state,updateTimeMs:Date.now()};return this.error&&(e.error={code:this.error.code,message:this.error.message}),JSON.stringify(e)}}class Ka{constructor(e,t){this.clientId=e,this.activeTargetIds=t}static Ma(e,t){const r=JSON.parse(t);let s=typeof r=="object"&&r.activeTargetIds instanceof Array,i=Cl();for(let o=0;s&&o<r.activeTargetIds.length;++o)s=pg(r.activeTargetIds[o]),i=i.add(r.activeTargetIds[o]);return s?new Ka(e,i):(Te(Nt,`Failed to parse client data for instance '${e}': ${t}`),null)}}class vh{constructor(e,t){this.clientId=e,this.onlineState=t}static Ma(e){const t=JSON.parse(e);return typeof t=="object"&&["Unknown","Online","Offline"].indexOf(t.onlineState)!==-1&&typeof t.clientId=="string"?new vh(t.clientId,t.onlineState):(Te(Nt,`Failed to parse online state: ${e}`),null)}}class Ju{constructor(){this.activeTargetIds=Cl()}La(e){this.activeTargetIds=this.activeTargetIds.add(e)}Ba(e){this.activeTargetIds=this.activeTargetIds.delete(e)}Na(){const e={activeTargetIds:this.activeTargetIds.toArray(),updateTimeMs:Date.now()};return JSON.stringify(e)}}class gu{constructor(e,t,r,s,i){this.window=e,this.xt=t,this.persistenceKey=r,this.Ua=s,this.syncEngine=null,this.onlineStateHandler=null,this.sequenceNumberHandler=null,this.ka=this.qa.bind(this),this.$a=new de(H),this.started=!1,this.Ka=[];const o=r.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");this.storage=this.window.localStorage,this.currentUser=i,this.Wa=Cp(this.persistenceKey,this.Ua),this.Qa=(function(u){return`firestore_sequence_number_${u}`})(this.persistenceKey),this.$a=this.$a.insert(this.Ua,new Ju),this.Ga=new RegExp(`^${by}_${o}_([^_]*)$`),this.za=new RegExp(`^${Sy}_${o}_(\\d+)(?:_(.*))?$`),this.ja=new RegExp(`^${Vy}_${o}_(\\d+)$`),this.Ha=(function(u){return`firestore_online_state_${u}`})(this.persistenceKey),this.Ja=(function(u){return`firestore_bundle_loaded_v2_${u}`})(this.persistenceKey),this.window.addEventListener("storage",this.ka)}static Je(e){return!(!e||!e.localStorage)}async start(){const e=await this.syncEngine.Ro();for(const r of e){if(r===this.Ua)continue;const s=this.getItem(Cp(this.persistenceKey,r));if(s){const i=Ka.Ma(r,s);i&&(this.$a=this.$a.insert(i.clientId,i))}}this.Ya();const t=this.storage.getItem(this.Ha);if(t){const r=this.Za(t);r&&this.Xa(r)}for(const r of this.Ka)this.qa(r);this.Ka=[],this.window.addEventListener("pagehide",(()=>this.shutdown())),this.started=!0}writeSequenceNumber(e){this.setItem(this.Qa,JSON.stringify(e))}getAllActiveQueryTargets(){return this.eu(this.$a)}isActiveQueryTarget(e){let t=!1;return this.$a.forEach(((r,s)=>{s.activeTargetIds.has(e)&&(t=!0)})),t}addPendingMutation(e){this.tu(e,"pending")}updateMutationState(e,t,r){this.tu(e,t,r),this.nu(e)}addLocalQueryTarget(e,t=!0){let r="not-current";if(this.isActiveQueryTarget(e)){const s=this.storage.getItem(mu(this.persistenceKey,e));if(s){const i=ji.Ma(e,s);i&&(r=i.state)}}return t&&this.ru.La(e),this.Ya(),r}removeLocalQueryTarget(e){this.ru.Ba(e),this.Ya()}isLocalQueryTarget(e){return this.ru.activeTargetIds.has(e)}clearQueryState(e){this.removeItem(mu(this.persistenceKey,e))}updateQueryState(e,t,r){this.iu(e,t,r)}handleUserChange(e,t,r){t.forEach((s=>{this.nu(s)})),this.currentUser=e,r.forEach((s=>{this.addPendingMutation(s)}))}setOnlineState(e){this.su(e)}notifyBundleLoaded(e){this._u(e)}shutdown(){this.started&&(this.window.removeEventListener("storage",this.ka),this.removeItem(this.Wa),this.started=!1)}getItem(e){const t=this.storage.getItem(e);return O(Nt,"READ",e,t),t}setItem(e,t){O(Nt,"SET",e,t),this.storage.setItem(e,t)}removeItem(e){O(Nt,"REMOVE",e),this.storage.removeItem(e)}qa(e){const t=e;if(t.storageArea===this.storage){if(O(Nt,"EVENT",t.key,t.newValue),t.key===this.Wa)return void Te("Received WebStorage notification for local change. Another client might have garbage-collected our state");this.xt.enqueueRetryable((async()=>{if(this.started){if(t.key!==null){if(this.Ga.test(t.key)){if(t.newValue==null){const r=this.ou(t.key);return this.au(r,null)}{const r=this.uu(t.key,t.newValue);if(r)return this.au(r.clientId,r)}}else if(this.za.test(t.key)){if(t.newValue!==null){const r=this.cu(t.key,t.newValue);if(r)return this.lu(r)}}else if(this.ja.test(t.key)){if(t.newValue!==null){const r=this.Eu(t.key,t.newValue);if(r)return this.hu(r)}}else if(t.key===this.Ha){if(t.newValue!==null){const r=this.Za(t.newValue);if(r)return this.Xa(r)}}else if(t.key===this.Qa){const r=(function(i){let o=nt.yn;if(i!=null)try{const c=JSON.parse(i);L(typeof c=="number",30636,{Tu:i}),o=c}catch(c){Te(Nt,"Failed to read sequence number from WebStorage",c)}return o})(t.newValue);r!==nt.yn&&this.sequenceNumberHandler(r)}else if(t.key===this.Ja){const r=this.Pu(t.newValue);await Promise.all(r.map((s=>this.syncEngine.Ru(s))))}}}else this.Ka.push(t)}))}}get ru(){return this.$a.get(this.Ua)}Ya(){this.setItem(this.Wa,this.ru.Na())}tu(e,t,r){const s=new Ga(this.currentUser,e,t,r),i=xp(this.persistenceKey,this.currentUser,e);this.setItem(i,s.Na())}nu(e){const t=xp(this.persistenceKey,this.currentUser,e);this.removeItem(t)}su(e){const t={clientId:this.Ua,onlineState:e};this.storage.setItem(this.Ha,JSON.stringify(t))}iu(e,t,r){const s=mu(this.persistenceKey,e),i=new ji(e,t,r);this.setItem(s,i.Na())}_u(e){const t=JSON.stringify(Array.from(e));this.setItem(this.Ja,t)}ou(e){const t=this.Ga.exec(e);return t?t[1]:null}uu(e,t){const r=this.ou(e);return Ka.Ma(r,t)}cu(e,t){const r=this.za.exec(e),s=Number(r[1]),i=r[2]!==void 0?r[2]:null;return Ga.Ma(new Le(i),s,t)}Eu(e,t){const r=this.ja.exec(e),s=Number(r[1]);return ji.Ma(s,t)}Za(e){return vh.Ma(e)}Pu(e){return JSON.parse(e)}async lu(e){if(e.user.uid===this.currentUser.uid)return this.syncEngine.Iu(e.batchId,e.state,e.error);O(Nt,`Ignoring mutation for non-active user ${e.user.uid}`)}hu(e){return this.syncEngine.Au(e.targetId,e.state,e.error)}au(e,t){const r=t?this.$a.insert(e,t):this.$a.remove(e),s=this.eu(this.$a),i=this.eu(r),o=[],c=[];return i.forEach((u=>{s.has(u)||o.push(u)})),s.forEach((u=>{i.has(u)||c.push(u)})),this.syncEngine.Vu(o,c).then((()=>{this.$a=r}))}Xa(e){this.$a.get(e.clientId)&&this.onlineStateHandler(e.onlineState)}eu(e){let t=Cl();return e.forEach(((r,s)=>{t=t.unionWith(s.activeTargetIds)})),t}}class Cy{constructor(){this.du=new Ju,this.fu={},this.onlineStateHandler=null,this.sequenceNumberHandler=null}addPendingMutation(e){}updateMutationState(e,t,r){}addLocalQueryTarget(e,t=!0){return t&&this.du.La(e),this.fu[e]||"not-current"}updateQueryState(e,t,r){this.fu[e]=t}removeLocalQueryTarget(e){this.du.Ba(e)}isLocalQueryTarget(e){return this.du.activeTargetIds.has(e)}clearQueryState(e){delete this.fu[e]}getAllActiveQueryTargets(){return this.du.activeTargetIds}isActiveQueryTarget(e){return this.du.activeTargetIds.has(e)}start(){return this.du=new Ju,Promise.resolve()}handleUserChange(e,t,r){}setOnlineState(e){}shutdown(){}writeSequenceNumber(e){}notifyBundleLoaded(e){}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function xy(){return typeof window<"u"?window:null}function ma(){return typeof document<"u"?document:null}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fn{static emptySet(e){return new Fn(e.comparator)}constructor(e){this.comparator=e?(t,r)=>e(t,r)||M.comparator(t.key,r.key):(t,r)=>M.comparator(t.key,r.key),this.keyedMap=hr(),this.sortedSet=new de(this.comparator)}has(e){return this.keyedMap.get(e)!=null}get(e){return this.keyedMap.get(e)}first(){return this.sortedSet.minKey()}last(){return this.sortedSet.maxKey()}isEmpty(){return this.sortedSet.isEmpty()}indexOf(e){const t=this.keyedMap.get(e);return t?this.sortedSet.indexOf(t):-1}get size(){return this.sortedSet.size}forEach(e){this.sortedSet.inorderTraversal(((t,r)=>(e(t),!1)))}add(e){const t=this.delete(e.key);return t.copy(t.keyedMap.insert(e.key,e),t.sortedSet.insert(e,null))}delete(e){const t=this.get(e);return t?this.copy(this.keyedMap.remove(e),this.sortedSet.remove(t)):this}isEqual(e){if(!(e instanceof Fn)||this.size!==e.size)return!1;const t=this.sortedSet.getIterator(),r=e.sortedSet.getIterator();for(;t.hasNext();){const s=t.getNext().key,i=r.getNext().key;if(!s.isEqual(i))return!1}return!0}toString(){const e=[];return this.forEach((t=>{e.push(t.toString())})),e.length===0?"DocumentSet ()":`DocumentSet (
  `+e.join(`
`)+`
)`}copy(e,t){const r=new Fn;return r.comparator=this.comparator,r.keyedMap=e,r.sortedSet=t,r}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Np{constructor(){this.mu=new de(M.comparator)}track(e){const t=e.doc.key,r=this.mu.get(t);r?e.type!==0&&r.type===3?this.mu=this.mu.insert(t,e):e.type===3&&r.type!==1?this.mu=this.mu.insert(t,{type:r.type,doc:e.doc}):e.type===2&&r.type===2?this.mu=this.mu.insert(t,{type:2,doc:e.doc}):e.type===2&&r.type===0?this.mu=this.mu.insert(t,{type:0,doc:e.doc}):e.type===1&&r.type===0?this.mu=this.mu.remove(t):e.type===1&&r.type===2?this.mu=this.mu.insert(t,{type:1,doc:r.doc}):e.type===0&&r.type===1?this.mu=this.mu.insert(t,{type:2,doc:e.doc}):q(63341,{ye:e,pu:r}):this.mu=this.mu.insert(t,e)}gu(){const e=[];return this.mu.inorderTraversal(((t,r)=>{e.push(r)})),e}}class Dr{constructor(e,t,r,s,i,o,c,u,l){this.query=e,this.docs=t,this.oldDocs=r,this.docChanges=s,this.mutatedKeys=i,this.fromCache=o,this.syncStateChanged=c,this.excludesMetadataChanges=u,this.hasCachedResults=l}static fromInitialDocuments(e,t,r,s,i){const o=[];return t.forEach((c=>{o.push({type:0,doc:c})})),new Dr(e,t,Fn.emptySet(t),o,r,s,!0,!1,i)}get hasPendingWrites(){return!this.mutatedKeys.isEmpty()}isEqual(e){if(!(this.fromCache===e.fromCache&&this.hasCachedResults===e.hasCachedResults&&this.syncStateChanged===e.syncStateChanged&&this.mutatedKeys.isEqual(e.mutatedKeys)&&gc(this.query,e.query)&&this.docs.isEqual(e.docs)&&this.oldDocs.isEqual(e.oldDocs)))return!1;const t=this.docChanges,r=e.docChanges;if(t.length!==r.length)return!1;for(let s=0;s<t.length;s++)if(t[s].type!==r[s].type||!t[s].doc.isEqual(r[s].doc))return!1;return!0}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class ES{constructor(){this.yu=void 0,this.wu=[]}bu(){return this.wu.some((e=>e.vu()))}}class vS{constructor(){this.queries=Dp(),this.onlineState="Unknown",this.Su=new Set}terminate(){(function(t,r){const s=U(t),i=s.queries;s.queries=Dp(),i.forEach(((o,c)=>{for(const u of c.wu)u.onError(r)}))})(this,new N(b.ABORTED,"Firestore shutting down"))}}function Dp(){return new fn((n=>z_(n)),gc)}async function Ah(n,e){const t=U(n);let r=3;const s=e.query;let i=t.queries.get(s);i?!i.bu()&&e.vu()&&(r=2):(i=new ES,r=e.vu()?0:1);try{switch(r){case 0:i.yu=await t.onListen(s,!0);break;case 1:i.yu=await t.onListen(s,!1);break;case 2:await t.onFirstRemoteStoreListen(s)}}catch(o){const c=Xs(o,`Initialization of query '${Ie(e.query)?tn(e.query):ki(e.query)}' failed`);return void e.onError(c)}t.queries.set(s,i),i.wu.push(e),e.Du(t.onlineState),i.yu&&e.xu(i.yu)&&Ph(t)}async function Rh(n,e){const t=U(n),r=e.query;let s=3;const i=t.queries.get(r);if(i){const o=i.wu.indexOf(e);o>=0&&(i.wu.splice(o,1),i.wu.length===0?s=e.vu()?0:1:!i.bu()&&e.vu()&&(s=2))}switch(s){case 0:return t.queries.delete(r),t.onUnlisten(r,!0);case 1:return t.queries.delete(r),t.onUnlisten(r,!1);case 2:return t.onLastRemoteStoreUnlisten(r);default:return}}function AS(n,e){const t=U(n);let r=!1;for(const s of e){const i=s.query,o=t.queries.get(i);if(o){for(const c of o.wu)c.xu(s)&&(r=!0);o.yu=s}}r&&Ph(t)}function RS(n,e,t){const r=U(n),s=r.queries.get(e);if(s)for(const i of s.wu)i.onError(t);r.queries.delete(e)}function Ph(n){n.Su.forEach((e=>{e.next()}))}var Yu;(function(n){n.Default="default",n.Cache="cache"})(Yu||(Yu={}));class bh{constructor(e,t,r){this.query=e,this.Cu=t,this.Fu=!1,this.Ou=null,this.onlineState="Unknown",this.options=r||{}}xu(e){if(!this.options.includeMetadataChanges){const r=[];for(const s of e.docChanges)s.type!==3&&r.push(s);e=new Dr(e.query,e.docs,e.oldDocs,r,e.mutatedKeys,e.fromCache,e.syncStateChanged,!0,e.hasCachedResults)}let t=!1;return this.Fu?this.Mu(e)&&(this.Cu.next(e),t=!0):this.Nu(e,this.onlineState)&&(this.Lu(e),t=!0),this.Ou=e,t}onError(e){this.Cu.error(e)}Du(e){this.onlineState=e;let t=!1;return this.Ou&&!this.Fu&&this.Nu(this.Ou,e)&&(this.Lu(this.Ou),t=!0),t}Nu(e,t){if(!e.fromCache||!this.vu())return!0;const r=t!=="Offline";return(!this.options.waitForSyncWhenOnline||!r)&&(!e.docs.isEmpty()||e.hasCachedResults||t==="Offline")}Mu(e){if(e.docChanges.length>0)return!0;const t=this.Ou&&this.Ou.hasPendingWrites!==e.hasPendingWrites;return!(!e.syncStateChanged&&!t)&&this.options.includeMetadataChanges===!0}Lu(e){e=Dr.fromInitialDocuments(e.query,e.docs,e.mutatedKeys,e.fromCache,e.hasCachedResults),this.Fu=!0,this.Cu.next(e)}vu(){return this.options.source!==Yu.Cache}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class kp{constructor(e){this.serializer=e}Qo(e){return Bt(this.serializer,e)}Go(e){return e.metadata.exists?cc(this.serializer,e.document,!1):ge.newNoDocument(this.Qo(e.metadata.name),this.zo(e.metadata.readTime))}zo(e){return ve(e)}}class Sh{constructor(e,t){this.Bu=e,this.serializer=t,this.Uu=[],this.ku=[],this.collectionGroups=new Set,this.progress=Ny(e)}get queries(){return this.Uu}get documents(){return this.ku}qu(e){this.progress.bytesLoaded+=e.byteLength;let t=this.progress.documentsLoaded;if(e.jo.namedQuery)this.Uu.push(e.jo.namedQuery);else if(e.jo.documentMetadata){this.ku.push({metadata:e.jo.documentMetadata}),e.jo.documentMetadata.exists||++t;const r=J.fromString(e.jo.documentMetadata.name);this.collectionGroups.add(r.get(r.length-2))}else e.jo.document&&(this.ku[this.ku.length-1].document=e.jo.document,++t);return t!==this.progress.documentsLoaded?(this.progress.documentsLoaded=t,{...this.progress}):null}$u(e){const t=new Map,r=new kp(this.serializer);for(const s of e)if(s.metadata.queries){const i=r.Qo(s.metadata.name);for(const o of s.metadata.queries){const c=(t.get(o)||Q()).add(i);t.set(o,c)}}return t}async Ku(e){const t=await sS(e,new kp(this.serializer),this.ku,this.Bu.id),r=this.$u(this.documents);for(const s of this.Uu)await iS(e,s,r.get(s.name));return this.progress.taskState="Success",{progress:this.progress,Wu:this.collectionGroups,Qu:t}}}function Ny(n){return{taskState:"Running",documentsLoaded:0,bytesLoaded:0,totalDocuments:n.totalDocuments,totalBytes:n.totalBytes}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Dy{constructor(e){this.key=e}}class ky{constructor(e){this.key=e}}class Oy{constructor(e,t){this.query=e,this.Gu=t,this.zu=null,this.hasCachedResults=!1,this.current=!1,this.ju=Q(),this.mutatedKeys=Q(),this.Hu=Ie(e)?qa(e):ac(e),this.Ju=new Fn(this.Hu)}get Yu(){return this.Gu}Zu(e,t){const r=t?t.Xu:new Np,s=t?t.Ju:this.Ju;let i=t?t.mutatedKeys:this.mutatedKeys,o=s,c=!1;const[u,l]=this.ec(this.query,s);e.inorderTraversal(((p,g)=>{const w=s.get(p),S=uy(this.query,g)?g:null,D=!!w&&this.mutatedKeys.has(w.key),k=!!S&&(S.hasLocalMutations||this.mutatedKeys.has(S.key)&&S.hasCommittedMutations);let $=!1;w&&S?w.data.isEqual(S.data)?D!==k&&(r.track({type:3,doc:S}),$=!0):this.tc(w,S)||(r.track({type:2,doc:S}),$=!0,(u&&this.Hu(S,u)>0||l&&this.Hu(S,l)<0)&&(c=!0)):!w&&S?(r.track({type:0,doc:S}),$=!0):w&&!S&&(r.track({type:1,doc:w}),$=!0,(u||l)&&(c=!0)),$&&(S?(o=o.add(S),i=k?i.add(p):i.delete(p)):(o=o.delete(p),i=i.delete(p)))}));const d=this.nc(this.query);if(d)if(Ie(this.query)){const p=[];o.forEach((S=>p.push(S)));const g=cy(this.query,p);let w=new Fn(qa(this.query));for(const S of g)w=w.add(S);o.forEach((S=>{w.has(S.key)||(i=i.delete(S.key),r.track({type:1,doc:S}))})),o=w}else{const p=this.rc(this.query);for(;o.size>d;){const g=p==="F"?o.last():o.first();o=o.delete(g.key),i=i.delete(g.key),r.track({type:1,doc:g})}}return{Ju:o,Xu:r,Fo:c,mutatedKeys:i}}nc(e){var t;return Ie(e)?(t=hu(e))==null?void 0:t.limit:e.limit||void 0}rc(e){if(Ie(e)){const t=hu(e);return t&&t.limit<0?"L":"F"}return e.limitType}ec(e,t){var r;if(Ie(e)){const s=(r=hu(e))==null?void 0:r.limit;return[t.size===s?t.last():null,null]}return[e.limitType==="F"&&t.size===this.nc(this.query)?t.last():null,e.limitType==="L"&&t.size===this.nc(this.query)?t.first():null]}tc(e,t){return e.hasLocalMutations&&t.hasCommittedMutations&&!t.hasLocalMutations}applyChanges(e,t,r,s){const i=this.Ju;this.Ju=e.Ju,this.mutatedKeys=e.mutatedKeys;const o=e.Xu.gu();o.sort(((d,p)=>(function(w,S){const D=k=>{switch(k){case 0:return 1;case 2:case 3:return 2;case 1:return 0;default:return q(20277,{ye:k})}};return D(w)-D(S)})(d.type,p.type)||this.Hu(d.doc,p.doc))),this.sc(r),s=s??!1;const c=t&&!s?this._c():[],u=this.ju.size===0&&this.current&&!s?1:0,l=u!==this.zu;return this.zu=u,o.length!==0||l?{snapshot:new Dr(this.query,e.Ju,i,o,e.mutatedKeys,u===0,l,!1,!!r&&r.resumeToken.approximateByteSize()>0),oc:c}:{oc:c}}Du(e){return this.current&&e==="Offline"?(this.current=!1,this.applyChanges({Ju:this.Ju,Xu:new Np,mutatedKeys:this.mutatedKeys,Fo:!1},!1)):{oc:[]}}ac(e){return!this.Gu.has(e)&&!!this.Ju.has(e)&&!this.Ju.get(e).hasLocalMutations}sc(e){e&&(e.addedDocuments.forEach((t=>this.Gu=this.Gu.add(t))),e.modifiedDocuments.forEach((t=>{})),e.removedDocuments.forEach((t=>this.Gu=this.Gu.delete(t))),this.current=e.current)}_c(){if(!this.current)return[];const e=this.ju;this.ju=Q(),this.Ju.forEach((r=>{this.ac(r.key)&&(this.ju=this.ju.add(r.key))}));const t=[];return e.forEach((r=>{this.ju.has(r)||t.push(new ky(r))})),this.ju.forEach((r=>{e.has(r)||t.push(new Dy(r))})),t}uc(e){this.Gu=e.Wo,this.ju=Q();const t=this.Zu(e.documents);return this.applyChanges(t,!0)}cc(){return Dr.fromInitialDocuments(this.query,this.Ju,this.mutatedKeys,this.zu===0,this.hasCachedResults)}}const er="SyncEngine";class PS{constructor(e,t,r){this.query=e,this.targetId=t,this.view=r}}class bS{constructor(e){this.key=e,this.lc=!1}}class SS{constructor(e,t,r,s,i,o){this.localStore=e,this.remoteStore=t,this.eventManager=r,this.sharedClientState=s,this.currentUser=i,this.maxConcurrentLimboResolutions=o,this.Ec={},this.hc=new fn((c=>z_(c)),gc),this.Tc=new Map,this.Pc=new Set,this.Rc=new de(M.comparator),this.Ic=new Map,this.Ac=new fh,this.Vc={},this.dc=new Map,this.fc=cn.ws(),this.onlineState="Unknown",this.mc=void 0}get isPrimaryClient(){return this.mc===!0}}async function VS(n,e,t=!0){const r=Sc(n);let s;const i=r.hc.get(e);return i?(r.sharedClientState.addLocalQueryTarget(i.targetId),s=i.view.cc()):s=await Ly(r,e,t,!0),s}async function CS(n,e){const t=Sc(n);await Ly(t,e,!0,!1)}async function Ly(n,e,t,r){const s=await xs(n.localStore,Ie(e)?e:Ge(e)),i=s.targetId,o=n.sharedClientState.addLocalQueryTarget(i,t);let c;return r&&(c=await Vh(n,e,i,o==="current",s.resumeToken)),n.isPrimaryClient&&t&&Pc(n.remoteStore,s),c}async function Vh(n,e,t,r,s){n.gc=(p,g,w)=>(async function(D,k,$,z){let G=k.view.Zu($);G.Fo&&(G=await ja(D.localStore,k.query,!1).then((({documents:E})=>k.view.Zu(E,G))));const ie=z&&z.targetChanges.get(k.targetId),ne=z&&z.targetMismatches.get(k.targetId)!=null,se=k.view.applyChanges(G,D.isPrimaryClient,ie,ne);return Xu(D,k.targetId,se.oc),se.snapshot})(n,p,g,w);const i=await ja(n.localStore,e,!0),o=new Oy(e,i.Wo),c=o.Zu(i.documents),u=_o.createSynthesizedTargetChangeForCurrentChange(t,r&&n.onlineState!=="Offline",s),l=o.applyChanges(c,n.isPrimaryClient,u);Xu(n,t,l.oc);const d=new PS(e,t,o);return n.hc.set(e,d),n.Tc.has(t)?n.Tc.get(t).push(e):n.Tc.set(t,[e]),l.snapshot}async function xS(n,e,t){const r=U(n),s=r.hc.get(e),i=r.Tc.get(s.targetId);if(i.length>1)return r.Tc.set(s.targetId,i.filter((o=>!gc(o,e)))),void r.hc.delete(e);r.isPrimaryClient?(r.sharedClientState.removeLocalQueryTarget(s.targetId),r.sharedClientState.isActiveQueryTarget(s.targetId)||await Ns(r.localStore,s.targetId,!1).then((()=>{r.sharedClientState.clearQueryState(s.targetId),t&&Ds(r.remoteStore,s.targetId),ks(r,s.targetId)})).catch(Yn)):(ks(r,s.targetId),await Ns(r.localStore,s.targetId,!0))}async function NS(n,e){const t=U(n),r=t.hc.get(e),s=t.Tc.get(r.targetId);t.isPrimaryClient&&s.length===1&&(t.sharedClientState.removeLocalQueryTarget(r.targetId),Ds(t.remoteStore,r.targetId))}async function DS(n,e,t){const r=Dh(n);try{const s=await(function(o,c){const u=U(o),l=oe.now(),d=c.reduce(((w,S)=>w.add(S.key)),Q());let p,g;return u.persistence.runTransaction("Locally write mutations","readwrite",(w=>{let S=Re(),D=Q();return u.Uo.getEntries(w,d).next((k=>{S=k,S.forEach((($,z)=>{z.isValidDocument()||(D=D.add($))}))})).next((()=>u.localDocuments.getOverlayedDocuments(w,S))).next((k=>{p=k;const $=[];for(const z of c){const G=lA(z,p.get(z.key).overlayedDocument);G!=null&&$.push(new hn(z.key,G,yg(G.value.mapValue),_e.exists(!0)))}return u.mutationQueue.addMutationBatch(w,l,$,c)})).next((k=>{g=k;const $=k.applyToLocalDocumentSet(p,D);return u.documentOverlayCache.saveOverlays(w,k.batchId,$)}))})).then((()=>({batchId:g.batchId,changes:$g(p)})))})(r.localStore,e);r.sharedClientState.addPendingMutation(s.batchId),(function(o,c,u){let l=o.Vc[o.currentUser.toKey()];l||(l=new de(H)),l=l.insert(c,u),o.Vc[o.currentUser.toKey()]=l})(r,s.batchId,t),await pn(r,s.changes),await Js(r.remoteStore)}catch(s){const i=Xs(s,"Failed to persist write");t.reject(i)}}async function My(n,e){const t=U(n);try{const r=await nS(t.localStore,e);e.targetChanges.forEach(((s,i)=>{const o=t.Ic.get(i);o&&(L(s.addedDocuments.size+s.modifiedDocuments.size+s.removedDocuments.size<=1,22616),s.addedDocuments.size>0?o.lc=!0:s.modifiedDocuments.size>0?L(o.lc,14607):s.removedDocuments.size>0&&(L(o.lc,42227),o.lc=!1))})),await pn(t,r,e)}catch(r){await Yn(r)}}function Op(n,e,t){const r=U(n);if(r.isPrimaryClient&&t===0||!r.isPrimaryClient&&t===1){const s=[];r.hc.forEach(((i,o)=>{const c=o.view.Du(e);c.snapshot&&s.push(c.snapshot)})),(function(o,c){const u=U(o);u.onlineState=c;let l=!1;u.queries.forEach(((d,p)=>{for(const g of p.wu)g.Du(c)&&(l=!0)})),l&&Ph(u)})(r.eventManager,e),s.length&&r.Ec.hn(s),r.onlineState=e,r.isPrimaryClient&&r.sharedClientState.setOnlineState(e)}}async function kS(n,e,t){const r=U(n);r.sharedClientState.updateQueryState(e,"rejected",t);const s=r.Ic.get(e),i=s&&s.key;if(i){let o=new de(M.comparator);o=o.insert(i,ge.newNoDocument(i,j.min()));const c=Q().add(i),u=new Ks(j.min(),new Map,new de(H),o,Re(),c);await My(r,u),r.Rc=r.Rc.remove(i),r.Ic.delete(e),Nh(r)}else await Ns(r.localStore,e,!1).then((()=>ks(r,e,t))).catch(Yn)}async function OS(n,e){const t=U(n),r=e.batch.batchId;try{const s=await tS(t.localStore,e);xh(t,r,null),Ch(t,r),t.sharedClientState.updateMutationState(r,"acknowledged"),await pn(t,s)}catch(s){await Yn(s)}}async function LS(n,e,t){const r=U(n);try{const s=await(function(o,c){const u=U(o);return u.persistence.runTransaction("Reject batch","readwrite-primary",(l=>{let d;return u.mutationQueue.lookupMutationBatch(l,c).next((p=>(L(p!==null,37113),d=p.keys(),u.mutationQueue.removeMutationBatch(l,p)))).next((()=>u.mutationQueue.performConsistencyCheck(l))).next((()=>u.documentOverlayCache.removeOverlaysForBatchId(l,d,c))).next((()=>u.localDocuments.recalculateAndSaveOverlaysForDocumentKeys(l,d))).next((()=>u.localDocuments.getDocuments(l,d)))}))})(r.localStore,e);xh(r,e,t),Ch(r,e),r.sharedClientState.updateMutationState(e,"rejected",t),await pn(r,s)}catch(s){await Yn(s)}}async function MS(n,e){const t=U(n);Zn(t.remoteStore)||O(er,"The network is disabled. The task returned by 'awaitPendingWrites()' will not complete until the network is enabled.");try{const r=await(function(o){const c=U(o);return c.persistence.runTransaction("Get highest unacknowledged batch id","readonly",(u=>c.mutationQueue.getHighestUnacknowledgedBatchId(u)))})(t.localStore);if(r===Ln)return void e.resolve();const s=t.dc.get(r)||[];s.push(e),t.dc.set(r,s)}catch(r){const s=Xs(r,"Initialization of waitForPendingWrites() operation failed");e.reject(s)}}function Ch(n,e){(n.dc.get(e)||[]).forEach((t=>{t.resolve()})),n.dc.delete(e)}function xh(n,e,t){const r=U(n);let s=r.Vc[r.currentUser.toKey()];if(s){const i=s.get(e);i&&(t?i.reject(t):i.resolve(),s=s.remove(e)),r.Vc[r.currentUser.toKey()]=s}}function ks(n,e,t=null){n.sharedClientState.removeLocalQueryTarget(e);for(const r of n.Tc.get(e))n.hc.delete(r),t&&n.Ec.yc(r,t);n.Tc.delete(e),n.isPrimaryClient&&n.Ac.Xs(e).forEach((r=>{n.Ac.containsKey(r)||Fy(n,r)}))}function Fy(n,e){n.Pc.delete(e.path.canonicalString());const t=n.Rc.get(e);t!==null&&(Ds(n.remoteStore,t),n.Rc=n.Rc.remove(e),n.Ic.delete(t),Nh(n))}function Xu(n,e,t){for(const r of t)r instanceof Dy?(n.Ac.addReference(r.key,e),FS(n,r)):r instanceof ky?(O(er,"Document no longer in limbo: "+r.key),n.Ac.removeReference(r.key,e),n.Ac.containsKey(r.key)||Fy(n,r.key)):q(19791,{wc:r})}function FS(n,e){const t=e.key,r=t.path.canonicalString();n.Rc.get(t)||n.Pc.has(r)||(O(er,"New document in limbo: "+t),n.Pc.add(r),Nh(n))}function Nh(n){for(;n.Pc.size>0&&n.Rc.size<n.maxConcurrentLimboResolutions;){const e=n.Pc.values().next().value;n.Pc.delete(e);const t=new M(J.fromString(e)),r=n.fc.next();n.Ic.set(r,new bS(t)),n.Rc=n.Rc.insert(t,r),Pc(n.remoteStore,new Mt(Ge(Gs(t.path)),r,"TargetPurposeLimboResolution",nt.yn))}}async function pn(n,e,t){const r=U(n),s=[],i=[],o=[];r.hc.isEmpty()||(r.hc.forEach(((c,u)=>{o.push(r.gc(u,e,t).then((l=>{var d;if((l||t)&&r.isPrimaryClient){const p=l?!l.fromCache:(d=t==null?void 0:t.targetChanges.get(u.targetId))==null?void 0:d.current;r.sharedClientState.updateQueryState(u.targetId,p?"current":"not-current")}if(l){s.push(l);const p=_h.fo(u.targetId,l);i.push(p)}})))})),await Promise.all(o),r.Ec.hn(s),await(async function(u,l){const d=U(u);try{await d.persistence.runTransaction("notifyLocalViewChanges","readwrite",(p=>R.forEach(l,(g=>R.forEach(g.Ao,(w=>d.persistence.referenceDelegate.addReference(p,g.targetId,w))).next((()=>R.forEach(g.Vo,(w=>d.persistence.referenceDelegate.removeReference(p,g.targetId,w)))))))))}catch(p){if(!Xn(p))throw p;O(yh,"Failed to update sequence numbers: "+p)}for(const p of l){const g=p.targetId;if(!p.fromCache){const w=d.No.get(g),S=w.snapshotVersion,D=w.withLastLimboFreeSnapshotVersion(S);d.No=d.No.insert(g,D)}}})(r.localStore,i))}async function US(n,e){const t=U(n);if(!t.currentUser.isEqual(e)){O(er,"User change. New user:",e.toKey());const r=await gy(t.localStore,e);t.currentUser=e,(function(i,o){i.dc.forEach((c=>{c.forEach((u=>{u.reject(new N(b.CANCELLED,o))}))})),i.dc.clear()})(t,"'waitForPendingWrites' promise is rejected due to a user change."),t.sharedClientState.handleUserChange(e,r.removedBatchIds,r.addedBatchIds),await pn(t,r.qo)}}function BS(n,e){const t=U(n),r=t.Ic.get(e);if(r&&r.lc)return Q().add(r.key);{let s=Q();const i=t.Tc.get(e);if(!i)return s;for(const o of i??[]){const c=t.hc.get(o);s=s.unionWith(c.view.Yu)}return s}}async function qS(n,e){const t=U(n),r=await ja(t.localStore,e.query,!0),s=e.view.uc(r);return t.isPrimaryClient&&Xu(t,e.targetId,s.oc),s}async function $S(n,e){const t=U(n);return Wu(t.localStore,e).then((r=>pn(t,r)))}async function jS(n,e,t,r){const s=U(n),i=await(function(c,u){const l=U(c),d=U(l.mutationQueue);return l.persistence.runTransaction("Lookup mutation documents","readonly",(p=>d.Wr(p,u).next((g=>g?l.localDocuments.getDocuments(p,g):R.resolve(null)))))})(s.localStore,e);i!==null?(t==="pending"?await Js(s.remoteStore):t==="acknowledged"||t==="rejected"?(xh(s,e,r||null),Ch(s,e),(function(c,u){U(U(c).mutationQueue).jr(u)})(s.localStore,e)):q(6720,"Unknown batchState",{bc:t}),await pn(s,i)):O(er,"Cannot apply mutation batch with id: "+e)}async function zS(n,e){const t=U(n);if(Sc(t),Dh(t),e===!0&&t.mc!==!0){const r=t.sharedClientState.getAllActiveQueryTargets(),s=await Lp(t,r.toArray());t.mc=!0,await Qu(t.remoteStore,!0);for(const i of s)Pc(t.remoteStore,i)}else if(e===!1&&t.mc!==!1){const r=[];let s=Promise.resolve();t.Tc.forEach(((i,o)=>{t.sharedClientState.isLocalQueryTarget(o)?r.push(o):s=s.then((()=>(ks(t,o),Ns(t.localStore,o,!0)))),Ds(t.remoteStore,o)})),await s,await Lp(t,r),(function(o){const c=U(o);c.Ic.forEach(((u,l)=>{Ds(c.remoteStore,l)})),c.Ac.e_(),c.Ic=new Map,c.Rc=new de(M.comparator)})(t),t.mc=!1,await Qu(t.remoteStore,!1)}}async function Lp(n,e,t){const r=U(n),s=[],i=[];for(const o of e){let c;const u=r.Tc.get(o);if(u&&u.length!==0){c=await xs(r.localStore,Ie(u[0])?u[0]:Ge(u[0]));for(const l of u){const d=r.hc.get(l),p=await qS(r,d);p.snapshot&&i.push(p.snapshot)}}else{const l=await Iy(r.localStore,o);c=await xs(r.localStore,l),await Vh(r,Uy(l),o,!1,c.resumeToken)}s.push(c)}return r.Ec.hn(i),s}function Uy(n){return Ht(n)?n:Og(n.path,n.collectionGroup,n.orderBy,n.filters,n.limit,"F",n.startAt,n.endAt)}function GS(n){return(function(t){return U(U(t).persistence).Ro()})(U(n).localStore)}async function KS(n,e,t,r){const s=U(n);if(s.mc)return void O(er,"Ignoring unexpected query state notification.");const i=s.Tc.get(e);if(i&&i.length>0)switch(t){case"current":case"not-current":{let o;if(Ie(i[0]))switch(en(i[0])){case"collection_group":case"collection":o=await Wu(s.localStore,$_(i[0]));break;case"documents":o=await(function(l,d){const p=U(l),g=Q(...ka(d).map((w=>M.fromPath(w))));return p.persistence.runTransaction("Get documents for pipeline","readonly",(w=>p.Uo.getEntries(w,g))).then((w=>w))})(s.localStore,i[0]);break;default:xe(""),o=hr()}else o=await Wu(s.localStore,(function(l){return l.collectionGroup||(l.path.length%2==1?l.path.lastSegment():l.path.get(l.path.length-2))})(i[0]));const c=Ks.createSynthesizedRemoteEventForCurrentChange(e,t==="current",pe.EMPTY_BYTE_STRING);await pn(s,o,c);break}case"rejected":await Ns(s.localStore,e,!0),ks(s,e,r);break;default:q(64155,t)}}async function WS(n,e,t){const r=Sc(n);if(r.mc){for(const s of e){if(r.Tc.has(s)&&r.sharedClientState.isActiveQueryTarget(s)){O(er,"Adding an already active target "+s);continue}const i=await Iy(r.localStore,s),o=await xs(r.localStore,i);await Vh(r,Uy(i),o.targetId,!1,o.resumeToken),Pc(r.remoteStore,o)}for(const s of t)r.Tc.has(s)&&await Ns(r.localStore,s,!1).then((()=>{Ds(r.remoteStore,s),ks(r,s)})).catch(Yn)}}function Sc(n){const e=U(n);return e.remoteStore.remoteSyncer.applyRemoteEvent=My.bind(null,e),e.remoteStore.remoteSyncer.getRemoteKeysForTarget=BS.bind(null,e),e.remoteStore.remoteSyncer.rejectListen=kS.bind(null,e),e.Ec.hn=AS.bind(null,e.eventManager),e.Ec.yc=RS.bind(null,e.eventManager),e}function Dh(n){const e=U(n);return e.remoteStore.remoteSyncer.applySuccessfulWrite=OS.bind(null,e),e.remoteStore.remoteSyncer.rejectFailedWrite=LS.bind(null,e),e}function HS(n,e,t){const r=U(n);(async function(i,o,c){try{const u=await o.getMetadata();if(await(function(w,S){const D=U(w),k=ve(S.createTime);return D.persistence.runTransaction("hasNewerBundle","readonly",($=>D.d_.getBundleMetadata($,S.id))).then(($=>!!$&&$.createTime.compareTo(k)>=0))})(i.localStore,u))return await o.close(),c._completeWith((function(w){return{taskState:"Success",documentsLoaded:w.totalDocuments,bytesLoaded:w.totalBytes,totalDocuments:w.totalDocuments,totalBytes:w.totalBytes}})(u)),Promise.resolve(new Set);c._updateProgress(Ny(u));const l=new Sh(u,o.serializer);let d=await o.ma();for(;d;){const g=await l.qu(d);g&&c._updateProgress(g),d=await o.ma()}const p=await l.Ku(i.localStore);return await pn(i,p.Qu,void 0),await(function(w,S){const D=U(w);return D.persistence.runTransaction("Save bundle","readwrite",(k=>D.d_.saveBundleMetadata(k,S)))})(i.localStore,u),c._completeWith(p.progress),Promise.resolve(p.Wu)}catch(u){return xe(er,`Loading bundle failed with ${u}`),c._failWith(u),Promise.resolve(new Set)}})(r,e,t).then((s=>{r.sharedClientState.notifyBundleLoaded(s)}))}class Os{constructor(){this.kind="memory",this.synchronizeTabs=!1}async initialize(e){this.serializer=Ur(e.databaseInfo.databaseId),this.sharedClientState=this.vc(e),this.persistence=this.Sc(e),await this.persistence.start(),this.localStore=this.Dc(e),this.gcScheduler=this.xc(e,this.localStore),this.indexBackfillerScheduler=this.Cc(e,this.localStore)}xc(e,t){return null}Cc(e,t){return null}Dc(e){return my(this.persistence,new py,e.initialUser,this.serializer)}Sc(e){return new ph(Rc.w_,this.serializer)}vc(e){return new Cy}async terminate(){var e,t;(e=this.gcScheduler)==null||e.stop(),(t=this.indexBackfillerScheduler)==null||t.stop(),this.sharedClientState.shutdown(),await this.persistence.shutdown()}}Os.provider={build:()=>new Os};class kh extends Os{constructor(e){super(),this.cacheSizeBytes=e}xc(e,t){L(this.persistence.referenceDelegate instanceof $a,46915);const r=this.persistence.referenceDelegate.garbageCollector;return new __(r,e.asyncQueue,t)}Sc(e){const t=this.cacheSizeBytes!==void 0?je.withCacheSize(this.cacheSizeBytes):je.DEFAULT;return new ph((r=>$a.w_(r,t)),this.serializer)}}class Oh extends Os{constructor(e,t,r){super(),this.Fc=e,this.cacheSizeBytes=t,this.forceOwnership=r,this.kind="persistent",this.synchronizeTabs=!1}async initialize(e){await super.initialize(e),await this.Fc.initialize(this,e),await Dh(this.Fc.syncEngine),await Js(this.Fc.remoteStore),await this.persistence.X_((()=>(this.gcScheduler&&!this.gcScheduler.started&&this.gcScheduler.start(),this.indexBackfillerScheduler&&!this.indexBackfillerScheduler.started&&this.indexBackfillerScheduler.start(),Promise.resolve())))}Dc(e){return my(this.persistence,new py,e.initialUser,this.serializer)}xc(e,t){const r=this.persistence.referenceDelegate.garbageCollector;return new __(r,e.asyncQueue,t)}Cc(e,t){const r=new TS(t,this.persistence);return new wS(e.asyncQueue,r)}Sc(e){const t=gh(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey),r=this.cacheSizeBytes!==void 0?je.withCacheSize(this.cacheSizeBytes):je.DEFAULT;return new mh(this.synchronizeTabs,t,e.clientId,r,e.asyncQueue,xy(),ma(),this.serializer,this.sharedClientState,!!this.forceOwnership)}vc(e){return new Cy}}class By extends Oh{constructor(e,t){super(e,t,!1),this.Fc=e,this.cacheSizeBytes=t,this.synchronizeTabs=!0}async initialize(e){await super.initialize(e);const t=this.Fc.syncEngine;this.sharedClientState instanceof gu&&(this.sharedClientState.syncEngine={Iu:jS.bind(null,t),Au:KS.bind(null,t),Vu:WS.bind(null,t),Ro:GS.bind(null,t),Ru:$S.bind(null,t)},await this.sharedClientState.start()),await this.persistence.X_((async r=>{await zS(this.Fc.syncEngine,r),this.gcScheduler&&(r&&!this.gcScheduler.started?this.gcScheduler.start():r||this.gcScheduler.stop()),this.indexBackfillerScheduler&&(r&&!this.indexBackfillerScheduler.started?this.indexBackfillerScheduler.start():r||this.indexBackfillerScheduler.stop())}))}vc(e){const t=xy();if(!gu.Je(t))throw new N(b.UNIMPLEMENTED,"IndexedDB persistence is only available on platforms that support LocalStorage.");const r=gh(e.databaseInfo.databaseId,e.databaseInfo.persistenceKey);return new gu(t,e.asyncQueue,r,e.clientId,e.initialUser)}}class Hn{async initialize(e,t){this.localStore||(this.localStore=e.localStore,this.sharedClientState=e.sharedClientState,this.datastore=this.createDatastore(t),this.remoteStore=this.createRemoteStore(t),this.eventManager=this.createEventManager(t),this.syncEngine=this.createSyncEngine(t,!e.synchronizeTabs),this.sharedClientState.onlineStateHandler=r=>Op(this.syncEngine,r,1),this.remoteStore.remoteSyncer.handleCredentialChange=US.bind(null,this.syncEngine),await Qu(this.remoteStore,this.syncEngine.isPrimaryClient))}createEventManager(e){return(function(){return new vS})()}createDatastore(e){const t=Ur(e.databaseInfo.databaseId),r=nR(e.databaseInfo);return aR(e.authCredentials,e.appCheckCredentials,r,t)}createRemoteStore(e){return(function(r,s,i,o,c){return new aS(r,s,i,o,c)})(this.localStore,this.datastore,e.asyncQueue,(t=>Op(this.syncEngine,t,0)),(function(){return Jf.Je()?new Jf:new XA})())}createSyncEngine(e,t){return(function(s,i,o,c,u,l,d){const p=new SS(s,i,o,c,u,l);return d&&(p.mc=!0),p})(this.localStore,this.remoteStore,this.eventManager,this.sharedClientState,e.initialUser,e.maxConcurrentLimboResolutions,t)}async terminate(){var e,t;await(async function(s){const i=U(s);O(Gt,"RemoteStore shutting down."),i.ca.add(5),await Qs(i),i.Ea.shutdown(),i.ha.set("Unknown")})(this.remoteStore),(e=this.datastore)==null||e.terminate(),(t=this.eventManager)==null||t.terminate()}}Hn.provider={build:()=>new Hn};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let QS=class{constructor(e){this.datastore=e,this.readVersions=new Map,this.mutations=[],this.committed=!1,this.lastTransactionError=null,this.writtenDocs=new Set}async lookup(e){if(this.ensureCommitNotCalled(),this.mutations.length>0)throw this.lastTransactionError=new N(b.INVALID_ARGUMENT,"Firestore transactions require all reads to be executed before all writes."),this.lastTransactionError;const t=await(async function(s,i){const o=U(s),c={documents:i.map((p=>Ps(o.serializer,p)))},u=await o.st("BatchGetDocuments",o.serializer.databaseId,J.emptyPath(),c,i.length),l=new Map;u.forEach((p=>{const g=FA(o.serializer,p);l.set(g.key.toString(),g)}));const d=[];return i.forEach((p=>{const g=l.get(p.toString());L(!!g,55234,{key:p}),d.push(g)})),d})(this.datastore,e);return t.forEach((r=>this.recordVersion(r))),t}set(e,t){this.write(t.toMutation(e,this.precondition(e))),this.writtenDocs.add(e.toString())}update(e,t){try{this.write(t.toMutation(e,this.preconditionForUpdate(e)))}catch(r){this.lastTransactionError=r}this.writtenDocs.add(e.toString())}delete(e){this.write(new zs(e,this.precondition(e))),this.writtenDocs.add(e.toString())}async commit(){if(this.ensureCommitNotCalled(),this.lastTransactionError)throw this.lastTransactionError;const e=this.readVersions;this.mutations.forEach((t=>{e.delete(t.key.toString())})),e.forEach(((t,r)=>{const s=M.fromPath(r);this.mutations.push(new Al(s,this.precondition(s)))})),await(async function(r,s){const i=U(r),o={writes:s.map((c=>Ji(i.serializer,c)))};await i.tt("Commit",i.serializer.databaseId,J.emptyPath(),o)})(this.datastore,this.mutations),this.committed=!0}recordVersion(e){let t;if(e.isFoundDocument())t=e.version;else{if(!e.isNoDocument())throw q(50498,{Oc:e.constructor.name});t=j.min()}const r=this.readVersions.get(e.key.toString());if(r){if(!t.isEqual(r))throw new N(b.ABORTED,"Document version changed between two reads.")}else this.readVersions.set(e.key.toString(),t)}precondition(e){const t=this.readVersions.get(e.toString());return!this.writtenDocs.has(e.toString())&&t?t.isEqual(j.min())?_e.exists(!1):_e.updateTime(t):_e.none()}preconditionForUpdate(e){const t=this.readVersions.get(e.toString());if(!this.writtenDocs.has(e.toString())&&t){if(t.isEqual(j.min()))throw new N(b.INVALID_ARGUMENT,"Can't update a document that doesn't exist.");return _e.updateTime(t)}return _e.exists(!0)}write(e){this.ensureCommitNotCalled(),this.mutations.push(e)}ensureCommitNotCalled(){}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class JS{constructor(e,t,r,s,i){this.asyncQueue=e,this.datastore=t,this.options=r,this.updateFunction=s,this.deferred=i,this.Mc=r.maxAttempts,this.jt=new kl(this.asyncQueue,"transaction_retry")}Nc(){this.Mc-=1,this.Lc()}Lc(){this.jt.Ut((async()=>{const e=new QS(this.datastore),t=this.Bc(e);t&&t.then((r=>{this.asyncQueue.enqueueAndForget((()=>e.commit().then((()=>{this.deferred.resolve(r)})).catch((s=>{this.Uc(s)}))))})).catch((r=>{this.Uc(r)}))}))}Bc(e){try{const t=this.updateFunction(e);return!go(t)&&t.catch&&t.then?t:(this.deferred.reject(Error("Transaction callback must return a Promise")),null)}catch(t){return this.deferred.reject(t),null}}Uc(e){this.Mc>0&&this.kc(e)?(this.Mc-=1,this.asyncQueue.enqueueAndForget((()=>(this.Lc(),Promise.resolve())))):this.deferred.reject(e)}kc(e){if((e==null?void 0:e.name)==="FirebaseError"){const t=e.code;return t==="aborted"||t==="failed-precondition"||t==="already-exists"||!Ug(t)}return!1}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Qn="FirestoreClient";class YS{constructor(e,t,r,s,i){this.authCredentials=e,this.appCheckCredentials=t,this.asyncQueue=r,this._databaseInfo=s,this.user=Le.UNAUTHENTICATED,this.clientId=tc.newId(),this.authCredentialListener=()=>Promise.resolve(),this.appCheckCredentialListener=()=>Promise.resolve(),this._uninitializedComponentsProvider=i,this.authCredentials.start(r,(async o=>{O(Qn,"Received user=",o.uid),await this.authCredentialListener(o),this.user=o})),this.appCheckCredentials.start(r,(o=>(O(Qn,"Received new app check token=",o),this.appCheckCredentialListener(o,this.user))))}get configuration(){return{asyncQueue:this.asyncQueue,databaseInfo:this._databaseInfo,clientId:this.clientId,authCredentials:this.authCredentials,appCheckCredentials:this.appCheckCredentials,initialUser:this.user,maxConcurrentLimboResolutions:100}}setCredentialChangeListener(e){this.authCredentialListener=e}setAppCheckTokenChangeListener(e){this.appCheckCredentialListener=e}terminate(){this.asyncQueue.enterRestrictedMode();const e=new Fe;return this.asyncQueue.enqueueAndForgetEvenWhileRestricted((async()=>{try{this._onlineComponents&&await this._onlineComponents.terminate(),this._offlineComponents&&await this._offlineComponents.terminate(),this.authCredentials.shutdown(),this.appCheckCredentials.shutdown(),e.resolve()}catch(t){const r=Xs(t,"Failed to shutdown persistence");e.reject(r)}})),e.promise}}async function _u(n,e){n.asyncQueue.verifyOperationInProgress(),O(Qn,"Initializing OfflineComponentProvider");const t=n.configuration;await e.initialize(t);let r=t.initialUser;n.setCredentialChangeListener((async s=>{r.isEqual(s)||(await gy(e.localStore,s),r=s)})),e.persistence.setDatabaseDeletedListener((()=>n.terminate())),n._offlineComponents=e}async function Mp(n,e){n.asyncQueue.verifyOperationInProgress();const t=await Lh(n);O(Qn,"Initializing OnlineComponentProvider"),await e.initialize(t,n.configuration),n.setCredentialChangeListener((r=>Vp(e.remoteStore,r))),n.setAppCheckTokenChangeListener(((r,s)=>Vp(e.remoteStore,s))),n._onlineComponents=e}async function Lh(n){if(!n._offlineComponents)if(n._uninitializedComponentsProvider){O(Qn,"Using user provided OfflineComponentProvider");try{await _u(n,n._uninitializedComponentsProvider._offline)}catch(e){const t=e;if(!(function(s){return s.name==="FirebaseError"?s.code===b.FAILED_PRECONDITION||s.code===b.UNIMPLEMENTED:!(typeof DOMException<"u"&&s instanceof DOMException)||s.code===22||s.code===20||s.code===11})(t))throw t;xe("Error using user provided cache. Falling back to memory cache: "+t),await _u(n,new Os)}}else O(Qn,"Using default OfflineComponentProvider"),await _u(n,new kh(void 0));return n._offlineComponents}async function Vc(n){return n._onlineComponents||(n._uninitializedComponentsProvider?(O(Qn,"Using user provided OnlineComponentProvider"),await Mp(n,n._uninitializedComponentsProvider._online)):(O(Qn,"Using default OnlineComponentProvider"),await Mp(n,new Hn))),n._onlineComponents}function qy(n){return Lh(n).then((e=>e.persistence))}function Zs(n){return Lh(n).then((e=>e.localStore))}function $y(n){return Vc(n).then((e=>e.remoteStore))}function Mh(n){return Vc(n).then((e=>e.syncEngine))}function jy(n){return Vc(n).then((e=>e.datastore))}async function Ls(n){const e=await Vc(n),t=e.eventManager;return t.onListen=VS.bind(null,e.syncEngine),t.onUnlisten=xS.bind(null,e.syncEngine),t.onFirstRemoteStoreListen=CS.bind(null,e.syncEngine),t.onLastRemoteStoreUnlisten=NS.bind(null,e.syncEngine),t}function XS(n){return n.asyncQueue.enqueue((async()=>{const e=await qy(n),t=await $y(n);return e.setNetworkEnabled(!0),(function(s){const i=U(s);return i.ca.delete(0),Po(i)})(t)}))}function ZS(n){return n.asyncQueue.enqueue((async()=>{const e=await qy(n),t=await $y(n);return e.setNetworkEnabled(!1),(async function(s){const i=U(s);i.ca.add(0),await Qs(i),i.ha.set("Offline")})(t)}))}function eV(n,e,t,r){const s=new bc(r),i=new bh(e,s,t);return n.asyncQueue.enqueueAndForget((async()=>Ah(await Ls(n),i))),()=>{s.Aa(),n.asyncQueue.enqueueAndForget((async()=>Rh(await Ls(n),i)))}}function tV(n,e){const t=new Fe;return n.asyncQueue.enqueueAndForget((async()=>(async function(s,i,o){try{const c=await(function(l,d){const p=U(l);return p.persistence.runTransaction("read document","readonly",(g=>p.localDocuments.getDocument(g,d)))})(s,i);c.isFoundDocument()?o.resolve(c):c.isNoDocument()?o.resolve(null):o.reject(new N(b.UNAVAILABLE,"Failed to get document from cache. (However, this document may exist on the server. Run again without setting 'source' in the GetOptions to attempt to retrieve the document from the server.)"))}catch(c){const u=Xs(c,`Failed to get document '${i} from cache`);o.reject(u)}})(await Zs(n),e,t))),t.promise}function zy(n,e,t={}){const r=new Fe;return n.asyncQueue.enqueueAndForget((async()=>(function(i,o,c,u,l){const d=new bc({next:g=>{d.Aa(),o.enqueueAndForget((()=>Rh(i,p)));const w=g.docs.has(c);!w&&g.fromCache?l.reject(new N(b.UNAVAILABLE,"Failed to get document because the client is offline.")):w&&g.fromCache&&u&&u.source==="server"?l.reject(new N(b.UNAVAILABLE,'Failed to get document from server. (However, this document does exist in the local cache. Run again without setting source to "server" to retrieve the cached document.)')):l.resolve(g)},error:g=>l.reject(g)}),p=new bh(Gs(c.path),d,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return Ah(i,p)})(await Ls(n),n.asyncQueue,e,t,r))),r.promise}function nV(n,e){const t=new Fe;return n.asyncQueue.enqueueAndForget((async()=>(async function(s,i,o){try{const c=await ja(s,i,!0),u=new Oy(i,c.Wo),l=u.Zu(c.documents),d=u.applyChanges(l,!1);o.resolve(d.snapshot)}catch(c){const u=Xs(c,`Failed to execute query '${i} against cache`);o.reject(u)}})(await Zs(n),e,t))),t.promise}function Gy(n,e,t={}){const r=new Fe;return n.asyncQueue.enqueueAndForget((async()=>(function(i,o,c,u,l){const d=new bc({next:g=>{d.Aa(),o.enqueueAndForget((()=>Rh(i,p))),g.fromCache&&u.source==="server"?l.reject(new N(b.UNAVAILABLE,'Failed to get documents from server. (However, these documents may exist in the local cache. Run again without setting source to "server" to retrieve the cached documents.)')):l.resolve(g)},error:g=>l.reject(g)}),p=new bh(c instanceof Fi?XP(c):c,d,{includeMetadataChanges:!0,waitForSyncWhenOnline:!0});return Ah(i,p)})(await Ls(n),n.asyncQueue,e,t,r))),r.promise}function rV(n,e,t){const r=new Fe;return n.asyncQueue.enqueueAndForget((async()=>{try{const s=await jy(n);r.resolve((async function(o,c,u){var D;const l=U(o),{request:d,ve:p,parent:g}=Zg(l.serializer,Lg(c),u);l.connection.Ye||delete d.parent;const w=(await l.st("RunAggregationQuery",l.serializer.databaseId,g,d,1)).filter((k=>!!k.result));L(w.length===1,64727);const S=(D=w[0].result)==null?void 0:D.aggregateFields;return Object.keys(S).reduce(((k,$)=>(k[p[$]]=S[$],k)),{})})(s,e,t))}catch(s){r.reject(s)}})),r.promise}function sV(n,e){const t=new Fe;return n.asyncQueue.enqueueAndForget((async()=>DS(await Mh(n),e,t))),t.promise}function iV(n,e){const t=new bc(e);return n.asyncQueue.enqueueAndForget((async()=>(function(s,i){U(s).Su.add(i),i.next()})(await Ls(n),t))),()=>{t.Aa(),n.asyncQueue.enqueueAndForget((async()=>(function(s,i){U(s).Su.delete(i)})(await Ls(n),t)))}}function oV(n,e,t){const r=new Fe;return n.asyncQueue.enqueueAndForget((async()=>{const s=await jy(n);new JS(n.asyncQueue,s,t,e,r).Nc()})),r.promise}function aV(n,e,t,r){const s=(function(o,c){let u;return u=typeof o=="string"?zg().encode(o):o,(function(d,p){return new yS(d,p)})((function(d,p){if(d instanceof Uint8Array)return Sp(d,p);if(d instanceof ArrayBuffer)return Sp(new Uint8Array(d),p);if(d instanceof ReadableStream)return d.getReader();throw new Error("Source of `toByteStreamReader` has to be a ArrayBuffer or ReadableStream")})(u),c)})(t,Ur(e));n.asyncQueue.enqueueAndForget((async()=>{HS(await Mh(n),s,r)}))}function cV(n,e){return n.asyncQueue.enqueue((async()=>(function(r,s){const i=U(r);return i.persistence.runTransaction("Get named query","readonly",(o=>i.d_.getNamedQuery(o,s)))})(await Zs(n),e)))}function Ky(n,e){return(function(r,s){return new IS(r,s)})(n,e)}function uV(n,e){return n.asyncQueue.enqueue((async()=>(async function(r,s){const i=U(r),o=i.indexManager,c=[];return i.persistence.runTransaction("Configure indexes","readwrite",(u=>o.getFieldIndexes(u).next((l=>(function(p,g,w,S,D){p=[...p],g=[...g],p.sort(w),g.sort(w);const k=p.length,$=g.length;let z=0,G=0;for(;z<$&&G<k;){const ie=w(p[G],g[z]);ie<0?D(p[G++]):ie>0?S(g[z++]):(z++,G++)}for(;z<$;)S(g[z++]);for(;G<k;)D(p[G++])})(l,s,yA,(d=>{c.push(o.addFieldIndex(u,d))}),(d=>{c.push(o.deleteFieldIndex(u,d))})))).next((()=>R.waitFor(c)))))})(await Zs(n),e)))}function lV(n,e){return n.asyncQueue.enqueue((async()=>(function(r,s){U(r).Mo.po=s})(await Zs(n),e)))}function hV(n){return n.asyncQueue.enqueue((async()=>(function(t){const r=U(t),s=r.indexManager;return r.persistence.runTransaction("Delete All Indexes","readwrite",(i=>s.deleteAllFieldIndexes(i)))})(await Zs(n))))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Fp="AsyncQueue";class Up{constructor(e=Promise.resolve()){this.Wc=[],this.Qc=!1,this.Gc=[],this.zc=null,this.jc=!1,this.Hc=!1,this.Jc=[],this.jt=new kl(this,"async_queue_retry"),this.Yc=()=>{const r=ma();r&&O(Fp,"Visibility state changed to "+r.visibilityState),this.jt.qt()},this.Zc=e;const t=ma();t&&typeof t.addEventListener=="function"&&t.addEventListener("visibilitychange",this.Yc)}get isShuttingDown(){return this.Qc}enqueueAndForget(e){this.enqueue(e)}enqueueAndForgetEvenWhileRestricted(e){this.Xc(),this.el(e)}enterRestrictedMode(e){if(!this.Qc){this.Qc=!0,this.Hc=e||!1;const t=ma();t&&typeof t.removeEventListener=="function"&&t.removeEventListener("visibilitychange",this.Yc)}}enqueue(e){if(this.Xc(),this.Qc)return new Promise((()=>{}));const t=new Fe;return this.el((()=>this.Qc&&this.Hc?Promise.resolve():(e().then(t.resolve,t.reject),t.promise))).then((()=>t.promise))}enqueueRetryable(e){this.enqueueAndForget((()=>(this.Wc.push(e),this.tl())))}async tl(){if(this.Wc.length!==0){try{await this.Wc[0](),this.Wc.shift(),this.jt.reset()}catch(e){if(!Xn(e))throw e;O(Fp,"Operation failed with retryable error: "+e)}this.Wc.length>0&&this.jt.Ut((()=>this.tl()))}}el(e){const t=this.Zc.then((()=>(this.jc=!0,e().catch((r=>{throw this.zc=r,this.jc=!1,Te("INTERNAL UNHANDLED ERROR: ",Bp(r)),r})).then((r=>(this.jc=!1,r))))));return this.Zc=t,t}enqueueAfterDelay(e,t,r){this.Xc(),this.Jc.indexOf(e)>-1&&(t=0);const s=Eh.createAndSchedule(this,e,t,r,(i=>this.nl(i)));return this.Gc.push(s),s}Xc(){this.zc&&q(47125,{rl:Bp(this.zc)})}verifyOperationInProgress(){}async il(){let e;do e=this.Zc,await e;while(e!==this.Zc)}sl(e){for(const t of this.Gc)if(t.timerId===e)return!0;return!1}_l(e){return this.il().then((()=>{this.Gc.sort(((t,r)=>t.targetTimeMs-r.targetTimeMs));for(const t of this.Gc)if(t.skipDelay(),e!=="all"&&t.timerId===e)break;return this.il()}))}ol(e){this.Jc.push(e)}nl(e){const t=this.Gc.indexOf(e);this.Gc.splice(t,1)}}function Bp(n){let e=n.message||"";return n.stack&&(e=n.stack.includes(n.message)?n.stack:n.message+`
`+n.stack),e}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Wy{constructor(){this._progressObserver={},this._taskCompletionResolver=new Fe,this._lastProgress={taskState:"Running",totalBytes:0,totalDocuments:0,bytesLoaded:0,documentsLoaded:0}}onProgress(e,t,r){this._progressObserver={next:e,error:t,complete:r}}catch(e){return this._taskCompletionResolver.promise.catch(e)}then(e,t){return this._taskCompletionResolver.promise.then(e,t)}_completeWith(e){this._updateProgress(e),this._progressObserver.complete&&this._progressObserver.complete(),this._taskCompletionResolver.resolve(e)}_failWith(e){this._lastProgress.taskState="Error",this._progressObserver.next&&this._progressObserver.next(this._lastProgress),this._progressObserver.error&&this._progressObserver.error(e),this._taskCompletionResolver.reject(e)}_updateProgress(e){this._lastProgress=e,this._progressObserver.next&&this._progressObserver.next(e)}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const dV=-1;class le extends yo{constructor(e,t,r,s){super(e,t,r,s),this.type="firestore",this._queue=new Up,this._persistenceKey=(s==null?void 0:s.name)||"[DEFAULT]"}async _terminate(){if(this._firestoreClient){const e=this._firestoreClient.terminate();this._queue=new Up(e),this._firestoreClient=void 0,await e}}}function fV(n,e,t){t||(t=Wi);const r=un(n,"firestore");if(r.isInitialized(t)){const s=r.getImmediate({identifier:t}),i=r.getOptions(t);if(_t(i,e))return s;throw new N(b.FAILED_PRECONDITION,"initializeFirestore() has already been called with different options. To avoid this error, call initializeFirestore() with the same options as when it was originally called, or call getFirestore() to return the already initialized instance.")}if(e.cacheSizeBytes!==void 0&&e.localCache!==void 0)throw new N(b.INVALID_ARGUMENT,"cache and cacheSizeBytes cannot be specified at the same time as cacheSizeBytes willbe deprecated. Instead, specify the cache size in the cache object");if(e.cacheSizeBytes!==void 0&&e.cacheSizeBytes!==-1&&e.cacheSizeBytes<g_)throw new N(b.INVALID_ARGUMENT,"cacheSizeBytes must be at least 1048576");return e.host&&Fs(e.host)&&il(e.host),r.initialize({options:e,instanceIdentifier:t})}function pV(n,e){const t=typeof n=="object"?n:ol(),r=typeof n=="string"?n:e||Wi,s=un(t,"firestore").getImmediate({identifier:r});if(!s._initialized){const i=gw("firestore");i&&w_(s,...i)}return s}function ye(n){if(n._terminated)throw new N(b.FAILED_PRECONDITION,"The client has already been terminated.");return n._firestoreClient||Hy(n),n._firestoreClient}function Hy(n){var r,s,i,o;const e=n._freezeSettings(),t=uR(n._databaseId,((r=n._app)==null?void 0:r.options.appId)||"",n._persistenceKey,(s=n._app)==null?void 0:s.options.apiKey,e);n._componentsProvider||(i=e.localCache)!=null&&i._offlineComponentProvider&&((o=e.localCache)!=null&&o._onlineComponentProvider)&&(n._componentsProvider={_offline:e.localCache._offlineComponentProvider,_online:e.localCache._onlineComponentProvider}),n._firestoreClient=new YS(n._authCredentials,n._appCheckCredentials,n._queue,t,n._componentsProvider&&(function(u){const l=u==null?void 0:u._online.build();return{_offline:u==null?void 0:u._offline.build(l),_online:l}})(n._componentsProvider))}function mV(n,e){xe("enableIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const t=n._freezeSettings();return Qy(n,Hn.provider,{build:r=>new Oh(r,t.cacheSizeBytes,e==null?void 0:e.forceOwnership)}),Promise.resolve()}async function gV(n){xe("enableMultiTabIndexedDbPersistence() will be deprecated in the future, you can use `FirestoreSettings.cache` instead.");const e=n._freezeSettings();Qy(n,Hn.provider,{build:t=>new By(t,e.cacheSizeBytes)})}function Qy(n,e,t){if((n=X(n,le))._firestoreClient||n._terminated)throw new N(b.FAILED_PRECONDITION,"Firestore has already been started and persistence can no longer be enabled. You can only enable persistence before calling any other methods on a Firestore object.");if(n._componentsProvider||n._getSettings().localCache)throw new N(b.FAILED_PRECONDITION,"SDK cache is already specified.");n._componentsProvider={_online:e,_offline:t},Hy(n)}function _V(n){if(n._initialized&&!n._terminated)throw new N(b.FAILED_PRECONDITION,"Persistence can only be cleared before a Firestore instance is initialized or after it is terminated.");const e=new Fe;return n._queue.enqueueAndForgetEvenWhileRestricted((async()=>{try{await(async function(r){if(!qt.Je())return Promise.resolve();const s=r+fy;await qt.delete(s)})(gh(n._databaseId,n._persistenceKey)),e.resolve()}catch(t){e.reject(t)}})),e.promise}function yV(n){return(function(t){const r=new Fe;return t.asyncQueue.enqueueAndForget((async()=>MS(await Mh(t),r))),r.promise})(ye(n=X(n,le)))}function IV(n){return XS(ye(n=X(n,le)))}function wV(n){return ZS(ye(n=X(n,le)))}function TV(n){return _T(n.app,"firestore",n._databaseId.database),n._delete()}function Zu(n,e){const t=ye(n=X(n,le)),r=new Wy;return aV(t,n._databaseId,e,r),r}function Jy(n,e){return cV(ye(n=X(n,le)),e).then((t=>t?new Ne(n,null,t.query):null))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Fh{convertValue(e,t="none"){switch(be(e)){case 0:return null;case 1:return e.booleanValue;case 2:return fe(e.integerValue||e.doubleValue);case 3:return this.convertTimestamp(e.timestampValue);case 4:return this.convertServerTimestamp(e,t);case 5:return e.stringValue;case 6:return this.convertBytes(on(e.bytesValue));case 7:return this.convertReference(e.referenceValue);case 8:return this.convertGeoPoint(e.geoPointValue);case 9:return this.convertArray(e.arrayValue,t);case 11:return this.convertObject(e.mapValue,t);case 10:return this.convertVectorValue(e.mapValue);default:throw q(62114,{value:e})}}convertObject(e,t){return this.convertObjectMap(e.fields,t)}convertObjectMap(e,t="none"){const r={};return Jn(e,((s,i)=>{r[s]=this.convertValue(i,t)})),r}convertVectorValue(e){var r,s,i;const t=(i=(s=(r=e.fields)==null?void 0:r[Rr].arrayValue)==null?void 0:s.values)==null?void 0:i.map((o=>fe(o.doubleValue)));return new Ye(t)}convertGeoPoint(e){return new vt(fe(e.latitude),fe(e.longitude))}convertArray(e,t){return(e.values||[]).map((r=>this.convertValue(r,t)))}convertServerTimestamp(e,t){switch(t){case"previous":const r=mo(e);return r==null?null:this.convertValue(r,t);case"estimate":return this.convertTimestamp(ms(e));default:return null}}convertTimestamp(e){const t=sn(e);return new oe(t.seconds,t.nanos)}convertDocumentKey(e,t){const r=J.fromString(e);L(s_(r),9688,{name:e});const s=new Bn(r.get(1),r.get(3)),i=new M(r.popFirst(5));return s.isEqual(t)||Te(`Document ${i} contains a document reference within a different database (${s.projectId}/${s.database}) which is not supported. It will be treated as a reference in the current database (${t.projectId}/${t.database}) instead.`),i}}/**
 * @license
 * Copyright 2024 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class tr extends Fh{constructor(e){super(),this.firestore=e}convertBytes(e){return new et(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ae(this.firestore,null,t)}}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function EV(n){var r;const e=ye(X(n.firestore,le)),t=(r=e._onlineComponents)==null?void 0:r.datastore.serializer;return t===void 0?null:uc(t,Ge(n._query)).be}function vV(n,e){var i;const t=yl(e,((o,c)=>new Rg(c,o.aggregateType,o._internalFieldPath))),r=ye(X(n.firestore,le)),s=(i=r._onlineComponents)==null?void 0:i.datastore.serializer;return s===void 0?null:Zg(s,Lg(n._query),t,!0).request}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function hs(n){return(function(t,r){if(typeof t!="object"||t===null)return!1;const s=t;for(const i of r)if(i in s&&typeof s[i]=="function")return!0;return!1})(n,["next","error","complete"])}const qp="@firebase/firestore",$p="4.17.0";/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class Ms{constructor(e="count",t){this._internalFieldPath=t,this.type="AggregateField",this.aggregateType=e}}class Yy{constructor(e,t,r){this._userDataWriter=t,this._data=r,this.type="AggregateQuerySnapshot",this.query=e}data(){return this._userDataWriter.convertObjectMap(this._data)}_fieldsProto(){return new Ve({mapValue:{fields:this._data}}).clone().value.mapValue.fields}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let oo=class{constructor(e,t,r,s,i){this._firestore=e,this._userDataWriter=t,this._key=r,this._document=s,this._converter=i}get id(){return this._key.path.lastSegment()}get ref(){return new ae(this._firestore,this._converter,this._key)}exists(){return this._document!==null}data(){if(this._document){if(this._converter){const e=new AV(this._firestore,this._userDataWriter,this._key,this._document,null);return this._converter.fromFirestore(e)}return this._userDataWriter.convertValue(this._document.data.value)}}_fieldsProto(){var e;return((e=this._document)==null?void 0:e.data.clone().value.mapValue.fields)??void 0}get(e){if(this._document){const t=this._document.data.field(Pt("DocumentSnapshot.get",e));if(t!==null)return this._userDataWriter.convertValue(t)}}},AV=class extends oo{data(){return super.data()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Xy(n){if(n.limitType==="L"&&n.explicitOrderBy.length===0)throw new N(b.UNIMPLEMENTED,"limitToLast() queries require specifying at least one orderBy() clause")}class Uh{}class ei extends Uh{}function RV(n,e,...t){let r=[];e instanceof Uh&&r.push(e),r=r.concat(t),(function(i){const o=i.filter((u=>u instanceof Gr)).length,c=i.filter((u=>u instanceof ti)).length;if(o>1||o>0&&c>0)throw new N(b.INVALID_ARGUMENT,"InvalidQuery. When using composite filters, you cannot use more than one filter at the top level. Consider nesting the multiple filters within an `and(...)` statement. For example: change `query(query, where(...), or(...))` to `query(query, and(where(...), or(...)))`.")})(r);for(const s of r)n=s._apply(n);return n}class ti extends ei{constructor(e,t,r){super(),this._field=e,this._op=t,this._value=r,this.type="where"}static _create(e,t,r){return new ti(e,t,r)}_apply(e){const t=this._parse(e);return eI(e._query,t),new Ne(e.firestore,e.converter,Nu(e._query,t))}_parse(e){const t=qr(e.firestore);return(function(i,o,c,u,l,d,p){let g;if(l.isKeyField()){if(d==="array-contains"||d==="array-contains-any")throw new N(b.INVALID_ARGUMENT,`Invalid Query. You can't perform '${d}' queries on documentId().`);if(d==="in"||d==="not-in"){zp(p,d);const S=[];for(const D of p)S.push(jp(u,i,D));g={arrayValue:{values:S}}}else g=jp(u,i,p)}else d!=="in"&&d!=="not-in"&&d!=="array-contains-any"||zp(p,d),g=R_(c,o,p,d==="in"||d==="not-in");return ee.create(l,d,g)})(e._query,"where",t,e.firestore._databaseId,this._field,this._op,this._value)}}function PV(n,e,t){const r=e,s=Pt("where",n);return ti._create(s,r,t)}class Gr extends Uh{constructor(e,t){super(),this.type=e,this._queryConstraints=t}static _create(e,t){return new Gr(e,t)}_parse(e){const t=this._queryConstraints.map((r=>r._parse(e))).filter((r=>r.getFilters().length>0));return t.length===1?t[0]:ue.create(t,this._getOperator())}_apply(e){const t=this._parse(e);return t.getFilters().length===0?e:((function(s,i){let o=s;const c=i.getFlattenedFilters();for(const u of c)eI(o,u),o=Nu(o,u)})(e._query,t),new Ne(e.firestore,e.converter,Nu(e._query,t)))}_getQueryConstraints(){return this._queryConstraints}_getOperator(){return this.type==="and"?"and":"or"}}function bV(...n){return n.forEach((e=>tI("or",e))),Gr._create("or",n)}function SV(...n){return n.forEach((e=>tI("and",e))),Gr._create("and",n)}class Cc extends ei{constructor(e,t){super(),this._field=e,this._direction=t,this.type="orderBy"}static _create(e,t){return new Cc(e,t)}_apply(e){const t=(function(s,i,o){if(s.startAt!==null)throw new N(b.INVALID_ARGUMENT,"Invalid query. You must not call startAt() or startAfter() before calling orderBy().");if(s.endAt!==null)throw new N(b.INVALID_ARGUMENT,"Invalid query. You must not call endAt() or endBefore() before calling orderBy().");return new Qi(i,o)})(e._query,this._field,this._direction);return new Ne(e.firestore,e.converter,EA(e._query,t))}}function VV(n,e="asc"){const t=e,r=Pt("orderBy",n);return Cc._create(r,t)}class bo extends ei{constructor(e,t,r){super(),this.type=e,this._limit=t,this._limitType=r}static _create(e,t,r){return new bo(e,t,r)}_apply(e){return new Ne(e.firestore,e.converter,xa(e._query,this._limit,this._limitType))}}function CV(n){return cg("limit",n),bo._create("limit",n,"F")}function xV(n){return cg("limitToLast",n),bo._create("limitToLast",n,"L")}class So extends ei{constructor(e,t,r){super(),this.type=e,this._docOrFields=t,this._inclusive=r}static _create(e,t,r){return new So(e,t,r)}_apply(e){const t=Zy(e,this.type,this._docOrFields,this._inclusive);return new Ne(e.firestore,e.converter,vA(e._query,t))}}function NV(...n){return So._create("startAt",n,!0)}function DV(...n){return So._create("startAfter",n,!1)}class Vo extends ei{constructor(e,t,r){super(),this.type=e,this._docOrFields=t,this._inclusive=r}static _create(e,t,r){return new Vo(e,t,r)}_apply(e){const t=Zy(e,this.type,this._docOrFields,this._inclusive);return new Ne(e.firestore,e.converter,AA(e._query,t))}}function kV(...n){return Vo._create("endBefore",n,!1)}function OV(...n){return Vo._create("endAt",n,!0)}function Zy(n,e,t,r){if(t[0]=re(t[0]),t[0]instanceof oo)return(function(i,o,c,u,l){if(!u)throw new N(b.NOT_FOUND,`Can't use a DocumentSnapshot that doesn't exist for ${c}().`);const d=[];for(const p of us(i))if(p.field.isKeyField())d.push(Pr(o,u.key));else{const g=u.data.field(p.field);if(po(g))throw new N(b.INVALID_ARGUMENT,'Invalid query. You are trying to start or end a query using a document for which the field "'+p.field+'" is an uncommitted server timestamp. (Since the value of this field is unknown, you cannot start/end a query with it.)');if(g===null){const w=p.field.canonicalString();throw new N(b.INVALID_ARGUMENT,`Invalid query. You are trying to start or end a query using a document for which the field '${w}' (used as the orderBy) does not exist.`)}d.push(g)}return new jn(d,l)})(n._query,n.firestore._databaseId,e,t[0]._document,r);{const s=qr(n.firestore);return(function(o,c,u,l,d,p){const g=o.explicitOrderBy;if(d.length>g.length)throw new N(b.INVALID_ARGUMENT,`Too many arguments provided to ${l}(). The number of arguments must be less than or equal to the number of orderBy() clauses`);const w=[];for(let S=0;S<d.length;S++){const D=d[S];if(g[S].field.isKeyField()){if(typeof D!="string")throw new N(b.INVALID_ARGUMENT,`Invalid query. Expected a string for document ID in ${l}(), but got a ${typeof D}`);if(!Vl(o)&&D.indexOf("/")!==-1)throw new N(b.INVALID_ARGUMENT,`Invalid query. When querying a collection and ordering by documentId(), the value passed to ${l}() must be a plain document ID, but '${D}' contains a slash.`);const k=o.path.child(J.fromString(D));if(!M.isDocumentKey(k))throw new N(b.INVALID_ARGUMENT,`Invalid query. When querying a collection group and ordering by documentId(), the value passed to ${l}() must result in a valid document path, but '${k}' is not because it contains an odd number of segments.`);const $=new M(k);w.push(Pr(c,$))}else{const k=R_(u,l,D);w.push(k)}}return new jn(w,p)})(n._query,n.firestore._databaseId,s,e,t,r)}}function jp(n,e,t){if(typeof(t=re(t))=="string"){if(t==="")throw new N(b.INVALID_ARGUMENT,"Invalid query. When querying with documentId(), you must provide a valid document ID, but it was an empty string.");if(!Vl(e)&&t.indexOf("/")!==-1)throw new N(b.INVALID_ARGUMENT,`Invalid query. When querying a collection by documentId(), you must provide a plain document ID, but '${t}' contains a '/' character.`);const r=e.path.child(J.fromString(t));if(!M.isDocumentKey(r))throw new N(b.INVALID_ARGUMENT,`Invalid query. When querying a collection group by documentId(), the value provided must result in a valid document path, but '${r}' is not because it has an odd number of segments (${r.length}).`);return Pr(n,new M(r))}if(t instanceof ae)return Pr(n,t._key);throw new N(b.INVALID_ARGUMENT,`Invalid query. When querying with documentId(), you must provide a valid string or a DocumentReference, but it was: ${nc(t)}.`)}function zp(n,e){if(!Array.isArray(n)||n.length===0)throw new N(b.INVALID_ARGUMENT,`Invalid Query. A non-empty array is required for '${e.toString()}' filters.`)}function eI(n,e){const t=(function(s,i){for(const o of s)for(const c of o.getFlattenedFilters())if(i.indexOf(c.op)>=0)return c.op;return null})(n.filters,(function(s){switch(s){case"!=":return["!=","not-in"];case"array-contains-any":case"in":return["not-in"];case"not-in":return["array-contains-any","in","not-in","!="];default:return[]}})(e.op));if(t!==null)throw t===e.op?new N(b.INVALID_ARGUMENT,`Invalid query. You cannot use more than one '${e.op.toString()}' filter.`):new N(b.INVALID_ARGUMENT,`Invalid query. You cannot use '${e.op.toString()}' filters with '${t.toString()}' filters.`)}function tI(n,e){if(!(e instanceof ti||e instanceof Gr))throw new N(b.INVALID_ARGUMENT,`Function ${n}() requires AppliableConstraints created with a call to 'where(...)', 'or(...)', or 'and(...)'.`)}function xc(n,e,t){let r;return r=n?t&&(t.merge||t.mergeFields)?n.toFirestore(e,t):n.toFirestore(e):e,r}class Bh extends Fh{constructor(e){super(),this.firestore=e}convertBytes(e){return new et(e)}convertReference(e){const t=this.convertDocumentKey(e,this.firestore._databaseId);return new ae(this.firestore,null,t)}}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function LV(n){return new Ms("sum",Pt("sum",n))}function MV(n){return new Ms("avg",Pt("average",n))}function nI(){return new Ms("count")}function FV(n,e){var t,r;return n instanceof Ms&&e instanceof Ms&&n.aggregateType===e.aggregateType&&((t=n._internalFieldPath)==null?void 0:t.canonicalString())===((r=e._internalFieldPath)==null?void 0:r.canonicalString())}function UV(n,e){return Ll(n.query,e.query)&&_t(n.data(),e.data())}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function BV(n){return rI(n,{count:nI()})}function rI(n,e){const t=X(n.firestore,le),r=ye(t),s=yl(e,((i,o)=>new Rg(o,i.aggregateType,i._internalFieldPath)));return rV(r,n._query,s).then((i=>(function(c,u,l){const d=new tr(c);return new Yy(u,d,l)})(t,n,i)))}class qV{constructor(e){this.kind="memory",this._onlineComponentProvider=Hn.provider,this._offlineComponentProvider=e!=null&&e.garbageCollector?e.garbageCollector._offlineComponentProvider:{build:()=>new kh(void 0)}}toJSON(){return{kind:this.kind}}}class $V{constructor(e){let t;this.kind="persistent",e!=null&&e.tabManager?(e.tabManager._initialize(e),t=e.tabManager):(t=sI(void 0),t._initialize(e)),this._onlineComponentProvider=t._onlineComponentProvider,this._offlineComponentProvider=t._offlineComponentProvider}toJSON(){return{kind:this.kind}}}class jV{constructor(){this.kind="memoryEager",this._offlineComponentProvider=Os.provider}toJSON(){return{kind:this.kind}}}class zV{constructor(e){this.kind="memoryLru",this._offlineComponentProvider={build:()=>new kh(e)}}toJSON(){return{kind:this.kind}}}function GV(){return new jV}function KV(n){return new zV(n==null?void 0:n.cacheSizeBytes)}function WV(n){return new qV(n)}function HV(n){return new $V(n)}class QV{constructor(e){this.forceOwnership=e,this.kind="persistentSingleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=Hn.provider,this._offlineComponentProvider={build:t=>new Oh(t,e==null?void 0:e.cacheSizeBytes,this.forceOwnership)}}}class JV{constructor(){this.kind="PersistentMultipleTab"}toJSON(){return{kind:this.kind}}_initialize(e){this._onlineComponentProvider=Hn.provider,this._offlineComponentProvider={build:t=>new By(t,e==null?void 0:e.cacheSizeBytes)}}}function sI(n){return new QV(n==null?void 0:n.forceOwnership)}function YV(){return new JV}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *//**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const iI="NOT SUPPORTED";class Xt{constructor(e,t){this.hasPendingWrites=e,this.fromCache=t}isEqual(e){return this.hasPendingWrites===e.hasPendingWrites&&this.fromCache===e.fromCache}}class rt extends oo{constructor(e,t,r,s,i,o){super(e,t,r,s,o),this._firestore=e,this._firestoreImpl=e,this.metadata=i}exists(){return super.exists()}data(e={}){if(this._document){if(this._converter){const t=new zi(this._firestore,this._userDataWriter,this._key,this._document,this.metadata,null);return this._converter.fromFirestore(t,e)}return this._userDataWriter.convertValue(this._document.data.value,e.serverTimestamps)}}get(e,t={}){if(this._document){const r=this._document.data.field(Pt("DocumentSnapshot.get",e));if(r!==null)return this._userDataWriter.convertValue(r,t.serverTimestamps)}}toJSON(){if(this.metadata.hasPendingWrites)throw new N(b.FAILED_PRECONDITION,"DocumentSnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e=this._document,t={};return t.type=rt._jsonSchemaVersion,t.bundle="",t.bundleSource="DocumentSnapshot",t.bundleName=this._key.toString(),!e||!e.isValidDocument()||!e.isFoundDocument()?t:(this._userDataWriter.convertObjectMap(e.data.value.mapValue.fields,"previous"),t.bundle=(this._firestore,this.ref.path,"NOT SUPPORTED"),t)}}function XV(n,e,t){if(Mr(e,rt._jsonSchema)){if(e.bundle===iI)throw new N(b.INVALID_ARGUMENT,"The provided JSON object was created in a client environment, which is not supported.");const r=Ur(n._databaseId),s=Ky(e.bundle,r),i=s.va(),o=new Sh(s.getMetadata(),r);for(const d of i)o.qu(d);const c=o.documents;if(c.length!==1)throw new N(b.INVALID_ARGUMENT,`Expected bundle data to contain 1 document, but it contains ${c.length} documents.`);const u=cc(r,c[0].document),l=new M(J.fromString(e.bundleName));return new rt(n,new Bh(n),l,u,new Xt(!1,!1),t||null)}}rt._jsonSchemaVersion="firestore/documentSnapshot/1.0",rt._jsonSchema={type:Pe("string",rt._jsonSchemaVersion),bundleSource:Pe("string","DocumentSnapshot"),bundleName:Pe("string"),bundle:Pe("string")};class zi extends rt{data(e={}){return super.data(e)}}class st{constructor(e,t,r,s){this._firestore=e,this._userDataWriter=t,this._snapshot=s,this.metadata=new Xt(s.hasPendingWrites,s.fromCache),this.query=r}get docs(){const e=[];return this.forEach((t=>e.push(t))),e}get size(){return this._snapshot.docs.size}get empty(){return this.size===0}forEach(e,t){this._snapshot.docs.forEach((r=>{e.call(t,new zi(this._firestore,this._userDataWriter,r.key,r,new Xt(this._snapshot.mutatedKeys.has(r.key),this._snapshot.fromCache),this.query.converter))}))}docChanges(e={}){const t=!!e.includeMetadataChanges;if(t&&this._snapshot.excludesMetadataChanges)throw new N(b.INVALID_ARGUMENT,"To include metadata changes with your document changes, you must also pass { includeMetadataChanges:true } to onSnapshot().");return this._cachedChanges&&this._cachedChangesIncludeMetadataChanges===t||(this._cachedChanges=(function(s,i){if(s._snapshot.oldDocs.isEmpty()){let o=0;return s._snapshot.docChanges.map((c=>{Ie(s._snapshot.query)?qa(s._snapshot.query):ac(s.query._query);const u=new zi(s._firestore,s._userDataWriter,c.doc.key,c.doc,new Xt(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);return c.doc,{type:"added",doc:u,oldIndex:-1,newIndex:o++}}))}{let o=s._snapshot.oldDocs;return s._snapshot.docChanges.filter((c=>i||c.type!==3)).map((c=>{const u=new zi(s._firestore,s._userDataWriter,c.doc.key,c.doc,new Xt(s._snapshot.mutatedKeys.has(c.doc.key),s._snapshot.fromCache),s.query.converter);let l=-1,d=-1;return c.type!==0&&(l=o.indexOf(c.doc.key),o=o.delete(c.doc.key)),c.type!==1&&(o=o.add(c.doc),d=o.indexOf(c.doc.key)),{type:eC(c.type),doc:u,oldIndex:l,newIndex:d}}))}})(this,t),this._cachedChangesIncludeMetadataChanges=t),this._cachedChanges}toJSON(){if(this.metadata.hasPendingWrites)throw new N(b.FAILED_PRECONDITION,"QuerySnapshot.toJSON() attempted to serialize a document with pending writes. Await waitForPendingWrites() before invoking toJSON().");const e={};e.type=st._jsonSchemaVersion,e.bundleSource="QuerySnapshot",e.bundleName=tc.newId(),this._firestore._databaseId.database,this._firestore._databaseId.projectId;const t=[],r=[],s=[];return this.docs.forEach((i=>{i._document!==null&&(t.push(i._document),r.push(this._userDataWriter.convertObjectMap(i._document.data.value.mapValue.fields,"previous")),s.push(i.ref.path))})),e.bundle=(this._firestore,this.query._query,e.bundleName,"NOT SUPPORTED"),e}}function ZV(n,e,t){if(Mr(e,st._jsonSchema)){if(e.bundle===iI)throw new N(b.INVALID_ARGUMENT,"The provided JSON object was created in a client environment, which is not supported.");const r=Ur(n._databaseId),s=Ky(e.bundle,r),i=s.va(),o=new Sh(s.getMetadata(),r);for(const w of i)o.qu(w);if(o.queries.length!==1)throw new N(b.INVALID_ARGUMENT,`Snapshot data expected 1 query but found ${o.queries.length} queries.`);const c=Tc(o.queries[0].bundledQuery),u=Ie(c)?qa(c):ac(c),l=o.documents;let d=new Fn(u);l.map((w=>{const S=cc(r,w.document);d=d.add(S)}));const p=Dr.fromInitialDocuments(c,d,Q(),!1,!1),g=new Ne(n,t||null,c);return new st(n,new Bh(n),g,p)}}function eC(n){switch(n){case 0:return"added";case 2:case 3:return"modified";case 1:return"removed";default:return q(61501,{type:n})}}function tC(n,e){return n instanceof rt&&e instanceof rt?n._firestore===e._firestore&&n._key.isEqual(e._key)&&(n._document===null?e._document===null:n._document.isEqual(e._document))&&n._converter===e._converter:n instanceof st&&e instanceof st&&n._firestore===e._firestore&&Ll(n.query,e.query)&&n.metadata.isEqual(e.metadata)&&n._snapshot.isEqual(e._snapshot)}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */st._jsonSchemaVersion="firestore/querySnapshot/1.0",st._jsonSchema={type:Pe("string",st._jsonSchemaVersion),bundleSource:Pe("string","QuerySnapshot"),bundleName:Pe("string"),bundle:Pe("string")};const nC={maxAttempts:5};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class oI{constructor(e,t){this._firestore=e,this._commitHandler=t,this._mutations=[],this._committed=!1,this._dataReader=qr(e)}set(e,t,r){this._verifyNotCommitted();const s=kn(e,this._firestore),i=xc(s.converter,t,r),o=dc(this._dataReader,"WriteBatch.set",s._key,i,s.converter!==null,r);return this._mutations.push(o.toMutation(s._key,_e.none())),this}update(e,t,r,...s){this._verifyNotCommitted();const i=kn(e,this._firestore);let o;return o=typeof(t=re(t))=="string"||t instanceof Br?zl(this._dataReader,"WriteBatch.update",i._key,t,r,s):jl(this._dataReader,"WriteBatch.update",i._key,t),this._mutations.push(o.toMutation(i._key,_e.exists(!0))),this}delete(e){this._verifyNotCommitted();const t=kn(e,this._firestore);return this._mutations=this._mutations.concat(new zs(t._key,_e.none())),this}commit(){return this._verifyNotCommitted(),this._committed=!0,this._mutations.length>0?this._commitHandler(this._mutations):Promise.resolve()}_verifyNotCommitted(){if(this._committed)throw new N(b.FAILED_PRECONDITION,"A write batch can no longer be used after commit() has been called.")}}function kn(n,e){if((n=re(n)).firestore!==e)throw new N(b.INVALID_ARGUMENT,"Provided document reference is from a different Firestore instance.");return n}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let rC=class{constructor(e,t){this._firestore=e,this._transaction=t,this._dataReader=qr(e)}get(e){const t=kn(e,this._firestore),r=new Bh(this._firestore);return this._transaction.lookup([t._key]).then((s=>{if(!s||s.length!==1)return q(24041);const i=s[0];if(i.isFoundDocument())return new oo(this._firestore,r,i.key,i,t.converter);if(i.isNoDocument())return new oo(this._firestore,r,t._key,null,t.converter);throw q(18433,{doc:i})}))}set(e,t,r){const s=kn(e,this._firestore),i=xc(s.converter,t,r),o=dc(this._dataReader,"Transaction.set",s._key,i,s.converter!==null,r);return this._transaction.set(s._key,o),this}update(e,t,r,...s){const i=kn(e,this._firestore);let o;return o=typeof(t=re(t))=="string"||t instanceof Br?zl(this._dataReader,"Transaction.update",i._key,t,r,s):jl(this._dataReader,"Transaction.update",i._key,t),this._transaction.update(i._key,o),this}delete(e){const t=kn(e,this._firestore);return this._transaction.delete(t._key),this}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class aI extends rC{constructor(e,t){super(e,t),this._firestore=e}get(e){const t=kn(e,this._firestore),r=new tr(this._firestore);return super.get(e).then((s=>new rt(this._firestore,r,t._key,s._document,new Xt(!1,!1),t.converter)))}}function sC(n,e,t){n=X(n,le);const r={...nC,...t};(function(o){if(o.maxAttempts<1)throw new N(b.INVALID_ARGUMENT,"Max attempts must be at least 1")})(r);const s=ye(n);return oV(s,(i=>e(new aI(n,i))),r)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function iC(n){n=X(n,ae);const e=X(n.firestore,le),t=ye(e);return zy(t,n._key).then((r=>qh(e,n,r)))}function oC(n){n=X(n,ae);const e=X(n.firestore,le),t=ye(e),r=new tr(e);return tV(t,n._key).then((s=>new rt(e,r,n._key,s,new Xt(s!==null&&s.hasLocalMutations,!0),n.converter)))}function aC(n){n=X(n,ae);const e=X(n.firestore,le),t=ye(e);return zy(t,n._key,{source:"server"}).then((r=>qh(e,n,r)))}function cC(n){n=X(n,Ne);const e=X(n.firestore,le),t=ye(e),r=new tr(e);return Xy(n._query),Gy(t,n._query).then((s=>new st(e,r,n,s)))}function uC(n){n=X(n,Ne);const e=X(n.firestore,le),t=ye(e),r=new tr(e);return nV(t,n._query).then((s=>new st(e,r,n,s)))}function lC(n){n=X(n,Ne);const e=X(n.firestore,le),t=ye(e),r=new tr(e);return Gy(t,n._query,{source:"server"}).then((s=>new st(e,r,n,s)))}function hC(n,e,t){n=X(n,ae);const r=X(n.firestore,le),s=xc(n.converter,e,t),i=qr(r);return ni(r,[dc(i,"setDoc",n._key,s,n.converter!==null,t).toMutation(n._key,_e.none())])}function dC(n,e,t,...r){n=X(n,ae);const s=X(n.firestore,le),i=qr(s);let o;return o=typeof(e=re(e))=="string"||e instanceof Br?zl(i,"updateDoc",n._key,e,t,r):jl(i,"updateDoc",n._key,e),ni(s,[o.toMutation(n._key,_e.exists(!0))])}function fC(n){return ni(X(n.firestore,le),[new zs(n._key,_e.none())])}function pC(n,e){const t=X(n.firestore,le),r=T_(n),s=xc(n.converter,e),i=qr(n.firestore);return ni(t,[dc(i,"addDoc",r._key,s,n.converter!==null,{}).toMutation(r._key,_e.exists(!1))]).then((()=>r))}function el(n,...e){var l,d,p;n=re(n);let t={includeMetadataChanges:!1,source:"default"},r=0;typeof e[r]!="object"||hs(e[r])||(t=e[r++]);const s={includeMetadataChanges:t.includeMetadataChanges,source:t.source};if(hs(e[r])){const g=e[r];e[r]=(l=g.next)==null?void 0:l.bind(g),e[r+1]=(d=g.error)==null?void 0:d.bind(g),e[r+2]=(p=g.complete)==null?void 0:p.bind(g)}let i,o,c;if(n instanceof ae)o=X(n.firestore,le),c=Gs(n._key.path),i={next:g=>{e[r]&&e[r](qh(o,n,g))},error:e[r+1],complete:e[r+2]};else{const g=X(n,Ne);o=X(g.firestore,le),c=g._query;const w=new tr(o);i={next:S=>{e[r]&&e[r](new st(o,w,g,S))},error:e[r+1],complete:e[r+2]},Xy(n._query)}const u=ye(o);return eV(u,c,s,i)}function mC(n,e,...t){const r=re(n),s=(function(u){const l={bundle:"",bundleName:"",bundleSource:""},d=["bundle","bundleName","bundleSource"];for(const p of d){if(!(p in u)){l.error=`snapshotJson missing required field: ${p}`;break}const g=u[p];if(typeof g!="string"){l.error=`snapshotJson field '${p}' must be a string.`;break}if(g.length===0){l.error=`snapshotJson field '${p}' cannot be an empty string.`;break}p==="bundle"?l.bundle=g:p==="bundleName"?l.bundleName=g:p==="bundleSource"&&(l.bundleSource=g)}return l})(e);if(s.error)throw new N(b.INVALID_ARGUMENT,s.error);let i,o=0;if(typeof t[o]!="object"||hs(t[o])||(i=t[o++]),s.bundleSource==="QuerySnapshot"){let c=null;if(typeof t[o]=="object"&&hs(t[o])){const u=t[o++];c={next:u.next,error:u.error,complete:u.complete}}else c={next:t[o++],error:t[o++],complete:t[o++]};return(function(l,d,p,g,w){let S,D=!1;return Zu(l,d.bundle).then((()=>Jy(l,d.bundleName))).then(($=>{$&&!D&&(w&&$.withConverter(w),S=el($,p||{},g))})).catch(($=>(g.error&&g.error($),()=>{}))),()=>{D||(D=!0,S&&S())}})(r,s,i,c,t[o])}if(s.bundleSource==="DocumentSnapshot"){let c=null;if(typeof t[o]=="object"&&hs(t[o])){const u=t[o++];c={next:u.next,error:u.error,complete:u.complete}}else c={next:t[o++],error:t[o++],complete:t[o++]};return(function(l,d,p,g,w){let S,D=!1;return Zu(l,d.bundle).then((()=>{if(!D){const $=new ae(l,w||null,M.fromPath(d.bundleName));S=el($,p||{},g)}})).catch(($=>(g.error&&g.error($),()=>{}))),()=>{D||(D=!0,S&&S())}})(r,s,i,c,t[o])}throw new N(b.INVALID_ARGUMENT,`unsupported bundle source: ${s.bundleSource}`)}function gC(n,e){n=X(n,le);const t=ye(n),r=hs(e)?e:{next:e};return iV(t,r)}function ni(n,e){const t=ye(n);return sV(t,e)}function qh(n,e,t){const r=t.docs.get(e._key),s=new tr(n);return new rt(n,s,e._key,r,new Xt(t.hasPendingWrites,t.fromCache),e.converter)}function _C(n){return n=X(n,le),ye(n),new oI(n,(e=>ni(n,e)))}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function yC(n,e){n=X(n,le);const t=ye(n);if(!t._uninitializedComponentsProvider||t._uninitializedComponentsProvider._offline.kind==="memory")return xe("Cannot enable indexes when persistence is disabled"),Promise.resolve();const r=(function(i){const o=typeof i=="string"?(function(l){try{return JSON.parse(l)}catch(d){throw new N(b.INVALID_ARGUMENT,"Failed to parse JSON: "+(d==null?void 0:d.message))}})(i):i,c=[];if(Array.isArray(o.indexes))for(const u of o.indexes){const l=Gp(u,"collectionGroup"),d=[];if(Array.isArray(u.fields))for(const p of u.fields){const g=Gp(p,"fieldPath"),w=Kl("setIndexConfiguration",g);p.arrayConfig==="CONTAINS"?d.push(new Tr(w,2)):p.order==="ASCENDING"?d.push(new Tr(w,0)):p.order==="DESCENDING"&&d.push(new Tr(w,1))}c.push(new vs(vs.UNKNOWN_ID,l,d,As.empty()))}return c})(e);return uV(t,r)}function Gp(n,e){if(typeof n[e]!="string")throw new N(b.INVALID_ARGUMENT,"Missing string value for: "+e);return n[e]}/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class cI{constructor(e){this._firestore=e,this.type="PersistentCacheIndexManager"}}function IC(n){var s;n=X(n,le);const e=Kp.get(n);if(e)return e;if(((s=ye(n)._uninitializedComponentsProvider)==null?void 0:s._offline.kind)!=="persistent")return null;const r=new cI(n);return Kp.set(n,r),r}function wC(n){uI(n,!0)}function TC(n){uI(n,!1)}function EC(n){const e=ye(n._firestore);hV(e).then((t=>O("deleting all persistent cache indexes succeeded"))).catch((t=>xe("deleting all persistent cache indexes failed",t)))}function uI(n,e){const t=ye(n._firestore);lV(t,e).then((r=>O(`setting persistent cache index auto creation isEnabled=${e} succeeded`))).catch((r=>xe(`setting persistent cache index auto creation isEnabled=${e} failed`,r)))}const Kp=new WeakMap;/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class vC{constructor(){throw new Error("instances of this class should not be created")}static onExistenceFilterMismatch(e){return $h.instance.onExistenceFilterMismatch(e)}}class $h{constructor(){this.i=new Map}static get instance(){return ta||(ta=new $h,xA(ta)),ta}Ie(e){this.i.forEach((t=>t(e)))}onExistenceFilterMismatch(e){const t=Symbol(),r=this.i;return r.set(t,e),()=>r.delete(t)}}let ta=null;(function(e,t=!0){Gv(Us),$t(new Rt("firestore",((r,{instanceIdentifier:s,options:i})=>{const o=r.getProvider("app").getImmediate(),c=new le(new WA(r.getProvider("auth-internal")),new JA(o,r.getProvider("app-check-internal")),tA(o,s),o);return i={useFetchStreams:t,...i},c._setSettings(i),c}),"PUBLIC").setMultipleInstances(!0)),gt(qp,$p,e),gt(qp,$p,"esm2020")})();const ox=Object.freeze(Object.defineProperty({__proto__:null,AbstractUserDataWriter:Fh,AggregateField:Ms,AggregateQuerySnapshot:Yy,Bytes:et,CACHE_SIZE_UNLIMITED:dV,CollectionReference:At,DocumentReference:ae,DocumentSnapshot:rt,FieldPath:Br,FieldValue:Wt,Firestore:le,FirestoreError:N,GeoPoint:vt,LoadBundleTask:Wy,PersistentCacheIndexManager:cI,Query:Ne,QueryCompositeFilterConstraint:Gr,QueryConstraint:ei,QueryDocumentSnapshot:zi,QueryEndAtConstraint:Vo,QueryFieldFilterConstraint:ti,QueryLimitConstraint:bo,QueryOrderByConstraint:Cc,QuerySnapshot:st,QueryStartAtConstraint:So,SnapshotMetadata:Xt,Timestamp:oe,Transaction:aI,VectorValue:Ye,WriteBatch:oI,_AutoId:tc,_ByteString:pe,_DatabaseId:Bn,_DocumentKey:M,_EmptyAppCheckTokenProvider:YA,_EmptyAuthCredentialsProvider:u_,_FieldPath:Ee,_TestingHooks:vC,_cast:X,_debugAssert:Wv,_internalAggregationQueryToProtoRunAggregationQueryRequest:vV,_internalQueryToProtoQueryTarget:EV,_isBase64Available:Xv,_logWarn:xe,_validateIsNotUsedTogether:ag,addDoc:pC,aggregateFieldEqual:FV,aggregateQuerySnapshotEqual:UV,and:SV,arrayRemove:RR,arrayUnion:AR,average:MV,clearIndexedDbPersistence:_V,collection:pR,collectionGroup:mR,connectFirestoreEmulator:w_,count:nI,deleteAllPersistentCacheIndexes:EC,deleteDoc:fC,deleteField:ER,disableNetwork:wV,disablePersistentCacheIndexAutoCreation:TC,doc:T_,documentId:a_,documentSnapshotFromJSON:XV,enableIndexedDbPersistence:mV,enableMultiTabIndexedDbPersistence:gV,enableNetwork:IV,enablePersistentCacheIndexAutoCreation:wC,endAt:OV,endBefore:kV,ensureFirestoreConfigured:ye,executeWrite:ni,getAggregateFromServer:rI,getCountFromServer:BV,getDoc:iC,getDocFromCache:oC,getDocFromServer:aC,getDocs:cC,getDocsFromCache:uC,getDocsFromServer:lC,getFirestore:pV,getPersistentCacheIndexManager:IC,increment:PR,initializeFirestore:fV,limit:CV,limitToLast:xV,loadBundle:Zu,maximum:SR,memoryEagerGarbageCollector:GV,memoryLocalCache:WV,memoryLruGarbageCollector:KV,minimum:bR,namedQuery:Jy,onSnapshot:el,onSnapshotResume:mC,onSnapshotsInSync:gC,or:bV,orderBy:VV,persistentLocalCache:HV,persistentMultipleTabManager:YV,persistentSingleTabManager:sI,query:RV,queryEqual:Ll,querySnapshotFromJSON:ZV,refEqual:gR,runTransaction:sC,serverTimestamp:vR,setDoc:hC,setIndexConfiguration:yC,setLogLevel:Kv,snapshotEqual:tC,startAfter:DV,startAt:NV,sum:LV,terminate:TV,updateDoc:dC,vector:C_,waitForPendingWrites:yV,where:PV,writeBatch:_C},Symbol.toStringTag,{value:"Module"})),lI="@firebase/installations",jh="0.6.23";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const hI=1e4,dI=`w:${jh}`,fI="FIS_v2",AC="https://firebaseinstallations.googleapis.com/v1",RC=3600*1e3,PC="installations",bC="Installations";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const SC={"missing-app-config-values":'Missing App configuration value: "{$valueName}"',"not-registered":"Firebase Installation is not registered.","installation-not-found":"Firebase Installation not found.","request-failed":'{$requestName} request failed with error "{$serverCode} {$serverStatus}: {$serverMessage}"',"app-offline":"Could not process request. Application offline.","delete-pending-registration":"Can't delete installation while there is a pending registration request."},kr=new Lr(PC,bC,SC);function pI(n){return n instanceof bt&&n.code.includes("request-failed")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function mI({projectId:n}){return`${AC}/projects/${n}/installations`}function gI(n){return{token:n.token,requestStatus:2,expiresIn:CC(n.expiresIn),creationTime:Date.now()}}async function _I(n,e){const r=(await e.json()).error;return kr.create("request-failed",{requestName:n,serverCode:r.code,serverMessage:r.message,serverStatus:r.status})}function yI({apiKey:n}){return new Headers({"Content-Type":"application/json",Accept:"application/json","x-goog-api-key":n})}function VC(n,{refreshToken:e}){const t=yI(n);return t.append("Authorization",xC(e)),t}async function II(n){const e=await n();return e.status>=500&&e.status<600?n():e}function CC(n){return Number(n.replace("s","000"))}function xC(n){return`${fI} ${n}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function NC({appConfig:n,heartbeatServiceProvider:e},{fid:t}){const r=mI(n),s=yI(n),i=e.getImmediate({optional:!0});if(i){const l=await i.getHeartbeatsHeader();l&&s.append("x-firebase-client",l)}const o={fid:t,authVersion:fI,appId:n.appId,sdkVersion:dI},c={method:"POST",headers:s,body:JSON.stringify(o)},u=await II(()=>fetch(r,c));if(u.ok){const l=await u.json();return{fid:l.fid||t,registrationStatus:2,refreshToken:l.refreshToken,authToken:gI(l.authToken)}}else throw await _I("Create Installation",u)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function wI(n){return new Promise(e=>{setTimeout(e,n)})}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function DC(n){return btoa(String.fromCharCode(...n)).replace(/\+/g,"-").replace(/\//g,"_")}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const kC=/^[cdef][\w-]{21}$/,tl="";function OC(){try{const n=new Uint8Array(17);(self.crypto||self.msCrypto).getRandomValues(n),n[0]=112+n[0]%16;const t=LC(n);return kC.test(t)?t:tl}catch{return tl}}function LC(n){return DC(n).substr(0,22)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function Nc(n){return`${n.appName}!${n.appId}`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const TI=new Map;function EI(n,e){const t=Nc(n);vI(t,e),MC(t,e)}function vI(n,e){const t=TI.get(n);if(t)for(const r of t)r(e)}function MC(n,e){const t=FC();t&&t.postMessage({key:n,fid:e}),UC()}let Ir=null;function FC(){return!Ir&&"BroadcastChannel"in self&&(Ir=new BroadcastChannel("[Firebase] FID Change"),Ir.onmessage=n=>{vI(n.data.key,n.data.fid)}),Ir}function UC(){TI.size===0&&Ir&&(Ir.close(),Ir=null)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const BC="firebase-installations-database",qC=1,Or="firebase-installations-store";let yu=null;function zh(){return yu||(yu=tm(BC,qC,{upgrade:(n,e)=>{switch(e){case 0:n.createObjectStore(Or)}}})),yu}async function Wa(n,e){const t=Nc(n),s=(await zh()).transaction(Or,"readwrite"),i=s.objectStore(Or),o=await i.get(t);return await i.put(e,t),await s.done,(!o||o.fid!==e.fid)&&EI(n,e.fid),e}async function AI(n){const e=Nc(n),r=(await zh()).transaction(Or,"readwrite");await r.objectStore(Or).delete(e),await r.done}async function Dc(n,e){const t=Nc(n),s=(await zh()).transaction(Or,"readwrite"),i=s.objectStore(Or),o=await i.get(t),c=e(o);return c===void 0?await i.delete(t):await i.put(c,t),await s.done,c&&(!o||o.fid!==c.fid)&&EI(n,c.fid),c}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Gh(n){let e;const t=await Dc(n.appConfig,r=>{const s=$C(r),i=jC(n,s);return e=i.registrationPromise,i.installationEntry});return t.fid===tl?{installationEntry:await e}:{installationEntry:t,registrationPromise:e}}function $C(n){const e=n||{fid:OC(),registrationStatus:0};return RI(e)}function jC(n,e){if(e.registrationStatus===0){if(!navigator.onLine){const s=Promise.reject(kr.create("app-offline"));return{installationEntry:e,registrationPromise:s}}const t={fid:e.fid,registrationStatus:1,registrationTime:Date.now()},r=zC(n,t);return{installationEntry:t,registrationPromise:r}}else return e.registrationStatus===1?{installationEntry:e,registrationPromise:GC(n)}:{installationEntry:e}}async function zC(n,e){try{const t=await NC(n,e);return Wa(n.appConfig,t)}catch(t){throw pI(t)&&t.customData.serverCode===409?await AI(n.appConfig):await Wa(n.appConfig,{fid:e.fid,registrationStatus:0}),t}}async function GC(n){let e=await Wp(n.appConfig);for(;e.registrationStatus===1;)await wI(100),e=await Wp(n.appConfig);if(e.registrationStatus===0){const{installationEntry:t,registrationPromise:r}=await Gh(n);return r||t}return e}function Wp(n){return Dc(n,e=>{if(!e)throw kr.create("installation-not-found");return RI(e)})}function RI(n){return KC(n)?{fid:n.fid,registrationStatus:0}:n}function KC(n){return n.registrationStatus===1&&n.registrationTime+hI<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function WC({appConfig:n,heartbeatServiceProvider:e},t){const r=HC(n,t),s=VC(n,t),i=e.getImmediate({optional:!0});if(i){const l=await i.getHeartbeatsHeader();l&&s.append("x-firebase-client",l)}const o={installation:{sdkVersion:dI,appId:n.appId}},c={method:"POST",headers:s,body:JSON.stringify(o)},u=await II(()=>fetch(r,c));if(u.ok){const l=await u.json();return gI(l)}else throw await _I("Generate Auth Token",u)}function HC(n,{fid:e}){return`${mI(n)}/${e}/authTokens:generate`}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function Kh(n,e=!1){let t;const r=await Dc(n.appConfig,i=>{if(!PI(i))throw kr.create("not-registered");const o=i.authToken;if(!e&&YC(o))return i;if(o.requestStatus===1)return t=QC(n,e),i;{if(!navigator.onLine)throw kr.create("app-offline");const c=ZC(i);return t=JC(n,c),c}});return t?await t:r.authToken}async function QC(n,e){let t=await Hp(n.appConfig);for(;t.authToken.requestStatus===1;)await wI(100),t=await Hp(n.appConfig);const r=t.authToken;return r.requestStatus===0?Kh(n,e):r}function Hp(n){return Dc(n,e=>{if(!PI(e))throw kr.create("not-registered");const t=e.authToken;return e0(t)?{...e,authToken:{requestStatus:0}}:e})}async function JC(n,e){try{const t=await WC(n,e),r={...e,authToken:t};return await Wa(n.appConfig,r),t}catch(t){if(pI(t)&&(t.customData.serverCode===401||t.customData.serverCode===404))await AI(n.appConfig);else{const r={...e,authToken:{requestStatus:0}};await Wa(n.appConfig,r)}throw t}}function PI(n){return n!==void 0&&n.registrationStatus===2}function YC(n){return n.requestStatus===2&&!XC(n)}function XC(n){const e=Date.now();return e<n.creationTime||n.creationTime+n.expiresIn<e+RC}function ZC(n){const e={requestStatus:1,requestTime:Date.now()};return{...n,authToken:e}}function e0(n){return n.requestStatus===1&&n.requestTime+hI<Date.now()}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function t0(n){const e=n,{installationEntry:t,registrationPromise:r}=await Gh(e);return r?r.catch(console.error):Kh(e).catch(console.error),t.fid}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function n0(n,e=!1){const t=n;return await r0(t),(await Kh(t,e)).token}async function r0(n){const{registrationPromise:e}=await Gh(n);e&&await e}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function s0(n){if(!n||!n.options)throw Iu("App Configuration");if(!n.name)throw Iu("App Name");const e=["projectId","apiKey","appId"];for(const t of e)if(!n.options[t])throw Iu(t);return{appName:n.name,projectId:n.options.projectId,apiKey:n.options.apiKey,appId:n.options.appId}}function Iu(n){return kr.create("missing-app-config-values",{valueName:n})}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const bI="installations",i0="installations-internal",o0=n=>{const e=n.getProvider("app").getImmediate(),t=s0(e),r=un(e,"heartbeat");return{app:e,appConfig:t,heartbeatServiceProvider:r,_delete:()=>Promise.resolve()}},a0=n=>{const e=n.getProvider("app").getImmediate(),t=un(e,bI).getImmediate();return{getId:()=>t0(t),getToken:s=>n0(t,s)}};function c0(){$t(new Rt(bI,o0,"PUBLIC")),$t(new Rt(i0,a0,"PRIVATE"))}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */c0();gt(lI,jh);gt(lI,jh,"esm2020");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Ha="analytics",u0="firebase_id",l0="origin",h0=60*1e3,d0="https://firebase.googleapis.com/v1alpha/projects/-/apps/{app-id}/webConfig",Wh="https://www.googletagmanager.com/gtag/js";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const Xe=new Ya("@firebase/analytics");/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const f0={"already-exists":"A Firebase Analytics instance with the appId {$id}  already exists. Only one Firebase Analytics instance can be created for each appId.","already-initialized":"initializeAnalytics() cannot be called again with different options than those it was initially called with. It can be called again with the same options to return the existing instance, or getAnalytics() can be used to get a reference to the already-initialized instance.","already-initialized-settings":"Firebase Analytics has already been initialized.settings() must be called before initializing any Analytics instanceor it will have no effect.","interop-component-reg-failed":"Firebase Analytics Interop Component failed to instantiate: {$reason}","invalid-analytics-context":"Firebase Analytics is not supported in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","indexeddb-unavailable":"IndexedDB unavailable or restricted in this environment. Wrap initialization of analytics in analytics.isSupported() to prevent initialization in unsupported environments. Details: {$errorInfo}","fetch-throttle":"The config fetch request timed out while in an exponential backoff state. Unix timestamp in milliseconds when fetch request throttling ends: {$throttleEndTimeMillis}.","config-fetch-failed":"Dynamic config fetch failed: [{$httpStatus}] {$responseMessage}","no-api-key":'The "apiKey" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid API key.',"no-app-id":'The "appId" field is empty in the local Firebase config. Firebase Analytics requires this field tocontain a valid app ID.',"no-client-id":'The "client_id" field is empty.',"invalid-gtag-resource":"Trusted Types detected an invalid gtag resource: {$gtagURL}."},dt=new Lr("analytics","Analytics",f0);/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function p0(n){if(!n.startsWith(Wh)){const e=dt.create("invalid-gtag-resource",{gtagURL:n});return Xe.warn(e.message),""}return n}function SI(n){return Promise.all(n.map(e=>e.catch(t=>t)))}function m0(n,e){let t;return window.trustedTypes&&(t=window.trustedTypes.createPolicy(n,e)),t}function g0(n,e){const t=m0("firebase-js-sdk-policy",{createScriptURL:p0}),r=document.createElement("script"),s=`${Wh}?l=${n}&id=${e}`;r.src=t?t==null?void 0:t.createScriptURL(s):s,r.async=!0,document.head.appendChild(r)}function _0(n){let e=[];return Array.isArray(window[n])?e=window[n]:window[n]=e,e}async function y0(n,e,t,r,s,i){const o=r[s];try{if(o)await e[o];else{const u=(await SI(t)).find(l=>l.measurementId===s);u&&await e[u.appId]}}catch(c){Xe.error(c)}n("config",s,i)}async function I0(n,e,t,r,s){try{let i=[];if(s&&s.send_to){let o=s.send_to;Array.isArray(o)||(o=[o]);const c=await SI(t);for(const u of o){const l=c.find(p=>p.measurementId===u),d=l&&e[l.appId];if(d)i.push(d);else{i=[];break}}}i.length===0&&(i=Object.values(e)),await Promise.all(i),n("event",r,s||{})}catch(i){Xe.error(i)}}function w0(n,e,t,r){async function s(i,...o){try{if(i==="event"){const[c,u]=o;await I0(n,e,t,c,u)}else if(i==="config"){const[c,u]=o;await y0(n,e,t,r,c,u)}else if(i==="consent"){const[c,u]=o;n("consent",c,u)}else if(i==="get"){const[c,u,l]=o;n("get",c,u,l)}else if(i==="set"){const[c]=o;n("set",c)}else n(i,...o)}catch(c){Xe.error(c)}}return s}function T0(n,e,t,r,s){let i=function(...o){window[r].push(arguments)};return window[s]&&typeof window[s]=="function"&&(i=window[s]),window[s]=w0(i,n,e,t),{gtagCore:i,wrappedGtag:window[s]}}function E0(n){const e=window.document.getElementsByTagName("script");for(const t of Object.values(e))if(t.src&&t.src.includes(Wh)&&t.src.includes(n))return t;return null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */const v0=30,A0=1e3;class R0{constructor(e={},t=A0){this.throttleMetadata=e,this.intervalMillis=t}getThrottleMetadata(e){return this.throttleMetadata[e]}setThrottleMetadata(e,t){this.throttleMetadata[e]=t}deleteThrottleMetadata(e){delete this.throttleMetadata[e]}}const VI=new R0;function P0(n){return new Headers({Accept:"application/json","x-goog-api-key":n})}async function b0(n){var o;const{appId:e,apiKey:t}=n,r={method:"GET",headers:P0(t)},s=d0.replace("{app-id}",e),i=await fetch(s,r);if(i.status!==200&&i.status!==304){let c="";try{const u=await i.json();(o=u.error)!=null&&o.message&&(c=u.error.message)}catch{}throw dt.create("config-fetch-failed",{httpStatus:i.status,responseMessage:c})}return i.json()}async function S0(n,e=VI,t){const{appId:r,apiKey:s,measurementId:i}=n.options;if(!r)throw dt.create("no-app-id");if(!s){if(i)return{measurementId:i,appId:r};throw dt.create("no-api-key")}const o=e.getThrottleMetadata(r)||{backoffCount:0,throttleEndTimeMillis:Date.now()},c=new x0;return setTimeout(async()=>{c.abort()},h0),CI({appId:r,apiKey:s,measurementId:i},o,c,e)}async function CI(n,{throttleEndTimeMillis:e,backoffCount:t},r,s=VI){var c;const{appId:i,measurementId:o}=n;try{await V0(r,e)}catch(u){if(o)return Xe.warn(`Timed out fetching this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${u==null?void 0:u.message}]`),{appId:i,measurementId:o};throw u}try{const u=await b0(n);return s.deleteThrottleMetadata(i),u}catch(u){const l=u;if(!C0(l)){if(s.deleteThrottleMetadata(i),o)return Xe.warn(`Failed to fetch this Firebase app's measurement ID from the server. Falling back to the measurement ID ${o} provided in the "measurementId" field in the local Firebase config. [${l==null?void 0:l.message}]`),{appId:i,measurementId:o};throw u}const d=Number((c=l==null?void 0:l.customData)==null?void 0:c.httpStatus)===503?Xd(t,s.intervalMillis,v0):Xd(t,s.intervalMillis),p={throttleEndTimeMillis:Date.now()+d,backoffCount:t+1};return s.setThrottleMetadata(i,p),Xe.debug(`Calling attemptFetch again in ${d} millis`),CI(n,p,r,s)}}function V0(n,e){return new Promise((t,r)=>{const s=Math.max(e-Date.now(),0),i=setTimeout(t,s);n.addEventListener(()=>{clearTimeout(i),r(dt.create("fetch-throttle",{throttleEndTimeMillis:e}))})})}function C0(n){if(!(n instanceof bt)||!n.customData)return!1;const e=Number(n.customData.httpStatus);return e===429||e===500||e===503||e===504}class x0{constructor(){this.listeners=[]}addEventListener(e){this.listeners.push(e)}abort(){this.listeners.forEach(e=>e())}}async function N0(n,e,t,r,s){if(s&&s.global){n("event",t,r);return}else{const i=await e,o={...r,send_to:i};n("event",t,o)}}async function D0(n,e,t,r){if(r&&r.global){const s={};for(const i of Object.keys(t))s[`user_properties.${i}`]=t[i];return n("set",s),Promise.resolve()}else{const s=await e;n("config",s,{update:!0,user_properties:t})}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function k0(){if(Ja())try{await sl()}catch(n){return Xe.warn(dt.create("indexeddb-unavailable",{errorInfo:n==null?void 0:n.toString()}).message),!1}else return Xe.warn(dt.create("indexeddb-unavailable",{errorInfo:"IndexedDB is not available in this environment."}).message),!1;return!0}async function O0(n,e,t,r,s,i,o){const c=S0(n);c.then(g=>{t[g.measurementId]=g.appId,n.options.measurementId&&g.measurementId!==n.options.measurementId&&Xe.warn(`The measurement ID in the local Firebase config (${n.options.measurementId}) does not match the measurement ID fetched from the server (${g.measurementId}). To ensure analytics events are always sent to the correct Analytics property, update the measurement ID field in the local config or remove it from the local config.`)}).catch(g=>Xe.error(g)),e.push(c);const u=k0().then(g=>{if(g)return r.getId()}),[l,d]=await Promise.all([c,u]);E0(i)||g0(i,l.measurementId),s("js",new Date);const p=(o==null?void 0:o.config)??{};return p[l0]="firebase",p.update=!0,d!=null&&(p[u0]=d),s("config",l.measurementId,p),l.measurementId}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */class L0{constructor(e){this.app=e}_delete(){return delete ds[this.app.options.appId],Promise.resolve()}}let ds={},Qp=[];const Jp={};let wu="dataLayer",M0="gtag",Yp,Hh,Xp=!1;function F0(){const n=[];if(rl()&&n.push("This is a browser extension environment."),fm()||n.push("Cookies are not available."),n.length>0){const e=n.map((r,s)=>`(${s+1}) ${r}`).join(" "),t=dt.create("invalid-analytics-context",{errorInfo:e});Xe.warn(t.message)}}function U0(n,e,t){F0();const r=n.options.appId;if(!r)throw dt.create("no-app-id");if(!n.options.apiKey)if(n.options.measurementId)Xe.warn(`The "apiKey" field is empty in the local Firebase config. This is needed to fetch the latest measurement ID for this Firebase app. Falling back to the measurement ID ${n.options.measurementId} provided in the "measurementId" field in the local Firebase config.`);else throw dt.create("no-api-key");if(ds[r]!=null)throw dt.create("already-exists",{id:r});if(!Xp){_0(wu);const{wrappedGtag:i,gtagCore:o}=T0(ds,Qp,Jp,wu,M0);Hh=i,Yp=o,Xp=!0}return ds[r]=O0(n,Qp,Jp,e,Yp,wu,t),new L0(n)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function ax(n=ol()){n=re(n);const e=un(n,Ha);return e.isInitialized()?e.getImmediate():B0(n)}function B0(n,e={}){const t=un(n,Ha);if(t.isInitialized()){const s=t.getImmediate();if(_t(e,t.getOptions()))return s;throw dt.create("already-initialized")}return t.initialize({options:e})}async function cx(){if(rl()||!fm()||!Ja())return!1;try{return await sl()}catch{return!1}}function q0(n,e,t){n=re(n),D0(Hh,ds[n.app.options.appId],e,t).catch(r=>Xe.error(r))}function $0(n,e,t,r){n=re(n),N0(Hh,ds[n.app.options.appId],e,t,r).catch(s=>Xe.error(s))}const Zp="@firebase/analytics",em="0.10.23";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function j0(){$t(new Rt(Ha,(e,{options:t})=>{const r=e.getProvider("app").getImmediate(),s=e.getProvider("installations-internal").getImmediate();return U0(r,s,t)},"PUBLIC")),$t(new Rt("analytics-internal",n,"PRIVATE")),gt(Zp,em),gt(Zp,em,"esm2020");function n(e){try{const t=e.getProvider(Ha).getImmediate();return{logEvent:(r,s,i)=>$0(t,r,s,i),setUserProperties:(r,s)=>q0(t,r,s)}}catch(t){throw dt.create("interop-component-reg-failed",{reason:t})}}}j0();export{Y0 as A,Q0 as B,ox as C,Sn as G,Z0 as a,cx as b,ax as c,T_ as d,iC as e,H0 as f,pV as g,el as h,wT as i,bV as j,pR as k,CV as l,VV as m,pC as n,J0 as o,fC as p,RV as q,cC as r,vR as s,hC as t,dC as u,K0 as v,PV as w,G0 as x,W0 as y,X0 as z};
