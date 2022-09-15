import React, {useState} from 'react';
import {Text, View, Image, TextInput, Pressable} from 'react-native';
import tw from 'twrnc';
import LoginScreenController from './LoginScreenController';
import {ApisauceInstance, create} from 'apisauce';
const LoginScreen: React.FC = () => {
  const {
    username,
    password,
    setUsername,
    setPassword,
    fillWithTestUser,
    signIn,
  } = LoginScreenController();
  return (
    <View style={tw`bg-black h-full`}>
      <View
        style={tw`flex flex-col items-center justify-center py-32 w-full px-4 mx-auto `}>
        <View>
          <Image
            style={{width: 200, height: 80}}
            source={require('../../marvellogo.png')}
          />
        </View>
        <View style={tw`w-full rounded-lg shadow bg-white mt-4 py-8`}>
          <View>
            <Text
              style={tw`text-2xl text-center font-bold leading-tight tracking-tight text-gray-900`}>
              Sign in to your account
            </Text>
          </View>
          <View style={tw`mt-4 px-2`}>
            <TextInput
              value={username}
              style={tw`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2.5`}
              onChangeText={(text) => setUsername(text)}
              placeholder="Username..."
            />
          </View>
          <View style={tw`mt-4 px-2`}>
            <TextInput
              value={password}
              secureTextEntry={true}
              onChangeText={(text) => setPassword(text)}
              style={tw`bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg p-2.5`}
              placeholder="Password"
            />
          </View>
          <View style={tw`mt-4 px-2`}>
            <Pressable
              onPressIn={(event) => signIn()}
              style={({pressed}) => [
                tw`w-full p-4 rounded-xl pressed:bg-blue-500 ${
                  pressed ? 'bg-red-500' : 'bg-red-600'
                }`,
              ]}>
              <Text style={tw`text-white text-center text-5`}>Sign in</Text>
            </Pressable>
          </View>
          <View style={tw`mt-4 px-2`}>
            <Pressable
              onPressIn={(event) => fillWithTestUser()}
              style={({pressed}) => [
                tw`w-full bg-black p-4 rounded-xl ${
                  pressed ? 'bg-gray-900' : ''
                }`,
              ]}>
              <Text style={tw`text-white text-center text-5`}>
                Fill with test user
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
};
export default LoginScreen;
