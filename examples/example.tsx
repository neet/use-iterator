import { render } from 'react-dom';
import { useGenerator } from '../src';

export const Tutorial = () => {
  const iteratorResult = useGenerator<string>(function* () {
    yield 'Setup password';
    yield 'Setup username';
    yield 'Setup avatar';
  }, []);

  if (iteratorResult.done) {
    return (
      <div>
        Tutorial completed!
      </div>
    );
  }

  return (
    <div>
      <h1>{iteratorResult.value}</h1>
      <button onClick={() => iteratorResult.next()}>next</button>
    </div>
  );
}

render(<Tutorial />, document.getElementById('root'));
