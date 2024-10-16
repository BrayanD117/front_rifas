import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartItem {
  raffleId: number;
  raffleName: string;
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
    // Puedes agregar otras acciones como eliminar o vaciar el carrito
  },
});

export const { addToCart } = cartSlice.actions;
export default cartSlice.reducer;