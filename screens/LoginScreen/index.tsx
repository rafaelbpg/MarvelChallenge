import React from 'react'
import { Text, View, Image, TextInput, Pressable } from 'react-native'
import tw from 'twrnc'
import LoginScreenController from './LoginScreenController'

const LoginScreen : React.FC = () => {
    const {setEmail, setPassword} = LoginScreenController()
    return( 
        <View style={tw`bg-black h-full`}>
            <View style={tw`flex flex-col items-center justify-center py-32 w-full px-4 mx-auto `}>
                <View>
                    <Image
                        style={{width:200, height:80}}
                        source={require('../../marvellogo.png')} />
                </View>
                <View style={tw`w-full rounded-lg shadow bg-white mt-4 py-8`}>
                    <View>
                        <Text style={tw`text-2xl text-center font-bold leading-tight tracking-tight text-gray-900`}>
                            Sign in to your account
                        </Text>
                    </View>
                    <View style={tw`mt-4 px-2`}>
                        <TextInput
                            style={tw`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2.5`}
                            onChangeText = { text => setEmail(text)}
                            placeholder='Username...' />
                    </View>
                    <View style={tw`mt-4 px-2`}>
                        <TextInput
                            secureTextEntry={true}
                            onChangeText = { text => setPassword(text)}
                            style={tw`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2.5`}
                            placeholder='Password' />
                    </View>
                    <View style={tw`mt-4 px-2`}>
                        <Pressable
                            style={tw`w-full bg-red-600 p-4 rounded-xl pressed:bg-blue-500`}>
                                <Text style={tw`text-white text-center text-5`}>Sign in</Text>
                        </Pressable>
                    </View>
                </View>
            </View>
        </View>
    )
};
export default LoginScreen;