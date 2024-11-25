import { Text, View } from 'react-native';

import { useSession } from '../../ctx';

export default function Index() {
  const { signOut, session } = useSession();

  let user;
  // React.useEffect(() => {
  if (session){
    try {
      let s = JSON.parse(session)
      user = s?.user;
    } catch (error) {
      user = null;
    }
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>{user.admin}</Text>
      <Text
        onPress={() => {
          // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
          signOut();
        }}>
        Sign Out
      </Text>
    </View>
  );
}
