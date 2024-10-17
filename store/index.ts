import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../features/cart/cartSlice';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { combineReducers } from 'redux';

const isClient = typeof window !== 'undefined';
const persistConfig = {
  key: 'root',
  storage: isClient ? storage : undefined,
};

const rootReducer = combineReducers({
  cart: cartReducer
});

const persistedReducer = persistReducer(persistConfig as any, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = isClient ? persistStore(store) : null;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
