import { useMemo } from 'react';
import { initializeStore } from '../lib/store';

export function useHydrate(initialState) {
  const state = typeof initialState === 'string' ? JSON.parse(initialState) : initialState;
  const store = useMemo(() => initializeStore(state), [state]);
  return store;
}
