import { ActivityIndicator, Dimensions, ScrollView, Text, TextInput, TouchableOpacity, View, Linking } from "react-native"
import React, { useEffect } from "react"
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors } from "react-native/Libraries/NewAppScreen"
import * as streamingAvailability from "streaming-availability"
import Animated, { FadeIn, FadeInLeft, FadeInUp, StretchInY, ZoomIn, ZoomInEasyDown } from "react-native-reanimated"
import { Image } from "react-native-elements"
import { Media } from "../HomePage/pages/Search"
import { SafeAreaView } from "react-native-safe-area-context"
import LinearGradient from "react-native-linear-gradient"
import WebView from "react-native-webview"
import axios from "axios"
import LinkIcon, { StreamingServices } from "../../components/LinkIcon"
import DropDownPicker from "react-native-dropdown-picker"
import { act } from "react-test-renderer"
import { api } from "../../helpers/api"
import { UserFront } from "../../../../server/src/db/schema"
import { release } from "os"

const {width, height} = Dimensions.get('window')

type Season = {
    id: number,
    episodes: {
        id: number,
        name: string,
        overview: string,
        still_path: string,
        episodeNumber: number,
        seasonNumber: number,
        runtime: number
    }[]
}

type SeasonList = {
    label: string,
    value: number
}

export default function MediaDetail({route, navigation} : {route: any, navigation: any}) {
    const [user, setUser] = React.useState<UserFront>()
    const [isFavourite, setIsFavourite] = React.useState(false)
    const [media, setMedia] = React.useState<Media>(route.params.media)
    const [trailerVisible, setTrailerVisible] = React.useState(false)
    const [streamingServicesVisible, setStreamingServicesVisible] = React.useState(false)
    const [season, setSeason] = React.useState<Season>()
    const [actualSeasonNumber, setActualSeasonNumber] = React.useState(0)
    const [seasonList, setSeasonList] = React.useState<SeasonList[]>([])
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState(0);
    const [inCinema, setInCinema] = React.useState<boolean>()
    const called = React.useRef(false)
    const country = "it"

    const getActualUser = async () => {
        try{
            const response = await api.post("/users/getSelfUser")
            setUser(response.data)
            if(response.data.favourites.includes(media.tmdbId)){
                setIsFavourite(true)
            }
        }
        catch(error){
            console.log(error)
        }
    }
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
            let trailerId = ""
            const data : {
                trailer: string
            } = {trailer: response.data.trailer}
            if(data.trailer){
                data.trailer = data.trailer.replace("watch?v=", "embed/")
                trailerId = data.trailer.split("embed/")[1]
            }
            setMedia(prevMedia => ({
                ...prevMedia,
                trailer: !!data.trailer ? `${data.trailer}?controls=0&autoplay=1&loop=1&playlist=${trailerId}&iv_load_policy=3&modestbranding=1` : undefined
            }))
            if(data.trailer){
            setTimeout(() => {
                setTrailerVisible(true)
            }, 2500)
            }
            
        } catch (error) {
            console.error(error);
        }
    }

    const setActorImage = async (actor: string) => {
        setMedia(prevMedia => ({
            ...prevMedia,
            actors: []
        }))
        try{
            const actors = await axios.get("https://api.themoviedb.org/3/search/person?api_key=ea43a2cafc528f04d5518b96b1ac4ad2&query=" + actor)
            setMedia(prevMedia => ({
                ...prevMedia,
                actors: [...prevMedia.actors!, {name: actor, imagePath: actors.data.results[0]?.profile_path? "https://image.tmdb.org/t/p/original" + actors.data.results[0].profile_path : "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"}]
            }))
            route.params.media.actors.push({name: actor, imagePath: actors.data.results[0]?.profile_path? "https://image.tmdb.org/t/p/original" + actors.data.results[0].profile_path : "https://st3.depositphotos.com/6672868/13701/v/450/depositphotos_137014128-stock-illustration-user-profile-icon.jpg"})
        } catch (error){
            console.log(error)
        }
    }

    const removeStreamingDuplicates = () => {
        let unique : string[] = []
        let uniqueStreaming = media.streamingInfo[country]?.filter((streaming) => {
            if(unique.includes(streaming.service)){
                return false
            } else {
                unique.push(streaming.service)
                return true
            }
        })
        setMedia(prevMedia => ({
            ...prevMedia,
            streamingInfo: {
                ...prevMedia.streamingInfo,
                [country]: uniqueStreaming
            }
        }))
        setStreamingServicesVisible(true)
    }

    const removeEpisodesStreamingDuplicates = () => {
        const tempMedia = media
        tempMedia.seasons![actualSeasonNumber].episodes.forEach((episode, index) => {
            let unique : string[] = []
            let uniqueStreaming = episode.streamingInfo[country]?.filter((streaming) => {
                if(unique.includes(streaming.service)){
                    return false
                } else {
                    unique.push(streaming.service)
                    return true
                }
            })
            setMedia(prevMedia => ({
                ...prevMedia,
                seasons: prevMedia.seasons?.map((season, i) => {
                    if(i === actualSeasonNumber){
                        return {
                            ...season,
                            episodes: season.episodes.map((episode, j) => {
                                if(j === index){
                                    return {
                                        ...episode,
                                        streamingInfo: {
                                            ...episode.streamingInfo,
                                            [country]: uniqueStreaming?.sort((a, b) => {
                                                return a.service > b.service ? 1 : -1
                                            })
                                        }
                                    }
                                } else {
                                    return episode
                                }
                            })
                        }
                    } else {
                        return season
                    }
                })
            }))
        })
    }

    const getSeasonInfo = async (season_number : number) => {
        const season = await axios.get("https://api.themoviedb.org/3/tv/" + media.tmdbId + "/season/" + season_number + "?api_key=ea43a2cafc528f04d5518b96b1ac4ad2")
        setSeason(season.data)
    }

    const updateUsersFavourites = async () => {
        try{
            if(isFavourite){
                const response = await api.post("/users/removeFavourite", {favourite: media.tmdbId})
                console.log(response.data)
            }
            else{
                const response = await api.post("/users/addFavourite", {favourite: media.tmdbId})
                console.log(response.data)
            }
        }
        catch(error){
            console.log(error)
        }
    }

    useEffect(() => {
        if(called.current) return
        called.current = true
        getActualUser()
        setMovieTrailer(media.imdbId)
        route.params.media.cast.forEach(async (actor : string) => {
            setActorImage(actor)
        })
        removeStreamingDuplicates()
        if(media.type === streamingAvailability.ShowTypeEnum.Series){
            getSeasonInfo(1)
            setSeasonList([...Array(media.seasons!.length)].map((_, i) => {
                return {
                    label: "Season " + (i+1),
                    value: i
                }
            }))
            removeEpisodesStreamingDuplicates()
        }
        else{
            if(media.releaseDate){
                const releaseDate = new Date(media.releaseDate)
                const currentDate = new Date()
                console.log(releaseDate)
                if((currentDate.getTime() - releaseDate.getTime()) < 120 * 24 * 60 * 60 * 1000){
                    setInCinema(true)
                }
                
            }
        }
    }, [])

    useEffect(() => {
        if(media.type === streamingAvailability.ShowTypeEnum.Series){
            removeEpisodesStreamingDuplicates()
        }
    }, [actualSeasonNumber])

    useEffect(() => {
        console.log(media)
    }, [media])

    return (
        <SafeAreaView className = "bg-neutral-900 flex pb-1 min-h-full">
            <View className = "absolute z-20 w-full flex-row justify-between items-center px-4 mt-3">
                <TouchableOpacity className = "rounded-xl p-1" onPress={() => navigation.goBack()}>
                    <Icon
                        name="arrow-left"
                        color={"orange"}
                        size={25}
                    />
                </TouchableOpacity>
                <TouchableOpacity className="mt-2 ml-1 p-3" onPress={() => {
                    updateUsersFavourites()
                    setIsFavourite(!isFavourite)
                    }}>
                    <Icon
                        name={isFavourite ? "bookmark" : "bookmark-o"}
                        color={"orange"}
                        size={25}
                    />
                </TouchableOpacity>
            </View>
            <ScrollView nestedScrollEnabled={true}>
                <View className = "w-full">
                    <View className="rounded-xl bg-neutral-900">
                        <Animated.View style={{width: width, aspectRatio: 16/9, display: trailerVisible ? "flex" : "none"}}>
                        { 
                            media.trailer && (
                            <WebView
                            source={{uri: media.trailer}}
                            style={{width: width, aspectRatio: 16/9, }}
                            mediaPlaybackRequiresUserAction={false}
                            allowsInlineMediaPlayback={true}
                            javaScriptEnabled={true}
                            injectedJavaScript={`document.body.style.pointerEvents = 'none';`}
                            />
                        )}
                            
                        </Animated.View>
                        {!trailerVisible && (
                            <Image source={{uri: route.params.media.backdrop}} style={{width: width, aspectRatio: 16/9}}/>
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

                {/* Media Info */}
                <View style={{marginTop: -(height*0.01)}} className = "flex flex-row justify-between p-2">
                    <Image source={{uri: media?.poster}} style={{width: width*0.3, aspectRatio: 9/13}} className = " mx-2 rounded-xl"/>
                    <View className = "mx-1 flex flex-col" style={{width: width*0.6}}>
                        <Text className="text-gray-200 text-2xl font-bold tracking-wider" numberOfLines={3}>{media?.title}</Text>
                        <Text className="text-gray-400 text-lg">
                            {media.type === streamingAvailability.ShowTypeEnum.Movie ? media.year : media.firstAirYear}
                            <Text className="text-gray-200 text-md"> • </Text>
                            <Text className="flex flex-row">
                                {media?.score ? (
                                    [...Array(5)].map((_, i) => {
                                    return (
                                        <Icon
                                            key={i}
                                            name={i < media.score! ? "star" : "star-o"}
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
                        {
                            media?.duration ? (
                                <Text className="text-gray-400 text-md">
                                    {media?.duration} min
                                </Text>
                            ) : null
                        }
                        <View className="flex flex-row justify-between">
                            {streamingServicesVisible && (
                                <View className="flex flex-row">
                                    {
                                        media.streamingInfo[country]?.map((streaming, index) => {
                                            return (
                                                <LinkIcon key={index} href={streaming.link} service={streaming.service as StreamingServices} />
                                            )
                                        })
                                    }
                                </View>
                            
                            )}
                            { inCinema ? (
                                <View>
                                    <TouchableOpacity className="p-1" onPress={() => { navigation.navigate("MapDetail", {media: media})}}>
                                        <Icon name="map" size={height/30} color="orange"/>
                                    </TouchableOpacity>
                                </View>
                            ) : null}
                        </View>
                        
                    </View>
                </View>
                <Text style={{fontFamily: 'sans-serif-light'}} className="text-gray-200 text-lg mx-4 mt-1 text-justify">{media?.overview}</Text>
                {/* Cast */}
                <View className="flex flex-row px-4">
                    <Text className="text-gray-200 text-xl font-bold">Cast</Text>
                </View>
                
                <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} className="flex flex-row p-1">
                    {media?.actors?.map((actor, index) => {
                        return (
                            <View key={index} className="flex flex-col items-center mx-2">
                                <Image source={{uri: actor.imagePath}} style={{width: width*0.2, aspectRatio: 1}} className="rounded-full"/>
                                <Text className="text-gray-200 text-md">{actor.name}</Text>
                            </View>
                        )
                    })} 
                </ScrollView>
                
                {/* episodes of season 1 */}
                { media.type === streamingAvailability.ShowTypeEnum.Series && season ? (
                    <View className="mt-1">
                        <Text className="text-gray-200 text-xl mx-4 font-bold">Episodes</Text>
                        <View style={{width: width * 0.33}} className="mx-4 my-1">
                            <DropDownPicker
                                items={seasonList}
                                open={open}
                                value={value}
                                setOpen={setOpen}
                                setValue={setValue}
                                setItems={setSeasonList}
                                onChangeValue={(value) => {
                                    if(value === actualSeasonNumber) return
                                    if(value != undefined){
                                        setActualSeasonNumber(value)
                                        getSeasonInfo(value + 1)
                                    }
                                }}
                                theme="DARK"
                                listMode="SCROLLVIEW"
                            />
                        </View>
                        <View className="items-center">
                            <ScrollView className="flex flex-row">
                                {season?.episodes.map((episode, index) => {
                                    return (
                                        <Animated.View key={index} className="flex flex-row bg-neutral-800 rounded-xl my-1 px-2 py-1" style={{width: width * 0.93}} entering={FadeInLeft.delay(300*index).duration(500).springify()}>
                                            <View className="mt-1">
                                                {episode.still_path ? (
                                                    <Image source={{uri: "https://image.tmdb.org/t/p/original" + episode.still_path}} style={{width: width*0.35, height: height * 0.12}} className="rounded-lg flex"/>
                                                ) : (
                                                    <Image source = {require("../../../assets/placeholder.jpg")} style={{width: width*0.35, height: height * 0.12}} className="rounded-lg flex"/>
                                                )}
                                            </View>
                                            <View className="mx-2" style={{width: width * 0.52}}>
                                                <Text className="text-gray-200 text-lg font-bold tracking-wider">
                                                    {episode.name}
                                                    {episode.runtime ? (
                                                        <Text className="text-gray-200 text-md"> • <Text className="text-gray-500 text-base">{episode.runtime} min</Text></Text>
                                                    ) : null}
                                                </Text>
                                                <Text className="text-gray-400 text-sm" numberOfLines={3}>{episode.overview}</Text>
                                                <View className="flex flex-row justify-end">
                                                    { media.seasons![actualSeasonNumber].episodes[index]?.streamingInfo[country]?.map((streaming, index) => {
                                                        return (
                                                            <LinkIcon key={index} href={streaming.link} service={streaming.service as StreamingServices} />
                                                        )
                                                    })}
                                                </View>
                                            </View>
                                        </Animated.View>
                                    )
                                })}
                            </ScrollView>
                        </View>
                    </View>
                ) : null}
                
            </ScrollView>
        </SafeAreaView>

    )
}