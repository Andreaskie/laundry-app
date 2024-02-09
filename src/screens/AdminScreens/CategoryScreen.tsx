// AdminScreen.tsx
import React, { useContext, useState } from "react";
import {
  ScrollView,
  TextInput,
  Text,
  View,
  Modal,
  Touchable,
  TouchableOpacity,
  Dimensions,
  Image,
} from "react-native";
import firestore from "@react-native-firebase/firestore";
import { AuthContext } from "../../features/AuthContext";
import HeaderTitle from "../../components/HeaderTitle";
import Button from "../../components/Button";
import AddCategory from "./CategoryUtil/AddCategory";
import { firebase } from "../../../config";
import Loading from "../../components/Loading";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const CategoryScreen = () => {
  const { user } = useContext(AuthContext);

  const [modalVisible, setModalVisible] = useState(false);
  const [items, setItems] = useState([]);

  React.useEffect(() => {
    const unsubscribe = firebase
      .firestore()
      .collection("items")
      .where("uploaderUid", "==", user.uid)
      .onSnapshot((snapshot) => {
        const itemsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(itemsData);
      });

    return () => {
      // Unsubscribe from the snapshot listener when the component unmounts
      unsubscribe();
    };
  }, [user.uid]);

  const showAddCategory = () => {
    setModalVisible(true);
  };

  const hideAddCategory = () => {
    setModalVisible(false);
  };

  const { width: screenWidth } = Dimensions.get("window");

  // Assuming each item should take half of the screen width
  const itemWidth = screenWidth / 2.3;

  return (
    <View className="w-full h-screen bg-[#f8fafc]">
      <HeaderTitle>My Category</HeaderTitle>
      <View className="w-24 absolute top-0 right-2">
        <Button title="Add New" cN="!w-fit" onPress={showAddCategory} />
      </View>
      <ScrollView>
        {items ? (
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", gap: 10 }}
            className="p-5 rounded mb-12"
          >
            {items.map((item, index) => {
              return (
                <View
                  key={index}
                  className=" w-full white mt-2  flex-row  p-5  bg-white"
                >
                  <View className="w-28 h-28 overflow-hidden rounded-lg">
                    <Image
                      source={{ uri: item.imageUrl }}
                      className="w-full h-full"
                    />
                  </View>
                  <View className="p-4">
                    <Text style={{ color: "#0891b2" }} className="text-base">
                      {item.category}
                    </Text>

                    <View className="">
                      <Button title="Edit Category" />
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          <Loading />
        )}
      </ScrollView>

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={hideAddCategory}
      >
        <View className="bg-white h-full">
          <View
            className="bg-white p-4 "
            style={{
              elevation: 5,
            }}
          >
            <View className="w-full  m-0 h-full  ">
              <View className="w-full  bg-white pb-4 border-b border-gray-300">
                <Text className={`text-[#3498db] text-lg font-semibold `}>
                  Add Category
                </Text>

                <TouchableOpacity onPress={hideAddCategory} className="-mt-5">
                  <Text
                    style={{ color: "red", textAlign: "right" }}
                    className="w-fit"
                  >
                    Close
                  </Text>
                </TouchableOpacity>
              </View>
              <AddCategory hideAddCategory={hideAddCategory} />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CategoryScreen;
