import {useState} from 'react';

export default () => {
  const [count, setCount] = useState<number>(0);
  if (count > 0) {
    throw new Error('A intentional Error');
  }
  return <div onClick={() => setCount(1)}> Click to throw an error!</div>;
};
