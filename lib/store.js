import create from 'zustand';
import { devtools } from 'zustand/middleware';

let store;

const initialState = {
  allSessions: [],
};

function initStore(preloadedState = initialState) {
  return create(devtools((set) => ({
    ...initialState,
    ...preloadedState,
    getSessions: async () => {
      try {
        const response = await fetch('/api/sessions', { method: 'GET' });
        const allSessions = await response.json();
        set({ allSessions });
        return allSessions;
      } catch (err) {
        // TODO: handle error
      }
    },
    postNewSession: async ({ startedAt, duration }) => {
      try {
        await fetch('/api/sessions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            startedAt,
            duration,
          }),
        });
      } catch (err) {
        // TODO: handle error
      }
    },
  })));
}

export const initializeStore = (preloadedState) => {
  let _store = store ?? initStore(preloadedState);

  // After navigating to a page with an initial Zustand state, merge that state
  // with the current state in the store, and create a new store
  if (preloadedState && store) {
    _store = initStore({
      ...store.getState(),
      ...preloadedState,
    });
    // Reset the current store
    store = undefined;
  }

  // For SSG and SSR always create a new store
  if (typeof window === 'undefined') return _store;
  // Create the store once in the client
  if (!store) store = _store;

  return _store;
};
