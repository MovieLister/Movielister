/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee from '@notifee/react-native';

notifee.onBackgroundEvent(async ({type, detail}) => {
    console.log('Background Event', type, detail);
});

notifee.onForegroundEvent(async ({type, detail}) => {
    console.log('Foreground Event', type, detail);
});

AppRegistry.registerComponent(appName, () => App);
