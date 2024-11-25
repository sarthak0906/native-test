import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';

import { useSession } from '../../ctx';
import React from 'react';

export default function AppLayout() {
  const { session, isLoading } = useSession();
  // const [user, setUser] = React.useState<any | null>("");

  // You can keep the splash screen open, or render a loading screen like we do here.
  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!session) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

  let user;
  if (session){
    try {
      let s = session
      user = s?.user;
    } catch (error) {
      user = null;
    }
  }
  console.log("<<<<<<<<<<<<", user);

  // This layout can be deferred because it's not the root layout.
  if (user && user.admin && user.email == "admin@admin.co"){
    return (
      <Stack>
        <Stack.Screen name="(admintabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="modal" options={{ presentation: 'modal' }} /> */}
      </Stack>
    )
  } else {
    return (
      <Stack>
        <Stack.Screen name="(admintabs)" options={{ headerShown: false }} />
        {/* <Stack.Screen name="modal" options={{ presentation: 'modal' }} /> */}
      </Stack>
    );
  }
}
