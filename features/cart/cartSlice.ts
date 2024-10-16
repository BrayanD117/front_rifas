"use client";

import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  number: string;
  baseValue: string;
  tax: string;
  totalValue: string;
  raffleId: number;
  raffleName: string;
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
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
    },
    clearRaffleItems: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(item => item.raffleId !== action.payload);
    },
  },
});

export const { addToCart, clearRaffleItems } = cartSlice.actions;
export default cartSlice.reducer;