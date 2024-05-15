import { ActivityIndicator, Dimensions, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native"
import React, { useEffect } from "react"
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors } from "react-native/Libraries/NewAppScreen"
import * as streamingAvailability from "streaming-availability"
import Animated, { FadeIn, FadeInLeft, FadeInUp, StretchInY, ZoomIn, ZoomInEasyDown } from "react-native-reanimated"
import { Image } from "react-native-elements"
import { Media } from "../HomePage/pages/Search"
import { SafeAreaView } from "react-native-safe-area-context"
import LinearGradient from "react-native-linear-gradient"
import YoutubeIframe from "react-native-youtube-iframe"
import YoutubePlayer from "react-native-youtube-iframe"
import WebView from "react-native-webview"

const {width, height} = Dimensions.get('window')

export default function MovieDetail({route, navigation} : {route: any, navigation: any}) {
    const [isFavorite, setIsFavorite] = React.useState(false)
    const [media, setMedia] = React.useState<Media>()
    const [trailerVisible, setTrailerVisible] = React.useState(false)
    useEffect(() => {
        setMedia(route.params.media)
        setTimeout(() => {
            setTrailerVisible(true)
        }, 2000)
    }, [])

    return (
        <ScrollView className = "bg-neutral-900 flex pb-1">
            <View className = "w-full">
                <SafeAreaView className = "absolute z-20 w-full flex-row justify-between items-center px-4 mt-3">
                    <TouchableOpacity className = "rounded-xl p-1" onPress={() => navigation.goBack()}>
                        <Icon
                            name="arrow-left"
                            color={"orange"}
                            size={25}
                        />
                    </TouchableOpacity>
                </SafeAreaView>
                <View className="rounded-xl bg-neutral-900">
                    <Animated.View entering={FadeIn.duration(800)} style={{width: width, aspectRatio: 16/9, display: trailerVisible ? "flex" : "none"}}>
                        <WebView
                        source={{uri: route.params.media.trailer}}
                        style={{width: width, aspectRatio: 16/9, }}
                        mediaPlaybackRequiresUserAction={false}
                        allowsInlineMediaPlayback={true}
                        javaScriptEnabled={true}
                        injectedJavaScript={`document.body.style.pointerEvents = 'none';`}
                        />
                    </Animated.View>
                    {!trailerVisible && (
                        <Image source={{uri: media?.backdrop}} style={{width: width, aspectRatio: 16/9}}/>

                    )}
                    
                    <LinearGradient
                        colors={['transparent', 'rgba(23,23,23,0.2)', 'rgba(23,23,23,1)']}
                        start={{x: 0.5, y: 0}}
                        end={{x: 0.5, y: 1}}
                        style={{width: width, aspectRatio: 16/9}}
                        className = "absolute bottom-0"
                    />
                </View>
            </View>

            {/* Movie Info */}
            <View style={{marginTop: -(height*0.01)}} className = "flex flex-row justify-between p-2">
                <Image source={{uri: media?.poster}} style={{width: width*0.3, aspectRatio: 9/13}} className = " mx-2 rounded-xl"/>
                <View className = "mx-1 flex flex-col" style={{width: width*0.6}}>
                    <Text className="text-gray-200 text-2xl font-bold tracking-wider" numberOfLines={3}>{media?.title}</Text>
                    <Text className="text-gray-400 text-lg">
                        {media?.year}
                        <Text className="text-gray-200 text-md"> • </Text>
                        <Text className="flex flex-row">
                            {media?.score ? (
                                [...Array(5)].map((_, i) => {
                                return (
                                    <Icon
                                        key={i}
                                        name={i < media.score ? "star" : "star-o"}
                                        size={15}
                                        color= "orange"
                                    />
                                )
                            })
                            ) : null}
                        </Text>
                        </Text>
                    <Text className="text-gray-400 text-md">
                        {
                            media?.genres.map((genre, index) => {
                                return genre.name + (index < media.genres.length - 1 ? " • " : "")
                            })
                        }
                    </Text>
                    <TouchableOpacity className="mt-3" style = {{width:25}}>
                        <Icon
                            name={isFavorite ? "bookmark" : "bookmark-o"}
                            color={isFavorite ? "orange" : "white"}
                            size={25}
                            onPress={() => setIsFavorite(!isFavorite)}
                        />
                    </TouchableOpacity>
                </View>
            </View>
            <Text className="text-gray-200 text-md m-2">{media?.overview}</Text>
            <Text className="text-gray-200 text-md m-2">Cast: {media?.cast.map((actor, index) => {
                return actor + (index < media.cast.length - 1 ? ", " : "")
            })}</Text>
        </ScrollView>
    )
}