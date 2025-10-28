// app/index.tsx
import { useState } from 'react';
import { View, TextInput, Button, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

const LoginScreen = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    // Simulate a login API call and role retrieval (replace this with actual logic)
    try {
      const response = await mockLogin(email, password); // Replace with real login logic
      if (response.isAuthenticated) {
        const role = await mockGetUserRole(response.token || ""); // Replace with actual role check
        if (role === 'admin') {
          router.push('/admin/dashboard'); // Navigate to Admin screen
        } else {
          router.push('/user/profile'); // Navigate to User screen
        }
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', padding: 20 }}>
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 10 }}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={{ height: 40, borderColor: 'gray', borderWidth: 1, marginBottom: 20 }}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error && <Text style={{ color: 'red', marginBottom: 10 }}>{error}</Text>}
      <Button title={loading ? 'Logging in...' : 'Login'} onPress={handleLogin} disabled={loading} />
      {loading && <ActivityIndicator style={{ marginTop: 20 }} size="large" />}
    </View>
  );
};

// Mock login function (replace with actual login logic)
const mockLogin = async (email: string, password: string) => {
  // Simulating login, replace with actual authentication logic (e.g., API call)
  if (email === 'admin@example.com' && password === 'admin123') {
    return { isAuthenticated: true, token: 'admin-token' };
  } else if (email === 'user@example.com' && password === 'user123') {
    return { isAuthenticated: true, token: 'user-token' };
  }
  return { isAuthenticated: false };
};

// Mock function to get user role based on the token
const mockGetUserRole = async (token: string) => {
  // Simulate role check
  if (token === 'admin-token') return 'admin';
  return 'user';
};

export default LoginScreen;
