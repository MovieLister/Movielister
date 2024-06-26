import { ActivityIndicator, Dimensions, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors } from "react-native/Libraries/NewAppScreen";
import * as streamingAvailability from "streaming-availability";
import Animated, { FadeInLeft, FadeInUp } from "react-native-reanimated";
import { Image } from "react-native-elements";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";
import Config from "react-native-config";
import { release } from "os";

export type Media = streamingAvailability.Show &
{
    trailer?: string,
    poster?: string,
    score?: number,
    backdrop?: string,
    duration?: number,
    actors?: {
        name: string,
        imagePath: string
    }[],
    overview?: string,
    tmdbId?: number,
    releaseDate?: string
}

const {width, height} = Dimensions.get('window')


export default function Search({navigation} : {navigation: any}) {

    const [medias, setMedias] = React.useState<Media[]>([])
    const [title, setTitle] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)
    const [error, setError] = React .useState(false)
    const [errorMessage, setErrorMessage] = React.useState("")

    
    const client = new streamingAvailability.DefaultApi(new streamingAvailability.Configuration({apiKey: Config.RAPID_API_KEY}));

    const country = "it";

    async function getMedias(){
        if(title == ""){
            setMedias([]);
            return;
        }
        setIsLoading(true);
        try {
          const movies = await client.searchByTitle({
            title: title,
            country: country,
            showType: streamingAvailability.SearchByFiltersShowTypeEnum.All
          });
          console.log(movies.result)
        
          const filteredMedias = movies.result.filter((media) => media.streamingInfo[country] != undefined);
          const newMedias : Media[] = [];
          for (let i = 0; i < filteredMedias.length; i++){
            try {
              const response = await axios.get("https://www.omdbapi.com/?i=" + filteredMedias[i].imdbId + "&apikey=f6ca6b5c");
              const data : {
                Poster: string,
                Runtime: string,
              } = response.data;

              const tmdbResponse = await axios.get("https://api.themoviedb.org/3/find/" + filteredMedias[i].imdbId + "?api_key=ea43a2cafc528f04d5518b96b1ac4ad2&external_source=imdb_id");
              let tmdbData : {
                backdrop_path: string,
                overview: string,
                vote_average: number,
                release_date: string
              }
              if(tmdbResponse.data.movie_results.length > 0){
                  tmdbData = tmdbResponse.data.movie_results[0];
              } else {
                  tmdbData = tmdbResponse.data.tv_results[0];
              }
              tmdbData.vote_average = Math.floor(tmdbData.vote_average / 2);
              newMedias.push({
                ...filteredMedias[i],
                poster: data.Poster,
                score: tmdbData.vote_average,
                duration: parseInt(data.Runtime),
                actors: [],
                backdrop: "https://image.tmdb.org/t/p/original" + tmdbData.backdrop_path,
                overview: tmdbData.overview,
                tmdbId: filteredMedias[i].tmdbId,
                releaseDate: tmdbData.release_date
              })
              
            } catch (error) {
              console.log("second request failed");
              setError(true)
              setErrorMessage(JSON.stringify(error))
            }
          }
        setMedias(newMedias);
          
          setIsLoading(false);
        } catch (error) {
          console.log("first request failed");
          console.error(error);
          setError(true)
          setErrorMessage(JSON.stringify(error))
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
                    placeholder="Search for movies or tv series"
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
                                            <TouchableOpacity onPress={() => navigation.push("MediaDetail", {media: media})}>
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
                                                                name={i < media.score! ? "star" : "star-o"}
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
                <Text>{errorMessage}</Text>
            </ScrollView>
        </View>
    )
}
