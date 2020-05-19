import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
  createElement,
  useLayoutEffect,
} from "react";

const actualDeps = Symbol();

function Store() {
  const listeners = new Set();

  let proxy = {};
  let newKeys = false;
  let changed = false;

  const instance = {
    s: subscribe,
    e: emit,
    u: update,
    p: proxy,
    v: undefined,
  };

  function update(nextValue) {
    if (nextValue === instance.v) return;

    changed = true;

    for (const key in nextValue) {
      if (!(key in proxy)) {
        Object.defineProperty(proxy, key, {
          get: function () {
            this[actualDeps].add(key);
            return this[actualValue][key];
          },
        });
        newKeys = true;
      }
    }

    instance.v = nextValue;
  }

  function subscribe(callback) {
    listeners.add(callback);

    return () => listeners.delete(callback);
  }

  function emit() {
    if (!changed) return;

    listeners.forEach((callback) => {
      callback(newKeys);
    });

    newKeys = false;
    changed = false;
  }

  return instance;
}

const actualValue = Symbol();

function Tracker() {
  const deps = new Set();

  let prevValue;

  const instance = {
    v: prevValue,
    t: track,
  };

  function track(value, proxy) {
    if (value === prevValue) return false;

    let changed = false;

    deps.forEach((key) => {
      if (!changed) changed = value[key] !== prevValue[key];
    });

    //Creates a new reference to make equality checks work
    instance.v = Object.create(proxy);
    instance.v[actualValue] = value;
    instance.v[actualDeps] = deps;

    prevValue = value;

    return changed;
  }

  return instance;
}

export function createMemoContext(defaultValue) {
  const c = createContext(defaultValue);

  const instance = {
    c,
    Provider,
    Consumer,
    d: defaultValue,
  };

  function Provider({ value, children }) {
    const store = useMemo(Store, []);

    store.u(value);
    useLayoutEffect(store.e);

    return createElement(c.Provider, { value: store }, children);
  }

  function Consumer({ children }) {
    return children(useMemoContext(instance));
  }

  return instance;
}

export function useMemoContext(context) {
  const store = useContext(context.c);

  const tracker = useMemo(() => (store !== context.d ? Tracker() : undefined), [
    store,
  ]);

  const requestUpdate = useState()[1];

  tracker && tracker.t(store.v, store.p);

  useEffect(
    () =>
      tracker &&
      store.s((forceRender) => {
        if (tracker.t(store.v, store.p) || forceRender) {
          requestUpdate(tracker.v);
        }
      }),
    [tracker]
  );

  return tracker ? tracker.v : store;
}
