import { ActivityIndicator, Dimensions, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import React, { useEffect } from "react"
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors } from "react-native/Libraries/NewAppScreen"
import * as streamingAvailability from "streaming-availability"
import Animated, { FadeInLeft, FadeInUp } from "react-native-reanimated"
import { Image } from "react-native-elements"
import { Media } from "../HomePage/pages/Search"
import { SafeAreaView } from "react-native-safe-area-context"
import LinearGradient from "react-native-linear-gradient"

const {width, height} = Dimensions.get('window')

export default function MovieDetail({route, navigation} : {route: any, navigation: any}) {
    const [isFavorite, setIsFavorite] = React.useState(false)
    const [media, setMedia] = React.useState<Media>()
    useEffect(() => {
        setMedia(route.params.media)
    }, [])

    return (
        <ScrollView className = "bg-neutral-900 flex pb-1">
            <View className = "w-full">
                <SafeAreaView className = "absolute z-20 w-full flex-row justify-between items-center px-4 mt-3">
                    <TouchableOpacity className = "rounded-xl p-1 bg-orange-400 " onPress={() => navigation.goBack()}>
                        <Icon
                            name="arrow-left"
                            color={"white"}
                            size={25}
                        />
                    </TouchableOpacity>
                    
                </SafeAreaView>
                <View>
                    <Image
                        source={{uri: route.params.media.poster}}
                        style={{width: width, height: height*0.45}}
                    />
                    <LinearGradient
                        colors={['transparent', 'rgba(23,23,23,0.8)', 'rgba(23,23,23,1)']}
                        start={{x: 0.5, y: 0}}
                        end={{x: 0.5, y: 1}}
                        style={{width: width, height: height*0.40}}
                        className = "absolute bottom-0"/>
                </View>
            </View>

            {/* Movie Info */}
            <View style={{marginTop: -(height*0.1)}} className = "space-y-3 flex flex-row justify-between p-2">
                <Image source={{uri: media? media.poster : ""}} style={{width: width*0.3, height: height*0.2}} className = "rounded-xl"/>
                <View className = "w-60  m-1 flex flex-col">
                    <Text className="text-white text-3xl font-bold tracking-wider">{media?.title}</Text>
                    <TouchableOpacity className="mt-3" onPress={() => setIsFavorite(!isFavorite)}>
                        <Icon
                            name={isFavorite ? "bookmark" : "bookmark-o"}
                            color={isFavorite ? "orange" : "white"}
                            size={25}
                        />
                    </TouchableOpacity>
                </View>
                
            </View>
        </ScrollView>
    )
}