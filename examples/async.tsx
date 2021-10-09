import { render } from 'react-dom';
import { useForAwaitOf } from '../src';

const delay = (timeout: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, timeout));

const asyncIterable = (async function* () {
  yield 'a';
  await delay(1000);

  yield 'b';
  await delay(1000);

  yield 'c';
  await delay(1000);

  yield 'd';
  await delay(1000);
})();

export const App = () => {
  const iteratorResult = useForAwaitOf(asyncIterable);

  console.log(JSON.stringify(iteratorResult, null, 2));

  return (
    <div>
      <output>
        {iteratorResult.value ?? 'none'}
      </output>
    </div>
  );
}

render(<App />, document.getElementById('root'));
