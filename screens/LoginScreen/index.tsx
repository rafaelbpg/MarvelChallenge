import { NavigationContext } from '@react-navigation/core';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';


const LoginScreen : React.FC = () => {
    const [text, setText] = useState('');
    const navigation = useNavigation()
    
    return( 
        <View>
            <Text>Login Screen</Text>
            <Button
                title="Go to Profile"
                onPress={() => navigation.navigate('Profile')}
            />
        </View>
    )
};
export default LoginScreen;