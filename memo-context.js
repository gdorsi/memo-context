import {
  createContext,
  useContext,
  useMemo,
  useEffect,
  useState,
  createElement,
  useLayoutEffect,
} from "react";

function Store() {
  const listeners = new Set();

  const instance = {
    s: subscribe,
    e: emit,
    v: undefined,
  };

  function subscribe(callback) {
    listeners.add(callback);

    return () => listeners.delete(callback);
  }

  function emit() {
    listeners.forEach((callback) => {
      callback(instance.v);
    });
  }

  return instance;
}

function Tracker(initialValue) {
  const deps = new Set();
  const proxy = {};

  const instance = {
    v: proxy,
    t: track,
  };

  function track(nextValue) {
    const value = instance.v[actualValue];

    if (value === nextValue) return false;

    let changed = false;

    for (const key in nextValue) {
      if (!(key in proxy)) {
        Object.defineProperty(proxy, key, {
          get: function () {
            deps.add(key);
            return this[actualValue][key];
          },
        });
        changed = true;
      }
    }

    if (!changed) {
      deps.forEach((key) => {
        if (!changed) changed = value[key] !== nextValue[key];
      });
    }

    //Creates a new reference to make equality checks work
    instance.v = Object.create(proxy);
    instance.v[actualValue] = nextValue;

    return changed;
  }

  track(initialValue);

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

    store.v = value;
    useLayoutEffect(() => {
      store.e();
    });

    return createElement(c.Provider, { value: store }, children);
  }

  function Consumer({ children }) {
    return children(useMemoContext(instance));
  }

  return instance;
}

export function useMemoContext(context) {
  const store = useContext(context.c);

  const tracker = useMemo(
    () => (store !== context.d ? Tracker(store.v) : undefined),
    [store]
  );

  const requestUpdate = useState()[1];

  tracker && tracker.t(store.v);

  useEffect(
    () =>
      tracker &&
      store.s((value) => {
        if (tracker.t(value)) {
          requestUpdate(tracker.v);
        }
      }),
    [tracker]
  );

  return tracker ? tracker.v : store;
}
