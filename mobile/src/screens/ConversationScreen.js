import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Button } from 'react-native';
import Voice from '@react-native-voice/voice';
import Tts from 'react-native-tts';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ConversationScreen({ route }) {
  const [text, setText] = useState('');
  const [listening, setListening] = useState(false);
  const [messages, setMessages] = useState([]);
  const [token, setToken] = useState(null);
  const [sessionId, setSessionId] = useState('session-demo-1');

  useEffect(() => {
    (async () => {
      const t = await AsyncStorage.getItem('auth_token');
      setToken(t);
    })();

    Voice.onSpeechResults = (e) => {
      setText(e.value && e.value[0] ? e.value[0] : '');
    };
    return () => Voice.removeAllListeners();
  }, []);

  const startListening = async () => {
    try {
      await Voice.start('en-US'); // use hi-IN for Hindi
      setListening(true);
    } catch(e) { console.error(e); }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
      setListening(false);
    } catch(e) {}
  };

  const sendMessage = async (messageText) => {
    if (!messageText) return;
    setMessages(prev=>[...prev, {type:'user', text: messageText}]);
    setText('');
    // API call
    const res = await fetch('http://localhost:4000/api/conversations/message', {
      method:'POST',
      headers: {
        'Content-Type':'application/json',
        'Authorization': token ? `Bearer ${token}` : ''
      },
      body: JSON.stringify({ message: messageText, session_id: sessionId })
    });
    const data = await res.json();
    if (data.error) {
      setMessages(prev=>[...prev, { type:'ai', text: 'Error: ' + data.error }]);
      return;
    }
    setMessages(prev=>[...prev, { type:'ai', text: data.response }]);
    // speak
    Tts.setDefaultLanguage('en-US'); // or 'hi-IN' depending on user lang
    Tts.speak(data.response);
  };

  return (
    <View style={{flex:1, padding:10}}>
      <ScrollView style={{flex:1}}>
        {messages.map((m,i)=>(
          <View key={i} style={{marginVertical:8, alignSelf: m.type==='user' ? 'flex-end' : 'flex-start' }}>
            <Text style={{backgroundColor: m.type==='user' ? '#DCF8C6' : '#EEE', padding:10, borderRadius:8}}>{m.text}</Text>
          </View>
        ))}
      </ScrollView>

      <View style={{flexDirection:'row', alignItems:'center'}}>
        <TextInput value={text} onChangeText={setText} placeholder="Type or speak..." style={{flex:1, borderWidth:1, padding:10, borderRadius:8}} />
        <TouchableOpacity onPress={() => listening ? stopListening() : startListening()} style={{marginLeft:8, padding:10, backgroundColor:'#2196F3', borderRadius:8}}>
          <Text style={{color:'#fff'}}>{listening ? 'Stop' : '🎤'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => sendMessage(text)} style={{marginLeft:8, padding:10, backgroundColor:'#4CAF50', borderRadius:8}}>
          <Text style={{color:'#fff'}}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
