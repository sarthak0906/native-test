import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Toast from 'react-native-toast-message';
import axios from 'axios';
import { router } from 'expo-router';
import { useSession } from '../../../ctx';

const CreateUser = () => {
  const { session } = useSession();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleCreateUser = () => {
    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete Data',
        text2: 'Please fill email'
      });
      return;
    }
    if (!password) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete Data',
        text2: 'Please fill password'
      });
      return;
    }
    if (!name) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete Data',
        text2: 'Please fill name'
      });
      return;
    }
    if (!phoneNumber) {
      Toast.show({
        type: 'error',
        text1: 'Incomplete Data',
        text2: 'Please fill Phone Number'
      });
      return;
    }
    axios.post('http://103.205.65.68:8025/api/admin/user/create', {
        email: email, 
        password, 
        firstName: name.split(" ")[0], 
        lastName: name.split(" ").slice(1).join(" "), 
        mobile: phoneNumber, 
        isAdmin: 0
      },
      {
        headers: {
          "x-access-token": session['token']
        }
      }
    )
    .then((data) => {
      console.log(data);
      if (data.status == 201) Toast.show({
        type: 'success',
        text1: 'User Created'
      });
    })
    .catch(err => {
      console.error(err);
      Toast.show({
        type: 'error',
        text1: 'No Ongoing Poll',
        text2: err
      });
    })
    // Implement your create user logic here
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label1}>CREATE USER</Text>

      <Text style={styles.label}>Name:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Enter name"
        placeholderTextColor="grey"
      />

      <Text style={styles.label}>Phone Number:</Text>
      <TextInput
        style={styles.input}
        value={phoneNumber}
        onChangeText={setPhoneNumber}
        keyboardType="phone-pad"
        placeholder="Enter phone number"
        placeholderTextColor="grey"
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        placeholder="Enter email"
        placeholderTextColor="grey"
      />

      <Text style={styles.label}>Password:</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        placeholder="Enter password"
        placeholderTextColor="grey"
      />

<View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleCreateUser} style={styles.createButton}>
          <Text style={styles.createButtonText}>Create User</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => router.push("/(app)/(admintabs)")}
          style={styles.cancelButton}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.89)',
    flex: 1,
  },
  label1: {
    fontSize: 26,
    marginBottom: 100,
    color: '#2e5fd1',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: 30,
  },
  label: {
    fontSize: 18,
    marginBottom: 10,
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    color: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  createButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    width: '48%',
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#f44336',
    borderRadius: 25,
    padding: 15,
    alignItems: 'center',
    width: '48%',
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});


export default CreateUser;
