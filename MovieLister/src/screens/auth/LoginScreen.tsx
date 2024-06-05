import { View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native'
import React from 'react'
import Animated, { FadeInDown, FadeInUp, FadeOutDown, FadeOutUp } from 'react-native-reanimated';
import { AxiosError, AxiosResponse } from 'axios';
import { api } from "../../helpers/api"
import Config from 'react-native-config';

export default function LoginScreen({navigation} : {navigation: any}) {
    const [formData, setFormData] = React.useState({
        email: '',
        password: ''
    })

    const [errorViewHidden, setErrorViewHidden] = React.useState("hidden")
    const [errorText, setErrorText] = React.useState('')

    const handleLogin = async () => {
        api.post(`/auth/login`, formData).then((result: AxiosResponse) => {
            api.defaults.headers.common['Authorization'] = `Bearer ${result.data.data.jwt}`
            navigation.push('HomePage')
        })
        .catch((error: AxiosError<{error: string}>) => { 
            setErrorText(error.response?.data.error ?? "")
            setErrorViewHidden("")
        })
    }

    return (
        <View className="bg-white h-full w-full">
            <StatusBar hidden />
            <Animated.Image className = "h-full w-full absolute" source={require('../../../assets/background2.jpg')} />

            {/* Title and form */}
            <Animated.View className = "h-full w-full flex justify-around pb-10">
                
                <View className = "flex items-start mx-4 h-1/2">
                    {/* Title */}
                    <Animated.View entering={FadeInUp.duration(800).springify()} exiting={FadeOutUp.duration(800)} className = "flex items-start mt-20">
                        <Text className = "text-5xl font-bold text-amber-600 tracking-wider">
                            Login
                        </Text>
                    </Animated.View>
                </View>
                <View className = " h-1/2 flex items-center pt-4 mx-4 space-y-3 pb-7">
                    {/* Form */}
                    <Animated.View entering={FadeInDown.delay(100).duration(800).springify()} className = "bg-black/40 p-2 rounded-2xl w-full">
                        <TextInput
                            placeholder='Email'
                            placeholderTextColor={'black'}
                            value={formData.email}
                            onChangeText={(text) => {setFormData({...formData, email: text})}}
                        />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(200).duration(800).springify()}  className = "bg-black/40 p-2 rounded-2xl w-full">
                        <TextInput
                            placeholder='Password'
                            placeholderTextColor={'black'}
                            secureTextEntry
                            value={formData.password}
                            onChangeText={(text) => {setFormData({...formData, password: text})}}
                        />
                    </Animated.View>
                    <View className = {"flex-row items-center " + errorViewHidden} >
                        <Text className = "text-red-600 font-bold">{errorText}</Text>
                    </View>
                    <Animated.View entering={FadeInDown.delay(300).duration(800).springify()} exiting={FadeOutDown.delay(300).duration(800)} className = "w-full">
                        <TouchableOpacity className = "bg-neutral-700 p-3 rounded-2xl"  onPress={() => handleLogin()}>
                            <Text className = "text-neutral-200 text-center font-bold text-xl">Login</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(400).duration(800).springify()} exiting={FadeOutDown.delay(400).duration(800)} className = "flex-row items-center mb-5">
                        <Text className = "text-black">Don't have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.push('Signup')}>
                            <Text className = "text-neutral-200"> Sign up</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Animated.View>
        </View >
    )
}
