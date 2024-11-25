import React from 'react';
import { View, Text, TouchableOpacity, TextInput, Image, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import { useSession } from '../ctx';
import Toast from 'react-native-toast-message';

const Login = () => {
  const { signIn } = useSession();
  const [username, setUserName] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onLoginClick = () => {
    // signIn(username);
    // router.replace("/");
    fetch('http://103.205.65.68:8025/api/admin/login', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber: username,
        password
      }),
    })
    .then(response => response.json())
    .then(json => {
      console.log(json);
      if (json.status == 'failure') Toast.show({
        type: 'error',
        text1: json.message,
      });
      else {
        signIn(json.data);
        router.replace("/(app)/(admintabs)");
      }
    })
    .catch(error => {
      Toast.show({
        type: 'error',
        text1: 'Hello',
        text2: 'This is some something 👋'
      });
      console.error(error);
    });
  }
  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Toast />
      <Image
        source={require('./Resources /2.jpg')}
        style={styles.backgroundImage}
        resizeMode="cover" // Adjust this based on your preference
      />
      <View style={styles.overlay}>
        <BlurView
          intensity={50}
          style={styles.blurContainer}
        >
          <Text style={styles.title}>Login</Text>

          {/* Username Input Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your username"
              placeholderTextColor="#ccc"
              onChangeText={(e) => setUserName(e)}
              value={username}
            />
          </View>

          {/* Password Input Field */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your password"
              secureTextEntry={true}
              placeholderTextColor="#ccc"
              onChangeText={(e) => setPassword(e)}
              value={password}
            />
          </View>

          {/* Login Button */}
          <TouchableOpacity style={styles.loginButton} onPress={onLoginClick}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          {/* Forgot Password */}
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotText}>Forgot Password?</Text>
          </TouchableOpacity>
        </BlurView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'radial-gradient(circle at 10% 20%, rgb(0, 0, 0) 0%, rgb(64, 64, 64) 90.2%)',
    // backgroundColor: 'white',
  },
  backgroundImage: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    // marginBottom:"120%"
  },
  overlay: {
    // backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: 20,
  },
  blurContainer: {
    width: '85%',
    maxWidth: 400,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    minHeight: 300,
  },
  title: {
    fontSize: 26,
    color: '#000',
    fontWeight: 'bold',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 15,
  },
  label: {
    color: '#000',
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
    paddingHorizontal: 15,
    color: '#777',
  },
  loginButton: {
    width: '100%',
    // backgroundColor: 'linear-gradient(180.2deg, rgb(120, 85, 137) -6.9%, rgb(35, 9, 31) 76.7%)',
    backgroundColor: '#c8a2c8',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    marginTop: 15,
  },
  forgotText: {
    color: '#fff',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
});

export default Login;

