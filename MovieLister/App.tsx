import React from "react"
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import loginScreen from './src/screens/auth/LoginScreen'
import SignupScreen from './src/screens/auth/SignupScreen'
import HomePage from './src/screens/HomePage/HomePage'
import { SafeAreaProvider } from "react-native-safe-area-context"
import MediaDetail from "./src/screens/details/MediaDetail"

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false, animation: 'none'}}>
          <Stack.Screen name="Login" component={loginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="HomePage" component={HomePage} />
          <Stack.Screen name="MediaDetail" component={MediaDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


export default App;
