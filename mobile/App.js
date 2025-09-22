import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import OnboardingScreen from './src/screens/OnboardingScreen';
import ConversationScreen from './src/screens/ConversationScreen';
import { createStackNavigator } from '@react-navigation/stack';
import './src/i18n';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Onboarding">
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="Chat" component={ConversationScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
