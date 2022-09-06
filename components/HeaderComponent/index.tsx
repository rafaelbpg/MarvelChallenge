import React from 'react'
import {View, Text} from 'react-native'
import tw from 'twrnc'

const HeaderComponent : React.FC = () => {
    return (
        <View style={tw`bg-red-600 w-full p-2`}>
            <Text style={tw`text-white`}>User</Text>
        </View>
    )
}

export default HeaderComponent