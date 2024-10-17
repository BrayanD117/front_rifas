"use client";

import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import store, { persistor } from '../../store';

export default function ClientProvider({ children }: { children: React.ReactNode }) {
  const isClient = typeof window !== 'undefined';

  return (
    <Provider store={store}>
    {isClient && persistor ? (
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    ) : (
      children
    )}
  </Provider>
  );
}