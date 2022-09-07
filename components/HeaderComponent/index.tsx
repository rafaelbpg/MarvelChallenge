import React from 'react'
import {View, Text, Pressable} from 'react-native'
import tw from 'twrnc'
import HeaderComponentController from './HeaderComponentController'
const HeaderComponent : React.FC = () => {
    const { completeName, logoutAlert } = HeaderComponentController()
    return (
        <View style={tw`bg-red-600 w-full p-2 flex flex-row`}>
            <View style={tw.style({width:'75%'})}>
                <Text style={tw`text-white font-bold uppercase`}>Logged user: {completeName}</Text>
            </View>
            <Pressable 
                onPress={(event) => logoutAlert()}
                style={tw.style({width:'25%'})}>
                <Text style={tw`text-white font-bold uppercase text-right underline`}>Logout</Text>
            </Pressable>
        </View>
    )
}

export default HeaderComponent