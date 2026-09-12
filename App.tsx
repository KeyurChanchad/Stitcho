/**
 * Stitcho App – entry point
 */

import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import StitchoScreen from './src/screens/StitchoScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#004C6D" barStyle="light-content" />
      <StitchoScreen />
      <Toast />
    </SafeAreaProvider>
  );
}
