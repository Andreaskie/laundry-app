import { View, Text, Image, Dimensions, TouchableOpacity } from "react-native";
import React from "react";
import { firebase } from "../../../../config";
import { ScrollView } from "react-native-gesture-handler";
import Loading from "../../../components/Loading";
import { useCart } from "../../../features/CartContext";
import CartAppbar from "./CartAppbar";
import CartContainer from "./CartContainer";

const CategoryUserScreen = ({ route, navigation }) => {
  const [items, setItems] = React.useState<any>([]);
  const { addToCart, removeFromCart, cart,cartIsOpen } = useCart();

  React.useEffect(() => {
    const unsubscribeUsers = firebase
      .firestore()
      .collection("users")
      .where("email", "==", route.params.user.email)
      .onSnapshot((snapshot) => {
        const userData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        if (userData.length > 0) {
          const userUID = userData[0].uid;

          const unsubscribeItems = firebase
            .firestore()
            .collection("items")
            .where("uploaderUid", "==", userUID)
            .onSnapshot((itemsSnapshot) => {
              const itemsData = itemsSnapshot.docs.map((itemDoc) => ({
                id: itemDoc.id,
                ...itemDoc.data(),
              }));

              setItems(itemsData);
            });

          return () => unsubscribeItems();
        } else {
          console.log("No user found with the specified email");
        }
      });
    return () => unsubscribeUsers();
  }, [route.params.user.email]);

  const { width: screenWidth } = Dimensions.get("window");
  const itemWidth = screenWidth / 2.2;

  const handleToggleCart = (item) => {
    const isInCart = cart.some((cartItem) => cartItem.id === item.id);

    const itemWithNumericPrice = {
      ...item,
      quantity: 1,
      price: parseFloat(item.price),
    };

    if (isInCart) {
      removeFromCart(item.id);
    } else {
      addToCart(itemWithNumericPrice);
    }
  };

  const colors = ["#C4DFDF", "#D2E9E9", "#E3F4F4"];
  return (
    <View style={{ flex: 1 }}>
           {cartIsOpen && <CartContainer />}
      <Text className="text-center uppercase  p-2 pl-5 font-semibold bg-white  text-[#0891b2]">
        {route.params.user.user_name} Services Offered
      </Text>
      <ScrollView style={{ zIndex: 0 }} className="pt-5">
        {items ? (
          <View className="items-center  justify-center rounded flex-wrap flex-row p-2  z-0 pb-10">
            {items.map((item, index) => {
              const isInCart = cart.some((cartItem) => cartItem.id === item.id);
              const hasItemsFromDifferentShop = cart.some(
                (cartItem) => cartItem.uploaderUid !== route.params.user.uid
              );

              return (
                <View
                    key={index}
                    className=" w-full white mt-2  flex-row  p-5  bg-white"
                  >
                    <View className="items-center ">
                      <View className="w-28 h-28 overflow-hidden rounded-lg">
                        <Image
                          source={{ uri: item.imageUrl }}
                          className="w-full h-full"
                        />
                      </View>
                    </View>
                    <View className=" w-full flex-col ml-5 ">
                      <Text className="text-[#0891b2] text-start text-base">
                        {item.category}
                      </Text>
                      <Text className="text-xs "> {item.description}</Text>

                      <Text className="mt-2"> ₱{item.price}</Text>
                      {item.status ? (
                        <View className="w-36">
                          {item.uploaderUid === route.params.user.uid &&
                          !hasItemsFromDifferentShop ? (
                            <TouchableOpacity
                              onPress={() => handleToggleCart(item)}
                              style={{
                                backgroundColor: isInCart
                                  ? "#ff6347"
                                  : "#008000",
                              }}
                              className="w-full rounded-sm mt-2.5 py-2"
                            >
                              <Text
                                style={{ color: "#fff", textAlign: "center" }}
                              >
                                {isInCart ? "Remove from Cart" : "Add to Cart"}
                              </Text>
                            </TouchableOpacity>
                          ) : (
                            <Text style={{ color: "red" }}>
                              You already have items from a different shop in
                              your cart.
                            </Text>
                          )}
                        </View>
                      ) : (
                        <Text style={{ color: "red" }}>
                          Service not Available
                        </Text>
                      )}
                    </View>
                  </View>
              );
            })}
          </View>
        ) : (
          <Loading />
        )}
      </ScrollView>

      <CartAppbar />
    </View>
  );
};

export default CategoryUserScreen;
