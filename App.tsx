/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */
 import { enableScreens } from 'react-native-screens'; 
 // run this before any screen render(usually in App.js)
 enableScreens();
import React, { useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  StatusBar,
  TextInput
} from 'react-native';

import {
  Header,
  LearnMoreLinks,
  Colors,
  DebugInstructions,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';

declare const global: {HermesInternal: null | {}};
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
const HomeScreen = ({ navigation }) => {
  const [text, setText] = useState('');
  const storeData = async (value: string) => {
    try {
      await AsyncStorage.setItem('@storage_Key', value)
    } catch (e) {
      // saving error
    }
  }
  const getData = async () => {
    const value = await AsyncStorage.getItem('@storage_Key')
    return value || ''
  }
  return (
    <>
      <TextInput
        style={{height: 40}}
        placeholder="Type here to translate!"
        onChangeText={text => storeData(text)}
        defaultValue={text}
      />
      <Button
        title="Get the store text" 
        onPress={async () => setText(await getData())}
      />
      <Text> {text} </Text>
      <Button
      title="Go to Jane's profile"
      onPress={() =>
        navigation.navigate('Profile', { name: 'Jane' })
      }
    />
    </>

  );
};
const ProfileScreen = ({ navigation, route }) => {
  return <Text>This is {route.params.name}'s profile</Text>;
};
const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen 
          name="Profile" 
          options={{ title: 'Goodbye' }}
          component={ProfileScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};



export default App;
