import { enableScreens } from 'react-native-screens'; 
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import StackComponent from './components/Stack';
enableScreens();
const App : React.FC = () => {
  return (
    <NavigationContainer>
      <StackComponent />
    </NavigationContainer>
  );
};

export default App;
