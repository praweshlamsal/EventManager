import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

// Screens
import Dashboard from '../screens/Dashboard';
import CreateEvent from '../screens/CreateEvent';
import Favorites from '../screens/Favorites';

const Tab = createBottomTabNavigator();

export default function BottomTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#3B82F6',
        tabBarInactiveTintColor: 'gray',
        tabBarIcon: ({ color, size }) => {
          let iconName;

          if (route.name === 'Dashboard') {
            iconName = 'home';
          } else if (route.name === 'Favorites') {
            iconName = 'heart';
          } else if (route.name === 'CreateEvent') {
            iconName = 'add-circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen options={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerTintColor: '#3B82F6',
        headerTitleStyle: { fontSize: 20 },
        headerStyle: { backgroundColor: '#fff' },
        title: 'Dashboard',
      }} name="Dashboard" component={Dashboard} />
      <Tab.Screen options={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerTintColor: '#3B82F6',
        headerTitleStyle: { fontSize: 20 },
        headerStyle: { backgroundColor: '#fff' },
        title: 'Create Event',
      }} name="CreateEvent" component={CreateEvent} />
      <Tab.Screen options={{
        headerShown: true,
        headerTitleAlign: 'center',
        headerTintColor: '#3B82F6',
        headerTitleStyle: { fontSize: 20 },
        headerStyle: { backgroundColor: '#fff' },
        title: 'Favorites',
      }} name="Favorites" component={Favorites} />
    </Tab.Navigator>
  );
}
