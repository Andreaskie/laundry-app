// cartSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CartItem {
  id: string;
  imageUrl: string;
  category: string;
  quantity: number;
  price: number; // Change the type to number
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingCartItemIndex = state.items.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingCartItemIndex !== -1) {
        state.items[existingCartItemIndex].quantity += action.payload.quantity;
      } else {
        const newItem = {
          ...action.payload,
          quantity: action.payload.quantity || 1, // Set default value to 1
          price: parseFloat(action.payload.price),
        };
        state.items.push(newItem);
      }
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
