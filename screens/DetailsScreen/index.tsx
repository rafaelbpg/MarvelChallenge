import * as React from 'react';
import tw from 'twrnc';

import {Image, Text, View} from 'react-native';
import HeaderComponent from '../../components/HeaderComponent';
import {ComicListComponent} from '../../providers/ProxyProviderContext';
import {useRoute} from '@react-navigation/native';

export default function DetailsScreen() {
  const route = useRoute();
  const {id, name, description, urlImage} = route.params;
  const url = `characters/${id}/comics`;

  return (
    <View style={tw`bg-black h-full`}>
      <HeaderComponent />
      <View style={tw`self-center mt-2 text-center`}>
        <Text style={tw`text-white p-2 text-xl text-center`}>Name: {name}</Text>
        <Text style={tw`text-white p-2 text-xl text-center mb-4`}>
          Description: {description || 'N/A'}
        </Text>
        <Image source={{uri: urlImage}} style={{width: 200, height: 200, alignSelf:'center'}} />
      </View>
      <ComicListComponent url={url} />
    </View>
  );
}
