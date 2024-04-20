import { Text, TouchableOpacity, View } from "react-native"
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import React, { useEffect, Component } from "react"
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors } from "react-native/Libraries/NewAppScreen"
import * as Animatable from 'react-native-animatable'
import Discover from "./pages/Discover"
import Account from "./pages/Account"
import Search from "./pages/Search"
import { StatusBar } from 'react-native';

const TabArr = [
    {
        route: "Discover",
        label: "Discover",
        activeIcon: "list-ul",
        //inactiveIcon: nome_icona inattiva
        component: Discover

    },
    {
        route: "Search",
        label: "Search",
        activeIcon: "search",
        //inactiveIcon: nome_icona
        component: Search
    },
    {
        route: "Account",
        label: "Account",
        activeIcon: "user-circle-o",
        //inactiveIcon: nome_icona
        component: Account
    }
]

const Tab = createBottomTabNavigator();
const TabButton = (props: any) => {
    const  {tab, onPress, accessibilityState} = props
    const focused = accessibilityState.selected
    const viewRef = React.useRef(null)

    useEffect(() => {
        StatusBar.setHidden(true)
        if (focused) {
            viewRef.current.animate({0: {scale: 1}, 1: {scale: 1.3}}, 200)
        }
        else{
            viewRef.current.animate({0: {scale: 1.3}, 1: {scale: 1}}, 200)
        }
    }, [focused])
    return (
        <TouchableOpacity
            style={{flex: 1, justifyContent: "center", alignItems: "center"}}
            onPress={onPress}
            activeOpacity={1}>
            <Animatable.View
                className = "flex justify-center items-center"
                ref={viewRef}>
                <Icon
                    name={tab.activeIcon}
                    size={24}
                    color={focused ? Colors.primary : null} //TODO: Da cambiare il colore dell'inattiva
                />
            </Animatable.View>
           
        </TouchableOpacity>
    )
}



export default function HomePage({navigation} : {navigation: any}){
    return (
        <Tab.Navigator 
            screenOptions={
                {
                    headerShown: false,
                    tabBarStyle: {
                        height: 69,
                        position: "absolute",
                        bottom: 16,
                        right: 16,
                        left: 16,
                        borderRadius: 10,
                        backgroundColor: Colors.dark,
                    }
                }
            }
        >
            {
                TabArr.map((tab, index) => {
                    return (
                        <Tab.Screen
                            name={tab.route}
                            component={tab.component}
                            options={{
                                tabBarShowLabel: false,
                                tabBarLabel: tab.label,
                                tabBarButton: (props) => <TabButton {...props} tab={tab} />
                            }}
                            key={index}
                        />
                    )
                }
            )}
        </Tab.Navigator>
    )
}