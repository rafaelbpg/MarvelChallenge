import React from "react"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from "../../screens/HomeScreen";
import LoginScreen from "../../screens/LoginScreen";
const Stack = createNativeStackNavigator();
const StackComponent : React.FC = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen
                name="Home"
                component={HomeScreen} />
            <Stack.Screen 
                name="Login" 
                options={{ title: 'Login Screen',
                    headerShown: false,
                    headerLeft: () => (null)
                }}
                component={LoginScreen} />
        </Stack.Navigator>
    )
    
}
export default StackComponent