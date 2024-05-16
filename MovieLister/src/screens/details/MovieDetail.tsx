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
import axios from "axios"

const {width, height} = Dimensions.get('window')

export default function MovieDetail({route, navigation} : {route: any, navigation: any}) {
    const [isFavorite, setIsFavorite] = React.useState(false)
    const [media, setMedia] = React.useState<Media>()
    const [trailerVisible, setTrailerVisible] = React.useState(false)

    const setMovieTrailer = async (id: string) => {
        const options = {
            method: 'GET',
            url: 'https://mdblist.p.rapidapi.com/',
            params: { i: id },
            headers: {
              'X-RapidAPI-Key': '34e6333532msh483d7ba656aab5ep19aad0jsn4e0c708ddd57',
              'X-RapidAPI-Host': 'mdblist.p.rapidapi.com'
            }
        };
        try {
            const response = await axios.request(options);
            const data : {
                trailer: string,
                backdrop: string
            } = response.data;
            data.trailer = data.trailer.replace("watch?v=", "embed/");
            const trailerId = data.trailer.split("embed/")[1];
            route.params.media.trailer = data.trailer + "?controls=0&autoplay=1&loop=1&playlist=" + trailerId + "&iv_load_policy=3&modestbranding=1";
            route.params.media.backdrop = data.backdrop
        } catch (error) {
            console.error(error);
        }
        setMedia(route.params.media)
    }

    const setActorImage = async (actor: string) => {
        try{
            const actors = await axios.get("https://api.tmdb.org/3/search/person?api_key=ea43a2cafc528f04d5518b96b1ac4ad2&query=" + actor)
            route.params.media.actors.push({name: actor, imagePath: "https://image.tmdb.org/t/p/original" + actors.data.results[0].profile_path})
        } catch (error){
            console.log(error)
        }
        setMedia(route.params.media)
    }

    useEffect(() => {
        setMovieTrailer(route.params.media.imdbId)
        setTimeout(() => {
            setTrailerVisible(true)
        }, 2000)
        route.params.media.actors = []
        route.params.media.cast.forEach(async (actor : string) => {
            await setActorImage(actor)
        })
        setMedia(route.params.media)
        
    }, [])

    return (
        <View className = "bg-neutral-900 flex pb-1">
            <SafeAreaView className = "absolute z-20 w-full flex-row justify-between items-center px-4 mt-3">
                <TouchableOpacity className = "rounded-xl p-1" onPress={() => navigation.goBack()}>
                    <Icon
                        name="arrow-left"
                        color={"orange"}
                        size={25}
                    />
                </TouchableOpacity>
            </SafeAreaView>
            <ScrollView>
                <View className = "w-full">
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
                                            size={18}
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
                        <Text className="text-gray-400 text-md">
                            {media?.duration} min
                        </Text>
                        <TouchableOpacity className="mt-2" style = {{width:25}}>
                            <Icon
                                name={isFavorite ? "bookmark" : "bookmark-o"}
                                color={isFavorite ? "orange" : "white"}
                                size={25}
                                onPress={() => setIsFavorite(!isFavorite)}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                <Text style={{fontFamily: 'sans-serif-light'}} className="text-gray-200 text-lg m-2">{media?.overview}</Text>
                    
                {/* Cast */}
                <View className="flex flex-row justify-between p-2">
                    <Text className="text-gray-200 text-lg font-bold">Cast</Text>
                    <TouchableOpacity>
                        <Text className="text-gray-400 text-md">See all</Text>
                    </TouchableOpacity>
                </View>
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="flex flex-row p-2">
                    {media?.actors?.map((actor, index) => {
                        return (
                            <View key={index} className="flex flex-col items-center mx-2">
                                <Image source={{uri: actor.imagePath}} style={{width: width*0.2, aspectRatio: 1}} className="rounded-full"/>
                                <Text className="text-gray-200 text-md">{actor.name}</Text>
                            </View>
                        )
                    })}
                </ScrollView>

                {/* Streaming Availability */}
                <View className="flex flex-row justify-between p-2">
                    <Text className="text-gray-200 text-lg font-bold">Streaming Availability</Text>
                    <TouchableOpacity>
                        <Text className="text-gray-400 text-md">See all</Text>
                    </TouchableOpacity>
                </View>
                <Text className="text-gray-200 text-md m-2">Available on:</Text>
                <Text className="text-gray-200 text-md m-2">Not available on:</Text>
                <Text className="text-gray-200 text-md m-2">Rent or buy:</Text>
                <Text className="text-gray-200 text-md m-2">Free with ads:</Text>
                <Text className="text-gray-200 text-md m-2">Free with subscription:</Text>
            </ScrollView>

        </View>

    )
}