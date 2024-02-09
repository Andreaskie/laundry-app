// App.tsx
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Provider, useDispatch, useSelector } from "react-redux";
import store, { RootState } from "./store";
import LoginScreen from "./src/screens/LoginScreen";
import RegistrationScreen from "./src/screens/RegistrationScreen";
import HomeScreen from "./src/screens/HomeScreen";
import { firebase } from "./config";
import { login, signout } from "./src/features/AuthReducer";
import { AuthContextProvider } from "./src/features/AuthContext";
import DashboardScreen from "./src/screens/UserScreens/DashboardScreen";
import MainMenuUser from "./src/screens/HomeScreenUser";
import CategoryUserScreen from "./src/screens/UserScreens/UserUtil/CategoryUserScreen";
import { CartContextProvider, useCart } from "./src/features/CartContext";
import BookingUserScreen from "./src/screens/UserScreens/UserUtil/BookingUserScreen";
import PaymentUserScreen from "./src/screens/UserScreens/UserUtil/PaymentUserScreen";
import ReportScreenDetails from "./src/screens/AdminScreens/ReportScreenDetails";

const Stack = createStackNavigator();

function App() {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const user = useSelector((state: RootState) => state.auth.user);
  const [roles, setRoles] = React.useState<any>(null);

  React.useEffect(() => {
    const subscriber = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        dispatch(login({ user }));
      } else {
        dispatch(signout());
      }
    });

    return () => subscriber();
  }, [dispatch]);

  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get();

        if (userDoc.exists) {
          setRoles(userDoc.data().roles);
        } else {
          console.log("User does not exists");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {isLoggedIn ? (
          <>
            {roles === true ? (
              <>
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="HomeUser"
                  component={HomeScreen}
                />
                <Stack.Screen
                  options={{
                    headerTitle: "",
                    headerBackTitleVisible: false,
                  }}
                  name="ReportScreenDetails"
                  component={ReportScreenDetails}
                />
              </>
            ) : (
              <>
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="HomeUserPage"
                  component={MainMenuUser}
                />
                <Stack.Screen
                  name="BookingUserScreen"
                  component={BookingUserScreen}
                  options={{
                    headerTitle: "",
                    headerBackTitleVisible: false,
                  }}
                />
                <Stack.Screen
                  name="CategoryUserScreen"
                  component={CategoryUserScreen}
                  options={{
                    headerTitle: "",
                    headerBackTitleVisible: false,
                  }}
                />
                <Stack.Screen
                  name="PaymentUserScreen"
                  component={PaymentUserScreen}
                  options={{
                    headerTitle: "",
                    headerBackTitleVisible: false,
                  }}
                />
              </>
            )}
          </>
        ) : (
          <>
            <Stack.Screen
              options={{ headerShown: false }}
              name="Login"
              component={LoginScreen}
            />
            <Stack.Screen
              options={{ headerShown: false }}
              name="Registration"
              component={RegistrationScreen}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default () => {
  return (
    <Provider store={store}>
      <AuthContextProvider>
        <CartContextProvider>
          <App />
        </CartContextProvider>
      </AuthContextProvider>
    </Provider>
  );
};
