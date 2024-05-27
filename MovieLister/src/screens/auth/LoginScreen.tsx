import { View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native'
import React from 'react'
import Animated, { FadeInDown, FadeInUp, FadeOutDown, FadeOutUp } from 'react-native-reanimated';
import axios, { AxiosError, AxiosResponse } from 'axios';

export default function LoginScreen({navigation} : {navigation: any}) {
    const [formData, setFormData] = React.useState({
        email: '',
        password: ''
    })

    const [errorViewHidden, setErrorViewHidden] = React.useState("hidden")
    const [errorText, setErrorText] = React.useState('')

    const handleLogin = async () => {
        console.log(formData)
        axios.post(`http://192.168.116.8:3000/auth/login`, formData).then((result: AxiosResponse) => {
            console.log(result.status)
            navigation.push('HomePage')
        })
        .catch((error: AxiosError) => {
            setErrorText(error.response?.data.message)
            setErrorViewHidden("")
        })
    }

    return (
        <View className = "bg-white h-full w-full">
            <StatusBar hidden />
            <Animated.Image className = "h-full w-full absolute" source={require('../../../assets/background.jpg')} />
            
            {/* Title and form */}
            <Animated.View className = "h-full w-full flex justify-around pb-10">
                
                <View className = "flex items-center h-2/5">
                    {/* Title */}
                    <Animated.View entering={FadeInUp.duration(800).springify()} exiting={FadeOutUp.duration(800)} className = "flex items-center mt-40">
                        <Text className = "text-5xl font-bold text-sky-500 tracking-wider">
                            Login
                        </Text>
                    </Animated.View>
                </View>
                <View className = " h-3/5 flex items-center mx-4 space-y-4 pb-7">
                    {/* Form */}
                    <Animated.View entering={FadeInDown.delay(100).duration(800).springify()} className = "bg-black/5 p-2 rounded-2xl w-full">
                        <TextInput
                            placeholder='Email'
                            placeholderTextColor={'gray'}
                            value={formData.email}
                            onChangeText={(text) => {setFormData({...formData, email: text})}}
                        />
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(200).duration(800).springify()}  className = "bg-black/5 p-2 rounded-2xl w-full">
                        <TextInput
                            placeholder='Password'
                            placeholderTextColor={'gray'}
                            secureTextEntry
                            value={formData.password}
                            onChangeText={(text) => {setFormData({...formData, password: text})}}
                        />
                    </Animated.View>
                    <View className = {"flex-row items-center m-1 " + errorViewHidden} >
                        <Text className = "text-red-500">{errorText}</Text>
                    </View>
                    <Animated.View entering={FadeInDown.delay(300).duration(800).springify()} exiting={FadeOutDown.delay(300).duration(800)} className = "w-full">
                        <TouchableOpacity className = "bg-sky-400 p-3 rounded-2xl mb-2"  onPress={() => handleLogin()}>
                            <Text className = "text-white text-center font-bold text-xl">Login</Text>
                        </TouchableOpacity>
                    </Animated.View>
                    <Animated.View entering={FadeInDown.delay(400).duration(800).springify()} exiting={FadeOutDown.delay(400).duration(800)} className = "flex-row items-center mb-5">
                        <Text className = "text-black">Don't have an account?</Text>
                        <TouchableOpacity onPress={() => navigation.push('Signup')}>
                            <Text className = "text-sky-500"> Sign up</Text>
                        </TouchableOpacity>
                    </Animated.View>
                </View>
            </Animated.View>
        </View >
    )
}