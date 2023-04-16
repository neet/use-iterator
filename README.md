# use-iterator

[![npm](https://img.shields.io/npm/v/use-iterator.svg)](https://www.npmjs.com/package/use-iterator)
[![CI](https://github.com/neet/use-iterator/actions/workflows/ci.yml/badge.svg)](https://github.com/neet/use-iterator/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/neet/use-iterator/branch/main/graph/badge.svg?token=TH4BNCOPMB)](https://codecov.io/gh/neet/use-iterator)

React hooks collection for JavaScript's Iterator/generator.

- [Examples](https://github.com/neet/use-iterator/tree/main/examples)

#### `useForAwaitOf(asyncIterable, deps)`

Subscribes to the `asyncIterable` specified in the argument and as soon as a promise is resolved, immediately starts to await the next promise.

This is similar to `for-await-of` syntax of JavaScript, but the results are wrapped in React APIs so components will be updated whenever the result changes.

```jsx
import { on } from 'events-to-async';

const changeEvent = on((handler) => {
  const elm = document.getElementById('text_field');
  elm?.addEventListener('change', handler);
  return () => elm?.removeEventListener('change', handler);
});

const App = () => {
  // subscribe to the change events from #text_field
  const result = useForAwaitOf(changeEvent);

  // latest change event from #text_field
  return <span>{result.value}</span>;
};
```

> Note that this example uses an additional module [`events-to-async`](https://npm.im/events-to-async) to convert `Event` objects into `AsyncIterator`.

#### `useGenerator(generator, deps)`

Wraps generator function into a React state. You can call `next()` to retrieve the next value, and read the latest value from the iterator via `value`.

```js
const App = () => {
  const result =
    useGenerator <
    string >
    (function* () {
      yield "Let's get started";
      yield 'Choose your username';
      yield 'Upload the avatar';
    },
    []);

  if (result.done) {
    return <div>Tutorial completed!</div>;
  }

  return (
    <div>
      <h2>{result.value}</h2>

      <button onClick={() => result.next()}>Next</button>
    </div>
  );
};
```

#### `useAsyncGenerator(generator, deps)`

Wraps async generator function into a React state. You can call `next()` to retrieve the next value, and read the latest value from the iterator via `value`.

This is similar to `useGenerator` described above, but with `async` you can return `Promise`s from the generator. This would be useful for sequential network requests such as Web APIs with pagination.

```js

const App = () => {
  const result = useAsyncGenerator<string>(function* () {
    yield fetch('https://example.com?page=1');
    yield fetch('https://example.com?page=2');
    yield fetch('https://example.com?page=3');
  }, []);

  if (result.loading) {
    return <span>Loading...</span>
  }

  return (
    <div>
      <ul>
        {result.value.map((item) => (
          <li>...</li>
        ))}
      </ul>

      <button onClick={()) => result.next()}>
        Next
      </button>
    </div>
  );
};
```

#### `useIterable(iterable, deps)`

Wraps iterable into a React state. You can call `next()` to retrieve the next value, and read the latest value from the iterator via `value`.

Argument can be any object that implements `[Symbol.iterator]` protocol such as `String` and `Array`.

```js
const result = useIterable('abcd');

result.next();
result.value === 'a';

result.next();
result.value === 'b';
```

#### `useAsyncIterable(asyncIterable, deps)`

Wraps async iterable into a React state. You can call `next()` to retrieve the next value, and read the latest value from the iterator via `value`.

Argument can be any object that implements `[Symbol.asyncIterator]` protocol.

```js
const result = useAsyncIterable({
  [Symbol.asyncIterator]() {
    return {
      i: 0,
      next() {
        if (this.i < 3) {
          return Promise.resolve({ value: this.i++, done: false });
        }

        return Promise.resolve({ done: true });
      },
    };
  },
});

result.next();
result.loading; // === true while loading
result.value === 1;
```

#### `useIterator(iterator, deps)`

A low-level hook for `useIterable` and `useGenerator`. Accepts iterator object and returns a reactive state and a dispatcher.

```js
const result = useIterator({
  next: () {...},
  return: () {...},
  throw: () {...},
});
```

#### `useAsyncIterator(asyncIterator, deps)`

A low-level hook for `useAsyncIterable` and `useAsyncGenerator`. Accepts async iterator object and returns a reactive state and a dispatcher.

```js
const result = useAsyncIterator({
  next: () {...},
  return: () {...},
  throw: () {...},
});
```
