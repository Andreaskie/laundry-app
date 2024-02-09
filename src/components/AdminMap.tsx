import React, { useContext, useState } from "react";
import { SafeAreaView, StyleSheet, View, Alert, Text } from "react-native";
import MapView, { Marker } from "react-native-maps";
import Modal from "react-native-modal";
import { AuthContext } from "../features/AuthContext";
import { firebase } from "../../config";
import Geolocation from "react-native-geocoding";
import Loading from "./Loading";
import Button from "./Button";

const AdminMap = () => {
  const { user } = useContext(AuthContext);

  const [address, setAddress] = useState<any>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [addressFormatted, setAddressFormatted] = useState<any>(null);

  Geolocation.init("AIzaSyBiEejYn0WTm0Fxwc58ztsOl1btvFtlfmg");

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  const handleStreetView = async () => {
    try {
      // Update the user's location in the database
      await firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .update({
          address: {
            latitude: address.address.latitude,
            longitude: address.address.longitude,
          },
        });

      // Display a success message
      Alert.alert("Success", "Location updated successfully");
      setModalVisible(false);
    } catch (error) {
      // Display an error message if the update fails
      console.error("Error updating location:", error);
      Alert.alert("Error", "Failed to update location. Please try again.");
    }
  };

  const handleMarkerDragEnd = async (e) => {
    // Handle the logic when the marker is dragged to a new location
    const { latitude, longitude } = e.nativeEvent.coordinate;
    const newAddress = { ...address, address: { latitude, longitude } };
    setAddress(newAddress);

    const result = await Geolocation.from(latitude, longitude);

    const formattedAddress = result.results[0].formatted_address;
    setAddressFormatted(formattedAddress);
  };
  React.useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userDoc = await firebase
          .firestore()
          .collection("users")
          .doc(user.uid)
          .get();

        if (userDoc.exists) {
          const userAddress = userDoc.data()?.address;

          // Check if user has an address
          if (userAddress) {
            setAddress(userDoc.data());
          } else {
            // Set a default location if user doesn't have an address
            setAddress({
              address: {
                latitude: 8.198176729901983,
                longitude: 124.22236785292625,
              },
            });
          }
        } else {
          console.log("User does not exist");
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
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        {address ? (
          <MapView
            style={styles.mapStyle}
            initialRegion={{
              latitude: parseFloat(address?.address.latitude),
              longitude: parseFloat(address?.address.longitude),
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            customMapStyle={mapStyle}
          >
            <Marker
              coordinate={{
                latitude: parseFloat(address?.address.latitude),
                longitude: parseFloat(address?.address.longitude),
              }}
              draggable
              onDragEnd={handleMarkerDragEnd} // Ensure this is correctly set
              onPress={toggleModal}
            ></Marker>
          </MapView>
        ) : (
          <Loading />
        )}

        <Modal
          isVisible={isModalVisible}
          onBackdropPress={toggleModal}
          className="m-0  w-full rounded-t-xl"
        >
          <View className="bg-white h-72 absolute bottom-0 w-full rounded-t-3xl p-4">
            {/* Your details and Street View button can be placed here */}
            <View>
              <Text>New Address:</Text>
              <Text>{addressFormatted}</Text>
              <Button title="Update Location" onPress={handleStreetView} />
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

export default AdminMap;
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
