// // app/user/_layout.js
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { NavigationContainer } from '@react-navigation/native';
// import { FontAwesome } from '@expo/vector-icons';
// import UserProfile from './profile';
// import UserSettings from '../settings';

// const Tab = createBottomTabNavigator();

// const UserLayout = () => {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator
//         screenOptions={{
//           headerShown: false, // Optionally hide the header
//         }}
//       >
//         <Tab.Screen
//           name="Profile"
//           component={UserProfile}
//           options={{
//             tabBarIcon: ({ color }) => <FontAwesome name="user" size={24} color={color} />,
//           }}
//         />
//         <Tab.Screen
//           name="Settings"
//           component={UserSettings}
//           options={{
//             tabBarIcon: ({ color }) => <FontAwesome name="cogs" size={24} color={color} />,
//           }}
//         />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// };

// export default UserLayout;

// app/admin/_layout.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import UserProfile from './profile';
import Settings from '../settings';
import { FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const UserLayout = ({ children, rerender }: { children: React.ReactNode, rerender: () => void }) => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="Dashboard"
      // component={UserProfile}
      children={() => <UserProfile />}
      options={{
        tabBarIcon: ({ color }) => <FontAwesome name="dashboard" size={24} color={color} />,
      }}
    />
    <Tab.Screen
      name="Settings"
      // component={Settings}
      children={() => <Settings rerender={rerender}/>}
      options={{
        tabBarIcon: ({ color }) => <FontAwesome name="cogs" size={24} color={color} />,
      }}
    />
  </Tab.Navigator>
);

export default UserLayout;
