import React, { useEffect } from "react"
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import loginScreen from './src/screens/auth/LoginScreen'
import SignupScreen from './src/screens/auth/SignupScreen'
import HomePage from './src/screens/HomePage/HomePage'
import { SafeAreaProvider } from "react-native-safe-area-context"
import MediaDetail from "./src/screens/details/MediaDetail"
import MapDetail from "./src/screens/details/MapDetail"
import notifee, { IntervalTrigger, RepeatFrequency, TimeUnit, TimestampTrigger, TriggerType } from '@notifee/react-native';

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  async function onCreateTriggerNotification() {
    const date = new Date(Date.now());
    date.setHours(22);
    date.setMinutes(12);
    // Request permissions (required for iOS)
    await notifee.requestPermission()

    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Default Channel',
    });

    const trigger: IntervalTrigger = {
      type: TriggerType.INTERVAL,
      interval: 15,
      timeUnit: TimeUnit.MINUTES
    };

    await notifee.createTriggerNotification(
      {
        id: '1234',
        title: 'Notification made with interval trigger',
        body: 'INTERVAL',
        android: {
          channelId: 'default',
          lightUpScreen: true,
          timestamp: new Date().getTime(),
          showTimestamp: true,
        },
        
      },
      trigger,
      
    );

  }

  useEffect(() => {
    onCreateTriggerNotification();
  }, []);
  

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='HomePage' screenOptions={{headerShown: false, animation: 'none'}}>
          <Stack.Screen name="Login" component={loginScreen} />
          <Stack.Screen name="Signup" component={SignupScreen} />
          <Stack.Screen name="HomePage" component={HomePage} />
          <Stack.Screen name="MediaDetail" component={MediaDetail} />
          <Stack.Screen name="MapDetail" component={MapDetail} />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


export default App;
