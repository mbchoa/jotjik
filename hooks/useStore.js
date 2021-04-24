import { useContext } from 'react';

import { StoreContext } from '../lib/zustandProvider';

const useStore = (selector, eqFn) => {
  const store = useContext(StoreContext);
  const values = store(selector, eqFn);
  return values;
};

export default useStore;
