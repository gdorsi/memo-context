import { createMemoContext, useMemoContext } from "../memo-context";
import React, { useState, useEffect, useLayoutEffect, memo } from "react";
import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";

describe("useMemoContext", () => {
  it("should update only the component that depends to the changed value", () => {
    const ctx = createMemoContext();

    const fooSpy = jest.fn();
    const barSpy = jest.fn();

    const ComponentFoo = memo(() => {
      const value = useMemoContext(ctx);

      fooSpy(value.foo);

      return null;
    });
    const ComponentBar = memo(() => {
      const value = useMemoContext(ctx);

      barSpy(value.bar);

      return null;
    });

    let update;

    function Provider() {
      const [value, setValue] = useState({ foo: 1, bar: 1 });

      update = setValue;

      return (
        <ctx.Provider value={value}>
          <ComponentFoo></ComponentFoo>
          <ComponentBar></ComponentBar>
        </ctx.Provider>
      );
    }

    render(<Provider></Provider>);

    act(() => update({ foo: 2, bar: 1 }));

    expect(fooSpy).toHaveBeenCalledTimes(2);
    expect(barSpy).toHaveBeenCalledTimes(1);
  });

  it("should skip updates when the component has already been rendered with the last value", () => {
    const ctx = createMemoContext();

    const spy = jest.fn();

    const Component = memo(() => {
      const value = useMemoContext(ctx);

      spy(value.foo);

      return null;
    });

    let update;

    function Provider() {
      const [value, setValue] = useState({ foo: 1 });

      update = setValue;

      return (
        <ctx.Provider value={value}>
          <Component foo={value.foo}></Component>
        </ctx.Provider>
      );
    }

    render(<Provider></Provider>);

    act(() => update({ foo: 2 }));

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("the value ref should change only when the source value ref is changed", () => {
    const ctx = createMemoContext();

    const spy = jest.fn();

    const Component = () => {
      const value = useMemoContext(ctx);

      useEffect(() => {
        spy(value.bar);
      }, [value]);

      return null;
    };

    let update;
    let rerender;

    function Provider() {
        const [value, setValue] = useState({ foo: 1 });
        [,rerender] = useState(1);

        update = setValue;

      return (
        <ctx.Provider value={value}>
          <Component></Component>
        </ctx.Provider>
      );
    }

    render(<Provider></Provider>);

    act(() => rerender(2));
    act(() => update({ foo: 1 }));

    expect(spy).toHaveBeenCalledTimes(2);
  });
});
