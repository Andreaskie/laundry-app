// ReusableModal.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  TextInput,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

interface ReusableModalProps {
  visible: boolean;
  onClose: () => void;
  config: {
    title: string;
    fields: { id: string; type?: string; placeholder: string }[];
    data: any;
    onUpdate: (field: string, value: string) => void;
  };
}

const ReusableModal: React.FC<ReusableModalProps> = ({
  visible,
  onClose,
  config,
}) => {
  const [data, setData] = useState<any>(config.data);

  const handleChange = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{
            backgroundColor: "white",
            padding: 16,
            elevation: 5,
            borderRadius: 8,
            width: "80%",
          }}
        >
          <TouchableOpacity onPress={onClose} style={{ alignSelf: "flex-end" }}>
            <Text style={{ color: "#3498db" }}>Close</Text>
          </TouchableOpacity>

          <ScrollView>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                paddingVertical: 8,
              }}
            >
              <MaterialCommunityIcons
                name="account-outline"
                color="#3498db"
                size={20}
              />
              <Text style={{ marginLeft: 8, flexShrink: 1 }}>
                {data.user_name}
              </Text>
            </View>

            {config.fields.map((field) => (
              <View key={field.id} style={{ width: "100%" }}>
                <TextInput
                  placeholder={field.placeholder}
                  keyboardType={field.type || "default"}
                  value={data[field.id]}
                  onChangeText={(text) => handleChange(field.id, text)}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ReusableModal;
