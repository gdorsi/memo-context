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

  const api = {
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
      callback(api.v);
    });
  }

  return api;
}

function Tracker(initialValue) {
  const deps = new Set();
  //TODO think about immutability
  const proxy = {};
  let value;

  const api = {
    v: proxy,
    t: track,
  };

  function track(nextValue) {
    if (value === nextValue) return false;

    let changed = false;

    for (const key in nextValue) {
      if (!(key in proxy)) {
        Object.defineProperty(proxy, key, {
          get: () => {
            deps.add(key);
            return value[key];
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
    api.v = Object.create(proxy);

    value = nextValue;

    return changed;
  }

  track(initialValue);

  return api;
}

//TODO Handle defaultValue as well
export function createMemoContext(defaultValue) {
  const c = createContext(defaultValue);

  function Provider({ value, children }) {
    const store = useMemo(Store, []);

    store.v = value;
    useLayoutEffect(() => {
      store.e();
    });

    return createElement(c.Provider, { value: store }, children);
  }

  return {
    c,
    Provider,
  };
}

export function useMemoContext(context) {
  const store = useContext(context.c);

  const tracker = useMemo(() => Tracker(store.v), []);

  const requestUpdate = useState()[1];

  tracker.t(store.v);

  useEffect(
    () =>
      store.s((value) => {
        if (tracker.t(value)) {
          requestUpdate(tracker.v);
        }
      }),
    []
  );

  return tracker.v;
}
