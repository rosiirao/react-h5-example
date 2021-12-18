import {createContext} from 'react';
import usePublic from './usePublic';

export const ShareStates = createContext<{
  value: number;
  setValue: React.Dispatch<React.SetStateAction<number>>;
}>({value: 0, setValue: () => 0});

function ProvideContext(props: React.PropsWithChildren<{}>) {
  const [value, setValue] = usePublic();
  return (
    <ShareStates.Provider value={{value, setValue}}>
      {props.children}
    </ShareStates.Provider>
  );
}

export default ProvideContext;
