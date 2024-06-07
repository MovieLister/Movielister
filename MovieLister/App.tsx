import React, { useEffect } from "react"
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import loginScreen from './src/screens/auth/LoginScreen'
import SignupScreen from './src/screens/auth/SignupScreen'
import HomePage from './src/screens/HomePage/HomePage'
import { SafeAreaProvider } from "react-native-safe-area-context"
import MediaDetail from "./src/screens/details/MediaDetail"
import MapDetail from "./src/screens/details/MapDetail"
import notifee, { AlarmType, AndroidImportance, AndroidNotificationSetting, AndroidStyle, IntervalTrigger, RepeatFrequency, TimeUnit, TimestampTrigger, TriggerType } from '@notifee/react-native';
import axios from "axios"
import { ShowTypeEnum } from "streaming-availability"

const Stack = createNativeStackNavigator();

function App(): React.JSX.Element {
  const country = 'it'
  async function onCreateTriggerNotification() {
    const options = {
      method: 'GET',
      url: 'https://streaming-availability.p.rapidapi.com/changes',
      params: {
        change_type: 'new',
        country: 'it',
        item_type: 'show',
        order_direction: 'desc',
        include_unknown_dates: 'false'
      },
      headers: {
        'x-rapidapi-key': '1edb3aea8bmshaf3eabdf8f009bap107548jsnddf86dec83ae',
        'x-rapidapi-host': 'streaming-availability.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      let showId = response.data.changes[0].showId
      for (let i = 0; i < response.data.changes.length; i++) {
        if (response.data.changes[i].changeType === "new" && response.data.shows[response.data.changes[i].showId].streamingOptions[country] !== undefined) {
          showId = response.data.changes[i].showId
          break
        
        }
      }
      const shows = response.data.shows
      const showTitle : string = shows[showId].showType === ShowTypeEnum.Movie ? shows[showId].title : shows[showId].name
      const date = new Date(Date.now());
      date.setTime(date.getTime() + 5000);
      // Request permissions (required for iOS)
      await notifee.requestPermission()

      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
        importance: AndroidImportance.HIGH
      });

      const trigger:TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime()
      };

      let bigPictureImage = shows[showId].imageSet.horizontalBackdrop?.w1080
      if(bigPictureImage == undefined)
        bigPictureImage = require("./assets/placeholder.jpg")

      await notifee.createTriggerNotification(
        {
          id: '1234',
          title: "New Release! - " + showTitle,
          body: 'New ' + shows[showId].showType + ' available on streaming platforms',
          android: {
            channelId: 'default',
            lightUpScreen: true,
            timestamp: date.getTime(),
            showTimestamp: true,
            style: {
              type: AndroidStyle.BIGPICTURE,
              picture: bigPictureImage,
            },
          },
          data: {
            link: shows[showId].streamingOptions[country][0].link,
            service: shows[showId].streamingOptions[country][0].service.id
          },
        },
        trigger,
        
      );
      } catch (error) {
      console.error(error);
    }


  }

  useEffect(() => {
    onCreateTriggerNotification();
  }, []);
  

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Login' screenOptions={{headerShown: false, animation: 'none'}}>
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
