import * as React from 'react';
import tw from 'twrnc';

import {View} from 'react-native';
import HeaderComponent from '../../components/HeaderComponent';
import {ExampleProvidedComponent} from '../../providers/ProxyProviderContext';

export default function HomeScreen() {
  return (
    <View style={tw`bg-black h-full`}>
      <HeaderComponent />
      <ExampleProvidedComponent url="characters" />
    </View>
  );
}
