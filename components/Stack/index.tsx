import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from '../../screens/HomeScreen';
import LoginScreen from '../../screens/LoginScreen';
import DetailsScreen from '../../screens/DetailsScreen';
const Stack = createNativeStackNavigator();
const StackComponent: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Login"
        options={{
          title: 'Login Screen',
          headerShown: false,
          headerLeft: () => null,
        }}
        component={LoginScreen}
      />
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home Screen',
          headerShown: false,
          headerLeft: () => null,
        }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          title: 'Details',
          headerShown: false,
          headerLeft: () => null,
        }}
      />
    </Stack.Navigator>
  );
};
export default StackComponent;
