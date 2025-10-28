// app/settings.js
import { View, Text, Button, TouchableOpacity } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const SettingsScreen = (props: any) => {
  const onLogoutClick = () => {
    saveSessionSecurely('user', '');
    props.rerender();
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Settings Screen</Text>
      <TouchableOpacity onPress={onLogoutClick}>
        <Text >Log out</Text>
      </TouchableOpacity>
    </View>
  );
};

const saveSessionSecurely = async (key: string, value: string) => {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (e) {
    console.error('Error saving to SecureStore:', e);
  }
};

export default SettingsScreen;
