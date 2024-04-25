import { ActivityIndicator, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";
import React, { useEffect } from "react";
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors } from "react-native/Libraries/NewAppScreen";
import * as streamingAvailability from "streaming-availability";
import Animated, { FadeInLeft, FadeInUp } from "react-native-reanimated";
import { Image } from "react-native-elements";

type Media = streamingAvailability.Show & {trailer?: string, poster?: string, score?: number}

export default function Search() {

    const [medias, setMedias] = React.useState<Media[]>([])
    const [title, setTitle] = React.useState("")
    const [isLoading, setIsLoading] = React.useState(false)

    const RAPID_API_KEY = "34e6333532msh483d7ba656aab5ep19aad0jsn4e0c708ddd57";
    const client = new streamingAvailability.DefaultApi(new streamingAvailability.Configuration({apiKey: RAPID_API_KEY}));

    const country = "it";
    const showType = streamingAvailability.SearchByFiltersShowTypeEnum.Movie;

    async function getMedias(){
        setIsLoading(true);
        try {
          const response = await client.searchByTitle({
            title: title,
            country: country,
            showType: showType
          });
        
          setMedias([]);
          const filteredMedias = response.result.filter((media) => media.streamingInfo[country] != null);
        
          for (let i = 0; i < filteredMedias.length; i++){
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
              //const response = await axios.request(options);
              //const data = response.data;

              setMedias((prevMedias) => [
                ...prevMedias,
                { ...filteredMedias[i], trailer: "", poster: "https://image.tmdb.org/t/p/original/s2xcqSFfT6F7ZXHxowjxfG0yisT.jpg", score: Math.floor(Math.random() * 5) + 1}
              ]);
        
              //await new Promise(resolve => setTimeout(resolve, 1500)); // Attesa di 1 secondo prima di procedere con la prossima iterazione a causa dell'api
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
            <View className = "flex flex-row items-center mt-5">
                <View className = "w-1/6 pl-3 items-start ">
                    <Icon
                        name="arrow-left"
                        color={"orange"}
                        size={25}
                    />
                </View>
                <View className = "w-4/6 items-center">
                    <Text className="text-white text-2xl">Search</Text>
                </View>
                <View className = "w-1/6 items-end pr-3">
                   
                </View>
            </View>

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
                                        <Animated.View key={index} className="w-28 rounded-xl m-1 flex flex-col justify-between" entering={FadeInUp.delay(index * 100).duration(400).springify()}>
                                            <TouchableOpacity onPress={() => console.log(media)}>
                                                <View className="w-5/6 m-2">
                                                    <Image source={{uri: media.poster}} className = "w-full h-36 rounded-xl"/>
                                                </View>
                                            </TouchableOpacity>   
                                            <View className="w-28 flex flex-col items-center px-2 ">
                                                <Text className="text-white text-xl w-full" numberOfLines={1} >{media.title}</Text>
                                                <Text className="text-gray-400 text-sm w-full" numberOfLines={1} >{media.year}</Text>
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