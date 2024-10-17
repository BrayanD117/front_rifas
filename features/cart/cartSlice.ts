import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
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
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
    },
    removeItem: (state, action: PayloadAction<number>) => { 
      state.items = state.items.filter(item => item.raffleId !== action.payload); 
    }, 
    removeSelectedItems: (state) => { state.items = []; },
    },
});

export const { addToCart, removeItem, removeSelectedItems } = cartSlice.actions;
export default cartSlice.reducer;