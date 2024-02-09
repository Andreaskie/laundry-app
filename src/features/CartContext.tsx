import React, { createContext, ReactNode, useContext, useReducer } from "react";
import { CartItem } from "./CartReducer";

interface CartContextProps {
  children: ReactNode;
}

interface CartContextValue {
  cart: CartItem[];
  cartIsOpen: boolean;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const cartReducer = (state: CartContextValue, action: any) => {
  switch (action.type) {
    case "TOGGLE_CART":
      return { ...state, cartIsOpen: !state.cartIsOpen };

    case "ADD_TO_CART":
      const { id, imageUrl, category, quantity } = action.payload;
      const existingCartItemIndex = state.cart.findIndex(
        (item) => item.id === id
      );

      if (existingCartItemIndex !== -1) {
     
        const updatedCart = state.cart.map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity + 1 } // Adjusted to increment quantity by 1
            : item
        );
        return { ...state, cart: updatedCart };
      } else {
       
        return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] };
      }

    case "REMOVE_FROM_CART":
      const itemToRemove = state.cart.find((item) => item.id === action.payload);

      if (itemToRemove) {
        if (itemToRemove.quantity > 1) {
       
          const updatedCart = state.cart.map((item) =>
            item.id === action.payload
              ? { ...item, quantity: item.quantity - 1 }
              : item
          );
          return { ...state, cart: updatedCart };
        } else {
      
          return {
            ...state,
            cart: state.cart.filter((item) => item.id !== action.payload),
          };
        }
      } else {
        return state;
      }

    case "CLEAR_CART":
      return { ...state, cart: [] };

    default:
      return state;
  }
};


export const CartContextProvider = ({ children }: CartContextProps) => {
  const [cartState, dispatch] = useReducer(cartReducer, {
    cart: [],
    cartIsOpen: false,
  });

  const toggleCart = () => {
    dispatch({ type: "TOGGLE_CART" });
  };

  const addToCart = (item: CartItem) => {
    dispatch({ type: "ADD_TO_CART", payload: item });
  };

  const removeFromCart = (itemId: string) => {
    dispatch({ type: "REMOVE_FROM_CART", payload: itemId });
  };

  const clearCart = () => {
    dispatch({ type: "CLEAR_CART" });
  };

  const value: CartContextValue = {
    ...cartState,
    toggleCart,
    addToCart,
    removeFromCart,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartContextProvider");
  }
  return context;
};
