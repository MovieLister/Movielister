import { Text, TouchableOpacity, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Icon from 'react-native-vector-icons/FontAwesome5'
import React from "react"

export default function Discover({navigation} : {navigation: any}) {
    
    return (
        <View className = "h-full w-full absolute bg-neutral-800" >
            <SafeAreaView className = "z-20 w-full flex-row items-center px-4 mt-3">
                <TouchableOpacity className = " w-1/6  rounded-xl p-1" onPress={() => navigation.goBack()}>
                    <Icon
                        name="arrow-left"
                        color={"orange"}
                        size={25}
                    />
                    
                </TouchableOpacity>
                <View className="w-4/6 items-center">
                    <Text className="text-white font-bold text-2xl">Discover</Text>
                </View>
            </SafeAreaView>
        </View>
    )
}