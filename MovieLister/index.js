/**
 * @format
 */

import {AppRegistry, Linking} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, { AndroidStyle, EventType, TriggerType } from '@notifee/react-native';
import { StreamingServices, streamingServices } from './src/components/LinkIcon';
import axios from 'axios';
import { ShowTypeEnum } from "streaming-availability"


notifee.onBackgroundEvent(async ({type, detail}) => {
  console.log('Background Event', type, detail);
  const country = 'it'
  const data = detail.notification.data;
  if( type === EventType.PRESS){
      const streamingPrefix = streamingServices[data.service];
      if(data.service === StreamingServices.prime){
        Linking.canOpenURL(streamingPrefix + data.link).then(supported => {
          if (supported) {
            Linking.openURL(streamingPrefix + data.link);
          } else {
            Linking.openURL(data.link);
          }
        });
      }
      else{
        Linking.canOpenURL(data.link.replace("https://", streamingPrefix)).then(supported => {
          if (supported) {
            Linking.openURL(data.link.replace("https://", streamingPrefix));
          } else {
            Linking.openURL(data.link);
          }
        });          
      }
  }
  if( type === EventType.DELIVERED){

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
        const showTitle = shows[showId].showType === ShowTypeEnum.Movie ? shows[showId].title : shows[showId].name
        const date = new Date(Date.now() + 60000 * 60 * 24);
        // Request permissions (required for iOS)
        notifee.requestPermission()

        const trigger = {
            type: TriggerType.TIMESTAMP,
            timestamp: date.getTime(),
          };

          let bigPictureImage = shows[showId].imageSet.horizontalBackdrop?.w1080
          if(bigPictureImage == undefined)
            bigPictureImage = require("./assets/placeholder.jpg")

        notifee.createTriggerNotification({
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
          }, trigger);
      } catch (error) {
        console.error(error);
      }
  }
});

notifee.onForegroundEvent(async ({type, detail}) => {
  console.log('Foreground Event', type, detail);
  const data = detail.notification.data;
  const country = 'it'

  if( type === EventType.PRESS){
      const streamingPrefix = streamingServices[data.service];
      if(data.service === StreamingServices.prime){
        Linking.canOpenURL(streamingPrefix + data.link).then(supported => {
          if (supported) {
            Linking.openURL(streamingPrefix + data.link);
          } else {
            Linking.openURL(data.link);
          }
        });
      }
      else{
        Linking.canOpenURL(data.link.replace("https://", streamingPrefix)).then(supported => {
          if (supported) {
            Linking.openURL(data.link.replace("https://", streamingPrefix));
          } else {
            Linking.openURL(data.link);
          }
        });          
      }
  }
  if( type === EventType.DELIVERED){
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
      const showTitle = shows[showId].showType === ShowTypeEnum.Movie ? shows[showId].title : shows[showId].name
      const date = new Date(Date.now() + 60000 * 60 * 24);
      // Request permissions (required for iOS)
      notifee.requestPermission()

      const trigger = {
          type: TriggerType.TIMESTAMP,
          timestamp: date.getTime(),
        };
      
      let bigPictureImage = shows[showId].imageSet.horizontalBackdrop?.w1080
      if(bigPictureImage == undefined)
        bigPictureImage = require("./assets/placeholder.jpg")

      await notifee.createTriggerNotification({
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
        }, trigger);
    } catch (error) {
      console.error(error);
    }
  }
});

AppRegistry.registerComponent(appName, () => App);
