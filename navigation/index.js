import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignUp from '../screens/SignUp';
import Dashboard from '../screens/Dashboard';
import CreateEvent from '../screens/CreateEvent';
import Favorites from '../screens/Favorites';
import SignIn from '../screens/SignIn';
import BottomTabNavigator from './BottomTabNavigator';
import EditEvent from '../screens/EditEvent';

const Stack = createNativeStackNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="SignIn">
      <Stack.Screen name="SignIn" component={SignIn} options={{ headerShown: false }} />
      <Stack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
      <Stack.Screen name="Dashboard" component={BottomTabNavigator} options={{ headerShown: false }} />
      <Stack.Screen name="EditEvent" component={EditEvent} options={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerTintColor: '#3B82F6',
        headerTitleStyle: { fontSize: 20 },
        headerStyle: { backgroundColor: '#fff' },
        title: 'Edit Events',
      }} />
    </Stack.Navigator>
  </NavigationContainer>
  );
}
