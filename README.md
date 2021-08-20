# use-iterator

React hook collections for JavaScript's Iterator/generator.

#### `useGenerator(generator, deps)`

Creates a reactive state and a dispatcher from a generator function.

```js
const result = useGenerator<string>(function* () {
  yield 'aaa';
  yield 'bbb';
  yield 'ccc';
}, []);

result.next();
result.value === 'aaa';

result.next();
result.value === 'bbb';
```

#### `useAsyncGenerator(generator, deps)`

Creates a reactive state and a dispatcher from a generator function. Similar to `useGenerator` but you can yield promise from it.

```js
const result = useAsyncGenerator<string>(function* () {
  yield fetch('https://example.com/1').then((r) => r.json());
  yield fetch('https://example.com/2').then((r) => r.json());
  yield fetch('https://example.com/3').then((r) => r.json());
}, []);

result.next();
result.loading; // equals to true while loading
result.value; // equals to the response from the URL above
```

#### `useIterable(iterable)`

Creates a reactive state and a dispatcher from a iterable object.

```js
// Argument can be anything that implements Symbol.iterator
const result = useIterable("abcd");

result.next();
result.value === 'a';

result.next();
result.value === 'b';
```

#### `useAsyncIterable(asyncIterable)`

Creates a reactive state and a dispatcher from a iterable object. Similar to `useIterable` but you can yield promise from it.

```js
// Argument can be anything that can be used with for-await-of syntax
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for-await...of
const result = useAsyncIterable({
  [Symbol.asyncIterator]() {
    return {
      i: 0,
      next() {
        if (this.i < 3) {
          return Promise.resolve({ value: this.i++, done: false });
        }

        return Promise.resolve({ done: true });
      }
    };
  }
});

result.next();
result.loading; // equals to true while loading
result.value === 1;
```

#### `useIterator(iterator)`

A low-level hook for `useIterable` and `useGenerator`. Accepts iterator object and returns a reactive state and a dispatcher.

```js
const result = useIterator({
  next: () {...},
  return: () {...},
  throw: () {...},
});
```

#### `useAsyncIterator(iterator)`

A low-level hook for `useAsyncIterable` and `useAsyncGenerator`. Accepts async iterator object and returns a reactive state and a dispatcher.

```js
const result = useAsyncIterator({
  next: () {...},
  return: () {...},
  throw: () {...},
});
```
