import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useSession } from '@/ctx';

const Nav = () => {
  const { signOut, session } = useSession();
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const toggleDropdown = () => setShowDropdown((prev) => !prev);

  const navigateToEdit = () => {
    setShowDropdown(false); // Close dropdown
    if (session.user.admin) router.push('/(app)/(admintabs)/profile'); // Navigate to the Edit page
    else router.push('/(app)/(usertabs)/profile'); // Navigate to the Edit page
  };

  return (
    <View style={styles.navContainer}>
      <Text style={styles.username}>Voting App</Text>
      <TouchableOpacity onPress={toggleDropdown}>
        <Image
          source={require('../assets/images/menu.png')}
          style={styles.profileImage}
        />
      </TouchableOpacity>
      {showDropdown && (
        <View style={styles.dropdown}>
          <TouchableOpacity onPress={navigateToEdit}>
            <Text style={styles.dropdownItem}>Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={signOut}>
            <Text style={styles.dropdownItem}>Logout</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  navContainer: {
    width: '100%',
    height: 60,
    backgroundColor: '#e8eef1',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    position: 'absolute',
    top: '5%',
    transform: [{ translateY: -30 }],
    borderRadius: 8,
    paddingHorizontal: 16,
    zIndex: 10, // Ensure nav container is also on top
  },
  username: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderColor: 'white',
    borderWidth: 2,
  },
  dropdown: {
    position: 'absolute',
    top: 70,
    right: 16,
    backgroundColor: 'white',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 10, // For Android shadow
    padding: 8,
    zIndex: 1000, // Ensure dropdown is above other elements
  },
  dropdownItem: {
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: 'black',
  },
});

export default Nav;
