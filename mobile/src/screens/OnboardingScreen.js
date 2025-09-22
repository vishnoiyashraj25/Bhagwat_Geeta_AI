import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function OnboardingScreen({ navigation }) {
  const [name, setName] = useState('');
  const [lang, setLang] = useState('en');

  const start = async () => {
    await AsyncStorage.setItem('user_name', name || 'Friend');
    await AsyncStorage.setItem('lang', lang);
    navigation.replace('Chat', { name, lang });
  };

  return (
    <View style={{flex:1, padding:20}}>
      <Text style={{fontSize:20, marginBottom:10}}>Welcome</Text>
      <TextInput placeholder="Your name" value={name} onChangeText={setName} style={{borderWidth:1, padding:10, marginBottom:10}} />
      <View style={{flexDirection:'row', marginBottom:10}}>
        <Button title="English" onPress={() => setLang('en')} />
        <View style={{width:10}}/>
        <Button title="हिंदी" onPress={() => setLang('hi')} />
      </View>
      <Button title="Start" onPress={start} />
    </View>
  );
}
