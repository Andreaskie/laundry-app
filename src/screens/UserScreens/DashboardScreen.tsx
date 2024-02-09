import React, { useContext, useEffect, useState } from "react";
import { SafeAreaView, StyleSheet, View, Alert, Text } from "react-native";
import MapView, { Marker, Callout } from "react-native-maps";
import Modal from "react-native-modal";
import { firebase } from "../../../config";
import { WebView } from "react-native-webview";
import { AuthContext } from "../../features/AuthContext";
import Loading from "../../components/Loading";
import Geolocation from "react-native-geocoding";
import Button from "../../components/Button";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import CartAppbar from "./UserUtil/CartAppbar";
import CartContainer from "./UserUtil/CartContainer";
import { useCart } from "../../features/CartContext";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const DashboardScreen = () => {
  Geolocation.init("AIzaSyBiEejYn0WTm0Fxwc58ztsOl1btvFtlfmg");

  const { user } = useContext(AuthContext);
  const { cartIsOpen } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [data, setData] = useState<any>({});

  const [addressFormatted, setAddressFormatted] = useState<any>(null);
  const navigation = useNavigation();

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
    if (isModalVisible) {
      setSelectedAddress(null);
    }
  };

  React.useEffect(() => {
    if (selectedAddress) {
      const filteredData =
        data?.length > 0 &&
        data.filter((item) => {
          return (
            item.address &&
            item.address.latitude === selectedAddress.latitude &&
            item.address.longitude === selectedAddress.longitude
          );
        });
  
      if (filteredData.length > 0) {
        setData(filteredData[0]);
        formatData();
      } else {
        // Handle the case when there is no matching data
        console.error("No matching data found");
      }
    }
  }, [selectedAddress]);
  

  const handleViewServices = () => {
    if (data) {
      // Navigate to CategoryScreen and pass the entire user data
      navigation.navigate("CategoryUserScreen", { user: data });
      setModalVisible(false);
      setSelectedAddress(null);
    } else {
      console.error("No data found to pass to CategoryScreen");
    }
  };

  const formatData = async () => {
    const result = await Geolocation.from(
      selectedAddress?.latitude,
      selectedAddress?.longitude
    );

    const formattedAddress = result.results[0].formatted_address;
    setAddressFormatted(formattedAddress);
  };

  const handleStreetView = () => {
    // Handle opening street view here
    Alert.alert("Street View", `Open street view for ${selectedAddress.name}`);
  };

  const isFocused = useIsFocused();
  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const usersQuery = await firebase
          .firestore()
          .collection("users")
          .where("roles", "==", true)
          .get();

        if (selectedAddress === null) {
          const usersData = usersQuery.docs.map((doc) => doc.data());
          setAddresses(
            usersData
              .map((user) => user?.address)
              .filter((address) => address !== undefined)
              .flat() || []
          );

          setData(usersData);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (user || isFocused) {
      fetchUserData();
    }
  }, [user, selectedAddress, isFocused]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <CartAppbar />
      {cartIsOpen && <CartContainer />}

      <View style={styles.container}>
        {addresses.length > 0 ? (
          <MapView
            style={styles.mapStyle}
            initialRegion={{
              latitude: parseFloat(addresses[0]?.latitude || 0),
              longitude: parseFloat(addresses[0]?.longitude || 0),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            customMapStyle={mapStyle}
          >
            {addresses.map((address) => {
              const key = `${address.latitude}-${address.longitude}`;
              if (address && address.latitude && address.longitude) {
                return (
                  <Marker
                    key={key}
                    coordinate={{
                      latitude: address.latitude,
                      longitude: address.longitude,
                    }}
                    onPress={() => {
                      toggleModal();

                      setSelectedAddress(address);
                    }}
                  ></Marker>
                );
              } else {
                console.error(`Invalid address data:`, address);
                return (
                  <Marker
                    key={key}
                    coordinate={{
                      latitude: 0,
                      longitude: 0,
                    }}
                  ></Marker>
                );
              }
            })}
          </MapView>
        ) : (
          <Loading />
        )}

        <Modal
          isVisible={isModalVisible}
          onBackdropPress={toggleModal}
          className="m-0  w-full rounded-t-xl"
        >
          <View className="bg-white h-72 absolute bottom-0 w-full rounded-t-3xl">
            {selectedAddress ? (
              <>
                <View className="p-3 flex gap-4 h-full">
                  <Text className="text-sm border-b text-[#3498db] border-gray-200 pb-2 uppercase">
                    <MaterialCommunityIcons
                      name="shopping-outline"
                      color="#3498db"
                      size={20}
                    />
                    &nbsp; {data?.user_name}
                  </Text>

                  <Text>{addressFormatted}</Text>

                  <Button
                    title="View Services"
                    onPress={handleViewServices}
                    cN="absolute bottom-0 left-4"
                  />
                </View>
              </>
            ) : (
              <Loading />
            )}
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default DashboardScreen;

const mapStyle = [
  { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#38414e" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#746855" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
];

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  mapStyle: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
