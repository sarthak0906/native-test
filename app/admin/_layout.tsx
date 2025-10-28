// // app/admin/_layout.js
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { NavigationContainer } from '@react-navigation/native';
// import { FontAwesome } from '@expo/vector-icons';
// import AdminDashboard from './dashboard';
// import AdminSettings from '../settings';

// const Tab = createBottomTabNavigator();

// const AdminLayout = () => {
//   return (
//     <NavigationContainer>
//       <Tab.Navigator
//         screenOptions={{
//           headerShown: false, // Optionally hide the header
//         }}
//       >
//         <Tab.Screen
//           name="Dashboard"
//           component={AdminDashboard}
//           options={{
//             tabBarIcon: ({ color }) => <FontAwesome name="dashboard" size={24} color={color} />,
//           }}
//         />
//         <Tab.Screen
//           name="Settings"
//           component={AdminSettings}
//           options={{
//             tabBarIcon: ({ color }) => <FontAwesome name="cogs" size={24} color={color} />,
//           }}
//         />
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// };

// export default AdminLayout;


// app/admin/_layout.tsx
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdminDashboard from './dashboard';
import Settings from '../settings';
import { FontAwesome } from '@expo/vector-icons';

const Tab = createBottomTabNavigator();

const AdminLayout = ({ children, rerender }: { children: React.ReactNode, rerender: () => void }) => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen
      name="Dashboard"
      component={AdminDashboard}
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

export default AdminLayout;
