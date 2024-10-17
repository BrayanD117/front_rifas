import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

interface CartItem {
  cartItemId: string;
  raffleId: number;
  raffleName: string;
  imageUrl: string;
  prize: string;
  number: string;
  baseValue: string;
  tax: string;
  totalValue: string;
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<Omit<CartItem, 'cartItemId'>>) => {
      state.items.push({ ...action.payload, cartItemId: uuidv4() });
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(item => item.cartItemId !== action.payload);
    },
    removeSelectedItems: (state, action: PayloadAction<string[]>) => {
      state.items = state.items.filter(item => !action.payload.includes(item.cartItemId));
    },
  },
});

export const { addToCart, removeItem, removeSelectedItems } = cartSlice.actions;
export default cartSlice.reducer;