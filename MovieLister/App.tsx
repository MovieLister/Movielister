import React from "react"
import {
  SafeAreaView,
  ScrollView,
  Text,
  View,
} from "react-native"
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import loginScreen from './src/screens/LoginScreen'
import SignupScreen from './src/screens/SignupScreen'
import HomePage from './src/screens/HomePage'

const Stack = createNativeStackNavigator();


function App(): React.JSX.Element {

  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false, animation: 'none'}}>
      <Stack.Screen name="Login" component={loginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="HomePage" component={HomePage} />
    </Stack.Navigator>
  </NavigationContainer>
  );
}


export default App;
