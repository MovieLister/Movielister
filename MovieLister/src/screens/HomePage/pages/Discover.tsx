import { Text, TouchableOpacity, View, ScrollView, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import Icon from 'react-native-vector-icons/FontAwesome5'
import React, {useEffect} from "react"
import { api } from "../../../helpers/api"
import { UserFront } from "../../../../../server/src/db/schema"
import { Dimensions } from "react-native"
import axios from "axios"
import Animated, { FadeInLeft } from "react-native-reanimated"
import { Image } from "react-native"
import type { Media } from "./Search"

const {width, height} = Dimensions.get('window')

export default function Discover({navigation} : {navigation: any}) {
    const [user, setUser] = React.useState<UserFront>()
    const [similarFavourites, setSimilarFavourites] = React.useState<any[]>([])
    const [loading, setLoading] = React.useState(true)
    const [loadingMedia, setLoadingMedia] = React.useState("hidden")
    const called = React.useRef(false)

    const getActualUser = async () => {
        try{
            const user = await api.post("/users/getSelfUser")
            setUser(user.data)
            console.log("USER POST: ", user)
            return user.data
        }
        catch(error){
            console.log(JSON.stringify(error))
        }
    }

    const GetSimilarFavourites = async (favourites: string[]) => {
        let similarFavourites: any[] = []
        let similarFavourite: any
        for(let i = 0; i < favourites.length; i++){
            const rand = Math.random()
            if(rand < 0.5){
                try{
                    similarFavourite = await axios.get(`https://api.themoviedb.org/3/tv/${favourites[i]}/similar?api_key=ea43a2cafc528f04d5518b96b1ac4ad2`)
                    //add the first 7 similar favourites to the list and add on each one of them the property "type" with the value "tv"
                    similarFavourites = [...similarFavourites, ...similarFavourite.data.results.slice(0, 7).map((favourite: any) => {
                        return {...favourite, type: "Serie"}
                    })]
                }
                catch(error){
                    try{
                        similarFavourite = await axios.get(`https://api.themoviedb.org/3/movie/${favourites[i]}/similar?api_key=ea43a2cafc528f04d5518b96b1ac4ad2`)
                        //add the first 7 similar favourites to the list and add on each one of them the property "type" with the value "movie"
                        similarFavourites = [...similarFavourites, ...similarFavourite.data.results.slice(0, 7).map((favourite: any) => {
                            return {...favourite, type: "Movie"}
                        })]
    
                    }
                    catch(error){
                        
                        console.log(error)
                    }
                    console.log(error)
                }
            }
            else{
                try{
                    similarFavourite = await axios.get(`https://api.themoviedb.org/3/movie/${favourites[i]}/similar?api_key=ea43a2cafc528f04d5518b96b1ac4ad2`)
                    similarFavourites = [...similarFavourites, ...similarFavourite.data.results.slice(0, 7).map((favourite: any) => {
                        return {...favourite, type: "Movie"}
                    })]
                }
                catch(error){
                    try{
                        similarFavourite = await axios.get(`https://api.themoviedb.org/3/tv/${favourites[i]}/similar?api_key=ea43a2cafc528f04d5518b96b1ac4ad2`)
                        similarFavourites = [...similarFavourites, ...similarFavourite.data.results.slice(0, 7).map((favourite: any) => {
                            return {...favourite, type: "Serie"}
                        })]
                    }
                    catch(error){
                        console.log(error)
                    }
                    console.log(error)
                }
            }
        }
        console.log(similarFavourites[0])
        // pick 7 random favourites from the list of similar favourites, without picking the same favourite twice
        similarFavourites = similarFavourites.sort(() => Math.random() - 0.5).slice(0, 7)
        setSimilarFavourites(similarFavourites)
        setLoading(false)
    }

    const loadMediaDetails = async (favourite: any) => {
        let media : Media
        let searchId : string
        setLoadingMedia("")
        if(favourite.type === "Movie"){
            searchId = "movie/" + favourite.id
        }
        else{
            searchId = "tv/" + favourite.id
        }
        const options = {
            method: 'GET',
            url: 'https://streaming-availability.p.rapidapi.com/get',
            params: {
              tmdb_id: searchId
            },
            headers: {
              'X-RapidAPI-Key': '34e6333532msh483d7ba656aab5ep19aad0jsn4e0c708ddd57',
              'X-RapidAPI-Host': 'streaming-availability.p.rapidapi.com'
            }
        }
        try {
            const response = await axios.request(options);
            console.log(response.data.result);
            media = response.data.result
            try {
                const response = await axios.get("https://www.omdbapi.com/?i=" + media.imdbId + "&apikey=f6ca6b5c");
                const data : {
                  Poster: string,
                  Runtime: string,
                } = response.data;
  
                const tmdbResponse = await axios.get("https://api.themoviedb.org/3/find/" + media.imdbId + "?api_key=ea43a2cafc528f04d5518b96b1ac4ad2&external_source=imdb_id");
                let tmdbData : {
                  backdrop_path: string,
                  overview: string,
                  vote_average: number
                  release_date: string
                }
                if(tmdbResponse.data.movie_results.length > 0){
                    tmdbData = tmdbResponse.data.movie_results[0];
                } else {
                    tmdbData = tmdbResponse.data.tv_results[0];
                }
                tmdbData.vote_average = Math.floor(tmdbData.vote_average / 2);
                media = {
                    ...media,
                    poster: data.Poster,
                    score: tmdbData.vote_average,
                    duration: parseInt(data.Runtime),
                    actors: [],
                    backdrop: "https://image.tmdb.org/t/p/original" + tmdbData.backdrop_path,
                    overview: tmdbData.overview,
                    tmdbId: media.tmdbId,
                    releaseDate: tmdbData.release_date
                }
                
              } catch (error) {
                console.log("second request failed");
                console.error(error);
              }
              setLoadingMedia("hidden")
              navigation.navigate("MediaDetail", {media: media})
        } catch (error) {
            console.log("first request failed")
            setLoadingMedia("hidden")
            console.error(error);
        }
    }

    useEffect(() => {
        if(called.current) return
        called.current = true
        getActualUser().then((user) => {
            console.log(user)
            GetSimilarFavourites(user.favourites)
        })
    }, [])
    
    return (
        <View className = "h-full w-full absolute bg-neutral-800" >
            <View className={"w-full h-full absolute bg-black justify-center items-center opacity-70 z-20 " + loadingMedia}>
                <View className = "w-full flex items-center justify-center">
                    <ActivityIndicator size="large" color="orange" />
                </View>
            </View>
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
            <ScrollView className="mb-20 mt-8 w-full">
                <View className="flex items-center">
                    {!loading ? (
                        <>
                            {similarFavourites.length > 0 ? (similarFavourites.map((favourite, index) => {
                                return (
                                    <TouchableOpacity key={index} onPress={() => loadMediaDetails(favourite)}>
                                        <Animated.View className="flex flex-row bg-neutral-700 rounded-xl my-1 px-2 py-1" style={{width: width * 0.93}} entering={FadeInLeft.delay(200*index).duration(400).springify()}>
                                            <View className="mt-1">
                                                {favourite.backdrop_path ? (
                                                    <Image source={{uri: "https://image.tmdb.org/t/p/original" + favourite.poster_path}} style={{width: width*0.27, height: height * 0.18}} className="rounded-lg flex"/>
                                                ) : (
                                                    <>
                                                        {favourite.poster_path? (
                                                            <Image source={{uri: "https://image.tmdb.org/t/p/original" + favourite.poster_path}} style={{width: width*0.27, height: height * 0.18}} className="rounded-lg flex"/>
                                                        ) : (
                                                            <Image source = {require("../../../../assets/placeholder.jpg")} style={{width: width*0.27, height: height * 0.18}} className="rounded-lg flex"/>
                                                        )}
                                                    </>
                                                )}
                                            </View>
                                            <View className="mx-2" style={{width: width * 0.52}}>
                                                <Text className="text-gray-200 text-lg font-bold tracking-wider" numberOfLines={2}>
                                                    {favourite.name? (favourite.name) : favourite.title}
                                                </Text>
                                                <Text className="text-gray-400 text-base font-bold" numberOfLines={1}>{favourite.type}</Text>
                                                <Text className="text-gray-400 text-sm" numberOfLines={3}>{favourite.overview}</Text>
                                            </View>
                                        </Animated.View>
                                    </TouchableOpacity>
                                )
                            }))
                            : (
                            <Text className="mt-5 text-lg text-center" style={{width: width * 0.9}}>Add something to your favourites to see the suggestions</Text>
                            )}
                        </>
                        
                    ) : (
                        <>
                            <View className = "w-full flex items-center justify-center">
                                <ActivityIndicator size="large" color="orange" />
                            </View>
                        </>
                    )}
                </View>
            </ScrollView>
        </View>
    )
}
