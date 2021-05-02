import { useContext } from 'react';

import { StoreContext } from '../lib/store';

const useStore = (selector, eqFn) => {
  const store = useContext(StoreContext);
  const values = store(selector, eqFn);
  return values;
};

export default useStore;
