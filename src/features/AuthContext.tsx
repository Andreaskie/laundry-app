// AuthContext.tsx
import React, { createContext, ReactNode } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../../store";
import { login, signout } from "./AuthReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface AuthContextProps {
  children: ReactNode;
}

export const AuthContext = createContext<
  | {
      isLoggedIn: boolean;
      user?: any;
      token?: string;
      dispatch: AppDispatch;
    }
  | undefined
>(undefined);

export const AuthContextProvider = ({ children }: AuthContextProps) => {
  const dispatch = useDispatch();
  const { isLoggedIn, user, token } = useSelector(
    (state: RootState) => state.auth
  );

  React.useEffect(() => {
    const loadAuthState = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedUser = await AsyncStorage.getItem("userData");

        if (storedToken && storedUser) {
          const user = JSON.parse(storedUser);
          dispatch(login({ user, token: storedToken }));
        } else {
          dispatch(signout());
        }
      } catch (error) {
        console.error("Error loading authentication state:", error);
        dispatch(signout());
      }
    };

    loadAuthState();
  }, [dispatch]);

  React.useEffect(() => {
    const saveAuthState = async () => {
      try {
        if (token) {
          await AsyncStorage.setItem("token", token);
        }
        if (user) {
          await AsyncStorage.setItem("userData", JSON.stringify(user));
        }
      } catch (error) {
        console.error("Error saving authentication state:", error);
      }
    };

    saveAuthState();
  }, [token, user]);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, token, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};
