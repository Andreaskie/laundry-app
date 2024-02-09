// store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./src/features/AuthReducer";
import CartReducer from "./src/features/CartReducer";

const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: CartReducer,
    // Add other reducers if needed
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializableCheck middleware
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
