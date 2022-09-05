import { NavigationContext } from '@react-navigation/core';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';


const HomeScreen : React.FC = () => {
    const [text, setText] = useState('');
    const navigation = useNavigation()
    
    return( 
        <View>
            <Text>Home Screen</Text>
            <Button
                title="Go to Login"
                onPress={() => navigation.navigate('Login')}
            />
        </View>
    )
};
export default HomeScreen;