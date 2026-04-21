(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) return;
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) processPreload(link);
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") continue;
      for (const node of mutation.addedNodes) if (node.tagName === "LINK" && node.rel === "modulepreload") processPreload(node);
    }
  }).observe(document, {
    childList: true,
    subtree: true
  });
  function getFetchOpts(link) {
    const fetchOpts = {};
    if (link.integrity) fetchOpts.integrity = link.integrity;
    if (link.referrerPolicy) fetchOpts.referrerPolicy = link.referrerPolicy;
    if (link.crossOrigin === "use-credentials") fetchOpts.credentials = "include";
    else if (link.crossOrigin === "anonymous") fetchOpts.credentials = "omit";
    else fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep) return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
// @__NO_SIDE_EFFECTS__
function makeMap(str) {
  const map = /* @__PURE__ */ Object.create(null);
  for (const key of str.split(",")) map[key] = 1;
  return (val) => val in map;
}
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const isOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // uppercase letter
(key.charCodeAt(2) > 122 || key.charCodeAt(2) < 97);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty$1 = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty$1.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => toTypeString(val) === "[object Date]";
const isFunction = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return (isObject(val) || isFunction(val)) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  // the leading comma is intentional so empty string "" is also included
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return ((str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  });
};
const camelizeRE = /-\w/g;
const camelize = cacheStringFunction(
  (str) => {
    return str.replace(camelizeRE, (c) => c.slice(1).toUpperCase());
  }
);
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction(
  (str) => str.replace(hyphenateRE, "-$1").toLowerCase()
);
const capitalize = cacheStringFunction((str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
});
const toHandlerKey = cacheStringFunction(
  (str) => {
    const s = str ? `on${capitalize(str)}` : ``;
    return s;
  }
);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, ...arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](...arg);
  }
};
const def = (obj, key, value, writable = false) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    writable,
    value
  });
};
const looseToNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value) || isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:([^]+)/;
const styleCommentRE = /\/\*[^]*?\*\//g;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.replace(styleCommentRE, "").split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
function looseCompareArrays(a, b) {
  if (a.length !== b.length) return false;
  let equal = true;
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i]);
  }
  return equal;
}
function looseEqual(a, b) {
  if (a === b) return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isSymbol(a);
  bValidType = isSymbol(b);
  if (aValidType || bValidType) {
    return a === b;
  }
  aValidType = isArray(a);
  bValidType = isArray(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false;
  }
  aValidType = isObject(a);
  bValidType = isObject(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
        return false;
      }
    }
  }
  return String(a) === String(b);
}
const isRef$1 = (val) => {
  return !!(val && val["__v_isRef"] === true);
};
const toDisplayString = (val) => {
  return isString(val) ? val : val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction(val.toString)) ? isRef$1(val) ? toDisplayString(val.value) : JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (isRef$1(val)) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce(
        (entries, [key, val2], i) => {
          entries[stringifySymbol(key, i) + " =>"] = val2;
          return entries;
        },
        {}
      )
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()].map((v) => stringifySymbol(v))
    };
  } else if (isSymbol(val)) {
    return stringifySymbol(val);
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const stringifySymbol = (v, i = "") => {
  var _a;
  return (
    // Symbol.description in es2019+ so we need to cast here to pass
    // the lib: es2016 check
    isSymbol(v) ? `Symbol(${(_a = v.description) != null ? _a : i})` : v
  );
};
let activeEffectScope;
class EffectScope {
  // TODO isolatedDeclarations "__v_skip"
  constructor(detached = false) {
    this.detached = detached;
    this._active = true;
    this._on = 0;
    this.effects = [];
    this.cleanups = [];
    this._isPaused = false;
    this.__v_skip = true;
    this.parent = activeEffectScope;
    if (!detached && activeEffectScope) {
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(
        this
      ) - 1;
    }
  }
  get active() {
    return this._active;
  }
  pause() {
    if (this._active) {
      this._isPaused = true;
      let i, l;
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].pause();
        }
      }
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].pause();
      }
    }
  }
  /**
   * Resumes the effect scope, including all child scopes and effects.
   */
  resume() {
    if (this._active) {
      if (this._isPaused) {
        this._isPaused = false;
        let i, l;
        if (this.scopes) {
          for (i = 0, l = this.scopes.length; i < l; i++) {
            this.scopes[i].resume();
          }
        }
        for (i = 0, l = this.effects.length; i < l; i++) {
          this.effects[i].resume();
        }
      }
    }
  }
  run(fn) {
    if (this._active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  on() {
    if (++this._on === 1) {
      this.prevScope = activeEffectScope;
      activeEffectScope = this;
    }
  }
  /**
   * This should only be called on non-detached scopes
   * @internal
   */
  off() {
    if (this._on > 0 && --this._on === 0) {
      activeEffectScope = this.prevScope;
      this.prevScope = void 0;
    }
  }
  stop(fromParent) {
    if (this._active) {
      this._active = false;
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      this.effects.length = 0;
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      this.cleanups.length = 0;
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
        this.scopes.length = 0;
      }
      if (!this.detached && this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.parent = void 0;
    }
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
let activeSub;
const pausedQueueEffects = /* @__PURE__ */ new WeakSet();
class ReactiveEffect {
  constructor(fn) {
    this.fn = fn;
    this.deps = void 0;
    this.depsTail = void 0;
    this.flags = 1 | 4;
    this.next = void 0;
    this.cleanup = void 0;
    this.scheduler = void 0;
    if (activeEffectScope && activeEffectScope.active) {
      activeEffectScope.effects.push(this);
    }
  }
  pause() {
    this.flags |= 64;
  }
  resume() {
    if (this.flags & 64) {
      this.flags &= -65;
      if (pausedQueueEffects.has(this)) {
        pausedQueueEffects.delete(this);
        this.trigger();
      }
    }
  }
  /**
   * @internal
   */
  notify() {
    if (this.flags & 2 && !(this.flags & 32)) {
      return;
    }
    if (!(this.flags & 8)) {
      batch(this);
    }
  }
  run() {
    if (!(this.flags & 1)) {
      return this.fn();
    }
    this.flags |= 2;
    cleanupEffect(this);
    prepareDeps(this);
    const prevEffect = activeSub;
    const prevShouldTrack = shouldTrack;
    activeSub = this;
    shouldTrack = true;
    try {
      return this.fn();
    } finally {
      cleanupDeps(this);
      activeSub = prevEffect;
      shouldTrack = prevShouldTrack;
      this.flags &= -3;
    }
  }
  stop() {
    if (this.flags & 1) {
      for (let link = this.deps; link; link = link.nextDep) {
        removeSub(link);
      }
      this.deps = this.depsTail = void 0;
      cleanupEffect(this);
      this.onStop && this.onStop();
      this.flags &= -2;
    }
  }
  trigger() {
    if (this.flags & 64) {
      pausedQueueEffects.add(this);
    } else if (this.scheduler) {
      this.scheduler();
    } else {
      this.runIfDirty();
    }
  }
  /**
   * @internal
   */
  runIfDirty() {
    if (isDirty(this)) {
      this.run();
    }
  }
  get dirty() {
    return isDirty(this);
  }
}
let batchDepth = 0;
let batchedSub;
let batchedComputed;
function batch(sub, isComputed = false) {
  sub.flags |= 8;
  if (isComputed) {
    sub.next = batchedComputed;
    batchedComputed = sub;
    return;
  }
  sub.next = batchedSub;
  batchedSub = sub;
}
function startBatch() {
  batchDepth++;
}
function endBatch() {
  if (--batchDepth > 0) {
    return;
  }
  if (batchedComputed) {
    let e = batchedComputed;
    batchedComputed = void 0;
    while (e) {
      const next = e.next;
      e.next = void 0;
      e.flags &= -9;
      e = next;
    }
  }
  let error;
  while (batchedSub) {
    let e = batchedSub;
    batchedSub = void 0;
    while (e) {
      const next = e.next;
      e.next = void 0;
      e.flags &= -9;
      if (e.flags & 1) {
        try {
          ;
          e.trigger();
        } catch (err) {
          if (!error) error = err;
        }
      }
      e = next;
    }
  }
  if (error) throw error;
}
function prepareDeps(sub) {
  for (let link = sub.deps; link; link = link.nextDep) {
    link.version = -1;
    link.prevActiveLink = link.dep.activeLink;
    link.dep.activeLink = link;
  }
}
function cleanupDeps(sub) {
  let head;
  let tail = sub.depsTail;
  let link = tail;
  while (link) {
    const prev = link.prevDep;
    if (link.version === -1) {
      if (link === tail) tail = prev;
      removeSub(link);
      removeDep(link);
    } else {
      head = link;
    }
    link.dep.activeLink = link.prevActiveLink;
    link.prevActiveLink = void 0;
    link = prev;
  }
  sub.deps = head;
  sub.depsTail = tail;
}
function isDirty(sub) {
  for (let link = sub.deps; link; link = link.nextDep) {
    if (link.dep.version !== link.version || link.dep.computed && (refreshComputed(link.dep.computed) || link.dep.version !== link.version)) {
      return true;
    }
  }
  if (sub._dirty) {
    return true;
  }
  return false;
}
function refreshComputed(computed2) {
  if (computed2.flags & 4 && !(computed2.flags & 16)) {
    return;
  }
  computed2.flags &= -17;
  if (computed2.globalVersion === globalVersion) {
    return;
  }
  computed2.globalVersion = globalVersion;
  if (!computed2.isSSR && computed2.flags & 128 && (!computed2.deps && !computed2._dirty || !isDirty(computed2))) {
    return;
  }
  computed2.flags |= 2;
  const dep = computed2.dep;
  const prevSub = activeSub;
  const prevShouldTrack = shouldTrack;
  activeSub = computed2;
  shouldTrack = true;
  try {
    prepareDeps(computed2);
    const value = computed2.fn(computed2._value);
    if (dep.version === 0 || hasChanged(value, computed2._value)) {
      computed2.flags |= 128;
      computed2._value = value;
      dep.version++;
    }
  } catch (err) {
    dep.version++;
    throw err;
  } finally {
    activeSub = prevSub;
    shouldTrack = prevShouldTrack;
    cleanupDeps(computed2);
    computed2.flags &= -3;
  }
}
function removeSub(link, soft = false) {
  const { dep, prevSub, nextSub } = link;
  if (prevSub) {
    prevSub.nextSub = nextSub;
    link.prevSub = void 0;
  }
  if (nextSub) {
    nextSub.prevSub = prevSub;
    link.nextSub = void 0;
  }
  if (dep.subs === link) {
    dep.subs = prevSub;
    if (!prevSub && dep.computed) {
      dep.computed.flags &= -5;
      for (let l = dep.computed.deps; l; l = l.nextDep) {
        removeSub(l, true);
      }
    }
  }
  if (!soft && !--dep.sc && dep.map) {
    dep.map.delete(dep.key);
  }
}
function removeDep(link) {
  const { prevDep, nextDep } = link;
  if (prevDep) {
    prevDep.nextDep = nextDep;
    link.prevDep = void 0;
  }
  if (nextDep) {
    nextDep.prevDep = prevDep;
    link.nextDep = void 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function cleanupEffect(e) {
  const { cleanup } = e;
  e.cleanup = void 0;
  if (cleanup) {
    const prevSub = activeSub;
    activeSub = void 0;
    try {
      cleanup();
    } finally {
      activeSub = prevSub;
    }
  }
}
let globalVersion = 0;
class Link {
  constructor(sub, dep) {
    this.sub = sub;
    this.dep = dep;
    this.version = dep.version;
    this.nextDep = this.prevDep = this.nextSub = this.prevSub = this.prevActiveLink = void 0;
  }
}
class Dep {
  // TODO isolatedDeclarations "__v_skip"
  constructor(computed2) {
    this.computed = computed2;
    this.version = 0;
    this.activeLink = void 0;
    this.subs = void 0;
    this.map = void 0;
    this.key = void 0;
    this.sc = 0;
    this.__v_skip = true;
  }
  track(debugInfo) {
    if (!activeSub || !shouldTrack || activeSub === this.computed) {
      return;
    }
    let link = this.activeLink;
    if (link === void 0 || link.sub !== activeSub) {
      link = this.activeLink = new Link(activeSub, this);
      if (!activeSub.deps) {
        activeSub.deps = activeSub.depsTail = link;
      } else {
        link.prevDep = activeSub.depsTail;
        activeSub.depsTail.nextDep = link;
        activeSub.depsTail = link;
      }
      addSub(link);
    } else if (link.version === -1) {
      link.version = this.version;
      if (link.nextDep) {
        const next = link.nextDep;
        next.prevDep = link.prevDep;
        if (link.prevDep) {
          link.prevDep.nextDep = next;
        }
        link.prevDep = activeSub.depsTail;
        link.nextDep = void 0;
        activeSub.depsTail.nextDep = link;
        activeSub.depsTail = link;
        if (activeSub.deps === link) {
          activeSub.deps = next;
        }
      }
    }
    return link;
  }
  trigger(debugInfo) {
    this.version++;
    globalVersion++;
    this.notify(debugInfo);
  }
  notify(debugInfo) {
    startBatch();
    try {
      if (false) ;
      for (let link = this.subs; link; link = link.prevSub) {
        if (link.sub.notify()) {
          ;
          link.sub.dep.notify();
        }
      }
    } finally {
      endBatch();
    }
  }
}
function addSub(link) {
  link.dep.sc++;
  if (link.sub.flags & 4) {
    const computed2 = link.dep.computed;
    if (computed2 && !link.dep.subs) {
      computed2.flags |= 4 | 16;
      for (let l = computed2.deps; l; l = l.nextDep) {
        addSub(l);
      }
    }
    const currentTail = link.dep.subs;
    if (currentTail !== link) {
      link.prevSub = currentTail;
      if (currentTail) currentTail.nextSub = link;
    }
    link.dep.subs = link;
  }
}
const targetMap = /* @__PURE__ */ new WeakMap();
const ITERATE_KEY = /* @__PURE__ */ Symbol(
  ""
);
const MAP_KEY_ITERATE_KEY = /* @__PURE__ */ Symbol(
  ""
);
const ARRAY_ITERATE_KEY = /* @__PURE__ */ Symbol(
  ""
);
function track(target, type, key) {
  if (shouldTrack && activeSub) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = new Dep());
      dep.map = depsMap;
      dep.key = key;
    }
    {
      dep.track();
    }
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    globalVersion++;
    return;
  }
  const run = (dep) => {
    if (dep) {
      {
        dep.trigger();
      }
    }
  };
  startBatch();
  if (type === "clear") {
    depsMap.forEach(run);
  } else {
    const targetIsArray = isArray(target);
    const isArrayIndex = targetIsArray && isIntegerKey(key);
    if (targetIsArray && key === "length") {
      const newLength = Number(newValue);
      depsMap.forEach((dep, key2) => {
        if (key2 === "length" || key2 === ARRAY_ITERATE_KEY || !isSymbol(key2) && key2 >= newLength) {
          run(dep);
        }
      });
    } else {
      if (key !== void 0 || depsMap.has(void 0)) {
        run(depsMap.get(key));
      }
      if (isArrayIndex) {
        run(depsMap.get(ARRAY_ITERATE_KEY));
      }
      switch (type) {
        case "add":
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          } else if (isArrayIndex) {
            run(depsMap.get("length"));
          }
          break;
        case "delete":
          if (!targetIsArray) {
            run(depsMap.get(ITERATE_KEY));
            if (isMap(target)) {
              run(depsMap.get(MAP_KEY_ITERATE_KEY));
            }
          }
          break;
        case "set":
          if (isMap(target)) {
            run(depsMap.get(ITERATE_KEY));
          }
          break;
      }
    }
  }
  endBatch();
}
function reactiveReadArray(array) {
  const raw = /* @__PURE__ */ toRaw(array);
  if (raw === array) return raw;
  track(raw, "iterate", ARRAY_ITERATE_KEY);
  return /* @__PURE__ */ isShallow(array) ? raw : raw.map(toReactive);
}
function shallowReadArray(arr) {
  track(arr = /* @__PURE__ */ toRaw(arr), "iterate", ARRAY_ITERATE_KEY);
  return arr;
}
function toWrapped(target, item) {
  if (/* @__PURE__ */ isReadonly(target)) {
    return /* @__PURE__ */ isReactive(target) ? toReadonly(toReactive(item)) : toReadonly(item);
  }
  return toReactive(item);
}
const arrayInstrumentations = {
  __proto__: null,
  [Symbol.iterator]() {
    return iterator(this, Symbol.iterator, (item) => toWrapped(this, item));
  },
  concat(...args) {
    return reactiveReadArray(this).concat(
      ...args.map((x) => isArray(x) ? reactiveReadArray(x) : x)
    );
  },
  entries() {
    return iterator(this, "entries", (value) => {
      value[1] = toWrapped(this, value[1]);
      return value;
    });
  },
  every(fn, thisArg) {
    return apply(this, "every", fn, thisArg, void 0, arguments);
  },
  filter(fn, thisArg) {
    return apply(
      this,
      "filter",
      fn,
      thisArg,
      (v) => v.map((item) => toWrapped(this, item)),
      arguments
    );
  },
  find(fn, thisArg) {
    return apply(
      this,
      "find",
      fn,
      thisArg,
      (item) => toWrapped(this, item),
      arguments
    );
  },
  findIndex(fn, thisArg) {
    return apply(this, "findIndex", fn, thisArg, void 0, arguments);
  },
  findLast(fn, thisArg) {
    return apply(
      this,
      "findLast",
      fn,
      thisArg,
      (item) => toWrapped(this, item),
      arguments
    );
  },
  findLastIndex(fn, thisArg) {
    return apply(this, "findLastIndex", fn, thisArg, void 0, arguments);
  },
  // flat, flatMap could benefit from ARRAY_ITERATE but are not straight-forward to implement
  forEach(fn, thisArg) {
    return apply(this, "forEach", fn, thisArg, void 0, arguments);
  },
  includes(...args) {
    return searchProxy(this, "includes", args);
  },
  indexOf(...args) {
    return searchProxy(this, "indexOf", args);
  },
  join(separator) {
    return reactiveReadArray(this).join(separator);
  },
  // keys() iterator only reads `length`, no optimization required
  lastIndexOf(...args) {
    return searchProxy(this, "lastIndexOf", args);
  },
  map(fn, thisArg) {
    return apply(this, "map", fn, thisArg, void 0, arguments);
  },
  pop() {
    return noTracking(this, "pop");
  },
  push(...args) {
    return noTracking(this, "push", args);
  },
  reduce(fn, ...args) {
    return reduce(this, "reduce", fn, args);
  },
  reduceRight(fn, ...args) {
    return reduce(this, "reduceRight", fn, args);
  },
  shift() {
    return noTracking(this, "shift");
  },
  // slice could use ARRAY_ITERATE but also seems to beg for range tracking
  some(fn, thisArg) {
    return apply(this, "some", fn, thisArg, void 0, arguments);
  },
  splice(...args) {
    return noTracking(this, "splice", args);
  },
  toReversed() {
    return reactiveReadArray(this).toReversed();
  },
  toSorted(comparer) {
    return reactiveReadArray(this).toSorted(comparer);
  },
  toSpliced(...args) {
    return reactiveReadArray(this).toSpliced(...args);
  },
  unshift(...args) {
    return noTracking(this, "unshift", args);
  },
  values() {
    return iterator(this, "values", (item) => toWrapped(this, item));
  }
};
function iterator(self2, method, wrapValue) {
  const arr = shallowReadArray(self2);
  const iter = arr[method]();
  if (arr !== self2 && !/* @__PURE__ */ isShallow(self2)) {
    iter._next = iter.next;
    iter.next = () => {
      const result = iter._next();
      if (!result.done) {
        result.value = wrapValue(result.value);
      }
      return result;
    };
  }
  return iter;
}
const arrayProto = Array.prototype;
function apply(self2, method, fn, thisArg, wrappedRetFn, args) {
  const arr = shallowReadArray(self2);
  const needsWrap = arr !== self2 && !/* @__PURE__ */ isShallow(self2);
  const methodFn = arr[method];
  if (methodFn !== arrayProto[method]) {
    const result2 = methodFn.apply(self2, args);
    return needsWrap ? toReactive(result2) : result2;
  }
  let wrappedFn = fn;
  if (arr !== self2) {
    if (needsWrap) {
      wrappedFn = function(item, index) {
        return fn.call(this, toWrapped(self2, item), index, self2);
      };
    } else if (fn.length > 2) {
      wrappedFn = function(item, index) {
        return fn.call(this, item, index, self2);
      };
    }
  }
  const result = methodFn.call(arr, wrappedFn, thisArg);
  return needsWrap && wrappedRetFn ? wrappedRetFn(result) : result;
}
function reduce(self2, method, fn, args) {
  const arr = shallowReadArray(self2);
  const needsWrap = arr !== self2 && !/* @__PURE__ */ isShallow(self2);
  let wrappedFn = fn;
  let wrapInitialAccumulator = false;
  if (arr !== self2) {
    if (needsWrap) {
      wrapInitialAccumulator = args.length === 0;
      wrappedFn = function(acc, item, index) {
        if (wrapInitialAccumulator) {
          wrapInitialAccumulator = false;
          acc = toWrapped(self2, acc);
        }
        return fn.call(this, acc, toWrapped(self2, item), index, self2);
      };
    } else if (fn.length > 3) {
      wrappedFn = function(acc, item, index) {
        return fn.call(this, acc, item, index, self2);
      };
    }
  }
  const result = arr[method](wrappedFn, ...args);
  return wrapInitialAccumulator ? toWrapped(self2, result) : result;
}
function searchProxy(self2, method, args) {
  const arr = /* @__PURE__ */ toRaw(self2);
  track(arr, "iterate", ARRAY_ITERATE_KEY);
  const res = arr[method](...args);
  if ((res === -1 || res === false) && /* @__PURE__ */ isProxy(args[0])) {
    args[0] = /* @__PURE__ */ toRaw(args[0]);
    return arr[method](...args);
  }
  return res;
}
function noTracking(self2, method, args = []) {
  pauseTracking();
  startBatch();
  const res = (/* @__PURE__ */ toRaw(self2))[method].apply(self2, args);
  endBatch();
  resetTracking();
  return res;
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
function hasOwnProperty(key) {
  if (!isSymbol(key)) key = String(key);
  const obj = /* @__PURE__ */ toRaw(this);
  track(obj, "has", key);
  return obj.hasOwnProperty(key);
}
class BaseReactiveHandler {
  constructor(_isReadonly = false, _isShallow = false) {
    this._isReadonly = _isReadonly;
    this._isShallow = _isShallow;
  }
  get(target, key, receiver) {
    if (key === "__v_skip") return target["__v_skip"];
    const isReadonly2 = this._isReadonly, isShallow2 = this._isShallow;
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return isShallow2;
    } else if (key === "__v_raw") {
      if (receiver === (isReadonly2 ? isShallow2 ? shallowReadonlyMap : readonlyMap : isShallow2 ? shallowReactiveMap : reactiveMap).get(target) || // receiver is not the reactive proxy, but has the same prototype
      // this means the receiver is a user proxy of the reactive proxy
      Object.getPrototypeOf(target) === Object.getPrototypeOf(receiver)) {
        return target;
      }
      return;
    }
    const targetIsArray = isArray(target);
    if (!isReadonly2) {
      let fn;
      if (targetIsArray && (fn = arrayInstrumentations[key])) {
        return fn;
      }
      if (key === "hasOwnProperty") {
        return hasOwnProperty;
      }
    }
    const res = Reflect.get(
      target,
      key,
      // if this is a proxy wrapping a ref, return methods using the raw ref
      // as receiver so that we don't have to call `toRaw` on the ref in all
      // its class methods
      /* @__PURE__ */ isRef(target) ? target : receiver
    );
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (isShallow2) {
      return res;
    }
    if (/* @__PURE__ */ isRef(res)) {
      const value = targetIsArray && isIntegerKey(key) ? res : res.value;
      return isReadonly2 && isObject(value) ? /* @__PURE__ */ readonly(value) : value;
    }
    if (isObject(res)) {
      return isReadonly2 ? /* @__PURE__ */ readonly(res) : /* @__PURE__ */ reactive(res);
    }
    return res;
  }
}
class MutableReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(false, isShallow2);
  }
  set(target, key, value, receiver) {
    let oldValue = target[key];
    const isArrayWithIntegerKey = isArray(target) && isIntegerKey(key);
    if (!this._isShallow) {
      const isOldValueReadonly = /* @__PURE__ */ isReadonly(oldValue);
      if (!/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) {
        oldValue = /* @__PURE__ */ toRaw(oldValue);
        value = /* @__PURE__ */ toRaw(value);
      }
      if (!isArrayWithIntegerKey && /* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) {
        if (isOldValueReadonly) {
          return true;
        } else {
          oldValue.value = value;
          return true;
        }
      }
    }
    const hadKey = isArrayWithIntegerKey ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(
      target,
      key,
      value,
      /* @__PURE__ */ isRef(target) ? target : receiver
    );
    if (target === /* @__PURE__ */ toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  }
  deleteProperty(target, key) {
    const hadKey = hasOwn(target, key);
    target[key];
    const result = Reflect.deleteProperty(target, key);
    if (result && hadKey) {
      trigger(target, "delete", key, void 0);
    }
    return result;
  }
  has(target, key) {
    const result = Reflect.has(target, key);
    if (!isSymbol(key) || !builtInSymbols.has(key)) {
      track(target, "has", key);
    }
    return result;
  }
  ownKeys(target) {
    track(
      target,
      "iterate",
      isArray(target) ? "length" : ITERATE_KEY
    );
    return Reflect.ownKeys(target);
  }
}
class ReadonlyReactiveHandler extends BaseReactiveHandler {
  constructor(isShallow2 = false) {
    super(true, isShallow2);
  }
  set(target, key) {
    return true;
  }
  deleteProperty(target, key) {
    return true;
  }
}
const mutableHandlers = /* @__PURE__ */ new MutableReactiveHandler();
const readonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler();
const shallowReactiveHandlers = /* @__PURE__ */ new MutableReactiveHandler(true);
const shallowReadonlyHandlers = /* @__PURE__ */ new ReadonlyReactiveHandler(true);
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = /* @__PURE__ */ toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(
      rawTarget,
      "iterate",
      isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY
    );
    return extend(
      // inheriting all iterator properties
      Object.create(innerIterator),
      {
        // iterator protocol
        next() {
          const { value, done } = innerIterator.next();
          return done ? { value, done } : {
            value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
            done
          };
        }
      }
    );
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : type === "clear" ? void 0 : this;
  };
}
function createInstrumentations(readonly2, shallow) {
  const instrumentations = {
    get(key) {
      const target = this["__v_raw"];
      const rawTarget = /* @__PURE__ */ toRaw(target);
      const rawKey = /* @__PURE__ */ toRaw(key);
      if (!readonly2) {
        if (hasChanged(key, rawKey)) {
          track(rawTarget, "get", key);
        }
        track(rawTarget, "get", rawKey);
      }
      const { has } = getProto(rawTarget);
      const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
      if (has.call(rawTarget, key)) {
        return wrap(target.get(key));
      } else if (has.call(rawTarget, rawKey)) {
        return wrap(target.get(rawKey));
      } else if (target !== rawTarget) {
        target.get(key);
      }
    },
    get size() {
      const target = this["__v_raw"];
      !readonly2 && track(/* @__PURE__ */ toRaw(target), "iterate", ITERATE_KEY);
      return target.size;
    },
    has(key) {
      const target = this["__v_raw"];
      const rawTarget = /* @__PURE__ */ toRaw(target);
      const rawKey = /* @__PURE__ */ toRaw(key);
      if (!readonly2) {
        if (hasChanged(key, rawKey)) {
          track(rawTarget, "has", key);
        }
        track(rawTarget, "has", rawKey);
      }
      return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
    },
    forEach(callback, thisArg) {
      const observed = this;
      const target = observed["__v_raw"];
      const rawTarget = /* @__PURE__ */ toRaw(target);
      const wrap = shallow ? toShallow : readonly2 ? toReadonly : toReactive;
      !readonly2 && track(rawTarget, "iterate", ITERATE_KEY);
      return target.forEach((value, key) => {
        return callback.call(thisArg, wrap(value), wrap(key), observed);
      });
    }
  };
  extend(
    instrumentations,
    readonly2 ? {
      add: createReadonlyMethod("add"),
      set: createReadonlyMethod("set"),
      delete: createReadonlyMethod("delete"),
      clear: createReadonlyMethod("clear")
    } : {
      add(value) {
        const target = /* @__PURE__ */ toRaw(this);
        const proto = getProto(target);
        const rawValue = /* @__PURE__ */ toRaw(value);
        const valueToAdd = !shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value) ? rawValue : value;
        const hadKey = proto.has.call(target, valueToAdd) || hasChanged(value, valueToAdd) && proto.has.call(target, value) || hasChanged(rawValue, valueToAdd) && proto.has.call(target, rawValue);
        if (!hadKey) {
          target.add(valueToAdd);
          trigger(target, "add", valueToAdd, valueToAdd);
        }
        return this;
      },
      set(key, value) {
        if (!shallow && !/* @__PURE__ */ isShallow(value) && !/* @__PURE__ */ isReadonly(value)) {
          value = /* @__PURE__ */ toRaw(value);
        }
        const target = /* @__PURE__ */ toRaw(this);
        const { has, get } = getProto(target);
        let hadKey = has.call(target, key);
        if (!hadKey) {
          key = /* @__PURE__ */ toRaw(key);
          hadKey = has.call(target, key);
        }
        const oldValue = get.call(target, key);
        target.set(key, value);
        if (!hadKey) {
          trigger(target, "add", key, value);
        } else if (hasChanged(value, oldValue)) {
          trigger(target, "set", key, value);
        }
        return this;
      },
      delete(key) {
        const target = /* @__PURE__ */ toRaw(this);
        const { has, get } = getProto(target);
        let hadKey = has.call(target, key);
        if (!hadKey) {
          key = /* @__PURE__ */ toRaw(key);
          hadKey = has.call(target, key);
        }
        get ? get.call(target, key) : void 0;
        const result = target.delete(key);
        if (hadKey) {
          trigger(target, "delete", key, void 0);
        }
        return result;
      },
      clear() {
        const target = /* @__PURE__ */ toRaw(this);
        const hadItems = target.size !== 0;
        const result = target.clear();
        if (hadItems) {
          trigger(
            target,
            "clear",
            void 0,
            void 0
          );
        }
        return result;
      }
    }
  );
  const iteratorMethods = [
    "keys",
    "values",
    "entries",
    Symbol.iterator
  ];
  iteratorMethods.forEach((method) => {
    instrumentations[method] = createIterableMethod(method, readonly2, shallow);
  });
  return instrumentations;
}
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = createInstrumentations(isReadonly2, shallow);
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(
      hasOwn(instrumentations, key) && key in target ? instrumentations : target,
      key,
      receiver
    );
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
// @__NO_SIDE_EFFECTS__
function reactive(target) {
  if (/* @__PURE__ */ isReadonly(target)) {
    return target;
  }
  return createReactiveObject(
    target,
    false,
    mutableHandlers,
    mutableCollectionHandlers,
    reactiveMap
  );
}
// @__NO_SIDE_EFFECTS__
function shallowReactive(target) {
  return createReactiveObject(
    target,
    false,
    shallowReactiveHandlers,
    shallowCollectionHandlers,
    shallowReactiveMap
  );
}
// @__NO_SIDE_EFFECTS__
function readonly(target) {
  return createReactiveObject(
    target,
    true,
    readonlyHandlers,
    readonlyCollectionHandlers,
    readonlyMap
  );
}
// @__NO_SIDE_EFFECTS__
function shallowReadonly(target) {
  return createReactiveObject(
    target,
    true,
    shallowReadonlyHandlers,
    shallowReadonlyCollectionHandlers,
    shallowReadonlyMap
  );
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const proxy = new Proxy(
    target,
    targetType === 2 ? collectionHandlers : baseHandlers
  );
  proxyMap.set(target, proxy);
  return proxy;
}
// @__NO_SIDE_EFFECTS__
function isReactive(value) {
  if (/* @__PURE__ */ isReadonly(value)) {
    return /* @__PURE__ */ isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
// @__NO_SIDE_EFFECTS__
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
// @__NO_SIDE_EFFECTS__
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
// @__NO_SIDE_EFFECTS__
function isProxy(value) {
  return value ? !!value["__v_raw"] : false;
}
// @__NO_SIDE_EFFECTS__
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? /* @__PURE__ */ toRaw(raw) : observed;
}
function markRaw(value) {
  if (!hasOwn(value, "__v_skip") && Object.isExtensible(value)) {
    def(value, "__v_skip", true);
  }
  return value;
}
const toReactive = (value) => isObject(value) ? /* @__PURE__ */ reactive(value) : value;
const toReadonly = (value) => isObject(value) ? /* @__PURE__ */ readonly(value) : value;
// @__NO_SIDE_EFFECTS__
function isRef(r) {
  return r ? r["__v_isRef"] === true : false;
}
// @__NO_SIDE_EFFECTS__
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (/* @__PURE__ */ isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, isShallow2) {
    this.dep = new Dep();
    this["__v_isRef"] = true;
    this["__v_isShallow"] = false;
    this._rawValue = isShallow2 ? value : /* @__PURE__ */ toRaw(value);
    this._value = isShallow2 ? value : toReactive(value);
    this["__v_isShallow"] = isShallow2;
  }
  get value() {
    {
      this.dep.track();
    }
    return this._value;
  }
  set value(newValue) {
    const oldValue = this._rawValue;
    const useDirectValue = this["__v_isShallow"] || /* @__PURE__ */ isShallow(newValue) || /* @__PURE__ */ isReadonly(newValue);
    newValue = useDirectValue ? newValue : /* @__PURE__ */ toRaw(newValue);
    if (hasChanged(newValue, oldValue)) {
      this._rawValue = newValue;
      this._value = useDirectValue ? newValue : toReactive(newValue);
      {
        this.dep.trigger();
      }
    }
  }
}
function unref(ref2) {
  return /* @__PURE__ */ isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => key === "__v_raw" ? target : unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (/* @__PURE__ */ isRef(oldValue) && !/* @__PURE__ */ isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return /* @__PURE__ */ isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class ComputedRefImpl {
  constructor(fn, setter, isSSR) {
    this.fn = fn;
    this.setter = setter;
    this._value = void 0;
    this.dep = new Dep(this);
    this.__v_isRef = true;
    this.deps = void 0;
    this.depsTail = void 0;
    this.flags = 16;
    this.globalVersion = globalVersion - 1;
    this.next = void 0;
    this.effect = this;
    this["__v_isReadonly"] = !setter;
    this.isSSR = isSSR;
  }
  /**
   * @internal
   */
  notify() {
    this.flags |= 16;
    if (!(this.flags & 8) && // avoid infinite self recursion
    activeSub !== this) {
      batch(this, true);
      return true;
    }
  }
  get value() {
    const link = this.dep.track();
    refreshComputed(this);
    if (link) {
      link.version = this.dep.version;
    }
    return this._value;
  }
  set value(newValue) {
    if (this.setter) {
      this.setter(newValue);
    }
  }
}
// @__NO_SIDE_EFFECTS__
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  if (isFunction(getterOrOptions)) {
    getter = getterOrOptions;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, isSSR);
  return cRef;
}
const INITIAL_WATCHER_VALUE = {};
const cleanupMap = /* @__PURE__ */ new WeakMap();
let activeWatcher = void 0;
function onWatcherCleanup(cleanupFn, failSilently = false, owner = activeWatcher) {
  if (owner) {
    let cleanups = cleanupMap.get(owner);
    if (!cleanups) cleanupMap.set(owner, cleanups = []);
    cleanups.push(cleanupFn);
  }
}
function watch$1(source, cb, options = EMPTY_OBJ) {
  const { immediate, deep, once, scheduler, augmentJob, call } = options;
  const reactiveGetter = (source2) => {
    if (deep) return source2;
    if (/* @__PURE__ */ isShallow(source2) || deep === false || deep === 0)
      return traverse(source2, 1);
    return traverse(source2);
  };
  let effect2;
  let getter;
  let cleanup;
  let boundCleanup;
  let forceTrigger = false;
  let isMultiSource = false;
  if (/* @__PURE__ */ isRef(source)) {
    getter = () => source.value;
    forceTrigger = /* @__PURE__ */ isShallow(source);
  } else if (/* @__PURE__ */ isReactive(source)) {
    getter = () => reactiveGetter(source);
    forceTrigger = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => /* @__PURE__ */ isReactive(s) || /* @__PURE__ */ isShallow(s));
    getter = () => source.map((s) => {
      if (/* @__PURE__ */ isRef(s)) {
        return s.value;
      } else if (/* @__PURE__ */ isReactive(s)) {
        return reactiveGetter(s);
      } else if (isFunction(s)) {
        return call ? call(s, 2) : s();
      } else ;
    });
  } else if (isFunction(source)) {
    if (cb) {
      getter = call ? () => call(source, 2) : source;
    } else {
      getter = () => {
        if (cleanup) {
          pauseTracking();
          try {
            cleanup();
          } finally {
            resetTracking();
          }
        }
        const currentEffect = activeWatcher;
        activeWatcher = effect2;
        try {
          return call ? call(source, 3, [boundCleanup]) : source(boundCleanup);
        } finally {
          activeWatcher = currentEffect;
        }
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    const depth = deep === true ? Infinity : deep;
    getter = () => traverse(baseGetter(), depth);
  }
  const scope = getCurrentScope();
  const watchHandle = () => {
    effect2.stop();
    if (scope && scope.active) {
      remove(scope.effects, effect2);
    }
  };
  if (once && cb) {
    const _cb = cb;
    cb = (...args) => {
      _cb(...args);
      watchHandle();
    };
  }
  let oldValue = isMultiSource ? new Array(source.length).fill(INITIAL_WATCHER_VALUE) : INITIAL_WATCHER_VALUE;
  const job = (immediateFirstRun) => {
    if (!(effect2.flags & 1) || !effect2.dirty && !immediateFirstRun) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue))) {
        if (cleanup) {
          cleanup();
        }
        const currentWatcher = activeWatcher;
        activeWatcher = effect2;
        try {
          const args = [
            newValue,
            // pass undefined as the old value when it's changed for the first time
            oldValue === INITIAL_WATCHER_VALUE ? void 0 : isMultiSource && oldValue[0] === INITIAL_WATCHER_VALUE ? [] : oldValue,
            boundCleanup
          ];
          oldValue = newValue;
          call ? call(cb, 3, args) : (
            // @ts-expect-error
            cb(...args)
          );
        } finally {
          activeWatcher = currentWatcher;
        }
      }
    } else {
      effect2.run();
    }
  };
  if (augmentJob) {
    augmentJob(job);
  }
  effect2 = new ReactiveEffect(getter);
  effect2.scheduler = scheduler ? () => scheduler(job, false) : job;
  boundCleanup = (fn) => onWatcherCleanup(fn, false, effect2);
  cleanup = effect2.onStop = () => {
    const cleanups = cleanupMap.get(effect2);
    if (cleanups) {
      if (call) {
        call(cleanups, 4);
      } else {
        for (const cleanup2 of cleanups) cleanup2();
      }
      cleanupMap.delete(effect2);
    }
  };
  if (cb) {
    if (immediate) {
      job(true);
    } else {
      oldValue = effect2.run();
    }
  } else if (scheduler) {
    scheduler(job.bind(null, true), true);
  } else {
    effect2.run();
  }
  watchHandle.pause = effect2.pause.bind(effect2);
  watchHandle.resume = effect2.resume.bind(effect2);
  watchHandle.stop = watchHandle;
  return watchHandle;
}
function traverse(value, depth = Infinity, seen) {
  if (depth <= 0 || !isObject(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Map();
  if ((seen.get(value) || 0) >= depth) {
    return value;
  }
  seen.set(value, depth);
  depth--;
  if (/* @__PURE__ */ isRef(value)) {
    traverse(value.value, depth, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], depth, seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, depth, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], depth, seen);
    }
    for (const key of Object.getOwnPropertySymbols(value)) {
      if (Object.prototype.propertyIsEnumerable.call(value, key)) {
        traverse(value[key], depth, seen);
      }
    }
  }
  return value;
}
const stack = [];
let isWarning = false;
function warn$1(msg, ...args) {
  if (isWarning) return;
  isWarning = true;
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(
      appWarnHandler,
      instance,
      11,
      [
        // eslint-disable-next-line no-restricted-syntax
        msg + args.map((a) => {
          var _a, _b;
          return (_b = (_a = a.toString) == null ? void 0 : _a.call(a)) != null ? _b : JSON.stringify(a);
        }).join(""),
        instance && instance.proxy,
        trace.map(
          ({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`
        ).join("\n"),
        trace
      ]
    );
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && // avoid spamming console during tests
    true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
  isWarning = false;
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(
    vnode.component,
    vnode.type,
    isRoot
  )}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (/* @__PURE__ */ isRef(value)) {
    value = formatProp(key, /* @__PURE__ */ toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = /* @__PURE__ */ toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
function callWithErrorHandling(fn, instance, type, args) {
  try {
    return args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  if (isArray(fn)) {
    const values = [];
    for (let i = 0; i < fn.length; i++) {
      values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
    }
    return values;
  }
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  const { errorHandler, throwUnhandledErrorInProduction } = instance && instance.appContext.config || EMPTY_OBJ;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = `https://vuejs.org/error-reference/#runtime-${type}`;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    if (errorHandler) {
      pauseTracking();
      callWithErrorHandling(errorHandler, null, 10, [
        err,
        exposedInstance,
        errorInfo
      ]);
      resetTracking();
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev, throwUnhandledErrorInProduction);
}
function logError(err, type, contextVNode, throwInDev = true, throwInProd = false) {
  if (throwInProd) {
    throw err;
  } else {
    console.error(err);
  }
}
const queue = [];
let flushIndex = -1;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJob = queue[middle];
    const middleJobId = getId(middleJob);
    if (middleJobId < id || middleJobId === id && middleJob.flags & 2) {
      start = middle + 1;
    } else {
      end = middle;
    }
  }
  return start;
}
function queueJob(job) {
  if (!(job.flags & 1)) {
    const jobId = getId(job);
    const lastJob = queue[queue.length - 1];
    if (!lastJob || // fast path when the job id is larger than the tail
    !(job.flags & 2) && jobId >= getId(lastJob)) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(jobId), 0, job);
    }
    job.flags |= 1;
    queueFlush();
  }
}
function queueFlush() {
  if (!currentFlushPromise) {
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function queuePostFlushCb(cb) {
  if (!isArray(cb)) {
    if (activePostFlushCbs && cb.id === -1) {
      activePostFlushCbs.splice(postFlushIndex + 1, 0, cb);
    } else if (!(cb.flags & 1)) {
      pendingPostFlushCbs.push(cb);
      cb.flags |= 1;
    }
  } else {
    pendingPostFlushCbs.push(...cb);
  }
  queueFlush();
}
function flushPreFlushCbs(instance, seen, i = flushIndex + 1) {
  for (; i < queue.length; i++) {
    const cb = queue[i];
    if (cb && cb.flags & 2) {
      if (instance && cb.id !== instance.uid) {
        continue;
      }
      queue.splice(i, 1);
      i--;
      if (cb.flags & 4) {
        cb.flags &= -2;
      }
      cb();
      if (!(cb.flags & 4)) {
        cb.flags &= -2;
      }
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)].sort(
      (a, b) => getId(a) - getId(b)
    );
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      const cb = activePostFlushCbs[postFlushIndex];
      if (cb.flags & 4) {
        cb.flags &= -2;
      }
      if (!(cb.flags & 8)) cb();
      cb.flags &= -2;
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? job.flags & 2 ? -1 : Infinity : job.id;
function flushJobs(seen) {
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && !(job.flags & 8)) {
        if (false) ;
        if (job.flags & 4) {
          job.flags &= ~1;
        }
        callWithErrorHandling(
          job,
          job.i,
          job.i ? 15 : 14
        );
        if (!(job.flags & 4)) {
          job.flags &= ~1;
        }
      }
    }
  } finally {
    for (; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job) {
        job.flags &= -2;
      }
    }
    flushIndex = -1;
    queue.length = 0;
    flushPostFlushCbs();
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx) return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    let res;
    try {
      res = fn(...args);
    } finally {
      setCurrentRenderingInstance(prevInstance);
      if (renderFnWithContext._d) {
        setBlockTracking(1);
      }
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
function provide(key, value) {
  if (currentInstance) {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = getCurrentInstance();
  if (instance || currentApp) {
    let provides = currentApp ? currentApp._context.provides : instance ? instance.parent == null || instance.ce ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides : void 0;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance && instance.proxy) : defaultValue;
    } else ;
  }
}
const ssrContextKey = /* @__PURE__ */ Symbol.for("v-scx");
const useSSRContext = () => {
  {
    const ctx = inject(ssrContextKey);
    return ctx;
  }
};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, options = EMPTY_OBJ) {
  const { immediate, deep, flush, once } = options;
  const baseWatchOptions = extend({}, options);
  const runsImmediately = cb && immediate || !cb && flush !== "post";
  let ssrCleanup;
  if (isInSSRComponentSetup) {
    if (flush === "sync") {
      const ctx = useSSRContext();
      ssrCleanup = ctx.__watcherHandles || (ctx.__watcherHandles = []);
    } else if (!runsImmediately) {
      const watchStopHandle = () => {
      };
      watchStopHandle.stop = NOOP;
      watchStopHandle.resume = NOOP;
      watchStopHandle.pause = NOOP;
      return watchStopHandle;
    }
  }
  const instance = currentInstance;
  baseWatchOptions.call = (fn, type, args) => callWithAsyncErrorHandling(fn, instance, type, args);
  let isPre = false;
  if (flush === "post") {
    baseWatchOptions.scheduler = (job) => {
      queuePostRenderEffect(job, instance && instance.suspense);
    };
  } else if (flush !== "sync") {
    isPre = true;
    baseWatchOptions.scheduler = (job, isFirstRun) => {
      if (isFirstRun) {
        job();
      } else {
        queueJob(job);
      }
    };
  }
  baseWatchOptions.augmentJob = (job) => {
    if (cb) {
      job.flags |= 4;
    }
    if (isPre) {
      job.flags |= 2;
      if (instance) {
        job.id = instance.uid;
        job.i = instance;
      }
    }
  };
  const watchHandle = watch$1(source, cb, baseWatchOptions);
  if (isInSSRComponentSetup) {
    if (ssrCleanup) {
      ssrCleanup.push(watchHandle);
    } else if (runsImmediately) {
      watchHandle();
    }
  }
  return watchHandle;
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const reset = setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  reset();
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
const TeleportEndKey = /* @__PURE__ */ Symbol("_vte");
const isTeleport = (type) => type.__isTeleport;
const leaveCbKey = /* @__PURE__ */ Symbol("_leaveCb");
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    vnode.transition = hooks;
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
// @__NO_SIDE_EFFECTS__
function defineComponent(options, extraOptions) {
  return isFunction(options) ? (
    // #8236: extend call and options.name access are considered side-effects
    // by Rollup, so we have to wrap it in a pure-annotated IIFE.
    /* @__PURE__ */ (() => extend({ name: options.name }, extraOptions, { setup: options }))()
  ) : options;
}
function markAsyncBoundary(instance) {
  instance.ids = [instance.ids[0] + instance.ids[2]++ + "-", 0, 0];
}
function isTemplateRefKey(refs, key) {
  let desc;
  return !!((desc = Object.getOwnPropertyDescriptor(refs, key)) && !desc.configurable);
}
const pendingSetRefMap = /* @__PURE__ */ new WeakMap();
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray(rawRef)) {
    rawRef.forEach(
      (r, i) => setRef(
        r,
        oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef),
        parentSuspense,
        vnode,
        isUnmount
      )
    );
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    if (vnode.shapeFlag & 512 && vnode.type.__asyncResolved && vnode.component.subTree.component) {
      setRef(rawRef, oldRawRef, parentSuspense, vnode.component.subTree);
    }
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getComponentPublicInstance(vnode.component) : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref3 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  const rawSetupState = /* @__PURE__ */ toRaw(setupState);
  const canSetSetupRef = setupState === EMPTY_OBJ ? NO : (key) => {
    if (isTemplateRefKey(refs, key)) {
      return false;
    }
    return hasOwn(rawSetupState, key);
  };
  const canSetRef = (ref22, key) => {
    if (key && isTemplateRefKey(refs, key)) {
      return false;
    }
    return true;
  };
  if (oldRef != null && oldRef !== ref3) {
    invalidatePendingSetRef(oldRawRef);
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (canSetSetupRef(oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (/* @__PURE__ */ isRef(oldRef)) {
      const oldRawRefAtom = oldRawRef;
      if (canSetRef(oldRef, oldRawRefAtom.k)) {
        oldRef.value = null;
      }
      if (oldRawRefAtom.k) refs[oldRawRefAtom.k] = null;
    }
  }
  if (isFunction(ref3)) {
    callWithErrorHandling(ref3, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref3);
    const _isRef = /* @__PURE__ */ isRef(ref3);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? canSetSetupRef(ref3) ? setupState[ref3] : refs[ref3] : canSetRef() || !rawRef.k ? ref3.value : refs[rawRef.k];
          if (isUnmount) {
            isArray(existing) && remove(existing, refValue);
          } else {
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref3] = [refValue];
                if (canSetSetupRef(ref3)) {
                  setupState[ref3] = refs[ref3];
                }
              } else {
                const newVal = [refValue];
                if (canSetRef(ref3, rawRef.k)) {
                  ref3.value = newVal;
                }
                if (rawRef.k) refs[rawRef.k] = newVal;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref3] = value;
          if (canSetSetupRef(ref3)) {
            setupState[ref3] = value;
          }
        } else if (_isRef) {
          if (canSetRef(ref3, rawRef.k)) {
            ref3.value = value;
          }
          if (rawRef.k) refs[rawRef.k] = value;
        } else ;
      };
      if (value) {
        const job = () => {
          doSet();
          pendingSetRefMap.delete(rawRef);
        };
        job.id = -1;
        pendingSetRefMap.set(rawRef, job);
        queuePostRenderEffect(job, parentSuspense);
      } else {
        invalidatePendingSetRef(rawRef);
        doSet();
      }
    }
  }
}
function invalidatePendingSetRef(rawRef) {
  const pendingSetRef = pendingSetRefMap.get(rawRef);
  if (pendingSetRef) {
    pendingSetRef.flags |= 8;
    pendingSetRefMap.delete(rawRef);
  }
}
getGlobalThis().requestIdleCallback || ((cb) => setTimeout(cb, 1));
getGlobalThis().cancelIdleCallback || ((id) => clearTimeout(id));
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(
    type,
    hook,
    keepAliveRoot,
    true
    /* prepend */
  );
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      pauseTracking();
      const reset = setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      reset();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => {
  if (!isInSSRComponentSetup || lifecycle === "sp") {
    injectHook(lifecycle, (...args) => hook(...args), target);
  }
};
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook(
  "bu"
);
const onUpdated = createHook("u");
const onBeforeUnmount = createHook(
  "bum"
);
const onUnmounted = createHook("um");
const onServerPrefetch = createHook(
  "sp"
);
const onRenderTriggered = createHook("rtg");
const onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
const COMPONENTS = "components";
const NULL_DYNAMIC_COMPONENT = /* @__PURE__ */ Symbol.for("v-ndc");
function resolveDynamicComponent(component) {
  if (isString(component)) {
    return resolveAsset(COMPONENTS, component, false) || component;
  } else {
    return component || NULL_DYNAMIC_COMPONENT;
  }
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    {
      const selfName = getComponentName(
        Component,
        false
      );
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = (
      // local registration
      // check instance[type] first which is resolved for options API
      resolve(instance[type] || Component[type], name) || // global registration
      resolve(instance.appContext[type], name)
    );
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
function renderList(source, renderItem, cache, index) {
  let ret;
  const cached = cache;
  const sourceIsArray = isArray(source);
  if (sourceIsArray || isString(source)) {
    const sourceIsReactiveArray = sourceIsArray && /* @__PURE__ */ isReactive(source);
    let needsWrap = false;
    let isReadonlySource = false;
    if (sourceIsReactiveArray) {
      needsWrap = !/* @__PURE__ */ isShallow(source);
      isReadonlySource = /* @__PURE__ */ isReadonly(source);
      source = shallowReadArray(source);
    }
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(
        needsWrap ? isReadonlySource ? toReadonly(toReactive(source[i])) : toReactive(source[i]) : source[i],
        i,
        void 0,
        cached
      );
    }
  } else if (typeof source === "number") {
    {
      ret = new Array(source);
      for (let i = 0; i < source; i++) {
        ret[i] = renderItem(i + 1, i, void 0, cached);
      }
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(
        source,
        (item, i) => renderItem(item, i, void 0, cached)
      );
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached);
      }
    }
  } else {
    ret = [];
  }
  return ret;
}
function renderSlot(slots, name, props = {}, fallback, noSlotted) {
  if (currentRenderingInstance.ce || currentRenderingInstance.parent && isAsyncWrapper(currentRenderingInstance.parent) && currentRenderingInstance.parent.ce) {
    const hasProps = Object.keys(props).length > 0;
    if (name !== "default") props.name = name;
    return openBlock(), createBlock(
      Fragment,
      null,
      [createVNode("slot", props, fallback)],
      hasProps ? -2 : 64
    );
  }
  let slot = slots[name];
  if (slot && slot._c) {
    slot._d = false;
  }
  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const slotKey = props.key || // slot content array of a dynamic conditional slot may have a branch
  // key attached in the `createSlots` helper, respect that
  validSlotContent && validSlotContent.key;
  const rendered = createBlock(
    Fragment,
    {
      key: (slotKey && !isSymbol(slotKey) ? slotKey : `_${name}`) + // #7256 force differentiate fallback content from actual content
      (!validSlotContent && fallback ? "_fb" : "")
    },
    validSlotContent || [],
    validSlotContent && slots._ === 1 ? 64 : -2
  );
  if (slot && slot._c) {
    slot._d = true;
  }
  return rendered;
}
function ensureValidVNode(vnodes) {
  return vnodes.some((child) => {
    if (!isVNode(child)) return true;
    if (child.type === Comment) return false;
    if (child.type === Fragment && !ensureValidVNode(child.children))
      return false;
    return true;
  }) ? vnodes : null;
}
const getPublicInstance = (i) => {
  if (!i) return null;
  if (isStatefulComponent(i)) return getComponentPublicInstance(i);
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = (
  // Move PURE marker to new line to workaround compiler discarding it
  // due to type annotation
  /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
    $: (i) => i,
    $el: (i) => i.vnode.el,
    $data: (i) => i.data,
    $props: (i) => i.props,
    $attrs: (i) => i.attrs,
    $slots: (i) => i.slots,
    $refs: (i) => i.refs,
    $parent: (i) => getPublicInstance(i.parent),
    $root: (i) => getPublicInstance(i.root),
    $host: (i) => i.ce,
    $emit: (i) => i.emit,
    $options: (i) => resolveMergedOptions(i),
    $forceUpdate: (i) => i.f || (i.f = () => {
      queueJob(i.update);
    }),
    $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
    $watch: (i) => instanceWatch.bind(i)
  })
);
const hasSetupBinding = (state, key) => state !== EMPTY_OBJ && !state.__isScriptSetup && hasOwn(state, key);
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    if (key === "__v_skip") {
      return true;
    }
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (hasSetupBinding(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if (hasOwn(props, key)) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance.attrs, "get", "");
      }
      return publicGetter(instance);
    } else if (
      // css module (injected by vue-loader)
      (cssModule = type.__cssModules) && (cssModule = cssModule[key])
    ) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (
      // global properties
      globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)
    ) {
      {
        return globalProperties[key];
      }
    } else ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (hasSetupBinding(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({
    _: { data, setupState, accessCache, ctx, appContext, props, type }
  }, key) {
    let cssModules;
    return !!(accessCache[key] || data !== EMPTY_OBJ && key[0] !== "$" && hasOwn(data, key) || hasSetupBinding(setupState, key) || hasOwn(props, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key) || (cssModules = type.__cssModules) && cssModules[key]);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
function normalizePropsOrEmits(props) {
  return isArray(props) ? props.reduce(
    (normalized, p2) => (normalized[p2] = null, normalized),
    {}
  ) : props;
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook(options.beforeCreate, instance, "bc");
  }
  const {
    // state
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    // lifecycle
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    // public API
    expose,
    inheritAttrs,
    // assets
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject(data)) ;
    else {
      instance.data = /* @__PURE__ */ reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get,
        set
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val,
          enumerable: true
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components) instance.components = components;
  if (directives) instance.directives = directives;
  if (serverPrefetch) {
    markAsyncBoundary(instance);
  }
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(
          opt.from || key,
          opt.default,
          true
        );
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (/* @__PURE__ */ isRef(injected)) {
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => injected.value,
        set: (v) => injected.value = v
      });
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook(hook, instance, type) {
  callWithAsyncErrorHandling(
    isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy),
    instance,
    type
  );
}
function createWatcher(raw, ctx, publicThis, key) {
  let getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      {
        watch(getter, handler);
      }
    }
  } else if (isFunction(raw)) {
    {
      watch(getter, raw.bind(publicThis));
    }
  } else if (isObject(raw)) {
    if (isArray(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const {
    mixins: globalMixins,
    optionsCache: cache,
    config: { optionMergeStrategies }
  } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach(
        (m) => mergeOptions(resolved, m, optionMergeStrategies, true)
      );
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach(
      (m) => mergeOptions(to, m, strats, true)
    );
  }
  for (const key in from) {
    if (asMixin && key === "expose") ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeEmitsOrPropsOptions,
  emits: mergeEmitsOrPropsOptions,
  // objects
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  // lifecycle
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  // assets
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  // watch
  watch: mergeWatchOptions,
  // provide / inject
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(
      isFunction(to) ? to.call(this, this) : to,
      isFunction(from) ? from.call(this, this) : from
    );
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(/* @__PURE__ */ Object.create(null), to, from) : from;
}
function mergeEmitsOrPropsOptions(to, from) {
  if (to) {
    if (isArray(to) && isArray(from)) {
      return [.../* @__PURE__ */ new Set([...to, ...from])];
    }
    return extend(
      /* @__PURE__ */ Object.create(null),
      normalizePropsOrEmits(to),
      normalizePropsOrEmits(from != null ? from : {})
    );
  } else {
    return from;
  }
}
function mergeWatchOptions(to, from) {
  if (!to) return from;
  if (!from) return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = extend({}, rootComponent);
    }
    if (rootProps != null && !isObject(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new WeakSet();
    const pluginCleanupFns = [];
    let isMounted = false;
    const app = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin)) ;
        else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app, ...options);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app, ...options);
        } else ;
        return app;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app;
      },
      mount(rootContainer, isHydrate, namespace) {
        if (!isMounted) {
          const vnode = app._ceVNode || createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (namespace === true) {
            namespace = "svg";
          } else if (namespace === false) {
            namespace = void 0;
          }
          {
            render(vnode, rootContainer, namespace);
          }
          isMounted = true;
          app._container = rootContainer;
          rootContainer.__vue_app__ = app;
          return getComponentPublicInstance(vnode.component);
        }
      },
      onUnmount(cleanupFn) {
        pluginCleanupFns.push(cleanupFn);
      },
      unmount() {
        if (isMounted) {
          callWithAsyncErrorHandling(
            pluginCleanupFns,
            app._instance,
            16
          );
          render(null, app._container);
          delete app._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app;
      },
      runWithContext(fn) {
        const lastApp = currentApp;
        currentApp = app;
        try {
          return fn();
        } finally {
          currentApp = lastApp;
        }
      }
    };
    return app;
  };
}
let currentApp = null;
const getModelModifiers = (props, modelName) => {
  return modelName === "modelValue" || modelName === "model-value" ? props.modelModifiers : props[`${modelName}Modifiers`] || props[`${camelize(modelName)}Modifiers`] || props[`${hyphenate(modelName)}Modifiers`];
};
function emit(instance, event, ...rawArgs) {
  if (instance.isUnmounted) return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modifiers = isModelListener2 && getModelModifiers(props, event.slice(7));
  if (modifiers) {
    if (modifiers.trim) {
      args = rawArgs.map((a) => isString(a) ? a.trim() : a);
    }
    if (modifiers.number) {
      args = rawArgs.map(looseToNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || // also try camelCase event handler (#2249)
  props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(
      handler,
      instance,
      6,
      args
    );
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(
      onceHandler,
      instance,
      6,
      args
    );
  }
}
const mixinEmitsCache = /* @__PURE__ */ new WeakMap();
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = asMixin ? mixinEmitsCache : appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const {
    type: Component,
    vnode,
    proxy,
    withProxy,
    propsOptions: [propsOptions],
    slots,
    attrs,
    emit: emit2,
    render,
    renderCache,
    props,
    data,
    setupState,
    ctx,
    inheritAttrs
  } = instance;
  const prev = setCurrentRenderingInstance(instance);
  let result;
  let fallthroughAttrs;
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      const thisProxy = false ? new Proxy(proxyToUse, {
        get(target, key, receiver) {
          warn$1(
            `Property '${String(
              key
            )}' was accessed via 'this'. Avoid using 'this' in templates.`
          );
          return Reflect.get(target, key, receiver);
        }
      }) : proxyToUse;
      result = normalizeVNode(
        render.call(
          thisProxy,
          proxyToUse,
          renderCache,
          false ? /* @__PURE__ */ shallowReadonly(props) : props,
          setupState,
          data,
          ctx
        )
      );
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (false) ;
      result = normalizeVNode(
        render2.length > 1 ? render2(
          false ? /* @__PURE__ */ shallowReadonly(props) : props,
          false ? {
            get attrs() {
              markAttrsAccessed();
              return /* @__PURE__ */ shallowReadonly(attrs);
            },
            slots,
            emit: emit2
          } : { attrs, slots, emit: emit2 }
        ) : render2(
          false ? /* @__PURE__ */ shallowReadonly(props) : props,
          null
        )
      );
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(
            fallthroughAttrs,
            propsOptions
          );
        }
        root = cloneVNode(root, fallthroughAttrs, false, true);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root, null, false, true);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    setTransitionHooks(root, vnode.transition);
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (hasPropValueChanged(nextProps, prevProps, key) && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function hasPropValueChanged(nextProps, prevProps, key) {
  const nextProp = nextProps[key];
  const prevProp = prevProps[key];
  if (key === "style" && isObject(nextProp) && isObject(prevProp)) {
    return !looseEqual(nextProp, prevProp);
  }
  return nextProp !== prevProp;
}
function updateHOCHostEl({ vnode, parent, suspense }, el) {
  while (parent) {
    const root = parent.subTree;
    if (root.suspense && root.suspense.activeBranch === vnode) {
      root.suspense.vnode.el = root.el = el;
      vnode = root;
    }
    if (root === vnode) {
      (vnode = parent.vnode).el = el;
      parent = parent.parent;
    } else {
      break;
    }
  }
  if (suspense && suspense.activeBranch === vnode) {
    suspense.vnode.el = el;
  }
}
const internalObjectProto = {};
const createInternalObject = () => Object.create(internalObjectProto);
const isInternalObject = (obj) => Object.getPrototypeOf(obj) === internalObjectProto;
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = createInternalObject();
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : /* @__PURE__ */ shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const {
    props,
    attrs,
    vnode: { patchFlag }
  } = instance;
  const rawCurrentProps = /* @__PURE__ */ toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if (
    // always force full diff in dev
    // - #1942 if hmr is enabled with sfc component
    // - vite#872 non-sfc component used by sfc component
    (optimized || patchFlag > 0) && !(patchFlag & 16)
  ) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(
              options,
              rawCurrentProps,
              camelizedKey,
              value,
              instance,
              false
            );
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || // for camelCase
      !hasOwn(rawProps, key) && // it's possible the original props was passed in as kebab-case
      // and converted to camelCase (#955)
      ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && // for camelCase
          (rawPrevProps[key] !== void 0 || // for kebab-case
          rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(
              options,
              rawCurrentProps,
              key,
              void 0,
              instance,
              true
            );
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance.attrs, "set", "");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = /* @__PURE__ */ toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(
        options,
        rawCurrentProps,
        key,
        castValues[key],
        instance,
        !hasOwn(castValues, key)
      );
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && !opt.skipFactory && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          const reset = setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(
            null,
            props
          );
          reset();
        }
      } else {
        value = defaultValue;
      }
      if (instance.ce) {
        instance.ce._setProp(key, value);
      }
    }
    if (opt[
      0
      /* shouldCast */
    ]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[
        1
        /* shouldCastTrue */
      ] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
const mixinPropsCache = /* @__PURE__ */ new WeakMap();
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = asMixin ? mixinPropsCache : appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys) needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray(opt) || isFunction(opt) ? { type: opt } : extend({}, opt);
        const propType = prop.type;
        let shouldCast = false;
        let shouldCastTrue = true;
        if (isArray(propType)) {
          for (let index = 0; index < propType.length; ++index) {
            const type = propType[index];
            const typeName = isFunction(type) && type.name;
            if (typeName === "Boolean") {
              shouldCast = true;
              break;
            } else if (typeName === "String") {
              shouldCastTrue = false;
            }
          }
        } else {
          shouldCast = isFunction(propType) && propType.name === "Boolean";
        }
        prop[
          0
          /* shouldCast */
        ] = shouldCast;
        prop[
          1
          /* shouldCastTrue */
        ] = shouldCastTrue;
        if (shouldCast || hasOwn(prop, "default")) {
          needCastKeys.push(normalizedKey);
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$" && !isReservedProp(key)) {
    return true;
  }
  return false;
}
const isInternalKey = (key) => key === "_" || key === "_ctx" || key === "$stable";
const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    if (false) ;
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key)) continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const assignSlots = (slots, children, optimized) => {
  for (const key in children) {
    if (optimized || !isInternalKey(key)) {
      slots[key] = children[key];
    }
  }
};
const initSlots = (instance, children, optimized) => {
  const slots = instance.slots = createInternalObject();
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      assignSlots(slots, children, optimized);
      if (optimized) {
        def(slots, "_", type, true);
      }
    } else {
      normalizeObjectSlots(children, slots);
    }
  } else if (children) {
    normalizeVNodeSlots(instance, children);
  }
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        assignSlots(slots, children, optimized);
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && deletionComparisonTarget[key] == null) {
        delete slots[key];
      }
    }
  }
};
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const {
    insert: hostInsert,
    remove: hostRemove,
    patchProp: hostPatchProp,
    createElement: hostCreateElement,
    createText: hostCreateText,
    createComment: hostCreateComment,
    setText: hostSetText,
    setElementText: hostSetElementText,
    parentNode: hostParentNode,
    nextSibling: hostNextSibling,
    setScopeId: hostSetScopeId = NOOP,
    insertStaticContent: hostInsertStaticContent
  } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, namespace = void 0, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref3, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, namespace);
        }
        break;
      case Fragment:
        processFragment(
          n1,
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        break;
      default:
        if (shapeFlag & 1) {
          processElement(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 6) {
          processComponent(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (shapeFlag & 64) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else if (shapeFlag & 128) {
          type.process(
            n1,
            n2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized,
            internals
          );
        } else ;
    }
    if (ref3 != null && parentComponent) {
      setRef(ref3, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    } else if (ref3 == null && n1 && n1.ref != null) {
      setRef(n1.ref, null, parentSuspense, n1, true);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateText(n2.children),
        container,
        anchor
      );
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(
        n2.el = hostCreateComment(n2.children || ""),
        container,
        anchor
      );
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, namespace) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(
      n2.children,
      container,
      anchor,
      namespace,
      n2.el,
      n2.anchor
    );
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    if (n2.type === "svg") {
      namespace = "svg";
    } else if (n2.type === "math") {
      namespace = "mathml";
    }
    if (n1 == null) {
      mountElement(
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      const customElement = n1.el && n1.el._isVueCE ? n1.el : null;
      try {
        if (customElement) {
          customElement._beginPatch();
        }
        patchElement(
          n1,
          n2,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } finally {
        if (customElement) {
          customElement._endPatch();
        }
      }
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { props, shapeFlag, transition, dirs } = vnode;
    el = vnode.el = hostCreateElement(
      vnode.type,
      namespace,
      props && props.is,
      props
    );
    if (shapeFlag & 8) {
      hostSetElementText(el, vnode.children);
    } else if (shapeFlag & 16) {
      mountChildren(
        vnode.children,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(vnode, namespace),
        slotScopeIds,
        optimized
      );
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "created");
    }
    setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    if (props) {
      for (const key in props) {
        if (key !== "value" && !isReservedProp(key)) {
          hostPatchProp(el, key, null, props[key], namespace, parentComponent);
        }
      }
      if ("value" in props) {
        hostPatchProp(el, "value", null, props.value, namespace);
      }
      if (vnodeHook = props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHook, parentComponent, vnode);
      }
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = needTransition(parentSuspense, transition);
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        try {
          vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
          needCallTransitionHooks && transition.enter(el);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        } finally {
        }
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree || isSuspense(subTree.type) && (subTree.ssContent === vnode || subTree.ssFallback === vnode)) {
        const parentVNode = parentComponent.vnode;
        setScopeId(
          el,
          parentVNode,
          parentVNode.scopeId,
          parentVNode.slotScopeIds,
          parentComponent.parent
        );
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(
        null,
        child,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    if (oldProps.innerHTML && newProps.innerHTML == null || oldProps.textContent && newProps.textContent == null) {
      hostSetElementText(el, "");
    }
    if (dynamicChildren) {
      patchBlockChildren(
        n1.dynamicChildren,
        dynamicChildren,
        el,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds
      );
    } else if (!optimized) {
      patchChildren(
        n1,
        n2,
        el,
        null,
        parentComponent,
        parentSuspense,
        resolveChildrenNamespace(n2, namespace),
        slotScopeIds,
        false
      );
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, oldProps, newProps, parentComponent, namespace);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, namespace);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, namespace);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el, key, prev, next, namespace, parentComponent);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, oldProps, newProps, parentComponent, namespace);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, namespace, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = (
        // oldVNode may be an errored async setup() component inside Suspense
        // which will not have a mounted element
        oldVNode.el && // - In the case of a Fragment, we need to provide the actual parent
        // of the Fragment itself so it can move its children.
        (oldVNode.type === Fragment || // - In the case of different nodes, there is going to be a replacement
        // which also requires the correct parent container
        !isSameVNodeType(oldVNode, newVNode) || // - In the case of a component, it could contain anything.
        oldVNode.shapeFlag & (6 | 64 | 128)) ? hostParentNode(oldVNode.el) : (
          // In other cases, the parent container is not actually used so we
          // just pass the block element here to avoid a DOM parentNode call.
          fallbackContainer
        )
      );
      patch(
        oldVNode,
        newVNode,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        true
      );
    }
  };
  const patchProps = (el, oldProps, newProps, parentComponent, namespace) => {
    if (oldProps !== newProps) {
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(
              el,
              key,
              oldProps[key],
              null,
              namespace,
              parentComponent
            );
          }
        }
      }
      for (const key in newProps) {
        if (isReservedProp(key)) continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next, namespace, parentComponent);
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value, namespace);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(
        // #10007
        // such fragment like `<></>` will be compiled into
        // a fragment which doesn't have a children.
        // In this case fallback to an empty array
        n2.children || [],
        container,
        fragmentEndAnchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && // #2715 the previous fragment could've been a BAILed one as a result
      // of renderSlot() with no valid children
      n1.dynamicChildren && n1.dynamicChildren.length === dynamicChildren.length) {
        patchBlockChildren(
          n1.dynamicChildren,
          dynamicChildren,
          container,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds
        );
        if (
          // #2080 if the stable fragment has a key, it's a <template v-for> that may
          //  get moved around. Make sure all root level vnodes inherit el.
          // #2134 or if it's a component root, it may also get moved around
          // as the component is being moved.
          n2.key != null || parentComponent && n2 === parentComponent.subTree
        ) {
          traverseStaticChildren(
            n1,
            n2,
            true
            /* shallow */
          );
        }
      } else {
        patchChildren(
          n1,
          n2,
          container,
          fragmentEndAnchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(
          n2,
          container,
          anchor,
          namespace,
          optimized
        );
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          optimized
        );
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, namespace, optimized) => {
    const instance = initialVNode.component = createComponentInstance(
      initialVNode,
      parentComponent,
      parentSuspense
    );
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance, false, optimized);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect, optimized);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
        initialVNode.placeholder = placeholder.el;
      }
    } else {
      setupRenderEffect(
        instance,
        initialVNode,
        container,
        anchor,
        parentSuspense,
        namespace,
        optimized
      );
    }
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, namespace, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent, root, type } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        {
          if (root.ce && root.ce._hasShadowRoot()) {
            root.ce._injectChildStyle(
              type,
              instance.parent ? instance.parent.type : void 0
            );
          }
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(
            null,
            subTree,
            container,
            anchor,
            instance,
            parentSuspense,
            namespace
          );
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode),
            parentSuspense
          );
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        {
          const nonHydratedAsyncRoot = locateNonHydratedAsyncRoot(instance);
          if (nonHydratedAsyncRoot) {
            if (next) {
              next.el = vnode.el;
              updateComponentPreRender(instance, next, optimized);
            }
            nonHydratedAsyncRoot.asyncDep.then(() => {
              queuePostRenderEffect(() => {
                if (!instance.isUnmounted) update();
              }, parentSuspense);
            });
            return;
          }
        }
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el),
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          namespace
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(
            () => invokeVNodeHook(vnodeHook, parent, next, vnode),
            parentSuspense
          );
        }
      }
    };
    instance.scope.on();
    const effect2 = instance.effect = new ReactiveEffect(componentUpdateFn);
    instance.scope.off();
    const update = instance.update = effect2.run.bind(effect2);
    const job = instance.job = effect2.runIfDirty.bind(effect2);
    job.i = instance;
    job.id = instance.uid;
    effect2.scheduler = () => queueJob(job);
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(instance);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(
          c1,
          c2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(
            c1,
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(
            c2,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(
        c1[i],
        nextChild,
        container,
        null,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized
      );
    }
    if (oldLength > newLength) {
      unmountChildren(
        c1,
        parentComponent,
        parentSuspense,
        true,
        false,
        commonLength
      );
    } else {
      mountChildren(
        c2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
        commonLength
      );
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, namespace, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(
          n1,
          n2,
          container,
          null,
          parentComponent,
          parentSuspense,
          namespace,
          slotScopeIds,
          optimized
        );
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(
            null,
            c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]),
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++) newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(
            prevChild,
            c2[newIndex],
            container,
            null,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchorVNode = c2[nextIndex + 1];
        const anchor = nextIndex + 1 < l2 ? (
          // #13559, #14173 fallback to el placeholder for unresolved async component
          anchorVNode.el || resolveAsyncComponentPlaceholder(anchorVNode)
        ) : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(
            null,
            nextChild,
            container,
            anchor,
            parentComponent,
            parentSuspense,
            namespace,
            slotScopeIds,
            optimized
          );
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition2 = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition2) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove22 = () => {
          if (vnode.ctx.isUnmounted) {
            hostRemove(el);
          } else {
            hostInsert(el, container, anchor);
          }
        };
        const performLeave = () => {
          if (el._isLeaving) {
            el[leaveCbKey](
              true
              /* cancelled */
            );
          }
          leave(el, () => {
            remove22();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove22, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const {
      type,
      props,
      ref: ref3,
      children,
      dynamicChildren,
      shapeFlag,
      patchFlag,
      dirs,
      cacheIndex,
      memo
    } = vnode;
    if (patchFlag === -2) {
      optimized = false;
    }
    if (ref3 != null) {
      pauseTracking();
      setRef(ref3, null, parentSuspense, vnode, true);
      resetTracking();
    }
    if (cacheIndex != null) {
      parentComponent.renderCache[cacheIndex] = void 0;
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(
          vnode,
          parentComponent,
          parentSuspense,
          internals,
          doRemove
        );
      } else if (dynamicChildren && // #5154
      // when v-once is used inside a block, setBlockTracking(-1) marks the
      // parent block with hasOnce: true
      // so that it doesn't take the fast path during unmount - otherwise
      // components nested in v-once are never unmounted.
      !dynamicChildren.hasOnce && // #1153: fast path should not be taken for non-stable (v-for) fragments
      (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(
          dynamicChildren,
          parentComponent,
          parentSuspense,
          false,
          true
        );
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    const shouldInvalidateMemo = memo != null && cacheIndex == null;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs || shouldInvalidateMemo) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
        if (shouldInvalidateMemo) {
          vnode.el = null;
        }
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, job, subTree, um, m, a } = instance;
    invalidateMount(m);
    invalidateMount(a);
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (job) {
      job.flags |= 8;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    const el = hostNextSibling(vnode.anchor || vnode.el);
    const teleportEnd = el && el[TeleportEndKey];
    return teleportEnd ? hostNextSibling(teleportEnd) : el;
  };
  let isFlushing = false;
  const render = (vnode, container, namespace) => {
    let instance;
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
        instance = container._vnode.component;
      }
    } else {
      patch(
        container._vnode || null,
        vnode,
        container,
        null,
        null,
        null,
        namespace
      );
    }
    container._vnode = vnode;
    if (!isFlushing) {
      isFlushing = true;
      flushPreFlushCbs(instance);
      flushPostFlushCbs();
      isFlushing = false;
    }
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  return {
    render,
    hydrate,
    createApp: createAppAPI(render)
  };
}
function resolveChildrenNamespace({ type, props }, currentNamespace) {
  return currentNamespace === "svg" && type === "foreignObject" || currentNamespace === "mathml" && type === "annotation-xml" && props && props.encoding && props.encoding.includes("html") ? void 0 : currentNamespace;
}
function toggleRecurse({ effect: effect2, job }, allowed) {
  if (allowed) {
    effect2.flags |= 32;
    job.flags |= 4;
  } else {
    effect2.flags &= -33;
    job.flags &= -5;
  }
}
function needTransition(parentSuspense, transition) {
  return (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray(ch1) && isArray(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow && c2.patchFlag !== -2)
          traverseStaticChildren(c1, c2);
      }
      if (c2.type === Text) {
        if (c2.patchFlag === -1) {
          c2 = ch2[i] = cloneIfMounted(c2);
        }
        c2.el = c1.el;
      }
      if (c2.type === Comment && !c2.el) {
        c2.el = c1.el;
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
function locateNonHydratedAsyncRoot(instance) {
  const subComponent = instance.subTree.component;
  if (subComponent) {
    if (subComponent.asyncDep && !subComponent.asyncResolved) {
      return subComponent;
    } else {
      return locateNonHydratedAsyncRoot(subComponent);
    }
  }
}
function invalidateMount(hooks) {
  if (hooks) {
    for (let i = 0; i < hooks.length; i++)
      hooks[i].flags |= 8;
  }
}
function resolveAsyncComponentPlaceholder(anchorVnode) {
  if (anchorVnode.placeholder) {
    return anchorVnode.placeholder;
  }
  const instance = anchorVnode.component;
  if (instance) {
    return resolveAsyncComponentPlaceholder(instance.subTree);
  }
  return null;
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
const Fragment = /* @__PURE__ */ Symbol.for("v-fgt");
const Text = /* @__PURE__ */ Symbol.for("v-txt");
const Comment = /* @__PURE__ */ Symbol.for("v-cmt");
const Static = /* @__PURE__ */ Symbol.for("v-stc");
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value, inVOnce = false) {
  isBlockTreeEnabled += value;
  if (value < 0 && currentBlock && inVOnce) {
    currentBlock.hasOnce = true;
  }
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(
    createBaseVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      shapeFlag,
      true
    )
  );
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(
    createVNode(
      type,
      props,
      children,
      patchFlag,
      dynamicProps,
      true
    )
  );
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({
  ref: ref3,
  ref_key,
  ref_for
}) => {
  if (typeof ref3 === "number") {
    ref3 = "" + ref3;
  }
  return ref3 != null ? isString(ref3) || /* @__PURE__ */ isRef(ref3) || isFunction(ref3) ? { i: currentRenderingInstance, r: ref3, k: ref_key, f: !!ref_for } : ref3 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetStart: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null,
    ctx: currentRenderingInstance
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && // avoid a block node from tracking itself
  !isBlockNode && // has current parent block
  currentBlock && // presence of a patch flag indicates this node needs patching on updates.
  // component nodes also should always be patched, because even if the
  // component doesn't need to update, it needs to persist the instance on to
  // the next vnode so that it can be properly unmounted later.
  (vnode.patchFlag > 0 || shapeFlag & 6) && // the EVENTS flag is only for hydration and if it is the only flag, the
  // vnode should not be considered dynamic due to handler caching.
  vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(
      type,
      props,
      true
      /* mergeRef: true */
    );
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag = -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style)) {
      if (/* @__PURE__ */ isProxy(style) && !isArray(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(
    type,
    props,
    children,
    patchFlag,
    dynamicProps,
    shapeFlag,
    isBlockNode,
    true
  );
}
function guardReactiveProps(props) {
  if (!props) return null;
  return /* @__PURE__ */ isProxy(props) || isInternalObject(props) ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false, cloneTransition = false) {
  const { props, ref: ref3, patchFlag, children, transition } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? (
      // #2078 in the case of <component :is="vnode" ref="extra"/>
      // if the vnode itself already has a ref, cloneVNode will need to merge
      // the refs so the single vnode can be set on multiple refs
      mergeRef && ref3 ? isArray(ref3) ? ref3.concat(normalizeRef(extraProps)) : [ref3, normalizeRef(extraProps)] : normalizeRef(extraProps)
    ) : ref3,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetStart: vnode.targetStart,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    // if the vnode is cloned with extra props, we can no longer assume its
    // existing patch flag to be reliable and need to add the FULL_PROPS flag.
    // note: preserve flag for fragments since they use the flag for children
    // fast paths only.
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition,
    // These should technically only be non-null on mounted VNodes. However,
    // they *should* be copied for kept-alive vnodes. So we just always copy
    // them since them being non-null during a mount doesn't affect the logic as
    // they will simply be overwritten.
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    placeholder: vnode.placeholder,
    el: vnode.el,
    anchor: vnode.anchor,
    ctx: vnode.ctx,
    ce: vnode.ce
  };
  if (transition && cloneTransition) {
    setTransitionHooks(
      cloned,
      transition.clone(cloned)
    );
  }
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray(child)) {
    return createVNode(
      Fragment,
      null,
      // #3666, avoid reference pollution when reusing vnode
      child.slice()
    );
  } else if (isVNode(child)) {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null && child.patchFlag !== -1 || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !isInternalObject(children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        } else if (incoming == null && existing == null && // mergeProps({ 'onUpdate:modelValue': undefined }) should not retain
        // the model listener.
        !isModelListener(key)) {
          ret[key] = incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    // to be immediately set
    next: null,
    subTree: null,
    // will be set synchronously right after creation
    effect: null,
    update: null,
    // will be set synchronously right after creation
    job: null,
    scope: new EffectScope(
      true
      /* detached */
    ),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    ids: parent ? parent.ids : ["", 0, 0],
    accessCache: null,
    renderCache: [],
    // local resolved assets
    components: null,
    directives: null,
    // resolved props and emits options
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    // emit
    emit: null,
    // to be set immediately
    emitted: null,
    // props default value
    propsDefaults: EMPTY_OBJ,
    // inheritAttrs
    inheritAttrs: type.inheritAttrs,
    // state
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    // suspense related
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    // lifecycle hooks
    // not using enums here because it results in computed properties
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
let internalSetCurrentInstance;
let setInSSRSetupState;
{
  const g = getGlobalThis();
  const registerGlobalSetter = (key, setter) => {
    let setters;
    if (!(setters = g[key])) setters = g[key] = [];
    setters.push(setter);
    return (v) => {
      if (setters.length > 1) setters.forEach((set) => set(v));
      else setters[0](v);
    };
  };
  internalSetCurrentInstance = registerGlobalSetter(
    `__VUE_INSTANCE_SETTERS__`,
    (v) => currentInstance = v
  );
  setInSSRSetupState = registerGlobalSetter(
    `__VUE_SSR_SETTERS__`,
    (v) => isInSSRComponentSetup = v
  );
}
const setCurrentInstance = (instance) => {
  const prev = currentInstance;
  internalSetCurrentInstance(instance);
  instance.scope.on();
  return () => {
    instance.scope.off();
    internalSetCurrentInstance(prev);
  };
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  internalSetCurrentInstance(null);
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false, optimized = false) {
  isSSR && setInSSRSetupState(isSSR);
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children, optimized || isSSR);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isSSR && setInSSRSetupState(false);
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = new Proxy(instance.ctx, PublicInstanceProxyHandlers);
  const { setup } = Component;
  if (setup) {
    pauseTracking();
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    const reset = setCurrentInstance(instance);
    const setupResult = callWithErrorHandling(
      setup,
      instance,
      0,
      [
        instance.props,
        setupContext
      ]
    );
    const isAsyncSetup = isPromise(setupResult);
    resetTracking();
    reset();
    if ((isAsyncSetup || instance.sp) && !isAsyncWrapper(instance)) {
      markAsyncBoundary(instance);
    }
    if (isAsyncSetup) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult);
    }
  } else {
    finishComponentSetup(instance);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else ;
  finishComponentSetup(instance);
}
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    instance.render = Component.render || NOOP;
  }
  {
    const reset = setCurrentInstance(instance);
    pauseTracking();
    try {
      applyOptions(instance);
    } finally {
      resetTracking();
      reset();
    }
  }
}
const attrsProxyHandlers = {
  get(target, key) {
    track(target, "get", "");
    return target[key];
  }
};
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  {
    return {
      attrs: new Proxy(instance.attrs, attrsProxyHandlers),
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getComponentPublicInstance(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      },
      has(target, key) {
        return key in target || key in publicPropertiesMap;
      }
    }));
  } else {
    return instance.proxy;
  }
}
const classifyRE = /(?:^|[-_])\w/g;
const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match) {
      name = match[1];
    }
  }
  if (!name && instance) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(instance.components) || instance.parent && inferFromRegistry(
      instance.parent.type.components
    ) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  const c = /* @__PURE__ */ computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
  return c;
};
const version = "3.5.32";
let policy = void 0;
const tt = typeof window !== "undefined" && window.trustedTypes;
if (tt) {
  try {
    policy = /* @__PURE__ */ tt.createPolicy("vue", {
      createHTML: (val) => val
    });
  } catch (e) {
  }
}
const unsafeToTrustedHTML = policy ? (val) => policy.createHTML(val) : (val) => val;
const svgNS = "http://www.w3.org/2000/svg";
const mathmlNS = "http://www.w3.org/1998/Math/MathML";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, namespace, is, props) => {
    const el = namespace === "svg" ? doc.createElementNS(svgNS, tag) : namespace === "mathml" ? doc.createElementNS(mathmlNS, tag) : is ? doc.createElement(tag, { is }) : doc.createElement(tag);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  // __UNSAFE__
  // Reason: innerHTML.
  // Static content here can only come from compiled templates.
  // As long as the user only uses trusted templates, this is safe.
  insertStaticContent(content, parent, anchor, namespace, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling)) break;
      }
    } else {
      templateContainer.innerHTML = unsafeToTrustedHTML(
        namespace === "svg" ? `<svg>${content}</svg>` : namespace === "mathml" ? `<math>${content}</math>` : content
      );
      const template = templateContainer.content;
      if (namespace === "svg" || namespace === "mathml") {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      // first
      before ? before.nextSibling : parent.firstChild,
      // last
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
const vtcKey = /* @__PURE__ */ Symbol("_vtc");
function patchClass(el, value, isSVG) {
  const transitionClasses = el[vtcKey];
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
const vShowOriginalDisplay = /* @__PURE__ */ Symbol("_vod");
const vShowHidden = /* @__PURE__ */ Symbol("_vsh");
const CSS_VAR_TEXT = /* @__PURE__ */ Symbol("");
const displayRE = /(?:^|;)\s*display\s*:/;
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString(next);
  let hasControlledDisplay = false;
  if (next && !isCssString) {
    if (prev) {
      if (!isString(prev)) {
        for (const key in prev) {
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      } else {
        for (const prevStyle of prev.split(";")) {
          const key = prevStyle.slice(0, prevStyle.indexOf(":")).trim();
          if (next[key] == null) {
            setStyle(style, key, "");
          }
        }
      }
    }
    for (const key in next) {
      if (key === "display") {
        hasControlledDisplay = true;
      }
      setStyle(style, key, next[key]);
    }
  } else {
    if (isCssString) {
      if (prev !== next) {
        const cssVarText = style[CSS_VAR_TEXT];
        if (cssVarText) {
          next += ";" + cssVarText;
        }
        style.cssText = next;
        hasControlledDisplay = displayRE.test(next);
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
  }
  if (vShowOriginalDisplay in el) {
    el[vShowOriginalDisplay] = hasControlledDisplay ? style.display : "";
    if (el[vShowHidden]) {
      style.display = "none";
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null) val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(
          hyphenate(prefixed),
          val.replace(importantRE, ""),
          "important"
        );
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance, isBoolean = isSpecialBooleanAttr(key)) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(
        key,
        isBoolean ? "" : isSymbol(value) ? String(value) : value
      );
    }
  }
}
function patchDOMProp(el, key, value, parentComponent, attrName) {
  if (key === "innerHTML" || key === "textContent") {
    if (value != null) {
      el[key] = key === "innerHTML" ? unsafeToTrustedHTML(value) : value;
    }
    return;
  }
  const tag = el.tagName;
  if (key === "value" && tag !== "PROGRESS" && // custom elements may use _value internally
  !tag.includes("-")) {
    const oldValue = tag === "OPTION" ? el.getAttribute("value") || "" : el.value;
    const newValue = value == null ? (
      // #11647: value should be set as empty string for null and undefined,
      // but <input type="checkbox"> should be set as 'on'.
      el.type === "checkbox" ? "on" : ""
    ) : String(value);
    if (oldValue !== newValue || !("_value" in el)) {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    el._value = value;
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(attrName || key);
}
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
const veiKey = /* @__PURE__ */ Symbol("_vei");
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el[veiKey] || (el[veiKey] = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(
        nextValue,
        instance
      );
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const getNow = () => cachedNow || (p.then(() => cachedNow = 0), cachedNow = Date.now());
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    if (!e._vts) {
      e._vts = Date.now();
    } else if (e._vts <= invoker.attached) {
      return;
    }
    callWithAsyncErrorHandling(
      patchStopImmediatePropagation(e, invoker.value),
      instance,
      5,
      [e]
    );
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map(
      (fn) => (e2) => !e2._stopped && fn && fn(e2)
    );
  } else {
    return value;
  }
}
const isNativeOn = (key) => key.charCodeAt(0) === 111 && key.charCodeAt(1) === 110 && // lowercase letter
key.charCodeAt(2) > 96 && key.charCodeAt(2) < 123;
const patchProp = (el, key, prevValue, nextValue, namespace, parentComponent) => {
  const isSVG = namespace === "svg";
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue);
    if (!el.tagName.includes("-") && (key === "value" || key === "checked" || key === "selected")) {
      patchAttr(el, key, nextValue, isSVG, parentComponent, key !== "value");
    }
  } else if (
    // #11081 force set props for possible async custom element
    el._isVueCE && // #12408 check if it's declared prop or it's async custom element
    (shouldSetAsPropForVueCE(el, key) || // @ts-expect-error _def is private
    el._def.__asyncLoader && (/[A-Z]/.test(key) || !isString(nextValue)))
  ) {
    patchDOMProp(el, camelize(key), nextValue, parentComponent, key);
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && isNativeOn(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate" || key === "autocorrect") {
    return false;
  }
  if (key === "sandbox" && el.tagName === "IFRAME") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (key === "width" || key === "height") {
    const tag = el.tagName;
    if (tag === "IMG" || tag === "VIDEO" || tag === "CANVAS" || tag === "SOURCE") {
      return false;
    }
  }
  if (isNativeOn(key) && isString(value)) {
    return false;
  }
  return key in el;
}
function shouldSetAsPropForVueCE(el, key) {
  const props = (
    // @ts-expect-error _def is private
    el._def.props
  );
  if (!props) {
    return false;
  }
  const camelKey = camelize(key);
  return Array.isArray(props) ? props.some((prop) => camelize(prop) === camelKey) : Object.keys(props).some((prop) => camelize(prop) === camelKey);
}
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = ((...args) => {
  const app = ensureRenderer().createApp(...args);
  const { mount } = app;
  app.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container) return;
    const component = app._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    if (container.nodeType === 1) {
      container.textContent = "";
    }
    const proxy = mount(container, false, resolveRootNamespace(container));
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app;
});
function resolveRootNamespace(container) {
  if (container instanceof SVGElement) {
    return "svg";
  }
  if (typeof MathMLElement === "function" && container instanceof MathMLElement) {
    return "mathml";
  }
}
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
const LastUpdate = /* @__PURE__ */ new Date("2026-04-20");
let PageType = {
  trailer: "trailer",
  about: "about",
  threed: "threed",
  film: "film",
  games: "games",
  impressum: "impressum",
  p_schatten: "p_schatten",
  p_strings: "p_strings",
  p_dune: "p_dune",
  p_raum: "p_raum",
  p_kurios: "p_kurios",
  p_ludum: "p_ludum",
  p_digi: "p_digi",
  p_ggj: "p_ggj",
  p_lgnd: "p_lgnd",
  p_all: "p_all"
};
const OpenedPage = /* @__PURE__ */ ref(PageType.trailer);
const Visited = /* @__PURE__ */ ref(/* @__PURE__ */ new Set([]));
let lastZ = 1;
let inPipeline = 0;
function OpenPage(type, back = false, section = null) {
  dontShowLoadingError.value = false;
  HasLoadingError.value = false;
  if (type == OpenedPage.value && section) {
    scrollTo(section, true);
    return;
  }
  if (type == OpenedPage.value) type = PageType.trailer;
  OpenNewPage(type, back, section);
}
function OpenNewPage(type, back, section = null) {
  if (!(type in PageType)) return;
  if (type != PageType.trailer) Visited.value.add(type);
  setTimeout(() => {
    let elem = document.querySelector('.panel[panel="' + type + '"]');
    if (!elem) return;
    OpenedPage.value = type;
    const url = new URL(window.location.href);
    url.searchParams.set("page", type);
    if (!back) {
      if (section) url.searchParams.set("section", section);
      else url.searchParams.delete("section");
      window.history.pushState({}, "", url);
    }
    inPipeline++;
    fadeIn(elem);
    setTimeout(() => {
      elem.style.zIndex = (++lastZ).toString();
      elem.setAttribute("hide", "false");
      if (section) scrollTo(section, false);
    }, 100);
  }, 100);
}
function fadeIn(elem) {
  let o = 0;
  let ival = setInterval(() => {
    if (o > 1) {
      elem.style.opacity = "1";
      inPipeline--;
      if (inPipeline == 0) {
        lastZ = 1;
        document.querySelectorAll(".panel").forEach((e) => {
          let conv = e;
          if (conv.getAttribute("panel") == OpenedPage.value) conv.style.zIndex = "1";
          else {
            conv.style.zIndex = "0";
            e.setAttribute("hide", "true");
          }
        });
      }
      clearInterval(ival);
    } else elem.style.opacity = easeInOutQuad(o).toString();
    o += 0.02;
  }, 10);
}
function easeInOutQuad(x) {
  return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2;
}
function scrollTo(section, update) {
  const url = new URL(window.location.href);
  if (update && section) {
    url.searchParams.set("section", section);
    window.history.replaceState({}, "", url);
  }
  let elem = document.querySelector('.panel[panel="' + OpenedPage.value + '"]');
  if (!elem) return;
  const el = document.querySelector("#" + section);
  if (el) el.scrollIntoView({ behavior: "smooth" });
}
const HasLoadingError = /* @__PURE__ */ ref(false);
const dontShowLoadingError = /* @__PURE__ */ ref(false);
function ShowLoadingError() {
  if (!HasLoadingError.value && !dontShowLoadingError.value) HasLoadingError.value = true;
}
function HideLoadingError() {
  dontShowLoadingError.value = true;
  HasLoadingError.value = false;
}
const _hoisted_1$h = { class: "boxcoinInner" };
const _sfc_main$t = /* @__PURE__ */ defineComponent({
  __name: "BoxCoin",
  setup(__props) {
    function mousedown(el) {
      el.setAttribute("mousedown", "true");
    }
    function mouseup(el) {
      el.setAttribute("mousedown", "false");
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "boxcoin",
        onMousedown: _cache[0] || (_cache[0] = ($event) => mousedown(_ctx.$el)),
        onMouseup: _cache[1] || (_cache[1] = ($event) => mouseup(_ctx.$el)),
        onMouseleave: _cache[2] || (_cache[2] = ($event) => mouseup(_ctx.$el))
      }, [
        createBaseVNode("div", _hoisted_1$h, [
          renderSlot(_ctx.$slots, "default", {}, void 0)
        ]),
        _cache[3] || (_cache[3] = createBaseVNode("div", { class: "boxcoinSide" }, null, -1))
      ], 32);
    };
  }
});
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const BoxCoin = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["__scopeId", "data-v-0e3fae59"]]);
const _hoisted_1$g = ["href", "target"];
const _hoisted_2$c = ["src"];
const _sfc_main$s = /* @__PURE__ */ defineComponent({
  __name: "CoinSurface",
  props: {
    image: {},
    scale: {},
    link: {},
    samePage: { type: Boolean },
    onClick: { type: Function },
    useMask: { type: Boolean }
  },
  setup(__props) {
    let props = __props;
    let selfElem = /* @__PURE__ */ ref(null);
    onMounted(() => {
      var _a, _b;
      let e = (_b = (_a = selfElem.value) == null ? void 0 : _a.parentElement) == null ? void 0 : _b.parentElement;
      e == null ? void 0 : e.addEventListener("click", () => {
        if (props.onClick) props.onClick();
      });
    });
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "coinSurface",
        ref_key: "selfElem",
        ref: selfElem
      }, [
        __props.link ? (openBlock(), createElementBlock("a", {
          key: 0,
          href: __props.link ? __props.link : "",
          target: __props.samePage ? "_self" : "_blank"
        }, null, 8, _hoisted_1$g)) : createCommentVNode("", true),
        !__props.useMask ? (openBlock(), createElementBlock("img", {
          key: 1,
          draggable: false,
          src: __props.image,
          style: normalizeStyle("user-select: none; scale: " + (__props.scale ? __props.scale : 1) + ";"),
          onError: _cache[0] || (_cache[0] = ($event) => unref(ShowLoadingError)())
        }, null, 44, _hoisted_2$c)) : createCommentVNode("", true),
        __props.useMask ? (openBlock(), createElementBlock("div", {
          key: 2,
          class: "img",
          style: normalizeStyle("mask-image: url('" + __props.image + "');background-image: url('" + __props.image + "');scale: " + (__props.scale ? __props.scale : 1) + ";")
        }, null, 4)) : createCommentVNode("", true)
      ], 512);
    };
  }
});
const CoinSurface = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["__scopeId", "data-v-18911670"]]);
const _hoisted_1$f = ["type", "active"];
const _hoisted_2$b = ["delayed"];
const _sfc_main$r = /* @__PURE__ */ defineComponent({
  __name: "Coin",
  props: {
    type: {},
    delayed: { type: Boolean }
  },
  setup(__props) {
    function mousedown(el) {
      el.setAttribute("mousedown", "true");
    }
    function mouseup(el) {
      el.setAttribute("mousedown", "false");
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "coin",
        onMousedown: _cache[0] || (_cache[0] = ($event) => mousedown(_ctx.$el)),
        onMouseup: _cache[1] || (_cache[1] = ($event) => mouseup(_ctx.$el)),
        onMouseleave: _cache[2] || (_cache[2] = ($event) => mouseup(_ctx.$el)),
        type: __props.type,
        active: unref(OpenedPage) == __props.type
      }, [
        createBaseVNode("div", {
          class: "coinInner",
          delayed: __props.delayed
        }, [
          renderSlot(_ctx.$slots, "default", {}, void 0)
        ], 8, _hoisted_2$b),
        _cache[3] || (_cache[3] = createBaseVNode("div", { class: "coinSide" }, null, -1))
      ], 40, _hoisted_1$f);
    };
  }
});
const Coin = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["__scopeId", "data-v-dbf530b3"]]);
const _hoisted_1$e = ["invertedSurface", "hasButton"];
const _hoisted_2$a = ["innerHTML"];
const _sfc_main$q = /* @__PURE__ */ defineComponent({
  __name: "ContentLabelPanel",
  props: {
    label: {},
    type: {},
    onClick: { type: Function },
    invertSurface: { type: Boolean },
    invertButtonRing: { type: Boolean },
    disableButton: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "contentLabelPanel",
        invertedSurface: __props.invertSurface,
        hasButton: !__props.disableButton
      }, [
        createBaseVNode("div", { innerHTML: __props.label }, null, 8, _hoisted_2$a),
        !__props.disableButton ? (openBlock(), createBlock(Coin, {
          key: 0,
          class: "labelCoin",
          type: __props.type,
          onClick: __props.onClick,
          invertedRing: __props.invertButtonRing
        }, {
          default: withCtx(() => [
            renderSlot(_ctx.$slots, "default", {}, void 0, true)
          ]),
          _: 3
        }, 8, ["type", "onClick", "invertedRing"])) : createCommentVNode("", true)
      ], 8, _hoisted_1$e);
    };
  }
});
const ContentLabelPanel = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["__scopeId", "data-v-5a90a136"]]);
const _hoisted_1$d = ["collapse"];
const _hoisted_2$9 = { class: "leftField" };
const _hoisted_3$5 = { id: "titleContainer" };
const _hoisted_4$3 = { id: "hamburgerField" };
const _hoisted_5$3 = { class: "rightField" };
const _hoisted_6$1 = { id: "optionContainer" };
const _hoisted_7 = { id: "kontaktContainer" };
const _hoisted_8 = { id: "footer" };
const _hoisted_9 = ["active"];
const _hoisted_10 = {
  id: "hamburgerOuter",
  actionDone: true
};
const _sfc_main$p = /* @__PURE__ */ defineComponent({
  __name: "MenuPanel",
  setup(__props) {
    const collapsed = /* @__PURE__ */ ref(false);
    document.addEventListener("DOMContentLoaded", () => {
      var _a;
      return (_a = document.querySelector("menu")) == null ? void 0 : _a.setAttribute("canCollapse", "true");
    });
    function collapse() {
      var _a;
      collapsed.value = !collapsed.value;
      setTimeout(() => {
        var _a2;
        (_a2 = document.querySelector("menu")) == null ? void 0 : _a2.setAttribute("collapsed", collapsed.value.toString());
      }, collapsed.value ? 1200 : 0);
      if (collapsed) {
        (_a = document.querySelector("#hamburgerOuter")) == null ? void 0 : _a.setAttribute("actionDone", "false");
        setTimeout(() => {
          var _a2;
          (_a2 = document.querySelector("#hamburgerOuter")) == null ? void 0 : _a2.setAttribute("actionDone", "true");
        }, 1200);
      }
    }
    function clickImpressum() {
      if (OpenedPage.value == PageType.impressum) {
        window.history.back();
      } else {
        OpenPage(PageType.impressum);
        collapse();
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("menu", {
          collapse: collapsed.value,
          actionDone: false,
          draggable: "false"
        }, [
          createBaseVNode("div", _hoisted_2$9, [
            createBaseVNode("div", _hoisted_3$5, [
              createBaseVNode("div", _hoisted_4$3, [
                createVNode(BoxCoin, {
                  class: "hamburgerBtn",
                  onClick: _cache[0] || (_cache[0] = ($event) => collapse())
                }, {
                  default: withCtx(() => [..._cache[3] || (_cache[3] = [
                    createBaseVNode("div", { class: "hamburger" }, null, -1)
                  ])]),
                  _: 1
                })
              ]),
              _cache[4] || (_cache[4] = createBaseVNode("div", { class: "innerContainer" }, [
                createBaseVNode("div", { class: "title" }, "Luca"),
                createBaseVNode("div", { class: "title" }, "Spirka")
              ], -1))
            ]),
            _cache[5] || (_cache[5] = createBaseVNode("div", { class: "name" }, [
              createTextVNode("Mein "),
              createBaseVNode("span", null, "Portfolio")
            ], -1))
          ]),
          createBaseVNode("div", _hoisted_5$3, [
            createBaseVNode("div", _hoisted_6$1, [
              createVNode(ContentLabelPanel, {
                label: "Über Mich",
                type: "about",
                onClick: () => {
                  unref(OpenPage)(unref(PageType).about);
                  collapse();
                }
              }, {
                default: withCtx(() => [
                  createVNode(CoinSurface, {
                    image: "/images/icons/info.png",
                    scale: 0.79,
                    "use-mask": true
                  })
                ]),
                _: 1
              }, 8, ["onClick"]),
              createVNode(ContentLabelPanel, {
                label: "3D & Animation",
                type: "threed",
                onClick: () => {
                  unref(OpenPage)(unref(PageType).threed);
                  collapse();
                }
              }, {
                default: withCtx(() => [
                  createVNode(CoinSurface, {
                    image: "/images/icons/cube3d.png",
                    scale: 0.68,
                    "use-mask": true
                  })
                ]),
                _: 1
              }, 8, ["onClick"]),
              createVNode(ContentLabelPanel, {
                label: "Film",
                type: "film",
                onClick: () => {
                  unref(OpenPage)(unref(PageType).film);
                  collapse();
                }
              }, {
                default: withCtx(() => [
                  createVNode(CoinSurface, {
                    image: "/images/icons/film_clap.png",
                    scale: 0.66,
                    "use-mask": true
                  })
                ]),
                _: 1
              }, 8, ["onClick"]),
              createVNode(ContentLabelPanel, {
                label: "Games & Apps",
                type: "games",
                onClick: () => {
                  unref(OpenPage)(unref(PageType).games);
                  collapse();
                }
              }, {
                default: withCtx(() => [
                  createVNode(CoinSurface, {
                    image: "/images/icons/controller.png",
                    scale: 0.8,
                    "use-mask": true
                  })
                ]),
                _: 1
              }, 8, ["onClick"])
            ]),
            createBaseVNode("div", _hoisted_7, [
              _cache[6] || (_cache[6] = createBaseVNode("label", null, "Kontakt:", -1)),
              _cache[7] || (_cache[7] = createTextVNode("lucaspirka@gmail.com", -1)),
              createVNode(BoxCoin, { class: "kontaktBtn" }, {
                default: withCtx(() => [
                  createVNode(CoinSurface, {
                    image: "/images/icons/mail.webp",
                    link: "mailto:lucaspirka@gmail.com",
                    scale: 0.95,
                    "use-mask": true
                  })
                ]),
                _: 1
              })
            ])
          ]),
          createBaseVNode("div", _hoisted_8, [
            _cache[8] || (_cache[8] = createBaseVNode("div", { class: "footerItem" }, "© Luca Joel Spirka 2026", -1)),
            createBaseVNode("div", {
              class: "footerItem",
              hoverable: "",
              onClick: _cache[1] || (_cache[1] = () => {
                clickImpressum();
              }),
              active: unref(OpenedPage) == unref(PageType).impressum
            }, "Impressum", 8, _hoisted_9)
          ])
        ], 8, _hoisted_1$d),
        createBaseVNode("div", _hoisted_10, [
          createVNode(BoxCoin, {
            class: "hamburgerBtn",
            onClick: _cache[2] || (_cache[2] = ($event) => collapse())
          }, {
            default: withCtx(() => [..._cache[9] || (_cache[9] = [
              createBaseVNode("div", { class: "hamburger" }, null, -1)
            ])]),
            _: 1
          })
        ])
      ], 64);
    };
  }
});
const MenuPanel = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["__scopeId", "data-v-cdecdc41"]]);
const _hoisted_1$c = { class: "throbberContainer" };
const _sfc_main$o = /* @__PURE__ */ defineComponent({
  __name: "Throbber",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$c, [..._cache[0] || (_cache[0] = [
        createBaseVNode("div", { class: "throbber" }, null, -1)
      ])]);
    };
  }
});
const Throbber = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["__scopeId", "data-v-0ba1b2ac"]]);
const _hoisted_1$b = ["first"];
const _hoisted_2$8 = {
  key: 1,
  draggable: false,
  class: "contentImage"
};
const _hoisted_3$4 = ["src", "alt"];
const _hoisted_4$2 = ["first"];
const _hoisted_5$2 = {
  key: 3,
  class: "copyRight"
};
const _sfc_main$n = /* @__PURE__ */ defineComponent({
  __name: "ContentHeadline",
  props: {
    headlineHeight: {},
    image: {},
    alt: {},
    copyright: {},
    flip: { type: Boolean },
    first: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        __props.flip ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "contentHeadline",
          style: normalizeStyle("padding:" + __props.headlineHeight / 2 + "rem 0;"),
          first: __props.first
        }, [
          renderSlot(_ctx.$slots, "default", {}, void 0)
        ], 12, _hoisted_1$b)) : createCommentVNode("", true),
        __props.image ? (openBlock(), createElementBlock("image", _hoisted_2$8, [
          createVNode(Throbber),
          createBaseVNode("img", {
            src: __props.image,
            alt: __props.alt,
            onError: _cache[0] || (_cache[0] = ($event) => unref(ShowLoadingError)())
          }, null, 40, _hoisted_3$4)
        ])) : createCommentVNode("", true),
        !__props.flip ? (openBlock(), createElementBlock("div", {
          key: 2,
          class: "contentHeadline",
          style: normalizeStyle("padding:" + __props.headlineHeight / 2 + "rem 0;"),
          first: __props.first
        }, [
          renderSlot(_ctx.$slots, "default", {}, void 0)
        ], 12, _hoisted_4$2)) : createCommentVNode("", true),
        __props.copyright ? (openBlock(), createElementBlock("div", _hoisted_5$2, toDisplayString(__props.copyright), 1)) : createCommentVNode("", true)
      ], 64);
    };
  }
});
const ContentHeadline = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["__scopeId", "data-v-d1de1e5a"]]);
const _hoisted_1$a = ["imageRight", "slim"];
const _hoisted_2$7 = ["src", "alt"];
const _hoisted_3$3 = ["innerHTML"];
const _sfc_main$m = /* @__PURE__ */ defineComponent({
  __name: "ContentImageSidePanel",
  props: {
    image: {},
    alt: {},
    imageRight: { type: Boolean },
    imageWidth: {},
    copyright: {},
    hideButton: { type: Boolean },
    coinType: {},
    slim: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "contentImageSidePanel",
        imageRight: __props.imageRight,
        slim: __props.slim
      }, [
        __props.image ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "imageSideContainer",
          style: normalizeStyle("width: " + ((__props.imageWidth ? __props.imageWidth : 50) - 0.6) + "%;")
        }, [
          createBaseVNode("img", {
            draggable: false,
            src: __props.image,
            alt: __props.alt,
            onError: _cache[0] || (_cache[0] = ($event) => unref(ShowLoadingError)())
          }, null, 40, _hoisted_2$7),
          createVNode(Throbber),
          createVNode(Coin, {
            hidden: __props.hideButton,
            type: __props.coinType,
            delayed: true
          }, {
            default: withCtx(() => [
              renderSlot(_ctx.$slots, "button", {}, void 0, true)
            ]),
            _: 3
          }, 8, ["hidden", "type"]),
          __props.copyright ? (openBlock(), createElementBlock("div", {
            key: 0,
            class: "copyRight",
            innerHTML: __props.copyright
          }, null, 8, _hoisted_3$3)) : createCommentVNode("", true)
        ], 4)) : createCommentVNode("", true),
        createBaseVNode("div", {
          class: "contentSide",
          style: normalizeStyle("width: " + ((__props.imageWidth ? 100 - __props.imageWidth : 50) - 0.6) + "%;")
        }, [
          renderSlot(_ctx.$slots, "content", {}, void 0)
        ], 4)
      ], 8, _hoisted_1$a);
    };
  }
});
const ContentImageSidePanel = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["__scopeId", "data-v-c6d319cd"]]);
const _hoisted_1$9 = { class: "contentLabelArrayLabel" };
const _hoisted_2$6 = ["recenter"];
const _sfc_main$l = /* @__PURE__ */ defineComponent({
  __name: "ContentLabelArray",
  props: {
    label: {},
    gap: {},
    recenter: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", _hoisted_1$9, toDisplayString(__props.label), 1),
        createBaseVNode("div", {
          class: "contentLabelArray",
          style: normalizeStyle("gap: 1.1rem " + __props.gap + "rem;"),
          recenter: __props.recenter
        }, [
          renderSlot(_ctx.$slots, "default", {}, void 0)
        ], 12, _hoisted_2$6)
      ], 64);
    };
  }
});
const ContentLabelArray = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["__scopeId", "data-v-d1dbee1d"]]);
const _hoisted_1$8 = ["hide", "secCol"];
const _hoisted_2$5 = ["alignment", "innerHTML"];
const _sfc_main$k = /* @__PURE__ */ defineComponent({
  __name: "ContentSpacer",
  props: {
    hidden: { type: Boolean },
    top: {},
    bottom: {},
    label: {},
    labelAlign: {},
    fontSize: {},
    secCol: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "contentSpacer",
        style: normalizeStyle("margin-top: " + (__props.top ? __props.top : 0) + "rem; margin-bottom: " + (__props.bottom ? __props.bottom : 0) + "rem;"),
        hide: __props.hidden,
        secCol: __props.secCol
      }, [
        __props.label ? (openBlock(), createElementBlock("div", {
          key: 0,
          class: "contentSpacerText",
          alignment: __props.labelAlign,
          innerHTML: __props.label
        }, null, 8, _hoisted_2$5)) : createCommentVNode("", true)
      ], 12, _hoisted_1$8);
    };
  }
});
const ContentSpacer = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["__scopeId", "data-v-e792d6ef"]]);
const _hoisted_1$7 = { class: "contentPanel" };
const _hoisted_2$4 = { class: "contentPanelInner" };
const _sfc_main$j = /* @__PURE__ */ defineComponent({
  __name: "ContentPanel",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1$7, [
        createBaseVNode("div", _hoisted_2$4, [
          _cache[0] || (_cache[0] = createBaseVNode("div", { class: "contentStartSpacer" }, null, -1)),
          renderSlot(_ctx.$slots, "default", {}, void 0)
        ])
      ]);
    };
  }
});
const ContentPanel = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["__scopeId", "data-v-9a2e37c5"]]);
const _hoisted_1$6 = { class: "mainArea" };
const _hoisted_2$3 = { class: "about" };
const _hoisted_3$2 = ["onClick"];
const _sfc_main$i = /* @__PURE__ */ defineComponent({
  __name: "AboutPanel",
  setup(__props) {
    const age = yearDiff(/* @__PURE__ */ new Date("2002-02-12"));
    function yearDiff(date) {
      const now = /* @__PURE__ */ new Date();
      let diff = now.getFullYear() - date.getFullYear();
      const monthDiff = now.getMonth() - date.getMonth();
      const dayDiff = now.getDate() - date.getDate();
      if (monthDiff < 0 || monthDiff === 0 && dayDiff < 0) diff--;
      return diff;
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(ContentPanel, {
        id: "aboutPanel",
        class: "panel",
        panel: unref(PageType).about
      }, {
        default: withCtx(() => [
          createVNode(ContentSpacer, {
            hidden: true,
            top: 0.5
          }),
          createVNode(ContentHeadline, {
            "headline-height": 3.7,
            first: true
          }, {
            default: withCtx(() => [..._cache[0] || (_cache[0] = [
              createTextVNode(" Über ", -1),
              createBaseVNode("span", null, "Mich", -1)
            ])]),
            _: 1
          }),
          createBaseVNode("div", _hoisted_1$6, [
            _cache[3] || (_cache[3] = createBaseVNode("div", { class: "side" }, [
              createBaseVNode("div", { class: "myImage" }, [
                createBaseVNode("img", {
                  src: "/images/general/Portrait.jpg",
                  alt: "Profilbild",
                  draggable: false
                })
              ]),
              createBaseVNode("div", { class: "list" }, [
                createBaseVNode("h3", null, "Das bin ich:"),
                createTextVNode(" •3D-Artist "),
                createBaseVNode("br"),
                createTextVNode(" •Filmemacher"),
                createBaseVNode("br"),
                createTextVNode(" •Spieleentwickler"),
                createBaseVNode("br")
              ])
            ], -1)),
            createBaseVNode("div", _hoisted_2$3, [
              createBaseVNode("p", null, " Hi! Ich bin Luca Spirka, " + toDisplayString(unref(age)) + " Jahre alt und begeistert für alles was mit Film, 3D und Games zu tun hat! ", 1),
              _cache[1] || (_cache[1] = createBaseVNode("p", null, [
                createTextVNode(" Seit meiner Kindheit liebe ich Filme und Videospiele. Durch ein Praktikum in der Anwendungsentwicklung bei "),
                createBaseVNode("a", {
                  href: "https://www.harzenergie.de/",
                  target: "_blank"
                }, "Harz Energie"),
                createTextVNode(" konnte ich einen Einstieg in die Programmierung finden. Meine technischen und gestalterischen Interessen konnte ich dann im Studiengang Medieninformatik an der "),
                createBaseVNode("a", {
                  href: "https://www.hs-harz.de/",
                  target: "_blank"
                }, "Hochschule Harz"),
                createTextVNode(" vereinen. Dort konnte ich bereits an zahlreichen Projekten mitarbeiten und meine Fähigkeiten in den Bereichen der 3D-Modellierung, Animation, Spieleentwicklung und Filmproduktion ausarbeiten. ")
              ], -1)),
              _cache[2] || (_cache[2] = createBaseVNode("p", null, " Gerne setze ich alles was ich bisher an Erfahrungen in der VFX und Filmproduktion gesammelt habe ein, um neue Projekte voranzubringen und interessante Geschichten zu erzählen. Ich liebe es meine 3D Modelle und Geschichten selbst von Grund auf zu erstellen und bin gerne von Anfang an Teil des kreativen Prozesses. Ich freue mich sehr über die positive Resonanz die meine Projekte bereits erhalten haben und bin sehr gespannt auf alles was noch kommt! ", -1))
            ])
          ]),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 1
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/general/harz_energie.jpg",
            alt: "Hauptgebäude des Standortes Goslar",
            slim: true,
            "image-right": true,
            "image-width": 40
          }, {
            content: withCtx(() => [..._cache[4] || (_cache[4] = [
              createBaseVNode("h3", null, "Praktikum", -1),
              createTextVNode(" Ich habe ein Praktikum als Fachinformatiker für Anwendungs­entwicklung bei Harz Energie Goslar gemacht. ", -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/link.png",
                link: "https://www.harzenergie.de/",
                scale: 0.72,
                title: "Webseite der Harz Energie besuchen"
              })
            ]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 1,
            bottom: 1
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/general/hs_harz.jpg",
            alt: "Rektoratsvilla der Hochschule",
            slim: true,
            "image-right": false,
            "image-width": 40
          }, {
            content: withCtx(() => [..._cache[5] || (_cache[5] = [
              createBaseVNode("h3", null, "Studium", -1),
              createBaseVNode("p", null, " Zurzeit Studiere ich Medieninformatik im Bachelor an der Hochschule Harz in Wernigerode! ", -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/link.png",
                link: "https://www.hs-harz.de/",
                scale: 0.72,
                title: "Webseite der Hochschule Harz besuchen"
              })
            ]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 1,
            bottom: 1
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/general/hobby.jpg",
            alt: "Bild eines Keyboards",
            slim: true,
            "image-right": true,
            "image-width": 40,
            "hide-button": true
          }, {
            content: withCtx(() => [..._cache[6] || (_cache[6] = [
              createBaseVNode("h3", null, "Hobbys", -1),
              createBaseVNode("p", null, " Ich liebe es, mich musikalisch auszuprobieren. In den letzten Jahren habe ich meine Leidenschaft für Synthesizer entdeckt. ", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 1,
            bottom: 1
          }),
          createVNode(ContentImageSidePanel, {
            "hide-button": true,
            image: "/images/general/klappe.PNG",
            alt: "Bild einer Fotokamera",
            slim: true,
            "image-right": false,
            "image-width": 40
          }, {
            content: withCtx(() => [..._cache[7] || (_cache[7] = [
              createBaseVNode("h3", null, "Meine Ziele", -1),
              createBaseVNode("p", null, " Gerne möchte ich mich mehr im Bereich der Filmproduktion ausprobieren und auch in der 3D Animation weitere Kurzfilme erstellen. Ebenso bin ich weiterhin an der Entwicklung kleinerer Spielideen interessiert. ", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 1.5,
            bottom: 1.7
          }),
          createVNode(ContentHeadline, { "headline-height": 5.7 }, {
            default: withCtx(() => [..._cache[8] || (_cache[8] = [
              createTextVNode(" Mein ", -1),
              createBaseVNode("span", null, [
                createTextVNode("Steck"),
                createBaseVNode("wbr"),
                createTextVNode("­brief")
              ], -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 0.5,
            bottom: -1,
            label: "Wo liegen meine <b>Skills?</b>",
            "label-align": "l"
          }),
          createVNode(ContentLabelArray, { gap: 1 }, {
            default: withCtx(() => [
              createVNode(ContentLabelPanel, {
                label: "3D Modellierung",
                type: "skill",
                "invert-surface": false,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "Prozedurale Texturierung",
                type: "skill",
                "invert-surface": false,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "Game Programming",
                type: "skill",
                "invert-surface": false,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "Storytelling",
                type: "skill",
                "invert-surface": false,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "3D Animation",
                type: "skill",
                "invert-surface": false,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "Video Editing",
                type: "skill",
                "invert-surface": false,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "Digitaler Szenenbau",
                type: "skill",
                "invert-surface": false,
                "invert-button-ring": true,
                "disable-button": true
              })
            ]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 4.3,
            bottom: -1,
            label: "Mit welcher <b>Software</b> kann ich gut arbeiten?",
            "label-align": "l"
          }),
          createVNode(ContentLabelArray, {
            gap: 4.4,
            recenter: true
          }, {
            default: withCtx(() => [
              createVNode(ContentLabelPanel, {
                label: "Blender",
                type: "program",
                "invert-surface": true,
                "invert-button-ring": true,
                "disable-button": false
              }, {
                default: withCtx(() => [
                  createVNode(CoinSurface, {
                    image: "/images/software_icons/blender.png",
                    link: "https://www.blender.org/",
                    scale: 0.8,
                    title: "Webseite besuchen"
                  })
                ]),
                _: 1
              }),
              createVNode(ContentLabelPanel, {
                label: "Unreal Engine 5",
                type: "program",
                "invert-surface": true,
                "invert-button-ring": true,
                "disable-button": false
              }, {
                default: withCtx(() => [
                  createVNode(CoinSurface, {
                    image: "/images/software_icons/UE5.png",
                    link: "https://www.unrealengine.com/en-US/unreal-engine-5",
                    scale: 0.86,
                    title: "Webseite besuchen"
                  })
                ]),
                _: 1
              }),
              createVNode(ContentLabelPanel, {
                label: "Davinci Resolve",
                type: "program",
                "invert-surface": true,
                "invert-button-ring": true,
                "disable-button": false
              }, {
                default: withCtx(() => [
                  createVNode(CoinSurface, {
                    image: "/images/software_icons/Davinci.png",
                    link: "https://www.blackmagicdesign.com/de/products/davinciresolve",
                    scale: 0.95,
                    title: "Webseite besuchen"
                  })
                ]),
                _: 1
              }),
              createVNode(ContentLabelPanel, {
                label: "Visual Studio Code",
                type: "program",
                "invert-surface": true,
                "invert-button-ring": true,
                "disable-button": false
              }, {
                default: withCtx(() => [
                  createVNode(CoinSurface, {
                    image: "/images/software_icons/vscode.png",
                    link: "https://code.visualstudio.com/",
                    scale: 0.65,
                    title: "Webseite besuchen"
                  })
                ]),
                _: 1
              }),
              createVNode(ContentLabelPanel, {
                label: "Android Studio",
                type: "program",
                "invert-surface": true,
                "invert-button-ring": true,
                "disable-button": false
              }, {
                default: withCtx(() => [
                  createVNode(CoinSurface, {
                    image: "/images/software_icons/AndroidStudio.png",
                    link: "https://developer.android.com",
                    scale: 0.93,
                    title: "Webseite besuchen"
                  })
                ]),
                _: 1
              }),
              createVNode(ContentLabelPanel, {
                label: "Godot",
                type: "program",
                "invert-surface": true,
                "invert-button-ring": true,
                "disable-button": false
              }, {
                default: withCtx(() => [
                  createVNode(CoinSurface, {
                    image: "/images/software_icons/Godot.png",
                    link: "https://godotengine.org/",
                    scale: 0.81,
                    title: "Webseite besuchen"
                  })
                ]),
                _: 1
              }),
              createVNode(ContentLabelPanel, {
                label: "FL Studio",
                type: "program",
                "invert-surface": true,
                "invert-button-ring": true,
                "disable-button": false
              }, {
                default: withCtx(() => [
                  createVNode(CoinSurface, {
                    image: "/images/software_icons/FLStudio.png",
                    link: "https://www.image-line.com/",
                    scale: 0.7,
                    title: "Webseite besuchen"
                  })
                ]),
                _: 1
              }),
              createVNode(ContentLabelPanel, {
                label: "Adobe InDesign",
                type: "program",
                "invert-surface": true,
                "invert-button-ring": true,
                "disable-button": false
              }, {
                default: withCtx(() => [
                  createVNode(CoinSurface, {
                    image: "/images/software_icons/InDesign.png",
                    link: "https://www.adobe.com/de/products/indesign",
                    scale: 0.63,
                    title: "Webseite besuchen"
                  })
                ]),
                _: 1
              })
            ]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 4.3,
            bottom: -1,
            label: "Mit welchen <b>Programmiersprachen</b> habe ich gearbeitet?",
            "label-align": "l"
          }),
          createVNode(ContentLabelArray, { gap: 1 }, {
            default: withCtx(() => [
              createVNode(ContentLabelPanel, {
                label: "JavaScript",
                type: "plang",
                "invert-surface": false,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "Kotlin",
                type: "plang",
                "invert-surface": false,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "GdScript",
                type: "plang",
                "invert-surface": false,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "C#",
                type: "plang",
                "invert-surface": false,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "Java",
                type: "plang",
                "invert-surface": false,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "Python",
                type: "plang",
                "invert-surface": false,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "Go",
                type: "plang",
                "invert-surface": false,
                "invert-button-ring": true,
                "disable-button": true
              })
            ]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 4.3,
            bottom: -1,
            label: "Mit welchen <b>Techniken</b> und <b>Prozessen</b> habe ich schon gearbeitet?",
            "label-align": "l"
          }),
          createVNode(ContentLabelArray, { gap: 1 }, {
            default: withCtx(() => [
              createVNode(ContentLabelPanel, {
                label: "Motion Capture Prozess",
                type: "exskill",
                "invert-surface": true,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "Dreharbeiten vor Greenscreen",
                type: "exskill",
                "invert-surface": true,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "VFX Pipeline - Verbindung von 3D und Footage",
                type: "exskill",
                "invert-surface": true,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "VFX Pre- und Postproduction im Team",
                type: "exskill",
                "invert-surface": true,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "Storytelling in der 3D Animation und Film",
                type: "exskill",
                "invert-surface": true,
                "true-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "Film Pre- und Postproduction",
                type: "exskill",
                "invert-surface": true,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "Filmschnitt",
                type: "exskill",
                "invert-surface": true,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "Beleuchtung & Inszenierung digitaler Szenenbilder",
                type: "exskill",
                "invert-surface": true,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "Arbeiten mit VDB & Simulationen",
                type: "exskill",
                "invert-surface": true,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "Spiele­entwicklung für PC und Smartphone",
                type: "exskill",
                "invert-surface": true,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "Web Development mit <a href='https://vuejs.org/' target='_blank'>Vue</a> (z.B. diese Webseite)",
                type: "exskill",
                "invert-surface": true,
                "invert-button-ring": true,
                "disable-button": true
              }),
              createVNode(ContentLabelPanel, {
                label: "Game Development mit <a href='https://www.unrealengine.com/en-US/unreal-engine-5' target='_blank'>Unreal Engine</a>, <a href='https://unity.com/de' target='_blank'>Unity</a> und <a href='https://godotengine.org/' target='_blank'>Godot</a>",
                type: "exskill",
                "invert-surface": true,
                "invert-button-ring": true,
                "disable-button": true
              })
            ]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 1.85,
            bottom: 1.7
          }),
          createVNode(ContentHeadline, { "headline-height": 5.7 }, {
            default: withCtx(() => [..._cache[9] || (_cache[9] = [
              createTextVNode(" Neueste ", -1),
              createBaseVNode("span", null, "Projekte", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/threed/dune/harvester_long.jpg",
            alt: "Render, 3D Modells eines Spice Harvesters",
            "image-right": true,
            "image-width": 40,
            "coin-type": unref(PageType).p_dune
          }, {
            content: withCtx(() => [..._cache[10] || (_cache[10] = [
              createBaseVNode("h3", { style: { "text-align": "left" } }, "DUNE - Nacht auf Arrakis", -1),
              createBaseVNode("p", null, [
                createTextVNode(" Eine Reihe an animierten 3D Modellen, welche den Designs der Filme "),
                createBaseVNode("a", {
                  href: "https://de.wikipedia.org/wiki/Dune_(2021)",
                  target: "_blank"
                }, "Dune"),
                createTextVNode(" (2021) und "),
                createBaseVNode("a", {
                  href: "https://de.wikipedia.org/wiki/Dune:_Part_Two",
                  target: "_blank"
                }, "Dune Part Two"),
                createTextVNode(" (2024) nachempfunden sind."),
                createBaseVNode("br")
              ], -1),
              createBaseVNode("p", null, [
                createTextVNode(" Es sind die detailliertesten und komplexesten Modelle die ich bisher erstellt habe."),
                createBaseVNode("b"),
                createTextVNode(" In diesem fortlaufenden Projekt konnte ich bisher meine Fähigkeiten in der Modellierung und prozeduralen Texturierung neu ausrichten und professioneller gestalten. ")
              ], -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/eye.png",
                onClick: () => unref(OpenPage)(unref(PageType).threed, false, "dune"),
                scale: 0.8,
                title: "Dieses Projekt ansehen"
              }, null, 8, ["onClick"])
            ]),
            _: 1
          }, 8, ["coin-type"]),
          createVNode(ContentSpacer, {
            top: 3,
            bottom: 0.3,
            hidden: true
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/games/payback/PP3.jpg",
            alt: "Screenshot aus dem Spiel",
            "image-right": false,
            "image-width": 40,
            "coin-type": unref(PageType).p_ludum
          }, {
            content: withCtx(() => [..._cache[11] || (_cache[11] = [
              createBaseVNode("h3", null, "Payback Pit", -1),
              createBaseVNode("p", null, [
                createTextVNode(" Das Ergebnis meines insgesamt zweiten Game Jams für den 57. "),
                createBaseVNode("a", {
                  href: "https://ldjam.com/",
                  target: "_blank"
                }, "Ludum Dare"),
                createTextVNode(". ")
              ], -1),
              createBaseVNode("p", null, [
                createTextVNode(" In einem Team aus 4 Personen haben wir über 3 Tage hinweg ein ganzes Spiel entwickelt."),
                createBaseVNode("br"),
                createTextVNode(" Sammele Erze und mache Gewinn, um dich gegen die fiesen Gegner aus der Unterwelt zu wehren!"),
                createBaseVNode("br")
              ], -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/eye.png",
                onClick: () => unref(OpenPage)(unref(PageType).games, false, "ludum"),
                scale: 0.8,
                title: "Dieses Projekt ansehen"
              }, null, 8, ["onClick"])
            ]),
            _: 1
          }, 8, ["coin-type"]),
          createVNode(ContentSpacer, {
            top: 1,
            bottom: 0.3,
            hidden: true
          }),
          createVNode(ContentSpacer, {
            hidden: true,
            bottom: 1
          }),
          createBaseVNode("div", {
            class: "all",
            onClick: () => unref(OpenPage)(unref(PageType).p_all, false),
            title: "Weitere Projekte ansehen"
          }, [..._cache[12] || (_cache[12] = [
            createBaseVNode("span", null, "Weitere Projekte", -1),
            createTextVNode(" ➝", -1)
          ])], 8, _hoisted_3$2),
          createVNode(ContentSpacer, {
            top: 4,
            bottom: 0.5
          }),
          _cache[13] || (_cache[13] = createBaseVNode("h3", { style: { "color": "var(--textSecCol)", "font-family": "'Courier New'", "line-height": "1.6rem", "font-size": "1.25rem", "text-align": "justify" } }, [
            createTextVNode(" Interesse geweckt? Weitere Projekte sind unter den jeweiligen Reitern im Menü zu finden! Ich freue mich stets wenn Interesse an einer Zusammenarbeit besteht! "),
            createBaseVNode("br"),
            createBaseVNode("br"),
            createBaseVNode("br"),
            createTextVNode(" Wenn es Probleme oder Anmerkungen zu dieser Webseite gibt, gerne eine Nachricht an "),
            createBaseVNode("a", { href: "mailto:lucaspirka+feedback@gmail.com" }, "lucaspirka+feedback@gmail.com"),
            createTextVNode(" schreiben! ")
          ], -1)),
          createVNode(ContentSpacer, {
            top: 0.5,
            bottom: 0
          }),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 2
          })
        ]),
        _: 1
      }, 8, ["panel"]);
    };
  }
});
const AboutPanel = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["__scopeId", "data-v-209a54a8"]]);
const _hoisted_1$5 = ["full", "on"];
const _hoisted_2$2 = ["title"];
const _sfc_main$h = /* @__PURE__ */ defineComponent({
  __name: "FullscreenToggle",
  props: {
    fElem: {}
  },
  setup(__props) {
    let props = __props;
    let lastmove = /* @__PURE__ */ new Date();
    let on = /* @__PURE__ */ ref(false);
    setInterval(() => {
      var _a;
      if (on && Math.abs(lastmove.getSeconds() - (/* @__PURE__ */ new Date()).getSeconds()) > 1) {
        (_a = props.fElem) == null ? void 0 : _a.setAttribute("mousemove", "false");
        on.value = false;
      }
    }, 1e3);
    function mousemove() {
      lastmove = /* @__PURE__ */ new Date();
      on.value = true;
    }
    const hasFullscreen = /* @__PURE__ */ ref(false);
    function toggle() {
      if (hasFullscreen.value) {
        if (document.fullscreenElement) {
          document.exitFullscreen();
          hasFullscreen.value = false;
        }
      } else {
        if (!props.fElem) return;
        props.fElem.requestFullscreen();
        hasFullscreen.value = true;
      }
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock(Fragment, null, [
        createBaseVNode("div", {
          class: "fullscreenBtn",
          onClick: _cache[0] || (_cache[0] = ($event) => toggle()),
          full: hasFullscreen.value,
          on: unref(on)
        }, [
          createBaseVNode("div", {
            class: "btn",
            title: !hasFullscreen.value ? "Vergrößern" : "Verkleinern"
          }, [
            !hasFullscreen.value ? (openBlock(), createBlock(CoinSurface, {
              key: 0,
              class: "image",
              image: "/images/icons/maximize.webp",
              scale: 0.62,
              "use-mask": true
            })) : createCommentVNode("", true),
            hasFullscreen.value ? (openBlock(), createBlock(CoinSurface, {
              key: 1,
              class: "image",
              image: "/images/icons/minimize.png",
              scale: 0.62,
              "use-mask": true
            })) : createCommentVNode("", true)
          ], 8, _hoisted_2$2)
        ], 8, _hoisted_1$5),
        createBaseVNode("div", {
          class: "hoverArea",
          onMousemove: _cache[1] || (_cache[1] = ($event) => mousemove())
        }, null, 32)
      ], 64);
    };
  }
});
const FullscreenToggle = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["__scopeId", "data-v-bff22117"]]);
const _hoisted_1$4 = ["flipped", "flip-toggle"];
const _hoisted_2$1 = {
  key: 0,
  class: "label"
};
const _hoisted_3$1 = { class: "imgContainer" };
const _hoisted_4$1 = ["src", "alt"];
const _hoisted_5$1 = ["innerHTML"];
const _hoisted_6 = ["innerHTML"];
const _sfc_main$g = /* @__PURE__ */ defineComponent({
  __name: "ContentImage",
  props: {
    image: {},
    alt: {},
    label: {},
    pad: {},
    copyright: {},
    contained: { type: Boolean },
    inSlider: { type: Boolean },
    flipped: { type: Boolean },
    flipToggle: { type: Boolean }
  },
  setup(__props) {
    let fElem = /* @__PURE__ */ ref(void 0);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        class: "contentImage",
        flipped: __props.flipped,
        ref_key: "fElem",
        ref: fElem,
        "flip-toggle": __props.flipToggle
      }, [
        _cache[1] || (_cache[1] = createBaseVNode("div", { class: "hider" }, null, -1)),
        __props.label && __props.flipped ? (openBlock(), createElementBlock("div", _hoisted_2$1, toDisplayString(__props.label), 1)) : createCommentVNode("", true),
        createBaseVNode("div", _hoisted_3$1, [
          createBaseVNode("img", {
            loading: "lazy",
            draggable: "false",
            src: __props.image,
            style: normalizeStyle(__props.pad ? "padding-top: " + __props.pad + "rem; padding-bottom: " + __props.pad + "rem;" : ""),
            alt: __props.alt,
            onError: _cache[0] || (_cache[0] = ($event) => unref(ShowLoadingError)())
          }, null, 44, _hoisted_4$1),
          !__props.inSlider ? (openBlock(), createBlock(FullscreenToggle, {
            key: 0,
            "f-elem": unref(fElem)
          }, null, 8, ["f-elem"])) : createCommentVNode("", true),
          createVNode(Throbber),
          __props.copyright ? (openBlock(), createElementBlock("div", {
            key: 1,
            class: "copyRight",
            innerHTML: __props.copyright
          }, null, 8, _hoisted_5$1)) : createCommentVNode("", true)
        ]),
        __props.label && !__props.flipped ? (openBlock(), createElementBlock("div", {
          key: 1,
          class: "label",
          innerHTML: __props.label
        }, null, 8, _hoisted_6)) : createCommentVNode("", true),
        renderSlot(_ctx.$slots, "default", {}, void 0)
      ], 8, _hoisted_1$4);
    };
  }
});
const ContentImage = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-1512c240"]]);
const _hoisted_1$3 = { class: "innerImageContainer" };
const _sfc_main$f = /* @__PURE__ */ defineComponent({
  __name: "ContentImageSlider",
  props: {
    images: {},
    flipButtons: { type: Boolean }
  },
  setup(__props) {
    let props = __props;
    const index = /* @__PURE__ */ ref(0);
    const outerImage = /* @__PURE__ */ ref(void 0);
    const outerIndex = /* @__PURE__ */ ref(-1);
    const innerImages = /* @__PURE__ */ ref([]);
    onMounted(() => {
      let idx = props.images.findIndex((e) => e.isOuter);
      if (idx != -1) {
        outerImage.value = props.images[idx];
        outerIndex.value = idx;
        let inner = [];
        props.images.forEach((e, i) => {
          e.forceIndex = i;
          if (i != idx) inner.push(e);
        });
        innerImages.value = inner;
      }
    });
    return (_ctx, _cache) => {
      return outerImage.value ? (openBlock(), createBlock(ContentImage, {
        key: 0,
        image: outerImage.value.url,
        alt: outerImage.value.alt,
        label: outerImage.value.label,
        visible: index.value == outerIndex.value,
        copyright: outerImage.value.copyright,
        flipped: true,
        "flip-toggle": __props.flipButtons
      }, {
        default: withCtx(() => [
          createBaseVNode("div", _hoisted_1$3, [
            (openBlock(true), createElementBlock(Fragment, null, renderList(innerImages.value, (image) => {
              return openBlock(), createBlock(ContentImage, {
                image: image.url,
                alt: image.alt,
                label: image.label,
                visible: index.value == image.forceIndex,
                "in-slider": true,
                copyright: image.copyright,
                flipped: true
              }, null, 8, ["image", "alt", "label", "visible", "copyright"]);
            }), 256))
          ]),
          createVNode(Coin, {
            onClick: _cache[0] || (_cache[0] = ($event) => {
              --index.value;
              index.value = index.value < 0 ? unref(props).images.length + index.value : index.value;
            }),
            flip: !__props.flipButtons
          }, {
            default: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/right_arrow.png",
                scale: 0.75,
                "use-mask": true,
                style: { "transform": "rotate(180deg)" }
              })
            ]),
            _: 1
          }, 8, ["flip"]),
          createVNode(Coin, {
            onClick: _cache[1] || (_cache[1] = ($event) => {
              ++index.value;
              index.value = index.value % unref(props).images.length;
            }),
            flip: !__props.flipButtons,
            right: "true"
          }, {
            default: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/right_arrow.png",
                scale: 0.75,
                "use-mask": true
              })
            ]),
            _: 1
          }, 8, ["flip"])
        ]),
        _: 1
      }, 8, ["image", "alt", "label", "visible", "copyright", "flip-toggle"])) : createCommentVNode("", true);
    };
  }
});
const ContentImageSlider = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-671b9fad"]]);
const _sfc_main$e = /* @__PURE__ */ defineComponent({
  __name: "FilmPanel",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(ContentPanel, {
        id: "filmPanel",
        class: "panel",
        panel: unref(PageType).film
      }, {
        default: withCtx(() => [
          createVNode(ContentSpacer, {
            hidden: true,
            top: 0.5
          }),
          createVNode(ContentHeadline, {
            "headline-height": 3.7,
            image: "/images/film/kurios/Bahn.jpg",
            alt: "3D Seznerie eines Bahnhofs",
            flip: true,
            first: true
          }, {
            default: withCtx(() => [..._cache[0] || (_cache[0] = [
              createTextVNode(" Film ", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 2,
            bottom: 0.5
          }),
          _cache[4] || (_cache[4] = createBaseVNode("h3", { style: { "color": "var(--textSecCol)", "font-family": "'Courier New'", "line-height": "1.6rem", "font-size": "1.25rem", "text-align": "justify" } }, ' Im Rahmen meines Studiums konnte ich bereits Erfahrungen mit dem Schreiben und Drehen von Filmen machen. Daraus entstanden ist unter anderem der preisgekrönte Film "Der Kuriositär". ', -1)),
          createVNode(ContentSpacer, {
            top: 0.5,
            bottom: 1.7
          }),
          _cache[5] || (_cache[5] = createBaseVNode("div", { id: "kurios" }, null, -1)),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            image: "/images/film/kurios/Example_Kuriositär.jpg",
            alt: "Holzhütte auf einem Hügel, 3D Szenerie",
            flip: true
          }, {
            default: withCtx(() => [..._cache[1] || (_cache[1] = [
              createTextVNode(" Der ", -1),
              createBaseVNode("span", null, "Kuriositär", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 1,
            bottom: 3
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/film/kurios/Der_Kuriositaer_Image.jpg",
            alt: "Bild der drei Hauptdarsteller aus dem Kurzfilm",
            "image-right": true,
            "image-width": 42
          }, {
            content: withCtx(() => [..._cache[2] || (_cache[2] = [
              createBaseVNode("h3", null, "Kuriose Geschichten", -1),
              createBaseVNode("p", null, [
                createTextVNode(" Ich liebe Filme schon seit ich ein Kind war. Deshalb wollte ich unbedingt einmal einen eigenen Kurzfilm drehen."),
                createBaseVNode("br"),
                createTextVNode(" Im zweiten Semester kam dann die Gelegenheit an der Hochschule mit gutem Equipment und einem Team von 4 Leuten einen Kurzfilm zu drehen."),
                createBaseVNode("br"),
                createTextVNode(" Mein Film war einer von 3 Filmen die wir als Team gedreht haben. Ich habe mich von Anfang an dahinter gesetzt, ein interessantes und stimmiges Skript zu schreiben."),
                createBaseVNode("br")
              ], -1),
              createBaseVNode("p", null, [
                createTextVNode(" Für diesen Kurzfilm habe ich außerdem die Musik komponiert, das Sounddesign gemacht, alle 3D Render erstellt und den Videoschnitt in "),
                createBaseVNode("a", {
                  href: "https://www.blackmagicdesign.com/de/products/davinciresolve",
                  target: "_blank"
                }, "Davinci Resolve"),
                createTextVNode(" vorgenommen. ")
              ], -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/play.png",
                link: "https://www.youtube.com/watch?v=-TSbpB1tkB8&source_ve_path=MTc4NDI0",
                scale: 1,
                "use-mask": true,
                title: "Kurzfilm auf YouTube schauen"
              })
            ]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/film/kurios/Award.jpg",
            alt: "Bild nach der Preisverleihung mit dem Preis in der Hand",
            "image-width": 52,
            "coin-type": unref(PageType).p_kurios
          }, {
            content: withCtx(() => [..._cache[3] || (_cache[3] = [
              createBaseVNode("h3", { style: { "text-align": "left" } }, "Jugendfilm­preis Sachsen-Anhalt", -1),
              createBaseVNode("p", null, [
                createTextVNode(" Ich war begeistert vom positiven Feedback, welches ich für meinen Film erhalten hatte. "),
                createBaseVNode("br"),
                createTextVNode(" Darum habe ich mich entschieden ihn beim Jugendfilmpreis Sachsen-Anhalt 2022 einzureichen. Ich habe mich sehr gefreut, als mein Film unter die finalen Kandidaten gekommen ist. "),
                createBaseVNode("br"),
                createTextVNode(" Ich hätte niemals damit gerechnet, mit meinem ersten Kurzfilm direkt einen Preis zu erhalten und habe mich sehr über unseren 1. Platz gefreut! ")
              ], -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/read.png",
                onClick: () => unref(OpenPage)(unref(PageType).p_kurios),
                scale: 0.8,
                "use-mask": true,
                title: "Mehr über dieses Projekt erfahren"
              }, null, 8, ["onClick"])
            ]),
            _: 1
          }, 8, ["coin-type"]),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 3
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/film/kurios/lamp.jpg", label: "Der Film spielt mit engen Seitenverhältnissen, um Beenung und Spannung aufzubauen", alt: "Hauptdarsteller schaut uns an, entsättigtes Bild in 4:3", isOuter: true },
              { url: "/images/film/kurios/Szenerie.jpg", label: "Wohnung des Autoren - 3D Szenerie in Blender", alt: "Digitale Szene einer Stadt, durch ein Fenster vor uns sehen wir den echten Darsteller in der Wohnung 'sitzen'" },
              { url: "/images/film/kurios/Beide.jpg", alt: "Sebastian Siebert und ich stehen im Film nebeneinander und schauen in die Kamera" },
              { url: "/images/film/kurios/Erklärung.jpg", alt: "Eine Waffe wird über einer 'Insolvenzerklärung' auf jemand anderen gehalten" },
              { url: "/images/film/kurios/Pflanze.jpg", label: "Color Grading erfolgte in Davinci Resolve", alt: "Der Hauptdarsteller sitzt mit einer Topfpflanze im Arm an einem Tisch" }
            ],
            "flip-buttons": true
          }),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 3
          })
        ]),
        _: 1
      }, 8, ["panel"]);
    };
  }
});
const _sfc_main$d = /* @__PURE__ */ defineComponent({
  __name: "GamesPanel",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(ContentPanel, {
        id: "gamesPanel",
        class: "panel",
        panel: unref(PageType).games
      }, {
        default: withCtx(() => [
          createVNode(ContentSpacer, {
            hidden: true,
            top: 0.5
          }),
          createVNode(ContentHeadline, {
            "headline-height": 3.7,
            image: "/images/games/payback/PP1.jpg",
            alt: "Screenshot aus dem Spiel 'Payback Pit'",
            flip: true,
            first: true
          }, {
            default: withCtx(() => [..._cache[0] || (_cache[0] = [
              createTextVNode(" Games & ", -1),
              createBaseVNode("span", null, "Apps", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 2,
            bottom: 0.5
          }),
          _cache[8] || (_cache[8] = createBaseVNode("h3", { style: { "color": "var(--textSecCol)", "font-family": "'Courier New'", "line-height": "1.6rem", "font-size": "1.25rem", "text-align": "justify" } }, [
            createTextVNode(" Ich konnte in Game Jams schon einige Erfahrungen mit der Programmierung und Gestaltung von Spielen sammeln und tüftele in meiner Freizeit auch gern selber an kleinen Ideen!"),
            createBaseVNode("br"),
            createBaseVNode("br"),
            createTextVNode(" Hauptsächlich bin ich mit der "),
            createBaseVNode("a", {
              href: "https://www.unrealengine.com/en-US/unreal-engine-5",
              target: "_blank"
            }, "Unreal Engine 5"),
            createTextVNode(", seit neuestem aber auch mit "),
            createBaseVNode("a", {
              href: "https://godotengine.org/",
              target: "_blank"
            }, "Godot"),
            createTextVNode(" vertraut. ")
          ], -1)),
          createVNode(ContentSpacer, {
            top: 0.5,
            bottom: 1.7
          }),
          _cache[9] || (_cache[9] = createBaseVNode("div", { id: "ludum" }, null, -1)),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            image: "/images/games/payback/PP2.jpg",
            alt: "Screenshot aus 'Payback Pit', Höhlenszenerie",
            flip: true
          }, {
            default: withCtx(() => [..._cache[1] || (_cache[1] = [
              createTextVNode(" Payback ", -1),
              createBaseVNode("span", null, "Pit", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 1,
            bottom: 3
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/games/payback/PP3.jpg",
            alt: "Screenshot aus dem Spiel",
            "image-right": true,
            "image-width": 40,
            "coin-type": unref(PageType).p_ludum
          }, {
            content: withCtx(() => [..._cache[2] || (_cache[2] = [
              createBaseVNode("h3", null, "Payback Pit", -1),
              createBaseVNode("p", null, [
                createBaseVNode("b", null, "Payback Pit"),
                createTextVNode(" ist das Ergebnis unseres 4-Köpfigen Teams im 57. "),
                createBaseVNode("a", {
                  href: "https://ldjam.com/",
                  target: "_blank"
                }, "Ludum Dare"),
                createTextVNode(". Im Rahmen dieses Jams habe ich sowohl Assets für das Spiel erstellt, als auch an der Programmierung von Features gearbeitet."),
                createBaseVNode("br"),
                createTextVNode(" Das finale Spiel hat fast alle Features die wir geplant hatten und war auf den meisten Geräten reibungslos spielbar."),
                createBaseVNode("br")
              ], -1),
              createBaseVNode("p", null, [
                createTextVNode(" In "),
                createBaseVNode("a", {
                  href: "https://ldjam.com/events/ludum-dare/57/payback-pit",
                  target: "_blank"
                }, "Payback Pit"),
                createTextVNode(" benutzen wir eine Seilwinde um wertvolle Erze aus dem Boden eines Tiefen Loches zu holen."),
                createBaseVNode("br"),
                createTextVNode(" Danach verkaufen wir diese Erze und kaufen uns verschiedenste Upgrades, um unsere Einnahmen zu erhöhen und uns besser gegen immer schwieriger werdene Gegner zu wehren."),
                createBaseVNode("br"),
                createTextVNode(" Ich bin sehr zufrieden mit unserer Teamarbeit und habe sehr viel Spaß am finalen Spiel! ")
              ], -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/read.png",
                onClick: () => unref(OpenPage)(unref(PageType).p_ludum),
                scale: 0.8,
                "use-mask": true,
                title: "Mehr über dieses Projekt erfahren"
              }, null, 8, ["onClick"])
            ]),
            _: 1
          }, 8, ["coin-type"]),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 3
          }),
          createVNode(ContentImage, {
            image: "/images/games/payback/PP4.jpg",
            alt: "Screenshot aus dem Spiel, benutzbare Seilwinde im Spiel",
            label: "Seilwinde, Modellierung in Blender, angepasst für eine reibungslose Integration in Unreal Engine",
            flipped: true
          }),
          createVNode(ContentSpacer, {
            top: 1.5,
            bottom: 1.7
          }),
          _cache[10] || (_cache[10] = createBaseVNode("div", { id: "lgnd" }, null, -1)),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            image: "/images/games/lgnd/Legend_Screens.png",
            alt: "Screenshot eines Android Kartenspiels",
            flip: true
          }, {
            default: withCtx(() => [..._cache[3] || (_cache[3] = [
              createTextVNode(" LGND ", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 1,
            bottom: 3
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/games/lgnd/Legend_Screens6.png",
            alt: "Screenshot aus dem Projektdesign",
            "image-right": false,
            "image-width": 40,
            minHeight: 50,
            "coin-type": unref(PageType).p_lgnd
          }, {
            content: withCtx(() => [..._cache[4] || (_cache[4] = [
              createBaseVNode("h3", null, "Android Programmierung", -1),
              createBaseVNode("p", null, [
                createBaseVNode("b", null, "LGND"),
                createTextVNode(" ist der Name des Spiels welches ich für Android-Geräte im Rahmen des Studiums entwickelt habe."),
                createBaseVNode("br"),
                createTextVNode(" Das Spiel basiert auf einer Kindheitsidee die ich schon lange versucht habe in die digitale Welt zu übertragen. "),
                createBaseVNode("br"),
                createTextVNode(" Das originale Konzept habe ich für ein Deck an Karten und einige Würfel entwickelt. Die Herausforderung, dieses Konzept auf ein Spiel zu übertragen, welches problemlos auf Smartphones läuft, hat mir gefallen. ")
              ], -1),
              createBaseVNode("p", null, [
                createTextVNode(" Die Entwicklung des Spiels erfolgte mittels "),
                createBaseVNode("a", {
                  href: "https://developer.android.com/studio?hl=de",
                  target: "_blank"
                }, "Android Studio"),
                createTextVNode(" und "),
                createBaseVNode("a", {
                  href: "https://developer.android.com/compose",
                  target: "_blank"
                }, "Jetpack Compose"),
                createTextVNode(". ")
              ], -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/read.png",
                onClick: () => unref(OpenPage)(unref(PageType).p_lgnd),
                scale: 0.8,
                "use-mask": true,
                title: "Mehr über dieses Projekt erfahren"
              }, null, 8, ["onClick"])
            ]),
            _: 1
          }, 8, ["coin-type"]),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 3
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/games/lgnd/Legend_Screens.png",
            alt: "Layout der App",
            "image-width": 52,
            "hide-button": true,
            minHeight: 50
          }, {
            content: withCtx(() => [..._cache[5] || (_cache[5] = [
              createBaseVNode("h3", null, "Design und Gameplay", -1),
              createBaseVNode("p", null, [
                createTextVNode(" Es war nicht ganz leicht, das Design für ein Hochkant-Format zu entwerfen, allerdings haben die meisten Teile ab einem gewissen Punkt einfach zusammengepasst. "),
                createBaseVNode("br"),
                createTextVNode(" Ich habe das Layout zunächst in InDesign ausgearbeitet, danach habe ich es in Android Studio so genau wie möglich nachgebaut."),
                createBaseVNode("br")
              ], -1),
              createBaseVNode("p", null, [
                createTextVNode(" Das Spiel verbindet die eigens erstellten Visuals mit der Spiellogik mittels einer Datenbank, welche die Übersicht über alle Karten, Würfel, Effekte, Werte und Positionen hat. "),
                createBaseVNode("br"),
                createTextVNode(" Das übersetzen der Daten in eine korrekte visuelle Darstellung hat sich als herausfordernd herausgestellt."),
                createBaseVNode("br"),
                createTextVNode(" Ich freue mich das das Spiel nun auch in digitaler Version für mich spielbar ist, auch wenn es noch einige Bugs und fehlende Features gibt. ")
              ], -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 1.5,
            bottom: 1.7
          }),
          _cache[11] || (_cache[11] = createBaseVNode("div", { id: "ggj" }, null, -1)),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            image: "/images/games/bubblr/bubblr4.png",
            alt: "Screenshot aus dem Spiel 'Bubblr', Zeitung vor einem Computerbildschirm",
            flip: true
          }, {
            default: withCtx(() => [..._cache[6] || (_cache[6] = [
              createTextVNode(" Bubblr ", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 1,
            bottom: 3
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/games/bubblr/bubblr.png",
            alt: "Screenshot aus dem Spiel",
            "image-right": true,
            "image-width": 40,
            "coin-type": unref(PageType).p_ggj
          }, {
            content: withCtx(() => [..._cache[7] || (_cache[7] = [
              createBaseVNode("h3", null, "Global Game Jam", -1),
              createBaseVNode("p", null, [
                createTextVNode(" Der Global "),
                createBaseVNode("a", {
                  href: "https://globalgamejam.org/",
                  target: "_blank"
                }, "Game Jam"),
                createTextVNode(" 2025 war der erste Game Jam an dem ich teilgenommen habe. "),
                createBaseVNode("b", null, "Bubblr"),
                createTextVNode(" ist unser fertiges Spiel für den Jam gewesen."),
                createBaseVNode("br"),
                createTextVNode(" In einem Team aus 6 Leuten war ich unter anderem an der Konzipierung, dem Audio und Sounddesign, sowie an der Umsetzung einiger Features in Unity beteiligt. Dazu kommen noch einige 3D Assets, sowie die Erstellung des Hintergrundbildes auf dem Desktop. ")
              ], -1),
              createBaseVNode("p", null, [
                createTextVNode(" In "),
                createBaseVNode("b", null, "Bubblr"),
                createTextVNode(" sind wir Angestellter eines Social-Media Unternehmens und müssen Posts der User nach den Vorgaben unseres Chefs filtern. "),
                createBaseVNode("br"),
                createBaseVNode("b", null, "Bubblr"),
                createTextVNode(" ist im Prinzip unsere Kritik an großen Social-Media Unternehmen, deren mangelhaftem Content Management und an deren Betreiber. ")
              ], -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/link.png",
                link: "https://globalgamejam.org/games/2025/algorithm-5",
                scale: 0.8,
                "use-mask": true,
                title: "Spielseite beim Global Game Jam"
              })
            ]),
            _: 1
          }, 8, ["coin-type"]),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 3
          })
        ]),
        _: 1
      }, 8, ["panel"]);
    };
  }
});
const _hoisted_1$2 = { class: "lastUpdated" };
const _sfc_main$c = /* @__PURE__ */ defineComponent({
  __name: "ImpressumPanel",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(ContentPanel, {
        id: "impressumPanel",
        class: "panel",
        panel: unref(PageType).impressum
      }, {
        default: withCtx(() => [
          _cache[0] || (_cache[0] = createBaseVNode("h1", null, "Impressum", -1)),
          _cache[1] || (_cache[1] = createBaseVNode("h2", null, "Angaben gemäß § 5 TMG", -1)),
          _cache[2] || (_cache[2] = createBaseVNode("p", null, [
            createTextVNode(" Luca Joel Spirka"),
            createBaseVNode("br"),
            createTextVNode(" Ringstraße 33"),
            createBaseVNode("br"),
            createTextVNode(" 38855 Wernigerode"),
            createBaseVNode("br"),
            createTextVNode(" Deutschland ")
          ], -1)),
          _cache[3] || (_cache[3] = createBaseVNode("h2", null, "Kontakt", -1)),
          _cache[4] || (_cache[4] = createBaseVNode("p", null, " E-Mail: lucaspirka@gmail.com ", -1)),
          _cache[5] || (_cache[5] = createBaseVNode("h2", null, "Haftung für Inhalte", -1)),
          _cache[6] || (_cache[6] = createBaseVNode("p", null, " Als Diensteanbieter bin ich gemäß § 7 Abs.1 TMG für eigene Inhalte auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach §§ 8 bis 10 TMG bin ich als Diensteanbieter jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. ", -1)),
          _cache[7] || (_cache[7] = createBaseVNode("h2", null, "Haftung für Links", -1)),
          _cache[8] || (_cache[8] = createBaseVNode("p", null, " Mein Angebot enthält Links zu externen Websites Dritter, auf deren Inhalte ich keinen Einfluss habe. Deshalb kann ich für diese fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der Seiten verantwortlich. ", -1)),
          _cache[9] || (_cache[9] = createBaseVNode("h2", null, "Urheberrecht", -1)),
          _cache[10] || (_cache[10] = createBaseVNode("p", null, " Die durch den Seitenbetreiber erstellten Inhalte und Werke auf diesen Seiten unterliegen dem deutschen Urheberrecht. Beiträge Dritter sind als solche gekennzeichnet. ", -1)),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 1
          }),
          createBaseVNode("div", _hoisted_1$2, "Letzte Aktualisierung der Webseite am: " + toDisplayString(unref(LastUpdate).toLocaleDateString()), 1),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 0.4
          })
        ]),
        _: 1
      }, 8, ["panel"]);
    };
  }
});
const ImpressumPanel = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-5e827224"]]);
const _sfc_main$b = /* @__PURE__ */ defineComponent({
  __name: "ThreedPanel",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(ContentPanel, {
        id: "threedPanel",
        class: "panel",
        panel: unref(PageType).threed
      }, {
        default: withCtx(() => [
          createVNode(ContentSpacer, {
            hidden: true,
            top: 0.5
          }),
          createVNode(ContentHeadline, {
            "headline-height": 3.7,
            image: "/images/threed/son/son.jpg",
            alt: "Verlassenes Haus im Wald, 3D Szenerie",
            flip: true,
            first: true
          }, {
            default: withCtx(() => [..._cache[0] || (_cache[0] = [
              createTextVNode(" 3D & ", -1),
              createBaseVNode("span", null, "Animation", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 2,
            bottom: 0.5
          }),
          _cache[13] || (_cache[13] = createBaseVNode("h3", { style: { "color": "var(--textSecCol)", "font-family": "'Courier New'", "line-height": "1.6rem", "font-size": "1.25rem", "text-align": "justify" } }, " Verschiedene Projekte aus der 3D Modellierung und 3D Animation mit Fokus auf qualitativ hochwertige und detaillierte Assets, sowie einen prozeduralen Ansatz in Bereichen der Texturierung und der Animation.", -1)),
          createVNode(ContentSpacer, {
            top: 0.5,
            bottom: 1.7
          }),
          _cache[14] || (_cache[14] = createBaseVNode("div", { id: "isdl" }, null, -1)),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            image: "/images/threed/isdl/isdl6.jpg",
            alt: "Fall von einem Gebäude, 3D Szenerie angepasst auf reale Footage",
            flip: true
          }, {
            default: withCtx(() => [..._cache[1] || (_cache[1] = [
              createTextVNode(" Im Schatten ", -1),
              createBaseVNode("span", null, "des Lichts", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 1,
            bottom: 3
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/threed/isdl/isdl.jpg",
            alt: "3D-Modellierte Stadtszenerie in einer dystopischen Zukunft",
            "image-right": true,
            "image-width": 40
          }, {
            content: withCtx(() => [..._cache[2] || (_cache[2] = [
              createBaseVNode("h3", null, "Im Schatten des Lichts", -1),
              createBaseVNode("p", null, [
                createBaseVNode("b", null, "Im Schatten des Lichts"),
                createTextVNode(' ist ein kurzer Trailer für einen fiktiven Film. Der Trailer wurde im Rahmen des Moduls "Keying" an der Hochschule Harz produziert.'),
                createBaseVNode("br"),
                createTextVNode(" Es konnte mit hochwertigen Kameras, ausgiebiger Lichttechnik und neuester Software gearbeitet werden."),
                createBaseVNode("br"),
                createTextVNode(" Im Rahmen des Projektes konnte ich viel über die Arbeit im Team und den Umgang mit Greenscreen-Technik erlernen. ")
              ], -1),
              createBaseVNode("p", null, " Als Teil eines 3-Köpfigen VFX Teams war ich hauptsächlich an der Pre- und Postproduktion beteiligt. ", -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/play.png",
                link: "https://youtu.be/LMM9EbzgYxk",
                scale: 1,
                "use-mask": true,
                title: "Trailer auf YouTube anschauen"
              })
            ]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/threed/isdl/isdl2.jpg",
            alt: "3D-Modellierte, fiktionale Stadt der Zukunft",
            "image-width": 47,
            "hide-button": true
          }, {
            content: withCtx(() => [..._cache[3] || (_cache[3] = [
              createBaseVNode("h3", null, "Die Stadt", -1),
              createBaseVNode("p", null, [
                createTextVNode(" Meine Hauptaufgabe war es eine dystopische und niedergekommene Zukunftsversion der Stadt Wernigerode zu erstellen."),
                createBaseVNode("br"),
                createTextVNode(" Durch die prozedurale Verteilung von Gebäuden und Konstruktionen auf dem heutigen Grundriss der Stadt entstand eine neue, dystopische Megacity."),
                createBaseVNode("br"),
                createTextVNode(" Durch verschiedenste Straßen fahren prozedural verteilte Autos durch die heruntergekommene Szenerie. ")
              ], -1),
              createBaseVNode("p", null, [
                createTextVNode(" In der Szene folgen wir in einer animierten Kamerafahrt dem Flug eines aus "),
                createBaseVNode("a", {
                  href: "https://de.wikipedia.org/wiki/Blade_Runner_2049",
                  target: "_blank"
                }, "Blade Runner 2049"),
                createTextVNode(' nachempfundener "Spinners" über die Stadt hinweg. ')
              ], -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 3
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/threed/isdl/isdl5.jpg",
            alt: "Gebäude explodiert im Hintergrund, realer Schauspieler im Vordergrund",
            "image-right": true,
            "image-width": 40,
            "coin-type": unref(PageType).p_schatten,
            copyright: "<b>Darsteller: </b>Timur Bauch, <b>Gebäudeteil Vordergrund:</b> Yannick Rast, Anzor Utzmaev"
          }, {
            content: withCtx(() => [..._cache[4] || (_cache[4] = [
              createBaseVNode("h3", null, "VFX im Team", -1),
              createBaseVNode("p", null, [
                createTextVNode(" In diesem Projekt konnte ich zum ersten mal gemeinsam in einem größeren Team an den VFX arbeiten. Wir konnten uns miteinander austauschen, Arbeitsschritte planen und Workloads verteilen."),
                createBaseVNode("br")
              ], -1),
              createBaseVNode("p", null, [
                createTextVNode(" Dieses Projekt hat im Endeffekt sehr viel mehr Zeit und Planung benötigt, als es zunächst den Anschein gemacht hatte."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Nicht nur in der Postproduktion hat es viel Planung benötigt, auch in der Preproduction und beim Dreh musste viel aufeinander abgestimmt und auf viele Details achtgegeben werden. ")
              ], -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/read.png",
                onClick: () => unref(OpenPage)(unref(PageType).p_schatten),
                scale: 0.8,
                "use-mask": true,
                title: "Mehr über dieses Projekt erfahren"
              }, null, 8, ["onClick"])
            ]),
            _: 1
          }, 8, ["coin-type"]),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 3
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/threed/isdl/isdl3.jpg", label: "Flug im Spinner - Anpassen von 3 verschiedenen Ebenen für das finale Composit", alt: "Darsteller 'sitzt' im digitalen Flugobjekt", copyright: "<b>Darsteller:</b> Timur Bauch,  <b>Keying / Color-Grading / Final Compositng:</b> Aaron Pöhlmann, Malte Kasolowsky", isOuter: true },
              { url: "/images/threed/isdl/isdl4.jpg", label: "Arbeiten mit eigenen Simulationen und fertigen VDB", alt: "Explosion eines großen Gebäudes, digitale Szenerie", copyright: "<b>Keying / Color-Grading / Final Compositing:</b> Aaron Pöhlmann, Malte Kasolowsky" },
              { url: "/images/threed/isdl/isdl.jpg", alt: "Ansicht einer Autobahn von Oben in der digitalen Stadt", copyright: "<b>Color-Grading / Final Compositing:</b> Aaron Pöhlmann, Malte Kasolowsky" }
            ],
            "flip-buttons": true
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          _cache[15] || (_cache[15] = createBaseVNode("div", { id: "dune" }, null, -1)),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            image: "/images/threed/dune/harvester_view.jpg",
            alt: "Spice Harvester in der Wüste, 3D Szene",
            flip: true
          }, {
            default: withCtx(() => [..._cache[5] || (_cache[5] = [
              createTextVNode(" DUNE ", -1),
              createBaseVNode("span", null, "Nacht auf Arrakis", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 1,
            bottom: 3
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/threed/dune/harvester_long.jpg",
            alt: "Render eines Spice Harvesters (3D-Modelliert, prozedural Texturiert)",
            "image-right": true,
            "image-width": 40,
            "coin-type": unref(PageType).p_dune
          }, {
            content: withCtx(() => [..._cache[6] || (_cache[6] = [
              createBaseVNode("h3", null, "Nacht auf Arrakis", -1),
              createBaseVNode("p", null, [
                createTextVNode(' Für das Modul "3D-Animation für Film und Spiele" habe ich mich entschieden, einen Fan-Film zu den neuesten "Dune"-Filmen zu machen. '),
                createBaseVNode("br"),
                createTextVNode(" Es hat fast zwei Jahre in Anspruch genommen, alle Assets für dieses Projekt zu erstellen."),
                createBaseVNode("br"),
                createTextVNode(" Ich bin auf die im Rahmen dieses Projektes entstandenen Modelle sehr stolz, da viele von ihnen sehr nah an die Designs aus den Filmen herankommen."),
                createBaseVNode("br"),
                createTextVNode(" Alle Assets wurden mit "),
                createBaseVNode("a", { href: "https://www.blender.org/" }, "Blender"),
                createTextVNode(" erstellt. Alle Texturen wurden prozedural (ohne Bilddateien) erstellt. ")
              ], -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/read.png",
                onClick: () => unref(OpenPage)(unref(PageType).p_dune),
                scale: 0.8,
                "use-mask": true,
                title: "Mehr über dieses Projekt erfahren"
              }, null, 8, ["onClick"])
            ]),
            _: 1
          }, 8, ["coin-type"]),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 3
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/threed/dune/A4_Fremen.png",
            alt: "3D Modell eines Fremen (Charaktermodell)",
            "image-width": 52,
            "hide-button": true
          }, {
            content: withCtx(() => [..._cache[7] || (_cache[7] = [
              createBaseVNode("h3", null, "Charaktere", -1),
              createBaseVNode("p", null, [
                createTextVNode(" Im Rahmen dieses Projektes wollte ich mich erstmals an die Erstellung von Charakteren in "),
                createBaseVNode("a", { href: "https://www.blender.org/" }, "Blender"),
                createTextVNode(" wagen. "),
                createBaseVNode("br"),
                createTextVNode(' Ich habe für mein Projekt einen "Harkonnen" und einen "Fremen" den Designs aus den Filmen entsprechend nachgebaut.'),
                createBaseVNode("br")
              ], -1),
              createBaseVNode("p", null, [
                createTextVNode(" Es hat sich als sehr große Herausforderung herausgestellt, verschiedenste organische Formen miteinander in Einklang zu bringen."),
                createBaseVNode("br"),
                createTextVNode(" Besonders der Anzug des Fremen bedeutete eine Menge an ineinander verschlungene Formen und Einzelteile."),
                createBaseVNode("br"),
                createTextVNode(" Ich bin sehr zufrieden mit den Charakteren und habe auch dafür gesorgt, dass sich die Charaktere angemessen mittels eines Rigs steuern lassen. ")
              ], -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          _cache[16] || (_cache[16] = createBaseVNode("div", { id: "son" }, null, -1)),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            image: "/images/threed/son/son.jpg",
            alt: "Verlassenes Gebäude im Wald, 3D Szenerie",
            flip: true
          }, {
            default: withCtx(() => [..._cache[8] || (_cache[8] = [
              createTextVNode(" Strings ", -1),
              createBaseVNode("span", null, "of Nightmare", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 1,
            bottom: 3
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/threed/son/son2.jpg",
            alt: "Screenshot aus der 3D-Animation",
            "image-right": true,
            "image-width": 40,
            "coin-type": unref(PageType).p_strings,
            ",": "",
            copyright: "<b>Charakter</b>: Mandy Rothe"
          }, {
            content: withCtx(() => [..._cache[9] || (_cache[9] = [
              createBaseVNode("h3", null, "Motion Capture", -1),
              createBaseVNode("p", null, [
                createBaseVNode("b", null, "Strings of Nightmare"),
                createTextVNode(' ist ein animierter Kurzfilm welcher sich im "Dead by Daylight" - Universum ansiedelt.'),
                createBaseVNode("br"),
                createTextVNode(" Der Kurzfilm ist ein Fan-Trailer, welcher zwei ausgedachte Charaktere für das Spiel ankündigt."),
                createBaseVNode("br"),
                createTextVNode(" Die Charaktere im Kurzfilm wurden mittels eines modernen Motion-Capture Anzugs aufgenommen."),
                createBaseVNode("br")
              ], -1),
              createBaseVNode("p", null, " In einem Team aus vier Personen war ich für die Erstellung von 3D-Assets und der gesamten Szenerie, das Integrieren der animierten Charakter-Modelle, deren Interaktion miteinander und mit der Szene zuständig. ", -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/read.png",
                onClick: () => unref(OpenPage)(unref(PageType).p_strings),
                scale: 0.8,
                "use-mask": true,
                title: "Mehr über dieses Projekt erfahren"
              }, null, 8, ["onClick"])
            ]),
            _: 1
          }, 8, ["coin-type"]),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 3
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/threed/son/son4.jpg",
            alt: "Kampfszene zweier Charaktere, 3D Animation",
            "image-width": 52,
            "hide-button": true,
            copyright: "<b>Charaktere</b>: Sebastian Siebert, Mandy Rothe"
          }, {
            content: withCtx(() => [..._cache[10] || (_cache[10] = [
              createBaseVNode("h3", null, "Alles miteinander Verbunden", -1),
              createBaseVNode("p", null, [
                createTextVNode(" Dieses Projekt war besonders aufwändig für mich, da sich hier vor allem am Ende gezeigt hatte, wie viel Aufwand es bedeutet mit solch komplexen Szenen und Animationen umzugehen. "),
                createBaseVNode("br")
              ], -1),
              createBaseVNode("p", null, [
                createTextVNode(" In Strings of Nightmare geht es Hauptsächlich um den Kampf des Protagonisten mit einer verhexten Puppe. Da wir nur einen Anzug gleichzeitig aufnehmen konnten, mussten die Interaktionen (Schläge, Tritte, Stöße) der Charaktere separat aufgenommen und im Nachhinein aufeinander abgepasst werden. "),
                createBaseVNode("br"),
                createTextVNode(" Dadurch entstanden kleine Unterschiede in den Timings von bestimmten Bewegungen, welche durch sorgfältiges Platzieren der Kamera und rechtzeitigen Schnitten verdeckt werden konnte."),
                createBaseVNode("br")
              ], -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 3
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/threed/son/son3.jpg", label: "Bau und Texturierung der Szene", alt: "Geheimnisvolle Puppe steht in einem Innenhof, digitale Szene", copyright: "<b>Marionette:</b> Sebastian Siebert" },
              { url: "/images/threed/son/son5.jpg", label: "Finden von interessanten Kameraeinstellungen und Kamerabewegungen, sowie Animation der Tiefenunschärfe", alt: "Alter Mann schaut auf uns herab, digitale Szene", copyright: "<b>Charakter:</b> Dennis Voigt", isOuter: true },
              { url: "/images/threed/son/son6.jpg", label: "Animation von Objekten (z.B. Marionetten-Kreuz) angepasst auf Charakterbewegung", alt: "Geheimnisvolle Konstruktion eines Puppenspielers, digitale Szene", copyright: "<b>Charakter:</b> Dennis Voigt" }
            ],
            "flip-buttons": true
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            flip: true
          }, {
            default: withCtx(() => [..._cache[11] || (_cache[11] = [
              createTextVNode(" Raum der ", -1),
              createBaseVNode("span", null, "Zukunft", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentImage, {
            image: "/images/threed/rdz.png",
            alt: "Hochwertiger Render eines Jugendzimmers in einer dystopischen Zukunft",
            pad: 1
          }),
          createVNode(ContentSpacer, {
            top: 1,
            bottom: 3
          }),
          createVNode(ContentImageSidePanel, { "image-width": -0.6 }, {
            content: withCtx(() => [..._cache[12] || (_cache[12] = [
              createBaseVNode("h3", null, "Raum der Zukunft", -1),
              createBaseVNode("p", null, [
                createTextVNode(' Dieses Projekt entstand im Rahmen des Moduls "3D Modellierung für Film und Spiele". Das Bild zeigt einen Raum in einer weit entfernten, dystopischen Zukunft. Das Werk soll an Filme wie "Blade Runner" erinnern. Ich habe großen Wert auf die kleinen Details und eine stimmige Komposition gelegt.'),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Das Bild wurde in Blender gerendert und dort auch nachbearbeitet. Das finale Composit erhielt im hochschulinternen MINFF-Award 2023 den zweiten Platz. ")
              ], -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 3
          })
        ]),
        _: 1
      }, 8, ["panel"]);
    };
  }
});
const _hoisted_1$1 = ["panel"];
const _sfc_main$a = /* @__PURE__ */ defineComponent({
  __name: "TrailerPanel",
  setup(__props) {
    let fElem = /* @__PURE__ */ ref(void 0);
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", {
        id: "trailerPanel",
        class: "panel",
        panel: unref(PageType).trailer,
        ref_key: "fElem",
        ref: fElem
      }, [
        _cache[0] || (_cache[0] = createBaseVNode("video", {
          autoplay: "",
          playsinline: "",
          muted: "",
          loop: "",
          preload: "auto",
          disablePictureInPicture: ""
        }, [
          createBaseVNode("source", { src: "/videos/Trailer.mp4" }),
          createTextVNode(" Trailer-Video mit Szenen aus verschiedensten Projekten. ")
        ], -1)),
        createVNode(FullscreenToggle, { fElem: unref(fElem) }, null, 8, ["fElem"])
      ], 8, _hoisted_1$1);
    };
  }
});
const TrailerPanel = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-2dbc9828"]]);
const _sfc_main$9 = /* @__PURE__ */ defineComponent({
  __name: "ProjectPanel",
  setup(__props) {
    function toPrevious() {
      window.history.back();
    }
    return (_ctx, _cache) => {
      return openBlock(), createBlock(ContentPanel, null, {
        default: withCtx(() => [
          createVNode(Coin, {
            class: "previousCoin",
            onClick: _cache[0] || (_cache[0] = ($event) => toPrevious())
          }, {
            default: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/right_arrow.png",
                scale: 0.75,
                "use-mask": true,
                style: { "transform": "rotate(180deg)" }
              })
            ]),
            _: 1
          }),
          renderSlot(_ctx.$slots, "default", {}, void 0, true)
        ]),
        _: 3
      });
    };
  }
});
const ProjectPanel = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-9782fefd"]]);
const _sfc_main$8 = /* @__PURE__ */ defineComponent({
  __name: "ProjectDune",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(ProjectPanel, {
        id: "projectDune",
        class: "panel",
        panel: unref(PageType).p_dune
      }, {
        default: withCtx(() => [
          createVNode(ContentSpacer, {
            top: 0.5,
            hidden: true
          }),
          createVNode(ContentHeadline, {
            "headline-height": 3.7,
            image: "/images/threed/dune/orni_side.png",
            flip: true,
            alt: "Ornithopter von der Seite, 3D"
          }, {
            default: withCtx(() => [..._cache[0] || (_cache[0] = [
              createTextVNode(" DUNE - ", -1),
              createBaseVNode("span", null, "Nacht auf Arrakis", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 2,
            bottom: 0.5
          }),
          _cache[8] || (_cache[8] = createBaseVNode("h3", { style: { "color": "var(--textSecCol)", "font-family": "'Courier New'", "line-height": "1.6rem", "font-size": "1.25rem", "text-align": "justify" } }, [
            createTextVNode(" Dieses Projekt umfasst einige Nachbildungen von Modellen aus den Filmen "),
            createBaseVNode("a", {
              href: "https://de.wikipedia.org/wiki/Dune_(2021)",
              target: "_blank"
            }, "Dune"),
            createTextVNode(" (2021) und "),
            createBaseVNode("a", {
              href: "https://de.wikipedia.org/wiki/Dune:_Part_Two",
              target: "_blank"
            }, "Dune Part Two"),
            createTextVNode(" (2024). Neben Ornithoptern und Harvestern stehen dabei vor allem die zwei komplexen und detaillierten Charaktermodelle im Vordergrund. "),
            createBaseVNode("br"),
            createBaseVNode("br"),
            createTextVNode(" Die Modelle wurden mit "),
            createBaseVNode("a", {
              href: "https://www.blender.org/",
              target: "_blank"
            }, "Blender"),
            createTextVNode(" erstellt und sind alle prozedural texturiert. ")
          ], -1)),
          createVNode(ContentSpacer, {
            top: 0.5,
            bottom: 1.7
          }),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            flip: true
          }, {
            default: withCtx(() => [..._cache[1] || (_cache[1] = [
              createTextVNode(" Der ", -1),
              createBaseVNode("span", null, "Harvester", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentImage, {
            image: "/images/threed/dune/harvester_clear_r.png",
            alt: "Vollständiger Render des Harvesters, wenig Nebel",
            pad: 5
          }),
          createVNode(ContentSpacer, {
            top: 1,
            bottom: 3
          }),
          createVNode(ContentImageSidePanel, { "image-width": -0.6 }, {
            content: withCtx(() => [..._cache[2] || (_cache[2] = [
              createBaseVNode("h3", null, "Einen Harvester bauen", -1),
              createBaseVNode("p", null, [
                createTextVNode(" Der Harvester ist eines der größten und komplexesten Modelle, die ich bisher erstellt habe. Das Modell sollte dem Design aus den Filmen möglichst nahe kommen. Ich habe mir dutzende Szenen aus den Filmen als Referenz herausgesucht, sowie einige wenige Referenzen aus Making-Of Material herausziehen können, auf Basis dessen ich das Design des Harvesters relativ umfassend nachstellen konnte."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(' Der Harvester besteht aus einer filigraneren unteren Hälfte und einer daraufliegenden Sektion, die eine Art "Kopf" formt. Im unteren Bereich bewegen sich nicht nur Kettenräder und die Beine des Harvesters voran, sondern es stechen auch kleine Ärmchen in rasanten Bewegungen in den Boden. Die Bewegung der großen Arme kann mittels '),
                createBaseVNode("a", {
                  href: "https://de.wikipedia.org/wiki/FK-_und_IK-Rigging",
                  target: "_blank"
                }, "IK"),
                createTextVNode(" animiert werden, während die kleinen Ärmchen mittels überlagerter Noises in einem gewissen Bewegungsradius in den Boden stechen."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Es war sehr schwer, die gesamte Form auf Basis der Referenzen herauszufinden und die großen organischen ")
              ], -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/threed/dune/harvester_full_r.png", alt: "Harvester aus der Seitenansicht", isOuter: true },
              { url: "/images/threed/dune/harvester_frontal_r.png", alt: "Harvester Frontal, viel Nebel, Lichtspiel der Scheinwerfer" },
              { url: "/images/threed/dune/harvester_long.png", alt: "Harvester von der Seite, Nebel" },
              { url: "/images/threed/dune/harvester_unten.jpg", alt: "Uneterer Bereich des Harvesters, Nah" },
              { url: "/images/threed/dune/harvester_view.jpg", alt: "Harvetser aus Betrachtung eines Fernglases, Composit", label: "Composit in Davinci - Betrachtung aus einem Fernglas" }
            ],
            "flip-buttons": true
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentImage, {
            image: "/images/threed/dune/harvester_close_vp.png",
            alt: "Harvester Frontal, Ansicht in Blender"
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImage, {
            image: "/images/threed/dune/harvester_legs_vp.png",
            alt: "Ansicht von der Seite, Ansicht in Blender",
            label: "Animation der Beine durch Bewegen des Nullobjektes erfolgt mittels IK",
            flipped: true
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImage, {
            image: "/images/threed/dune/harvester_detail_vp.PNG",
            alt: "Ansicht in Blender, Kettenräder und Beine im Closeup"
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImage, {
            image: "/images/threed/dune/harvester_pickers.PNG",
            alt: "Die Haken des Harvesters im Closeup, Betrachtung in Blender",
            label: "Partikelsimulation zum Erstellen einer daraufliegenden Smoke-Simulation"
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            flip: true
          }, {
            default: withCtx(() => [..._cache[3] || (_cache[3] = [
              createTextVNode(" Die ", -1),
              createBaseVNode("span", null, "Charaktere", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentImageSidePanel, { "image-width": -0.6 }, {
            content: withCtx(() => [..._cache[4] || (_cache[4] = [
              createBaseVNode("h3", null, "Meine ersten Charakter­modelle", -1),
              createBaseVNode("p", null, [
                createTextVNode(" Der Fremen in Kampfausrüstung und der Anzug des Harkonnen waren die ersten Charaktermodelle, die ich jemals in Blender erstellt und texturiert habe. Während der Anzug des Harkonnen aus großen und unnormalen Formen bestand, lag die Schwierigkeit beim Fremen an den vielen organisch geformten und sich überlappenden / ineinander verschlungenen Einzelteilen des Anzugs."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Beide Charaktere sind vollständig mit einem Character-Rig animierbar. Es hat sehr lange gedauert, ein ordentliches Weight-Painting für die einzelnen Körperteile zu erstellen, sodass sich die Bestandteile bei einer Bewegung passend mitbewegen und keine zu großen Lücken und Verformungen enstehen."),
                createBaseVNode("br"),
                createBaseVNode("br")
              ], -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/threed/dune/fremen_head_r.png", alt: "Kopf des Fremen, Shaded, Blender", isOuter: true },
              { url: "/images/threed/dune/fremen_lhand_r.png", alt: "Hand des Fremen, Shaded, Blender", label: "" },
              { url: "/images/threed/dune/fremen_torsp_r.png", alt: "Torso des Fremens in Nahansicht, Blender", label: "" },
              { url: "/images/threed/dune/fremen_legs_r.png", alt: "Beine des Fremens, Blender", label: "" },
              { url: "/images/threed/dune/fremen_upper_r.png", alt: "Oberkörper des Fremen, Shaded, Unlit, Blender", label: "" },
              { url: "/images/threed/dune/fremen_back_r.png", alt: "Rückseite des Fremen, Shaded, Blender", label: "" },
              { url: "/images/threed/dune/fremen_full_r.png", alt: "Fremen komplett, Shaded, Blender", label: "" },
              { url: "/images/threed/dune/fremen.jpg", alt: "Komposit - Fremen liegt und zielt mit Waffe", label: "" }
            ],
            "flip-buttons": false
          }),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/threed/dune/fremen_head_vp.PNG", alt: "Kopf des Fremen, Ansicht in Blender", label: "" },
              { url: "/images/threed/dune/fremen_hand_vp.PNG", alt: "Hand des Fremen, Ansicht in Blender", label: "" },
              { url: "/images/threed/dune/fremen_upper_vp.PNG", alt: "Oberkörper des Fremen, Ansicht in Blender", label: "", isOuter: true },
              { url: "/images/threed/dune/fremen_turned_back_vp.PNG", alt: "Fremen in gedrehter Position, Rücken, Ansicht in Blender", label: "" },
              { url: "/images/threed/dune/fremen_turn_looks_sh.png", alt: "FRemen gedreht zu uns, Preview, Blender", label: "" },
              { url: "/images/threed/dune/fremen_looks_sh.png", alt: "Fremen hält Fernglas, Preview, Blender", label: "" },
              { url: "/images/threed/dune/fremen_white_sh.png", alt: "Fremen komplett, Weiß, Shaded", label: "" }
            ],
            "flip-buttons": true
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/threed/dune/harkonnen_top_r.png", alt: "Harkonnen im Anzug, Shaded, Blender", label: "" },
              { url: "/images/threed/dune/harkonnen_head_r.png", alt: "Kopf des Harkonnen, Shaded, Blender", label: "", isOuter: true },
              { url: "/images/threed/dune/harkonnen_back_r.png", alt: "Rückseite des Harkonnen, Shaded, Blender", label: "" }
            ],
            "flip-buttons": false
          }),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/threed/dune/harkonnen_upper_vp.PNG", alt: "Harkonnen im Anzug, Ansicht in Blender", label: "", isOuter: true },
              { url: "/images/threed/dune/harkonnen_bottom_vp.PNG", alt: "Beine des Harkonnen, Ansicht in Blender", label: "" },
              { url: "/images/threed/dune/harkonnen_back_vp.PNG", alt: "Rückseite des Harkonnen, Ansicht in Blender", label: "" },
              { url: "/images/threed/dune/harkonnen_upper_back_vp.PNG", alt: "Rückseite des Harkonnen, Ansicht in Blender", label: "" },
              { url: "/images/threed/dune/harkonnen_white_sh.png", alt: "Harkonnen komplett, Weiß, Shaded", label: "" }
            ],
            "flip-buttons": true
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            flip: true
          }, {
            default: withCtx(() => [..._cache[5] || (_cache[5] = [
              createTextVNode(" Thopter & ", -1),
              createBaseVNode("span", null, "Truppen­schiff", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentImage, {
            image: "/images/threed/dune/orni_side.png",
            alt: "Ornithopter in der Seitenansicht, 3D",
            label: "Ornithopter der Harkonnen",
            flipped: true
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/threed/dune/orni_vp.PNG", alt: "Ornithopter von der Seite, Ansicht in Blender", label: "", isOuter: true },
              { url: "/images/threed/dune/orni_up_vp.PNG", alt: "Ornithopter Modell von Oben, Ansicht in Blender", label: "" },
              { url: "/images/threed/dune/orni_below_vp.PNG", alt: "Modell von unten, Ansicht in Blender", label: "" },
              { url: "/images/threed/dune/orni_w.PNG", alt: "Ornithopter in Wireframe Ansicht", label: "" }
            ],
            "flip-buttons": true
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentImage, {
            image: "/images/threed/dune/troopship_r.png",
            alt: "Truppenschiff, Vollbild",
            label: "Truppentransporter der Harkonnen",
            flipped: true
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImage, {
            image: "/images/threed/dune/troopship_inside_r.png",
            alt: "Truppenschiff, Nah, Blick ins Innere",
            label: "",
            flipped: true
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/threed/dune/troopship_below_vp.PNG", alt: "Truppenschiff von Unten, Ansicht in Blender", label: "", isOuter: true },
              { url: "/images/threed/dune/troopship_above_vp.PNG", alt: "Modell von Oben, Ansicht in Blender", label: "" },
              { url: "/images/threed/dune/troopship_close_vp.PNG", alt: "Truppenschiff nah, Ansicht in Blender", label: "" },
              { url: "/images/threed/dune/troopship_w.PNG", alt: "Truppenschiff in Wireframe Ansicht", label: "" }
            ],
            "flip-buttons": true
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            flip: true
          }, {
            default: withCtx(() => [..._cache[6] || (_cache[6] = [
              createTextVNode(" Weitere ", -1),
              createBaseVNode("span", null, "Elemente", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/threed/dune/krismesser_r.png", alt: "Blutiges Messer in Detailansicht, Render", label: "Krismesser der Fremen", isOuter: true },
              { url: "/images/threed/dune/waffe.png", alt: "Waffe in Detailansicht, Render", label: "Waffe eines Harkonnen" }
            ],
            "flip-buttons": true
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentImageSidePanel, { "image-width": -0.6 }, {
            content: withCtx(() => [..._cache[7] || (_cache[7] = [
              createBaseVNode("h3", null, "Die Zukunft dieses Projekts", -1),
              createBaseVNode("p", null, [
                createTextVNode(" Aus allen Einzelteilen dieses Projekts soll in der Zukunft natürlich noch ein ordentlicher animierter Kurzfilm entstehen. Immerhin war es der Traum, ein audiovisuelles Erlebnis aus dem Dune-Kosmos zu erschaffen, welcher mich dazu brachte dieses Projekt überhaupt zu beginnen."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Die Größe und Komplexität dieses Projektes hat allerdings vor allem meine zeitlichen Erwartungen deutlich überschritten. Alle Modelle zu erstellen, zu texturieren und animierbar zu machen hat eine sehr lange Zeit in Anspruch genommen. Nach einer längeren Pause bin ich allerdings nun wieder bereit, dieses Projekt weiter aufzugreifen und in naher Zukunft eine vollständige Animation hierzu zu liefern. ")
              ], -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 3
          })
        ]),
        _: 1
      }, 8, ["panel"]);
    };
  }
});
const _sfc_main$7 = /* @__PURE__ */ defineComponent({
  __name: "ProjectGGJ",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(ProjectPanel, {
        id: "projectGGJ",
        class: "panel",
        panel: unref(PageType).p_ggj
      }, {
        default: withCtx(() => [
          createVNode(ContentHeadline, {
            "headline-height": 7.7,
            image: "/images/games/bubblr.png",
            flip: true
          }, {
            default: withCtx(() => [..._cache[0] || (_cache[0] = [
              createTextVNode(" Bubblr ", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      }, 8, ["panel"]);
    };
  }
});
const _sfc_main$6 = /* @__PURE__ */ defineComponent({
  __name: "ProjectKurios",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(ProjectPanel, {
        id: "projectKurios",
        class: "panel",
        panel: unref(PageType).p_kurios
      }, {
        default: withCtx(() => [
          createVNode(ContentSpacer, {
            top: 0.5,
            hidden: true
          }),
          createVNode(ContentHeadline, {
            "headline-height": 3.7,
            image: "/images/film/kurios/Example_Kuriositär.jpg",
            flip: true,
            alt: "Gebäude auf Hügel, davor steht ein Auto, 3D Render"
          }, {
            default: withCtx(() => [..._cache[0] || (_cache[0] = [
              createTextVNode(" Der ", -1),
              createBaseVNode("span", null, "Kuriositär", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 2,
            bottom: 0.5
          }),
          _cache[12] || (_cache[12] = createBaseVNode("h3", { style: { "color": "var(--textSecCol)", "font-family": "'Courier New'", "line-height": "1.6rem", "font-size": "1.25rem", "text-align": "justify" } }, [
            createTextVNode(' Dies ist mein erster Kurzfilm, bei dem ich selbst ein eigenes Skript schreiben und verfilmen konnte. In einem Team aus 4 Leuten konnten wir uns an der Hochschule Harz im Modul "Filmtechnik und Filmschnitt" frei ausprobieren. "Der Kuriositär" ist das Ergebnis dieser tollen Zusammenarbeit. '),
            createBaseVNode("br"),
            createBaseVNode("br"),
            createTextVNode(" Wir konnten alle Szenen innerhalb von 4 Tagen drehen und sowohl vor Ort als auch in einer Sprecherkabine den Ton aufnehmen. Danach konnte ich die Postproduktion alleine fortführen und den fertigen Kurzfilm rechtzeitig beim Jugendfilmpreis Sachsen-Anhalt 2022 einreichen. ")
          ], -1)),
          createVNode(ContentSpacer, {
            top: 0.5,
            bottom: 1.7
          }),
          createVNode(ContentImageSidePanel, { "image-width": -0.6 }, {
            content: withCtx(() => [..._cache[1] || (_cache[1] = [
              createBaseVNode("h3", null, "Kuriose Geschichten", -1),
              createBaseVNode("p", null, [
                createTextVNode(" Der Kurzfilm erzählt von einem Autor, welcher bei einer kleinen Zeitung Artikel über kuriose Geschichten schreibt."),
                createBaseVNode("br"),
                createTextVNode(" Doch die Zeiten ändern sich. Ein repressiver Staat und eine Gesellschaft die sich von Zeitungen abwendet haben die Folge, dass die Zeitung zuerst unter hohen Auflagen begraben wird und letztendlich geschlossen werden muss."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Der Film spielt absichtlich mit verschiedenen Bildformaten, entsättigten Bildern und einer Komposition die deutlich an den Stil von "),
                createBaseVNode("a", null, "Wes Anderson"),
                createTextVNode(" erinnern soll."),
                createBaseVNode("br"),
                createTextVNode(' Er verbindet unter anderem reale Aufnahmen mit bildhaften 3D Szenerien (welche an die großen Aufbauten und Szenerien in z.B. "Grand Budapest Hotel" erinnern). Wir beobachten den Verfall der Realität und sehen die letzten kleinen Geschichten, von denen der Kuriositär erzählt. Dieser erzählt am Ende des Kurzfilmes nicht nur die tragische Geschichte eines unbekannten Künstlers, sondern auch von den Auswirkungen welche seine Kunst auf das eigene Leben hatte (wenn auch ungewollt).'),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Die spielerische und gleichzeitig hinnehmende Art des Filmes soll im Kontrast zum Ernst der Situation stehen und auf das aufmerksam machen, was viele in solch einer Lage schnell fallen lassen und vergessen würden."),
                createBaseVNode("br")
              ], -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/film/kurios/zuhause_composit.jpg",
            alt: "Wohnung des Kuriositärs, belebte und farbenfrohe 3D-Szenerie",
            "image-right": true,
            "image-width": 42
          }, {
            content: withCtx(() => [..._cache[2] || (_cache[2] = [
              createTextVNode(" Der Film kann zurzeit auf dem YouTube Kanal des Offenen Kanals Magdeburg angesehen werden. ", -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/play.png",
                link: "https://www.youtube.com/watch?v=-TSbpB1tkB8&source_ve_path=MTc4NDI0",
                scale: 1,
                "use-mask": true,
                title: "Kurzfilm auf YouTube schauen"
              })
            ]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/film/kurios/Bahn.jpg",
            alt: "Bahnsteig mit Zeitungsstand, 3D Szenerie",
            "image-right": false,
            "image-width": 42
          }, {
            content: withCtx(() => [..._cache[3] || (_cache[3] = [
              createTextVNode(' Martin Kreyßig, Dozent im Fach "Filmtechnik", schrieb ebenso einen Artikel auf der Seite unseres Studienganges, über den ich mich sehr gefreut habe. ', -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/link.png",
                link: "https://www.medieninformatik.de/der-kuriositaer-kurzfilm-von-luca-joel-spirka-gewinnt-beim-27-jugendfilmpreis-sachsen-anhalt/",
                scale: 0.75,
                "use-mask": true,
                title: "Kurzfilm auf YouTube schauen"
              })
            ]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/film/kurios/zuhause_composit.jpg", alt: "Zuhause des Kuriositärs, farbenfrohe 3D-Szenerie", copyright: "<b>Darsteller: </b>Sebastian Siebert", isOuter: true },
              { url: "/images/film/kurios/treffen_bw.jpg", alt: "Kuriositär und Zeitungschef schütteln sich die Hände, 4:3, greyscale", copyright: "<b>Darsteller: </b>Sebastian Siebert, Luca Spirka" },
              { url: "/images/film/kurios/pflanze_steht.jpg", alt: "Zeitungschef sitzt mit Pflaze vor ihm" },
              { url: "/images/film/kurios/künstler.jpg", alt: "Der Künstler mit seinem Werk", copyright: "<b>Darsteller: </b>Justin Göring" },
              { url: "/images/film/kurios/hütte_dunst.jpg", alt: "Das Haus auf dem Hügel im Nebel, greyscale, 3D Render" },
              { url: "/images/film/kurios/Erklärung.jpg", alt: "Zettel mit Insolvenzerklärung, über dem eine Pistole auf den Parteichef gerichtet wird, greyscale" },
              { url: "/images/film/kurios/Der_Kuriositaer_Image.jpg", alt: "Alle Charaktere nebeneinander, 4:3", copyright: "<b>Darsteller: </b>Sebastian Siebert, Justin Göring, Luca Spirka" },
              { url: "/images/film/kurios/betrachtend.jpg", alt: "Zeitungschef und Kuriositär betrachten das Werk des Künstlers", copyright: "<b>Darsteller: </b>Sebastian Siebert, Luca Spirka" }
            ],
            "flip-buttons": true
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            flip: true
          }, {
            default: withCtx(() => [..._cache[4] || (_cache[4] = [
              createTextVNode(" Preproduction ", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentImageSidePanel, { "image-width": -0.6 }, {
            content: withCtx(() => [..._cache[5] || (_cache[5] = [
              createBaseVNode("h3", null, "Kuriose Geschichten finden", -1),
              createBaseVNode("p", null, [
                createTextVNode(" Ich habe das Skript für diesen Kurzfilm in mehreren Iterationen ausgearbeitet. Ich musste besonders auf die Teamgröße und die Komplexität der Geschichte Acht geben. Der Film musste zusammen mit 3 weiteren Kurzfilmen gedreht werden, weshalb ich immer wieder drastisch das Skript verringert habe, um den Aufwand zu reduzieren und gleichzeitig die gleiche Klarheit der Geschichte beizubehalten."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Auf Basis des Skripts habe ich dann ein Storyboard ausgearbeitet und eine Shotliste erstellt. Die Reihenfolge der zu drehenden Shots habe ich dann nach Aufwand, Darstellen, benötigten Gegenständen und benötigter Nachbearbeitung sortiert. Eine finale Sortierung nach Drehorten trug maßgeblich dazu bei, das wir schnell und einfach von einem Shot zum nächsten wechseln konnten."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Nach der Planung aller wichtigen Einstellungen und der Ausarbeitung der Dialoge habe ich dann alle benötigten Props herbeigeschafft und mich mit meinem Team abgesprochen. Ebenso habe ich schon vor dem eigentlichen Dreh an der Fertigstellung der benötigten 3D-Szenerien gearbeitet. ")
              ], -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/film/kurios/shotlist.PNG", alt: "Shooting-Plan, nach Orten geordnet und mit verschiedenen Spalten", label: "Shotliste des Kurzfilmes", isOuter: true },
              { url: "/images/film/kurios/storyboard.PNG", alt: "Storyboard mit einzelenen Shots aus dem Film", label: "Storyboard des Kurzfilmes" },
              { url: "/images/film/kurios/script.PNG", alt: "Auszug aus einem Draft des Scripts", label: "Skriptauszug (non final Draft)" }
            ],
            "flip-buttons": true
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            flip: true
          }, {
            default: withCtx(() => [..._cache[6] || (_cache[6] = [
              createTextVNode(" Der ", -1),
              createBaseVNode("span", null, "Dreh", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentImageSidePanel, { "image-width": -0.6 }, {
            content: withCtx(() => [..._cache[7] || (_cache[7] = [
              createBaseVNode("h3", null, "Eine Idee, ein Team", -1),
              createBaseVNode("p", null, [
                createTextVNode(" Der Dreh war angenehm und ging überraschen flink von statten, obwohl die Gesamtanzahl der benötigten Shots und der Aufwand für jede Szene deutlich höher waren als bei den anderen 3 Kurzfilmen. Außerdem mussten wir alle aufgrund der geringen Zeit die Texte in windeseile vor der jeweils nächsten Szene einstudieren, was allerdings ebenso gut geklappt hat."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Wir hatten beim Dreh immer einen klaren Überblick über unsere Texte und Aufgaben und konnten in wenigen Tagen den Film abdrehen. Auch die Vertonung konnte bereits vor Ort oder in der Sprecherkabine der Hochschule fertiggestellt werden. ")
              ], -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImage, {
            image: "/images/film/kurios/klappe.jpg",
            alt: "Darsteller sitzt am Tisch, Klappe wird gehalten, der Dreh beginnt",
            copyright: "<b>Darsteller: </b> Sebastian Siebert"
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            flip: true
          }, {
            default: withCtx(() => [..._cache[8] || (_cache[8] = [
              createTextVNode(" Postproduktion ", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentImageSidePanel, { "image-width": -0.6 }, {
            content: withCtx(() => [..._cache[9] || (_cache[9] = [
              createBaseVNode("h3", null, "2D, 3D & Sound", -1),
              createBaseVNode("p", null, [
                createTextVNode(' Die Postproduktion war der aufwändigste Teil dieser Filmproduktion. Ich habe die einzelnen Takes gesichtet und sortiert und danach im Schnitt so angeordnet, dass sie dem "Flow" der Geschichte gut folgen, gute Takes auch gesehen und Fehler versteckt werden.'),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Es war mir wichtig, eine Art Rhythmus oder eine Art von Leichtigkeit in den Film zu bringen, genau wie ich es in den Filmen von Wes Anderson empfunden habe. Das Schnitttempo passt sich der Situation an und ergänzt somit die bereits verspielte Komposition der Aufnahmen. Weitere Text- und Bildeinblendungen wurden ebenfalls hinzugefügt."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Der letzte Schritt war es dann, 2D, 3D und Sound zu vereinen. Ich habe ergänzende SFX aufgenommen und Aufnahmen vom Set genutzt, um einen stimmigen und dynamischen Raum zu erschaffen. Die einzelnen Clips wurden in der Lautstärke angepasst und mit Effekten versehen, welche diese passend in die entsprechende Situation eingliedern."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Ebenso habe ich die Musik für den Film eigens erstellt. Ich habe anschließend meine Musik aus FL Studio in eine .wav gerendert und in Davinci Resolve eingebunden. Die Musik ist ebenso Teil der dynamischen Bewegung um uns herum und verstärkt an vielen Stellen die gewünschte Gefühlslage. ")
              ], -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/film/kurios/timeline.png", alt: "Timeline des Projektes", label: "Timeline des Projektes (Davinci Resolve)", isOuter: true },
              { url: "/images/film/kurios/opression.jpg", alt: "Darsteller in einem beengten Auschnitt im Bild, Text darunter", label: "Veränderung der Bildverhältnisse und Texteinblendungen", copyright: "<b>Darsteller: </b>Sebastian Siebert, Luca Spirka" },
              { url: "/images/film/kurios/multimed.jpg", alt: "Zeichnung der Hausszenerie", label: "Arbiet mit verschiedenen Stilen und Medien" },
              { url: "/images/film/kurios/schreibend.jpg", alt: "Kuriositär schreibend, darunter Textanimationen für verschiedene Headlines", copyright: "<b>Darsteller: </b>Sebastian Siebert" },
              { url: "/images/film/kurios/Beide.jpg", alt: "Kuriositär und Zeitungschef nebeneinander, 4:3, greyscale", copyright: "<b>Darsteller: </b>Sebastian Siebert, Luca Spirka" },
              { url: "/images/film/kurios/number.jpg", alt: "Kuriositär beim Amt, 4:3, greyscale, digitaler Zähler ist im Bild passend eingebaut", label: "Integrieren von 3D mit flüssigen Übergängen", copyright: "<b>Darsteller: </b>Sebastian Siebert" },
              { url: "/images/film/kurios/zeitung.jpg", alt: "Bild einer Zeitung mit der im Film erzählten Kurzgeschichte" }
            ],
            "flip-buttons": true
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            flip: true
          }, {
            default: withCtx(() => [..._cache[10] || (_cache[10] = [
              createTextVNode(" Jugedfilmpreis ", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/film/kurios/Award.jpg",
            alt: "Sebastian Siebert und ich haben den Preis in der Hand",
            "image-right": true,
            "image-width": 42,
            "hide-button": true
          }, {
            content: withCtx(() => [..._cache[11] || (_cache[11] = [
              createBaseVNode("h3", null, "Ein wunderbarer Abend", -1),
              createBaseVNode("p", null, [
                createTextVNode(" Ich konnte es kaum glauben, als ich beim Jugendfilmpreis 2022 den Preis entgegennehmen konnte. Niemals hätte ich damit gerechnet, mit meinem ersten Kurzfilm überhaupt eine Chance bei so einem Event zu haben."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Es war ein schöner Abend mit vielen interessanten und berührenden Geschichten. Vielen Dank für diesen Preis! ")
              ], -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentSpacer, {
            top: 2,
            bottom: 0.5
          }),
          _cache[13] || (_cache[13] = createBaseVNode("h3", { style: { "color": "var(--textSecCol)", "font-family": "'Courier New'", "line-height": "1.6rem", "font-size": "1.25rem", "text-align": "justify" } }, " Team: Sebastian Siebert, Justin Göring, Luca Joel Spirka, Amr Labadi ", -1)),
          createVNode(ContentSpacer, {
            top: 0.5,
            bottom: 0
          }),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 2
          })
        ]),
        _: 1
      }, 8, ["panel"]);
    };
  }
});
const _sfc_main$5 = /* @__PURE__ */ defineComponent({
  __name: "ProjectLGND",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(ProjectPanel, {
        id: "projectLGND",
        class: "panel",
        panel: unref(PageType).p_lgnd
      }, {
        default: withCtx(() => [
          createVNode(ContentSpacer, {
            top: 0.5,
            hidden: true
          }),
          createVNode(ContentHeadline, {
            "headline-height": 3.7,
            image: "/images/games/lgnd/Legend_Screens.png",
            flip: true
          }, {
            default: withCtx(() => [..._cache[0] || (_cache[0] = [
              createTextVNode(" LGND ", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 2,
            bottom: 0.5
          }),
          _cache[1] || (_cache[1] = createBaseVNode("h3", { style: { "color": "var(--textSecCol)", "font-family": "'Courier New'", "line-height": "1.6rem", "font-size": "1.25rem", "text-align": "justify" } }, [
            createTextVNode(" LGND ist ein Spiel welches für Android Geräte mittels "),
            createBaseVNode("a", {
              href: "https://developer.android.com/studio?hl=de",
              target: "_blank"
            }, "Android Studio"),
            createTextVNode(" programmiert wurde. Das Spiel basiert auf einem Kartenspiel welches ich bereits in 2016 entworfen hatte. Seitdem wollte ich gerne auch eine digitale Variante davon erstellen. "),
            createBaseVNode("br"),
            createBaseVNode("br"),
            createTextVNode(" Das Spiel wurde mittels "),
            createBaseVNode("a", {
              href: "https://developer.android.com/compose",
              target: "_blank"
            }, "Jetpack Compose"),
            createTextVNode(" erstellt. Das Spiel ist funktional vollständig, steht jedoch nicht zur freien Installation zur Verfügung. ")
          ], -1)),
          createVNode(ContentSpacer, {
            top: 0.5,
            bottom: 1.7
          }),
          createVNode(ContentImageSlider, {
            id: "lgndSlider",
            images: [
              { url: "/images/games/lgnd/game.jpg", alt: "Hauptbildschirm mit Karten in verschiedenen Zonen", label: "Hauptbildschirm des Spiels", isOuter: true },
              { url: "/images/games/lgnd/shop.jpg", alt: "Hauptbildschirm mit Karten in verschiedenen Zonen, manche Karten sind umrandet", label: "Hauptbildschirm des Spiels mit geöffnetem Shop" },
              { url: "/images/games/lgnd/death.jpg", alt: "Hauptbildschirm mit Karten, darüber der Todestext", label: "Todesbildschirm" },
              { url: "/images/games/lgnd/question.jpg", alt: "Hauptbildschirm mit Karten in verschiedenen Zonen die mit Fragezeichen überlegt sind", label: "Modus zum Nachlesen von Informationen über alle Spielelemente" },
              { url: "/images/games/lgnd/explain.jpg", alt: "Hauptbildschirm Hilfstext-Overlay", label: "Hilfstext eines Spielelementes" },
              { url: "/images/games/lgnd/achievements.jpg", alt: "Bildschirm mit Statistiken und Badges", label: "Errungenschaften und Metriken, über alle Runden aufgezeichnet" }
            ],
            "flip-buttons": true
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 2
          })
        ]),
        _: 1
      }, 8, ["panel"]);
    };
  }
});
const ProjectLGND = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-a507b98d"]]);
const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "ProjectLudum",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(ProjectPanel, {
        id: "projectLudum",
        class: "panel",
        panel: unref(PageType).p_ludum
      }, {
        default: withCtx(() => [
          createVNode(ContentSpacer, {
            top: 0.5,
            hidden: true
          }),
          createVNode(ContentHeadline, {
            "headline-height": 3.7,
            image: "/images/games/payback/PP2.jpg",
            flip: true,
            alt: "Screenshot aus dem Spiel"
          }, {
            default: withCtx(() => [..._cache[0] || (_cache[0] = [
              createTextVNode(" Payback ", -1),
              createBaseVNode("span", null, "Pit", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 2,
            bottom: 0.5
          }),
          _cache[3] || (_cache[3] = createBaseVNode("h3", { style: { "color": "var(--textSecCol)", "font-family": "'Courier New'", "line-height": "1.6rem", "font-size": "1.25rem", "text-align": "justify" } }, [
            createTextVNode(" Als Teil eines 4-Köpfigen Teams durfte ich hier an der Entwicklung dieses kleinen Spieles arbeiten. In Payback Pit sammeln wir Erze aus dem großen Höhlenloch vor uns und verkaufen diese für Geld, während wir uns gegen immer mehr Gegner aus dem Höhlenloch wehren müssen. "),
            createBaseVNode("br"),
            createBaseVNode("br"),
            createTextVNode(" Wir haben das Spiel innerhalb von 3 Tagen in Unreal Engine 5 erstellt. Ich habe sowohl Elemente im Spiel modelliert als auch an der funktionalen Umsetzung von Features mitgewirkt. ")
          ], -1)),
          createVNode(ContentSpacer, {
            top: 0.5,
            bottom: 1.7
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/games/payback/PP1.jpg",
            alt: "Screenshot aus dem Spiel",
            "image-right": true,
            "image-width": 40
          }, {
            content: withCtx(() => [..._cache[1] || (_cache[1] = [
              createBaseVNode("p", null, " Das Spiel kann über unsere itch.io Seite heruntergeladen werden. ", -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/link.png",
                link: "https://ldjam.com/events/ludum-dare/57/payback-pit",
                title: "Webseite besuchen",
                scale: 0.72
              })
            ]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/games/payback/pulley.png",
            alt: "Seilwinde im Spiel",
            "hide-button": true,
            "image-width": 42,
            "image-right": true
          }, {
            content: withCtx(() => [..._cache[2] || (_cache[2] = [
              createBaseVNode("h3", null, "Die Seilwinde", -1),
              createBaseVNode("p", null, [
                createTextVNode(" Die Seilwinde und die Höhle habe ich in Blender modelliert. Da ich mit der Pipeline von Blender nach Unreal schon sehr vertraut war konnte ich die benötigten Einzelteile in Unreal zu einer funktionalen Seilwinde zusammensetzen."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Die Teile der Seilwinde werden durch eine Interpolation der Rotation zum Drehen gebracht. Einzelne Abschnitte auf der Winde werden beim Hinunterlassen und Hinaufziehen des Seils größer und kleiner, um den Effekt eines sich aufwickelndes Seils zu imitieren."),
                createBaseVNode("br"),
                createTextVNode(" Sobald der Korb am unteren Ende angelangt ist werden zufällige Erze erstellt und in den Korb fallen gelassen. Die Erze werden physikalisch simuliert und werden durch eine Art unsichtbaren Verschluss daran gehindert beim Hinaufziehen aus dem Korb zu fallen."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Es war bereits schon möglich mehrere Seilwinden als Platzhalter (durchsichtige Meshes) um das Loch herum zu platzieren und sie als weitere benutzbare Seilwinde freizuschalten, allerdings wurde dieses Feature aus Zeitgründen nicht mehr in den finalen Build aufgenommen. ")
              ], -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImage, {
            image: "/images/games/payback/pulley2.png",
            alt: "Seilwinde mit drehbarer Winde",
            label: "Seilwinde zum Drehen, Seil wird dabei 'aufgewickelt'"
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImage, {
            image: "/images/games/payback/pulley.png",
            alt: "Eingefahrene Seilwinde",
            label: "Seilwinde im hochgezogenen Modus, es können Erze entnommen werden"
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImage, {
            image: "/images/games/payback/PP4.jpg",
            label: "Modellierung der Höhle",
            alt: "Ausgefahrene Seilwinde, Höhle",
            flipped: true
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImage, {
            image: "/images/games/payback/cart.PNG",
            label: "Modellierung einiger weiterer kleiner Assets, wie z.B. das Minecart",
            alt: "Minecart in der Szenerie",
            flipped: true
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentSpacer, {
            top: 2,
            bottom: 0.5
          }),
          _cache[4] || (_cache[4] = createBaseVNode("h3", { style: { "color": "var(--textSecCol)", "font-family": "'Courier New'", "line-height": "1.6rem", "font-size": "1.25rem", "text-align": "justify" } }, " Dev-Team: Alexander May, Lena Würbach, Luca Spirka, Thomas Kontny ", -1)),
          createVNode(ContentSpacer, {
            top: 0.5,
            bottom: 0
          }),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 2
          })
        ]),
        _: 1
      }, 8, ["panel"]);
    };
  }
});
const _sfc_main$3 = /* @__PURE__ */ defineComponent({
  __name: "ProjectSchatten",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(ProjectPanel, {
        id: "projectSchatten",
        class: "panel",
        panel: unref(PageType).p_schatten
      }, {
        default: withCtx(() => [
          createVNode(ContentSpacer, {
            top: 0.5,
            hidden: true
          }),
          createVNode(ContentHeadline, {
            "headline-height": 3.7,
            image: "/images/threed/isdl/pld_stand.jpg",
            flip: true,
            alt: "Der Hauptcharakter erschießt die Antagonistin - Reale Aufnahme vor digitaler Szene"
          }, {
            default: withCtx(() => [..._cache[0] || (_cache[0] = [
              createTextVNode(" Im Schatten ", -1),
              createBaseVNode("span", null, "des Lichts", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 2,
            bottom: 0.5
          }),
          _cache[10] || (_cache[10] = createBaseVNode("h3", { style: { "color": "var(--textSecCol)", "font-family": "'Courier New'", "line-height": "1.6rem", "font-size": "1.25rem", "text-align": "justify" } }, [
            createTextVNode(' Im Rahmen des Moduls "Keying" durfte ich Teil eines großartigen Teams und einer großen Vision werden. Zusammen haben wir es geschafft einen fiktiven Trailer mit etlichen VFX-Shots in die Realität umzusetzen. '),
            createBaseVNode("br"),
            createBaseVNode("br"),
            createTextVNode(" Ich freue mich als Teil des VFX Teams zu diesem sehr großen und schweren Projekt maßgeblich beigetragen zu haben. ")
          ], -1)),
          createVNode(ContentSpacer, {
            top: 0.5,
            bottom: 5.7
          }),
          createVNode(ContentImageSidePanel, { "image-width": -0.6 }, {
            content: withCtx(() => [..._cache[1] || (_cache[1] = [
              createBaseVNode("h3", null, "Keying an der Hochschule Harz", -1),
              createBaseVNode("p", null, [
                createTextVNode(" In diesem Projekt an der Hochschule Harz konnten wir in einem großen Team und mit professioneller Ausstattung einen kurzen Trailer für einen fiktiven Film drehen."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Wir hatten Zugang zu einer großen Greenscreen-Hohlkehle, fester und bewegbarer Ausleuchtung, profesioneller Kameratechnik, Editing Suiten und einer eigenen Renderfarm. Wir konnten gemeinsam im Team die Idee für den Trailer konzipieren, über das Storyboard diskutieren und bereits in der Preproduction den Stil und den Umfang der VFX & Postproduction ausarbeiten. "),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Durch das Aufzeichnen wichtiger Daten beim Dreh (Entfernungen, Abmessungen von Props) konnte unser VFX-Team aus 3 Personen besser die 3D Render auf die Aufnahmen und die Lichtverhältnisse anpassen."),
                createBaseVNode("br"),
                createTextVNode(" Während der Postproduktion konnten wir in Meetings und Absprachen mit den Editoren / dem gesamten Team unsere Arbeitspakete gut verteilen und gewünschte Änderungen vornehmen. ")
              ], -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImage, {
            image: "/images/threed/isdl/keying_bts.jpg",
            alt: "Dreharbeiten im Studio der Hochschule",
            label: "Dreharbeiten im Studio der Hochschule",
            flipped: false
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/threed/isdl/isdl6.jpg",
            alt: "3D-Modellierte Stadtszenerie, jemand fällt von einem Gebäude",
            "image-right": true,
            "image-width": 40
          }, {
            content: withCtx(() => [..._cache[2] || (_cache[2] = [
              createBaseVNode("p", null, [
                createBaseVNode("b", null, "Im Schatten des Lichts"),
                createTextVNode(" kann kostenlos auf YouTube angesehen werden. ")
              ], -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/play.png",
                link: "https://youtu.be/LMM9EbzgYxk",
                scale: 1,
                "use-mask": true,
                title: "Trailer auf YouTube anschauen"
              })
            ]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/threed/isdl/isdl4.jpg",
            alt: "3D-Modellierte Stadtszenerie, ein Gebäude explodiert",
            "image-right": false,
            "image-width": 40
          }, {
            content: withCtx(() => [..._cache[3] || (_cache[3] = [
              createBaseVNode("p", null, " Auf der Webseite unseres Studiengangs Medieninformatik ist ebenso ein Beitrag über dieses Projekt erschienen. ", -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/link.png",
                link: "https://www.medieninformatik.de/im-schatten-des-lichts-keying-an-der-hochschule-harz/",
                scale: 0.72,
                "use-mask": true,
                title: "Beitrag auf der Webseite lesen"
              })
            ]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            flip: true
          }, {
            default: withCtx(() => [..._cache[4] || (_cache[4] = [
              createTextVNode(" Die ", -1),
              createBaseVNode("span", null, "Stadt", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentImage, {
            image: "/images/threed/isdl/city_r_fly.png",
            alt: "Eine digitale Stadtszenerie über die ein Spinner hinwegfliegt",
            copyright: "<b>Modell Gebäude im Zentrum:</b> Yannick Rast",
            pad: 1,
            flipped: true
          }),
          createVNode(ContentSpacer, {
            top: 1,
            bottom: 3
          }),
          createVNode(ContentImageSidePanel, {
            "hide-button": true,
            "image-width": -0.6
          }, {
            content: withCtx(() => [..._cache[5] || (_cache[5] = [
              createBaseVNode("h3", null, "Eine Stadt der Zukunft", -1),
              createBaseVNode("p", null, [
                createTextVNode(" Meine Hauptaufgabe in diesem Projekt war es eine Megacity zu kreieren, welche eine dystopische Zukunftsversion der Stadt "),
                createBaseVNode("a", null, "Wernigerode"),
                createTextVNode(" darstellen soll. Die Stadt bildet sowohl das Hauptelement einiger Shots, ist aber auch in vielen anderen Einstellungen und Kameraschwenks im Hintergrund zu sehen."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Ich habe für die Stadt einige kleinere & leichtgewichtige Assets erstellt, welche dann prozedural über einem Straßenplan der Stadt verteilt wurden. Dazu gehören verschiedenste Gebäude und Objekte wie Kräne und Baustellen. Der Pool aus zu verteilenden Objekten wurde je nach Region angepasst um zum Beispiel einen dichteren Stadtkern oder eine zerstörtere Randzone zu kreieren und genügend Varianz in der Stadt zu schaffen."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Die Stadt wurde ebenso mit einigen Lichtern, leuchtenden Bannern, vielen Dunstwolken und vereinzelten Staubpartikeln lebhafter und düsterer gestaltet. ")
              ], -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/threed/isdl/city_r_intro.png", alt: "Eine Straße führt über die Gebäude einer Stadt entlang, digitale Szene", isOuter: true },
              { url: "/images/threed/isdl/city_r_quality.png", alt: "Weiter blick über die Stadt" },
              { url: "/images/threed/isdl/city_r_topdown_big.png", alt: "Blick von oben auf die dicht besiedelte Stadt" },
              { url: "/images/threed/isdl/city_r_flach_a255.png", alt: "Gebäude in der Stadt verschwinden im Nebel" }
            ],
            "flip-buttons": true
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentImage, {
            image: "/images/threed/isdl/city_vp.PNG",
            alt: "Sicht auf die Stadt aus dem Programm"
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImage, {
            image: "/images/threed/isdl/city_far_vp.PNG",
            label: "Prozedurale Verteilung der Gebäude in 'Distrikten'",
            alt: "Sicht auf die Stadt aus dem Programm",
            flipped: true
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImage, {
            image: "/images/threed/isdl/city_assets_vp.PNG",
            label: "Eigene Assets, welche zum Bau der Stadt benutz wurden",
            alt: "Blick auf die Asset-Gebäude-Library"
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentImage, {
            image: "/images/threed/isdl/city_assets_sh.PNG",
            alt: "Blick auf die Asset-Gebäude-Library"
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentImage, {
            image: "/images/threed/isdl/city_layer.PNG",
            label: "Zugrunde liegender Stadtplan von Wernigerode wird zur Verteilung der Gebäude genutzt",
            alt: "Gebäudeplan mit verteilten Objekten",
            flipped: true
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            flip: true
          }, {
            default: withCtx(() => [..._cache[6] || (_cache[6] = [
              createTextVNode(" Der ", -1),
              createBaseVNode("span", null, "Spinner", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/threed/isdl/spinner_r.png", alt: "Ein Spinner (Fluggerät) im Nebel, 3D", isOuter: true },
              { url: "/images/threed/isdl/spinner_ue_concept.png", label: "Preview aus der Unreal-Engine erstellt", alt: "Spinner im Nebel" },
              { url: "/images/threed/isdl/spinner_r_top.png", alt: "Spinner im Nebel von Oben" },
              { url: "/images/threed/isdl/spinner_leer.png", alt: "Spinner Fenster" },
              { url: "/images/threed/isdl/spinner_citifly_sh.PNG", alt: "Spinner im Nebel / Programmansicht" },
              { url: "/images/threed/isdl/spinner_composit.jpg", alt: "Spinner mit Footage Verbunden", copyright: "<b>Compositing / Color Grading:</b> Aaron Pöhlmann, Malte Kasolowsky" }
            ],
            "flip-buttons": true
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/threed/isdl/spinner_vp_in_scene.PNG", alt: "Spinner, Ansicht aus dem 3D Programm", isOuter: true },
              { url: "/images/threed/isdl/spinner_vp_front.PNG", alt: "Spinner, Ansicht aus dem 3D Programm" },
              { url: "/images/threed/isdl/spinner_vp_back.PNG", alt: "Spinner, Ansicht aus dem 3D Programm" },
              { url: "/images/threed/isdl/spinner_vp_innen.PNG", alt: "Spinner, Ansicht aus dem 3D Programm" },
              { url: "/images/threed/isdl/spinner_vp_top.PNG", alt: "Spinner, Ansicht aus dem 3D Programm" },
              { url: "/images/threed/isdl/spinner_innen.png", alt: "Spinner, Ansicht aus dem 3D Programm" },
              { url: "/images/threed/isdl/spinner_w.PNG", alt: "Spinner, Ansicht aus dem 3D Programm" }
            ],
            "flip-buttons": true
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            flip: true
          }, {
            default: withCtx(() => [..._cache[7] || (_cache[7] = [
              createTextVNode(" Simulationen ", -1),
              createBaseVNode("span", null, "& VDB", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/threed/isdl/isdl4.jpg",
            alt: "Explosion des Karftwerk und des Turmes",
            "hide-button": true,
            "image-width": 42
          }, {
            content: withCtx(() => [..._cache[8] || (_cache[8] = [
              createBaseVNode("h3", null, "Das Kraftwerk", -1),
              createBaseVNode("p", null, [
                createTextVNode(" Ich habe an mehreren Stellen VDB und eigene Simulationen eingesetzt. Besonders aufwendig war die Explosion des Kraftwerks."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Für die Explosion des Kraftwerks habe ich sowohl verschiedenste VDB platziert und das Material angepasst, als auch in Blender eigens erstellte Simulationen verwendet (Gebäudepartikel / Turm vor dem Gebäude)."),
                createBaseVNode("br"),
                createTextVNode(" Die Explosionen mussten alle richtig getimed werden. Um das Gebäude herum passieren außerdem allerhand kleinere Animationen, welche die Gegend belebter wirken lassen. Das Kraftwerk habe ich isoliert vom Rest modelliert und texturiert und danach an einem geeigneten Ort in die Stadt integriert. ")
              ], -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/threed/isdl/krafterk_exploding_r.png", alt: "Explosion am Kraftwerk, 3D", label: "", isOuter: true },
              { url: "/images/threed/isdl/kraftwerk_r_solid.png", alt: "Kraftwerk, 3D" },
              { url: "/images/threed/isdl/kraftwerk_vp.PNG", alt: "Kraftwerk aus dem Programm" },
              { url: "/images/threed/isdl/kraftwerk_sim.png", alt: "Kraftwerk, 3D" },
              { url: "/images/threed/isdl/kraftwerk_vp_fracture.PNG", alt: "Kraftwerk in Teile separiert (Fracturing), aus dem Programm", label: "Einzelne Simulationsobjekte aus dem Objekt herausgelöst" },
              { url: "/images/threed/isdl/kraftwerk_vp_sim.PNG", alt: "Kraftwerk mit simulierten Einzelteilen", label: "Simulation des expoliderenden Gebäudeteils" },
              { url: "/images/threed/isdl/kraftwerk_vp_towers.PNG", alt: "Umfallender Turm vor dem Kraftwerk", label: "Umkippender Turm, Simulation erreicht durch das Anstupsen mit einem Ball" },
              { url: "/images/threed/isdl/kraftwerk_r_fract.png", alt: "Kraftwerk mit simulierten Einzelteilen", label: "Grundlayer im Krfatwerk um das Innenleben des Gebäudes vorzutäuschen" },
              { url: "/images/threed/isdl/kraftwerk_w.PNG", alt: "Kraftwerk in der Wireframe-Ansicht" }
            ],
            "flip-buttons": true
          }),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentImage, {
            image: "/images/threed/isdl/isdl5.jpg",
            alt: "Explosion des Regierungsgebäudes, reale Footage im Vordergrund schaut zum Gebäude",
            label: "Explosion des Regierungsgebäudes",
            pad: 3,
            copyright: "<b>Gebäude Vordergrund:</b> Yannick Rast, Anzor Utzmaev, <b>Keying / Compositing / Grading:</b> Aaron Pöhlmann, Malte Kasolowsky"
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImage, {
            image: "/images/threed/isdl/city_r_destory.jpg",
            alt: "Eine feurige Stadt, es ist viel Rauch und eine Explosion in der Ferne zu sehen",
            label: "Das Feuer in der Stadt - 'Die Revolution beginnt'",
            pad: 3
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            flip: true
          }, {
            default: withCtx(() => [..._cache[9] || (_cache[9] = [
              createTextVNode(" Weitere ", -1),
              createBaseVNode("span", null, "Entwürfe", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/threed/isdl/appartment_comcept.png", alt: "Konzept des Appartments, Blender", label: "Konzeptionierung des Appartments in Blender und Unreal Engine. Diente als Basis für Yannick Rast und Anzor Utzmaev zur richtigen Umsetzung im Trailer", isOuter: true },
              { url: "/images/threed/isdl/arena_concept2.png", alt: "Konzept des Redesaals, Blender", label: "Erstes Konzept des Redesaals" },
              { url: "/images/threed/isdl/city_concept2.png", alt: "Konzeptbild der Stadt, 3D", label: "Erster Entwurf der Stadt (Pitch unserer Idee)" },
              { url: "/images/threed/isdl/mündung.png", alt: "Digitales Bild einer Mündung einer Waffe", label: "Erstelltes Bild zum kaschieren der roten Mündung der Waffe" }
            ],
            "flip-buttons": false
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentSpacer, {
            top: 2,
            bottom: 0.5
          }),
          _cache[11] || (_cache[11] = createBaseVNode("h3", { style: { "color": "var(--textSecCol)", "font-family": "'Courier New'", "line-height": "1.6rem", "font-size": "1.25rem", "text-align": "justify" } }, " Team: Malte Kasolowsky, Hendrik Hihn, Aaron Pöhlmann, Yannick Rast, Anzor Utsmaev, Luca Joel Spirka, Adrian Busche, Johannes Constantin Fritzsch, Timur Bauch, Jessica Krecisz, Severin Tolksdorf, Martin Kreyßig ", -1)),
          createVNode(ContentSpacer, {
            top: 0.5,
            bottom: 0
          }),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 2
          })
        ]),
        _: 1
      }, 8, ["panel"]);
    };
  }
});
const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "ProjectStrings",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(ProjectPanel, {
        id: "projectStrings",
        class: "panel",
        panel: unref(PageType).p_strings
      }, {
        default: withCtx(() => [
          createVNode(ContentSpacer, {
            top: 0.5,
            hidden: true
          }),
          createVNode(ContentHeadline, {
            "headline-height": 3.7,
            image: "/images/threed/son/innenhof_r_links.png",
            flip: true,
            alt: "Innenhof eines Anwesens, Render, 3D"
          }, {
            default: withCtx(() => [..._cache[0] || (_cache[0] = [
              createTextVNode(" Strings of ", -1),
              createBaseVNode("span", null, "Nightmare", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 2,
            bottom: 0.5
          }),
          _cache[7] || (_cache[7] = createBaseVNode("h3", { style: { "color": "var(--textSecCol)", "font-family": "'Courier New'", "line-height": "1.6rem", "font-size": "1.25rem", "text-align": "justify" } }, [
            createTextVNode(" Ein animierter Trailer zum Videospiel "),
            createBaseVNode("a", {
              href: "https://deadbydaylight.com",
              target: "_blank"
            }, '"Dead by Daylight"'),
            createTextVNode(', welcher im Rahmen des Moduls "Motion Capture" entstand. Der Trailer "bewirbt" einen fiktiven DLC mit einem neuen Killer und einem neuen Überlebenden. '),
            createBaseVNode("br"),
            createBaseVNode("br"),
            createTextVNode(" Die Bewegungen wurden mittels Mocap an der Hochschule Harz aufgenommen und mit entsprechend zur Verfügung gestellten Programmen auf die Charaktere übertragen. "),
            createBaseVNode("br"),
            createBaseVNode("br"),
            createTextVNode(" Ich war für das Erstellen der Szenerien (Modell / Texturierung / Animation), das Finden von Kameraperspektiven und Erstellen von Kamerafahrten, die Ausleuchtung und die Integration der Charaktere in die Szene verantwortlich. ")
          ], -1)),
          createVNode(ContentSpacer, {
            top: 0.5,
            bottom: 1.7
          }),
          createVNode(ContentImageSidePanel, { "image-width": -0.6 }, {
            content: withCtx(() => [..._cache[1] || (_cache[1] = [
              createBaseVNode("h3", null, "Mocap im Team", -1),
              createBaseVNode("p", null, [
                createTextVNode(" In einem kreativen Team aus vier Personen konnten wir uns an der Hochschule Harz mit dem Motion Capture Prozess vertraut machen."),
                createBaseVNode("br"),
                createTextVNode(" Es wurde schnell ein Skript geschrieben, auf Basis dessen wir dann die Szenerien und Choreografien ausarbeiten konnten. Die Kampfszenen waren besonders interessant für uns, da die kämpfenden Charaktere nur mit einem einzigen Anzug aufgenommen werden konnten."),
                createBaseVNode("br"),
                createTextVNode(" Ebenso musste sich ein Charakter wie eine Marionette bewegen können. Diese Herausforderungen konnten wir letzten Endes durch gutes Timing und eine provisorische Seilkonstruktion zum aufhängen des Darstellers lösen."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Nachdem die Aufnahmen aufbereitet wurden konnte ich mich an die Zusammenstellung der zu "),
                createBaseVNode("a", null, "rendernen"),
                createTextVNode(" Szenen machen. Da alles nur im digitalen Raum stattfindet mussten wir uns sicher sein welche Vision wir verfolgen."),
                createBaseVNode("br"),
                createTextVNode(" Der rein digitale Workspace brachte den Vorteil, das ich in der Zusammenstellung der Aufnahmen und der von mir erstellten Szenerie viel experimentieren konnte und neue, interessante Einstellungen finden konnte und somit das Feeling des Trailers deutlich beeinflussen konnte."),
                createBaseVNode("br"),
                createTextVNode(" Ich konnte schnell und iterativ aus den bereitgestellten Aufnahmen wählen (welche auch bereits mit Charaktermodellen und einem Rig verbunden waren), die Kamerawinkel und Kamerabewegungen auswählen und an einer guten Beleuchtung arbeiten."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Durch die begrenzte Zeit zum Ende des Projektes konnte jede Szene nur so lange wie nötig gerendert werden und musste dann weiter an die Nachbearbeitung ausgeliefert werden. Das Flackern in einigen Szenen ist dem Denoising von Blender geschuldet und hätte nur durch längere Renderzeit pro Frame gelöst werden können. Insgesamt waren wir jedoch sehr zufrieden mit den visuellen Ergebnissen, welche dann im Schnitt zusammengefügt und weiter nachbearbeitet wurden. ")
              ], -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            flip: true
          }, {
            default: withCtx(() => [..._cache[2] || (_cache[2] = [
              createTextVNode(" Das ", -1),
              createBaseVNode("span", null, "Anwesen", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentImageSidePanel, { "image-width": -0.6 }, {
            content: withCtx(() => [..._cache[3] || (_cache[3] = [
              createBaseVNode("h3", null, "Erstellen der Umgebung", -1),
              createBaseVNode("p", null, [
                createTextVNode(' Der Schauplatz unseres Trailers ist ein verlassenes Anwesen im toskanischen Landhausstil. Auch wenn wir das Gebäude nur kurz von Außen sehen, habe ich mir die zusätzliche Herausforderung gestellt, nicht nur eine Art "Pappkulisse", sondern ein zusammenhängendes Gebäude zu erstellen.'),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(' Das Gebäude steht inmitten eines Waldes. Die Objekte (Baumstämme, Steine, Blätter) wurden alle selbst Modelliert und prozedural in der Gegend verteilt. Für die Bäume habe ich das "Sapling Tree Gen" Add-On für Blender benutzt. Generell wurde für diese Szenerie kein Kitbash benutzt, ich habe alle Objekte selbst modelliert.'),
                createBaseVNode("br"),
                createTextVNode(" Die Texturen wurden aus verschiedensten frei verfügbaren Quellen zusammengetragen. In einigen Fällen wurden Texturen prozedural gemischt oder erstellt (z.B. Wände)."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Ich habe hauptsächlich auf die Vorderseite des Gebäudes, den Innenhof und das kleine Zimmer im Dachgeschoss Acht gegeben, da dies die Hauptschauplätze des Trailers sind. ")
              ], -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/threed/son/haus_r_view.png", alt: "Anwesen, Filmszene", label: "Das Anwesen ist der Ort, an dem der gesamte Trailer stattfindet", copyright: "<b>Charakter:</b> Mandy Rothe", isOuter: true },
              { url: "/images/threed/son/haus_r_far2.png", alt: "Anwesen im Hellen, weite Ansicht" },
              { url: "/images/threed/son/haus_r_far.png", alt: "Anwesen im Hellen, Vollbild" },
              { url: "/images/threed/son/son2.jpg", alt: "Hauptcharakter in der Waldszenerie", copyright: "<b>Charakter:</b> Mandy Rothe", label: "Umliegende Waldszenerie mit Rasen und verteilten Objekten" },
              { url: "/images/threed/son/haus_vp_view.png", alt: "Haus von Vorne, Ansicht in Blender" },
              { url: "/images/threed/son/instances_vp.PNG", alt: "Ansicht Gebäudeteil, Ansicht in Blender", label: "Intesive Nutzung von Instancing zum Schnellen Bauen von Gebäudeteilen" },
              { url: "/images/threed/son/haus_concept2.png", alt: "Gebäude von vorne, ganz, Weiß" }
            ],
            "flip-buttons": true
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/threed/son/innenhof_r.png", alt: "Innenof, shaded", label: "Der Innenhof ist der Hauptschauplatz des Kampfes", isOuter: true },
              { url: "/images/threed/son/innenhof_r2.png", alt: "Innenhof, von vorne, shaded" },
              { url: "/images/threed/son/innenhof_r_rechts.png", alt: "Innenhof im Dunkeln, Seite" },
              { url: "/images/threed/son/dachregion_r.png", alt: "Innenhof im Film, Charakter steht über Puppe", copyright: "<b>Charaktere:</b> Mandy Rothe, Sebastian Siebert" },
              { url: "/images/threed/son/innenhof_vp.PNG", alt: "Innenhof, weite Ansicht, Ansicht in Blender" },
              { url: "/images/threed/son/innenhof_vp_top.PNG", alt: "Innenhof von Oben, Ansicht in Blender" }
            ],
            "flip-buttons": true
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/threed/son/raum_oben_r.png", alt: "Raum des Puppenspielers, Render", label: "Kammer des Puppenspielers", copyright: "<b>Charaktere:</b> Dennis Voigt, Mandy Rothe", isOuter: true },
              { url: "/images/threed/son/werkzeug_r.png", alt: "Werkzeug des Puppenspielers, Render" },
              { url: "/images/threed/son/innenraum_vp.PNG", alt: "Raum des Puppenspielers, Ansicht in Blender", copyright: "<b>Charaktere:</b> Dennis Voigt, Mandy Rothe" }
            ],
            "flip-buttons": true
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            flip: true
          }, {
            default: withCtx(() => [..._cache[4] || (_cache[4] = [
              createTextVNode(" Kampf & ", -1),
              createBaseVNode("span", null, "Interaktion", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentImageSidePanel, { "image-width": -0.6 }, {
            content: withCtx(() => [..._cache[5] || (_cache[5] = [
              createBaseVNode("h3", null, "Die Charaktere und die Welt", -1),
              createBaseVNode("p", null, [
                createTextVNode(" Die Charaktere müssen im Trailer Türen auf machen, Taschenlampen halten und fallen lassen, gegeneinander kämpfen, an anderen Charakteren zerren und vieles mehr. Animationen, die in unterschiedlichen Takes gedreht wurden, mussten jetzt wieder miteinander (und im Kontext einer konsistenten Umwelt) interagieren."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Das schwierigste an diesem Projekt war es die Animationen richtig miteinander interagieren zu lassen. Dank einer bereits vorliegenden Preview eines Kommilitonen war es einfacher, sich einen Überblick über die Choreografie zu machen. Sie allerdings in der Umgebung richtig zu verorten und für die Kamera ordentlich einzufangen stellte sich als die größte Schwierigkeit heraus."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" Zum Glück konnten kleinere Differenzen in Höhen und Timing durch simple Korrekturen in Posen oder Timing ausgebessert werden. Außerdem starteten und stoppten alle Animationen zu leicht unterschiedlichen Zeiten. Ich musste also stets die Kamerawinkel so anpassen, das wir nicht nur die Action in einer spannenden Komposition sehen können, sondern gleichzeitig auch ungewollte Sprünge zwischen Animationen aus dem Bild halten."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(" In den Kampfszenen mussten die Schläge ungefähr zur richtigen Zeit den Gegner treffen um einen gewissen Impact zu erzeugen. Auch hier mussten die Kameraeinstellungen und viele der Schnitte um die Anfangs- und Endzeiten der Animationen angepasst werden."),
                createBaseVNode("br"),
                createBaseVNode("br"),
                createTextVNode(' Die Charaktere interagieren außerdem mit ihrer Umwelt. So musste unter anderem der Fall einer Taschenlampe oder das Öffnen einer Tür animiert werden. Das "Werkzeug" des Puppenspielers musste ebenso der Handbewegung richtig folgen. Vieles konnte durch simples Parenting oder einfache Animationen & Simulationen gelöst werden. ')
              ], -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImage, {
            image: "/images/threed/son/door_r_interact.png",
            alt: "Charakter öffnet Tür und leuchtet hinein, Render",
            label: "Interaktion zwischen Charakter und Tür",
            copyright: "<b>Charakter:</b> Mandy Rothe"
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImage, {
            image: "/images/threed/son/character_vp.PNG",
            ",": "",
            alt: "Charakter in der ersten Szene, Ansicht in Blender",
            label: "Charakter hält die Taschenlampe",
            copyright: "<b>Charakter:</b> Mandy Rothe"
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImage, {
            image: "/images/threed/son/pull_r.png",
            alt: "Puppe greift nach Bein vom Charakter, Render",
            label: "Charakter wird von Puppe gezogen, Abpassen der Animationen aufeinander für flüssiges Feeling",
            copyright: "<b>Charaktere:</b> Sebastian Siebert, Mandy Rothe"
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentImage, {
            image: "/images/threed/son/ready_r.png",
            alt: "CHarakter begibt sich in Kampfhaltung, Render",
            copyright: "<b>Charakter:</b> Mandy Rothe"
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentImage, {
            image: "/images/threed/son/son4.jpg",
            alt: "Charakter und Puppe kämpfen gegeneinander, Render",
            label: "Abpassen der Animationen zum Erzeugen von 'Hits'",
            copyright: "<b>Charaktere:</b> Sebastian Siebert, Mandy Rothe"
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentImage, {
            image: "/images/threed/son/son6.jpg",
            alt: "Puppenspieler bewegt sein Werkzeug, Render",
            label: "Interaktion des Puppenspielers mit seinem Werkzeug",
            copyright: "<b>Charakter:</b> Dennis Voigt"
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentImage, {
            image: "/images/threed/son/unten_r.png",
            alt: "Charakter tritt auf uns hinab, Render",
            copyright: "<b>Charakter:</b> Mandy Rothe",
            label: "Finden von interessanten und passenden Kameraeinstellungen"
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentImage, {
            image: "/images/threed/son/connect_r.png",
            alt: "Kampf vom Charakter und Puppe",
            copyright: "<b>Charaktere:</b> Mandy Rothe, Sebastian Siebert"
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentImage, {
            image: "/images/threed/son/flash_r.png",
            alt: "Taschenlampe rollt nach einem F all auf dem Boden umher, Render",
            label: "Simulation des organischen Falls der Taschenlampe"
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            flip: true
          }, {
            default: withCtx(() => [..._cache[6] || (_cache[6] = [
              createTextVNode(" Weitere ", -1),
              createBaseVNode("span", null, "Einblicke", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentImageSlider, {
            images: [
              { url: "/images/threed/son/haus_concept.png", alt: "Innenhof in der Anfangsphase", label: "Innenhof in der Konzeptionierungsphase", isOuter: true },
              { url: "/images/threed/son/haus_in_concept.png", alt: "Innenhof in der Anfangsphase", label: "Innenhof im Bau" },
              { url: "/images/threed/son/haus_in_concept2.png", alt: "Innenhof in der Anfangsphase" },
              { url: "/images/threed/son/fight_preview.jpg", alt: "", copyright: "<b>Ersteller: Dennis Voigt</b>", label: "Vom Komilitonen erstellte Preview zum Verständnis der erhaltenen Animationspakete" }
            ],
            "flip-buttons": true
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentSpacer, {
            top: 2,
            bottom: 0.5
          }),
          _cache[8] || (_cache[8] = createBaseVNode("h3", { style: { "color": "var(--textSecCol)", "font-family": "'Courier New'", "line-height": "1.6rem", "font-size": "1.25rem", "text-align": "justify" } }, " Team: Mandy Rothe, Sebastian Siebert, Dennis Voigt, Luca Joel Spirka ", -1)),
          createVNode(ContentSpacer, {
            top: 0.5,
            bottom: 0
          }),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 2
          })
        ]),
        _: 1
      }, 8, ["panel"]);
    };
  }
});
const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "ProjectAll",
  setup(__props) {
    return (_ctx, _cache) => {
      return openBlock(), createBlock(ProjectPanel, {
        id: "allPanel",
        class: "panel",
        panel: unref(PageType).p_all
      }, {
        default: withCtx(() => [
          createVNode(ContentSpacer, {
            top: 0.5,
            hidden: true
          }),
          createVNode(ContentHeadline, {
            "headline-height": 3.7,
            image: "/images/threed/dune/saal_r.PNG",
            flip: true,
            alt: "Der Hauptcharakter erschießt die Antagonistin - Reale Aufnahme vor digitaler Szene"
          }, {
            default: withCtx(() => [..._cache[0] || (_cache[0] = [
              createTextVNode(" Alle ", -1),
              createBaseVNode("span", null, "Projekte", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 2,
            bottom: 0.5
          }),
          _cache[11] || (_cache[11] = createBaseVNode("h3", { style: { "color": "var(--textSecCol)", "font-family": "'Courier New'", "line-height": "1.6rem", "font-size": "1.25rem", "text-align": "justify" } }, " Eine Übersicht über alle größeren Projekte über die ich in diesem Portfolio geschrieben habe. ", -1)),
          createVNode(ContentSpacer, {
            top: 0.5,
            bottom: 3.7
          }),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            flip: true
          }, {
            default: withCtx(() => [..._cache[1] || (_cache[1] = [
              createTextVNode(" 3D & ", -1),
              createBaseVNode("span", null, "Animation", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/threed/isdl/isdl.jpg",
            alt: "3D-Modellierte Stadtszenerie, jemand fällt von einem Gebäude",
            "image-right": true,
            "image-width": 40
          }, {
            content: withCtx(() => [..._cache[2] || (_cache[2] = [
              createBaseVNode("p", { style: { "margin": "0", "font-size": "1.6rem" } }, [
                createBaseVNode("b", null, [
                  createTextVNode("Im Schatten "),
                  createBaseVNode("span", null, "des Lichts")
                ])
              ], -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/eye.png",
                onClick: () => unref(OpenPage)(unref(PageType).p_schatten),
                scale: 0.8,
                "use-mask": true,
                title: "Zu diesem Projekt springen"
              }, null, 8, ["onClick"])
            ]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/threed/dune/harvester_long.png",
            alt: "3D-Modellierte Stadtszenerie, jemand fällt von einem Gebäude",
            "image-right": false,
            "image-width": 40
          }, {
            content: withCtx(() => [..._cache[3] || (_cache[3] = [
              createBaseVNode("p", { style: { "margin": "0", "font-size": "1.6rem" } }, [
                createBaseVNode("b", null, [
                  createTextVNode("Dune - "),
                  createBaseVNode("span", null, "Nacht auf Arrakis")
                ])
              ], -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/eye.png",
                onClick: () => unref(OpenPage)(unref(PageType).p_dune),
                scale: 0.8,
                "use-mask": true,
                title: "Zu diesem Projekt springen"
              }, null, 8, ["onClick"])
            ]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/threed/son/son3.jpg",
            alt: "3D-Modellierte Stadtszenerie, jemand fällt von einem Gebäude",
            "image-right": true,
            "image-width": 40
          }, {
            content: withCtx(() => [..._cache[4] || (_cache[4] = [
              createBaseVNode("p", { style: { "margin": "0", "font-size": "1.6rem" } }, [
                createBaseVNode("b", null, [
                  createTextVNode("Strings of "),
                  createBaseVNode("span", null, "Nightmare")
                ])
              ], -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/eye.png",
                onClick: () => unref(OpenPage)(unref(PageType).p_strings),
                scale: 0.8,
                "use-mask": true,
                title: "Zu diesem Projekt springen"
              }, null, 8, ["onClick"])
            ]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            flip: true
          }, {
            default: withCtx(() => [..._cache[5] || (_cache[5] = [
              createTextVNode(" Film ", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/threed/dune/harvester_long.png",
            alt: "3D-Modellierte Stadtszenerie, jemand fällt von einem Gebäude",
            "image-right": false,
            "image-width": 40
          }, {
            content: withCtx(() => [..._cache[6] || (_cache[6] = [
              createBaseVNode("p", { style: { "margin": "0", "font-size": "1.6rem" } }, [
                createBaseVNode("b", null, [
                  createTextVNode("Der "),
                  createBaseVNode("span", null, "Kuriositär")
                ])
              ], -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/eye.png",
                onClick: () => unref(OpenPage)(unref(PageType).film, false, "kurios"),
                scale: 0.8,
                "use-mask": true,
                title: "Zu diesem Projekt springen"
              }, null, 8, ["onClick"])
            ]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentHeadline, {
            "headline-height": 5.7,
            flip: true
          }, {
            default: withCtx(() => [..._cache[7] || (_cache[7] = [
              createTextVNode(" Games & ", -1),
              createBaseVNode("span", null, "Code", -1)
            ])]),
            _: 1
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/games/payback/pulley.png",
            alt: "3D-Modellierte Stadtszenerie, jemand fällt von einem Gebäude",
            "image-right": true,
            "image-width": 40
          }, {
            content: withCtx(() => [..._cache[8] || (_cache[8] = [
              createBaseVNode("p", { style: { "margin": "0", "font-size": "1.6rem" } }, [
                createBaseVNode("b", null, [
                  createTextVNode("Payback "),
                  createBaseVNode("span", null, "Pit")
                ])
              ], -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/eye.png",
                onClick: () => unref(OpenPage)(unref(PageType).games, false, "ludum"),
                scale: 0.8,
                "use-mask": true,
                title: "Zu diesem Projekt springen"
              }, null, 8, ["onClick"])
            ]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/games/lgnd/game.jpg",
            alt: "3D-Modellierte Stadtszenerie, jemand fällt von einem Gebäude",
            "image-right": false,
            "image-width": 40
          }, {
            content: withCtx(() => [..._cache[9] || (_cache[9] = [
              createBaseVNode("p", { style: { "margin": "0", "font-size": "1.6rem" } }, [
                createBaseVNode("b", null, "LGND")
              ], -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/eye.png",
                onClick: () => unref(OpenPage)(unref(PageType).games, false, "lgnd"),
                scale: 0.8,
                "use-mask": true,
                title: "Zu diesem Projekt springen"
              }, null, 8, ["onClick"])
            ]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            top: 3,
            hidden: true
          }),
          createVNode(ContentImageSidePanel, {
            image: "/images/games/bubblr/bubblr_desktop.PNG",
            alt: "3D-Modellierte Stadtszenerie, jemand fällt von einem Gebäude",
            "image-right": true,
            "image-width": 40
          }, {
            content: withCtx(() => [..._cache[10] || (_cache[10] = [
              createBaseVNode("p", { style: { "margin": "0", "font-size": "1.6rem" } }, [
                createBaseVNode("b", null, "Bubblr")
              ], -1)
            ])]),
            button: withCtx(() => [
              createVNode(CoinSurface, {
                image: "/images/icons/eye.png",
                onClick: () => unref(OpenPage)(unref(PageType).games, false, "ggj"),
                scale: 0.8,
                "use-mask": true,
                title: "Zu diesem Projekt springen"
              }, null, 8, ["onClick"])
            ]),
            _: 1
          }),
          createVNode(ContentSpacer, {
            hidden: false,
            top: 1.85,
            bottom: 2.7
          }),
          createVNode(ContentSpacer, {
            hidden: true,
            top: 2
          })
        ]),
        _: 1
      }, 8, ["panel"]);
    };
  }
});
const _hoisted_1 = { id: "wrapper" };
const _hoisted_2 = { id: "contentPanel" };
const _hoisted_3 = { class: "empty" };
const _hoisted_4 = ["show"];
const _hoisted_5 = { class: "menuOuter" };
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "App",
  setup(__props) {
    const componentMap = {
      trailer: TrailerPanel,
      about: AboutPanel,
      threed: _sfc_main$b,
      film: _sfc_main$e,
      games: _sfc_main$d,
      impressum: ImpressumPanel,
      p_schatten: _sfc_main$3,
      p_kurios: _sfc_main$6,
      p_ludum: _sfc_main$4,
      p_ggj: _sfc_main$7,
      p_strings: _sfc_main$2,
      p_lgnd: ProjectLGND,
      p_dune: _sfc_main$8,
      p_all: _sfc_main$1
    };
    onMounted(() => {
      const page = getPageFromUrl();
      const sect = getSectionFromUrl();
      if (page) OpenPage(page, false, sect);
      else OpenPage(PageType.trailer);
      window.addEventListener("popstate", () => {
        const p2 = getPageFromUrl();
        const s = getSectionFromUrl();
        console.log(p2);
        if (p2) OpenPage(p2, true, s);
      });
    });
    function getPageFromUrl() {
      const params = new URLSearchParams(window.location.search);
      return params.get("page");
    }
    function getSectionFromUrl() {
      const params = new URLSearchParams(window.location.search);
      return params.get("section");
    }
    return (_ctx, _cache) => {
      return openBlock(), createElementBlock("div", _hoisted_1, [
        createBaseVNode("div", _hoisted_2, [
          (openBlock(true), createElementBlock(Fragment, null, renderList(unref(Visited), (item) => {
            return openBlock(), createBlock(resolveDynamicComponent(componentMap[item]), { hide: true });
          }), 256)),
          createVNode(TrailerPanel),
          createBaseVNode("div", _hoisted_3, [
            createVNode(Throbber)
          ]),
          createBaseVNode("div", {
            id: "loadingErrorPanel",
            show: unref(HasLoadingError)
          }, [
            _cache[1] || (_cache[1] = createBaseVNode("p", null, " Es gab Probleme mit dem Laden von Inhalten. Die Seite wird womöglich nicht richtig dargestellt. ", -1)),
            createBaseVNode("a", {
              class: "close",
              onClick: _cache[0] || (_cache[0] = ($event) => unref(HideLoadingError)())
            }, "Schließen x")
          ], 8, _hoisted_4)
        ]),
        createBaseVNode("div", _hoisted_5, [
          createVNode(MenuPanel)
        ])
      ]);
    };
  }
});
const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-c4952a20"]]);
createApp(App).mount("#app");
