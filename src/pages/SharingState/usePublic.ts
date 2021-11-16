import {useState} from 'react';

export default () => {
  const [value, setValue] = useState(0);
  return [value, setValue] as const;
};
