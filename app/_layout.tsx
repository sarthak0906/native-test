// app/_layout.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import AdminLayout from './admin/_layout';
import UserLayout from './user/_layout';
import Login from './login';
import * as SecureStore from 'expo-secure-store';

const Tab = createBottomTabNavigator();

const getSessionSecurely = async (key: string) => {
  try {
    const value = await SecureStore.getItemAsync(key);
    return value;
  } catch (e) {
    console.error('Error loading from SecureStore:', e);
    return null;
  }
};

// Layout component
const Layout = ({ children }: { children: React.ReactNode }) => {
  const [userSession, setUserSession] = useState<any>(null);
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userRole, setUserRole] = useState<'admin' | 'user' | 'unauthenticated' | null>(null);
  const [x, setX] = useState(0);

  const loadSession = async () => {
    const session = await getSessionSecurely('user');
    console.log("==============", session);
    if (session) {
      try {
        setUserSession({ user: JSON.parse(session) });
      } catch (e) {
        setUserSession({ user: null });
      }
    } else {
      setUserSession({ user: null });
    }
  };

  useEffect(() => {
    console.log(x);

    const session = getSessionSecurely('user');
    console.log(session);
    loadSession();
  }, [x]);

  useEffect(() => {
    loadSession();
  }, [userSession, x]);

  useEffect(() => {
    const checkAuth = async () => {
      // alert(session);
      const token = await getAuthToken(userSession?.user); // Simulate getting auth token
      if (token) {
        const role = await getUserRole(token); // Simulate getting user role
        setIsAuthenticated(true);
        setUserRole(role);
      } else {
        setIsAuthenticated(false);
      }
      // setLoading(false); // Stop loading after checking auth
    };

    checkAuth();
  }, [x]);

  // If not authenticated, route to the login screen
  if (!isAuthenticated) {
    // router.push('/'); // Navigate to login screen
    return <Login rerender={() => {setX(x+1)}}/>;
  }

  if (userRole === 'unauthenticated') {
    return (
      <Login rerender={() => {setX(x+1)}}/>
    );
  }

  return (
    <>
      {userRole === 'admin' ? (
        <AdminLayout rerender={() => {setX(x+1)}}>{children}</AdminLayout>
      ) : (
        <UserLayout rerender={() => {setX(x+1)}}>{children}</UserLayout>
      )}
    </>
  )
};

// Helper function to simulate fetching auth token (replace with real logic)
const getAuthToken = async (session: any): Promise<any | null> => {
  // Simulate checking authentication (replace with actual token retrieval)
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("<<<<<<<<<<<<", session);
      resolve(session);
      // resolve('someAuthToken'); // Simulate authenticated user (replace with real logic)
    }, 1000);
  });
};

// Simulate fetching user role (replace with actual logic)
const getUserRole = async (token: any): Promise<'admin' | 'user' | 'unauthenticated'> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!token) resolve('unauthenticated');

      resolve(token.admin ? 'admin' : 'user');
    }, 1000);
  });
};

export default Layout;
