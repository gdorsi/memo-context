# Memo Context

The memo wrapper for React Context API

## Installation

```sh
$ npm install memo-context
```

## Example

Memo context avoids unnecessary re-renders by tracking the used properties.

```javascript
import React, { memo, useState } from "react";

const formCtx = createMemoContext();

function useMyForm() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");

  return {
    name,
    setName,
    surname,
    setSurname
  };
}

//re-rendered only when name or setName changes
const Name = memo(() => {
  const form = useMemoContext(formCtx);

  return (
    <label>
      Name:
      <input
        value={form.name}
        onChange={evt => form.setName(evt.target.value)}
      />
    </label>
  );
});

//re-rendered only when surname or setSurame changes
const Surname = memo(() => {
  const form = useMemoContext(formCtx);

  return (
    <label>
      Surname:
      <input
        value={form.surname}
        onChange={evt => form.setSurname(evt.target.value)}
      />
    </label>
  );
});

export default function MyForm({ children }) {
  const form = useMyForm();

  return (
    <formCtx.Provider value={form}>
      <Name />
      <Surname />
    </formCtx.Provider>
  );
}

```
[Try this on CodeSandbox](https://codesandbox.io/s/memo-context-simple-form-j1041?file=/src/App.js)

