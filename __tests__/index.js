import { createMemoContext, useMemoContext } from "../memo-context";
import React, { useState, useEffect, memo } from "react";
import { render } from "@testing-library/react";
import { act } from "react-dom/test-utils";

describe("useMemoContext", () => {
  it("updates only the component that depends to the changed value", () => {
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

  it("skips updates when the component has already been rendered by reiceving new props", () => {
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

  it("updates the returned reference only when the context value is changed", () => {
    const ctx = createMemoContext();

    const spy = jest.fn();
    let rerender;

    const Component = memo(() => {
      const value = useMemoContext(ctx);
      [, rerender] = useState({});

      useEffect(() => {
        spy(value.bar);
      }, [value]);

      return null;
    });

    let update;

    function Provider() {
      const [value, setValue] = useState({ foo: 1 });

      update = setValue;

      return (
        <ctx.Provider value={value}>
          <Component></Component>
        </ctx.Provider>
      );
    }

    render(<Provider></Provider>);

    act(() => rerender({}));
    act(() => update({ foo: 1 }));
    act(() => rerender({}));

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it("preserves the referential transparency", () => {
    const ctx = createMemoContext();

    const values = [];

    const Component = memo(() => {
      const value = useMemoContext(ctx);

      value.foo; //Subscribes to foo
      values.push(value);

      return null;
    });

    let update;

    function Provider() {
      const [value, setValue] = useState({ foo: {} });

      update = setValue;

      return (
        <ctx.Provider value={value}>
          <Component></Component>
        </ctx.Provider>
      );
    }

    render(<Provider></Provider>);

    act(() => update({ foo: {} }));

    expect(values[0].foo).not.toBe(values[1].foo);
  });

  it("works without a Provider", () => {
    const defaultValue = { foo: {} };
    const ctx = createMemoContext(defaultValue);

    const spy = jest.fn();

    const Component = memo(() => {
      const value = useMemoContext(ctx);

      spy(value);

      return null;
    });

    render(<Component></Component>);

    expect(spy).toHaveBeenCalledWith(defaultValue);
  });
});
//TODO Consumer tests
//TODO defaultValue beahvoir
