import React, { useContext } from "react";
import { Text, View } from "react-native";
import { TouchableOpacity } from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useCart } from "../../../features/CartContext";
import { useNavigation } from "@react-navigation/native";

const CartAppbar = () => {
  const navigation = useNavigation();

  const { cart,toggleCart } = useCart();
  return (
    <View
      className={`w-full h-12 bg-white shadow-lg z-20 ${
        cart.length === 0 ? "hidden" : "block"
      }`}
      style={{ zIndex: 1 }}
    >
      <TouchableOpacity
        className="bg-[#0891b2] w-1/2 p-4 "
        onPress={toggleCart}
      >
        <Text className="w-full text-center text-white font-semibold">
          <MaterialCommunityIcons name="cart-outline" color="white" size={16} />
          <Text className="ml-3 uppercase "> View Basket: {cart.length}</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default CartAppbar;
