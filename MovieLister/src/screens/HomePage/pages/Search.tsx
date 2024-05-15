import { ActivityIndicator, Dimensions, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors } from "react-native/Libraries/NewAppScreen";
import * as streamingAvailability from "streaming-availability";
import Animated, { FadeInLeft, FadeInUp } from "react-native-reanimated";
import { Image } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

export type Media = streamingAvailability.Show & {trailer?: string, poster?: string, score?: number, backdrop?: string}

const {width, height} = Dimensions.get('window')


export default function Search({navigation} : {navigation: any}) {

    const [medias, setMedias] = React.useState<Media[]>([])
    const [title, setTitle] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)

    const RAPID_API_KEY = "34e6333532msh483d7ba656aab5ep19aad0jsn4e0c708ddd57";
    const client = new streamingAvailability.DefaultApi(new streamingAvailability.Configuration({apiKey: RAPID_API_KEY}));

    const country = "it";

    async function getMedias(){
        setIsLoading(true);
        try {
          const movies = await client.searchByTitle({
            title: title,
            country: country,
            showType: streamingAvailability.SearchByFiltersShowTypeEnum.All
          });
        
          setMedias([]);
          const filteredMedias = movies.result.filter((media) => media.streamingInfo[country] != null);
        
          for (let i = 0; i < 1; i++){
            const options = {
              method: 'GET',
              url: 'https://mdblist.p.rapidapi.com/',
              params: { i: filteredMedias[i].imdbId },
              headers: {
                'X-RapidAPI-Key': '34e6333532msh483d7ba656aab5ep19aad0jsn4e0c708ddd57',
                'X-RapidAPI-Host': 'mdblist.p.rapidapi.com'
              }
            };
            try {
              const response = await axios.request(options);
              const data : {
                poster: string
                trailer: string
                backdrop: string
              } = response.data;
              data.trailer = data.trailer.replace("watch?v=", "embed/");
              //teke the trailer id which is the one after the embed/ part of the url
              const trailerId = data.trailer.split("embed/")[1];

              setMedias((prevMedias) => [
                ...prevMedias,
                { ...filteredMedias[i], trailer: data.trailer + "?controls=0&autoplay=1&loop=1&playlist=" + trailerId + "&iv_load_policy=3&modestbranding=1", poster: data.poster, score: Math.floor(Math.random() * 5) + 1, backdrop: data.backdrop}
              ]);
        
              await new Promise(resolve => setTimeout(resolve, 1500)); // Attesa di 1 secondo prima di procedere con la prossima iterazione a causa dell'api
            } catch (error) {
              console.log("second request failed");
              console.error(error);
            }
          }
          
          setIsLoading(false);
        } catch (error) {
          console.log("first request failed");
          console.error(error);
        }
        
    }

    useEffect(() => {
        //getMedias()
    }, [])

    return (
        <View className = "h-full w-full absolute bg-neutral-800 items-center">
            <SafeAreaView className = "z-20 w-full flex-row items-center px-4 mt-3">
                <TouchableOpacity className = " w-1/6  rounded-xl p-1" onPress={() => navigation.goBack()}>
                    <Icon
                        name="arrow-left"
                        color={"orange"}
                        size={25}
                    />
                    
                </TouchableOpacity>
                <View className="w-4/6 items-center">
                    <Text className="text-white font-bold text-2xl">Search</Text>
                </View>
            </SafeAreaView>
            <View className = "flex flex-row w-5/6 rounded-xl items-center bg-gray-300 my-5">
                <View className = "w-1/6 rounded-xl items-center">
                    <Icon 
                        name="search"
                        color = {Colors.dark}
                        size={25}
                    />
                </View>
                <TextInput
                    className = "w-5/6 text-neutral-800"
                    placeholder="Search for a movie"
                    placeholderTextColor={"gray"}
                    onChangeText={(text) => setTitle(text)}
                    onSubmitEditing={() => getMedias()}
                />
            </View>
            <ScrollView className="mb-20 w-full ">
                <View className = "flex flex-col items-start w-full text-2xl justify-center ">
                    {isLoading ? (
                        <>
                            <View className = "w-full flex items-center justify-center">
                                <ActivityIndicator size="large" color="orange" />
                            </View>
                        </>
                        
                    ) : (
                        <View className = "w-full flex-row flex-wrap space-y-3 items-center justify-center ">
                            {medias.map((media, index) => {
                                return (
                                        <Animated.View key={index} style={{width:width/3.5}} className="rounded-xl m-1 flex flex-col justify-between" entering={FadeInUp.delay(index * 100).duration(400).springify()}>
                                            <TouchableOpacity onPress={() => navigation.push("MovieDetail", {media: media})}>
                                                <View className="w-5/6 m-2">
                                                    <Image source={{uri: media.poster}}  style={{aspectRatio: 9/13}} className = "w-full rounded-xl"/>
                                                </View>
                                            </TouchableOpacity>   
                                            <View className="flex flex-col items-center px-2">
                                                <Text className="text-white text-xl w-full" numberOfLines={1} >{media.title}</Text>
                                                <Text className="text-gray-400 text-sm w-full" numberOfLines={1} >
                                                    {media.type == streamingAvailability.SearchByFiltersShowTypeEnum.Movie ? media.year : media.firstAirYear} - {media.type == "movie" ? "Movie" : "Serie"}</Text>
                                                <View className="flex flex-row w-full">
                                                    {media.score ? (
                                                        [...Array(5)].map((_, i) => {
                                                        return (
                                                            <Icon
                                                                key={i}
                                                                name={i < media.score ? "star" : "star-o"}
                                                                size={13}
                                                                color= "orange"
                                                            />
                                                        )
                                                    })
                                                    ) : null}
                                                </View>
                                            </View>
                                        </Animated.View>
                                )
                            })}
                        </View>
                    )}
                </View>
            </ScrollView>
        </View>
    )
}