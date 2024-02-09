import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";

const Loading: React.FC = () => {
  return (
    <View style={styles.loadingContainer} >
      <Text className="mt-20 text-[#3498db] ">Loading Please Wait . . .</Text>

      <ActivityIndicator size="large" color="#3498db" />
    </View>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Loading;
