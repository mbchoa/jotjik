import React from 'react';

import { StoreContext } from '../lib/store';

interface Props {
  children: React.ReactNode;
  store: unknown; // TODO: need to figure out how to type this from zustand type definitions
}

const StoreProvider: React.FC<Props> = ({ children, store }) => {
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

export default StoreProvider;
