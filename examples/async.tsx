import React, { useEffect } from 'react';
import { render } from 'react-dom';
import { useAsync } from 'react-use';
import { FacadeRepositories, login, Status } from 'masto';
import { useAsyncGenerator } from '../src';

type TimelineProps = {
  masto: FacadeRepositories;
}

const Timeline = (props: TimelineProps) => {
  const { masto } = props;

  const iteratorResult = useAsyncGenerator<Status[], unknown, undefined>(
    () => masto.timelines.getTagIterable('mastodon'),
    [masto]
  );

  useEffect(() => {
    iteratorResult.next();
  }, [iteratorResult.next]);

  if (iteratorResult.done) {
    return <span>done</span>
  }

  if (iteratorResult.loading || iteratorResult.value == null) {
    return <span>loading</span>
  }

  return (
    <div>
      <button onClick={() => iteratorResult.next()}>next</button>

      <ul>
        {iteratorResult.value.map(t => (
          <li key={t.id}>
            <p dangerouslySetInnerHTML={{__html: t.content}} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export const App = () => {
  const res = useAsync(() => login({
    url: 'https://mastodon.social',
  }), []);

  if (res.loading) {
    return <span>loading...</span>
  }

  if (res.value == null) {
    return <span>error</span>
  }

  return <Timeline masto={res.value} />
}

render(<App />, document.getElementById('root'));
