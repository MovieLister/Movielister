import { Text, View } from "react-native";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import LoginScreen from "./LoginScreen";
import SignupScreen from "./SignupScreen";

const Tab = createBottomTabNavigator();


export default function HomePage({navigation} : {navigation: any}){
    return (
        <Tab.Navigator screenOptions={{headerShown: false}}>
            <Tab.Screen name="Home" component={LoginScreen} />
            <Tab.Screen name="Settings" component={SignupScreen} />
        </Tab.Navigator>
    )
}