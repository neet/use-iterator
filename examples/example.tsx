import { useGenerator, useIterable } from 'react-iterable';

export const Tutorial = () => {
  const {value: message, next} = useGenerator(function* () {
    yield 'Setup password';
    yield 'Setup username';
    yield 'Setup avatar';
  }, []);

  if (message == null) {
    return (
      <div>
        Tutorial completed!
      </div>
    );
  }

  return (
    <div>
      <h1>{message}</h1>
      <button onClick={() => next(undefined)}>next</button>
    </div>
  );
}
